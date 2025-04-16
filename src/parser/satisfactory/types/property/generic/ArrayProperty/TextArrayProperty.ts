import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { TextProperty, TextPropertyValue } from '../TextProperty';

export const isTextArrayProperty = (property: any): property is TextArrayProperty => !Array.isArray(property) && property.type === 'TextArrayProperty';

export type TextArrayProperty = AbstractBaseProperty & {
    type: 'TextArrayProperty';
    subtype: string;
    values: TextPropertyValue[];
};

export namespace TextArrayProperty {

    export const Parse = (reader: ContextReader, elementCount: number, subtype: string, ueType: string, index: number = 0): TextArrayProperty => {
        const values = new Array(elementCount).fill(0).map(() => TextProperty.ReadValue(reader));

        return {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'TextArrayProperty',
            subtype,
            values
        } satisfies TextArrayProperty;
    }

    export const Serialize = (writer: ContextWriter, property: TextArrayProperty): void => {
        property.values.forEach(value => TextProperty.SerializeValue(writer, value));
    }
}
