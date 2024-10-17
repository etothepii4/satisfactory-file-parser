import { BinaryReadable } from '../../byte/binary-readable.interface';
import { ByteWriter } from '../../byte/byte-writer.class';
import { ObjectReference } from '../types/structs/ObjectReference';

export namespace ObjectReferencesList {

    export const SerializeList = (writer: ByteWriter, collectables: ObjectReference[]): void => {
        writer.writeInt32(collectables.length);
        for (const collectable of collectables) {
            ObjectReference.write(writer, collectable);
        }
    }

    export const ReadList = (reader: BinaryReadable): ObjectReference[] => {
        const collected: ObjectReference[] = [];
        let count = reader.readInt32();
        for (let i = 0; i < count; i++) {
            collected.push(ObjectReference.read(reader));
        }
        return collected;
    }
}