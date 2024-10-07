import { ChunkCompressionInfo } from "../../file.types";
import { SaveComponent } from "../types/objects/SaveComponent";
import { SaveEntity } from "../types/objects/SaveEntity";
import { col4 } from '../types/structs/col4';
import { vec3 } from '../types/structs/vec3';

/** @public */
export interface BlueprintConfig {
    description: string;
    color: col4;
    iconID: number;
    referencedIconLibrary?: string;
    iconLibraryType?: string;
}

/** @public */
export type BlueprintHeader = {
    designerDimension?: vec3;
    itemCosts: [string, number][];
    recipeReferences: string[];
}

/** @public */
export interface Blueprint {
    name: string;
    compressionInfo: ChunkCompressionInfo;
    header: BlueprintHeader;
    config: BlueprintConfig;
    objects: (SaveEntity | SaveComponent)[];
}
