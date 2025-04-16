
import { ContextReader } from '../../../context/context-reader';
import { ContextWriter } from '../../../context/context-writer';
import { ObjectReference } from "../structs/ObjectReference";
import { Transform } from '../structs/Transform';
import { SaveObject, SaveObjectHeader } from "./SaveObject";

export const isSaveEntity = (obj: any): obj is SaveEntity => {
	return obj.type === 'SaveEntity';
}

export interface SaveEntityHeader extends SaveObjectHeader {
	needTransform: boolean;
	transform: Transform;
	wasPlacedInLevel: boolean;
}

export class SaveEntity extends SaveObject {
	public static readonly TypeID = 1;

	public readonly type = 'SaveEntity';

	public needTransform: boolean;
	public transform: Transform;
	public wasPlacedInLevel: boolean;
	public parentObject: ObjectReference;
	public components: ObjectReference[];

	constructor(public typePath: string, public rootObject: string, public instanceName: string, public parentEntityName = '', needsTransform: boolean = false) {
		super(typePath, rootObject, instanceName);
		this.needTransform = needsTransform;
		this.wasPlacedInLevel = false;
		this.parentObject = { levelName: '', pathName: '' };
		this.transform = {
			rotation: { x: 0, y: 0, z: 0, w: 1 },
			translation: { x: 0, y: 0, z: 0 },
			scale3d: { x: 1, y: 1, z: 1 }
		}
		this.components = [];
	}

	public static ParseHeader(reader: ContextReader, obj: SaveEntity): void {
		SaveObject.ParseHeader(reader, obj);
		obj.needTransform = reader.readInt32() == 1;
		obj.transform = Transform.ParseF(reader);
		obj.wasPlacedInLevel = reader.readInt32() == 1;
	}

	public static ParseData(entity: SaveEntity, length: number, reader: ContextReader, typePath: string): void {

		const start = reader.getBufferPosition();

		entity.parentObject = ObjectReference.read(reader);

		var componentCount = reader.readInt32();
		for (let i = 0; i < componentCount; i++) {
			var componentRef = ObjectReference.read(reader);
			entity.components.push(componentRef);
		}

		const remainingSize = length - (reader.getBufferPosition() - start);
		return SaveObject.ParseData(entity, remainingSize, reader, typePath);
	}

	public static SerializeHeader(writer: ContextWriter, entity: SaveEntity): void {
		SaveObject.SerializeHeader(writer, entity);

		writer.writeInt32(entity.needTransform ? 1 : 0);
		Transform.SerializeF(writer, entity.transform);
		writer.writeInt32(entity.wasPlacedInLevel ? 1 : 0);
	}

	public static SerializeData(writer: ContextWriter, entity: SaveEntity): void {
		ObjectReference.write(writer, entity.parentObject);

		writer.writeInt32(entity.components.length);
		for (const component of entity.components) {
			writer.writeString(component.levelName);
			writer.writeString(component.pathName);
		}

		SaveObject.SerializeData(writer, entity);
	}
}
