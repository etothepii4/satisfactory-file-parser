
import { BinaryReadable } from "../../byte/binary-readable.interface";
import { ByteWriter } from "../../byte/byte-writer.class";
import { SaveComponent, isSaveComponent } from "../types/objects/SaveComponent";
import { SaveEntity, isSaveEntity } from "../types/objects/SaveEntity";
import { SaveObject } from "../types/objects/SaveObject";
import { ObjectReference } from "../types/structs/ObjectReference";

export class Level {
	public objects: (SaveEntity | SaveComponent)[] = [];
	public collectables: ObjectReference[] = [];

	constructor(public name: string) {

	}

	public static SerializeLevel(writer: ByteWriter, level: Level, buildVersion: number) {
		const lenIndicatorHeaderAndDestroyedEntitiesSize = writer.getBufferPosition();
		writer.writeInt32(0);	// len indicator
		writer.writeInt32(0);	// unk

		Level.SerializeObjectHeaders(writer, level.objects);

		// <--- destroyed actors is the same as collectables list.
		Level.SerializeCollectablesList(writer, level.collectables);

		// replace binary size from earlier for - object headers + collectables
		writer.writeBinarySizeFromPosition(lenIndicatorHeaderAndDestroyedEntitiesSize, lenIndicatorHeaderAndDestroyedEntitiesSize + 8);

		// write entities
		Level.SerializeObjectContents(writer, level.objects, buildVersion, level.name);

		Level.SerializeCollectablesList(writer, level.collectables);
	}

	public static SerializeObjectContents(writer: ByteWriter, objects: (SaveEntity | SaveComponent)[], buildVersion: number, levelName: string): void {
		const lenIndicatorEntities = writer.getBufferPosition();
		writer.writeInt32(0);

		writer.writeInt32(0);	// unk

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

	public static ReadObjectHeaders(reader: BinaryReadable, objectsList: SaveObject[], onProgressCallback: (progress: number, msg?: string) => void): void {
		let countObjectHeaders = reader.readInt32();
		for (let i = 0; i < countObjectHeaders; i++) {
			if (i % 1000 === 0) {
				onProgressCallback(reader.getBufferProgress());
			}

			let objectType = reader.readInt32();
			switch (objectType) {
				case SaveEntity.TypeID:
					let object = new SaveEntity('', '', '', '');
					SaveEntity.ParseHeader(reader, object);
					objectsList.push(object);
					break;
				case SaveComponent.TypeID:
					let component = new SaveComponent('', '', '', '');
					SaveComponent.ParseHeader(reader, component);
					objectsList.push(component);
					break;
				default:
					console.log('Unknown object type', objectType);
					break;
			}

		}
	}

	public static SerializeObjectHeaders(writer: ByteWriter, objects: (SaveEntity | SaveComponent)[]): void {
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
					console.log('Unknown object type', obj);
					break;
			}
		}
	}

	// collected stuff
	public static SerializeCollectablesList(writer: ByteWriter, collectables: ObjectReference[]): void {
		writer.writeInt32(collectables.length);
		for (const collectable of collectables) {
			ObjectReference.write(writer, collectable);
		}
	}

	// collected stuff
	public static ReadCollectablesList(reader: BinaryReadable): ObjectReference[] {
		const collected: ObjectReference[] = [];
		let count = reader.readInt32();
		for (let i = 0; i < count; i++) {
			collected.push(ObjectReference.read(reader));
		}
		return collected;
	}
}