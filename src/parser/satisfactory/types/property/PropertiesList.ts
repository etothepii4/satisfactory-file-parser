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

		let subtype = '';

		try {
			switch (propertyType) {
				case 'BoolProperty':
					overhead = BoolProperty.CalcOverhead(currentProperty);
					currentProperty = BoolProperty.Parse(reader, propertyType, index);
					break;

				case 'ByteProperty':
					const type = reader.readString();
					overhead = ByteProperty.CalcOverhead(currentProperty, type);
					currentProperty = ByteProperty.Parse(reader, propertyType, index, type);
					break;

				case 'Int8Property':
					overhead = Int8Property.CalcOverhead(currentProperty);
					currentProperty = Int8Property.Parse(reader, propertyType, index);
					break;


				case 'UInt8Property':
					overhead = Uint8Property.CalcOverhead(currentProperty);
					currentProperty = Uint8Property.Parse(reader, propertyType, index);
					break;

				case 'IntProperty':
				case 'Int32Property':
					overhead = Int32Property.CalcOverhead(currentProperty);
					currentProperty = Int32Property.Parse(reader, propertyType, index);
					break;

				case 'UInt32Property':
					overhead = Uint32Property.CalcOverhead(currentProperty);
					currentProperty = Uint32Property.Parse(reader, propertyType, index);
					break;

				case 'Int64Property':
					overhead = Int64Property.CalcOverhead(currentProperty);
					currentProperty = Int64Property.Parse(reader, propertyType, index);
					break;

				case 'UInt64Property':
					overhead = Uint64Property.CalcOverhead(currentProperty);
					currentProperty = Uint64Property.Parse(reader, propertyType, index);
					break;

				case 'SingleProperty':
				case 'FloatProperty':
					overhead = FloatProperty.CalcOverhead(currentProperty);
					currentProperty = FloatProperty.Parse(reader, propertyType, index);
					break;

				case 'DoubleProperty':
					overhead = DoubleProperty.CalcOverhead(currentProperty);
					currentProperty = DoubleProperty.Parse(reader, propertyType, index);
					break;

				case 'StrProperty':
				case 'NameProperty':
					overhead = StrProperty.CalcOverhead(currentProperty);
					currentProperty = StrProperty.Parse(reader, propertyType, index);
					break;

				case 'ObjectProperty':
				case 'InterfaceProperty':
					overhead = ObjectProperty.CalcOverhead(currentProperty);
					currentProperty = ObjectProperty.Parse(reader, propertyType, index);
					break;

				case 'SoftObjectProperty':
					overhead = SoftObjectProperty.CalcOverhead(currentProperty);
					currentProperty = SoftObjectProperty.Parse(reader, propertyType, index);
					break;

				case 'EnumProperty':
					const name = reader.readString();
					overhead = EnumProperty.CalcOverhead(currentProperty, name);
					currentProperty = EnumProperty.Parse(reader, propertyType, name, index);
					break;

				case 'StructProperty':
					subtype = reader.readString();
					overhead = StructProperty.CalcOverhead(currentProperty, subtype);
					currentProperty = StructProperty.Parse(reader, propertyType, index, binarySize, subtype);
					break;

				case 'ArrayProperty':
					subtype = reader.readString();
					overhead = ArrayProperty.CalcOverhead(currentProperty, subtype);
					currentProperty = ArrayProperty.Parse(reader, propertyType, index, binarySize, subtype);
					break;

				case 'MapProperty':
					const keyType = reader.readString();
					const valueType = reader.readString();
					overhead = MapProperty.CalcOverhead(currentProperty, keyType, valueType);
					currentProperty = MapProperty.Parse(reader, propertyName, binarySize, keyType, valueType);
					break;

				case 'TextProperty':
					overhead = TextProperty.CalcOverhead(currentProperty);
					currentProperty = TextProperty.Parse(reader, propertyType, index);
					break;

				case 'SetProperty':
					subtype = reader.readString();
					overhead = SetProperty.CalcOverhead(currentProperty, subtype);
					currentProperty = SetProperty.Parse(reader, propertyType, index, propertyName, subtype);
					break;

				default:
					throw new Error(`Unimplemented type ${propertyType}, at byte position ${reader.getBufferPosition()}`);
			}

			currentProperty.name = propertyName;

			const readBytes = reader.getBufferPosition() - before - overhead;
			if (readBytes !== binarySize) {
				throw new ParserError('ParserError', `Property possibly corrupt. Read ${readBytes} bytes for ${propertyType} ${propertyName}, but ${binarySize} bytes were indicated.`);
			}
		} catch (error) {
			if (reader.context.throwErrors) {
				throw error;
			} else {

				// we inform about the error and dump the calculated byte content of the property.
				console.warn(error);
				console.warn(`property ${propertyName} of type ${propertyType} is therefore dumped as raw bytes.`);

				reader.skipBytes(before - reader.getBufferPosition());
				(currentProperty as AbstractBaseProperty).rawBytes = Array.from(reader.readBytes(binarySize + overhead));
			}
		}

		return currentProperty;
	}

	export const SerializeSingleProperty = (writer: ContextWriter, property: AbstractBaseProperty): void => {

		// in case we have a property that we could not parse before.
		if (property.rawBytes !== undefined) {
			writer.writeBytesArray(property.rawBytes);
			return;
		}

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
				overhead = ByteProperty.CalcOverhead(property as ByteProperty, (property as ByteProperty).value.type);
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
				overhead = EnumProperty.CalcOverhead(property as EnumProperty, (property as EnumProperty).value.name);
				EnumProperty.Serialize(writer, property as EnumProperty);
				break;

			case 'StructProperty':
				overhead = StructProperty.CalcOverhead(property as StructProperty, (property as StructProperty).subtype);
				StructProperty.Serialize(writer, property as StructProperty);
				break;

			case 'ArrayProperty':
				overhead = ArrayProperty.CalcOverhead(property as ArrayProperty.AvailableArrayPropertyTypes, (property as ArrayProperty.AvailableArrayPropertyTypes).subtype);
				ArrayProperty.Serialize(writer, property as ArrayProperty.AvailableArrayPropertyTypes);
				break;

			case 'MapProperty':
				overhead = MapProperty.CalcOverhead(property as MapProperty, (property as MapProperty).keyType, (property as MapProperty).valueType);
				MapProperty.Serialize(writer, property as MapProperty);
				break;

			case 'TextProperty':
				overhead = TextProperty.CalcOverhead(property as TextProperty);
				TextProperty.Serialize(writer, property as TextProperty);
				break;

			case 'SetProperty':
				overhead = SetProperty.CalcOverhead(property as SetProperty.AvailableSetPropertyTypes, (property as SetProperty.AvailableSetPropertyTypes).subtype);
				SetProperty.Serialize(writer, property as SetProperty.AvailableSetPropertyTypes);
				break;

			default:
				throw new Error(`Unimplemented type ${property.type}`);
		}

		// replace len indicator.
		writer.writeBinarySizeFromPosition(lenIndicator, start + overhead);
	}
}

