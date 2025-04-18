import Pako from "pako";
import { Alignment } from "../../byte/alignment.enum";
import { ContextReader } from '../../context/context-reader';
import { CorruptSaveError, ParserError } from "../../error/parser.error";
import { Level } from '../save/level.class';
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

	public inflateChunks(): any {

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
			let chunkHeaderSize = this.compressionInfo.chunkHeaderVersion === SaveBodyChunks.HEADER_V1 ? 48 : 49;

			let chunkHeader = new DataView(this.fileBuffer.slice(0, chunkHeaderSize));
			const headerVersion = this.compressionInfo.packageFileTag = chunkHeader.getUint32(4, this.alignment === Alignment.LITTLE_ENDIAN);

			// read version to have correct header size. See SaveWriter.GenerateCompressedChunksFromData for details
			if (headerVersion === SaveBodyChunks.HEADER_V1 && chunkHeaderSize !== 48) {
				chunkHeaderSize = 48;
				chunkHeader = new DataView(this.fileBuffer.slice(0, chunkHeaderSize));
			} else if (headerVersion === SaveBodyChunks.HEADER_V2 && chunkHeaderSize !== 49) {
				chunkHeaderSize = 49;
				chunkHeader = new DataView(this.fileBuffer.slice(0, chunkHeaderSize));
			}

			this.currentByte = chunkHeaderSize;
			this.handledByte += chunkHeaderSize;

			if (this.compressionInfo.packageFileTag <= 0) {
				this.compressionInfo.packageFileTag = chunkHeader.getUint32(0, this.alignment === Alignment.LITTLE_ENDIAN);
			}
			if (this.compressionInfo.maxUncompressedChunkContentSize <= 0) {
				this.compressionInfo.maxUncompressedChunkContentSize = chunkHeader.getInt32(8, this.alignment === Alignment.LITTLE_ENDIAN);  //00 00 02 00 = 131072
			}

			const chunkCompressedLength = chunkHeader.getInt32(headerVersion === SaveBodyChunks.HEADER_V1 ? 32 : 33, this.alignment === Alignment.LITTLE_ENDIAN);
			const chunkUncompressedLength = chunkHeader.getInt32(headerVersion === SaveBodyChunks.HEADER_V1 ? 24 : 25, this.alignment === Alignment.LITTLE_ENDIAN);
			totalUncompressedBodySize += chunkUncompressedLength;


			const currentChunkSize = chunkCompressedLength;
			let currentChunk = this.fileBuffer.slice(this.currentByte, this.currentByte + currentChunkSize);
			this.handledByte += currentChunkSize;
			this.currentByte += currentChunkSize;


			// Free memory from previous chunk...
			this.fileBuffer = this.fileBuffer.slice(this.currentByte);
			this.currentByte = 0;

			try {
				// Inflate current chunk
				let currentInflatedChunk = null;
				currentInflatedChunk = Pako.inflate(new Uint8Array(currentChunk));
				currentChunks.push(currentInflatedChunk);
			}
			catch (err) {
				throw new ParserError('ParserError', 'An error occurred while calling pako inflate.' + err);
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

		// reset reader on this body content.
		this.currentByte = 0;
		this.maxByte = bigWholeChunk.buffer.byteLength;
		this.bufferView = new DataView(bigWholeChunk.buffer);

		return {
			newChunkLength,
			numChunks: currentChunks.length,
			inflatedData: bigWholeChunk
		};
	}

	public static ParseObjects(reader: ContextReader): (SaveEntity | SaveComponent)[] {

		const totalBodyRestSize = reader.readInt32();

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
