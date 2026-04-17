import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isSingleProperty = (property: any): property is SingleProperty => !Array.isArray(property) && property.propertyTagType.name === 'SingleProperty';

export type SingleProperty = AbstractBaseProperty & {
    type: 'SingleProperty';
    propertyTagType: { name: 'SingleProperty', children: FPropertyTagNode[] };
    value: number;
};

export namespace SingleProperty {

    export function Parse(reader: ContextReader, property: SingleProperty): void {
        property.value = ReadValue(reader);
    }

    export function ReadValue(reader: ContextReader): number {
        return reader.readFloat32();
    }

    export function Serialize(writer: ContextWriter, property: SingleProperty): void {
        SerializeValue(writer, property.value);
    }

    export function SerializeValue(writer: ContextWriter, value: number): void {
        writer.writeFloat32(value);
    }
}
