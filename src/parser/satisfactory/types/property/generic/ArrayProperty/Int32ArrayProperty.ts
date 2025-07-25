import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { Int32Property } from '../Int32Property';

export const isInt32ArrayProperty = (property: any): property is Int32ArrayProperty => !Array.isArray(property) && property.type === 'Int32ArrayProperty';

export type Int32ArrayProperty = AbstractBaseProperty & {
    type: 'Int32ArrayProperty';
    subtype: string;
    values: number[];
};

export namespace Int32ArrayProperty {

    export const Parse = (reader: ContextReader, elementCount: number, subtype: string, ueType: string, index: number = 0): Int32ArrayProperty => {
        const values = new Array(elementCount).fill(0).map(() => Int32Property.ReadValue(reader));

        return {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'Int32ArrayProperty',
            subtype,
            values
        } satisfies Int32ArrayProperty;
    }

    export const Serialize = (writer: ContextWriter, property: Int32ArrayProperty): void => {
        property.values.forEach(value => Int32Property.SerializeValue(writer, value));
    }
}
