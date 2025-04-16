import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { ObjectReference } from '../../../structs/ObjectReference';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { ObjectProperty } from '../ObjectProperty';

export const isObjectSetProperty = (property: any): property is ObjectSetProperty => !Array.isArray(property) && property.type === 'ObjectSetProperty';

export type ObjectSetProperty = AbstractBaseProperty & {
    type: 'ObjectSetProperty';
    subtype: string;
    values: ObjectReference[];
};

export namespace ObjectSetProperty {

    export const Parse = (reader: ContextReader, elementCount: number, subtype: string, ueType: string, index: number = 0): ObjectSetProperty => {
        const values = new Array(elementCount).fill(0).map(() => ObjectProperty.ReadValue(reader));

        return {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'ObjectSetProperty',
            subtype,
            values
        } satisfies ObjectSetProperty;
    }

    export const Serialize = (writer: ContextWriter, property: ObjectSetProperty): void => {
        property.values.forEach(value => ObjectProperty.SerializeValue(writer, value));
    }
}
