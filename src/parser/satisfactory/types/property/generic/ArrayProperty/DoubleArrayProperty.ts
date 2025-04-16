import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { DoubleProperty } from '../DoubleProperty';

export const isDoubleArrayProperty = (property: any): property is DoubleArrayProperty => !Array.isArray(property) && property.type === 'DoubleArrayProperty';

export type DoubleArrayProperty = AbstractBaseProperty & {
    type: 'DoubleArrayProperty';
    subtype: string;
    values: number[];
};

export namespace DoubleArrayProperty {

    export const Parse = (reader: ContextReader, elementCount: number, subtype: string, ueType: string, index: number = 0): DoubleArrayProperty => {
        const values = new Array(elementCount).fill(0).map(() => DoubleProperty.ReadValue(reader));

        return {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'DoubleArrayProperty',
            subtype,
            values
        } satisfies DoubleArrayProperty;
    }

    export const Serialize = (writer: ContextWriter, property: DoubleArrayProperty): void => {
        property.values.forEach(value => DoubleProperty.SerializeValue(writer, value));
    }
}
