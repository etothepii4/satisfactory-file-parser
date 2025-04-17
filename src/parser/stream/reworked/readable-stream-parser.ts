import { QueuingStrategy, ReadableStream, ReadableStreamDefaultController } from "stream/web";
import { UnsupportedVersionError } from '../../error/parser.error';
import { ChunkCompressionInfo } from "../../file.types";
import { Level } from '../../satisfactory/save/level.class';
import { ObjectReferencesList } from '../../satisfactory/save/object-references-list';
import { SatisfactorySave } from "../../satisfactory/save/satisfactory-save";
import { SatisfactorySaveHeader } from '../../satisfactory/save/satisfactory-save-header';
import { SaveCustomVersion } from '../../satisfactory/save/save-custom-version';
import { Grids, SaveBodyValidation, SaveReader } from '../../satisfactory/save/save-reader';

const DEFAULT_BYTE_HIGHWATERMARK = 1024 * 1024 * 200;	// 200MiB
const createStringLengthQueuingStrategy = (highWaterMark: number = DEFAULT_BYTE_HIGHWATERMARK / 4): QueuingStrategy<string> => ({
	highWaterMark,
	size: (chunk: string | undefined) => {
		if (chunk === undefined) {
			return 0;
		}
		return chunk.length;
	}
});

class SimpleWaitForConsumerLock {
	locked: boolean = false;
	unlockWasCalledInTheMeantime: boolean = false;
	executionFn: (() => void) | undefined = undefined;

	/** activate lock and set function to execute on unlock.
	 * If at least 1 unlock was called before this call, immediately unlock.
	 */
	public lock(executionFn: () => void) {
		this.executionFn = executionFn;
		this.locked = true;
		if (this.unlockWasCalledInTheMeantime) {
			this.unlock();
		}
	}

	/**
	 * unlock and execute stored function if present.
	 */
	public unlock() {
		this.locked = false;
		if (this.executionFn) {
			this.executionFn();
			this.executionFn = undefined;
		} else {
			this.unlockWasCalledInTheMeantime = true;
		}
	}
};

/**
 * Creates a ReadableStream from Binary file, that actually waits until the reading operator has caught up before it pushes more.
 */
export class ReadableStreamParser {

	private static CreateReadableStreamForParsingSave = (
		onStart: (controller: ReadableStreamDefaultController<string>) => void,
		onCancel: (reason: any) => void,
		onPullRequest: (desiredSize: number) => void,
		highWaterMark = DEFAULT_BYTE_HIGHWATERMARK / 4
	) => {
		let ourController: ReadableStreamDefaultController<string> | null = null;
		const stream = new ReadableStream<string>({
			start: (controller: ReadableStreamDefaultController<string>) => {
				ourController = controller;
				onStart(ourController);
			},
			pull: (controller: ReadableStreamDefaultController<string>) => {
				onPullRequest(ourController!.desiredSize ?? 1);
			},
			cancel: (reason) => {
				console.warn('parsing stream was canceled!', reason);
				if (ourController !== null) {
					ourController.close();
				}
				onCancel(reason);
			}
		}, createStringLengthQueuingStrategy(highWaterMark));

		// create handle to close source.
		const finish = () => {
			if (ourController !== null) {
				ourController?.close();
			}
		}

		return { stream, controller: ourController!, finish };
	};

