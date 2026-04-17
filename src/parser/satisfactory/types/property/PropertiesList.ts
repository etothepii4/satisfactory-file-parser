import { ContextReader } from '../../../context/context-reader';
import { ContextWriter } from '../../../context/context-writer';
import { ParserError } from '../../../error/parser.error';
import { FPropertyTag } from '../structs/binary/FPropertyTag';
import { AbstractBaseProperty, PropertiesMap } from './generic/AbstractBaseProperty';
import { BoolProperty } from './generic/BoolProperty';
import { ByteProperty } from './generic/ByteProperty';
import { ArrayProperty } from './generic/containers/ArrayProperty';
import { MapProperty } from './generic/containers/MapProperty';
import { SetProperty } from './generic/containers/SetProperty';
import { StructProperty } from './generic/containers/StructProperty';
import { DoubleProperty } from './generic/DoubleProperty';
import { EnumProperty } from './generic/EnumProperty';
import { FloatProperty } from './generic/FloatProperty';
import { Int64Property } from './generic/Int64Property';
import { Int8Property } from './generic/Int8Property';
import { InterfaceProperty } from './generic/InterfaceProperty';
import { IntProperty } from './generic/IntProperty';
import { NameProperty } from './generic/NameProperty';
import { ObjectProperty } from './generic/ObjectProperty';
import { SingleProperty } from './generic/SingleProperty';
import { SoftObjectProperty } from './generic/SoftObjectProperty';
import { StrProperty } from './generic/StrProperty';
import { TextProperty } from './generic/TextProperty';
import { Uint32Property } from './generic/Uint32Property';
import { Uint64Property } from './generic/Uint64Property';
import { Uint8Property } from './generic/Uint8Property';


export namespace PropertiesList {

	export function ParseList(reader: ContextReader): PropertiesMap {

		const properties: PropertiesMap = {};
		let parsedProperty = PropertiesList.ParseSingleProperty(reader);
		while (parsedProperty !== null) {

			// if it already exists, make it an array.
			if (properties[parsedProperty.name]) {
				if (!Array.isArray(properties[parsedProperty.name])) {
					properties[parsedProperty.name] = [properties[parsedProperty.name] as AbstractBaseProperty];
				}
				(properties[parsedProperty.name] as AbstractBaseProperty[]).push(parsedProperty);
			} else {
				properties[parsedProperty.name] = parsedProperty;
			}

			parsedProperty = PropertiesList.ParseSingleProperty(reader);
		}

		return properties;
	}

	export function SerializeList(writer: ContextWriter, properties: PropertiesMap): void {
		for (const property of Object.values(properties).flatMap(val => Array.isArray(val) ? val : [val])) {
			PropertiesList.SerializeSingleProperty(writer, property);
		}
		writer.writeString('None');
	}

