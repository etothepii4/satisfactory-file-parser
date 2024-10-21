import { BinaryReadable } from '../../../byte/binary-readable.interface';
import { BinaryWritable } from '../../../byte/binary-writable.interface';
import { vec2 } from './vec2';


export type vec3 = vec2 & {
    z: number;
};

export namespace vec3 {
    export const Parse = (reader: BinaryReadable): vec3 => {
        return {
            ...(vec2.Parse(reader)),
            z: reader.readDouble()
        };
    };

    export const Serialize = (writer: BinaryWritable, vec: vec3): void => {
        vec2.Serialize(writer, vec as vec2);
        writer.writeDouble(vec.z);
    };

    export const ParseInt = (reader: BinaryReadable): vec3 => {
        return {
            x: reader.readInt32(),
            y: reader.readInt32(),
            z: reader.readInt32()
        };
    };

    export const SerializeInt = (writer: BinaryWritable, vec: vec3): void => {
        writer.writeInt32(vec.x);
        writer.writeInt32(vec.y);
        writer.writeInt32(vec.z);
    };

    export const ParseF = (reader: BinaryReadable): vec3 => {
        return {
            ...(vec2.ParseF(reader)),
            z: reader.readFloat32()
        };
    };

    export const SerializeF = (writer: BinaryWritable, vec: vec3): void => {
        vec2.SerializeF(writer, vec as vec2);
        writer.writeFloat32(vec.z);
    };


    export const sub = (other: vec3, vec: vec3): vec3 => ({ x: other.x - vec.x, y: other.y - vec.y, z: other.z - vec.z });
    export const add = (vec: vec3, other: vec3): vec3 => ({ x: vec.x + other.x, y: vec.y + other.y, z: vec.z + other.z });
    export const length = (vec: vec3): number => Math.sqrt(vec.x ** 2 + vec.y ** 2 + vec.z ** 2);
    export const mult = (vec: vec3, scale: number): vec3 => ({ x: vec.x * scale, y: vec.y * scale, z: vec.z * scale });
    export const norm = (vec: vec3): vec3 => mult(vec, 1. / length(vec));

}
