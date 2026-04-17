import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FCustomVersion } from './FCustomVersion';

export type FCustomVersionContainer = {
    versions: FCustomVersion[];
};

export namespace FCustomVersionContainer {
    export const read = (reader: ContextReader): FCustomVersionContainer => {
        const count = reader.readInt32();
        const versions = new Array(count).fill(0).map(element => FCustomVersion.read(reader));
        return {
            versions
        };
    }

    export const write = (writer: ContextWriter, customVersionContainer: FCustomVersionContainer): void => {
        writer.writeInt32(customVersionContainer.versions.length);
        for (const version of customVersionContainer.versions) {
            FCustomVersion.write(writer, version);
        }
    }
};