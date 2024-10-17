
import { BinaryReadable } from "../../byte/binary-readable.interface";
import { ByteWriter } from "../../byte/byte-writer.class";
import { CorruptSaveError, UnimplementedError } from '../../error/parser.error';
import { SaveComponent, isSaveComponent } from "../types/objects/SaveComponent";
import { SaveEntity, isSaveEntity } from "../types/objects/SaveEntity";
import { SaveObject } from "../types/objects/SaveObject";
import { ObjectReference } from "../types/structs/ObjectReference";
import { ObjectReferencesList } from './object-references-list';
import { SaveReader } from './save-reader';

export type Level = {
	name: string;
	objects: (SaveEntity | SaveComponent)[];
	collectables: ObjectReference[];
}

export namespace Level {

	export const ReadLevel = (reader: SaveReader, levelName: string, buildVersion: number): Level => {
		const level: Level = {
			name: levelName,
			objects: [],
			collectables: []
		}

		// checksum object headers.
		const headersBinLen = reader.readInt32(); // object headers + binary length
		reader.readInt32();	// 0

		// object headers
		const posBeforeHeaders = reader.getBufferPosition();
		ReadAllObjectHeaders(reader, level.objects);

		// collected, like slugs Only listed here since U8.
		let remainingSize = headersBinLen - (reader.getBufferPosition() - posBeforeHeaders);
		if (remainingSize > 0) {
			const doubledCollectablesIgnored = ObjectReferencesList.ReadList(reader);
		} else {
			// its perfectly possible for ported saves to have nothing here.
		}

		remainingSize = headersBinLen - (reader.getBufferPosition() - posBeforeHeaders);
		if (remainingSize !== 0) {
			console.warn('remaining size not 0. Save may be corrupt.', remainingSize, levelName);
		}

		// checksum for object content size
		const objectContentsBinLen = reader.readInt32();
		reader.readInt32();	// 0

		// objects contents
		const posBeforeContents = reader.getBufferPosition();
		ReadAllObjectContents(levelName, reader, level.objects, buildVersion, reader.onProgressCallback);
		const posAfterContents = reader.getBufferPosition();
		if (posAfterContents - posBeforeContents !== objectContentsBinLen) {
			//WARNING
			console.warn('save seems corrupt.', level.name);
		}

		// collectables 2nd time. Listed here since < U8 and in U8 as well. So this is the best list you can rely on.
		level.collectables = ObjectReferencesList.ReadList(reader);

		return level;
	}

	export const SerializeLevel = (writer: ByteWriter, level: Level, buildVersion: number) => {
		const lenIndicatorHeaderAndDestroyedEntitiesSize = writer.getBufferPosition();
		writer.writeInt32(0);	// len indicator
		writer.writeInt32(0);	// unk

		SerializeAllObjectHeaders(writer, level.objects);

		// <--- destroyed actors is the same as collectables list.
		ObjectReferencesList.SerializeList(writer, level.collectables);

		// replace binary size from earlier for - object headers + collectables
		writer.writeBinarySizeFromPosition(lenIndicatorHeaderAndDestroyedEntitiesSize, lenIndicatorHeaderAndDestroyedEntitiesSize + 8);

		// write entities
		SerializeAllObjectContents(writer, level.objects, buildVersion, level.name);

		ObjectReferencesList.SerializeList(writer, level.collectables);
	}

	export const ReadAllObjectContents = (levelName: string, reader: BinaryReadable, objectsList: SaveObject[], buildVersion: number, onProgressCallback: (progress: number, msg?: string) => void): void => {
		const countEntities = reader.readInt32();
		if (countEntities !== objectsList.length) {
			throw new Error(`possibly corrupt. entity content count ${countEntities} does not equal object count of ${objectsList.length}`);
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
	}

	export const ReadNObjectContents = (reader: BinaryReadable, count: number, objects: SaveObject[], objectListOffset: number = 0, buildVersion: number = 0) => {
		for (let i = 0; i < count; i++) {
			objects[i + objectListOffset].objectVersion = reader.readInt32();	// 36, 41..... 42, 46 at 1.0 Release - so its probably an object version
			objects[i + objectListOffset].unknownType2 = reader.readInt32();	//1 - //occasionally 0 ?
			const binarySize = reader.readInt32();

			const before = reader.getBufferPosition();
			if (isSaveEntity(objects[i + objectListOffset])) {
				SaveEntity.ParseData(objects[i + objectListOffset] as SaveEntity, binarySize, reader, buildVersion, objects[i + objectListOffset].typePath);
			} else if (isSaveComponent(objects[i + objectListOffset])) {
				SaveComponent.ParseData(objects[i + objectListOffset] as SaveComponent, binarySize, reader, buildVersion, objects[i + objectListOffset].typePath);
			}

			const after = reader.getBufferPosition();
			if (after - before !== binarySize) {
				throw new CorruptSaveError(`Could not read entity ${objects[i + objectListOffset].instanceName}, as ${after - before} bytes were read, but ${binarySize} bytes were indicated.`);
			}
		}
	}

	export const SerializeAllObjectContents = (writer: ByteWriter, objects: (SaveEntity | SaveComponent)[], buildVersion: number, levelName: string): void => {
		const lenIndicatorEntities = writer.getBufferPosition();
		writer.writeInt32(0);

		writer.writeInt32(0);	// 0

		writer.writeInt32(objects.length);
		for (const obj of objects) {

			writer.writeInt32(obj.objectVersion);
			writer.writeInt32(obj.unknownType2);
			const lenReplacementPosition = writer.getBufferPosition();
			writer.writeInt32(0);

			if (isSaveEntity(obj)) {
				SaveEntity.SerializeData(writer, obj, buildVersion);
			} else if (isSaveComponent(obj)) {
				SaveComponent.SerializeData(writer, obj, buildVersion);
			}

			writer.writeBinarySizeFromPosition(lenReplacementPosition, lenReplacementPosition + 4);
		}
		writer.writeBinarySizeFromPosition(lenIndicatorEntities, lenIndicatorEntities + 8);
	}

	export const ReadAllObjectHeaders = (reader: BinaryReadable, objectsList: SaveObject[]): void => {
		let countObjectHeaders = reader.readInt32();

		// read in batches
		const batchSize = 10000;
		let readObjectHeadersCount = 0;
		while (readObjectHeadersCount < countObjectHeaders) {
			objectsList.push(...ReadNObjectHeaders(reader, Math.min(batchSize, countObjectHeaders - readObjectHeadersCount)));
			readObjectHeadersCount += Math.min(batchSize, countObjectHeaders - readObjectHeadersCount);
		}
	}

	export const ReadNObjectHeaders = (reader: BinaryReadable, count: number): (SaveEntity | SaveComponent)[] => {
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

	export const SerializeAllObjectHeaders = (writer: ByteWriter, objects: (SaveEntity | SaveComponent)[]): void => {
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