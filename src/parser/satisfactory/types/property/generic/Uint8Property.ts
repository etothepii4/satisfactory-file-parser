import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isUint8Property = (property: any): property is Uint8Property => property !== null && !Array.isArray(property) && property.propertyTagType?.name === 'UInt8Property';

export type Uint8Property = AbstractBaseProperty & {
    type: 'Uint8Property';
    propertyTagType: { name: 'Uint8Property', children: FPropertyTagNode[] };
    value: number;
};

export namespace Uint8Property {

    export function Parse(reader: ContextReader, property: Uint8Property): void {
        property.value = Uint8Property.ReadValue(reader);
    }

    export function ReadValue(reader: ContextReader): number {
        return reader.readUint8();
    }

    export function Serialize(writer: ContextWriter, property: Uint8Property): void {
        Uint8Property.SerializeValue(writer, property.value);
    }

    export function SerializeValue(writer: ContextWriter, value: number): void {
        writer.writeUint8(value);
    }
}
