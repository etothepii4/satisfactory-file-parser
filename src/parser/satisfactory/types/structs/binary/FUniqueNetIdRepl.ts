import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';

export type FUniqueNetIdRepl = {
    flags: number;
    rawData: number[];
};

export namespace FUniqueNetIdRepl {
    export function read(reader: ContextReader, size: number): FUniqueNetIdRepl {
        const flags = 0;//reader.readUint8();
        //TODO interpret?
        const rawData = Array.from(reader.readBytes(size));
        return {
            flags,
            rawData
        }
    }

    export function write(writer: ContextWriter, replId: FUniqueNetIdRepl): void {
        writer.writeBytes(new Uint8Array(replId.rawData));
    }
};