import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';


export const isUint32Property = (property: any): property is Uint32Property => !Array.isArray(property) && property.type === 'UInt32Property';

export type Uint32Property = AbstractBaseProperty & {
    type: 'Uint32Property';
    value: number;
};

export namespace Uint32Property {

    export const Parse = (reader: ContextReader, ueType: string, index: number = 0): Uint32Property => {
        const guidInfo = GUIDInfo.read(reader);
        const value = ReadValue(reader);

        return {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'Uint32Property',
            value,
        } satisfies Uint32Property;
    }


    export const ReadValue = (reader: ContextReader): number => {
        return reader.readUint32();
    }

    export const CalcOverhead = (property: Uint32Property): number => {
        return 1;
    }

    export const Serialize = (writer: ContextWriter, property: Uint32Property): void => {
        GUIDInfo.write(writer, property.guidInfo);
        SerializeValue(writer, property.value);
    }

    export const SerializeValue = (writer: ContextWriter, value: number): void => {
        writer.writeUint32(value);
    }
}
