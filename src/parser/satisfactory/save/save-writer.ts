import Pako from "pako";
import { Alignment } from "../../byte/alignment.enum";
import { ByteWriter } from "../../byte/byte-writer.class";
import { CompressionLibraryError, ParserError, UnsupportedVersionError } from "../../error/parser.error";
import { ChunkCompressionInfo, ChunkSummary, CompressionAlgorithmCode } from "../../file.types";
import { MD5Hash } from '../types/structs/MD5Hash';
import { Level } from "./level.class";
import { SatisfactorySave } from "./satisfactory-save";
import { ByteArray4, Grids, SaveReader } from "./save-reader";
import { SatisfactorySaveHeader } from "./save.types";


export class SaveWriter extends ByteWriter {

	constructor() {
		super(Alignment.LITTLE_ENDIAN);
	}

	public static WriteHeader(writer: ByteWriter, header: SatisfactorySaveHeader): void {

		writer.writeInt32(header.saveHeaderType);
		writer.writeInt32(header.saveVersion);
		writer.writeInt32(header.buildVersion);
		writer.writeString(header.mapName);
		writer.writeString(header.mapOptions);
		writer.writeString(header.sessionName);
		writer.writeInt32(header.playDurationSeconds);
		writer.writeInt64(BigInt(header.saveDateTime) * 10000n + SaveReader.EPOCH_TICKS);
		writer.writeByte(header.sessionVisibility);

		if (header.saveHeaderType >= 7) {
			writer.writeInt32(header.fEditorObjectVersion!);
		}
		if (header.saveHeaderType >= 8) {
			if (header.modMetadata) {
				writer.writeString(JSON.stringify(header.modMetadata));
			} else {
				writer.writeString(header.rawModMetadataString!);
			}
			writer.writeInt32(header.isModdedSave!);
		}
		if (header.saveHeaderType >= 10) {
			writer.writeString(header.saveIdentifier!);
		}

		// U8 jumped directly to 13.
		if (header.saveHeaderType >= 11) {
			writer.writeInt32(header.partitionEnabledFlag ? 1 : 0);
		}

		if (header.saveHeaderType >= 12) {
			MD5Hash.write(writer, header.consistencyHashBytes!);
		}

		// 13 is U8 Experimental First Release
		if (header.saveHeaderType >= 13) {
			writer.writeInt32(header.creativeModeEnabled ? 1 : 0);
		}

		if (header.saveVersion >= 21) {
			// ready to write levels now.
		} else {
			throw new UnsupportedVersionError("The save version is too old to be supported currently.");
		}
	}

	public static WriteSaveBodyHash = (writer: ByteWriter, hash: ByteArray4): void => {
		writer.writeInt32(0);
		writer.writeInt32(6);
		writer.writeString('None');
		writer.writeInt32(0);
		writer.writeBytesArray(hash);
		writer.writeInt32(1);
		writer.writeString('None');
	}

	public static WriteGrids = (writer: ByteWriter, grids: Grids): void => {
		for (const parentEntry of Object.entries(grids)) {
			writer.writeInt32(parentEntry[1].checksum);
			writer.writeString(parentEntry[0]);
			writer.writeInt32(parentEntry[1].cellSize);
			writer.writeUint32(parentEntry[1].gridHash);

			for (const child of Object.entries(parentEntry[1].children)) {
				writer.writeUint32(child[1]);
				writer.writeString(child[0]);
			}
		}

		writer.writeInt32(0);
	};

	public static WriteLevels(writer: ByteWriter, save: SatisfactorySave, buildVersion: number): void {
		writer.writeInt32(save.levels.length - 1);
		for (const level of save.levels) {
			if (level.name !== save.header.mapName) {
				writer.writeString(level.name);
			}
			Level.SerializeLevel(writer, level, buildVersion);
		}
	}

