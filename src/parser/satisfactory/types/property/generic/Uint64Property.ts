import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isUInt64Property = (property: any): property is Uint64Property => !Array.isArray(property) && property.type === 'UInt64Property';

export type Uint64Property = AbstractBaseProperty & {
    type: 'Uint64Property';
    value: string;
};

export namespace Uint64Property {

    export const Parse = (reader: BinaryReadable, ueType: string, index: number = 0): Uint64Property => {
        const guidInfo = GUIDInfo.read(reader);
        const value = Uint64Property.ReadValue(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'Uint64Property',
            value,
        } satisfies Uint64Property;
    }

    export const ReadValue = (reader: BinaryReadable): string => {
        return reader.readUint64().toString();
    }

    export const CalcOverhead = (property: Uint64Property): number => {
        return 1;
    }

    export const Serialize = (writer: ByteWriter, property: Uint64Property): void => {
        GUIDInfo.write(writer, property.guidInfo);
        Uint64Property.SerializeValue(writer, property.value);
    }

    export const SerializeValue = (writer: ByteWriter, value: string): void => {
        writer.writeUint64(BigInt(value));
    }
}
