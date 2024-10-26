import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isStrProperty = (property: AbstractBaseProperty | AbstractBaseProperty[]): property is StrProperty => !Array.isArray(property) && property.type === 'StrProperty';

export class StrProperty extends AbstractBaseProperty {

    constructor(public value: string, ueType: string = 'StrProperty', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'StrProperty', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): StrProperty {
        const guidInfo = GUIDInfo.read(reader);
        const value = StrProperty.ReadValue(reader);
        return new StrProperty(value, ueType, guidInfo, index);
    }

    public static ReadValue(reader: BinaryReadable): string {
        return reader.readString();
    }

    public static CalcOverhead(property: StrProperty): number {
        return 1;
    }

    public static Serialize(writer: ByteWriter, property: StrProperty): void {
        GUIDInfo.write(writer, property.guidInfo);
        StrProperty.SerializeValue(writer, property.value);
    }

    public static SerializeValue(writer: ByteWriter, value: string): void {
        writer.writeString(value);
    }
}
