import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { BasicProperty } from './BasicProperty';


export class UInt64Property extends BasicProperty {

    constructor(public value: string, ueType: string = 'UInt64Property', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'UInt64Property', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): UInt64Property {
        const guidInfo = GUIDInfo.read(reader);
        const value = UInt64Property.ReadValue(reader);
        return new UInt64Property(value, ueType, guidInfo, index);
    }

    public static ReadValue(reader: BinaryReadable): string {
        return reader.readUint64().toString();
    }

    public static CalcOverhead(property: UInt64Property): number {
        return 1;
    }

    public static Serialize(writer: ByteWriter, property: UInt64Property): void {
        GUIDInfo.write(writer, property.guidInfo);
        UInt64Property.SerializeValue(writer, property.value);
    }

    public static SerializeValue(writer: ByteWriter, value: string): void {
        writer.writeUint64(BigInt(value));
    }
}
