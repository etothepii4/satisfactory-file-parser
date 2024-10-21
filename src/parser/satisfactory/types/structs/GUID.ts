import { BinaryReadable } from '../../../byte/binary-readable.interface';
import { BinaryWritable } from '../../../byte/binary-writable.interface';

export type GUID = [number, number, number, number];

export namespace GUID {
    export const read = (reader: BinaryReadable): GUID => {
        return [
            reader.readUint32(),
            reader.readUint32(),
            reader.readUint32(),
            reader.readUint32(),
        ];
    }

    export const write = (writer: BinaryWritable, guid: GUID): void => {
        writer.writeUint32(guid[0]);
        writer.writeUint32(guid[1]);
        writer.writeUint32(guid[2]);
        writer.writeUint32(guid[3]);
    }
};