import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { SoftObjectReference } from '../../structs/SoftObjectReference';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isSoftObjectProperty = (property: any): property is SoftObjectProperty => !Array.isArray(property) && property.type === 'SoftObjectProperty';

export type SoftObjectProperty = AbstractBaseProperty & {
    type: 'SoftObjectProperty';
    value: SoftObjectReference;
};

export namespace SoftObjectProperty {


    export const Parse = (reader: BinaryReadable, ueType: string, index: number = 0): SoftObjectProperty => {
        const guidInfo = GUIDInfo.read(reader);
        const value = ReadValue(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'SoftObjectProperty',
            value,
        } satisfies SoftObjectProperty;
    }

    export const ReadValue = (reader: BinaryReadable): SoftObjectReference => {
        return SoftObjectReference.read(reader);
    }

    export const CalcOverhead = (property: SoftObjectProperty): number => {
        return 1;
    }

    export const Serialize = (writer: ByteWriter, property: SoftObjectProperty): void => {
        GUIDInfo.write(writer, property.guidInfo);
        SerializeValue(writer, property.value);
    }

    export const SerializeValue = (writer: ByteWriter, value: SoftObjectReference): void => {
        SoftObjectReference.write(writer, value);
    }
}
