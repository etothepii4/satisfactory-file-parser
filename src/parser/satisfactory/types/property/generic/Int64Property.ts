import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isInt64Property = (property: any): property is Int64Property => !Array.isArray(property) && property.propertyTagType.name === 'Int64Property';

export type Int64Property = AbstractBaseProperty & {
    type: 'Int64Property';
    propertyTagType: { name: 'Int64Property', children: FPropertyTagNode[] };
    value: string;
};

export namespace Int64Property {

    export function Parse(reader: ContextReader, property: Int64Property): void {
        property.value = ReadValue(reader);
    }

    export function ReadValue(reader: ContextReader): string {
        return reader.readInt64().toString();
    }

    export function Serialize(writer: ContextWriter, property: Int64Property): void {
        SerializeValue(writer, property.value);
    }

    export function SerializeValue(writer: ContextWriter, value: string): void {
        writer.writeInt64(BigInt(value));
    }
}
