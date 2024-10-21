import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';



export const isConveyorSpecialProperties = (obj: any): obj is ConveyorSpecialProperties => obj.type === 'ConveyorSpecialProperties';

export type ConveyorSpecialProperties = {
    type: 'ConveyorSpecialProperties';
};

export namespace ConveyorSpecialProperties {
    export const Parse = (reader: BinaryReadable): ConveyorSpecialProperties => {
        reader.readInt32(); // 0
        return {
            type: 'ConveyorSpecialProperties',
        };
    };

    export const Serialize = (writer: ByteWriter, property: ConveyorSpecialProperties) => {
        writer.writeInt32(0);
    };
}
