import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isUint8Property = (property: AbstractBaseProperty | AbstractBaseProperty[]): property is Uint8Property => !Array.isArray(property) && property.type === 'UInt8Property';

export class Uint8Property extends AbstractBaseProperty {

    constructor(public value: number, ueType: string = 'UInt8Property', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'UInt8Property', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): Uint8Property {
        const guidInfo = GUIDInfo.read(reader);
        const value = Uint8Property.ReadValue(reader);
        return new Uint8Property(value, ueType, guidInfo, index);
    }

    public static ReadValue(reader: BinaryReadable): number {
        return reader.readUint8();
    }

    public static CalcOverhead(property: Uint8Property): number {
        return 1;
    }

    public static Serialize(writer: ByteWriter, property: Uint8Property): void {
        GUIDInfo.write(writer, property.guidInfo);
        Uint8Property.SerializeValue(writer, property.value);
    }

    public static SerializeValue(writer: ByteWriter, value: number): void {
        writer.writeUint8(value);
    }
}
