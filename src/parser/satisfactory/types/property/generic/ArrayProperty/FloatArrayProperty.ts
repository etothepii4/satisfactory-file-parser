import { BinaryReadable } from '../../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../../byte/byte-writer.class';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { FloatProperty } from '../FloatProperty';

export const isFloatArrayProperty = (property: any): property is FloatArrayProperty => !Array.isArray(property) && property.type === 'FloatArrayProperty';

export type FloatArrayProperty = AbstractBaseProperty & {
    type: 'FloatArrayProperty';
    subtype: string;
    values: number[];
};

export namespace FloatArrayProperty {

    export const Parse = (reader: BinaryReadable, elementCount: number, subtype: string, ueType: string, index: number = 0): FloatArrayProperty => {
        const values = new Array(elementCount).fill(0).map(() => FloatProperty.ReadValue(reader));

        return {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'FloatArrayProperty',
            subtype,
            values
        } satisfies FloatArrayProperty;
    }

    export const Serialize = (writer: ByteWriter, property: FloatArrayProperty): void => {
        property.values.forEach(value => FloatProperty.SerializeValue(writer, value));
    }
}
