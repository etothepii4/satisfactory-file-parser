import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';



export const isEmptySpecialProperties = (obj: any): obj is EmptySpecialProperties => obj.type === 'EmptySpecialProperties';

export type EmptySpecialProperties = {
    type: 'EmptySpecialProperties';
};

export namespace EmptySpecialProperties {
    export const Parse = (reader: ContextReader): EmptySpecialProperties => {
        return {
            type: 'EmptySpecialProperties',
        };
    };

    export const Serialize = (writer: ContextWriter, property: EmptySpecialProperties) => { };
}
