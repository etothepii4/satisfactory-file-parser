import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { BoolProperty } from '../BoolProperty';

export const isBoolArrayProperty = (property: any): property is BoolArrayProperty => !Array.isArray(property) && property.type === 'BoolArrayProperty';

export type BoolArrayProperty = AbstractBaseProperty & {
    type: 'BoolArrayProperty';
    subtype: string;
    values: boolean[];
};

export namespace BoolArrayProperty {

    export const Parse = (reader: ContextReader, elementCount: number, subtype: string, ueType: string, index: number = 0): BoolArrayProperty => {
        const values = new Array(elementCount).fill(0).map(() => BoolProperty.ReadValue(reader));

        return {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'BoolArrayProperty',
            subtype,
            values
        } satisfies BoolArrayProperty;
    }

    export const Serialize = (writer: ContextWriter, property: BoolArrayProperty): void => {
        property.values.forEach(value => BoolProperty.SerializeValue(writer, value));
    }
}