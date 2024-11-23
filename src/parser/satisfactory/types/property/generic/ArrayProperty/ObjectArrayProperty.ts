import { BinaryReadable } from '../../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../../byte/byte-writer.class';
import { ObjectReference } from '../../../structs/ObjectReference';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { ObjectProperty } from '../ObjectProperty';

export const isObjectArrayProperty = (property: any): property is ObjectArrayProperty => !Array.isArray(property) && property.type === 'ObjectArrayProperty';

export type ObjectArrayProperty = AbstractBaseProperty & {
    type: 'ObjectArrayProperty';
    subtype: string;
    values: ObjectReference[];
};

export namespace ObjectArrayProperty {

    export const Parse = (reader: BinaryReadable, elementCount: number, subtype: string, ueType: string, index: number = 0): ObjectArrayProperty => {
        const values = new Array(elementCount).fill(0).map(() => ObjectProperty.ReadValue(reader));

        return {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'ObjectArrayProperty',
            subtype,
            values
        } satisfies ObjectArrayProperty;
    }

    export const Serialize = (writer: ByteWriter, property: ObjectArrayProperty): void => {
        property.values.forEach(value => ObjectProperty.SerializeValue(writer, value));
    }
}
