
/** @public */
export type ModData = {
    Reference: string;
    Name: string;
    Version: string;
}

/** @public */
export type SatisfactoryModMetadata = {
    Version: number;
    FullMapName: string;
    Mods: ModData[];
}

/** @public */
export type RoughSaveVersion = '<U6' | 'U6/U7' | 'U8' | 'U1.0' | 'U1.1+';