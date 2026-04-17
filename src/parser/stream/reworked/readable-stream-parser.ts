import { HierarchyVersion } from "../../context/hierarchical-version-context";
import { UnsupportedVersionError } from '../../error/parser.error';
import { DataBlob } from "../../satisfactory/save/data-blob";
import { Level } from "../../satisfactory/save/level";
import { LevelToDestroyedActorsMap } from '../../satisfactory/save/level-to-destroyed-actors-map';
import { ObjectReferencesList } from '../../satisfactory/save/object-references-list';
import { SatisfactorySave } from "../../satisfactory/save/satisfactory-save";
import { SatisfactorySaveHeader } from '../../satisfactory/save/satisfactory-save-header';
import { ChunkCompressionInfo } from "../../satisfactory/save/save-body-chunks";
import { SaveCustomVersion } from '../../satisfactory/save/save-custom-version';
import { SaveReader } from '../../satisfactory/save/save-reader';
import { TOCBlob } from "../../satisfactory/save/toc-blob";
import { ObjectReference } from '../../satisfactory/types/structs/ObjectReference';
import { SaveBodyValidation } from "../../satisfactory/types/structs/SaveBodyValidation";
import { FSaveObjectVersionData } from "../../satisfactory/types/structs/binary/FSaveObjectVersionData";

interface StreamWeb {
	ReadableStream: any;
	QueuingStrategy: any;
	ReadableStreamDefaultController: any;
}

const streamWeb: StreamWeb = (() => {
	try {
		return require('stream/web');
	} catch {
		try {
			return require('web-streams-polyfill');
		} catch {
			return {
				ReadableStream: (globalThis as any).ReadableStream as any,
				QueuingStrategy: (globalThis as any).QueuingStrategy as any,
				ReadableStreamDefaultController: (globalThis as any).ReadableStreamDefaultController as any
			};
		}
	}
})();

