import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { SaveCustomVersion } from '../../../save/save-custom-version';
import { FGDynamicStruct } from '../FGDynamicStruct';
import { ObjectReference } from '../ObjectReference';

export type FInventoryItem = {
    itemReference: ObjectReference;
    itemState?: FGDynamicStruct;
    legacyItemStateActor?: ObjectReference;
};

export namespace FInventoryItem {
    export function read(reader: ContextReader): FInventoryItem {
        let value: FInventoryItem = {
            itemReference: ObjectReference.read(reader)
        };

        // inventory items have potentially an item state. but not before explicit version
        if (reader.context.saveVersion.object >= SaveCustomVersion.RefactoredInventoryItemState) {
            value.itemState = FGDynamicStruct.Parse(reader);
        } else {
            value.legacyItemStateActor = ObjectReference.read(reader);
        }

        return value;
    }

    export function write(writer: ContextWriter, value: FInventoryItem): void {

        ObjectReference.write(writer, value.itemReference);

        if (writer.context.saveVersion.object >= SaveCustomVersion.RefactoredInventoryItemState) {
            FGDynamicStruct.Serialize(writer, value.itemState!);
        } else {
            ObjectReference.write(writer, value.legacyItemStateActor!);
        }
    }
};