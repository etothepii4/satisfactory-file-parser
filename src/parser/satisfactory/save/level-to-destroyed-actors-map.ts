import { ContextReader } from '../../context/context-reader';
import { ContextWriter } from '../../context/context-writer';
import { ObjectReference } from '../types/structs/ObjectReference';

export type LevelToDestroyedActorsMap = Record<string, ObjectReference[]>;

export namespace LevelToDestroyedActorsMap {
    export const read = (reader: ContextReader): LevelToDestroyedActorsMap => {
        const count = reader.readInt32();
        const map: Record<string, ObjectReference[]> = {};
        for (let i = 0; i < count; i++) {
            const key = reader.readString();
            const elements: ObjectReference[] = [];
            const elementCount = reader.readInt32();
            for (let j = 0; j < elementCount; j++) {
                elements.push(ObjectReference.read(reader));
            }
            map[key] = elements;
        }
        return map;
    }

    export const write = (writer: ContextWriter, map: LevelToDestroyedActorsMap) => {
        writer.writeInt32(Object.keys(map).length);
        for (const entry of Object.entries(map)) {
            writer.writeString(entry[0]);

            writer.writeInt32(Object.keys(entry[1]).length);
            for (const actor of entry[1]) {
                ObjectReference.write(writer, actor);
            }
        }
    }
}