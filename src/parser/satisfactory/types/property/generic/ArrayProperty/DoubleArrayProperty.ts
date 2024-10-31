import { BinaryReadable } from '../../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../../byte/byte-writer.class';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { DoubleProperty } from '../DoubleProperty';

export const isDoubleArrayProperty = (property: any): property is DoubleArrayProperty => !Array.isArray(property) && property.type === 'DoubleArrayProperty';

export type DoubleArrayProperty = AbstractBaseProperty & {
    type: 'DoubleArrayProperty';
    subtype: string;
    values: number[];
};

export namespace DoubleArrayProperty {

    export const Parse = (reader: BinaryReadable, elementCount: number, subtype: string, ueType: string, index: number = 0): DoubleArrayProperty => {
        const values = new Array(elementCount).fill(0).map(() => DoubleProperty.ReadValue(reader));
        return {
            type: 'DoubleArrayProperty',
            index,
            ueType,
            subtype,
            values,
            guidInfo: undefined,
            name: ''
        } satisfies DoubleArrayProperty;
    }

    export const Serialize = (writer: ByteWriter, property: DoubleArrayProperty): void => {
        property.values.forEach(value => DoubleProperty.SerializeValue(writer, value));
    }
}
