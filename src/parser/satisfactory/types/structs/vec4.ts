import { ContextReader } from '../../../context/context-reader';
import { ContextWriter } from '../../../context/context-writer';
import { vec3 } from './vec3';


export type vec4 = vec3 & {
    w: number;
};

export namespace vec4 {
    export const Parse = (reader: ContextReader): vec4 => {
        return {
            ...(vec3.Parse(reader)),
            w: reader.readDouble()
        };
    };

    export const Serialize = (writer: ContextWriter, vec: vec4): void => {
        vec3.Serialize(writer, vec as vec3);
        writer.writeDouble(vec.w);
    };

    export const ParseF = (reader: ContextReader): vec4 => {
        return {
            ...(vec3.ParseF(reader)),
            w: reader.readFloat32()
        };
    };

    export const SerializeF = (writer: ContextWriter, vec: vec4): void => {
        vec3.SerializeF(writer, vec as vec3);
        writer.writeFloat32(vec.w);
    };
}