	/**
	 * the more elegant way to parse saves, instead of using the plain ParseSave. Since streaming will not hold the converted JSON in memory at once.
	 * @param name the save name
	 * @param bytes the save file as UInt8Array
	 * @param onDecompressedSaveBody a callback to report back on the decompressed binary save body.
	 * @param onProgress a callback to report back on the parsing progress. Optionally contains a message.
	 * @returns a WHATWG compliant readable stream of strings (They are valid JSON and represent a {@link SatisfactorySave} object). And a method to actually start the streaming for more precise control.
	 */
	public static CreateReadableStreamFromSaveToJson = (
		name: string,
		bytes: ArrayBufferLike,
		options?: Partial<{
			onDecompressedSaveBody: (buffer: ArrayBufferLike) => void,
			onProgress: (progress: number, message?: string) => void
		}>
	) => {

		// create a simple lock to sync with consumer of the stream. Aka handle backpressure.
		const waitForConsumerLock = new SimpleWaitForConsumerLock();
		const waitForConsumer = async () => {
			return new Promise<void>((resolve, reject) => {
				waitForConsumerLock.lock(resolve);
			});
		}

		const { stream, controller, finish } = ReadableStreamParser.CreateReadableStreamForParsingSave(
			(controller) => {
				//startStreaming();
			},
			(reason) => { },
			(desiredSize) => {
				// consumer (to be more correct, the internal buffer!) is ready, unlock syncing lock.
				waitForConsumerLock.unlock();
			},
		);

		/**
		 * pushes a value into the readable stream. Optionally waits for the "pull" signal of the stream before writing.
		 * @param value the value to write
		 * @param waitForConsumerToBeReady whether the process should wait until the "pull" signal of the stream.
		 */
		const write = async (value: string, waitForConsumerToBeReady = true): Promise<void> => {
			if (waitForConsumerToBeReady) {
				await waitForConsumer();
			}
			controller.enqueue(value);
		}

		const startStreaming = async (): Promise<void> => {

			const reader = new SaveReader(bytes, options?.onProgress);

			// read header
			const header = SatisfactorySaveHeader.Parse(reader);
			const save = new SatisfactorySave(name, header);

			// guard save version
			const roughSaveVersion = SaveReader.GetRoughSaveVersion(header.saveVersion, header.saveHeaderType);
			if (roughSaveVersion === '<U6') {
				throw new UnsupportedVersionError('Game Version < U6 is not supported.');
			} else if (roughSaveVersion === 'U6/U7') {
				throw new UnsupportedVersionError('Game Version U6/U7 is not supported in this package version. Consider downgrading to the latest package version supporting it, which is 0.0.34');
			} else if (roughSaveVersion === 'U8') {
				throw new UnsupportedVersionError('Game Version U8 is not supported in this package version. Consider downgrading to the latest package version supporting it, which is 0.3.7');
			}

			// inflate chunks
			const inflateResult = reader.inflateChunks();

			// call callback on decompressed save body
			if (options?.onDecompressedSaveBody !== undefined) {
				options.onDecompressedSaveBody(reader.getBuffer());
			}

			// grid hash i guess
			const gridHash = reader.readSaveBodyHash();

			// parse grids
			const grids = reader.readGrids();

			await ReadableStreamParser.WriteHeaderAndGrids(write, name, reader.compressionInfo, header, grids, gridHash);

			// parse levels
			await ReadableStreamParser.ReadWriteLevels(write, reader, save.header.mapName, save.header.buildVersion);

			if (options?.onProgress !== undefined) {
				options.onProgress(1, 'finished parsing.');
			}

			// close the levels and save object.
			await write(`}}`,);
			finish();
		};

		return { stream, startStreaming };
	}


	private static WriteHeaderAndGrids = async (
		write: (value: string, waitTilConsumingEndIsReady?: boolean) => Promise<void>,
		name: string,
		compressionInfo: ChunkCompressionInfo,
		header: SatisfactorySaveHeader,
		grids: Grids,
		gridHash: SaveBodyValidation
	) => {
		return write(`{"header": ${JSON.stringify(header)}, "name": "${name}", "compressionInfo": ${JSON.stringify(compressionInfo)}, "gridHash": ${JSON.stringify(gridHash)}, "grids": ${JSON.stringify(grids)}, "levels": {`, false);
	}

