import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isStrProperty = (property: any): property is StrProperty => property !== null && !Array.isArray(property) && property.propertyTagType?.name === 'StrProperty';

export type StrProperty = AbstractBaseProperty & {
    type: 'StrProperty';
    propertyTagType: { name: 'StrProperty', children: FPropertyTagNode[] };
    value: string;
};

export namespace StrProperty {

    export function Parse(reader: ContextReader, currentProperty: StrProperty): void {
        currentProperty.value = ReadValue(reader);
    }

    export function ReadValue(reader: ContextReader): string {
        return reader.readString();
    }

    export function Serialize(writer: ContextWriter, property: StrProperty): void {
        SerializeValue(writer, property.value);
    }

    export function SerializeValue(writer: ContextWriter, value: string): void {
        writer.writeString(value);
    }
}
