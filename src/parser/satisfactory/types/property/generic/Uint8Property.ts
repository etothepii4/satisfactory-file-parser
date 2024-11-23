import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isUint8Property = (property: any): property is Uint8Property => !Array.isArray(property) && property.type === 'UInt8Property';

export type Uint8Property = AbstractBaseProperty & {
    type: 'Uint8Property';
    value: number;
};

export namespace Uint8Property {

    export const Parse = (reader: BinaryReadable, ueType: string, index: number = 0): Uint8Property => {
        const guidInfo = GUIDInfo.read(reader);
        const value = Uint8Property.ReadValue(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'Uint8Property',
            value,
        } satisfies Uint8Property;
    }

    export const ReadValue = (reader: BinaryReadable): number => {
        return reader.readUint8();
    }

    export const CalcOverhead = (property: Uint8Property): number => {
        return 1;
    }

    export const Serialize = (writer: ByteWriter, property: Uint8Property): void => {
        GUIDInfo.write(writer, property.guidInfo);
        Uint8Property.SerializeValue(writer, property.value);
    }

    export const SerializeValue = (writer: ByteWriter, value: number): void => {
        writer.writeUint8(value);
    }
}
