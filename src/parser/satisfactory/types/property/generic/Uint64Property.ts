import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isUInt64Property = (property: any): property is Uint64Property => property !== null && !Array.isArray(property) && property.propertyTagType?.name === 'UInt64Property';

export type Uint64Property = AbstractBaseProperty & {
    type: 'Uint64Property';
    propertyTagType: { name: 'Uint64Property', children: FPropertyTagNode[] };
    value: string;
};

export namespace Uint64Property {

    export function Parse(reader: ContextReader, property: Uint64Property): void {
        property.value = Uint64Property.ReadValue(reader);
    }

    export function ReadValue(reader: ContextReader): string {
        return reader.readUint64().toString();
    }

    export function Serialize(writer: ContextWriter, property: Uint64Property): void {
        Uint64Property.SerializeValue(writer, property.value);
    }

    export function SerializeValue(writer: ContextWriter, value: string): void {
        writer.writeUint64(BigInt(value));
    }
}
