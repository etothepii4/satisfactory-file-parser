import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { SaveCustomVersion } from '../../../save/save-custom-version';
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
    export const Parse = (reader: ContextReader, remainingLen: number): PowerLineSpecialProperties => {
        const start = reader.getBufferPosition();
        const property: PowerLineSpecialProperties = {
            type: 'PowerLineSpecialProperties',
            source: ObjectReference.read(reader),
            target: ObjectReference.read(reader)
        };

        // seems to be, that for blueprints the cached position is stored.
        if (reader.context.blueprintConfigVersion !== undefined && reader.context.saveVersion >= SaveCustomVersion.AddedCachedLocationsForWire) {
            if (remainingLen - (reader.getBufferPosition() - start) >= 24) {
                property.sourceTranslation = vec3.ParseF(reader);
                property.targetTranslation = vec3.ParseF(reader);
            }
        }

        return property;
    };

    export const Serialize = (writer: ContextWriter, property: PowerLineSpecialProperties): void => {
        ObjectReference.write(writer, property.source);
        ObjectReference.write(writer, property.target);
        if (writer.context.blueprintConfigVersion !== undefined && writer.context.saveVersion >= SaveCustomVersion.AddedCachedLocationsForWire) {
            if (property.sourceTranslation && property.targetTranslation) {
                vec3.SerializeF(writer, property.sourceTranslation);
                vec3.SerializeF(writer, property.targetTranslation);
            }
        }
    };
}
