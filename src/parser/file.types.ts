
export enum CompressionAlgorithmCode {
    ZLIB = 3,
}

export type ChunkCompressionInfo = {
    compressionAlgorithm?: CompressionAlgorithmCode;
    chunkHeaderSize: number;
    packageFileTag: number;
    maxUncompressedChunkContentSize: number;
}

export type ChunkSummary = {
    uncompressedSize: number,
    compressedSize: number
}
