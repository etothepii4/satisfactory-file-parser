import { ContextReader } from "../../context/context-reader";
import { ContextWriter } from "../../context/context-writer";
import { CorruptSaveError, UnimplementedError } from "../../error/parser.error";
import { SaveComponent } from "../types/objects/SaveComponent";
import { SaveEntity } from "../types/objects/SaveEntity";
import { Level } from "./level";
import { LevelToDestroyedActorsMap } from "./level-to-destroyed-actors-map";
import { ObjectReferencesList } from "./object-references-list";
import { SaveCustomVersion } from "./save-custom-version";

type BlobMarker = {
    position: number;
    length: number;
}

/**
 * Part of a level structure, containing object headers.
 */
export namespace TOCBlob {

    export function SkipOver(reader: ContextReader): BlobMarker {
        const tocBlobBinaryLength = reader.readInt32();
        if (reader.context.saveVersion.header >= SaveCustomVersion.UnrealEngine5) {
            reader.readInt32Zero();
        }
        const posBeforeTOCBlob = reader.getBufferPosition();
        reader.skipBytes(tocBlobBinaryLength);

        return {
            position: posBeforeTOCBlob,
            length: tocBlobBinaryLength
        };
    }


    export function Read(reader: ContextReader, objectsList: (SaveEntity | SaveComponent)[]): void {
        let countObjectHeaders = reader.readInt32();

        // read in batches
        const batchSize = 10000;
        let readObjectHeadersCount = 0;
        while (readObjectHeadersCount < countObjectHeaders) {
            objectsList.push(...ReadNObjectHeaders(reader, Math.min(batchSize, countObjectHeaders - readObjectHeadersCount)));
            readObjectHeadersCount += Math.min(batchSize, countObjectHeaders - readObjectHeadersCount);
        }
    }

    export function ReadNObjectHeaders(reader: ContextReader, count: number): (SaveEntity | SaveComponent)[] {
        let objects: (SaveEntity | SaveComponent)[] = [];
        let objectsRead = 0;
        for (; objectsRead < count; objectsRead++) {

            let obj: SaveEntity | SaveComponent;
            let objectType = reader.readInt32();
            switch (objectType) {
                case SaveEntity.TypeID:
                    obj = new SaveEntity('', '', '', '');
                    SaveEntity.ParseHeader(reader, obj);
                    break;
                case SaveComponent.TypeID:
                    obj = new SaveComponent('', '', '', '');
                    SaveComponent.ParseHeader(reader, obj);
                    break;
                default:
                    throw new CorruptSaveError('Unknown object type' + objectType);
            }
            objects.push(obj);
        }
        return objects;
    }

    export function Write(writer: ContextWriter, level: Level, isPersistentLevel: boolean) {

        const lenIndicatorTOCBlob = writer.getBufferPosition();
        writer.writeInt32(0);	// len indicator

        if (writer.context.saveVersion.header >= SaveCustomVersion.UnrealEngine5) {
            writer.writeInt32Zero();
        }

        const start = writer.getBufferPosition();
        SerializeAllObjectHeaders(writer, level.objects);

        if (level.writesDestroyedActorsInTOCBlob) {
            if (isPersistentLevel) {
                LevelToDestroyedActorsMap.write(writer, level.destroyedActorsMap ?? {});
            } else if (!isPersistentLevel) {
                ObjectReferencesList.SerializeList(writer, level.collectables ?? []);
            }
        }

        // replace binary size from earlier for - object headers + collectables
        writer.writeBinarySizeFromPosition(lenIndicatorTOCBlob, start);
    }


    export function SerializeAllObjectHeaders(writer: ContextWriter, objects: (SaveEntity | SaveComponent)[]): void {
        writer.writeInt32(objects.length);
        for (const obj of objects) {

            switch (obj.type) {
                case 'SaveEntity':
                    writer.writeInt32(SaveEntity.TypeID);
                    SaveEntity.SerializeHeader(writer, obj);
                    break;
                case 'SaveComponent':
                    writer.writeInt32(SaveComponent.TypeID);
                    SaveComponent.SerializeHeader(writer, obj);
                    break;
                default:
                    throw new UnimplementedError(`Unknown object type ${(obj as unknown as any).type}. Not implemented.`);
                    break;
            }
        }
    }
}