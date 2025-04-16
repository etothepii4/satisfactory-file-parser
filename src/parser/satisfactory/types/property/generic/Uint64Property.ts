import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isUInt64Property = (property: any): property is Uint64Property => !Array.isArray(property) && property.type === 'UInt64Property';

export type Uint64Property = AbstractBaseProperty & {
    type: 'Uint64Property';
    value: string;
};

export namespace Uint64Property {

    export const Parse = (reader: ContextReader, ueType: string, index: number = 0): Uint64Property => {
        const guidInfo = GUIDInfo.read(reader);
        const value = Uint64Property.ReadValue(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'Uint64Property',
            value,
        } satisfies Uint64Property;
    }

    export const ReadValue = (reader: ContextReader): string => {
        return reader.readUint64().toString();
    }

    export const CalcOverhead = (property: Uint64Property): number => {
        return 1;
    }

    export const Serialize = (writer: ContextWriter, property: Uint64Property): void => {
        GUIDInfo.write(writer, property.guidInfo);
        Uint64Property.SerializeValue(writer, property.value);
    }

    export const SerializeValue = (writer: ContextWriter, value: string): void => {
        writer.writeUint64(BigInt(value));
    }
}
