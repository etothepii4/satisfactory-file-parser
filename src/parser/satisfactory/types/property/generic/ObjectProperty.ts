import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { ObjectReference } from '../../structs/ObjectReference';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isObjectProperty = (property: any): property is ObjectProperty => property !== null && !Array.isArray(property) && property.propertyTagType?.name === 'ObjectProperty';

export type ObjectProperty = AbstractBaseProperty & {
    type: 'ObjectProperty';
    propertyTagType: { name: 'ObjectProperty', children: FPropertyTagNode[] };
    value: ObjectReference;
};

export namespace ObjectProperty {

    export function Parse(reader: ContextReader, property: ObjectProperty): void {
        property.value = ReadValue(reader);
    }

    export function ReadValue(reader: ContextReader): ObjectReference {
        return ObjectReference.read(reader);
    }

    export function Serialize(writer: ContextWriter, property: ObjectProperty): void {
        SerializeValue(writer, property.value);
    }

    export function SerializeValue(writer: ContextWriter, value: ObjectReference): void {
        ObjectReference.write(writer, value);
    }
}
