import { Alignment } from "../../byte/alignment.enum";
import { ContextWriter } from '../../context/context-writer';
import { ParserError } from "../../error/parser.error";
import { Level } from './level';
import { SatisfactorySave } from "./satisfactory-save";
import { ChunkCompressionInfo, ChunkSummary, SaveBodyChunks } from "./save-body-chunks";


export class SaveWriter extends ContextWriter {

	constructor() {
		super(Alignment.LITTLE_ENDIAN);
	}

	public static WriteLevels(writer: ContextWriter, save: SatisfactorySave): void {
		writer.writeInt32(Object.keys(save.levels).length - 1);
		for (const level of Object.values(save.levels)) {
			if (level.name !== save.header.mapName) {
				writer.writeString(level.name);
			}
			Level.SerializeLevel(writer, level);
		}
	}

	public static GenerateCompressedChunksFromData(
		bufferArray: ArrayBuffer,
		compressionInfo: ChunkCompressionInfo,
		blueprintOrSave: 'blueprint' | 'save',
		onBinaryBeforeCompressing: (binary: ArrayBuffer) => void,
		onChunk: (chunk: Uint8Array) => void,
		alignment: Alignment = Alignment.LITTLE_ENDIAN
	): ChunkSummary[] {

		return SaveBodyChunks.CompressDataIntoChunks(bufferArray, compressionInfo, blueprintOrSave, onBinaryBeforeCompressing, onChunk, alignment);
	}

	public generateChunks(
		compressionInfo: ChunkCompressionInfo,
		posAfterHeader: number,

		onBinaryBeforeCompressing: (binary: ArrayBuffer) => void,
		onHeader: (header: Uint8Array) => void,
		onChunk: (chunk: Uint8Array) => void
	): ChunkSummary[] {

		if (posAfterHeader <= 0) {
			throw new ParserError('ParserError', 'Seems like this buffer has no header. Please write the header first before you can generate chunks.');
		}

		// send plain header first.
		const header = new Uint8Array(this.bufferArray.slice(0, posAfterHeader));
		onHeader(header);

		// create save body
		this.bufferArray = this.bufferArray.slice(posAfterHeader);
		const chunkSummary = SaveWriter.GenerateCompressedChunksFromData(this.bufferArray, compressionInfo, 'save', onBinaryBeforeCompressing, onChunk, this.alignment);

		return chunkSummary;
	}
}
