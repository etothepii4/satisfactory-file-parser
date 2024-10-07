import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { BasicProperty } from './BasicProperty';

export const isUInt64Property = (property: BasicProperty): property is Uint64Property => property.type === 'UInt64Property';

export class Uint64Property extends BasicProperty {

    constructor(public value: string, ueType: string = 'UInt64Property', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'UInt64Property', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): Uint64Property {
        const guidInfo = GUIDInfo.read(reader);
        const value = Uint64Property.ReadValue(reader);
        return new Uint64Property(value, ueType, guidInfo, index);
    }

    public static ReadValue(reader: BinaryReadable): string {
        return reader.readUint64().toString();
    }

    public static CalcOverhead(property: Uint64Property): number {
        return 1;
    }

    public static Serialize(writer: ByteWriter, property: Uint64Property): void {
        GUIDInfo.write(writer, property.guidInfo);
        Uint64Property.SerializeValue(writer, property.value);
    }

    public static SerializeValue(writer: ByteWriter, value: string): void {
        writer.writeUint64(BigInt(value));
    }
}
