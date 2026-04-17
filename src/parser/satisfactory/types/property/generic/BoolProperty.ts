import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FPropertyTag } from '../../structs/binary/FPropertyTag';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { AbstractBaseProperty } from './AbstractBaseProperty';


export const isBoolProperty = (property: any): property is BoolProperty => property !== null && !Array.isArray(property) && property.propertyTagType?.name === 'BoolProperty';

export type BoolProperty = AbstractBaseProperty & {
    type: 'BoolProperty';
    propertyTagType: { name: 'BoolProperty', children: FPropertyTagNode[] };
    value: boolean;
};

export namespace BoolProperty {

    export function Parse(reader: ContextReader, property: BoolProperty, tag: FPropertyTag): void {
        if (FPropertyTag.IsCompletePropertyTagType(reader)) {
            property.value = (tag.flags! & 0x10) === 1;
        } else {
            property.value = tag.boolValue!;
        }
    }

    export function ReadValue(reader: ContextReader): boolean {
        return reader.readByte() > 0;
    }

    export function Serialize(writer: ContextWriter, property: BoolProperty): void {
        // done. value is written in tag.
    }

    export function SerializeValue(writer: ContextWriter, value: boolean): void {
        writer.writeByte(value ? 1 : 0);
    }
}
