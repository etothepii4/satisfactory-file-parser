import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { ObjectReference } from '../../structs/ObjectReference';
import { vec3 } from '../../structs/vec3';



export const isPowerLineSpecialProperties = (obj: any): obj is PowerLineSpecialProperties => obj.type === 'PowerLineSpecialProperties';

export type PowerLineSpecialProperties = {
    type: 'PowerLineSpecialProperties';
    source: ObjectReference;
    target: ObjectReference;
    sourceTranslation?: vec3;
    targetTranslation?: vec3;
};

export namespace PowerLineSpecialProperties {
    export const Parse = (reader: BinaryReadable, remainingLen: number): PowerLineSpecialProperties => {
        const start = reader.getBufferPosition();
        const property: PowerLineSpecialProperties = {
            type: 'PowerLineSpecialProperties',
            source: ObjectReference.read(reader),
            target: ObjectReference.read(reader)
        };

        if (remainingLen - (reader.getBufferPosition() - start) >= 24) {
            property.sourceTranslation = vec3.ParseF(reader);
            property.targetTranslation = vec3.ParseF(reader);
        }

        return property;
    };

    export const Serialize = (writer: ByteWriter, property: PowerLineSpecialProperties) => {
        ObjectReference.write(writer, property.source);
        ObjectReference.write(writer, property.target);
    };
}
