import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isEnumProperty = (property: any): property is EnumProperty => !Array.isArray(property) && property.type === 'EnumProperty';

export type EnumProperty = AbstractBaseProperty & {
    type: 'EnumProperty';
    value: { name: string; value: string; };
};

export namespace EnumProperty {

    export const Parse = (reader: ContextReader, ueType: string, name: string, index: number = 0): EnumProperty => {
        const guidInfo = GUIDInfo.read(reader);
        const value = ReadValue(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'EnumProperty',
            value: { name, value },
        } satisfies EnumProperty;
    }

    export const ReadValue = (reader: ContextReader): string => {
        return reader.readString();
    }

    export const CalcOverhead = (property: EnumProperty, name: EnumProperty['value']['name']): number => {
        return name.length + 5 + 1;
    }

    export const Serialize = (writer: ContextWriter, property: EnumProperty): void => {
        writer.writeString(property.value.name);
        GUIDInfo.write(writer, property.guidInfo);
        SerializeValue(writer, property.value.value);
    }

    export const SerializeValue = (writer: ContextWriter, value: string): void => {
        writer.writeString(value);
    }
}
