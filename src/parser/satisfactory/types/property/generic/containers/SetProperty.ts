import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { UnimplementedError } from '../../../../../error/parser.error';
import { GUID } from '../../../structs/binary/GUID';
import { vec3 } from '../../../structs/vec3';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { IntProperty } from '../IntProperty';
import { NameProperty } from '../NameProperty';
import { ObjectProperty } from '../ObjectProperty';
import { StrProperty } from '../StrProperty';
import { Uint32Property } from '../Uint32Property';

export const isSetProperty = (property: any): property is SetProperty => !Array.isArray(property) && property.propertyTagType.name === 'SetProperty';

export type SetProperty = AbstractBaseProperty & {
    type: 'SetProperty';
    numElementsToRemove?: number;
    values: any[];
}

export namespace SetProperty {

    export function Parse(reader: ContextReader, property: SetProperty): void {

        property.numElementsToRemove = reader.readInt32();
        if (property.numElementsToRemove > 0) {
            // not observed so far.
            throw new UnimplementedError('SetProperty does not yet support Number of Elements to be removed. Feel free to raise an issue.');
        }
        const elementCount = reader.readInt32();

        switch (property.propertyTagType.children[0].name) {

            case "UInt32Property":
                property.values = new Array(elementCount).fill(0).map(() => Uint32Property.ReadValue(reader));
                break;

            case "IntProperty":
                property.values = new Array(elementCount).fill(0).map(() => IntProperty.ReadValue(reader));
                break;

            case "ObjectProperty":
                property.values = new Array(elementCount).fill(0).map(() => ObjectProperty.ReadValue(reader));
                break;

            case "NameProperty":
                property.values = new Array(elementCount).fill(0).map(() => NameProperty.ReadValue(reader));
                break;

            case "StrProperty":
                property.values = new Array(elementCount).fill(0).map(() => StrProperty.ReadValue(reader));
                break;

            case "StructProperty":
                if (property.name === 'mRemovalLocations') {
                    property.values = new Array(elementCount).fill(0).map(() => vec3.ParseF(reader));
                } else if (property.name === 'mDestroyedPickups' || property.name === 'mLootedDropPods') {
                    property.values = new Array(elementCount).fill(0).map(() => GUID.read(reader));
                } else {
                    throw new UnimplementedError(`Not Implemented SetProperty of StructProperty for property type ${property.name}.`);
                }
                break;

            default:
                throw new Error(`Not Implemented SetProperty of ${property.propertyTagType.children[0].name}.`);
        }
    }

    export function Serialize(writer: ContextWriter, property: SetProperty): void {

        writer.writeInt32(property.numElementsToRemove ?? 0);
        writer.writeInt32(property.values.length);

        switch (property.propertyTagType.children[0].name) {

            case "UInt32Property":
                property.values.forEach(value => Uint32Property.SerializeValue(writer, value));
                break;

            case "IntProperty":
                property.values.forEach(value => IntProperty.SerializeValue(writer, value));
                break;

            case "ObjectProperty":
                property.values.forEach(value => ObjectProperty.SerializeValue(writer, value));
                break;

            case "NameProperty":
                property.values.forEach(value => NameProperty.SerializeValue(writer, value));
                break;

            case "StrProperty":
                property.values.forEach(value => StrProperty.SerializeValue(writer, value));
                break;

            case "StructProperty":
                if (property.name === 'mRemovalLocations') {
                    property.values.forEach(v => vec3.SerializeF(writer, v));
                } else if (property.name === 'mDestroyedPickups' || property.name === 'mLootedDropPods') {
                    property.values.forEach(v => GUID.write(writer, v));
                } else {
                    throw new Error(`Not Implemented serializing SetProperty of StructProperty for property ${property.name}.`);
                }
                break;

            default:
                throw new Error(`Not Implemented SetProperty of ${property.propertyTagType.children[0].name}.`);
        }
    }
}
