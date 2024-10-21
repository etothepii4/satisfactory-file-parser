import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';



export const isEmptySpecialProperties = (obj: any): obj is EmptySpecialProperties => obj.type === 'EmptySpecialProperties';

export type EmptySpecialProperties = {
    type: 'EmptySpecialProperties';
};

export namespace EmptySpecialProperties {
    export const Parse = (reader: BinaryReadable): EmptySpecialProperties => {
        return {
            type: 'EmptySpecialProperties',
        };
    };

    export const Serialize = (writer: ByteWriter, property: EmptySpecialProperties) => { };
}
