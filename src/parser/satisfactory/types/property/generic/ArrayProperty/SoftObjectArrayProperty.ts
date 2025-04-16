import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { SoftObjectReference } from '../../../structs/SoftObjectReference';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { SoftObjectProperty } from '../SoftObjectProperty';

export const isSoftObjectArrayProperty = (property: any): property is SoftObjectArrayProperty => !Array.isArray(property) && property.type === 'SoftObjectArrayProperty';

export type SoftObjectArrayProperty = AbstractBaseProperty & {
    type: 'SoftObjectArrayProperty';
    subtype: string;
    values: SoftObjectReference[];
};

export namespace SoftObjectArrayProperty {

    export const Parse = (reader: ContextReader, elementCount: number, subtype: string, ueType: string, index: number = 0): SoftObjectArrayProperty => {
        const values = new Array(elementCount).fill(0).map(() => SoftObjectProperty.ReadValue(reader));

        return {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'SoftObjectArrayProperty',
            subtype,
            values
        } satisfies SoftObjectArrayProperty;
    }

    export const Serialize = (writer: ContextWriter, property: SoftObjectArrayProperty): void => {
        property.values.forEach(value => SoftObjectProperty.SerializeValue(writer, value));
    }
}
