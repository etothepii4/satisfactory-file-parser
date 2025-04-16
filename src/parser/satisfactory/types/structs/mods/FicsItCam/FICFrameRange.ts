import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';

export type FICFrameRange = {
    begin: string;
    end: string;
};

export namespace FICFrameRange {

    export const Parse = (reader: ContextReader): FICFrameRange => {
        return {
            begin: reader.readInt64().toString(),
            end: reader.readInt64().toString(),
        };
    };

    export const Serialize = (writer: ContextWriter, value: FICFrameRange): void => {
        writer.writeInt64(BigInt(value.begin));
        writer.writeInt64(BigInt(value.end));
    };
}
