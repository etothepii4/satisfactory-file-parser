import { Alignment } from "../../byte/alignment.enum";
import { ContextWriter } from '../../context/context-writer';
import { ParserError } from "../../error/parser.error";
import { Level } from './level';
import { SatisfactorySave } from "./satisfactory-save";
import { ChunkCompressionInfo, ChunkSummary, SaveBodyChunks } from "./save-body-chunks";
import { Grids, SaveBodyValidation } from './save-reader';


export class SaveWriter extends ContextWriter {

	constructor() {
		super(Alignment.LITTLE_ENDIAN);
	}

	public static WriteSaveBodyHash = (writer: ContextWriter, saveBodyValidation: SaveBodyValidation): void => {
		writer.writeInt32(0);
		writer.writeInt32(saveBodyValidation.version);
		writer.writeString('None');
		writer.writeInt32(0);
		writer.writeBytesArray(saveBodyValidation.hash1);
		writer.writeInt32(1);
		writer.writeString('None');
		writer.writeBytesArray(saveBodyValidation.hash2);
	}

	public static WriteGrids = (writer: ContextWriter, grids: Grids): void => {
		for (const gridEntry of Object.entries(grids)) {
			writer.writeString(gridEntry[0]);
			writer.writeInt32(gridEntry[1].cellSize);
			writer.writeUint32(gridEntry[1].gridHash);

			writer.writeUint32(Object.values(gridEntry[1].children).length);
			for (const child of Object.entries(gridEntry[1].children)) {
				writer.writeString(child[0]);
				writer.writeUint32(child[1]);
			}
		}
	};

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
