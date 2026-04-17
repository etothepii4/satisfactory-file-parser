import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';

export type FPackageFileVersion = {
    ue4Version: number;
    ue5Version: number;
};

export namespace FPackageFileVersion {
    export const read = (reader: ContextReader): FPackageFileVersion => {
        return {
            ue4Version: reader.readInt32(),
            ue5Version: reader.readInt32(),
        }
    }

    export const write = (writer: ContextWriter, packageFileVersion: FPackageFileVersion): void => {
        writer.writeInt32(packageFileVersion.ue4Version);
        writer.writeInt32(packageFileVersion.ue5Version);
    }
};