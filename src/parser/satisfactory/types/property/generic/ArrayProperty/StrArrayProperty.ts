import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { StrProperty } from '../StrProperty';

export const isStrArrayProperty = (property: any): property is StrArrayProperty => !Array.isArray(property) && property.type === 'StrArrayProperty';

export type StrArrayProperty = AbstractBaseProperty & {
    type: 'StrArrayProperty';
    subtype: string;
    values: string[];
};

export namespace StrArrayProperty {

    export const Parse = (reader: ContextReader, elementCount: number, subtype: string, ueType: string, index: number = 0): StrArrayProperty => {
        const values = new Array(elementCount).fill(0).map(() => StrProperty.ReadValue(reader));

        return {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'StrArrayProperty',
            subtype,
            values
        } satisfies StrArrayProperty;
    }

    export const Serialize = (writer: ContextWriter, property: StrArrayProperty): void => {
        property.values.forEach(value => StrProperty.SerializeValue(writer, value));
    }
}
