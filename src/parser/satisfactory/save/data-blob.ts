import { ContextReader } from "../../context/context-reader";
import { ContextWriter } from "../../context/context-writer";
import { HierarchyVersion } from "../../context/hierarchical-version-context";
import { CorruptSaveError } from "../../error/parser.error";
import { isSaveComponent, SaveComponent } from "../types/objects/SaveComponent";
import { isSaveEntity, SaveEntity } from "../types/objects/SaveEntity";
import { SaveObject } from "../types/objects/SaveObject";
import { FSaveObjectVersionData } from "../types/structs/binary/FSaveObjectVersionData";
import { SaveCustomVersion } from "./save-custom-version";

type BlobMarker = {
    position: number;
    length: number;
}

/**
 * Part of a level structure, containing object contents.
 */
export namespace DataBlob {

    export function SkipOver(reader: ContextReader): BlobMarker {

        const dataBlobBinaryLength = reader.readInt32();
        if (reader.context.saveVersion.header >= SaveCustomVersion.UnrealEngine5) {
            reader.readInt32Zero();
        }
        const posBeforeDataBlob = reader.getBufferPosition();
        reader.skipBytes(dataBlobBinaryLength);

        return {
            position: posBeforeDataBlob,
            length: dataBlobBinaryLength
        }
    }

    export function Read(levelName: string, reader: ContextReader, objectsList: SaveObject[], binaryLength: number, onProgressCallback: (progress: number, msg?: string) => void): void {
        const posBefore = reader.getBufferPosition();
        const countEntities = reader.readInt32();
        if (countEntities !== objectsList.length) {
            throw new Error(`possibly corrupt. entity count ${countEntities} does not equal object count of ${objectsList.length}`);
        }

        // read in batches
        const batchSize = 10000;
        let readObjectsCount = 0;
        let lastProgressReport = 0;
        while (readObjectsCount < countEntities) {
            ReadNObjectContents(reader, Math.min(batchSize, countEntities - readObjectsCount), objectsList, readObjectsCount);
            readObjectsCount += Math.min(batchSize, countEntities - readObjectsCount);

            if (readObjectsCount - lastProgressReport > batchSize) {
                onProgressCallback(reader.getBufferProgress(), `read object count [${(readObjectsCount)}/${(countEntities)}] in level ${levelName}`);
                lastProgressReport = readObjectsCount;
            }
        }

        const after = reader.getBufferPosition();
        if (after - posBefore !== binaryLength) {
            console.warn(`save seems corrupt. Level ${levelName} is not even obeying the object count checksum.`, levelName);
        }
    }

    export function ReadNObjectContents(reader: ContextReader, count: number, objects: SaveObject[], objectListOffset: number = 0): void {
        for (let i = 0; i < count; i++) {
            if (reader.context.saveVersion.level >= SaveCustomVersion.IntroducedWorldPartition) {
                objects[i + objectListOffset].saveCustomVersion = reader.readInt32();
            }
            HierarchyVersion.SetOnObject(reader.context.saveVersion, objects[i + objectListOffset].saveCustomVersion);
            if (reader.context.saveVersion.level >= SaveCustomVersion.IntroducedWorldPartition) {
                objects[i + objectListOffset].shouldMigrateObjectRefsToPersistent = reader.readInt32() >= 1;
            }

            // read all contexts in front and at end, before we can parse data
            const binarySize = reader.readInt32();
            const posBeforeObject = reader.getBufferPosition();
            reader.skipBytes(binarySize);

            if (reader.context.saveVersion.object >= SaveCustomVersion.SerializeDataPackageVersionAndCustomVersions) {
                const shouldSerializePerObjectVersionData = reader.readInt32() === 1;
                if (shouldSerializePerObjectVersionData) {
                    objects[i + objectListOffset].objectVersionData = FSaveObjectVersionData.read(reader);
                }
            }
            HierarchyVersion.SetOnObject(reader.context.packageFileVersionUE5, objects[i + objectListOffset].objectVersionData?.packageFileVersion.ue5Version);
            const posAfterObject = reader.getBufferPosition();

            reader.jumpTo(posBeforeObject);
            let after = reader.getBufferPosition();
            try {
                if (isSaveEntity(objects[i + objectListOffset])) {
                    SaveEntity.ParseData(objects[i + objectListOffset] as SaveEntity, binarySize, reader, objects[i + objectListOffset].typePath);
                } else if (isSaveComponent(objects[i + objectListOffset])) {
                    SaveComponent.ParseData(objects[i + objectListOffset] as SaveComponent, binarySize, reader, objects[i + objectListOffset].typePath);
                }

                after = reader.getBufferPosition();
                if (after - posBeforeObject !== binarySize) {
                    throw new CorruptSaveError(`Could not read entity ${objects[i + objectListOffset].instanceName}, as ${after - posBeforeObject} bytes were read, but ${binarySize} bytes were indicated.`);
                }
            } catch (error) {
                if (reader.context.throwErrors) {
                    throw error;
                } else {
                    console.warn(`Could not read object ${objects[i + objectListOffset].instanceName} of type ${objects[i + objectListOffset].typePath} as a whole. will be removed from level's object list.`);
                    reader.skipBytes(posBeforeObject - reader.getBufferPosition() + binarySize);
                    objects[i + objectListOffset] = null as unknown as SaveObject;
                }
            }
            reader.jumpTo(posAfterObject);
        }
    }

    export function Write(writer: ContextWriter, objects: (SaveEntity | SaveComponent)[], levelName: string): void {
        const lenIndicatorEntities = writer.getBufferPosition();
        writer.writeInt32(0);

        if (writer.context.saveVersion.header >= SaveCustomVersion.UnrealEngine5) {
            writer.writeInt32Zero();
        }

        const lenEntitiesStart = writer.getBufferPosition();
        writer.writeInt32(objects.length);
        for (const obj of objects) {

            HierarchyVersion.SetOnObject(writer.context.saveVersion, obj.saveCustomVersion);
            if (writer.context.saveVersion.level >= SaveCustomVersion.IntroducedWorldPartition) {
                writer.writeInt32(obj.saveCustomVersion);
            }
            if (writer.context.saveVersion.level >= SaveCustomVersion.IntroducedWorldPartition) {
                writer.writeInt32(obj.shouldMigrateObjectRefsToPersistent ? 1 : 0);
            }

            const lenReplacementPosition = writer.getBufferPosition();
            writer.writeInt32(0);
            let before = writer.getBufferPosition(), after = writer.getBufferPosition();

            if (isSaveEntity(obj)) {
                SaveEntity.SerializeData(writer, obj);
                after = writer.getBufferPosition();


            } else if (isSaveComponent(obj)) {

                SaveComponent.SerializeData(writer, obj);
                after = writer.getBufferPosition();

            }

            HierarchyVersion.SetOnObject(writer.context.packageFileVersionUE5, obj.objectVersionData?.packageFileVersion.ue5Version);
            if (writer.context.saveVersion.object >= SaveCustomVersion.SerializeDataPackageVersionAndCustomVersions) {
                writer.writeInt32(obj.objectVersionData !== undefined ? 1 : 0);
                if (obj.objectVersionData !== undefined) {
                    FSaveObjectVersionData.write(writer, obj.objectVersionData);
                }
            }


            writer.writeInt32At(lenReplacementPosition, after - before);
        }
        const lenEntitiesEnd = writer.getBufferPosition();
        writer.writeInt32At(lenIndicatorEntities, lenEntitiesEnd - lenEntitiesStart);
    }
}