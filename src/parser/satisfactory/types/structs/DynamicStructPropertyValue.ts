import { BinaryReadable } from '../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../byte/byte-writer.class';
import { DataFields } from '../property/DataFields';
import { AbstractBaseProperty, PropertiesMap } from '../property/generic/BasicProperty';

export type DynamicStructPropertyValue = {
    type: string;
    properties: PropertiesMap;
};

export namespace DynamicStructPropertyValue {

    export const read = (reader: BinaryReadable, buildVersion: number, type: string): DynamicStructPropertyValue => {
        const data: DynamicStructPropertyValue = {
            type, properties: {}
        };

        let propertyName: string = reader.readString();
        while (propertyName !== 'None') {
            const parsedProperty = DataFields.ParseProperty(reader, buildVersion, propertyName)!;

            // if it already exists, make it an array.
            if (data.properties[propertyName]) {
                if (!Array.isArray(data.properties[propertyName])) {
                    data.properties[propertyName] = [data.properties[propertyName] as AbstractBaseProperty];
                }
                (data.properties[propertyName] as AbstractBaseProperty[]).push(parsedProperty);
            } else {
                data.properties[propertyName] = parsedProperty;
            }

            propertyName = reader.readString();
        }

        return data;
    };

    export const write = (writer: ByteWriter, buildVersion: number, data: DynamicStructPropertyValue): void => {
        for (const key in data.properties) {
            for (const prop of (Array.isArray(data.properties[key]) ? data.properties[key] : [data.properties[key]]) as AbstractBaseProperty[]) {
                writer.writeString(key);
                DataFields.SerializeProperty(writer, prop, key, buildVersion);
            }
        }
        writer.writeString('None');
    };
};