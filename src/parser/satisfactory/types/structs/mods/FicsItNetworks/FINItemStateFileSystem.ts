import { ContextReader } from "../../../../../context/context-reader";
import { ContextWriter } from "../../../../../context/context-writer";
import { FGDynamicStruct } from "../../FGDynamicStruct";
import { ObjectReference } from "../../ObjectReference";

/**
 * specifically the FileSystem item state of the FicsItNetworks mod has just raw bytes.
 */
export type FINItemStateFileSystem = number[];

export namespace FINItemStateFileSystem {

    export const ExactStructReference: ObjectReference = {
        levelName: '',
        pathName: '/Script/FicsItNetworksComputer.FINItemStateFileSystem'
    };

    export const IsFINItemStateFileSystem = (struct: FGDynamicStruct): boolean => {
        return ObjectReference.IsEqual(struct.structReference!, ExactStructReference);
    }

    export const Parse = (reader: ContextReader): FINItemStateFileSystem => {
        const numBytes = reader.readInt32();
        return Array.from(reader.readBytes(numBytes));
    }

    export const Serialize = (writer: ContextWriter, rawBytes: FINItemStateFileSystem): void => {
        writer.writeBytesArray(rawBytes);
    }
}