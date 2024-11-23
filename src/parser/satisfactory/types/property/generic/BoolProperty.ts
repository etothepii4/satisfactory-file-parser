import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';


export const isBoolProperty = (property: any): property is BoolProperty => !Array.isArray(property) && property.type === 'BoolProperty';

export type BoolProperty = AbstractBaseProperty & {
    type: 'BoolProperty';
    value: boolean;
};

export namespace BoolProperty {

    export const Parse = (reader: BinaryReadable, ueType: string, index: number = 0): BoolProperty => {
        const value = ReadValue(reader);
        const guidInfo = GUIDInfo.read(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'BoolProperty',
            value
        } satisfies BoolProperty;
    }

    export const ReadValue = (reader: BinaryReadable): boolean => {
        return reader.readByte() > 0;
    }

    export const CalcOverhead = (property: BoolProperty): number => {
        return 1 + 1;
    }

    export const Serialize = (writer: ByteWriter, property: BoolProperty): void => {
        SerializeValue(writer, property.value);
        GUIDInfo.write(writer, property.guidInfo);
    }

    export const SerializeValue = (writer: ByteWriter, value: boolean): void => {
        writer.writeByte(value ? 1 : 0);
    }
}
