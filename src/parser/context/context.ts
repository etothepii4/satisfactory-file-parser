import { ChunkCompressionInfo } from "../satisfactory/save/save-body-chunks";

/**
 * Merged Context Type for Saves and Blueprints.
 */
export type ReaderWriterContext = SaveReaderWriterContext & BlueprintReaderWriterContext

/**
 * Context for reading/writing save files.
 */
export type SaveReaderWriterContext = {
    saveHeaderType: number;
    saveVersion: number;
    buildVersion: number;
    mapName?: string;
    compressionInfo?: ChunkCompressionInfo;
}

/**
 * Context for reading/writing blueprint files.
 */
export type BlueprintReaderWriterContext = {
    headerVersion: number;
    saveVersion: number;
    buildVersion: number;
    blueprintConfigVersion: number;
}