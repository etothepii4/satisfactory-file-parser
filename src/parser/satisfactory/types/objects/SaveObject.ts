import { ContextReader } from '../../../context/context-reader';
import { ContextWriter } from '../../../context/context-writer';
import { ParserError } from '../../../error/parser.error';
import { SaveCustomVersion } from '../../save/save-custom-version';
import { PropertiesMap } from "../property/generic/AbstractBaseProperty";
import { PropertiesList } from '../property/PropertiesList';
import { SpecialProperties } from '../property/special/SpecialProperties';

export interface SaveObjectHeader {
	typePath: string;
	rootObject: string;
	instanceName: string;
	flags?: number;
}

export abstract class SaveObject implements SaveObjectHeader {

	public properties: PropertiesMap = {};
	public specialProperties: SpecialProperties.AvailableSpecialPropertiesTypes = { type: 'EmptySpecialProperties' };
	public trailingData: number[] = [];

	public saveCustomVersion: number = 0;
	public shouldMigrateObjectRefsToPersistent: boolean = false;

	constructor(public typePath: string, public rootObject: string, public instanceName: string, public flags?: number) {

	}

	protected static ParseHeader(reader: ContextReader, obj: SaveObject): void {
		obj.typePath = reader.readString();
		obj.rootObject = reader.readString();
		obj.instanceName = reader.readString();

		if (reader.context.saveVersion >= SaveCustomVersion.SerializeObjectFlags) {
			obj.flags = reader.readUint32();
		}
	}

	protected static SerializeHeader(writer: ContextWriter, obj: SaveObject): void {
		writer.writeString(obj.typePath);
		writer.writeString(obj.rootObject);
		writer.writeString(obj.instanceName);

		if (writer.context.saveVersion >= SaveCustomVersion.SerializeObjectFlags) {
			writer.writeUint32(obj.flags ?? 0);
		}
	}

	public static ParseData(obj: SaveObject, length: number, reader: ContextReader, typePath: string): void {
		const start = reader.getBufferPosition();

		obj.properties = PropertiesList.ParseList(reader);

		reader.readInt32Zero();

		let remainingSize = length - (reader.getBufferPosition() - start);
		obj.specialProperties = SpecialProperties.ParseClassSpecificSpecialProperties(reader, typePath, remainingSize);

		remainingSize = length - (reader.getBufferPosition() - start);
		if (remainingSize > 0) {
			obj.trailingData = Array.from(reader.readBytes(remainingSize));
		} else if (remainingSize < 0) {
			throw new ParserError('ParserError', `Unexpected. Read more bytes than are indicated for entity ${obj.instanceName}. bytes left to read is ${remainingSize}`);
		}
	}

	public static SerializeData(writer: any, obj: SaveObject): void {
		PropertiesList.SerializeList(writer, obj.properties);
		writer.writeInt32Zero();
		SpecialProperties.SerializeClassSpecificSpecialProperties(writer, obj.typePath, obj.specialProperties);
		writer.writeBytesArray(obj.trailingData);
	}
}
