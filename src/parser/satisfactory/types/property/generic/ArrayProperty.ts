import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { UnimplementedError } from '../../../../error/parser.error';
import { ObjectReference } from '../../structs/ObjectReference';
import { SoftObjectReference } from '../../structs/SoftObjectReference';
import { BasicProperty } from './BasicProperty';
import { BoolProperty } from './BoolProperty';
import { ByteProperty } from './ByteProperty';
import { DoubleProperty } from './DoubleProperty';
import { EnumProperty } from './EnumProperty';
import { FloatProperty } from './FloatProperty';
import { Int32Property } from './Int32Property';
import { Int64Property } from './Int64Property';
import { ObjectProperty } from './ObjectProperty';
import { SoftObjectProperty } from './SoftObjectProperty';
import { StrProperty } from './StrProperty';
import { StructProperty } from './StructProperty';
import { TextProperty, TextPropertyValue } from './TextProperty';


export type ArrayPropertyStructValueFields = {
    allStructType: string;
    allIndex: number;
    allGuid: number;
    allUnk1?: number;
    allUnk2?: number;
    allUnk3?: number;
    allUnk4?: number;
};

export const isArrayProperty = (property: BasicProperty): property is ArrayProperty<any> => property.type === 'ArrayProperty';

export class ArrayProperty<T> extends BasicProperty {

