import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';


export const isUint32Property = (property: any): property is Uint32Property => !Array.isArray(property) && property.type === 'UInt32Property';

export type Uint32Property = AbstractBaseProperty & {
    type: 'Uint32Property';
    value: number;
};

export namespace Uint32Property {

    export const Parse = (reader: BinaryReadable, ueType: string, index: number = 0): Uint32Property => {
        const guidInfo = GUIDInfo.read(reader);
        const value = ReadValue(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'Uint32Property',
            value,
        } satisfies Uint32Property;
    }


    export const ReadValue = (reader: BinaryReadable): number => {
        return reader.readUint32();
    }

    export const CalcOverhead = (property: Uint32Property): number => {
        return 1;
    }

    export const Serialize = (writer: ByteWriter, property: Uint32Property): void => {
        GUIDInfo.write(writer, property.guidInfo);
        SerializeValue(writer, property.value);
    }

    export const SerializeValue = (writer: ByteWriter, value: number): void => {
        writer.writeUint32(value);
    }
}
