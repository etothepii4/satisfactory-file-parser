import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { EnumProperty } from '../EnumProperty';

export const isEnumArrayProperty = (property: any): property is EnumArrayProperty => !Array.isArray(property) && property.type === 'EnumArrayProperty';

export type EnumArrayProperty = AbstractBaseProperty & {
    type: 'EnumArrayProperty';
    subtype: string;
    values: string[];
};

export namespace EnumArrayProperty {

    export const Parse = (reader: ContextReader, elementCount: number, subtype: string, ueType: string, index: number = 0): EnumArrayProperty => {
        const values = new Array(elementCount).fill(0).map(() => EnumProperty.ReadValue(reader));

        return {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'EnumArrayProperty',
            subtype,
            values
        } satisfies EnumArrayProperty;
    }

    export const Serialize = (writer: ContextWriter, property: EnumArrayProperty): void => {
        property.values.forEach(value => EnumProperty.SerializeValue(writer, value));
    }
}
