import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { UnimplementedError } from '../../../../../error/parser.error';
import { GUID } from '../../../structs/binary/GUID';
import { vec3 } from '../../../structs/vec3';
import { AbstractBaseProperty } from '../AbstractBaseProperty';

export const isStructSetProperty = (property: any): property is StructSetProperty => !Array.isArray(property) && property.type === 'StructSetProperty';

export type StructSetProperty = AbstractBaseProperty & {
    type: 'StructSetProperty';
    subtype: string;
    values: any[];
};

export namespace StructSetProperty {

    export const Parse = (reader: ContextReader, elementCount: number, subtype: string, ueType: string, index: number = 0, propertyName: string): StructSetProperty => {

        let values: unknown[];
        if (propertyName === 'mRemovalLocations') {
            values = new Array(elementCount).fill(0).map(() => vec3.ParseF(reader));
        } else if (propertyName === 'mDestroyedPickups' || propertyName === 'mLootedDropPods') {
            values = new Array(elementCount).fill(0).map(() => GUID.read(reader));
        } else {
            throw new UnimplementedError(`Not Implemented SetProperty of StructProperty for property type ${propertyName}.`);
        }

        return {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'StructSetProperty',
            subtype,
            values
        } satisfies StructSetProperty;
    }

    export const Serialize = (writer: ContextWriter, property: StructSetProperty): void => {

        if (property.name === 'mRemovalLocations') {
            property.values.forEach(v => vec3.SerializeF(writer, v));
        } else if (property.name === 'mDestroyedPickups' || property.name === 'mLootedDropPods') {
            property.values.forEach(v => GUID.write(writer, v));
        } else {
            throw new Error(`Not Implemented serializing SetProperty of StructProperty for property ${property.name}.`);
        }
    }
}
