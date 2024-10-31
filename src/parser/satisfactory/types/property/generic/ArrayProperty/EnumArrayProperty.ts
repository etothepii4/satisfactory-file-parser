import { BinaryReadable } from '../../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../../byte/byte-writer.class';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { EnumProperty } from '../EnumProperty';

export const isEnumArrayProperty = (property: any): property is EnumArrayProperty => !Array.isArray(property) && property.type === 'EnumArrayProperty';

export type EnumArrayProperty = AbstractBaseProperty & {
    type: 'EnumArrayProperty';
    subtype: string;
    values: string[];
};

export namespace EnumArrayProperty {

    export const Parse = (reader: BinaryReadable, elementCount: number, subtype: string, ueType: string, index: number = 0): EnumArrayProperty => {
        const values = new Array(elementCount).fill(0).map(() => EnumProperty.ReadValue(reader));
        return {
            type: 'EnumArrayProperty',
            index,
            ueType,
            subtype,
            values,
            guidInfo: undefined,
            name: ''
        } satisfies EnumArrayProperty;
    }

    export const Serialize = (writer: ByteWriter, property: EnumArrayProperty): void => {
        property.values.forEach(value => EnumProperty.SerializeValue(writer, value));
    }
}
