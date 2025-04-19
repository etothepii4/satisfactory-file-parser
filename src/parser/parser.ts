import { BlueprintConfig } from './satisfactory/blueprint/blueprint-config';
import { BlueprintHeader } from './satisfactory/blueprint/blueprint-header';
import { BlueprintConfigReader, BlueprintReader } from "./satisfactory/blueprint/blueprint-reader";
import { BlueprintConfigWriter, BlueprintWriter } from "./satisfactory/blueprint/blueprint-writer";
import { Blueprint } from "./satisfactory/blueprint/blueprint.types";
import { SatisfactorySave } from "./satisfactory/save/satisfactory-save";
import { SatisfactorySaveHeader } from './satisfactory/save/satisfactory-save-header';
import { ChunkSummary } from './satisfactory/save/save-body-chunks';
import { SaveCustomVersion } from './satisfactory/save/save-custom-version';
import { SaveReader } from './satisfactory/save/save-reader';
import { SaveWriter } from "./satisfactory/save/save-writer";


/** @public */
export class Parser {

	/**
	 * Parses a given binary buffer as {@link SatisfactorySave}
	 * @param name the save name. It won't be serialized, so it does not matter how you name it.
	 * @param bytes the actual binary buffer
	 * @param options provides callbacks. Either on the decompressed save body or on reported progress as a number [0,1] with an occasional message.
	 * @returns 
	 */
	public static ParseSave(
		name: string,
		bytes: ArrayBufferLike,
		options?: Partial<{
			onDecompressedSaveBody: (buffer: ArrayBufferLike) => void,
			onProgressCallback: (progress: number, msg?: string) => void
		}>
	): SatisfactorySave {

		const reader = new SaveReader(bytes, options?.onProgressCallback);

		const header = SatisfactorySaveHeader.Parse(reader);
		const save = new SatisfactorySave(name, header);

		// guard save version
		/*
		const roughSaveVersion = SaveReader.GetRoughSaveVersion(header.saveVersion);
		if (roughSaveVersion === '<U6') {
			throw new UnsupportedVersionError('Game Version < U6 is not supported.');
		} else if (roughSaveVersion === 'U6/U7') {
			throw new UnsupportedVersionError('Game Version U6/U7 is not supported in this package version. Consider downgrading to the latest package version supporting it, which is 0.0.34');
		} else if (roughSaveVersion === 'U8') {
			//throw new UnsupportedVersionError('Game Version U8 is not supported in this package version. Consider downgrading to the latest package version supporting it, which is 0.3.7');
		}
		*/

		// inflate chunks
		const inflateResult = reader.inflateChunks();
		save.compressionInfo = inflateResult.compressionInfo;

		// call callback on decompressed save body
		if (options?.onDecompressedSaveBody !== undefined) {
			options.onDecompressedSaveBody(reader.getBuffer());
		}

		if (reader.context.saveVersion >= SaveCustomVersion.IntroducedWorldPartition) {

			// save body validation hash
			save.gridHash = reader.readSaveBodyHash();

			// parse grids
			save.grids = reader.readGrids();
		}


		// parse levels
		save.levels = reader.readLevels();

		return save;
	}

	/**
	 * serializes a {@link SatisfactorySave} into binary and reports back on individual callbacks.
	 * @param save the {@link SatisfactorySave} to serialize into binary.
	 * @param options provides callbacks. onBinaryBeforeCompressing gets called on the binary save body before it is compressed.
	 * onHeader gets called on the binary save header, which is always uncompressed.
	 * onChunk gets called when a chunk of the compressed save body was generated. Often, files' save bodies consist of multiple chunks.
	 * @returns a summary of the generated chunks.
	 */
	public static WriteSave(save: SatisfactorySave,
		onHeader: (header: Uint8Array) => void,
		onChunk: (chunk: Uint8Array) => void,
		options?: Partial<{
			onBinaryBeforeCompressing: (buffer: ArrayBuffer) => void,
		}>
	): ChunkSummary[] {

		const writer = new SaveWriter();
		writer.context.saveHeaderType = save.header.saveHeaderType;
		writer.context.saveVersion = save.header.saveVersion;
		writer.context.buildVersion = save.header.buildVersion;

		SatisfactorySaveHeader.Serialize(writer, save.header);
		const posAfterHeader = writer.getBufferPosition();

		if (writer.context.saveVersion >= SaveCustomVersion.IntroducedWorldPartition) {
			SaveWriter.WriteSaveBodyHash(writer, save.gridHash);
			SaveWriter.WriteGrids(writer, save.grids);
		}

		SaveWriter.WriteLevels(writer, save);

		writer.endWriting();
		const chunkSummary = writer.generateChunks(save.compressionInfo!, posAfterHeader, options?.onBinaryBeforeCompressing ?? (() => { }), onHeader, onChunk);
		return chunkSummary;
	}

