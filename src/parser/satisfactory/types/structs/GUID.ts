import { ContextReader } from '../../../context/context-reader';
import { ContextWriter } from '../../../context/context-writer';

/**
 * UE Guid structure, 4 uints.
 */
export type GUID = [number, number, number, number];

export namespace GUID {
    export const read = (reader: ContextReader): GUID => {
        return [
            reader.readUint32(),
            reader.readUint32(),
            reader.readUint32(),
            reader.readUint32(),
        ];
    }

    export const write = (writer: ContextWriter, guid: GUID): void => {
        writer.writeUint32(guid[0]);
        writer.writeUint32(guid[1]);
        writer.writeUint32(guid[2]);
        writer.writeUint32(guid[3]);
    }
};