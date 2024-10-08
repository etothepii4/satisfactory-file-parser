import { ChunkSummary } from "./file.types";
import { BlueprintConfigReader, BlueprintReader } from "./satisfactory/blueprint/blueprint-reader";
import { BlueprintConfigWriter, BlueprintWriter } from "./satisfactory/blueprint/blueprint-writer";
import { Blueprint } from "./satisfactory/blueprint/blueprint.types";
import { SatisfactorySave } from "./satisfactory/save/satisfactory-save";
import { SaveWriter } from "./satisfactory/save/save-writer";


/** @public */
export class Parser {

	/**
	 * serializes a {@link SatisfactorySave} into binary and reports back on individual callbacks.
	 * @param save the {@link SatisfactorySave} to serialize into binary.
	 * @param onBinaryBeforeCompressing gets called on the binary save body before it is compressed.
	 * @param onHeader gets called on the binary save header, which is always uncompressed.
	 * @param onChunk gets called when a chunk of the compressed save body was generated. Often, files' save bodies consist of multiple chunks.
	 * @returns a summary of the generated chunks.
	 */
	public static WriteSave(save: SatisfactorySave,
		onBinaryBeforeCompressing: (buffer: ArrayBuffer) => void,
		onHeader: (header: Uint8Array) => void,
		onChunk: (chunk: Uint8Array) => void
	): ChunkSummary[] {

		const writer = new SaveWriter();

		SaveWriter.WriteHeader(writer, save.header);
		const posAfterHeader = writer.getBufferPosition();

		SaveWriter.WriteSaveBodyHash(writer, save.gridHash);
		SaveWriter.WriteGrids(writer, save.grids);
		SaveWriter.WriteLevels(writer, save, save.header.buildVersion);

		writer.endWriting();
		const chunkSummary = writer.generateChunks(save.compressionInfo!, posAfterHeader, onBinaryBeforeCompressing, onHeader, onChunk);
		return chunkSummary;
	}

	/**
	 * Writes a {@link Blueprint} object to binary. And reports back on individual callbacks.
	 * @param blueprint the blueprint to be written
	 * @param onMainFileBinaryBeforeCompressing gets called back when the main blueprint file binary is ready before compressing
	 * @param onMainFileHeader gets called back when the main blueprint file header is ready
	 * @param onMainFileChunk gets called back when a main blueprint file chunk is ready
	 * @returns a chunk summary of the main file generated chunks. Plus the binary data of the config file, since it is often very small.
	 */
	public static WriteBlueprintFiles(
		blueprint: Blueprint,
		onMainFileBinaryBeforeCompressing: (binary: ArrayBuffer) => void = () => { },
		onMainFileHeader: (header: Uint8Array) => void = () => { },
		onMainFileChunk: (chunk: Uint8Array) => void = () => { },
	): {
		mainFileChunkSummary: ChunkSummary[],
		configFileBinary: ArrayBuffer
	} {

		// write main blueprint file
		const blueprintWriter = new BlueprintWriter();
		BlueprintWriter.SerializeHeader(blueprintWriter, blueprint.header);
		const saveBodyPos = blueprintWriter.getBufferPosition();
		BlueprintWriter.SerializeObjects(blueprintWriter, blueprint.objects);
		blueprintWriter.endWriting();
		let binaryChunks: Uint8Array[] = [];
		let binaryHeader: Uint8Array;
		const mainFileChunkSummary = blueprintWriter.generateChunks(
			blueprint.compressionInfo,
			saveBodyPos,
			onMainFileBinaryBeforeCompressing,
			onMainFileHeader,
			onMainFileChunk
		);

		// write config as well.
		const configWriter = new BlueprintConfigWriter();
		BlueprintConfigWriter.SerializeConfig(configWriter, blueprint.config);
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
	 * @param onDecompressedBlueprintBody gets called when the body of the main blueprint file is decompressed.
	 * @returns 
	 */
	public static ParseBlueprintFiles(
		name: string,
		blueprintFile: Buffer,
		blueprintConfigFile: Buffer,
		onDecompressedBlueprintBody: (buffer: ArrayBuffer) => void = () => { },
	): Blueprint {

		// read config file
		const blueprintConfigReader = new BlueprintConfigReader(new Uint8Array(blueprintConfigFile).buffer);
		const config = BlueprintConfigReader.ParseConfig(blueprintConfigReader);

		// read actual blueprint file
		const blueprintReader = new BlueprintReader(new Uint8Array(blueprintFile).buffer);
		const header = BlueprintReader.ReadHeader(blueprintReader);
		const inflateResult = blueprintReader.inflateChunks();

		// call back on decompressed body.
		onDecompressedBlueprintBody(inflateResult.inflatedData);

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