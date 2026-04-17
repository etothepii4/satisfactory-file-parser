import { ChunkCompressionInfo } from "../satisfactory/save/save-body-chunks";
import { HierarchyVersion } from "./hierarchical-version-context";

/**
 * Merged Context Type for Saves and Blueprints.
 */
export type ReaderWriterContext = SaveReaderWriterContext & BlueprintReaderWriterContext

/**
 * Context for reading/writing save files.
 * 
 * @param mods describes a list of mod names to their versions. Some mods have special needs.
 */
export type SaveReaderWriterContext = {
    throwErrors: boolean;
    saveHeaderType: number;
    saveVersion: HierarchyVersion;
    buildVersion: number;
    mods: Record<string, string>;
    mapName?: string;
    compressionInfo?: ChunkCompressionInfo;
    packageFileVersionUE5: HierarchyVersion;
}

/**
 * Context for reading/writing blueprint files.
 */
export type BlueprintReaderWriterContext = {
    throwErrors: boolean;
    headerVersion: number;
    saveVersion: HierarchyVersion;
    buildVersion: number;
    blueprintConfigVersion: number;
}