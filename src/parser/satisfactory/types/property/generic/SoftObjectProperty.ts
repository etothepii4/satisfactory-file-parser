import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { SoftObjectReference } from '../../structs/SoftObjectReference';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isSoftObjectProperty = (property: any): property is SoftObjectProperty => property !== null && !Array.isArray(property) && property.propertyTagType?.name === 'SoftObjectProperty';

export type SoftObjectProperty = AbstractBaseProperty & {
    type: 'SoftObjectProperty';
    propertyTagType: { name: 'SoftObjectProperty', children: FPropertyTagNode[] };
    value: SoftObjectReference;
};

export namespace SoftObjectProperty {


    export function Parse(reader: ContextReader, property: SoftObjectProperty): void {
        property.value = ReadValue(reader);
    }

    export function ReadValue(reader: ContextReader): SoftObjectReference {
        return SoftObjectReference.read(reader);
    }

    export function Serialize(writer: ContextWriter, property: SoftObjectProperty): void {
        SerializeValue(writer, property.value);
    }

    export function SerializeValue(writer: ContextWriter, value: SoftObjectReference): void {
        SoftObjectReference.write(writer, value);
    }
}
