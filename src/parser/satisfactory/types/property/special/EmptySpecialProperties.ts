import { ByteReader } from '../../../../byte/byte-reader.class';
import { ByteWriter } from '../../../../byte/byte-writer.class';



export const isEmptySpecialProperties = (obj: any): obj is EmptySpecialProperties => obj.type === 'EmptySpecialProperties';

export type EmptySpecialProperties = {
    type: 'EmptySpecialProperties';
};

export namespace EmptySpecialProperties {
    export const Parse = (reader: ByteReader): EmptySpecialProperties => {
        return {
            type: 'EmptySpecialProperties',
        };
    };

    export const Serialize = (writer: ByteWriter, property: EmptySpecialProperties) => { };
}
