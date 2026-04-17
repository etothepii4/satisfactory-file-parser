import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';

export type FPropertyTagNode = {
    name: string;
    children: FPropertyTagNode[];
};

export namespace FPropertyTagNode {
    export function read(reader: ContextReader): FPropertyTagNode {
        const name = reader.readString();
        const count = reader.readInt32();
        const children = new Array(count).fill('0').map(() => FPropertyTagNode.read(reader));
        return {
            name,
            children
        }
    }

    export function write(writer: ContextWriter, node: FPropertyTagNode): void {
        writer.writeString(node.name);
        writer.writeInt32(node.children.length);
        for (const child of node.children) {
            FPropertyTagNode.write(writer, child);
        }
    }
};