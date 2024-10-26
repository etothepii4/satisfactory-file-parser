import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';


export const isDoubleProperty = (property: AbstractBaseProperty | AbstractBaseProperty[]): property is DoubleProperty => !Array.isArray(property) && property.type === 'DoubleProperty';

export class DoubleProperty extends AbstractBaseProperty {

    constructor(public value: number, ueType: string = 'DoubleProperty', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'DoubleProperty', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): DoubleProperty {
        const guidInfo = GUIDInfo.read(reader);
        const value = DoubleProperty.ReadValue(reader);
        return new DoubleProperty(value, ueType, guidInfo, index);
    }

    public static ReadValue(reader: BinaryReadable): number {
        return reader.readDouble();
    }

    public static CalcOverhead(property: DoubleProperty): number {
        return 1;
    }

    public static Serialize(writer: ByteWriter, property: DoubleProperty): void {
        GUIDInfo.write(writer, property.guidInfo);
        DoubleProperty.SerializeValue(writer, property.value);
    }

    public static SerializeValue(writer: ByteWriter, value: number): void {
        writer.writeDouble(value);
    }
}
