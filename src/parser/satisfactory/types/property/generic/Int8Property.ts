import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isInt8Property = (property: any): property is Int8Property => !Array.isArray(property) && property.type === 'Int8Property';

export class Int8Property extends AbstractBaseProperty {

    constructor(public value: number, ueType: string = 'Int8Property', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'Int8Property', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): Int8Property {
        const guidInfo = GUIDInfo.read(reader);
        const value = Int8Property.ReadValue(reader);
        return new Int8Property(value, ueType, guidInfo, index);
    }

    public static ReadValue(reader: BinaryReadable): number {
        return reader.readInt8();
    }

    public static CalcOverhead(property: Int8Property): number {
        return 1;
    }

    public static Serialize(writer: ByteWriter, property: Int8Property): void {
        GUIDInfo.write(writer, property.guidInfo);
        Int8Property.SerializeValue(writer, property.value);
    }

    public static SerializeValue(writer: ByteWriter, value: number): void {
        writer.writeInt8(value);
    }
}
