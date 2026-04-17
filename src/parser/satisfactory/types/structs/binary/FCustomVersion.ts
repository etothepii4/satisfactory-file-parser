import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { GUID } from './GUID';

export type FCustomVersion = {
    guid: GUID
    version: number
};

export namespace FCustomVersion {
    export function read(reader: ContextReader): FCustomVersion {
        return {
            guid: GUID.read(reader),
            version: reader.readInt32()
        }
    }

    export function write(writer: ContextWriter, customVersion: FCustomVersion): void {
        GUID.write(writer, customVersion.guid);
        writer.writeInt32(customVersion.version);
    }
};