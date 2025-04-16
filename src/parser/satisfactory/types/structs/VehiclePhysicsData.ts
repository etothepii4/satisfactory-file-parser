import { ContextReader } from '../../../context/context-reader';
import { ContextWriter } from '../../../context/context-writer';
import { vec3 } from './vec3';
import { vec4 } from './vec4';

export type VehiclePhysicsData = {
    boneName: string;
    position: vec3;
    rotation: vec4;
    angVelocity: vec3;
    linVelocity: vec3;
    flags: number;
}

export namespace VehiclePhysicsData {
    export const Parse = (reader: ContextReader): VehiclePhysicsData => ({
        boneName: reader.readString(),
        position: vec3.Parse(reader),
        rotation: vec4.Parse(reader),
        angVelocity: vec3.Parse(reader),
        linVelocity: vec3.Parse(reader),
        flags: reader.readByte()
    });

    export const Serialize = (writer: ContextWriter, data: VehiclePhysicsData) => {
        writer.writeString(data.boneName);
        vec3.Serialize(writer, data.position);
        vec4.Serialize(writer, data.rotation);
        vec3.Serialize(writer, data.angVelocity);
        vec3.Serialize(writer, data.linVelocity);
        writer.writeByte(data.flags);
    };
};