const DEFAULT_BYTE_HIGHWATERMARK = 1024 * 1024 * 200;	// 200MiB
const createStringLengthQueuingStrategy = (highWaterMark: number = DEFAULT_BYTE_HIGHWATERMARK / 4): any => ({
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
		onStart: (controller: any) => void,
		onCancel: (reason: any) => void,
		onPullRequest: (desiredSize: number) => void,
		highWaterMark = DEFAULT_BYTE_HIGHWATERMARK / 4
	) => {
		let ourController: any = null;
		const stream = new (streamWeb.ReadableStream as any)({
			start: (controller: any) => {
				ourController = controller;
				onStart(ourController);
			},
			pull: (controller: any) => {
				onPullRequest(ourController!.desiredSize ?? 1);
			},
			cancel: (reason: any) => {
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
	): { stream: any, startStreaming: () => Promise<void> } => {

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
			const roughSaveVersion = SaveReader.GetApproximateSaveVersion(header.saveVersion);
			if (roughSaveVersion === '<U6') {
				throw new UnsupportedVersionError('Game Version < U6 is not supported in the parser. Please save the file in a newer game version.');
			}

			// inflate chunks
			const inflateResult = reader.inflateChunks();
			save.compressionInfo = inflateResult.compressionInfo;

			// call callback on decompressed save body
			if (options?.onDecompressedSaveBody !== undefined) {
				options.onDecompressedSaveBody(reader.getBuffer());
			}

			// might be padding?
			if (reader.context.saveVersion.header >= SaveCustomVersion.UnrealEngine5) {
				reader.readInt32();
			}

			// read FSaveObjectVersionData
			let saveObjectVersionData = save.objectVersionData;
			if (reader.context.saveVersion.header >= SaveCustomVersion.SerializeDataPackageVersionAndCustomVersions) {
				saveObjectVersionData = FSaveObjectVersionData.read(reader);
				reader.context.packageFileVersionUE5 = HierarchyVersion.CreateOnHeader(saveObjectVersionData.packageFileVersion.ue5Version);
			}

			// world partition and validation
			let saveBodyValidation = save.saveBodyValidation;
			if (reader.context.saveVersion.header >= SaveCustomVersion.IntroducedWorldPartition) {
				saveBodyValidation = SaveBodyValidation.Parse(reader);
			}
			await ReadableStreamParser.WriteHeaderAndFieldsBeforeLevel(write, name, inflateResult.compressionInfo, header, saveBodyValidation, saveObjectVersionData);


			// parse levels
			await ReadableStreamParser.ReadWriteLevels(write, reader, save.header.mapName, save.header.buildVersion);
			await write(`}`, false);

			// unresolved data
			if (reader.getBufferPosition() < reader.getBufferLength()) {
				const countUnresolvedWorldSaveData = reader.readInt32();
				if (countUnresolvedWorldSaveData) {
					save.unresolvedWorldSaveData = [];
					for (let i = 0; i < countUnresolvedWorldSaveData; i++) {
						save.unresolvedWorldSaveData.push(ObjectReference.read(reader));
					}
					await write(`, "unresolvedWorldSaveData": ${JSON.stringify(save.unresolvedWorldSaveData)} `, false);
				}
			}

			if (options?.onProgress !== undefined) {
				options.onProgress(1, 'finished parsing.');
			}

			// close save object.
			await write(`}`, true);
			finish();
		};

		return { stream, startStreaming };
	}


	private static WriteHeaderAndFieldsBeforeLevel = async (
		write: (value: string, waitTilConsumingEndIsReady?: boolean) => Promise<void>,
		name: string,
		compressionInfo: ChunkCompressionInfo,
		header: SatisfactorySaveHeader,
		saveBodyValidation: SaveBodyValidation,
		saveObjectVersionData?: FSaveObjectVersionData
	) => {
		const compressionInfoEntry = `"compressionInfo": ${JSON.stringify(compressionInfo)}`;
		const saveBodyValidationEntry = saveBodyValidation !== undefined ? `, "saveBodyValidation": ${JSON.stringify(saveBodyValidation)}` : '';
		const saveObjectVersionDataEntry = saveObjectVersionData !== undefined ? `, "objectVersionData": ${JSON.stringify(saveObjectVersionData)}` : '';
		return write(`{"header": ${JSON.stringify(header)}, "name": "${name}", ${compressionInfoEntry}${saveBodyValidationEntry}${saveObjectVersionDataEntry}, "levels": {`, false);
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
		let collectables: ObjectReference[] = [];
		let destroyedActorsMap: LevelToDestroyedActorsMap = {};
		for (let j = 0; j <= levelCount; j++) {
			let levelName = (j === levelCount) ? '' + mapName : reader.readString();
			const level: Level = {
				name: levelName,
				objects: [],
				collectables: [],
				writesDestroyedActorsInTOCBlob: false
			}
			const isPersistentLevel = levelName === mapName;

			if (j % 500 === 0) {
				reader.onProgressCallback(reader.getBufferProgress(), `reading level [${(j + 1)}/${(levelCount + 1)}] ${levelName}`);
			}
			await write(`${j > 0 ? ', ' : ''}"${levelName}": {"name": "${levelName}",`, false);

			// read blobs later
			const tocBlobMarker = TOCBlob.SkipOver(reader);
			const dataBlobMarker = DataBlob.SkipOver(reader);

			// save Version in Streaming level
			if (!isPersistentLevel) {
				if (reader.context.saveVersion.header >= SaveCustomVersion.SerializePerStreamableLevelTOCVersion) {
					level.saveCustomVersion = reader.readInt32();
					await write(`"saveCustomVersion": ${level.saveCustomVersion},`, false);
				}
			}

			// for persistent level, we have LevelToDestroyedActorsMap, else collectibles + object version data
			// 2nd appearance of destroyed actors / collectables. the lists are equal at both locations
			if (isPersistentLevel) {
				const destroyedActorsMap = LevelToDestroyedActorsMap.read(reader);
				await write(`"destroyedActorsMap": ${JSON.stringify(destroyedActorsMap)},`, false);
			} else {
				level.collectables = ObjectReferencesList.ReadList(reader);

				if (reader.context.saveVersion.header >= SaveCustomVersion.SerializeDataPackageVersionAndCustomVersions) {
					const shouldSerializePerObjectVersionData = reader.readInt32() >= 1;
					if (shouldSerializePerObjectVersionData) {
						level.objectVersionData = FSaveObjectVersionData.read(reader);
						await write(`"objectVersionData": ${JSON.stringify(level.objectVersionData)},`, false);
					}
				}
			}
			await write(`"collectables": [${level.collectables.map(obj => JSON.stringify(obj)).join(', ')}],`, false);

			// set appropriate version context.
			HierarchyVersion.SetOnLevel(reader.context.saveVersion, level.saveCustomVersion);
			HierarchyVersion.SetOnLevel(reader.context.packageFileVersionUE5, level.objectVersionData?.packageFileVersion.ue5Version);

			// jump back and read TOCBlob, DataBlob with accurate save version
			const endOfLevelPosition = reader.getBufferPosition();


			// we will intentionally NOT wait for next pull request, since these few characters don't make waiting useful.
			await write(`"objects": [`, false);
			reader.jumpTo(tocBlobMarker.position);


			// we do the same as TOCBlob.read & DataBlob.read. but jumping back and forth between batches.
			let countObjectHeaders = reader.readInt32();
			let totalReadObjectsInLevel = 0;
			let writtenObjectsInLevel = 0;
			let afterHeadersOfBatch = reader.getBufferPosition();	// at first no batch is read.
			let afterObjectsOfBatch = -1;

			do {

				// jump to after last read batch
				reader.jumpTo(afterHeadersOfBatch);

				// read batch
				const objectCountToRead = Math.min(countObjectHeaders - totalReadObjectsInLevel, batchingSizeOfObjects);
				const objects = TOCBlob.ReadNObjectHeaders(reader, objectCountToRead);
				afterHeadersOfBatch = reader.getBufferPosition();

				// 1st lsit of collectables / destroyed actors in toc blob.
				if (countObjectHeaders === totalReadObjectsInLevel + objects.length) {
					let remainingSize = tocBlobMarker.length - (reader.getBufferPosition() - tocBlobMarker.position);
					if (remainingSize > 0) {
						if (isPersistentLevel) {
							destroyedActorsMap = LevelToDestroyedActorsMap.read(reader);
						} else {
							collectables = ObjectReferencesList.ReadList(reader);
						}
						level.writesDestroyedActorsInTOCBlob = true;
					}
				}

				if (totalReadObjectsInLevel === 0) {

					// jump to after all headers
					reader.jumpTo(dataBlobMarker.position);
					const posBeforeContents = reader.getBufferPosition();
					const countEntities = reader.readInt32();
					afterObjectsOfBatch = reader.getBufferPosition();	// at first no batch is read.
				} else {
					reader.jumpTo(afterObjectsOfBatch);
				}

				DataBlob.ReadNObjectContents(reader, objectCountToRead, objects, 0);
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
				await write(`${writtenObjectsInLevel > 0 ? ', ' : ''}${objects.filter(Boolean).map(obj => JSON.stringify(obj)).join(', ')}`, shouldWait);
				writtenTotalObjectsSinceConsumerSync += objectCountToRead;
				writtenObjectsInLevel += objectCountToRead;

			} while (totalReadObjectsInLevel < countObjectHeaders)


			await write('], ', false);
			await write(`"writesDestroyedActorsInTOCBlob": ${JSON.stringify(level.writesDestroyedActorsInTOCBlob)}`, false);

			reader.jumpTo(endOfLevelPosition);
			await write('}', false);
		}
	}
}