import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';


export const isByteProperty = (property: any): property is ByteProperty => !Array.isArray(property) && property.type === 'ByteProperty';

export type ByteProperty = AbstractBaseProperty & {
    type: 'ByteProperty';
    value: BytePropertyValue;
};

export namespace ByteProperty {

    export const Parse = (reader: BinaryReadable, ueType: string, index: number = 0): ByteProperty => {

        const type = reader.readString();
        const guidInfo = GUIDInfo.read(reader);


        let value;
        if (type === 'None') {
            value = {
                type,
                value: ReadValue(reader)
            };
        }
        else {
            value = {
                type,
                value: reader.readString()
            };
        }

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'ByteProperty',
            value
        } satisfies ByteProperty;
    }

    export const ReadValue = (reader: BinaryReadable): number => {
        return reader.readByte();
    }

    export const CalcOverhead = (property: ByteProperty): number => {
        return property.value.type.length + 5 + 1;
    }

    export const Serialize = (writer: ByteWriter, property: ByteProperty): void => {
        writer.writeString(property.value.type);
        GUIDInfo.write(writer, property.guidInfo);

        if (property.value.type === 'None') {
            SerializeValue(writer, property.value.value as number);
        }
        else {
            writer.writeString(property.value.value as string);
        }
    }

    export const SerializeValue = (writer: ByteWriter, value: number): void => {
        writer.writeByte(value);
    }
}
export type BytePropertyValue = {
    type: string;
    value: string | number;
};

