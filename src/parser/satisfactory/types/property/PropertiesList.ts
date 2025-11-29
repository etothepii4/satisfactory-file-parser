import { ContextReader } from '../../../context/context-reader';
import { ContextWriter } from '../../../context/context-writer';
import { ParserError } from '../../../error/parser.error';
import { AbstractBaseProperty, PropertiesMap } from './generic/AbstractBaseProperty';
import { ArrayProperty } from './generic/ArrayProperty/ArrayProperty';
import { BoolProperty } from './generic/BoolProperty';
import { ByteProperty } from './generic/ByteProperty';
import { DoubleProperty } from './generic/DoubleProperty';
import { EnumProperty } from './generic/EnumProperty';
import { FloatProperty } from './generic/FloatProperty';
import { Int32Property } from './generic/Int32Property';
import { Int64Property } from './generic/Int64Property';
import { Int8Property } from './generic/Int8Property';
import { MapProperty } from './generic/MapProperty';
import { ObjectProperty } from './generic/ObjectProperty';
import { SetProperty } from './generic/SetProperty/SetProperty';
import { SoftObjectProperty } from './generic/SoftObjectProperty';
import { StrProperty } from './generic/StrProperty';
import { StructProperty } from './generic/StructProperty';
import { TextProperty } from './generic/TextProperty';
import { Uint32Property } from './generic/Uint32Property';
import { Uint64Property } from './generic/Uint64Property';
import { Uint8Property } from './generic/Uint8Property';


export namespace PropertiesList {

	export const ParseList = (reader: ContextReader): PropertiesMap => {

		const properties: PropertiesMap = {};
		let propertyName: string = reader.readString();
		while (propertyName !== 'None') {
			const parsedProperty = PropertiesList.ParseSingleProperty(reader, propertyName);

			// if it already exists, make it an array.
			if (properties[propertyName]) {
				if (!Array.isArray(properties[propertyName])) {
					properties[propertyName] = [properties[propertyName] as AbstractBaseProperty];
				}
				(properties[propertyName] as AbstractBaseProperty[]).push(parsedProperty);
			} else {
				properties[propertyName] = parsedProperty;
			}

			propertyName = reader.readString();
		}

		return properties;
	}

	export const SerializeList = (writer: ContextWriter, properties: PropertiesMap): void => {
		for (const property of Object.values(properties).flatMap(val => Array.isArray(val) ? val : [val])) {
			writer.writeString(property.name);
			PropertiesList.SerializeSingleProperty(writer, property);
		}
		writer.writeString('None');
	}

	export const ParseSingleProperty = (reader: ContextReader, propertyName: string): AbstractBaseProperty => {
		let currentProperty: any = {};

		//TODO assign type and index after parsing.
		const propertyType = reader.readString();
		const binarySize = reader.readInt32();

		const index = reader.readInt32();
		const before = reader.getBufferPosition();

		let overhead = 0;
		switch (propertyType) {
			case 'BoolProperty':
				currentProperty = BoolProperty.Parse(reader, propertyType, index);
				overhead = BoolProperty.CalcOverhead(currentProperty);
				break;

			case 'ByteProperty':
				currentProperty = ByteProperty.Parse(reader, propertyType, index);
				overhead = ByteProperty.CalcOverhead(currentProperty);
				break;

			case 'Int8Property':
				currentProperty = Int8Property.Parse(reader, propertyType, index);
				overhead = Int8Property.CalcOverhead(currentProperty);
				break;


			case 'UInt8Property':
				currentProperty = Uint8Property.Parse(reader, propertyType, index);
				overhead = Uint8Property.CalcOverhead(currentProperty);
				break;

			case 'IntProperty':
			case 'Int32Property':
				currentProperty = Int32Property.Parse(reader, propertyType, index);
				overhead = Int32Property.CalcOverhead(currentProperty);
				break;

			case 'UInt32Property':
				currentProperty = Uint32Property.Parse(reader, propertyType, index);
				overhead = Uint32Property.CalcOverhead(currentProperty);
				break;

			case 'Int64Property':
				currentProperty = Int64Property.Parse(reader, propertyType, index);
				overhead = Int64Property.CalcOverhead(currentProperty);
				break;

			case 'UInt64Property':
				currentProperty = Uint64Property.Parse(reader, propertyType, index);
				break;

			case 'SingleProperty':
			case 'FloatProperty':
				currentProperty = FloatProperty.Parse(reader, propertyType, index);
				overhead = FloatProperty.CalcOverhead(currentProperty);
				break;

			case 'DoubleProperty':
				currentProperty = DoubleProperty.Parse(reader, propertyType, index);
				overhead = DoubleProperty.CalcOverhead(currentProperty);
				break;

			case 'StrProperty':
			case 'NameProperty':
				currentProperty = StrProperty.Parse(reader, propertyType, index);
				overhead = StrProperty.CalcOverhead(currentProperty);
				break;

			case 'ObjectProperty':
			case 'InterfaceProperty':
				currentProperty = ObjectProperty.Parse(reader, propertyType, index);
				overhead = ObjectProperty.CalcOverhead(currentProperty);
				break;

			case 'SoftObjectProperty':
				currentProperty = SoftObjectProperty.Parse(reader, propertyType, index);
				overhead = SoftObjectProperty.CalcOverhead(currentProperty);
				break;

			case 'EnumProperty':
				currentProperty = EnumProperty.Parse(reader, propertyType, index);
				overhead = EnumProperty.CalcOverhead(currentProperty);
				break;

			case 'StructProperty':
				currentProperty = StructProperty.Parse(reader, propertyType, index, binarySize);
				overhead = StructProperty.CalcOverhead(currentProperty);
				break;

			case 'ArrayProperty':
				currentProperty = ArrayProperty.Parse(reader, propertyType, index, binarySize);
				overhead = ArrayProperty.CalcOverhead(currentProperty);
				break;

			case 'MapProperty':
				currentProperty = MapProperty.Parse(reader, propertyName, binarySize);
				overhead = MapProperty.CalcOverhead(currentProperty);
				break;

			case 'TextProperty':
				currentProperty = TextProperty.Parse(reader, propertyType, index);
				overhead = TextProperty.CalcOverhead(currentProperty);
				break;

			case 'SetProperty':
				currentProperty = SetProperty.Parse(reader, propertyType, index, propertyName);
				overhead = SetProperty.CalcOverhead(currentProperty);
				break;

			default:
				throw new Error(`Unimplemented type ${propertyType}, at byte position ${reader.getBufferPosition()}`);
		}

		currentProperty.name = propertyName;

		const readBytes = reader.getBufferPosition() - before - overhead;
		if (readBytes !== binarySize) {
			console.warn(`possibly corrupt. Read ${readBytes} for ${propertyType} ${propertyName}, but ${binarySize} were indicated.`);
			throw new ParserError('ParserError', `possibly corrupt. Read ${readBytes} bytes for ${propertyType} ${propertyName}, but ${binarySize} bytes were indicated.`);
		}

		return currentProperty;
	}

