import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { UnimplementedError } from '../../../../../error/parser.error';
import { SaveCustomVersion } from '../../../../save/save-custom-version';
import { FPropertyTag } from '../../../structs/binary/FPropertyTag';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { BoolProperty } from '../BoolProperty';
import { ByteProperty } from '../ByteProperty';
import { DoubleProperty } from '../DoubleProperty';
import { EnumProperty } from '../EnumProperty';
import { FloatProperty } from '../FloatProperty';
import { Int64Property } from '../Int64Property';
import { InterfaceProperty } from '../InterfaceProperty';
import { IntProperty } from '../IntProperty';
import { ObjectProperty } from '../ObjectProperty';
import { SoftObjectProperty } from '../SoftObjectProperty';
import { StrProperty } from '../StrProperty';
import { TextProperty } from '../TextProperty';
import { StructProperty } from './StructProperty';

export const isArrayProperty = (property: any): property is ArrayProperty => !Array.isArray(property) && property.propertyTagType.name === 'ArrayProperty';

export type ArrayProperty = AbstractBaseProperty & {
    type: 'ArrayProperty';
    structTag?: FPropertyTag;
    values: any[];
}

export namespace ArrayProperty {

    export function Parse(reader: ContextReader, tag: FPropertyTag, property: ArrayProperty): void {

        const elementCount = reader.readInt32();
        switch (property.propertyTagType.children[0].name) {
            case "FloatProperty":
                property.values = new Array(elementCount).fill(0).map(() => FloatProperty.ReadValue(reader));
                break;

            case "BoolProperty":
                property.values = new Array(elementCount).fill(0).map(() => BoolProperty.ReadValue(reader));
                break;

            case "IntProperty":
                property.values = new Array(elementCount).fill(0).map(() => IntProperty.ReadValue(reader));
                break;

            case "Int64Property":
                property.values = new Array(elementCount).fill(0).map(() => Int64Property.ReadValue(reader));
                break;

            case "DoubleProperty":
                property.values = new Array(elementCount).fill(0).map(() => DoubleProperty.ReadValue(reader));
                break;

            case "ByteProperty":
                property.values = new Array(elementCount).fill(0).map(() => ByteProperty.ReadValue(reader));
                break;

            case "StrProperty":
                property.values = new Array(elementCount).fill(0).map(() => StrProperty.ReadValue(reader));
                break;

            case "EnumProperty":
                property.values = new Array(elementCount).fill(0).map(() => EnumProperty.ReadValue(reader));
                break;

            case "TextProperty":
                property.values = new Array(elementCount).fill(0).map(() => TextProperty.ReadValue(reader));
                break;

            case "InterfaceProperty":
                property.values = new Array(elementCount).fill(0).map(() => InterfaceProperty.ReadValue(reader));
                break;

            case "ObjectProperty":
                property.values = new Array(elementCount).fill(0).map(() => ObjectProperty.ReadValue(reader));
                break;

            case "SoftObjectProperty":
                property.values = new Array(elementCount).fill(0).map(() => SoftObjectProperty.ReadValue(reader));
                break;

            case "StructProperty":

                // we already read elementCount. so - 4.
                //TODO: check?
                let binarySizeToCheck = tag.binarySize - 4;

                // saveVersion 53 is late 1.1
                if (reader.context.saveVersion.object < SaveCustomVersion.SerializeDataPackageVersionAndCustomVersions) {
                    const innerTag = FPropertyTag.read(reader);
                    property.structTag = innerTag;
                    property.propertyTagType.children[0] = innerTag.propertyTagType;
                    binarySizeToCheck = property.structTag!.binarySize;
                }

                property.values = new Array(elementCount).fill(0).map(() => StructProperty.ParseValue(reader, tag.propertyTagType.children[0].children[0], binarySizeToCheck));
                break;

            default:
                throw new UnimplementedError(`Unknown array property subtype ${JSON.stringify(property.propertyTagType.children[0].name)} for ${property.propertyTagType.name}. Not implemented.`);

        }
    }

    export function Serialize(writer: ContextWriter, property: ArrayProperty): void {

        writer.writeInt32(property.values.length);

        switch (property.propertyTagType.children[0].name) {
            case "FloatProperty":
                property.values.forEach(value => FloatProperty.SerializeValue(writer, value));
                break;

            case "BoolProperty":
                property.values.forEach(value => BoolProperty.SerializeValue(writer, value));
                break;

            case "IntProperty":
                property.values.forEach(value => IntProperty.SerializeValue(writer, value));
                break;

            case "Int64Property":
                property.values.forEach(value => Int64Property.SerializeValue(writer, value));
                break;

            case "DoubleProperty":
                property.values.forEach(value => DoubleProperty.SerializeValue(writer, value));
                break;

            case "ByteProperty":
                property.values.forEach(value => ByteProperty.SerializeValue(writer, value));
                break;

            case "StrProperty":
                property.values.forEach(value => StrProperty.SerializeValue(writer, value));
                break;

            case "EnumProperty":
                property.values.forEach(value => EnumProperty.SerializeValue(writer, value));
                break;

            case "TextProperty":
                property.values.forEach(value => TextProperty.SerializeValue(writer, value));
                break;

            case "InterfaceProperty":
                property.values.forEach(value => InterfaceProperty.SerializeValue(writer, value));
                break;

            case "ObjectProperty":
                property.values.forEach(value => ObjectProperty.SerializeValue(writer, value));
                break;

            case "SoftObjectProperty":
                property.values.forEach(value => SoftObjectProperty.SerializeValue(writer, value));
                break;

            case "StructProperty":

                // saveVersion 53 is late 1.1
                if (writer.context.saveVersion.object < SaveCustomVersion.SerializeDataPackageVersionAndCustomVersions) {
                    FPropertyTag.write(writer, property.structTag!);
                }

                property.values.forEach(value => StructProperty.SerializeValue(writer, property.propertyTagType.children[0].children[0].name, value));

                //writer.writeBinarySizeFromPosition(lenIndicator, before);
                // TODO: write binary value ?

                break;

            default:
                throw new UnimplementedError(`Unknown array property to serialize. ${(property as any).type ?? ''}, ${(property as any).subtype ?? ''}`);
        }
    }
}
