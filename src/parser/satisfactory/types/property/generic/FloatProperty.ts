import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isFloatProperty = (property: any): property is FloatProperty => !Array.isArray(property) && property.type === 'FloatProperty';

export type FloatProperty = AbstractBaseProperty & {
    type: 'FloatProperty';
    value: number;
};

export namespace FloatProperty {

    export const Parse = (reader: BinaryReadable, ueType: string, index: number = 0): FloatProperty => {
        const guidInfo = GUIDInfo.read(reader);
        const value = ReadValue(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'FloatProperty',
            value,
        } satisfies FloatProperty;
    }

    export const CalcOverhead = (property: FloatProperty): number => {
        return 1;
    }

    export const ReadValue = (reader: BinaryReadable): number => {
        return reader.readFloat32();
    }

    export const Serialize = (writer: ByteWriter, property: FloatProperty): void => {
        GUIDInfo.write(writer, property.guidInfo);
        SerializeValue(writer, property.value);
    }

    export const SerializeValue = (writer: ByteWriter, value: number): void => {
        writer.writeFloat32(value);
    }
}
