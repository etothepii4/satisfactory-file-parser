import { ContextReader } from '../../../context/context-reader';
import { ContextWriter } from '../../../context/context-writer';


/**
 * a 4-component color. can be encoded as 16 bytes RGBA or 4 bytes BGRA.
 */
export type col4 = {
    r: number;
    g: number;
    b: number;
    a: number;
};

export namespace col4 {
    export const SerializeRGBA = (writer: ContextWriter, value: col4): void => {
        writer.writeFloat32(value.r);
        writer.writeFloat32(value.g);
        writer.writeFloat32(value.b);
        writer.writeFloat32(value.a);
    };

    export const ParseRGBA = (reader: ContextReader): col4 => {
        return {
            r: reader.readFloat32(),
            g: reader.readFloat32(),
            b: reader.readFloat32(),
            a: reader.readFloat32(),
        };
    };

    export const SerializeBGRA = (writer: ContextWriter, value: col4): void => {
        writer.writeByte(value.b);
        writer.writeByte(value.g);
        writer.writeByte(value.r);
        writer.writeByte(value.a);
    };

    export const ParseBGRA = (reader: ContextReader): col4 => {
        return {
            b: reader.readByte(),
            g: reader.readByte(),
            r: reader.readByte(),
            a: reader.readByte(),
        };
    };
}