	export function ParseSingleProperty(reader: ContextReader): AbstractBaseProperty | null {

		// read tag and merge it into our property. since some values actually are in the tag.
		const tag = FPropertyTag.read(reader);
		if (tag.propertyName === 'None') {
			return null;
		}
		let property = AbstractBaseProperty.CreateFromTag(tag);

		// read property value
		const before = reader.getBufferPosition();
		try {
			switch (property.propertyTagType.name) {
				case 'BoolProperty':
					BoolProperty.Parse(reader, property as BoolProperty, tag);
					break;

				case 'ByteProperty':
					ByteProperty.Parse(reader, property as ByteProperty, tag);
					break;

				case 'Int8Property':
					Int8Property.Parse(reader, property as Int8Property);
					break;

				case 'UInt8Property':
					Uint8Property.Parse(reader, property as Uint8Property);
					break;

				case 'IntProperty':
					IntProperty.Parse(reader, property as IntProperty);
					break;

				case 'UInt32Property':
					Uint32Property.Parse(reader, property as Uint32Property);
					break;

				case 'Int64Property':
					Int64Property.Parse(reader, property as Int64Property);
					break;

				case 'UInt64Property':
					Uint64Property.Parse(reader, property as Uint64Property);
					break;

				case 'SingleProperty':
					SingleProperty.Parse(reader, property as SingleProperty);
					break;

				case 'FloatProperty':
					FloatProperty.Parse(reader, property as FloatProperty);
					break;

				case 'DoubleProperty':
					DoubleProperty.Parse(reader, property as DoubleProperty);
					break;

				case 'StrProperty':
					StrProperty.Parse(reader, property as StrProperty);
					break;

				case 'NameProperty':
					NameProperty.Parse(reader, property as NameProperty);
					break;

				case 'ObjectProperty':
					ObjectProperty.Parse(reader, property as ObjectProperty);
					break;

				case 'InterfaceProperty':
					InterfaceProperty.Parse(reader, property as InterfaceProperty);
					break;

				case 'SoftObjectProperty':
					SoftObjectProperty.Parse(reader, property as SoftObjectProperty);
					break;

				case 'EnumProperty':
					EnumProperty.Parse(reader, property as EnumProperty, tag);
					break;

				case 'StructProperty':
					StructProperty.Parse(reader, property as StructProperty, tag);
					break;

				case 'ArrayProperty':
					ArrayProperty.Parse(reader, tag, property as ArrayProperty);
					break;

				case 'MapProperty':
					MapProperty.Parse(reader, property as MapProperty);
					break;

				case 'TextProperty':
					TextProperty.Parse(reader, property as TextProperty);
					break;

				case 'SetProperty':
					SetProperty.Parse(reader, property as SetProperty);
					break;

				default:
					throw new Error(`Unimplemented type ${property.propertyTagType.name}, at byte position ${reader.getBufferPosition()}`);
			}


			const readBytes = reader.getBufferPosition() - before;
			if (readBytes !== tag.binarySize) {
				throw new ParserError('ParserError', `Property possibly corrupt. Read ${readBytes} bytes for ${property.propertyTagType.name} ${property.name}, but ${tag.binarySize} bytes were indicated.`);
			}
		} catch (error) {
			if (reader.context.throwErrors) {
				throw error;
			} else {

				// we inform about the error and dump the calculated byte content of the property.
				console.warn(`property ${tag.propertyName} of type ${property.propertyTagType.name} is therefore dumped as raw bytes.`);

				reader.skipBytes(before - reader.getBufferPosition());
				(property as AbstractBaseProperty).rawBytes = Array.from(reader.readBytes(tag.binarySize));
			}
		}

		return property;
	}

	export function SerializeSingleProperty(writer: ContextWriter, property: AbstractBaseProperty): void {

		// in case we have a property that we could not parse before.
		if (property.rawBytes !== undefined) {
			writer.writeBytesArray(property.rawBytes);
			return;
		}

		// separate proeprty into tag
		const { binarySizeLocation } = FPropertyTag.writeFromProperty(writer, property);


		const start = writer.getBufferPosition();
		switch (property.propertyTagType.name) {
			case 'BoolProperty':
				BoolProperty.Serialize(writer, property as BoolProperty);
				break;

			case 'ByteProperty':
				ByteProperty.Serialize(writer, property as ByteProperty);
				break;

			case 'Int8Property':
				Int8Property.Serialize(writer, property as Int8Property);
				break;

			case 'UInt8Property':
				Uint8Property.Serialize(writer, property as Uint8Property);
				break;

			case 'IntProperty':
				IntProperty.Serialize(writer, property as IntProperty);
				break;

			case 'UInt32Property':
				Uint32Property.Serialize(writer, property as Uint32Property);
				break;

			case 'Int64Property':
				Int64Property.Serialize(writer, property as Int64Property);
				break;

			case 'UInt64PRoperty':
				Uint64Property.Serialize(writer, property as Uint64Property);
				break;

			case 'SingleProperty':
			case 'FloatProperty':
				FloatProperty.Serialize(writer, property as FloatProperty);
				break;

			case 'DoubleProperty':
				DoubleProperty.Serialize(writer, property as DoubleProperty);
				break;

			case 'StrProperty':
			case 'NameProperty':
				StrProperty.Serialize(writer, property as StrProperty);
				break;

			case 'ObjectProperty':
			case 'InterfaceProperty':
				ObjectProperty.Serialize(writer, property as ObjectProperty);
				break;

			case 'SoftObjectProperty':
				SoftObjectProperty.Serialize(writer, property as SoftObjectProperty);
				break;

			case 'EnumProperty':
				EnumProperty.Serialize(writer, property as EnumProperty);
				break;

			case 'StructProperty':
				StructProperty.Serialize(writer, property as StructProperty);
				break;

			case 'ArrayProperty':
				ArrayProperty.Serialize(writer, property as ArrayProperty);
				break;

			case 'MapProperty':
				MapProperty.Serialize(writer, property as MapProperty);
				break;

			case 'TextProperty':
				TextProperty.Serialize(writer, property as TextProperty);
				break;

			case 'SetProperty':
				SetProperty.Serialize(writer, property as SetProperty);
				break;

			default:
				throw new Error(`Unimplemented type ${property.propertyTagType.name}`);
		}

		// replace len indicator.
		writer.writeBinarySizeFromPosition(binarySizeLocation, start);
	}
}

