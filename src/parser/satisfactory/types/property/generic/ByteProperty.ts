import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FPropertyTag } from '../../structs/binary/FPropertyTag';
import { AbstractBaseProperty } from './AbstractBaseProperty';


export const isByteProperty = (property: any): property is ByteProperty => property !== null && !Array.isArray(property) && property.propertyTagType?.name === 'ByteProperty';

export type ByteProperty = AbstractBaseProperty & {
    type: 'ByteProperty';
    value: BytePropertyValue;
};

export namespace ByteProperty {

    export function Parse(reader: ContextReader, property: ByteProperty, tag: FPropertyTag): void {

        if (FPropertyTag.IsCompletePropertyTagType(reader)) {
            if (tag.propertyTagType.children.length === 0) {
                property.value = {
                    type: tag.byteValueEnumName,
                    value: ReadValue(reader)
                };
            } else {
                property.value = {
                    type: tag.propertyTagType.children[0].name,
                    value: reader.readString()
                };
            }
        } else {
            if (tag.byteValueEnumName === 'None') {
                property.value = {
                    type: tag.byteValueEnumName,
                    value: ReadValue(reader)
                };
            } else {
                property.value = {
                    type: tag.byteValueEnumName,
                    value: reader.readString()
                };
            }
        }
    }

    export function ReadValue(reader: ContextReader): number {
        return reader.readByte();
    }

    export function Serialize(writer: ContextWriter, property: ByteProperty): void {
        if (FPropertyTag.IsCompletePropertyTagType(writer)) {
            if (property.propertyTagType.children.length === 0) {
                SerializeValue(writer, property.value.value as number);
            } else {
                writer.writeString(property.value.value as string);
            }
        } else {
            if (property.value.type === 'None') {
                SerializeValue(writer, property.value.value as number);
            } else {
                writer.writeString(property.value.value as string);
            }
        }
    }

    export function SerializeValue(writer: ContextWriter, value: number): void {
        writer.writeByte(value);
    }
}
export type BytePropertyValue = {
    type?: string;
    value: number | string;
};

