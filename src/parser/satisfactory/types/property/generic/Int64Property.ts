import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { BasicProperty } from './BasicProperty';


export class Int64Property extends BasicProperty {

    constructor(public value: string, ueType: string = 'Int64Property', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'Int64Property', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): Int64Property {
        const guidInfo = GUIDInfo.read(reader);
        const value = Int64Property.ReadValue(reader);
        return new Int64Property(value, ueType, guidInfo, index);
    }

    public static ReadValue(reader: BinaryReadable): string {
        return reader.readInt64().toString();
    }

    public static CalcOverhead(property: Int64Property): number {
        return 1;
    }

    public static Serialize(writer: ByteWriter, property: Int64Property): void {
        GUIDInfo.write(writer, property.guidInfo);
        Int64Property.SerializeValue(writer, property.value);
    }

    public static SerializeValue(writer: ByteWriter, value: string): void {
        writer.writeInt64(BigInt(value));
    }
}
