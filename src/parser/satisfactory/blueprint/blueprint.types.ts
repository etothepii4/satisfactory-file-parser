import { ChunkCompressionInfo } from "../../file.types";
import { SaveComponent } from "../types/objects/SaveComponent";
import { SaveEntity } from "../types/objects/SaveEntity";
import { col4 } from '../types/structs/col4';
import { BlueprintHeader } from './blueprint-header';

/** @public */
export interface BlueprintConfig {
    configVersion: number;
    description: string;
    color: col4;
    iconID: number;
    referencedIconLibrary?: string;
    iconLibraryType?: string;
}

/** @public */
export interface Blueprint {
    name: string;
    compressionInfo: ChunkCompressionInfo;
    header: BlueprintHeader;
    config: BlueprintConfig;
    objects: (SaveEntity | SaveComponent)[];
}
