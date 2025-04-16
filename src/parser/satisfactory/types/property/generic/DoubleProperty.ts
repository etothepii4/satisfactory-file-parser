import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';


export const isDoubleProperty = (property: any): property is DoubleProperty => !Array.isArray(property) && property.type === 'DoubleProperty';

export type DoubleProperty = AbstractBaseProperty & {
    type: 'DoubleProperty';
    value: number;
};

export namespace DoubleProperty {

    export const Parse = (reader: ContextReader, ueType: string, index: number = 0): DoubleProperty => {
        const guidInfo = GUIDInfo.read(reader);
        const value = ReadValue(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'DoubleProperty',
            value
        } satisfies DoubleProperty;
    }

    export const ReadValue = (reader: ContextReader): number => {
        return reader.readDouble();
    }

    export const CalcOverhead = (property: DoubleProperty): number => {
        return 1;
    }

    export const Serialize = (writer: ContextWriter, property: DoubleProperty): void => {
        GUIDInfo.write(writer, property.guidInfo);
        SerializeValue(writer, property.value);
    }

    export const SerializeValue = (writer: ContextWriter, value: number): void => {
        writer.writeDouble(value);
    }
}
