import { BinaryReadable } from "../../byte/binary-readable.interface";
import { ByteWriter } from "../../byte/byte-writer.class";
import { DataFields } from "./DataFields";
import { PropertiesMap } from "./property/generic/BasicProperty";
import { SpecialAnyProperty } from './property/special/SpecialAnyProperty';

export interface SaveObjectHeader {
	typePath: string;
	rootObject: string;
	instanceName: string;
}

export abstract class SaveObject implements SaveObjectHeader {

	public properties: PropertiesMap = {};
	public specialProperties: SpecialAnyProperty = {};
	public trailingData: number[] = [];

	public objectVersion: number = 0;
	public unknownType2: number = 0;

	constructor(public typePath: string, public rootObject: string, public instanceName: string) {

	}

	protected static ParseHeader(reader: BinaryReadable, obj: SaveObject): void {
		obj.typePath = reader.readString();
		obj.rootObject = reader.readString();
		obj.instanceName = reader.readString();
	}

	protected static SerializeHeader(writer: ByteWriter, obj: SaveObject): void {
		writer.writeString(obj.typePath);
		writer.writeString(obj.rootObject);
		writer.writeString(obj.instanceName);
	}

	public static ParseData(obj: SaveObject, length: number, reader: BinaryReadable, buildVersion: number, typePath: string): void {
		DataFields.ParseProperties(obj, length, reader, buildVersion, typePath);
	}

	public static SerializeData(writer: any, obj: SaveObject, buildVersion: number): void {
		DataFields.Serialize(obj, writer, buildVersion, obj.typePath);
	}
}