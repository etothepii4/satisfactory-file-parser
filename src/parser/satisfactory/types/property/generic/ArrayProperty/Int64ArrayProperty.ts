import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { Int64Property } from '../Int64Property';

export const isInt64ArrayProperty = (property: any): property is Int64ArrayProperty => !Array.isArray(property) && property.type === 'Int64ArrayProperty';

export type Int64ArrayProperty = AbstractBaseProperty & {
    type: 'Int64ArrayProperty';
    subtype: string;
    values: string[];
};

export namespace Int64ArrayProperty {

    export const Parse = (reader: ContextReader, elementCount: number, subtype: string, ueType: string, index: number = 0): Int64ArrayProperty => {
        const values = new Array(elementCount).fill(0).map(() => Int64Property.ReadValue(reader));

        return {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'Int64ArrayProperty',
            subtype,
            values
        } satisfies Int64ArrayProperty;
    }

    export const Serialize = (writer: ContextWriter, property: Int64ArrayProperty): void => {
        property.values.forEach(value => Int64Property.SerializeValue(writer, value));
    }
}
