import { BinaryReadable } from '../../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../../byte/byte-writer.class';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { StrProperty } from '../StrProperty';

export const isStrSetProperty = (property: any): property is StrSetProperty => !Array.isArray(property) && property.type === 'StrSetProperty';

export type StrSetProperty = AbstractBaseProperty & {
    type: 'StrSetProperty';
    subtype: string;
    values: string[];
};

export namespace StrSetProperty {

    export const Parse = (reader: BinaryReadable, elementCount: number, subtype: string, ueType: string, index: number = 0): StrSetProperty => {
        const values = new Array(elementCount).fill(0).map(() => StrProperty.ReadValue(reader));

        return {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'StrSetProperty',
            subtype,
            values
        } satisfies StrSetProperty;
    }

    export const Serialize = (writer: ByteWriter, property: StrSetProperty): void => {
        property.values.forEach(value => StrProperty.SerializeValue(writer, value));
    }
}
