import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';



export const isConveyorSpecialProperties = (obj: any): obj is ConveyorSpecialProperties => obj.type === 'ConveyorSpecialProperties';

export type ConveyorSpecialProperties = {
    type: 'ConveyorSpecialProperties';
};

export namespace ConveyorSpecialProperties {
    export const Parse = (reader: ContextReader): ConveyorSpecialProperties => {
        reader.readInt32Zero();
        return {
            type: 'ConveyorSpecialProperties',
        };
    };

    export const Serialize = (writer: ContextWriter, property: ConveyorSpecialProperties) => {
        writer.writeInt32Zero();
    };
}
