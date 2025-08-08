import { Alignment } from "../../byte/alignment.enum";
import { ContextReader } from '../../context/context-reader';
import { CorruptBlueprintError, CorruptSaveError } from "../../error/parser.error";
import { Level } from '../save/level';
import { ChunkCompressionInfo, SaveBodyChunks } from '../save/save-body-chunks';
import { SaveComponent, isSaveComponent } from "../types/objects/SaveComponent";
import { SaveEntity, isSaveEntity } from "../types/objects/SaveEntity";
import { SaveObject } from "../types/objects/SaveObject";


export class BlueprintReader extends ContextReader {

	public compressionInfo: ChunkCompressionInfo = {
		packageFileTag: 0,
		maxUncompressedChunkContentSize: 0,
		chunkHeaderVersion: SaveBodyChunks.HEADER_V2
	};

	constructor(bluePrintBuffer: ArrayBufferLike) {
		super(bluePrintBuffer, Alignment.LITTLE_ENDIAN);
	}

	public inflateChunks(): { inflatedData: ArrayBufferLike } {

		const result = SaveBodyChunks.DecompressChunks(this.fileBuffer.slice(this.currentByte), this.alignment);
		this.compressionInfo = result.compressionInfo;

		// reset on decompressed data.
		this.currentByte = 0;
		this.fileBuffer = result.uncompressedData.buffer;
		this.maxByte = this.fileBuffer.byteLength;
		this.bufferView = new DataView(this.fileBuffer);

		const totalBodyRestSize = this.readInt32();
		if (result.uncompressedData.byteLength !== totalBodyRestSize + 4) {
			throw new CorruptBlueprintError(`Possibly corrupt. Indicated size of total blueprint body (${totalBodyRestSize + 4}) does not match the uncompressed real size of ${result.uncompressedData.byteLength}.`);
		}

		return {
			inflatedData: this.fileBuffer
		};
	}

	public static ParseObjects(reader: ContextReader): (SaveEntity | SaveComponent)[] {

		// object headers
		const objectHeadersBinarySize = reader.readInt32();
		let objects: (SaveEntity | SaveComponent)[] = [];
		Level.ReadAllObjectHeaders(reader, objects);

		const someChecksumThing = reader.readInt32();

		// objects contents
		BlueprintReader.ReadBlueprintObjectContents(reader, objects, 0);

		reader.getBufferPosition();

		return objects;
	}

	private static ReadBlueprintObjectContents(reader: ContextReader, objectsList: SaveObject[], buildVersion: number): void {
		const countEntities = reader.readInt32();
		for (let i = 0; i < countEntities; i++) {

			// binary length
			const len = reader.readInt32();
			if (len === 0) {
				throw new CorruptSaveError(`check number is a wrong value (${len}). This normally indicates a corrupt entity or blueprint.`);
			}

			const obj = objectsList[i];
			if (isSaveEntity(obj)) {
				SaveEntity.ParseData(obj, len, reader, obj.typePath);
			} else if (isSaveComponent(obj)) {
				SaveComponent.ParseData(obj, len, reader, obj.typePath);
			}
		}
	}

}

export class BlueprintConfigReader extends ContextReader {

	constructor(public bluePrintConfigBuffer: ArrayBufferLike) {
		super(bluePrintConfigBuffer, Alignment.LITTLE_ENDIAN);
	}
}
