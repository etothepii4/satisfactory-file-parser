import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { ObjectReference } from '../../structs/ObjectReference';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isInterfaceProperty = (property: any): property is InterfaceProperty => !Array.isArray(property) && property.propertyTagType.name === 'InterfaceProperty';

export type InterfaceProperty = AbstractBaseProperty & {
    type: 'InterfaceProperty';
    propertyTagType: { name: 'InterfaceProperty', children: FPropertyTagNode[] };
    value: ObjectReference;
};

export namespace InterfaceProperty {

    export function Parse(reader: ContextReader, property: InterfaceProperty): void {
        property.value = ReadValue(reader);
    }

    export function ReadValue(reader: ContextReader): ObjectReference {
        return ObjectReference.read(reader);
    }

    export function Serialize(writer: ContextWriter, property: InterfaceProperty): void {
        SerializeValue(writer, property.value);
    }

    export function SerializeValue(writer: ContextWriter, value: ObjectReference): void {
        ObjectReference.write(writer, value);
    }
}
