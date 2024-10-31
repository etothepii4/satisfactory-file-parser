import { BinaryReadable } from '../../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../../byte/byte-writer.class';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { ByteProperty } from '../ByteProperty';

export const isByteArrayProperty = (property: any): property is ByteArrayProperty => !Array.isArray(property) && property.type === 'ByteArrayProperty';

export type ByteArrayProperty = AbstractBaseProperty & {
    type: 'ByteArrayProperty';
    subtype: string;
    values: number[];
};

export namespace ByteArrayProperty {

    export const Parse = (reader: BinaryReadable, elementCount: number, subtype: string, ueType: string, index: number = 0): ByteArrayProperty => {
        const values = new Array(elementCount).fill(0).map(() => ByteProperty.ReadValue(reader));

        return {
            type: 'ByteArrayProperty',
            index,
            ueType,
            subtype,
            values,
            guidInfo: undefined,
            name: ''
        } satisfies ByteArrayProperty;
    }

    export const Serialize = (writer: ByteWriter, property: ByteArrayProperty): void => {
        property.values.forEach(value => ByteProperty.SerializeValue(writer, value));
    }
}
