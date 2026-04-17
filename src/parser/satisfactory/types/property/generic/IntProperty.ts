import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isIntProperty = (property: any): property is IntProperty => property !== null && !Array.isArray(property) && property.propertyTagType?.name === 'IntProperty';

export type IntProperty = AbstractBaseProperty & {
    type: 'IntProperty';
    propertyTagType: { name: 'IntProperty', children: FPropertyTagNode[] };
    value: number;
};

export namespace IntProperty {

    export function Parse(reader: ContextReader, property: IntProperty): void {
        property.value = ReadValue(reader);
    }

    export function ReadValue(reader: ContextReader): number {
        return reader.readInt32();
    }

    export function Serialize(writer: ContextWriter, property: IntProperty): void {
        SerializeValue(writer, property.value);
    }

    export function SerializeValue(writer: ContextWriter, value: number): void {
        writer.writeInt32(value);
    }
}
