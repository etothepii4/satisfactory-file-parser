import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { FInventoryItem } from './FInventoryItem';

export type FConveyorBeltItem = {
    item: FInventoryItem;
    position: number;
};

export namespace FConveyorBeltItem {
    export function read(reader: ContextReader): FConveyorBeltItem {
        return {
            item: FInventoryItem.read(reader),
            position: reader.readFloat32()
        }
    }

    export function write(writer: ContextWriter, value: FConveyorBeltItem): void {
        FInventoryItem.write(writer, value.item);
        writer.writeFloat32(value.position);
    }
};