	export const SerializeSingleProperty = (writer: ContextWriter, property: AbstractBaseProperty): void => {

		writer.writeString(property.ueType);

		// binary length indicator
		const lenIndicator = writer.getBufferPosition();
		writer.writeInt32(0);

		// write index if it is not 0. Since it normally is.
		writer.writeInt32(property.index ?? 0);

		const start = writer.getBufferPosition();
		let overhead = 0;
		switch (property.ueType) {
			case 'BoolProperty':
				overhead = BoolProperty.CalcOverhead(property as BoolProperty);
				BoolProperty.Serialize(writer, property as BoolProperty);
				break;

			case 'ByteProperty':
				overhead = ByteProperty.CalcOverhead(property as ByteProperty);
				ByteProperty.Serialize(writer, property as ByteProperty);
				break;

			case 'Int8Property':
				overhead = Int8Property.CalcOverhead(property as Int8Property);
				Int8Property.Serialize(writer, property as Int8Property);
				break;

			case 'UInt8Property':
				overhead = Uint8Property.CalcOverhead(property as Uint8Property);
				Uint8Property.Serialize(writer, property as Uint8Property);
				break;

			case 'IntProperty':
			case 'Int32Property':
				overhead = Int32Property.CalcOverhead(property as Int32Property);
				Int32Property.Serialize(writer, property as Int32Property);
				break;

			case 'UInt32Property':
				overhead = Uint32Property.CalcOverhead(property as Uint32Property);
				Uint32Property.Serialize(writer, property as Uint32Property);
				break;

			case 'Int64Property':
				overhead = Int64Property.CalcOverhead(property as Int64Property);
				Int64Property.Serialize(writer, property as Int64Property);
				break;

			case 'UInt64PRoperty':
				overhead = Uint64Property.CalcOverhead(property as Uint64Property);
				Uint64Property.Serialize(writer, property as Uint64Property);
				break;

			case 'SingleProperty':
			case 'FloatProperty':
				overhead = FloatProperty.CalcOverhead(property as FloatProperty);
				FloatProperty.Serialize(writer, property as FloatProperty);
				break;

			case 'DoubleProperty':
				overhead = DoubleProperty.CalcOverhead(property as DoubleProperty);
				DoubleProperty.Serialize(writer, property as DoubleProperty);
				break;

			case 'StrProperty':
			case 'NameProperty':
				overhead = StrProperty.CalcOverhead(property as StrProperty);
				StrProperty.Serialize(writer, property as StrProperty);
				break;

			case 'ObjectProperty':
			case 'InterfaceProperty':
				overhead = ObjectProperty.CalcOverhead(property as ObjectProperty);
				ObjectProperty.Serialize(writer, property as ObjectProperty);
				break;

			case 'SoftObjectProperty':
				overhead = SoftObjectProperty.CalcOverhead(property as SoftObjectProperty);
				SoftObjectProperty.Serialize(writer, property as SoftObjectProperty);
				break;

			case 'EnumProperty':
				overhead = EnumProperty.CalcOverhead(property as EnumProperty);
				EnumProperty.Serialize(writer, property as EnumProperty);
				break;

			case 'ByteProperty':
				overhead = ByteProperty.CalcOverhead(property as ByteProperty);
				ByteProperty.Serialize(writer, property as ByteProperty);
				break;

			case 'StructProperty':
				overhead = StructProperty.CalcOverhead(property as StructProperty);
				StructProperty.Serialize(writer, property as StructProperty);
				break;

			case 'ArrayProperty':
				overhead = ArrayProperty.CalcOverhead(property as ArrayProperty.AvailableArrayPropertyTypes);
				ArrayProperty.Serialize(writer, property as ArrayProperty.AvailableArrayPropertyTypes);
				break;

			case 'MapProperty':
				overhead = MapProperty.CalcOverhead(property as MapProperty);
				MapProperty.Serialize(writer, property as MapProperty);
				break;

			case 'TextProperty':
				overhead = TextProperty.CalcOverhead(property as TextProperty);
				TextProperty.Serialize(writer, property as TextProperty);
				break;

			case 'SetProperty':
				overhead = SetProperty.CalcOverhead(property as SetProperty.AvailableSetPropertyTypes);
				SetProperty.Serialize(writer, property as SetProperty.AvailableSetPropertyTypes);
				break;

			default:
				throw new Error(`Unimplemented type ${property.type}`);
		}

		// replace len indicator.
		writer.writeBinarySizeFromPosition(lenIndicator, start + overhead);
	}
}

