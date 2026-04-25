import { ContextReader } from "../../../../context/context-reader";
import { ContextWriter } from "../../../../context/context-writer";
import { ObjectReference } from "../ObjectReference";
import { vec3 } from "../vec3";

export type FConveyorChainSplineSegment = {
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

export namespace FConveyorChainSplineSegment {
    export function read(reader: ContextReader) {
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

        return {
            chainActorRef,
            beltRef,
            splinePoints,
            offsetAtStart,
            startsAtLength,
            endsAtLength,
            firstItemIndex,
            lastItemIndex,
            beltIndexInChain
        } satisfies FConveyorChainSplineSegment;
    }

    export function write(writer: ContextWriter, belt: FConveyorChainSplineSegment) {
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
}