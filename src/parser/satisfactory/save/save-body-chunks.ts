import Pako from "pako";
import { Alignment } from "../../byte/alignment.enum";
import { CompressionLibraryError, ParserError } from "../../error/parser.error";

export enum CompressionAlgorithmCode {
    ZLIB = 3,
}

export type ChunkCompressionInfo = {
    compressionAlgorithm?: CompressionAlgorithmCode;
    chunkHeaderVersion: number;
    packageFileTag: number;
    maxUncompressedChunkContentSize: number;
}

export type ChunkSummary = {
    uncompressedSize: number,
    compressedSize: number
}


export type SaveBodyChunks = {
    uncompressedData: Uint8Array;
    compressionInfo: ChunkCompressionInfo;
}

export namespace SaveBodyChunks {
    export const HEADER_V1 = 0x00000000;
    export const HEADER_V2 = 0x22222222;

    export const DecompressChunks = (fileBuffer: ArrayBufferLike, alignment = Alignment.LITTLE_ENDIAN): SaveBodyChunks => {

        // slicing filebuffer has to happen outside
        var array = new DataView(fileBuffer);
        let currentByte = 0;

        let maxUncompressedChunkContentSize = 0;
        let packageFileTag = 0;
        let chunkHeaderSize = 0;
        let chunkHeaderVersion = HEADER_V2;
        let compressionAlgorithm = CompressionAlgorithmCode.ZLIB;
        let currentChunks = [];

        do {


            // get chunk header info. We can safely assume it is the same for every chunk
            if (currentChunks.length === 0) {
                packageFileTag = array.getUint32(currentByte, alignment === Alignment.LITTLE_ENDIAN);
                chunkHeaderVersion = array.getUint32(currentByte + 4, alignment === Alignment.LITTLE_ENDIAN);
                chunkHeaderSize = chunkHeaderVersion === HEADER_V1 ? 48 : 49;
                maxUncompressedChunkContentSize = array.getInt32(currentByte + 8, alignment === Alignment.LITTLE_ENDIAN);
                if (chunkHeaderVersion === HEADER_V2) {
                    compressionAlgorithm = array.getUint8(currentByte + 16);
                }
            }

            // TODO: rather is int64. but in JS we have to use bigint, which is cumbersome. Find a way.
            const chunkUncompressedLength = array.getInt32(currentByte + (chunkHeaderVersion === HEADER_V1 ? 24 : 25), alignment === Alignment.LITTLE_ENDIAN);
            const chunkCompressedLength = array.getInt32(currentByte + (chunkHeaderVersion === HEADER_V1 ? 32 : 33), alignment === Alignment.LITTLE_ENDIAN);


            // step to chunk body
            currentByte += chunkHeaderSize;

            try {
                // Inflate chunk body
                let currentInflatedChunk = null;
                currentInflatedChunk = Pako.inflate(new Uint8Array(fileBuffer.slice(currentByte, currentByte + chunkCompressedLength)));
                currentChunks.push(currentInflatedChunk);

                // step to next chunk
                currentByte += chunkCompressedLength;
                fileBuffer = fileBuffer.slice(currentByte);
                array = new DataView(fileBuffer);
                currentByte = 0;

            }
            catch (err) {
                throw new ParserError('ParserError', 'An error occurred while calling pako inflate.' + err);
            }

        } while (currentByte < fileBuffer.byteLength)

        // Create one big chunk out of the little chunks
        let newChunkLength = currentChunks.map<number>(cc => cc.length).reduce((prev, cur) => prev + cur);
        const bigWholeChunk = new Uint8Array(newChunkLength);
        let currentLength = 0;
        for (let i = 0; i < currentChunks.length; i++) {
            bigWholeChunk.set(currentChunks[i], currentLength);
            currentLength += currentChunks[i].length;
        }

        return {
            uncompressedData: bigWholeChunk,
            compressionInfo: {
                chunkHeaderVersion,
                packageFileTag,
                maxUncompressedChunkContentSize,
                compressionAlgorithm
            }
        } satisfies SaveBodyChunks;
    }

    export const CompressDataIntoChunks = (
        bufferArray: ArrayBuffer,
        compressionInfo: ChunkCompressionInfo,
        onBinaryBeforeCompressing: (binary: ArrayBuffer) => void,
        onChunk: (chunk: Uint8Array) => void,
        alignment: Alignment = Alignment.LITTLE_ENDIAN
    ): ChunkSummary[] => {

        const totalUncompressedSize = bufferArray.byteLength;
        const chunkHeaderSize = compressionInfo.chunkHeaderVersion === SaveBodyChunks.HEADER_V1 ? 48 : 49;

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

            const chunk = new Uint8Array(chunkHeaderSize + compressedChunk.byteLength);
            chunk.set(compressedChunk, chunkHeaderSize);

            // write header
            const view = new DataView(chunk.buffer);
            view.setInt32(0, compressionInfo.packageFileTag, alignment === Alignment.LITTLE_ENDIAN);
            view.setInt32(4, compressionInfo.chunkHeaderVersion, alignment === Alignment.LITTLE_ENDIAN);
            view.setInt32(8, compressionInfo.maxUncompressedChunkContentSize, alignment === Alignment.LITTLE_ENDIAN);
            view.setInt32(12, 0, alignment === Alignment.LITTLE_ENDIAN);
            if (compressionInfo.chunkHeaderVersion === HEADER_V2) {
                view.setUint8(16, CompressionAlgorithmCode.ZLIB);
            }
            view.setInt32(compressionInfo.chunkHeaderVersion === HEADER_V1 ? 16 : 17, compressedChunk.byteLength, alignment === Alignment.LITTLE_ENDIAN);
            view.setInt32(compressionInfo.chunkHeaderVersion === HEADER_V1 ? 20 : 21, 0, alignment === Alignment.LITTLE_ENDIAN);
            view.setInt32(compressionInfo.chunkHeaderVersion === HEADER_V1 ? 24 : 25, uncompressedContentSize, alignment === Alignment.LITTLE_ENDIAN);
            view.setInt32(compressionInfo.chunkHeaderVersion === HEADER_V1 ? 28 : 29, 0, alignment === Alignment.LITTLE_ENDIAN);
            view.setInt32(compressionInfo.chunkHeaderVersion === HEADER_V1 ? 32 : 33, compressedChunk.byteLength, alignment === Alignment.LITTLE_ENDIAN);
            view.setInt32(compressionInfo.chunkHeaderVersion === HEADER_V1 ? 36 : 37, 0, alignment === Alignment.LITTLE_ENDIAN);
            view.setInt32(compressionInfo.chunkHeaderVersion === HEADER_V1 ? 40 : 41, uncompressedContentSize, alignment === Alignment.LITTLE_ENDIAN);
            view.setInt32(compressionInfo.chunkHeaderVersion === HEADER_V1 ? 44 : 45, 0, alignment === Alignment.LITTLE_ENDIAN);

            onChunk(chunk);
            chunkSummary.push({
                uncompressedSize: uncompressedContentSize + chunkHeaderSize,
                compressedSize: compressedChunk.byteLength + chunkHeaderSize
            });
            handledByte += uncompressedContentSize;
        }

        return chunkSummary;
    }
}