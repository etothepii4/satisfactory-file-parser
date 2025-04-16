import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { ByteProperty } from '../ByteProperty';

export const isByteArrayProperty = (property: any): property is ByteArrayProperty => !Array.isArray(property) && property.type === 'ByteArrayProperty';

export type ByteArrayProperty = AbstractBaseProperty & {
    type: 'ByteArrayProperty';
    subtype: string;
    values: number[];
};

export namespace ByteArrayProperty {

    export const Parse = (reader: ContextReader, elementCount: number, subtype: string, ueType: string, index: number = 0): ByteArrayProperty => {
        const values = new Array(elementCount).fill(0).map(() => ByteProperty.ReadValue(reader));

        return {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'ByteArrayProperty',
            subtype,
            values
        } satisfies ByteArrayProperty;
    }

    export const Serialize = (writer: ContextWriter, property: ByteArrayProperty): void => {
        property.values.forEach(value => ByteProperty.SerializeValue(writer, value));
    }
}
