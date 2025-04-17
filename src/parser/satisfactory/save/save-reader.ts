import Pako from 'pako';
import { Alignment } from '../../byte/alignment.enum';
import { ContextReader } from '../../context/context-reader';
import { CompressionLibraryError, CorruptSaveError, ParserError, UnsupportedVersionError } from '../../error/parser.error';
import { ChunkCompressionInfo } from '../../file.types';
import { Level } from './level.class';
import { RoughSaveVersion } from './save.types';


export const DEFAULT_SATISFACTORY_CHUNK_HEADER_SIZE = 49;

export type ByteArray4 = [number, number, number, number];

export type SaveBodyValidation = {
	version: number;
	hash1: ByteArray4;
	hash2: ByteArray4;
}

export type Grids = {
	[parentName: string]: {
		cellSize: number;
		gridHash: number;
		children: {
			[name: string]: number;	// children object contains names and their binary size.
		}
	}
};
export class SaveReader extends ContextReader {

	public compressionInfo: ChunkCompressionInfo = {
		packageFileTag: 0,
		maxUncompressedChunkContentSize: 0,
		chunkHeaderSize: DEFAULT_SATISFACTORY_CHUNK_HEADER_SIZE
	};

	// the number of .net ticks at the unix epoch
	public static readonly EPOCH_TICKS = 621355968000000000n;

	constructor(fileBuffer: ArrayBufferLike, public onProgressCallback: (progress: number, msg?: string) => void = () => { }) {
		super(fileBuffer, Alignment.LITTLE_ENDIAN);
	}

	public expect = (value: any, expected: any) => {
		if (value !== expected) {
			console.warn(`Read a value that's usually ${expected}, but this time ${value}. Meaning unclear. Raise an issue or contact me if you want.`);
		}
	};

	public static GetRoughSaveVersion = (saveVersion: number, headerTypeVersion: number): RoughSaveVersion => {
		if (SaveReader.IsGameVersionAtLeast_U1_1(saveVersion)) {
			return 'U1.1+';
		} else if (SaveReader.IsGameVersionAtLeast_U1(saveVersion)) {
			return 'U1.0';
		} else if (SaveReader.IsGameVersionAtLeast_U8(saveVersion)) {
			return 'U8';
		} else if (SaveReader.IsGameVersionAtLeast_U6_U7(saveVersion)) {
			return 'U6/U7';
		} else {
			return '<U6';
		}
	};
	public static IsGameVersionAtLeast_U1_1 = (saveVersion: number) => saveVersion >= 51;
	public static IsGameVersionAtLeast_U1 = (saveVersion: number) => saveVersion >= 46;
	//public static IsGameVersionAtLeast_U8 = (headerTypeVersion: number) => headerTypeVersion >= 13;
	public static IsGameVersionAtLeast_U8 = (saveVersion: number) => saveVersion >= 42;
	public static IsGameVersionAtLeast_U6_U7 = (saveVersion: number) => saveVersion >= 29;

	public inflateChunks(): { concatenatedChunkLength: number; numChunks: number; } {

		// free memory
		this.fileBuffer = this.fileBuffer.slice(this.currentByte);

		this.handledByte = 0;
		this.currentByte = 0;
		this.maxByte = this.fileBuffer.byteLength;


		let currentChunks = [];
		let totalUncompressedBodySize = 0;

		// read while we can handle
		while (this.handledByte < this.maxByte) {

			// Read chunk info size...
			let chunkHeader = new DataView(this.fileBuffer.slice(0, this.compressionInfo.chunkHeaderSize));
			this.currentByte = this.compressionInfo.chunkHeaderSize;
			this.handledByte += this.compressionInfo.chunkHeaderSize;


			if (this.compressionInfo.packageFileTag <= 0) {
				// Should always be 0xC1832A9E in LE
				this.compressionInfo.packageFileTag = chunkHeader.getUint32(0, this.alignment === Alignment.LITTLE_ENDIAN);
			}
			if (this.compressionInfo.maxUncompressedChunkContentSize <= 0) {
				// should always be 0x00000200 in LE
				this.compressionInfo.maxUncompressedChunkContentSize = chunkHeader.getInt32(8, this.alignment === Alignment.LITTLE_ENDIAN);
			}

			const chunkCompressedLength = chunkHeader.getInt32(33, this.alignment === Alignment.LITTLE_ENDIAN);
			const chunkUncompressedLength = chunkHeader.getInt32(25, this.alignment === Alignment.LITTLE_ENDIAN);
			totalUncompressedBodySize += chunkUncompressedLength;

			const currentChunkSize = chunkCompressedLength;
			let currentChunk = this.fileBuffer.slice(this.currentByte, this.currentByte + currentChunkSize);
			this.handledByte += currentChunkSize;
			this.currentByte += currentChunkSize;


			// Free memory from previous chunk...
			this.fileBuffer = this.fileBuffer.slice(this.currentByte);
			this.currentByte = 0;

			// unzip current chunk
			try {
				let currentInflatedChunk = null;
				currentInflatedChunk = Pako.inflate(new Uint8Array(currentChunk));
				currentChunks.push(currentInflatedChunk);
			}
			catch (err: any) {
				throw new CompressionLibraryError("Failed to inflate compressed save data. " + err);
			}
		}

		//TODO we can get rid of file buffer here.
		// Create one big chunk out of the little chunks
		let newChunkLength = currentChunks.map<number>(cc => cc.length).reduce((prev, cur) => prev + cur);
		const bigWholeChunk = new Uint8Array(newChunkLength);
		let currentLength = 0;
		for (let i = 0; i < currentChunks.length; i++) {
			bigWholeChunk.set(currentChunks[i], currentLength);
			currentLength += currentChunks[i].length;
		}

		this.currentByte = 0;
		this.maxByte = bigWholeChunk.buffer.byteLength;
		this.bufferView = new DataView(bigWholeChunk.buffer);

		const dataLength = this.readInt32();
		if (totalUncompressedBodySize !== dataLength + 8) {
			throw new CorruptSaveError(`Possibly corrupt. Indicated size of total save body (${dataLength + 8}) does not match the uncompressed real size of ${totalUncompressedBodySize}.`);
		}

		return {
			concatenatedChunkLength: newChunkLength,
			numChunks: currentChunks.length
		};
	}

