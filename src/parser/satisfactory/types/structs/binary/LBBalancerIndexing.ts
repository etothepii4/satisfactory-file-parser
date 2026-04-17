import { ContextReader } from "../../../../context/context-reader";
import { ContextWriter } from "../../../../context/context-writer";

export type LBBalancerIndexing = {
    mNormalIndex: number;
    mOverflowIndex: number;
    mFilterIndex: number;
}

export namespace LBBalancerIndexing {
    export function read(reader: ContextReader): LBBalancerIndexing {
        return {
            mNormalIndex: reader.readInt32(),
            mOverflowIndex: reader.readInt32(),
            mFilterIndex: reader.readInt32()
        };
    }

    export function write(writer: ContextWriter, handle: LBBalancerIndexing): void {
        writer.writeInt32(handle.mNormalIndex);
        writer.writeInt32(handle.mOverflowIndex);
        writer.writeInt32(handle.mFilterIndex);
    }
};