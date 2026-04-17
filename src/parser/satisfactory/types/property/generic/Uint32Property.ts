import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { AbstractBaseProperty } from './AbstractBaseProperty';


export const isUint32Property = (property: any): property is Uint32Property => property !== null && !Array.isArray(property) && property.propertyTagType?.name === 'UInt32Property';

export type Uint32Property = AbstractBaseProperty & {
    type: 'Uint32Property';
    propertyTagType: { name: 'Uint32Property', children: FPropertyTagNode[] };
    value: number;
};

export namespace Uint32Property {

    export function Parse(reader: ContextReader, property: Uint32Property): void {
        property.value = ReadValue(reader);
    }


    export function ReadValue(reader: ContextReader): number {
        return reader.readUint32();
    }

    export function Serialize(writer: ContextWriter, property: Uint32Property): void {
        SerializeValue(writer, property.value);
    }

    export function SerializeValue(writer: ContextWriter, value: number): void {
        writer.writeUint32(value);
    }
}
