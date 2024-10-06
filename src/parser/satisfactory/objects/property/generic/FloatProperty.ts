import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../GUIDInfo';
import { BasicProperty } from './BasicProperty';


export class FloatProperty extends BasicProperty {

    constructor(public value: number, ueType: string = 'FloatProperty', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'FloatProperty', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): FloatProperty {
        const guidInfo = GUIDInfo.read(reader);
        const value = FloatProperty.ReadValue(reader);
        return new FloatProperty(value, ueType, guidInfo, index);
    }

    public static CalcOverhead(property: FloatProperty): number {
        return 1;
    }

    public static ReadValue(reader: BinaryReadable): number {
        return reader.readFloat32();
    }

    public static Serialize(writer: ByteWriter, property: FloatProperty): void {
        GUIDInfo.write(writer, property.guidInfo);
        FloatProperty.SerializeValue(writer, property.value);
    }

    public static SerializeValue(writer: ByteWriter, value: number): void {
        writer.writeFloat32(value);
    }
}
