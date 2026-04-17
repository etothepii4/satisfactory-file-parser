import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isNameProperty = (property: any): property is NameProperty => !Array.isArray(property) && property.propertyTagType.name === 'NameProperty';

export type NameProperty = AbstractBaseProperty & {
    type: 'NameProperty';
    propertyTagType: { name: 'NameProperty', children: FPropertyTagNode[] };
    value: string;
};

export namespace NameProperty {

    export function Parse(reader: ContextReader, currentProperty: NameProperty): void {
        currentProperty.value = ReadValue(reader);
    }

    export function ReadValue(reader: ContextReader): string {
        return reader.readString();
    }

    export function Serialize(writer: ContextWriter, property: NameProperty): void {
        SerializeValue(writer, property.value);
    }

    export function SerializeValue(writer: ContextWriter, value: string): void {
        writer.writeString(value);
    }
}
