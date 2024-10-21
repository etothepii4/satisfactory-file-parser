import { BinaryReadable } from '../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../byte/byte-writer.class';
import { PropertiesList } from '../property/PropertiesList';
import { PropertiesMap } from '../property/generic/BasicProperty';

export type DynamicStructPropertyValue = {
    type: string;
    properties: PropertiesMap;
};

export namespace DynamicStructPropertyValue {

    export const read = (reader: BinaryReadable, buildVersion: number, type: string): DynamicStructPropertyValue => {
        const data: DynamicStructPropertyValue = {
            type, properties: {}
        };

        data.properties = PropertiesList.ParseList(reader, buildVersion);

        return data;
    };

    export const write = (writer: ByteWriter, buildVersion: number, data: DynamicStructPropertyValue): void => {
        PropertiesList.SerializeList(data.properties, writer, buildVersion);
    };
};