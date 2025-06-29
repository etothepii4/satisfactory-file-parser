import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { Uint32Property } from '../Uint32Property';

export const isUint32SetProperty = (property: any): property is Uint32SetProperty => !Array.isArray(property) && property.type === 'Uint32SetProperty';

export type Uint32SetProperty = AbstractBaseProperty & {
    type: 'Uint32SetProperty';
    subtype: string;
    values: number[];
};

export namespace Uint32SetProperty {

    export const Parse = (reader: ContextReader, elementCount: number, subtype: string, ueType: string, index: number = 0): Uint32SetProperty => {
        const values = new Array(elementCount).fill(0).map(() => Uint32Property.ReadValue(reader));

        return {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'Uint32SetProperty',
            subtype,
            values
        } satisfies Uint32SetProperty;
    }

    export const Serialize = (writer: ContextWriter, property: Uint32SetProperty): void => {
        property.values.forEach(value => Uint32Property.SerializeValue(writer, value));
    }
}
