import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isStrProperty = (property: any): property is StrProperty => !Array.isArray(property) && property.type === 'StrProperty';

export type StrProperty = AbstractBaseProperty & {
    type: 'StrProperty';
    value: string;
};

export namespace StrProperty {

    export const Parse = (reader: ContextReader, ueType: string, index: number = 0): StrProperty => {
        const guidInfo = GUIDInfo.read(reader);
        const value = ReadValue(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'StrProperty',
            value,
        } satisfies StrProperty;
    }

    export const ReadValue = (reader: ContextReader): string => {
        return reader.readString();
    }

    export const CalcOverhead = (property: StrProperty): number => {
        return 1;
    }

    export const Serialize = (writer: ContextWriter, property: StrProperty): void => {
        GUIDInfo.write(writer, property.guidInfo);
        SerializeValue(writer, property.value);
    }

    export const SerializeValue = (writer: ContextWriter, value: string): void => {
        writer.writeString(value);
    }
}
