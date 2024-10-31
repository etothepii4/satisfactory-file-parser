import { BinaryReadable } from '../../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../../byte/byte-writer.class';
import { SoftObjectReference } from '../../../structs/SoftObjectReference';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { SoftObjectProperty } from '../SoftObjectProperty';

export const isSoftObjectArrayProperty = (property: any): property is SoftObjectArrayProperty => !Array.isArray(property) && property.type === 'SoftObjectArrayProperty';

export type SoftObjectArrayProperty = AbstractBaseProperty & {
    type: 'SoftObjectArrayProperty';
    subtype: string;
    values: SoftObjectReference[];
};

export namespace SoftObjectArrayProperty {

    export const Parse = (reader: BinaryReadable, elementCount: number, subtype: string, ueType: string, index: number = 0): SoftObjectArrayProperty => {
        const values = new Array(elementCount).fill(0).map(() => SoftObjectProperty.ReadValue(reader));
        return {
            type: 'SoftObjectArrayProperty',
            index,
            ueType,
            subtype,
            values,
            guidInfo: undefined,
            name: ''
        } satisfies SoftObjectArrayProperty;
    }

    export const Serialize = (writer: ByteWriter, property: SoftObjectArrayProperty): void => {
        property.values.forEach(value => SoftObjectProperty.SerializeValue(writer, value));
    }
}
