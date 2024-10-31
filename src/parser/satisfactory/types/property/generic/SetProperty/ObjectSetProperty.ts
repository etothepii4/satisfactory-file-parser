import { BinaryReadable } from '../../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../../byte/byte-writer.class';
import { ObjectReference } from '../../../structs/ObjectReference';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { ObjectProperty } from '../ObjectProperty';

export const isObjectSetProperty = (property: any): property is ObjectSetProperty => !Array.isArray(property) && property.type === 'ObjectSetProperty';

export type ObjectSetProperty = AbstractBaseProperty & {
    type: 'ObjectSetProperty';
    subtype: string;
    values: ObjectReference[];
};

export namespace ObjectSetProperty {

    export const Parse = (reader: BinaryReadable, elementCount: number, subtype: string, ueType: string, index: number = 0): ObjectSetProperty => {
        const values = new Array(elementCount).fill(0).map(() => ObjectProperty.ReadValue(reader));
        return {
            type: 'ObjectSetProperty',
            index,
            ueType,
            subtype,
            values,
            guidInfo: undefined,
            name: ''
        } satisfies ObjectSetProperty;
    }

    export const Serialize = (writer: ByteWriter, property: ObjectSetProperty): void => {
        property.values.forEach(value => ObjectProperty.SerializeValue(writer, value));
    }
}