	public readSaveBodyHash = (): SaveBodyValidation => {

		this.expect(this.readInt32(), 0);

		const saveBodyValidationVersion = this.readInt32(); // seems constant, always 06 00 00 00

		this.expect(this.readString(), 'None');
		this.expect(this.readInt32(), 0);

		// binary len maybe? But its not binary length of just grids, must be grids + levels?
		const hash1 = Array.from(this.readBytes(4)) as ByteArray4; // some weird binary hash - 67 21 E7 F7 / DC 7E 81 48 / 59 E4 1E 1B  -- changes not when collecting a slug or dismantling an object. Grids havent changed. So it must depend on grid-related things.

		this.expect(this.readInt32(), 1);
		this.expect(this.readString(), 'None');

		// TODO: check
		const hash2 = Array.from(this.readBytes(4)) as ByteArray4; // no idea, changes somehow when level content changes. So we save it for now. -- 8B 08 EB 00

		return {
			version: saveBodyValidationVersion,
			hash1,
			hash2
		} satisfies SaveBodyValidation;
	};

	public readGrids = (): Grids => {
		const grids: Grids = {};

		const readGrid = () => {
			const gridName = this.readString();
			const cellSize = this.readInt32();
			const gridHash = this.readUint32();
			grids[gridName] = { children: {}, cellSize, gridHash };

			const childrenCount = this.readUint32();
			for (let i = 0; i < childrenCount; i++) {
				const levelInstanceName = this.readString();
				const cellBinHex = this.readUint32();
				grids[gridName].children[levelInstanceName] = cellBinHex;
			}
		};

		// main grid
		readGrid();

		// landscape grid
		readGrid();

		// exploration grid
		readGrid();

		// foliage grid
		readGrid();

		// hlod0
		readGrid();

		return grids;
	};

	public readLevels(): { [levelName: string]: Level; } {

		if (!this.context.saveVersion || !this.context.saveHeaderType) {
			throw new ParserError('ParserError', 'Header must be set before objects can be read.');
		}

		// guard save version
		const roughSaveVersion = SaveReader.GetRoughSaveVersion(this.context.saveVersion!, this.context.saveHeaderType!);
		if (roughSaveVersion === '<U6') {
			throw new UnsupportedVersionError('Game Version < U6 is not supported.');
		} else if (roughSaveVersion === 'U6/U7') {
			throw new UnsupportedVersionError('Game Version U6/U7 is not supported in this package version. Consider downgrading to the latest package version supporting it, which is 0.0.34');
		} else if (roughSaveVersion === 'U8') {
			//throw new UnsupportedVersionError('Game Version U8 is not supported in this package version. Consider downgrading to the latest package version supporting it, which is 0.3.7');
		}

		const levels: { [levelName: string]: Level; } = {};
		const levelCount = this.readInt32();
		this.onProgressCallback(this.getBufferProgress(), `reading pack of ${levelCount + 1} levels.`);

		for (let i = 0; i <= levelCount; i++) {
			let levelSingleName = i === levelCount ? this.context.mapName! : this.readString();
			if (i % 500 === 0) {
				this.onProgressCallback(this.getBufferProgress(), `reading level [${(i + 1)}/${(levelCount + 1)}] ${levelSingleName}`);
			}

			levels[levelSingleName] = Level.ReadLevel(this, levelSingleName);
		}

		this.onProgressCallback(this.getBufferProgress(), 'finished parsing.');

		return levels;
	}
}


