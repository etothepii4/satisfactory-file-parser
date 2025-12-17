import { ContextReader } from "../../../../../context/context-reader";
import { ContextWriter } from "../../../../../context/context-writer";
import { ObjectReference } from "../../ObjectReference";

export type FINNetworkTrace = {
    reference: ObjectReference;
    previous?: FINNetworkTrace;
    step?: string;
};

/**
 *  declared at https://github.com/Panakotta00/FicsIt-Networks/blob/789c32fdc857fc9971f7f73fbbf3789c64f637bc/Source/FicsItReflection/Public/FIRTrace.h#L28
 */
export namespace FINNetworkTrace {

    export const read = (reader: ContextReader): FINNetworkTrace => {
        const firTrace: FINNetworkTrace = {
            reference: ObjectReference.read(reader)
        };

        const hasPrevious = reader.readInt32() >= 1;
        if (hasPrevious) {
            firTrace.previous = FINNetworkTrace.read(reader);
        }

        const hasStep = reader.readInt32() >= 1;
        if (hasStep) {
            firTrace.step = reader.readString();
        }

        return firTrace;
    }

    export const write = (writer: ContextWriter, firTrace: FINNetworkTrace): void => {
        ObjectReference.write(writer, firTrace.reference)

        const hasPrevious = firTrace.previous !== undefined;
        writer.writeInt32(hasPrevious ? 1 : 0);
        if (hasPrevious) {
            FINNetworkTrace.write(writer, firTrace.previous!);
        }

        const hasStep = firTrace.step !== undefined;
        writer.writeInt32(hasStep ? 1 : 0);
        if (hasStep) {
            writer.writeString(firTrace.step!);
        }
    }
}