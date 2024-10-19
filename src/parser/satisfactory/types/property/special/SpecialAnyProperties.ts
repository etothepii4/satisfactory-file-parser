import { col4 } from '../../structs/col4';
import { ObjectReference } from '../../structs/ObjectReference';
import { Transform } from '../../structs/Transform';
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
    splinePoints: {
        location: vec3;
        arriveTangent: vec3;
        leaveTangent: vec3;
    }[];
    offsetAtStart: number;
    startsAtLength: number;
    endsAtLength: number;
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
    primaryColor: col4;
    secondaryColor: col4;
    usedSwatchSlot: ObjectReference;
    usedPattern: ObjectReference;
    usedMaterial: ObjectReference;
    usedSkin: ObjectReference;
    usedPaintFinish: ObjectReference;
    patternRotation: number;
    usedRecipe: ObjectReference;
    blueprintProxy: ObjectReference;
};

export type BuildableSubsystemSpecialProperties = {
    buildables: {
        typePath: string;
        instances: BuildableTypeInstance[];
    }[];
};
