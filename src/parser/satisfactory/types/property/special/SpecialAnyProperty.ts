import { ObjectReference } from '../../structs/ObjectReference';
import { Transform } from '../../structs/Transform';
import { vec2 } from '../../structs/vec2';
import { vec3 } from '../../structs/vec3';


export type SpecialAnyProperty = EmptySpecialProperty | PowerLineSpecialProperty | PlayerSpecialProperty | ConveyorChainActorSpecialProperty | BuildableSubsystemSpecialProperty;

export type EmptySpecialProperty = {

};

export type PowerLineSpecialProperty = {
    source: ObjectReference;
    target: ObjectReference;
    sourceTranslation?: vec3;
    targetTranslation?: vec3;
};

export type PlayerSpecialProperty = {
    flag: number;
    eosData?: string;
    steamPlayerData?: string;
};

export type ConveyorItemSpecialProperty = {
    position: number;
    itemName: string;
};

export type ConveyorChainSegmentSpecialProperty = {
    chainActorRef: ObjectReference;
    beltRef: ObjectReference;
    someCount: number;
    unknownUseBytes: number[];
    firstItemIndex: number;
    lastItemIndex: number;
    beltIndexInChain: number;
}

export type ConveyorChainActorSpecialProperty = {
    firstBelt: ObjectReference;
    lastBelt: ObjectReference;
    beltsInChain: ConveyorChainSegmentSpecialProperty[];
    unknownInts: [number, number];
    firstChainItemIndex: number;
    lastChainItemIndex: number;
    items: ConveyorItemSpecialProperty[];
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

export type BuildableSubsystemSpecialProperty = {
    buildables: {
        typePath: string;
        instances: BuildableTypeInstance[];
    }[];
};
