import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { ObjectReference } from '../../structs/ObjectReference';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isObjectProperty = (property: any): property is ObjectProperty => !Array.isArray(property) && property.type === 'ObjectProperty';

export type ObjectProperty = AbstractBaseProperty & {
    type: 'ObjectProperty';
    value: ObjectReference;
};

export namespace ObjectProperty {

    export const Parse = (reader: BinaryReadable, ueType: string, index: number = 0): ObjectProperty => {
        const guidInfo = GUIDInfo.read(reader);
        const value = ReadValue(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'ObjectProperty',
            value,
        } satisfies ObjectProperty;
    }

    export const ReadValue = (reader: BinaryReadable): ObjectReference => {
        return ObjectReference.read(reader);
    }

    export const CalcOverhead = (property: ObjectProperty): number => {
        return 1;
    }

    export const Serialize = (writer: ByteWriter, property: ObjectProperty): void => {
        GUIDInfo.write(writer, property.guidInfo);
        SerializeValue(writer, property.value);
    }

    export const SerializeValue = (writer: ByteWriter, value: ObjectReference): void => {
        ObjectReference.write(writer, value);
    }
}
