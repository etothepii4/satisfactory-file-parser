import { BinaryReadable } from '../../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../../byte/byte-writer.class';
import { UnimplementedError } from '../../../../../error/parser.error';
import { GUID } from '../../../structs/GUID';
import { vec3 } from '../../../structs/vec3';
import { AbstractBaseProperty } from '../AbstractBaseProperty';

export const isStructSetProperty = (property: any): property is StructSetProperty => !Array.isArray(property) && property.type === 'StructSetProperty';

export type StructSetProperty = AbstractBaseProperty & {
    type: 'StructSetProperty';
    subtype: string;
    values: any[];
};

export namespace StructSetProperty {

    export const Parse = (reader: BinaryReadable, elementCount: number, subtype: string, ueType: string, index: number = 0, propertyName: string): StructSetProperty => {

        let values: unknown[];
        if (propertyName === 'mRemovalLocations') {
            values = new Array(elementCount).fill(0).map(() => vec3.ParseF(reader));
        }

        if (propertyName === 'mDestroyedPickups' || propertyName === 'mLootedDropPods') {
            values = new Array(elementCount).fill(0).map(() => GUID.read(reader));
        } else {
            throw new UnimplementedError(`Not Implemented SetProperty of StructProperty for property type ${propertyName}.`);
        }

        return {
            type: 'StructSetProperty',
            index,
            ueType,
            subtype,
            values,
            guidInfo: undefined,
            name: ''
        } satisfies StructSetProperty;
    }

    export const Serialize = (writer: ByteWriter, property: StructSetProperty): void => {

        // mRemovalLocations is outdated i guess
        if (property.name === 'mRemovalLocations') {
            console.warn('serializing mRemovalLocations, this is still under investigation.');
            property.values.forEach(v => vec3.SerializeF(writer, v));
        } else if (property.name === 'mDestroyedPickups' || property.name === 'mLootedDropPods') {
            property.values.forEach(v => GUID.write(writer, v));
        } else {
            throw new Error(`Not Implemented serializing SetProperty of StructProperty for property ${property.name}.`);
        }
    }
}
