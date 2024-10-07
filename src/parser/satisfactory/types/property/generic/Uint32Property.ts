import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { BasicProperty } from './BasicProperty';


export class Uint32Property extends BasicProperty {

    constructor(public value: number, ueType: string = 'UInt32Property', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'UInt32Property', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): Uint32Property {
        const guidInfo = GUIDInfo.read(reader);
        const value = Uint32Property.ReadValue(reader);
        return new Uint32Property(value, ueType, guidInfo, index);
    }

    public static ReadValue(reader: BinaryReadable): number {
        return reader.readUint32();
    }

    public static CalcOverhead(property: Uint32Property): number {
        return 1;
    }

    public static Serialize(writer: ByteWriter, property: Uint32Property): void {
        GUIDInfo.write(writer, property.guidInfo);
        Uint32Property.SerializeValue(writer, property.value);
    }

    public static SerializeValue(writer: ByteWriter, value: number): void {
        writer.writeUint32(value);
    }
}
