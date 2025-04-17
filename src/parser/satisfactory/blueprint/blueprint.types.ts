import { ChunkCompressionInfo } from "../../file.types";
import { SaveComponent } from "../types/objects/SaveComponent";
import { SaveEntity } from "../types/objects/SaveEntity";
import { BlueprintConfig } from './blueprint-config';
import { BlueprintHeader } from './blueprint-header';

/** @public */
export interface Blueprint {
    name: string;
    compressionInfo: ChunkCompressionInfo;
    header: BlueprintHeader;
    config: BlueprintConfig;
    objects: (SaveEntity | SaveComponent)[];
}
