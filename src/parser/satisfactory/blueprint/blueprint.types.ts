import { ChunkCompressionInfo } from "../../file.types";
import { SaveComponent } from "../objects/SaveComponent";
import { SaveEntity } from "../objects/SaveEntity";
import { col4, vec3 } from "../structs/util.types";

/** @public */
export interface BlueprintConfig {
    description: string;
    color: col4;
    iconID: number;
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
