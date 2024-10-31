import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';


export const isBoolProperty = (property: any): property is BoolProperty => !Array.isArray(property) && property.type === 'BoolProperty';

export class BoolProperty extends AbstractBaseProperty {

    constructor(public value: boolean, ueType: string = 'BoolProperty', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'BoolProperty', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): BoolProperty {
        const value = BoolProperty.ReadValue(reader);
        const guidInfo = GUIDInfo.read(reader);
        return new BoolProperty(value, ueType, guidInfo, index);
    }

    public static ReadValue(reader: BinaryReadable): boolean {
        return reader.readByte() > 0;
    }

    public static CalcOverhead(property: BoolProperty): number {
        return 1 + 1;
    }

    public static Serialize(writer: ByteWriter, property: BoolProperty): void {
        BoolProperty.SerializeValue(writer, property.value);
        GUIDInfo.write(writer, property.guidInfo);
    }

    public static SerializeValue(writer: ByteWriter, value: boolean): void {
        writer.writeByte(value ? 1 : 0);
    }
}
