import { MD5Hash } from '../objects/ue/MD5Hash';

/** @public */
export interface ModData {
    Reference: string;
    Name: string;
    Version: string;
}

/** @public */
export interface SatisfactoryModMetadata {
    Version: number;
    FullMapName: string;
    Mods: ModData[];
}

/** @public */
export interface SatisfactorySaveHeader {
    saveHeaderType: number;
    saveVersion: number;
    buildVersion: number;
    mapName: string;
    mapOptions: string;
    sessionName: string;
    playDurationSeconds: number;
    saveDateTime: string;
    sessionVisibility: number;
    rawModMetadataString?: string;
    modMetadata?: SatisfactoryModMetadata;
    isModdedSave?: number;
    saveIdentifier?: string;
    fEditorObjectVersion?: number;
    partitionEnabledFlag?: boolean;
    consistencyHashBytes?: MD5Hash;
    creativeModeEnabled?: boolean;
}

/** @public */
export type RoughSaveVersion = '<U6' | 'U6/U7' | 'U8' | 'U1.0+';