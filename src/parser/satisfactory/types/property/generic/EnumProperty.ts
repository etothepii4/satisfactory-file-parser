import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { BasicProperty } from './BasicProperty';

export const isEnumProperty = (property: BasicProperty): property is EnumProperty => property.type === 'EnumProperty';

export class EnumProperty extends BasicProperty {

    constructor(public value: { name: string; value: string; }, ueType: string = 'EnumProperty', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'EnumProperty', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): EnumProperty {
        let name = reader.readString();
        const guidInfo = GUIDInfo.read(reader);
        const value = EnumProperty.ReadValue(reader);

        const property = new EnumProperty({ name, value }, ueType, guidInfo, index);
        return property;
    }

    public static ReadValue(reader: BinaryReadable): string {
        return reader.readString();
    }

    public static CalcOverhead(property: EnumProperty): number {
        return property.value.name.length + 5 + 1;
    }

    public static Serialize(writer: ByteWriter, property: EnumProperty): void {
        writer.writeString(property.value.name);
        GUIDInfo.write(writer, property.guidInfo);
        EnumProperty.SerializeValue(writer, property.value.value);
    }

    public static SerializeValue(writer: ByteWriter, value: string): void {
        writer.writeString(value);
    }
}
