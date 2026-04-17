import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isInt8Property = (property: any): property is Int8Property => property !== null && !Array.isArray(property) && property.propertyTagType?.name === 'Int8Property';

export type Int8Property = AbstractBaseProperty & {
    type: 'Int8Property';
    propertyTagType: { name: 'Int8Property', children: FPropertyTagNode[] };
    value: number;
};

export namespace Int8Property {

    export function Parse(reader: ContextReader, property: Int8Property): void {
        property.value = ReadValue(reader);
    }

    export function ReadValue(reader: ContextReader): number {
        return reader.readInt8();
    }

    export function Serialize(writer: ContextWriter, property: Int8Property): void {
        SerializeValue(writer, property.value);
    }

    export const SerializeValue = (writer: ContextWriter, value: number): void => {
        writer.writeInt8(value);
    }
}
