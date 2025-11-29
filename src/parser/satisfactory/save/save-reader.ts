import { Alignment } from '../../byte/alignment.enum';
import { ContextReader } from '../../context/context-reader';
import { CorruptSaveError, ParserError, UnsupportedVersionError } from '../../error/parser.error';
import { Grids } from '../types/structs/SaveBodyValidation';
import { Level } from './level';
import { ChunkCompressionInfo, SaveBodyChunks } from './save-body-chunks';
import { SaveCustomVersion } from './save-custom-version';
import { RoughSaveVersion } from './save.types';


export const DEFAULT_SATISFACTORY_CHUNK_HEADER_SIZE = 49;



export class SaveReader extends ContextReader {

	// the number of .net ticks at the unix epoch
	public static readonly EPOCH_TICKS = 621355968000000000n;

	constructor(fileBuffer: ArrayBufferLike, public onProgressCallback: (progress: number, msg?: string) => void = () => { }) {
		super(fileBuffer, Alignment.LITTLE_ENDIAN);
	}

	public expect = (value: any, expected: any): void => {
		if (value !== expected) {
			console.warn(`Read a value that's usually '${expected}', but this time '${value}'. Meaning unclear. Especially if you use mods. Raise an issue or contact me if you want.`);
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

	public readLevels(): { [levelName: string]: Level; } {

		if (!this.context.saveVersion || !this.context.saveHeaderType) {
			throw new ParserError('ParserError', 'Header and its context must be set before objects can be read.');
		}

		// guard save version
		const roughSaveVersion = SaveReader.GetRoughSaveVersion(this.context.saveVersion);
		if (roughSaveVersion === '<U6') {
			throw new UnsupportedVersionError('Game Version < U6 is not supported in the parser. Please save the file in a newer game version.');
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

		return levels;
	}
}


