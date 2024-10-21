import { BinaryReadable } from '../../../byte/binary-readable.interface';
import { BinaryWritable } from '../../../byte/binary-writable.interface';


export type col4 = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export namespace col4 {
    export const SerializeRGBA = (writer: BinaryWritable, value: col4): void => {
        writer.writeFloat32(value.r);
        writer.writeFloat32(value.g);
        writer.writeFloat32(value.b);
        writer.writeFloat32(value.a);
    };

    export const ParseRGBA = (reader: BinaryReadable): col4 => {
        return {
            r: reader.readFloat32(),
            g: reader.readFloat32(),
            b: reader.readFloat32(),
            a: reader.readFloat32(),
        };
    };

    export const SerializeBGRA = (writer: BinaryWritable, value: col4): void => {
        writer.writeByte(value.b);
        writer.writeByte(value.g);
        writer.writeByte(value.r);
        writer.writeByte(value.a);
    };

    export const ParseBGRA = (reader: BinaryReadable): col4 => {
        return {
            b: reader.readByte(),
            g: reader.readByte(),
            r: reader.readByte(),
            a: reader.readByte(),
        };
    };
}