    constructor(public subtype: string, public values: T[], ueType: string = 'ArrayProperty', index: number = 0, public structValueFields?: ArrayPropertyStructValueFields) {
        super({ type: 'ArrayProperty', ueType, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number, propertyName: string): ArrayProperty<any> {
        const subtype = reader.readString();
        reader.skipBytes(1); // 0

        let property;
        const elementCount = reader.readInt32();
        switch (subtype) {
            case "FloatProperty":
                property = new ArrayProperty<number>(subtype, new Array(elementCount).fill(0).map(() => FloatProperty.ReadValue(reader)), ueType, index);
                break;

            case "BoolProperty":
                property = new ArrayProperty<boolean>(subtype, new Array(elementCount).fill(0).map(() => BoolProperty.ReadValue(reader)), ueType, index);
                break;

            case "IntProperty":
                property = new ArrayProperty<number>(subtype, new Array(elementCount).fill(0).map(() => Int32Property.ReadValue(reader)), ueType, index);
                break;

            case "Int64Property":
                property = new ArrayProperty<string>(subtype, new Array(elementCount).fill(0).map(() => Int64Property.ReadValue(reader)), ueType, index);
                break;

            case "DoubleProperty":
                property = new ArrayProperty<number>(subtype, new Array(elementCount).fill(0).map(() => DoubleProperty.ReadValue(reader)), ueType, index);
                break;

            case "ByteProperty":
                property = new ArrayProperty<number>(subtype, new Array(elementCount).fill(0).map(() => ByteProperty.ReadValue(reader)), ueType, index);
                break;

            case "StrProperty":
                property = new ArrayProperty<string>(subtype, new Array(elementCount).fill(0).map(() => StrProperty.ReadValue(reader)), ueType, index);
                break;

            case "EnumProperty":
                property = new ArrayProperty<string>(subtype, new Array(elementCount).fill(0).map(() => EnumProperty.ReadValue(reader)), ueType, index);
                break;

            case "TextProperty":
                property = new ArrayProperty<TextPropertyValue>(subtype, new Array(elementCount).fill(0).map(() => TextProperty.ReadValue(reader)), ueType, index);
                break;

            case "InterfaceProperty":
            case "ObjectProperty":
                property = new ArrayProperty<ObjectReference>(subtype, new Array(elementCount).fill(0).map(() => ObjectProperty.ReadValue(reader)), ueType, index);
                break;

            case "SoftObjectProperty":
                property = new ArrayProperty<SoftObjectReference>(subtype, new Array(elementCount).fill(0).map(() => SoftObjectProperty.ReadValue(reader)), ueType, index);
                break;


            case "StructProperty":

                const name = reader.readString(); // Same as currentProperty.name
                const type = reader.readString(); // StructProperty

                const binarySize = reader.readInt32(); // structureSize
                const allIndex = reader.readInt32(); // 0

                const allStructType = reader.readString();
                const allGuid = reader.readInt32();

                const allUnk1 = reader.readInt32();
                const allUnk2 = reader.readInt32();
                const allUnk3 = reader.readInt32();
                const allUnk4 = reader.readByte();

                const innerStructValueFields: ArrayPropertyStructValueFields = { allStructType, allIndex, allGuid };
                if (allUnk1 !== 0) {
                    innerStructValueFields.allUnk1 = allUnk1;
                }
                if (allUnk2 !== 0) {
                    innerStructValueFields.allUnk2 = allUnk2;
                }
                if (allUnk3 !== 0) {
                    innerStructValueFields.allUnk3 = allUnk3;
                }
                if (allUnk4 !== 0) {
                    innerStructValueFields.allUnk4 = allUnk4;
                }


                const before = reader.getBufferPosition();
                const maArr = new Array(elementCount).fill(0).map(() => {

                    const struct = new StructProperty(allStructType, type, allIndex, allGuid);

                    // we do NOT assign individual unk's here. Since they are only serialized always on ArrayProperty's Level once for all elements.
                    struct.value = StructProperty.ParseValue(reader, allStructType, binarySize);
                    return struct;
                });
                const readBytes = reader.getBufferPosition() - before;
                if (readBytes !== binarySize) {
                    throw new Error('possibly corrupt in array of struct.');
                }

                // Array Properties with struct values have some more properties.
                property = new ArrayProperty<StructProperty>(subtype, maArr, ueType, index, innerStructValueFields);
                break;

            default:
                throw new UnimplementedError(`Unknown subtype ${subtype} for ${ueType}. Not implemented.`);

        }

        return property;
    }

    public static CalcOverhead(property: ArrayProperty<any>): number {
        return property.subtype.length + 5 + 1;
    }

    public static Serialize(writer: ByteWriter, property: ArrayProperty<any>, propertyName: string): void {

        writer.writeString(property.subtype);
        writer.writeByte(0);
        writer.writeInt32(property.values.length);

        switch (property.subtype) {
            case "FloatProperty":
                property.values.forEach(v => FloatProperty.SerializeValue(writer, v));
                break;

            case "BoolProperty":
                property.values.forEach(v => BoolProperty.SerializeValue(writer, v));
                break;

            case "IntProperty":
                property.values.forEach(v => Int32Property.SerializeValue(writer, v));
                break;

            case "Int64Property":
                property.values.forEach(v => Int64Property.SerializeValue(writer, v));
                break;

            case "DoubleProperty":
                property.values.forEach(v => DoubleProperty.SerializeValue(writer, v));
                break;

            case "ByteProperty":
                property.values.forEach(v => ByteProperty.SerializeValue(writer, v));
                break;

            case "StrProperty":
                property.values.forEach(v => StrProperty.SerializeValue(writer, v));
                break;

            case "EnumProperty":
                property.values.forEach(v => EnumProperty.SerializeValue(writer, v));
                break;

            case "TextProperty":
                property.values.forEach(v => TextProperty.SerializeValue(writer, v));
                break;

            case "InterfaceProperty":
            case "ObjectProperty":
                property.values.forEach(v => ObjectProperty.SerializeValue(writer, v));
                break;

            case "SoftObjectProperty":
                property.values.forEach(v => SoftObjectProperty.SerializeValue(writer, v));
                break;

            case "StructProperty":

                writer.writeString(propertyName);
                writer.writeString(property.subtype);

                const lenIndicator = writer.getBufferPosition();
                writer.writeInt32(0);
                writer.writeInt32(property.structValueFields!.allIndex);

                writer.writeString(property.structValueFields!.allStructType);
                writer.writeInt32(property.structValueFields!.allGuid);

                writer.writeInt32(property.structValueFields!.allUnk1 ?? 0);
                writer.writeInt32(property.structValueFields!.allUnk2 ?? 0);
                writer.writeInt32(property.structValueFields!.allUnk3 ?? 0);
                writer.writeByte(property.structValueFields!.allUnk4 ?? 0);

                const before = writer.getBufferPosition();
                property.values.forEach(v => StructProperty.SerializeValue(writer, property.structValueFields!.allStructType, v.value));
                writer.writeBinarySizeFromPosition(lenIndicator, before);
                break;

            default:
                throw new Error(`Unknown array property ${property.ueType}, ${property.type}`);
        }
    }
}
