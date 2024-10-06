import { Alignment } from "../../byte/alignment.enum";
import { ByteWriter } from "../../byte/byte-writer.class";
import { ParserError } from "../../error/parser.error";
import { ChunkCompressionInfo, ChunkSummary } from "../../file.types";
import { SaveComponent, isSaveComponent } from "../objects/SaveComponent";
import { SaveEntity, isSaveEntity } from "../objects/SaveEntity";
import { Level } from "../save/level.class";
import { SaveWriter } from "../save/save-writer";
import { col4 } from '../structs/util.types';
import { BlueprintConfig, BlueprintHeader } from "./blueprint.types";



export class BlueprintWriter extends ByteWriter {

	constructor() {
		super(Alignment.LITTLE_ENDIAN);
	}

	public static SerializeHeader(writer: ByteWriter, header: BlueprintHeader): void {
		writer.writeInt32(2);   // 2
		writer.writeInt32(46);   // TODO - changes with game updates. object version. - 46 in 1.0
		writer.writeInt32(366202);   // TODO - some header build version? changes with game updates.   // 0xECCF0300 // 0xE6060400 //0x7A960500 in 1.0

		let dimensions = [
			header.designerDimension?.x ?? 4,
			header.designerDimension?.y ?? 4,
			header.designerDimension?.z ?? 4,
		].map(dim => dim < 4 ? 4 : dim);   // dont let smaller values than 4 slip through.

		// designer dimensions in foundations.
		writer.writeInt32(dimensions[0]);
		writer.writeInt32(dimensions[1]);
		writer.writeInt32(dimensions[2]);

		// list of item costs.
		writer.writeInt32(header.itemCosts.length);
		for (const itemCost of header.itemCosts) {
			writer.writeInt32(0);
			writer.writeString(itemCost[0]);
			writer.writeInt32(itemCost[1]);
		}

		// list of recipes.
		writer.writeInt32(header.recipeReferences.length);
		for (const recipeReference of header.recipeReferences) {
			writer.writeInt32(0);
			writer.writeString(recipeReference);
		}
	}

	public generateChunks(
		compressionInfo: ChunkCompressionInfo,
		posAfterHeader: number,

		onBinaryBeforeCompressing: (binary: ArrayBuffer) => void,
		onHeader: (header: Uint8Array) => void,
		onChunk: (chunk: Uint8Array) => void,
	): ChunkSummary[] {

		if (posAfterHeader <= 0) {
			throw new ParserError('ParserError', 'seems like this buffer has no header. Please write the header first before you can generate chunks.');
		}

		// send plain header first.
		const header = new Uint8Array(this.bufferArray.slice(0, posAfterHeader));
		onHeader(header);

		// create save body
		this.bufferArray = this.bufferArray.slice(posAfterHeader);
		const chunkSummary = SaveWriter.GenerateCompressedChunksFromData(this.bufferArray, compressionInfo, onBinaryBeforeCompressing, onChunk, this.alignment);
		return chunkSummary;
	}

	public static SerializeObjects(writer: ByteWriter, objects: (SaveEntity | SaveComponent)[]): void {

		// object headers
		const headersLenIndicator = writer.getBufferPosition();
		writer.writeInt32(0);
		Level.SerializeObjectHeaders(writer, objects);
		writer.writeBinarySizeFromPosition(headersLenIndicator, headersLenIndicator + 4);

		// objects contents
		BlueprintWriter.SerializeObjectContents(writer, objects, 0, '');
	}

	public static SerializeObjectContents(writer: ByteWriter, objects: (SaveEntity | SaveComponent)[], buildVersion: number, levelName: string): void {
		const lenIndicatorEntities = writer.getBufferPosition();
		writer.writeInt32(0);

		writer.writeInt32(objects.length);
		for (const obj of objects) {

			const lenReplacementPosition = writer.getBufferPosition();
			writer.writeInt32(0);

			if (isSaveEntity(obj)) {
				SaveEntity.SerializeData(writer, obj, buildVersion);
			} else if (isSaveComponent(obj)) {
				SaveComponent.SerializeData(writer, obj, buildVersion);
			}

			writer.writeBinarySizeFromPosition(lenReplacementPosition, lenReplacementPosition + 4);
		}
		writer.writeBinarySizeFromPosition(lenIndicatorEntities, lenIndicatorEntities + 4);
	}
}

export class BlueprintConfigWriter extends ByteWriter {

	constructor() {
		super(Alignment.LITTLE_ENDIAN);
	}

	public static SerializeConfig(writer: ByteWriter, config: BlueprintConfig): void {
		writer.writeInt32(2);   // unknown, seems to always be 02.
		writer.writeString(config.description);
		writer.writeInt32(config.iconID);
		col4.SerializeRGBA(writer, config.color);
		writer.writeString(config.referencedIconLibrary);
		writer.writeString(config.iconLibraryType);
	}
}