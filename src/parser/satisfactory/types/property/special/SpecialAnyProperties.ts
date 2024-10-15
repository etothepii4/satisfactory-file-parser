import { ObjectReference } from '../../structs/ObjectReference';
import { Transform } from '../../structs/Transform';
import { vec2 } from '../../structs/vec2';
import { vec3 } from '../../structs/vec3';


export type SpecialAnyProperties = EmptySpecialProperties | PowerLineSpecialProperties | PlayerSpecialProperties | ConveyorChainActorSpecialProperties | BuildableSubsystemSpecialProperties;

export type EmptySpecialProperties = {

};

export type PowerLineSpecialProperties = {
    source: ObjectReference;
    target: ObjectReference;
    sourceTranslation?: vec3;
    targetTranslation?: vec3;
};

export type PlayerSpecialProperties = {
    flag: number;
    eosData?: string;
    steamPlayerData?: string;
};

export type ConveyorItemSpecialProperties = {
    position: number;
    itemName: string;
};

export type ConveyorChainSegmentSpecialProperties = {
    chainActorRef: ObjectReference;
    beltRef: ObjectReference;
    someCount: number;
    unknownUseBytes: number[];
    firstItemIndex: number;
    lastItemIndex: number;
    beltIndexInChain: number;
}

export type ConveyorChainActorSpecialProperties = {
    firstBelt: ObjectReference;
    lastBelt: ObjectReference;
    beltsInChain: ConveyorChainSegmentSpecialProperties[];
    unknownInts: [number, number];
    firstChainItemIndex: number;
    lastChainItemIndex: number;
    items: ConveyorItemSpecialProperties[];
};

export type BuildableTypeInstance = {
    transform: Transform;
    unknownUseNumbers: [vec2, vec3];
    swatchSlotTypePath: string;
    paintFinishPath: string;
    recipeTypePath: string;
    patternPath: string;
    blueprintProxy: ObjectReference;
};

export type BuildableSubsystemSpecialProperties = {
    buildables: {
        typePath: string;
        instances: BuildableTypeInstance[];
    }[];
};
