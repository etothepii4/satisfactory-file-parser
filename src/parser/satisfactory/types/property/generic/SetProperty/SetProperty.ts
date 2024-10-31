import { BinaryReadable } from '../../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../../byte/byte-writer.class';
import { UnimplementedError } from '../../../../../error/parser.error';
import { Int32SetProperty, isInt32SetProperty } from './Int32SetProperty';
import { isObjectSetProperty, ObjectSetProperty } from './ObjectSetProperty';
import { isStrSetProperty, StrSetProperty } from './StrSetProperty';
import { isStructSetProperty, StructSetProperty } from './StructSetProperty';
import { isUint32SetProperty, Uint32SetProperty } from './Uint32SetProperty';

export const isSetProperty = (obj: any) =>
    isUint32SetProperty(obj)
    || isInt32SetProperty(obj)
    || isObjectSetProperty(obj)
    || isStrSetProperty(obj)
    || isStructSetProperty(obj);

export namespace SetProperty {

    export type AvailableSetPropertyTypes = ReturnType<typeof Parse>;

    export const Parse = (reader: BinaryReadable, ueType: string, index: number, propertyName: string) => {

        const subtype = reader.readString();
        reader.skipBytes(1); // 0
        reader.skipBytes(4); // 0
        const elementCount = reader.readInt32();

        let property;
        switch (subtype) {

            case "UInt32Property":
                property = Uint32SetProperty.Parse(reader, elementCount, subtype, ueType, index);
                break;

            case "IntProperty":
                property = Int32SetProperty.Parse(reader, elementCount, subtype, ueType, index);
                break;

            case "ObjectProperty":
                property = ObjectSetProperty.Parse(reader, elementCount, subtype, ueType, index);
                break;

            case "NameProperty":
                property = StrSetProperty.Parse(reader, elementCount, subtype, ueType, index);
                break;

            case "StructProperty":
                property = StructSetProperty.Parse(reader, elementCount, subtype, ueType, index, propertyName);
                break;

            default:
                throw new Error(`Not Implemented SetProperty of ${subtype}.`);
        }

        return property;
    }

    export const CalcOverhead = (property: SetProperty.AvailableSetPropertyTypes): number => {
        return property.subtype.length + 5 + 1;
    }

    export const Serialize = (writer: ByteWriter, property: SetProperty.AvailableSetPropertyTypes): void => {
        writer.writeString(property.subtype);
        writer.writeByte(0);
        writer.writeInt32(0);
        writer.writeInt32(property.values.length);

        if (isInt32SetProperty(property)) {
            Int32SetProperty.Serialize(writer, property);
        } else if (isUint32SetProperty(property)) {
            Uint32SetProperty.Serialize(writer, property);
        } else if (isObjectSetProperty(property)) {
            ObjectSetProperty.Serialize(writer, property);
        } else if (isStrSetProperty(property)) {
            StrSetProperty.Serialize(writer, property);
        } else if (isStructSetProperty(property)) {
            StructSetProperty.Serialize(writer, property);
        } else {
            throw new UnimplementedError(`Not Implemented Serializing SetProperty of ${(property as any).subtype}.`);
        }
    }
}
