import { BinaryReadable } from "../../../byte/binary-readable.interface";
import { ByteWriter } from "../../../byte/byte-writer.class";
import { ParserError } from '../../../error/parser.error';
import { PropertiesList } from '../property/PropertiesList';
import { PropertiesMap } from "../property/generic/BasicProperty";
import { SpecialAnyProperties } from '../property/special/SpecialAnyProperties';
import { SpecialProperties } from '../property/special/SpecialProperties';

export interface SaveObjectHeader {
	typePath: string;
	rootObject: string;
	instanceName: string;
}

export abstract class SaveObject implements SaveObjectHeader {

	public properties: PropertiesMap = {};
	public specialProperties: SpecialAnyProperties = {};
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
		const start = reader.getBufferPosition();

		PropertiesList.ParseList(obj, length, reader, buildVersion, typePath);

		reader.readInt32(); // 0

		let remainingSize = length - (reader.getBufferPosition() - start);
		obj.specialProperties = SpecialProperties.ParseClassSpecificSpecialProperties(reader, typePath, remainingSize);

		remainingSize = length - (reader.getBufferPosition() - start);
		if (remainingSize > 0) {
			obj.trailingData = Array.from(reader.readBytes(remainingSize));
		} else if (remainingSize < 0) {
			throw new ParserError('ParserError', `Unexpected. Read more bytes than are indicated for entity ${obj.instanceName}. bytes left to read is ${remainingSize}`);
		}
	}

	public static SerializeData(writer: any, obj: SaveObject, buildVersion: number): void {
		PropertiesList.SerializeList(obj, writer, buildVersion, obj.typePath);
		writer.writeInt32(0);
		SpecialProperties.SerializeClassSpecificSpecialProperties(writer, obj.typePath, obj.specialProperties);
		writer.writeBytesArray(obj.trailingData);
	}
}