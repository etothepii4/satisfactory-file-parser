import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isFloatProperty = (property: any): property is FloatProperty => !Array.isArray(property) && property.propertyTagType.name === 'FloatProperty';

export type FloatProperty = AbstractBaseProperty & {
    type: 'FloatProperty';
    propertyTagType: { name: 'FloatProperty', children: FPropertyTagNode[] };
    value: number;
};

export namespace FloatProperty {

    export function Parse(reader: ContextReader, property: FloatProperty): void {
        property.value = ReadValue(reader);
    }

    export function ReadValue(reader: ContextReader): number {
        return reader.readFloat32();
    }

    export function Serialize(writer: ContextWriter, property: FloatProperty): void {
        SerializeValue(writer, property.value);
    }

    export function SerializeValue(writer: ContextWriter, value: number): void {
        writer.writeFloat32(value);
    }
}
