import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FPropertyTag } from '../../structs/binary/FPropertyTag';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isEnumProperty = (property: any): property is EnumProperty => !Array.isArray(property) && property.propertyTagType.name === 'EnumProperty';

export type EnumProperty = AbstractBaseProperty & {
    type: 'EnumProperty';
    propertyTagType: { name: 'EnumProperty', children: FPropertyTagNode[] };
    value: { name: string; value: string; };
};

export namespace EnumProperty {

    export function Parse(reader: ContextReader, property: EnumProperty, tag: FPropertyTag): void {
        property.value = {
            name: tag.enumValueEnumName!,
            value: ReadValue(reader)
        };
    }

    export function ReadValue(reader: ContextReader): string {
        return reader.readString();
    }

    export function Serialize(writer: ContextWriter, property: EnumProperty): void {
        SerializeValue(writer, property.value.value);
    }

    export function SerializeValue(writer: ContextWriter, value: string): void {
        writer.writeString(value);
    }
}
