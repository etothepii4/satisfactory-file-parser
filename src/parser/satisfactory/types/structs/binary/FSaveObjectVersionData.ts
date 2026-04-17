import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FCustomVersionContainer } from './FCustomVersionContainer';
import { FEngineVersion } from './FEngineVersion';
import { FPackageFileVersion } from './FPackageFileVersion';

export type FSaveObjectVersionData = {
    saveObjectVersionDataVersion: number;
    packageFileVersion: FPackageFileVersion;
    licenceVersion: number;
    engineVersion: FEngineVersion;
    customVersionContainer: FCustomVersionContainer;
};

export namespace FSaveObjectVersionData {
    export const read = (reader: ContextReader): FSaveObjectVersionData => {
        return {
            saveObjectVersionDataVersion: reader.readUint32(),
            packageFileVersion: FPackageFileVersion.read(reader),
            licenceVersion: reader.readInt32(),
            engineVersion: FEngineVersion.read(reader),
            customVersionContainer: FCustomVersionContainer.read(reader)
        };
    }

    export const write = (writer: ContextWriter, data: FSaveObjectVersionData): void => {
        writer.writeUint32(data.saveObjectVersionDataVersion);
        FPackageFileVersion.write(writer, data.packageFileVersion);
        writer.writeInt32(data.licenceVersion);
        FEngineVersion.write(writer, data.engineVersion);
        FCustomVersionContainer.write(writer, data.customVersionContainer);
    }
};