	/**
	 * Writes a {@link Blueprint} object to binary. And reports back on individual callbacks.
	 * @param blueprint the blueprint to be written
	 * @param options onMainFileBinaryBeforeCompressing gets called back when the main blueprint file binary is ready before compressing.
	 * onMainFileHeader gets called back when the main blueprint file header is ready. onMainFileChunk gets called back when a main blueprint file chunk is ready.
	 * @returns a chunk summary of the main file generated chunks. Plus the binary data of the config file, since it is often very small.
	 */
	public static WriteBlueprintFiles(
		blueprint: Blueprint,
		onMainFileHeader: (header: Uint8Array) => void,
		onMainFileChunk: (chunk: Uint8Array) => void,
		options?: Partial<{
			onMainFileBinaryBeforeCompressing: (binary: ArrayBuffer) => void,
		}>
	): {
		mainFileChunkSummary: ChunkSummary[],
		configFileBinary: ArrayBuffer
	} {

		// write main blueprint file
		const blueprintWriter = new BlueprintWriter();
		blueprintWriter.context.blueprintConfigVersion = blueprint.config.configVersion;
		blueprintWriter.context.saveVersion = blueprint.header.saveVersion;
		blueprintWriter.context.buildVersion = blueprint.header.buildVersion;

		BlueprintHeader.Serialize(blueprintWriter, blueprint.header);
		const saveBodyPos = blueprintWriter.getBufferPosition();
		BlueprintWriter.SerializeObjects(blueprintWriter, blueprint.objects);
		blueprintWriter.endWriting();
		let binaryChunks: Uint8Array[] = [];
		let binaryHeader: Uint8Array;
		const mainFileChunkSummary = blueprintWriter.generateChunks(
			blueprint.compressionInfo,
			saveBodyPos,
			{
				onBinaryBeforeCompressing: options?.onMainFileBinaryBeforeCompressing ?? (() => { }),
				onHeader: onMainFileHeader,
				onChunk: onMainFileChunk
			}
		);

		// write config as well.
		const configWriter = new BlueprintConfigWriter();
		configWriter.context.blueprintConfigVersion = blueprint.config.configVersion;
		blueprintWriter.context.saveVersion = blueprint.header.saveVersion;
		blueprintWriter.context.buildVersion = blueprint.header.buildVersion;

		BlueprintConfig.Serialize(configWriter, blueprint.config);
		const configFileBinary = configWriter.endWriting();

		return {
			mainFileChunkSummary,
			configFileBinary
		}
	}

	/**
	 * Parses two buffers (main blueprint file + config file) into a {@link Blueprint object}
	 * @param name the name of the blueprint, since it is not part of the binary data and has to be passed.
	 * @param blueprintFile the main blueprint file ".sbp"
	 * @param blueprintConfigFile the config blueprint file ".sbpcfg"
	 * @param options provides callbacks. onDecompressedBlueprintBody gets called when the body of the main blueprint file is decompressed.
	 * @returns 
	 */
	public static ParseBlueprintFiles(
		name: string,
		blueprintFile: ArrayBufferLike,
		blueprintConfigFile: ArrayBufferLike,
		options?: Partial<{
			onDecompressedBlueprintBody: (buffer: ArrayBufferLike) => void
		}>
	): Blueprint {

		// read config file
		const blueprintConfigReader = new BlueprintConfigReader(blueprintConfigFile);
		const config = BlueprintConfig.Parse(blueprintConfigReader);

		// read actual blueprint file. with context from config
		const blueprintReader = new BlueprintReader(blueprintFile);
		blueprintReader.context.blueprintConfigVersion = config.configVersion;
		const header = BlueprintHeader.Parse(blueprintReader);
		const inflateResult = blueprintReader.inflateChunks();

		// call back on decompressed body.
		if (options?.onDecompressedBlueprintBody !== undefined) {
			options.onDecompressedBlueprintBody(inflateResult.inflatedData);
		}

		const blueprintObjects = BlueprintReader.ParseObjects(blueprintReader);
		const blueprint: Blueprint = {
			name,
			compressionInfo: blueprintReader.compressionInfo,
			header: header,
			config,
			objects: blueprintObjects
		};
		return blueprint;
	}

	/**
	 * It JSON.stringifies any parsed content safely. The original JSON.stringify() has some flaws that get in the way, so it is custom wrapped. The original has some problems:
	 * 1. it cannot stringify bigints. So we help out by converting it into a string.
	 * 2. It cannot distinguish between 0 and -0. But a float32 is encoded in a uint8Array for 0 to be [0,0,0,0] (0x00000000) and -0 to be [0,0,0,128] (0x00000080) in little endian.
	 * @param obj basically anything that can be stringified
	 * @param indent the indentation, just like with the real JSON stringify.
	 * @returns a string that is safely stringified.
	 */
	public static JSONStringifyModified = (obj: any, indent: number = 0): string =>
		JSON.stringify(obj, (key, value) => {
			if (typeof value === 'bigint') {
				return value.toString();
			} else if (value === 0 && 1 / value < 0) {	// -0
				return '-0';
			}
			return value;
		}, indent)

}