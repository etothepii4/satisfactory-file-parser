import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isInt8Property = (property: any): property is Int8Property => !Array.isArray(property) && property.type === 'Int8Property';

export type Int8Property = AbstractBaseProperty & {
    type: 'Int8Property';
    value: number;
};

export namespace Int8Property {

    export const Parse = (reader: BinaryReadable, ueType: string, index: number = 0): Int8Property => {
        const guidInfo = GUIDInfo.read(reader);
        const value = ReadValue(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'Int8Property',
            value,
        } satisfies Int8Property;
    }

    export const ReadValue = (reader: BinaryReadable): number => {
        return reader.readInt8();
    }

    export const CalcOverhead = (property: Int8Property): number => {
        return 1;
    }

    export const Serialize = (writer: ByteWriter, property: Int8Property): void => {
        GUIDInfo.write(writer, property.guidInfo);
        SerializeValue(writer, property.value);
    }

    export const SerializeValue = (writer: ByteWriter, value: number): void => {
        writer.writeInt8(value);
    }
}
