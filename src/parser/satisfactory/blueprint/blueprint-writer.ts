import { Alignment } from "../../byte/alignment.enum";
import { ContextWriter } from '../../context/context-writer';
import { ParserError } from "../../error/parser.error";
import { ChunkCompressionInfo, ChunkSummary } from "../../file.types";
import { Level } from '../save/level.class';
import { SaveWriter } from "../save/save-writer";
import { SaveComponent, isSaveComponent } from "../types/objects/SaveComponent";
import { SaveEntity, isSaveEntity } from "../types/objects/SaveEntity";
import { col4 } from '../types/structs/col4';
import { BlueprintConfig } from "./blueprint.types";



export class BlueprintWriter extends ContextWriter {

	constructor() {
		super(Alignment.LITTLE_ENDIAN);
	}

	public generateChunks(
		compressionInfo: ChunkCompressionInfo,
		posAfterHeader: number,

		options: Partial<{
			onBinaryBeforeCompressing: (binary: ArrayBuffer) => void,
			onHeader: (header: Uint8Array) => void,
			onChunk: (chunk: Uint8Array) => void,
		}>
	): ChunkSummary[] {

		if (posAfterHeader <= 0) {
			throw new ParserError('ParserError', 'seems like this buffer has no header. Please write the header first before you can generate chunks.');
		}

		// send plain header first.
		const header = new Uint8Array(this.bufferArray.slice(0, posAfterHeader));
		if (options.onHeader !== undefined) {
			options.onHeader(header);
		}

		// create save body
		this.bufferArray = this.bufferArray.slice(posAfterHeader);
		const chunkSummary = SaveWriter.GenerateCompressedChunksFromData(this.bufferArray, compressionInfo, options.onBinaryBeforeCompressing ?? (() => { }), options.onChunk ?? (() => { }), this.alignment);
		return chunkSummary;
	}

	public static SerializeObjects(writer: ContextWriter, objects: (SaveEntity | SaveComponent)[]): void {

		// object headers
		const headersLenIndicator = writer.getBufferPosition();
		writer.writeInt32(0);
		Level.SerializeAllObjectHeaders(writer, objects);
		writer.writeBinarySizeFromPosition(headersLenIndicator, headersLenIndicator + 4);

		// objects contents
		BlueprintWriter.SerializeObjectContents(writer, objects, 0, '');
	}

	public static SerializeObjectContents(writer: ContextWriter, objects: (SaveEntity | SaveComponent)[], buildVersion: number, levelName: string): void {
		const lenIndicatorEntities = writer.getBufferPosition();
		writer.writeInt32(0);

		writer.writeInt32(objects.length);
		for (const obj of objects) {

			const lenReplacementPosition = writer.getBufferPosition();
			writer.writeInt32(0);

			if (isSaveEntity(obj)) {
				SaveEntity.SerializeData(writer, obj);
			} else if (isSaveComponent(obj)) {
				SaveComponent.SerializeData(writer, obj);
			}

			writer.writeBinarySizeFromPosition(lenReplacementPosition, lenReplacementPosition + 4);
		}
		writer.writeBinarySizeFromPosition(lenIndicatorEntities, lenIndicatorEntities + 4);
	}
}

export class BlueprintConfigWriter extends ContextWriter {

	constructor() {
		super(Alignment.LITTLE_ENDIAN);
	}

	public static SerializeConfig(writer: ContextWriter, config: BlueprintConfig): void {
		writer.writeInt32(2);   // unknown, seems to always be 02.
		writer.writeString(config.description);
		writer.writeInt32(config.iconID);
		col4.SerializeRGBA(writer, config.color);
		writer.writeString(config.referencedIconLibrary ?? '');
		writer.writeString(config.iconLibraryType ?? '');
	}
}