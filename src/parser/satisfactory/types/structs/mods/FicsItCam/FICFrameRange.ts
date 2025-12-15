import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';

export type FICFrameRange = {
    begin: string;
    end: string;
};

/**
 * declared at https://github.com/Panakotta00/FicsIt-Cam/blob/master/Source/FicsItCam/Public/Data/FICTypes.h#35
 */
export namespace FICFrameRange {

    export const read = (reader: ContextReader): FICFrameRange => {
        return {
            begin: reader.readInt64().toString(),
            end: reader.readInt64().toString(),
        };
    };

    export const write = (writer: ContextWriter, value: FICFrameRange): void => {
        writer.writeInt64(BigInt(value.begin));
        writer.writeInt64(BigInt(value.end));
    };
}
