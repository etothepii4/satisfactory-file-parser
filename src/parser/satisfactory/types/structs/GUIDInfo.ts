import { BinaryReadable } from '../../../byte/binary-readable.interface';
import { BinaryWritable } from '../../../byte/binary-writable.interface';
import { GUID } from './GUID';

export type GUIDInfo = undefined | GUID;

export namespace GUIDInfo {
    export const read = (reader: BinaryReadable): GUIDInfo => {
        // means whether it has guid.
        if (reader.readByte() === 1) {
            return GUID.read(reader);
        } else {
            return undefined;
        }
    }

    export const write = (writer: BinaryWritable, guid: GUIDInfo): void => {
        if (guid === undefined) {
            writer.writeByte(0);
            return;
        } else {
            writer.writeByte(1);
            GUID.write(writer, guid);
        }
    }
};