	private static async ReadWriteLevels(
		write: (value: string, waitTilConsumingEndIsReady?: boolean) => Promise<void>,
		reader: SaveReader,
		mapName: string,
		buildVersion: number,
	): Promise<void> {

		const batchingSizeOfObjects = 1000;
		const thresholdOfWrittenObjectsUntilWaitingForConsumerAgain = 3 * batchingSizeOfObjects;

		const levelCount = reader.readInt32();
		reader.onProgressCallback(reader.getBufferProgress(), `reading pack of ${levelCount + 1} levels.`);

		let writtenTotalObjectsSinceConsumerSync = 0;
		for (let j = 0; j <= levelCount; j++) {
			let levelName = (j === levelCount) ? '' + mapName : reader.readString();

			console.log('reading level', levelName);

			if (j % 500 === 0) {
				reader.onProgressCallback(reader.getBufferProgress(), `reading level [${(j + 1)}/${(levelCount + 1)}] ${levelName}`);
			}

			// we will intentionally NOT wait for next pull request, since these few characters don't make waiting useful.
			await write(`${j > 0 ? ', ' : ''}"${levelName}": {"name": "${levelName}", "objects": [`, false);


			// object headers
			const headersBinLen = reader.readInt32(); // object headers + destroyed colelctables
			reader.readInt32Zero();
			const posBeforeHeaders = reader.getBufferPosition();
			const afterAllHeaders = posBeforeHeaders + headersBinLen;
			let countObjectHeaders = reader.readInt32();

			let totalReadObjectsInLevel = 0;
			let writtenObjectsInLevel = 0;
			let afterHeadersOfBatch = reader.getBufferPosition();	// at first no batch is read.
			let afterObjectsOfBatch = -1;

			do {

				// jump to after last read batch
				reader.skipBytes(afterHeadersOfBatch - reader.getBufferPosition());

				// read batch
				const objectCountToRead = Math.min(countObjectHeaders - totalReadObjectsInLevel, batchingSizeOfObjects);
				const objects = Level.ReadNObjectHeaders(reader, objectCountToRead);

				afterHeadersOfBatch = reader.getBufferPosition();


				// after headers, there MAY be destroyed entities. don't have to.
				// But either way, we can safely ignore them.
				if (countObjectHeaders === totalReadObjectsInLevel + objects.length) {
					const bytesLeft = afterAllHeaders - reader.getBufferPosition();
					if (bytesLeft > 0) {
						ObjectReferencesList.ReadList(reader);
					}
				}


				if (totalReadObjectsInLevel === 0) {

					// jump to after all headers
					reader.skipBytes(afterAllHeaders - reader.getBufferPosition());

					const objectContentsBinLen = reader.readInt32();
					reader.readInt32Zero();
					const posBeforeContents = reader.getBufferPosition();
					const countEntities = reader.readInt32();
					afterObjectsOfBatch = reader.getBufferPosition();	// at first no batch is read.
				} else {
					reader.skipBytes(afterObjectsOfBatch - reader.getBufferPosition());
				}

				Level.ReadNObjectContents(reader, objectCountToRead, objects, 0, buildVersion);
				afterObjectsOfBatch = reader.getBufferPosition();

				totalReadObjectsInLevel += objectCountToRead;
				if (countObjectHeaders > 10000 && totalReadObjectsInLevel % 10000 === 0) {
					reader.onProgressCallback(reader.getBufferProgress(), `read object count [${(totalReadObjectsInLevel + 1)}/${(countObjectHeaders + 1)}] in level ${levelName}`);
				}

				// we should wait even if the objects of many levels accumulate to several hundred.
				let shouldWait = false;
				if (writtenTotalObjectsSinceConsumerSync >= thresholdOfWrittenObjectsUntilWaitingForConsumerAgain) {
					// will wait til consumer catches up. Because we wrote ${writtenTotalObjectsSinceConsumerSync} objects without waiting.
					shouldWait = true;
					writtenTotalObjectsSinceConsumerSync = 0;
				}
				await write(`${writtenObjectsInLevel > 0 ? ', ' : ''}${objects.map(obj => JSON.stringify(obj)).join(', ')}`, shouldWait);
				writtenTotalObjectsSinceConsumerSync += objectCountToRead;
				writtenObjectsInLevel += objectCountToRead;

			} while (totalReadObjectsInLevel < countObjectHeaders)


			await write('], ', false);

			if (reader.context.saveVersion >= SaveCustomVersion.SerializePerStreamableLevelTOCVersion) {
				const saveCustomVersion = reader.readInt32();
				await write(`"saveCustomVersion": ${saveCustomVersion}, `, false);
			}

			await write('"collectables": [', false);

			const collectables = ObjectReferencesList.ReadList(reader);

			await write(`${collectables.map(obj => JSON.stringify(obj)).join(', ')}`, true);

			await write(']', false);
			await write('}', false);
		}
	}
}