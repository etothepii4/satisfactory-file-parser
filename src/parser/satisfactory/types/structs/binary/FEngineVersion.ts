import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';

export type FEngineVersion = {
    major: number;
    minor: number;
    patch: number;
    changelist: number;
    branch: string;
};

export namespace FEngineVersion {
    export const read = (reader: ContextReader): FEngineVersion => {
        return {
            major: reader.readUint16(),
            minor: reader.readUint16(),
            patch: reader.readUint16(),
            changelist: reader.readUint32(),
            branch: reader.readString()
        }
    }

    export const write = (writer: ContextWriter, engineVersion: FEngineVersion): void => {
        writer.writeUint16(engineVersion.major);
        writer.writeUint16(engineVersion.minor);
        writer.writeUint16(engineVersion.patch);
        writer.writeUint32(engineVersion.changelist);
        writer.writeString(engineVersion.branch);
    }
};