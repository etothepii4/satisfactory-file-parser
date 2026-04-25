import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FConveyorBeltItem } from '../../structs/binary/FConveyorBeltItem';
import { FConveyorChainSplineSegment } from '../../structs/binary/FConveyorChainSplineSegment';
import { ObjectReference } from '../../structs/ObjectReference';


export const isConveyorChainActorSpecialProperties = (obj: any): obj is ConveyorChainActorSpecialProperties => obj.type === 'ConveyorChainActorSpecialProperties';

export type ConveyorChainActorSpecialProperties = {
    type: 'ConveyorChainActorSpecialProperties';
    firstBelt: ObjectReference;
    lastBelt: ObjectReference;
    beltsInChain: FConveyorChainSplineSegment[];
    totalLength: number;
    totalNumberItemsMaybe: number;
    firstChainItemIndex: number;
    lastChainItemIndex: number;
    items: FConveyorBeltItem[];
};

export namespace ConveyorChainActorSpecialProperties {
    export const Parse = (reader: ContextReader): ConveyorChainActorSpecialProperties => {

        const lastBelt = ObjectReference.read(reader);
        const firstBelt = ObjectReference.read(reader);
        const countBeltsInChain = reader.readInt32();

        const beltsInChain: FConveyorChainSplineSegment[] = [];
        for (let i = 0; i < countBeltsInChain; i++) {
            beltsInChain.push(FConveyorChainSplineSegment.read(reader));
        }

        const totalLength = reader.readFloat32();
        const totalNumberItemsMaybe = reader.readInt32();

        const firstChainItemIndex = reader.readInt32();
        const lastChainItemIndex = reader.readInt32();
        const countItemsInChain = reader.readInt32();

        const items: FConveyorBeltItem[] = [];
        for (let n = 0; n < countItemsInChain; n++) {
            items.push(FConveyorBeltItem.read(reader));
        }

        return {
            type: 'ConveyorChainActorSpecialProperties',
            firstBelt: firstBelt,
            lastBelt: lastBelt,
            beltsInChain,
            totalLength,
            totalNumberItemsMaybe,
            firstChainItemIndex,
            lastChainItemIndex,
            items
        };
    };

    export const Serialize = (writer: ContextWriter, property: ConveyorChainActorSpecialProperties): void => {

        ObjectReference.write(writer, property.lastBelt);
        ObjectReference.write(writer, property.firstBelt);
        writer.writeInt32(property.beltsInChain.length);

        for (const belt of property.beltsInChain) {
            FConveyorChainSplineSegment.write(writer, belt);
        }

        writer.writeFloat32(property.totalLength);
        writer.writeInt32(property.totalNumberItemsMaybe);
        writer.writeInt32(property.firstChainItemIndex);
        writer.writeInt32(property.lastChainItemIndex);
        writer.writeInt32(property.items.length);

        for (const item of property.items) {
            FConveyorBeltItem.write(writer, item);
        }
    };
}
