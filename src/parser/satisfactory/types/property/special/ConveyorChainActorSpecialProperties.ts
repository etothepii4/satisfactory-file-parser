import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { ObjectReference } from '../../structs/ObjectReference';
import { vec3 } from '../../structs/vec3';



export const isConveyorChainActorSpecialProperties = (obj: any): obj is ConveyorChainActorSpecialProperties => obj.type === 'CircuiConveyorChainActorSpecialPropertiestSpecialProperties';

export type ConveyorChainActorSpecialProperties = {
    type: 'ConveyorChainActorSpecialProperties';
    firstBelt: ObjectReference;
    lastBelt: ObjectReference;
    beltsInChain: ConveyorChainSegmentSpecialProperties[];
    totalLength: number;
    totalNumberItemsMaybe: number;
    firstChainItemIndex: number;
    lastChainItemIndex: number;
    items: ConveyorItemSpecialProperties[];
};

export namespace ConveyorChainActorSpecialProperties {
    export const Parse = (reader: BinaryReadable): ConveyorChainActorSpecialProperties => {

        const lastBelt = ObjectReference.read(reader);
        const firstBelt = ObjectReference.read(reader);
        const countBeltsInChain = reader.readInt32();

        const beltsInChain: ConveyorChainSegmentSpecialProperties[] = [];
        for (let i = 0; i < countBeltsInChain; i++) {
            const chainActorRef = ObjectReference.read(reader);
            const beltRef = ObjectReference.read(reader);
            const splinePointsCount = reader.readInt32();

            const splinePoints: { location: vec3; arriveTangent: vec3; leaveTangent: vec3; }[] = [];
            for (let j = 0; j < splinePointsCount; j++) {
                splinePoints.push({
                    location: vec3.Parse(reader),
                    arriveTangent: vec3.Parse(reader),
                    leaveTangent: vec3.Parse(reader),
                });
            }

            // indices which items of this chain are on this belt.
            const offsetAtStart = reader.readFloat32();
            const startsAtLength = reader.readFloat32();
            const endsAtLength = reader.readFloat32();
            const firstItemIndex = reader.readInt32();
            const lastItemIndex = reader.readInt32();
            const beltIndexInChain = reader.readInt32();

            beltsInChain.push({
                chainActorRef,
                beltRef,
                splinePoints,
                offsetAtStart,
                startsAtLength,
                endsAtLength,
                firstItemIndex,
                lastItemIndex,
                beltIndexInChain
            });
        }

        const totalLength = reader.readFloat32();
        const totalNumberItemsMaybe = reader.readInt32();

        const firstChainItemIndex = reader.readInt32();
        const lastChainItemIndex = reader.readInt32();
        const countItemsInChain = reader.readInt32();

        const items: ConveyorItemSpecialProperties[] = [];
        for (let n = 0; n < countItemsInChain; n++) {
            const item = ObjectReference.read(reader);
            reader.readInt32(); //0
            const position = reader.readInt32();
            items.push({ itemReference: item, position });
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

    export const Serialize = (writer: ByteWriter, property: ConveyorChainActorSpecialProperties) => {

        ObjectReference.write(writer, property.lastBelt);
        ObjectReference.write(writer, property.firstBelt);
        writer.writeInt32(property.beltsInChain.length);

        for (const belt of property.beltsInChain) {
            ObjectReference.write(writer, belt.chainActorRef);
            ObjectReference.write(writer, belt.beltRef);
            writer.writeInt32(belt.splinePoints.length);


            for (const splinepoint of belt.splinePoints) {
                vec3.Serialize(writer, splinepoint.location);
                vec3.Serialize(writer, splinepoint.arriveTangent);
                vec3.Serialize(writer, splinepoint.leaveTangent);
            }

            writer.writeFloat32(belt.offsetAtStart);
            writer.writeFloat32(belt.startsAtLength);
            writer.writeFloat32(belt.endsAtLength);
            writer.writeInt32(belt.firstItemIndex);
            writer.writeInt32(belt.lastItemIndex);
            writer.writeInt32(belt.beltIndexInChain);
        }

        writer.writeInt32(property.totalLength);
        writer.writeInt32(property.totalNumberItemsMaybe);
        writer.writeInt32(property.firstChainItemIndex);
        writer.writeInt32(property.lastChainItemIndex);
        writer.writeInt32(property.items.length);

        for (const item of property.items) {
            ObjectReference.write(writer, item.itemReference);
            writer.writeInt32(0);
            writer.writeInt32(item.position);
        }
    };
}
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
};
export type ConveyorItemSpecialProperties = {
    position: number;
    itemReference: ObjectReference;
};

