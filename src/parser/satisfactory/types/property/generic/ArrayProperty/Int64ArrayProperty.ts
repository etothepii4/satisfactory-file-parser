import { BinaryReadable } from '../../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../../byte/byte-writer.class';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { Int64Property } from '../Int64Property';

export const isInt64ArrayProperty = (property: any): property is Int64ArrayProperty => !Array.isArray(property) && property.type === 'Int64ArrayProperty';

export type Int64ArrayProperty = AbstractBaseProperty & {
    type: 'Int64ArrayProperty';
    subtype: string;
    values: string[];
};

export namespace Int64ArrayProperty {

    export const Parse = (reader: BinaryReadable, elementCount: number, subtype: string, ueType: string, index: number = 0): Int64ArrayProperty => {
        const values = new Array(elementCount).fill(0).map(() => Int64Property.ReadValue(reader));
        return {
            type: 'Int64ArrayProperty',
            index,
            ueType,
            subtype,
            values,
            guidInfo: undefined,
            name: ''
        } satisfies Int64ArrayProperty;
    }

    export const Serialize = (writer: ByteWriter, property: Int64ArrayProperty): void => {
        property.values.forEach(value => Int64Property.SerializeValue(writer, value));
    }
}
