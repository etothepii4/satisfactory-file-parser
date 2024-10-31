import { BinaryReadable } from '../../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../../byte/byte-writer.class';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { StrProperty } from '../StrProperty';

export const isStrArrayProperty = (property: any): property is StrArrayProperty => !Array.isArray(property) && property.type === 'StrArrayProperty';

export type StrArrayProperty = AbstractBaseProperty & {
    type: 'StrArrayProperty';
    subtype: string;
    values: string[];
};

export namespace StrArrayProperty {

    export const Parse = (reader: BinaryReadable, elementCount: number, subtype: string, ueType: string, index: number = 0): StrArrayProperty => {
        const values = new Array(elementCount).fill(0).map(() => StrProperty.ReadValue(reader));
        return {
            type: 'StrArrayProperty',
            index,
            ueType,
            subtype,
            values,
            guidInfo: undefined,
            name: ''
        } satisfies StrArrayProperty;
    }

    export const Serialize = (writer: ByteWriter, property: StrArrayProperty): void => {
        property.values.forEach(value => StrProperty.SerializeValue(writer, value));
    }
}
