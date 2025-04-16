import { ContextReader } from '../../context/context-reader';
import { ContextWriter } from '../../context/context-writer';
import { ObjectReference } from '../types/structs/ObjectReference';

export namespace ObjectReferencesList {

    export const SerializeList = (writer: ContextWriter, collectables: ObjectReference[]): void => {
        writer.writeInt32(collectables.length);
        for (const collectable of collectables) {
            ObjectReference.write(writer, collectable);
        }
    }

    export const ReadList = (reader: ContextReader): ObjectReference[] => {
        const collected: ObjectReference[] = [];
        let count = reader.readInt32();
        for (let i = 0; i < count; i++) {
            collected.push(ObjectReference.read(reader));
        }
        return collected;
    }
}