import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { DynamicStructPropertyValue } from '../../structs/DynamicStructPropertyValue';
import { ObjectReference } from '../../structs/ObjectReference';
import { AbstractBaseProperty } from './AbstractBaseProperty';
import { ByteProperty } from './ByteProperty';
import { EnumProperty } from './EnumProperty';
import { Int32Property } from './Int32Property';
import { Int64Property } from './Int64Property';
import { ObjectProperty } from './ObjectProperty';
import { StrProperty } from './StrProperty';
import { GENERIC_STRUCT_PROPERTY_VALUE } from './StructProperty';


export type MAP_STRUCT_KEY_PROXY = [number, number, number, number, number, number, number, number, number, number, number, number];
export type GENERIC_MAP_KEY_TYPE = number | ObjectReference | boolean | GENERIC_STRUCT_PROPERTY_VALUE | MAP_STRUCT_KEY_PROXY;
export type GENERIC_MAP_VALUE_TYPE = number | ObjectReference | boolean | GENERIC_STRUCT_PROPERTY_VALUE;

export const isMapProperty = (property: any): property is MapProperty => !Array.isArray(property) && property.type === 'MapProperty';

export type MapProperty = AbstractBaseProperty & {
    type: 'MapProperty';
    keyType: string;
    valueType: string;
    modeType: number;
    modeUnk1: string | undefined;
    modeUnk2: string;
    modeUnk3: string;
    values: [key: GENERIC_MAP_KEY_TYPE, value: GENERIC_MAP_VALUE_TYPE][];
};


export namespace MapProperty {

    export const Parse = (reader: BinaryReadable, propertyName: string, buildVersion: number, size: number, ueType: string = 'MapProperty', index: number = 0): MapProperty => {
        const start = reader.getBufferPosition();
        const property: MapProperty = {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'MapProperty',
            keyType: reader.readString(),
            valueType: reader.readString(),
            guidInfo: undefined,
            modeType: 0,
            values: [],
            modeUnk1: undefined,
            modeUnk2: '',
            modeUnk3: ''
        };

        reader.readByte(); //0
        property.modeType = reader.readInt32(); //0

        const elementCount = reader.readInt32();
        for (let i = 0; i < elementCount; i++) {
            let key: GENERIC_MAP_KEY_TYPE;
            let value: GENERIC_MAP_VALUE_TYPE;
            switch (property.keyType) {
                case 'StructProperty':

                    // TODO: extra for properties like mSaveData, the structure is specific here
                    // don'T ask me why this has this weird form. But maybe it is for maps in general that have Struct as key? So far we only see this in those 2 properties.
                    // F4 FF FF FF 26 00 00 00 FF FF FF FF - Save in Release 1.0
                    // F5 FF FF FF 27 00 00 00 FF FF FF FF - Save started in U8
                    // FD FF FF FF 2B 00 00 00 FF FF FF FF - another Save started in U8
                    // 11 00 00 00 EF FF FF FF 02 00 00 00 - Save ported from U5 -> U8
                    if (propertyName === 'mSaveData' || propertyName === 'mUnresolvedSaveData') {
                        key = Array.from(reader.readBytes(12)) as MAP_STRUCT_KEY_PROXY;
                    } else {
                        key = DynamicStructPropertyValue.read(reader, 0, property.keyType);
                    }

                    break;
                case 'ObjectProperty':
                    key = ObjectProperty.ReadValue(reader);
                    break;
                case 'StrProperty':
                case 'NameProperty':
                    key = StrProperty.ReadValue(reader);
                    break;
                case 'EnumProperty':
                    key = EnumProperty.ReadValue(reader);
                    break;
                case 'IntProperty':
                case 'Int32Property':
                    key = Int32Property.ReadValue(reader);
                    break;
                case 'Int64Property':
                    key = Int64Property.ReadValue(reader);
                    break;
                case 'ByteProperty':
                    key = ByteProperty.ReadValue(reader);
                    break;
                default:
                    throw new Error(`not implemented map key type ${property.keyType}`);
            }

            switch (property.valueType) {
                case 'StructProperty':
                    value = DynamicStructPropertyValue.read(reader, 0, property.valueType);
                    break;
                case 'ObjectProperty':
                    value = ObjectProperty.ReadValue(reader);
                    break;
                case 'StrProperty':
                case 'NameProperty':
                    value = StrProperty.ReadValue(reader);
                    break;
                case 'EnumProperty':
                    value = EnumProperty.ReadValue(reader);
                    break;
                case 'IntProperty':
                case 'Int32Property':
                    value = Int32Property.ReadValue(reader);
                    break;
                case 'Int64Property':
                    value = Int64Property.ReadValue(reader);
                    break;
                case 'ByteProperty':
                    value = ByteProperty.ReadValue(reader);
                    break;
                default:
                    throw new Error(`not implemented map value type ${property.valueType}`);
            }

            property.values.push([key, value]);
        }

        return property;
    }

    export const CalcOverhead = (property: MapProperty): number => {
        return property.keyType.length + 5 + property.valueType.length + 5 + 1;
    }

    export const Serialize = (writer: ByteWriter, property: MapProperty): void => {

        writer.writeString(property.keyType);
        writer.writeString(property.valueType);

        writer.writeByte(0);
        writer.writeInt32(property.modeType);

        writer.writeInt32(property.values.length);
        for (const entry of property.values) {

            switch (property.keyType) {
                case 'StructProperty':

                    if (property.name === 'mSaveData' || property.name === 'mUnresolvedSaveData') {
                        writer.writeBytesArray(entry[0] as MAP_STRUCT_KEY_PROXY);
                    } else {
                        DynamicStructPropertyValue.write(writer, 0, entry[0] as DynamicStructPropertyValue);
                    }

                    break;
                case 'ObjectProperty':
                    ObjectProperty.SerializeValue(writer, entry[0] as ObjectReference);
                    break;
                case 'StrProperty':
                case 'NameProperty':
                    StrProperty.SerializeValue(writer, entry[0] as string);
                    break;
                case 'EnumProperty':
                    EnumProperty.SerializeValue(writer, entry[0] as string);
                    break;
                case 'IntProperty':
                case 'Int32Property':
                    Int32Property.SerializeValue(writer, entry[0] as number);
                    break;
                case 'Int64Property':
                    Int64Property.SerializeValue(writer, entry[0] as string);
                    break;
                case 'ByteProperty':
                    ByteProperty.SerializeValue(writer, entry[0] as number);
                    break;
                default:
                    throw new Error(`not implemented map key type ${property.valueType}`);
            }

            switch (property.valueType) {
                case 'StructProperty':
                    DynamicStructPropertyValue.write(writer, 0, entry[1] as DynamicStructPropertyValue);
                    break;
                case 'ObjectProperty':
                    ObjectProperty.SerializeValue(writer, entry[1] as ObjectReference);
                    break;
                case 'StrProperty':
                case 'NameProperty':
                    StrProperty.SerializeValue(writer, entry[1] as string);
                    break;
                case 'EnumProperty':
                    EnumProperty.SerializeValue(writer, entry[1] as string);
                    break;
                case 'IntProperty':
                case 'Int32Property':
                    Int32Property.SerializeValue(writer, entry[1] as number);
                    break;
                case 'Int64Property':
                    Int64Property.SerializeValue(writer, entry[1] as string);
                    break;
                case 'ByteProperty':
                    ByteProperty.SerializeValue(writer, entry[1] as number);
                    break;
                default:
                    throw new Error(`not implemented map value type ${property.valueType}`);
            }
        }
    }
}
