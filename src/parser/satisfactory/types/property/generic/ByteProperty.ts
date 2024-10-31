import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';


export const isByteProperty = (property: any): property is ByteProperty => !Array.isArray(property) && property.type === 'ByteProperty';

export class ByteProperty extends AbstractBaseProperty {

    constructor(public value: BytePropertyValue, ueType: string = 'ByteProperty', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'ByteProperty', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): ByteProperty {

        const type = reader.readString();
        const guidInfo = GUIDInfo.read(reader);


        let value;
        if (type === 'None') {
            value = {
                type,
                value: ByteProperty.ReadValue(reader)
            };
        }
        else {
            value = {
                type,
                value: reader.readString()
            };
        }

        const property = new ByteProperty(value, ueType, guidInfo, index);
        return property;
    }

    public static ReadValue(reader: BinaryReadable): number {
        return reader.readByte();
    }

    public static CalcOverhead(property: ByteProperty): number {
        return property.value.type.length + 5 + 1;
    }

    public static Serialize(writer: ByteWriter, property: ByteProperty): void {
        writer.writeString(property.value.type);
        GUIDInfo.write(writer, property.guidInfo);

        if (property.value.type === 'None') {
            ByteProperty.SerializeValue(writer, property.value.value as number);
        }
        else {
            writer.writeString(property.value.value as string);
        }
    }

    public static SerializeValue(writer: ByteWriter, value: number): void {
        writer.writeByte(value);
    }
}
export type BytePropertyValue = {
    type: string;
    value: string | number;
};

