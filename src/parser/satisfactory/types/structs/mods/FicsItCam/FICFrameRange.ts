import { BinaryReadable } from '../../../../../byte/binary-readable.interface';
import { BinaryWritable } from '../../../../../byte/binary-writable.interface';

export type FICFrameRange = {
    begin: string;
    end: string;
};

export namespace FICFrameRange {

    export const Parse = (reader: BinaryReadable): FICFrameRange => {
        return {
            begin: reader.readInt64().toString(),
            end: reader.readInt64().toString(),
        };
    };

    export const Serialize = (writer: BinaryWritable, value: FICFrameRange): void => {
        writer.writeInt64(BigInt(value.begin));
        writer.writeInt64(BigInt(value.end));
    };
}
