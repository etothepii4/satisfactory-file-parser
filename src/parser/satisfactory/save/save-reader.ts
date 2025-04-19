import { Alignment } from '../../byte/alignment.enum';
import { ContextReader } from '../../context/context-reader';
import { CorruptSaveError, ParserError } from '../../error/parser.error';
import { Level } from './level.class';
import { ChunkCompressionInfo, SaveBodyChunks } from './save-body-chunks';
import { SaveCustomVersion } from './save-custom-version';
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

	public static GetRoughSaveVersion = (saveVersion: number): RoughSaveVersion => {
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
	public static IsGameVersionAtLeast_U1_1 = (saveVersion: number) => saveVersion >= SaveCustomVersion.SerializePerStreamableLevelTOCVersion;
	public static IsGameVersionAtLeast_U1 = (saveVersion: number) => saveVersion >= SaveCustomVersion.Version1;
	public static IsGameVersionAtLeast_U8 = (saveVersion: number) => saveVersion >= SaveCustomVersion.UnrealEngine5;	// Could be anywhere from UnrealEngine5 (37) to ResetBrokenBlueprintSplinnes (42)
	public static IsGameVersionAtLeast_U6_U7 = (saveVersion: number) => saveVersion >= SaveCustomVersion.AddedSublevelStreaming;

	public inflateChunks(): { compressionInfo: ChunkCompressionInfo } {

		const result = SaveBodyChunks.DecompressChunks(this.fileBuffer.slice(this.currentByte), this.alignment);

		// reset on decompressed data.
		this.currentByte = 0;
		this.fileBuffer = result.uncompressedData.buffer;
		this.maxByte = this.fileBuffer.byteLength;
		this.bufferView = new DataView(this.fileBuffer);

		const totalBodyRestSize = this.readInt32();
		if (result.uncompressedData.byteLength !== (totalBodyRestSize + (this.context.saveVersion >= SaveCustomVersion.UnrealEngine5 ? 8 : 4))) {
			throw new CorruptSaveError(`Possibly corrupt. Indicated size of total save body (${totalBodyRestSize + 8}) does not match the uncompressed real size of ${result.uncompressedData.byteLength}.`);
		}

		return {
			compressionInfo: result.compressionInfo
		};
	}

	public readSaveBodyHash = (): SaveBodyValidation => {

		this.expect(this.readInt32(), 0);

		const saveBodyValidationVersion = this.readInt32(); // seems constant, always 06 00 00 00

		this.expect(this.readString(), 'None');
		this.expect(this.readInt32(), 0);

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
			throw new ParserError('ParserError', 'Header and its context must be set before objects can be read.');
		}

		// guard save version
		/*
		const roughSaveVersion = SaveReader.GetRoughSaveVersion(this.context.saveVersion!);
		if (roughSaveVersion === '<U6') {
			throw new UnsupportedVersionError('Game Version < U6 is not supported.');
		} else if (roughSaveVersion === 'U6/U7') {
			throw new UnsupportedVersionError('Game Version U6/U7 is not supported in this package version. Consider downgrading to the latest package version supporting it, which is 0.0.34');
		} else if (roughSaveVersion === 'U8') {
			//throw new UnsupportedVersionError('Game Version U8 is not supported in this package version. Consider downgrading to the latest package version supporting it, which is 0.3.7');
		}
		*/

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


