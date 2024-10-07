import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { BasicProperty } from './BasicProperty';

export const isInt32Property = (property: BasicProperty): property is Int32Property => property.type === 'Int32Property';

export class Int32Property extends BasicProperty {

    constructor(public value: number, ueType: string = 'IntProperty', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'Int32Property', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): Int32Property {
        const guidInfo = GUIDInfo.read(reader);
        const value = Int32Property.ReadValue(reader);
        return new Int32Property(value, ueType, guidInfo, index);
    }

    public static ReadValue(reader: BinaryReadable): number {
        return reader.readInt32();
    }

    public static CalcOverhead(property: Int32Property): number {
        return 1;
    }

    public static Serialize(writer: ByteWriter, property: Int32Property): void {
        GUIDInfo.write(writer, property.guidInfo);
        Int32Property.SerializeValue(writer, property.value);
    }

    public static SerializeValue(writer: ByteWriter, value: number): void {
        writer.writeInt32(value);
    }
}
