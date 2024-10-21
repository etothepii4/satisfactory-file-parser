import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { ObjectReferencesList } from '../../../save/object-references-list';
import { ObjectReference } from '../../structs/ObjectReference';



export const isObjectsListSpecialProperties = (obj: any): obj is ObjectsListSpecialProperties => obj.type === 'ObjectsListSpecialProperties';

export type ObjectsListSpecialProperties = {
    type: 'ObjectsListSpecialProperties';
    objects: ObjectReference[];
};

export namespace ObjectsListSpecialProperties {
    export const Parse = (reader: BinaryReadable): ObjectsListSpecialProperties => {
        const objectsList = ObjectReferencesList.ReadList(reader);
        return {
            type: 'ObjectsListSpecialProperties',
            objects: objectsList
        };
    };

    export const Serialize = (writer: ByteWriter, property: ObjectsListSpecialProperties) => {
        ObjectReferencesList.SerializeList(writer, property.objects);
    };
}
