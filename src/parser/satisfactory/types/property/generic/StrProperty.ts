import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isStrProperty = (property: any): property is StrProperty => !Array.isArray(property) && property.type === 'StrProperty';

export type StrProperty = AbstractBaseProperty & {
    type: 'StrProperty';
    value: string;
};

export namespace StrProperty {

    export const Parse = (reader: BinaryReadable, ueType: string, index: number = 0): StrProperty => {
        const guidInfo = GUIDInfo.read(reader);
        const value = ReadValue(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'StrProperty',
            value,
        } satisfies StrProperty;
    }

    export const ReadValue = (reader: BinaryReadable): string => {
        return reader.readString();
    }

    export const CalcOverhead = (property: StrProperty): number => {
        return 1;
    }

    export const Serialize = (writer: ByteWriter, property: StrProperty): void => {
        GUIDInfo.write(writer, property.guidInfo);
        SerializeValue(writer, property.value);
    }

    export const SerializeValue = (writer: ByteWriter, value: string): void => {
        writer.writeString(value);
    }
}
