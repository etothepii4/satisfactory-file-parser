import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isInt32Property = (property: any): property is Int32Property => !Array.isArray(property) && property.type === 'Int32Property';

export type Int32Property = AbstractBaseProperty & {
    type: 'Int32Property';
    value: number;
};

export namespace Int32Property {

    export const Parse = (reader: ContextReader, ueType: string, index: number = 0): Int32Property => {
        const guidInfo = GUIDInfo.read(reader);
        const value = ReadValue(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'Int32Property',
            value,
        } satisfies Int32Property;
    }

    export const ReadValue = (reader: ContextReader): number => {
        return reader.readInt32();
    }

    export const CalcOverhead = (property: Int32Property): number => {
        return 1;
    }

    export const Serialize = (writer: ContextWriter, property: Int32Property): void => {
        GUIDInfo.write(writer, property.guidInfo);
        SerializeValue(writer, property.value);
    }

    export const SerializeValue = (writer: ContextWriter, value: number): void => {
        writer.writeInt32(value);
    }
}
