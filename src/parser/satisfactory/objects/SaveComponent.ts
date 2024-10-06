import { BinaryReadable } from "../../byte/binary-readable.interface";
import { ByteWriter } from "../../byte/byte-writer.class";
import { SaveObject, SaveObjectHeader } from "./SaveObject";

export const isSaveComponent = (obj: any): obj is SaveComponent => {
	return obj.type === 'SaveComponent';
}

export interface SaveComponentHeader extends SaveObjectHeader {
	parentEntityName: string;
}

export class SaveComponent extends SaveObject implements SaveComponentHeader {
	public static readonly TypeID = 0;

	public readonly type = 'SaveComponent';

	constructor(public typePath: string, public rootObject: string, public instanceName: string, public parentEntityName = '') {
		super(typePath, rootObject, instanceName);
	}

	public static ParseHeader(reader: BinaryReadable, obj: SaveComponent): void {
		SaveObject.ParseHeader(reader, obj);
		obj.parentEntityName = reader.readString();
	}

	public static SerializeHeader(writer: ByteWriter, component: SaveComponent) {
		SaveObject.SerializeHeader(writer, component);
		writer.writeString(component.parentEntityName);
	}

	public static ParseData(component: SaveComponent, length: number, reader: BinaryReadable, buildVersion: number, typePath: string): void {
		SaveObject.ParseData(component, length, reader, buildVersion, typePath);
	}
}