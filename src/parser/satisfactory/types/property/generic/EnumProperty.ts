import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isEnumProperty = (property: any): property is EnumProperty => !Array.isArray(property) && property.type === 'EnumProperty';

export type EnumProperty = AbstractBaseProperty & {
    type: 'EnumProperty';
    value: { name: string; value: string; };
};

export namespace EnumProperty {

    export const Parse = (reader: BinaryReadable, ueType: string, index: number = 0): EnumProperty => {
        let name = reader.readString();
        const guidInfo = GUIDInfo.read(reader);
        const value = ReadValue(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'EnumProperty',
            value: { name, value },
        } satisfies EnumProperty;
    }

    export const ReadValue = (reader: BinaryReadable): string => {
        return reader.readString();
    }

    export const CalcOverhead = (property: EnumProperty): number => {
        return property.value.name.length + 5 + 1;
    }

    export const Serialize = (writer: ByteWriter, property: EnumProperty): void => {
        writer.writeString(property.value.name);
        GUIDInfo.write(writer, property.guidInfo);
        SerializeValue(writer, property.value.value);
    }

    export const SerializeValue = (writer: ByteWriter, value: string): void => {
        writer.writeString(value);
    }
}