	public static GenerateCompressedChunksFromData(
		bufferArray: ArrayBuffer,
		compressionInfo: ChunkCompressionInfo,
		onBinaryBeforeCompressing: (binary: ArrayBuffer) => void,
		onChunk: (chunk: Uint8Array) => void,
		alignment: Alignment = Alignment.LITTLE_ENDIAN
	): ChunkSummary[] {

		const errors: string[] = [];
		const totalUncompressedSize = bufferArray.byteLength;

		const saveBody = new Uint8Array(bufferArray.byteLength + 8);
		saveBody.set(new Uint8Array(bufferArray), 4);
		const miniView = new DataView(saveBody.buffer);
		miniView.setInt32(0, totalUncompressedSize, alignment === Alignment.LITTLE_ENDIAN);
		onBinaryBeforeCompressing(saveBody.buffer);

		// collect slices of chunks with help of compression info for max chunk size
		let handledByte = 0;
		const chunkSummary: {
			uncompressedSize: number,
			compressedSize: number
		}[] = [];
		while (handledByte < saveBody.byteLength) {

			// create uncompressed chunk.
			const uncompressedContentSize = Math.min(compressionInfo.maxUncompressedChunkContentSize, saveBody.byteLength - handledByte);
			const uncompressedChunk = saveBody.buffer.slice(handledByte, handledByte + uncompressedContentSize);

			// deflate chunk while we're at it.
			let compressedChunk: Uint8Array = new Uint8Array(0);
			try {
				compressedChunk = Pako.deflate(uncompressedChunk);
			}
			catch (err) {
				throw new CompressionLibraryError("Could not compress save data. " + err);
			}

			const chunk = new Uint8Array(compressionInfo.chunkHeaderSize + compressedChunk.byteLength);
			chunk.set(compressedChunk, compressionInfo.chunkHeaderSize);

			// write header
			const view = new DataView(chunk.buffer);
			view.setInt32(0, compressionInfo.packageFileTag, alignment === Alignment.LITTLE_ENDIAN);
			view.setInt32(4, 0x22222222, alignment === Alignment.LITTLE_ENDIAN);		//v1 header is 0x00000000, v2 is 0x22222222
			view.setInt32(8, compressionInfo.maxUncompressedChunkContentSize, alignment === Alignment.LITTLE_ENDIAN);
			view.setInt32(12, 0, alignment === Alignment.LITTLE_ENDIAN);
			view.setUint8(16, CompressionAlgorithmCode.ZLIB);	// compression algo, came with U8, only present if header v2. Which means the header is actually 48 bytes long if header is not v2
			view.setInt32(17, compressedChunk.byteLength, alignment === Alignment.LITTLE_ENDIAN); // E0 3A 00 00 / 03 78 64 00
			view.setInt32(21, 0, alignment === Alignment.LITTLE_ENDIAN);
			view.setInt32(25, uncompressedContentSize, alignment === Alignment.LITTLE_ENDIAN);
			view.setInt32(29, 0, alignment === Alignment.LITTLE_ENDIAN);
			view.setInt32(33, compressedChunk.byteLength, alignment === Alignment.LITTLE_ENDIAN);
			view.setInt32(37, 0, alignment === Alignment.LITTLE_ENDIAN);
			view.setInt32(41, uncompressedContentSize, alignment === Alignment.LITTLE_ENDIAN);
			view.setInt32(45, 0, alignment === Alignment.LITTLE_ENDIAN);

			onChunk(chunk);
			chunkSummary.push({
				uncompressedSize: uncompressedContentSize + compressionInfo.chunkHeaderSize,
				compressedSize: compressedChunk.byteLength + compressionInfo.chunkHeaderSize
			});
			handledByte += uncompressedContentSize;
		}

		return chunkSummary;
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
		const chunkSummary = SaveWriter.GenerateCompressedChunksFromData(this.bufferArray, compressionInfo, onBinaryBeforeCompressing, onChunk, this.alignment);

		return chunkSummary;
	}
}
