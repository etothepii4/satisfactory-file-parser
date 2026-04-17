import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { AbstractBaseProperty } from './AbstractBaseProperty';


export const isDoubleProperty = (property: any): property is DoubleProperty => property !== null && !Array.isArray(property) && property.propertyTagType?.name === 'DoubleProperty';

export type DoubleProperty = AbstractBaseProperty & {
    type: 'DoubleProperty';
    propertyTagType: { name: 'DoubleProperty', children: FPropertyTagNode[] };
    value: number;
};

export namespace DoubleProperty {

    export function Parse(reader: ContextReader, property: DoubleProperty): void {
        property.value = ReadValue(reader);
    }

    export function ReadValue(reader: ContextReader): number {
        return reader.readDouble();
    }

    export function Serialize(writer: ContextWriter, property: DoubleProperty): void {
        SerializeValue(writer, property.value);
    }

    export function SerializeValue(writer: ContextWriter, value: number): void {
        writer.writeDouble(value);
    }
}
