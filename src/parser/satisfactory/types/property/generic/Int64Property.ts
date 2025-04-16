import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isInt64Property = (property: any): property is Int64Property => !Array.isArray(property) && property.type === 'Int64Property';

export type Int64Property = AbstractBaseProperty & {
    type: 'Int64Property';
    value: string;
};

export namespace Int64Property {

    export const Parse = (reader: ContextReader, ueType: string, index: number = 0): Int64Property => {
        const guidInfo = GUIDInfo.read(reader);
        const value = ReadValue(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'Int64Property',
            value,
        } satisfies Int64Property;
    }

    export const ReadValue = (reader: ContextReader): string => {
        return reader.readInt64().toString();
    }

    export const CalcOverhead = (property: Int64Property): number => {
        return 1;
    }

    export const Serialize = (writer: ContextWriter, property: Int64Property): void => {
        GUIDInfo.write(writer, property.guidInfo);
        SerializeValue(writer, property.value);
    }

    export const SerializeValue = (writer: ContextWriter, value: string): void => {
        writer.writeInt64(BigInt(value));
    }
}
