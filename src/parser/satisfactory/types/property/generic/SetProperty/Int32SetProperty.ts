import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { Int32Property } from '../Int32Property';

export const isInt32SetProperty = (property: any): property is Int32SetProperty => !Array.isArray(property) && property.type === 'Int32SetProperty';

export type Int32SetProperty = AbstractBaseProperty & {
    type: 'Int32SetProperty';
    subtype: string;
    values: number[];
};

export namespace Int32SetProperty {

    export const Parse = (reader: ContextReader, elementCount: number, subtype: string, ueType: string, index: number = 0): Int32SetProperty => {
        const values = new Array(elementCount).fill(0).map(() => Int32Property.ReadValue(reader));

        return {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'Int32SetProperty',
            subtype,
            values
        } satisfies Int32SetProperty;
    }

    export const Serialize = (writer: ContextWriter, property: Int32SetProperty): void => {
        property.values.forEach(value => Int32Property.SerializeValue(writer, value));
    }
}
