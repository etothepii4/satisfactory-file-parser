import { ContextReader } from '../../../context/context-reader';
import { ContextWriter } from '../../../context/context-writer';
import { PropertiesList } from '../property/PropertiesList';
import { PropertiesMap } from '../property/generic/AbstractBaseProperty';

export type DynamicStructPropertyValue = {
    type: string;
    properties: PropertiesMap;
};

export namespace DynamicStructPropertyValue {

    export const read = (reader: ContextReader, type: string): DynamicStructPropertyValue => {
        const data: DynamicStructPropertyValue = {
            type, properties: {}
        };

        data.properties = PropertiesList.ParseList(reader);

        return data;
    };

    export const write = (writer: ContextWriter, data: DynamicStructPropertyValue): void => {
        PropertiesList.SerializeList(data.properties, writer);
    };
};