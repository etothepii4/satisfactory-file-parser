import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';

/**
 * specific binary struct.
 */
export type FLBBalancerIndexing = {
    mNormalIndex: number;
    mOverflowIndex: number;
    mFilterIndex: number;
};

export namespace FLBBalancerIndexing {
    export const read = (reader: ContextReader): FLBBalancerIndexing => {
        return {
            mNormalIndex: reader.readInt32(),
            mOverflowIndex: reader.readInt32(),
            mFilterIndex: reader.readInt32(),
        };
    }

    export const write = (writer: ContextWriter, value: FLBBalancerIndexing): void => {
        writer.writeInt32(value.mNormalIndex);
        writer.writeInt32(value.mOverflowIndex);
        writer.writeInt32(value.mFilterIndex);
    }
};