import { BinaryReadable } from '../../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../../byte/byte-writer.class';
import { UnimplementedError } from '../../../../../error/parser.error';
import { BoolArrayProperty, isBoolArrayProperty } from './BoolArrayProperty';
import { ByteArrayProperty, isByteArrayProperty } from './ByteArrayProperty';
import { DoubleArrayProperty, isDoubleArrayProperty } from './DoubleArrayProperty';
import { EnumArrayProperty, isEnumArrayProperty } from './EnumArrayProperty';
import { FloatArrayProperty, isFloatArrayProperty } from './FloatArrayProperty';
import { Int32ArrayProperty, isInt32ArrayProperty } from './Int32ArrayProperty';
import { Int64ArrayProperty, isInt64ArrayProperty } from './Int64ArrayProperty';
import { isObjectArrayProperty, ObjectArrayProperty } from './ObjectArrayProperty';
import { isSoftObjectArrayProperty, SoftObjectArrayProperty } from './SoftObjectArrayProperty';
import { isStrArrayProperty, StrArrayProperty } from './StrArrayProperty';
import { isStructArrayProperty, StructArrayProperty } from './StructArrayProperty';
import { isTextArrayProperty, TextArrayProperty } from './TextArrayProperty';

export const isArrayProperty = (obj: any) =>
    isBoolArrayProperty(obj)
    || isByteArrayProperty(obj)
    || isDoubleArrayProperty(obj)
    || isEnumArrayProperty(obj)
    || isFloatArrayProperty(obj)
    || isInt32ArrayProperty(obj)
    || isInt64ArrayProperty(obj)
    || isObjectArrayProperty(obj)
    || isSoftObjectArrayProperty(obj)
    || isStrArrayProperty(obj)
    || isStructArrayProperty(obj)
    || isTextArrayProperty(obj);

export namespace ArrayProperty {

    export type AvailableArrayPropertyTypes = ReturnType<typeof Parse>;

    export const Parse = (reader: BinaryReadable, ueType: string, index: number, size: number) => {
        const subtype = reader.readString();
        reader.skipBytes(1); // 0

        let property;
        const elementCount = reader.readInt32();
        switch (subtype) {
            case "FloatProperty":
                property = FloatArrayProperty.Parse(reader, elementCount, subtype, ueType, index);
                break;

            case "BoolProperty":
                property = BoolArrayProperty.Parse(reader, elementCount, subtype, ueType, index);
                break;

            case "IntProperty":
                property = Int32ArrayProperty.Parse(reader, elementCount, subtype, ueType, index);
                break;

            case "Int64Property":
                property = Int64ArrayProperty.Parse(reader, elementCount, subtype, ueType, index);
                break;

            case "DoubleProperty":
                property = DoubleArrayProperty.Parse(reader, elementCount, subtype, ueType, index);
                break;

            case "ByteProperty":
                property = ByteArrayProperty.Parse(reader, elementCount, subtype, ueType, index);
                break;

            case "StrProperty":
                property = StrArrayProperty.Parse(reader, elementCount, subtype, ueType, index);
                break;

            case "EnumProperty":
                property = EnumArrayProperty.Parse(reader, elementCount, subtype, ueType, index);
                break;

            case "TextProperty":
                property = TextArrayProperty.Parse(reader, elementCount, subtype, ueType, index);
                break;

            case "InterfaceProperty":
            case "ObjectProperty":
                property = ObjectArrayProperty.Parse(reader, elementCount, subtype, ueType, index);
                break;

            case "SoftObjectProperty":
                property = SoftObjectArrayProperty.Parse(reader, elementCount, subtype, ueType, index);
                break;


            case "StructProperty":
                property = StructArrayProperty.Parse(reader, elementCount, subtype, ueType, index);
                break;

            default:
                throw new UnimplementedError(`Unknown array property subtype ${subtype} for ${ueType}. Not implemented.`);

        }

        return property;
    }

    export const CalcOverhead = (property: AvailableArrayPropertyTypes): number => {
        return property.subtype.length + 5 + 1;
    }

    export const Serialize = (writer: ByteWriter, property: AvailableArrayPropertyTypes): void => {

        writer.writeString(property.subtype);
        writer.writeByte(0);
        writer.writeInt32(property.values.length);

        if (isFloatArrayProperty(property)) {
            FloatArrayProperty.Serialize(writer, property);
        } else if (isBoolArrayProperty(property)) {
            BoolArrayProperty.Serialize(writer, property);
        } else if (isInt32ArrayProperty(property)) {
            Int32ArrayProperty.Serialize(writer, property);
        } else if (isInt64ArrayProperty(property)) {
            Int64ArrayProperty.Serialize(writer, property);
        } else if (isDoubleArrayProperty(property)) {
            DoubleArrayProperty.Serialize(writer, property);
        } else if (isByteArrayProperty(property)) {
            ByteArrayProperty.Serialize(writer, property);
        } else if (isStrArrayProperty(property)) {
            StrArrayProperty.Serialize(writer, property);
        } else if (isEnumArrayProperty(property)) {
            EnumArrayProperty.Serialize(writer, property);
        } else if (isTextArrayProperty(property)) {
            TextArrayProperty.Serialize(writer, property);
        } else if (isObjectArrayProperty(property)) {
            ObjectArrayProperty.Serialize(writer, property);
        } else if (isSoftObjectArrayProperty(property)) {
            SoftObjectArrayProperty.Serialize(writer, property);
        } else if (isStructArrayProperty(property)) {
            StructArrayProperty.Serialize(writer, property);
        } else {
            throw new UnimplementedError(`Unknown array property to serialize. ${(property as any).type ?? ''}, ${(property as any).subtype ?? ''}`);
        }
    }
}
