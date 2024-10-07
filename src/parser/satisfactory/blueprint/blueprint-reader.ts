import Pako from "pako";
import { Alignment } from "../../byte/alignment.enum";
import { BinaryReadable } from "../../byte/binary-readable.interface";
import { ByteReader } from "../../byte/byte-reader.class";
import { CorruptSaveError, ParserError } from "../../error/parser.error";
import { ChunkCompressionInfo } from "../../file.types";
import { Level } from "../save/level.class";
import { DEFAULT_SATISFACTORY_CHUNK_HEADER_SIZE } from "../save/save-reader";
import { SaveComponent, isSaveComponent } from "../types/objects/SaveComponent";
import { SaveEntity, isSaveEntity } from "../types/objects/SaveEntity";
import { SaveObject } from "../types/objects/SaveObject";
import { col4 } from '../types/structs/col4';
import { vec3 } from '../types/structs/vec3';
import { BlueprintConfig, BlueprintHeader } from "./blueprint.types";

export class BlueprintReader extends ByteReader {

	public compressionInfo: ChunkCompressionInfo = {
		packageFileTag: 0,
		maxUncompressedChunkContentSize: 0,
		chunkHeaderSize: DEFAULT_SATISFACTORY_CHUNK_HEADER_SIZE
	};

	constructor(bluePrintBuffer: ArrayBuffer) {
		super(bluePrintBuffer, Alignment.LITTLE_ENDIAN);
	}

	public static ReadHeader(reader: BinaryReadable): BlueprintHeader {
		const alwaysTwo = reader.readBytes(4);  // 02 00 00 00 - always
		const objectVersion = reader.readBytes(2 * 4);  // 24 00 00 00, 7F 3B 03 00 - varies over updates - in 1.0 it's 46 and 0x7A960500.
		const dimensions = vec3.ParseInt(reader); // 04 00 00 00, 04 00 00 00, 04 00 00 00 - dimensions in foundation size


		// list of item costs.
		let itemTypeCount = reader.readInt32();
		const itemCosts = new Array<[string, number]>(itemTypeCount).fill(['', 0]);
		for (let i = 0; i < itemTypeCount; i++) {
			reader.readInt32();	// 0
			let itemPathName = reader.readString();
			let itemCount = reader.readInt32();

			itemCosts[i] = [itemPathName, itemCount];
		}

		// list of recipes
		let recipeCount = reader.readInt32();
		const recipeRefs = new Array<string>(recipeCount).fill('');
		for (let i = 0; i < recipeCount; i++) {
			reader.readInt32();	// 0
			const recipeName = reader.readString();
			recipeRefs[i] = recipeName;
		}

		return {
			designerDimension: dimensions,
			recipeReferences: recipeRefs,
			itemCosts
		};
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
			let chunkHeader = new DataView(this.fileBuffer.slice(0, this.compressionInfo.chunkHeaderSize));
			this.currentByte = this.compressionInfo.chunkHeaderSize;
			this.handledByte += this.compressionInfo.chunkHeaderSize;

			if (this.compressionInfo.packageFileTag <= 0) {
				this.compressionInfo.packageFileTag = chunkHeader.getUint32(0, this.alignment === Alignment.LITTLE_ENDIAN);
			}
			if (this.compressionInfo.maxUncompressedChunkContentSize <= 0) {
				this.compressionInfo.maxUncompressedChunkContentSize = chunkHeader.getInt32(8, this.alignment === Alignment.LITTLE_ENDIAN);  //00 00 02 00 = 131072
			}

			const chunkCompressedLength = chunkHeader.getInt32(33, this.alignment === Alignment.LITTLE_ENDIAN);
			const chunkUncompressedLength = chunkHeader.getInt32(25, this.alignment === Alignment.LITTLE_ENDIAN);
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
				currentInflatedChunk = Pako.inflate(currentChunk);
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

	public static ParseObjects(reader: ByteReader): (SaveEntity | SaveComponent)[] {

		const totalBodyRestSize = reader.readInt32();

		// object headers
		const objectHeadersBinarySize = reader.readInt32();
		let objects: (SaveEntity | SaveComponent)[] = [];
		Level.ReadObjectHeaders(reader, objects, () => { });

		const someChecksumThing = reader.readInt32();

		// objects contents
		BlueprintReader.ReadBlueprintObjectContents(reader, objects, 0);

		reader.getBufferPosition();

		return objects;
	}

	private static ReadBlueprintObjectContents(reader: BinaryReadable, objectsList: SaveObject[], buildVersion: number): void {
		const countEntities = reader.readInt32();
		for (let i = 0; i < countEntities; i++) {

			// binary length
			const len = reader.readInt32();
			if (len === 0) {
				throw new CorruptSaveError(`check number is a wrong value (${len}). This normally indicates a corrupt entity or blueprint.`);
			}

			const obj = objectsList[i];
			if (isSaveEntity(obj)) {
				SaveEntity.ParseData(obj, len, reader, buildVersion, obj.typePath);
			} else if (isSaveComponent(obj)) {
				SaveComponent.ParseData(obj, len, reader, buildVersion, obj.typePath);
			}
		}
	}

}

export class BlueprintConfigReader extends ByteReader {

	constructor(public bluePrintConfigBuffer: ArrayBuffer) {
		super(bluePrintConfigBuffer, Alignment.LITTLE_ENDIAN);
	}

	public parse = (): BlueprintConfig => BlueprintConfigReader.ParseConfig(this);

	public static ParseConfig(reader: BinaryReadable): BlueprintConfig {
		const alwaysTwo = reader.readInt32();
		const description = reader.readString();
		const iconID = reader.readInt32();
		const color = col4.ParseRGBA(reader);
		const referencedIconLibrary = reader.readString();
		const iconLibraryType = reader.readString();

		return {
			description,
			color,
			iconID,
			referencedIconLibrary,
			iconLibraryType
		}
	}
}
