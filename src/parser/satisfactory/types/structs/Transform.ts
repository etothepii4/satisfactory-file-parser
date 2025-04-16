import { ContextReader } from '../../../context/context-reader';
import { ContextWriter } from '../../../context/context-writer';
import { vec3 } from './vec3';
import { vec4 } from './vec4';


export type Transform = {
    rotation: vec4;
    translation: vec3;
    scale3d: vec3;
};

export namespace Transform {
    export const ParseF = (reader: ContextReader): Transform => {
        return {
            rotation: vec4.ParseF(reader),
            translation: vec3.ParseF(reader),
            scale3d: vec3.ParseF(reader),
        };
    };

    export const Parse = (reader: ContextReader): Transform => {
        return {
            rotation: vec4.Parse(reader),
            translation: vec3.Parse(reader),
            scale3d: vec3.Parse(reader),
        };
    };

    export const Serialize = (writer: ContextWriter, transform: Transform): void => {
        vec4.Serialize(writer, transform.rotation);
        vec3.Serialize(writer, transform.translation);
        vec3.Serialize(writer, transform.scale3d);
    };

    export const SerializeF = (writer: ContextWriter, transform: Transform): void => {
        vec4.SerializeF(writer, transform.rotation);
        vec3.SerializeF(writer, transform.translation);
        vec3.SerializeF(writer, transform.scale3d);
    };
}
