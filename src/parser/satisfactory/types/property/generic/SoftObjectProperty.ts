import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { SoftObjectReference } from '../../structs/SoftObjectReference';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isSoftObjectProperty = (property: any): property is SoftObjectProperty => !Array.isArray(property) && property.type === 'SoftObjectProperty';

export type SoftObjectProperty = AbstractBaseProperty & {
    type: 'SoftObjectProperty';
    value: SoftObjectReference;
};

export namespace SoftObjectProperty {


    export const Parse = (reader: ContextReader, ueType: string, index: number = 0): SoftObjectProperty => {
        const guidInfo = GUIDInfo.read(reader);
        const value = ReadValue(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'SoftObjectProperty',
            value,
        } satisfies SoftObjectProperty;
    }

    export const ReadValue = (reader: ContextReader): SoftObjectReference => {
        return SoftObjectReference.read(reader);
    }

    export const CalcOverhead = (property: SoftObjectProperty): number => {
        return 1;
    }

    export const Serialize = (writer: ContextWriter, property: SoftObjectProperty): void => {
        GUIDInfo.write(writer, property.guidInfo);
        SerializeValue(writer, property.value);
    }

    export const SerializeValue = (writer: ContextWriter, value: SoftObjectReference): void => {
        SoftObjectReference.write(writer, value);
    }
}
