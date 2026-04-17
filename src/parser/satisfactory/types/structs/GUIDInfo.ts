import { ContextReader } from '../../../context/context-reader';
import { ContextWriter } from '../../../context/context-writer';
import { GUID } from './binary/GUID';


/**
 * contains a flag whether the Guid is valid, and the Guid itself if valid.
 */
export type OptionalGUID = undefined | GUID;

export namespace OptionalGUID {
    export const read = (reader: ContextReader): OptionalGUID => {
        // means whether it has guid.
        if (reader.readByte() === 1) {
            return GUID.read(reader);
        } else {
            return undefined;
        }
    }

    export const write = (writer: ContextWriter, guid: OptionalGUID): void => {
        if (guid === undefined) {
            writer.writeByte(0);
            return;
        } else {
            writer.writeByte(1);
            GUID.write(writer, guid);
        }
    }
};