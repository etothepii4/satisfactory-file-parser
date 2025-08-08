import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { ObjectReferencesList } from '../../../save/object-references-list';
import { ObjectReference } from '../../structs/ObjectReference';



export const isObjectsListSpecialProperties = (obj: any): obj is ObjectsListSpecialProperties => obj.type === 'ObjectsListSpecialProperties';

export type ObjectsListSpecialProperties = {
    type: 'ObjectsListSpecialProperties';
    objects: ObjectReference[];
};

export namespace ObjectsListSpecialProperties {
    export const Parse = (reader: ContextReader): ObjectsListSpecialProperties => {
        const objectsList = ObjectReferencesList.ReadList(reader);
        return {
            type: 'ObjectsListSpecialProperties',
            objects: objectsList
        };
    };

    export const Serialize = (writer: ContextWriter, property: ObjectsListSpecialProperties): void => {
        ObjectReferencesList.SerializeList(writer, property.objects);
    };
}
