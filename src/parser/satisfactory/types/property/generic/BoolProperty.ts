import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';


export const isBoolProperty = (property: any): property is BoolProperty => !Array.isArray(property) && property.type === 'BoolProperty';

export type BoolProperty = AbstractBaseProperty & {
    type: 'BoolProperty';
    value: boolean;
};

export namespace BoolProperty {

    export const Parse = (reader: ContextReader, ueType: string, index: number = 0): BoolProperty => {
        const value = ReadValue(reader);
        const guidInfo = GUIDInfo.read(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'BoolProperty',
            value
        } satisfies BoolProperty;
    }

    export const ReadValue = (reader: ContextReader): boolean => {
        return reader.readByte() > 0;
    }

    export const CalcOverhead = (property: BoolProperty): number => {
        return 1 + 1;
    }

    export const Serialize = (writer: ContextWriter, property: BoolProperty): void => {
        SerializeValue(writer, property.value);
        GUIDInfo.write(writer, property.guidInfo);
    }

    export const SerializeValue = (writer: ContextWriter, value: boolean): void => {
        writer.writeByte(value ? 1 : 0);
    }
}
