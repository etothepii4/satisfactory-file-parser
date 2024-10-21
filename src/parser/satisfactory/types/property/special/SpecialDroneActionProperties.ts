import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { PropertiesMap } from '../generic/BasicProperty';
import { PropertiesList } from '../PropertiesList';


export type SpecialDroneAction = {
    actionName: string;
    properties: PropertiesMap;
};

export const isSpecialDroneActionProperties = (obj: any): obj is SpecialDroneActionProperties => obj.type === 'SpecialDroneActionProperties';

export type SpecialDroneActionProperties = {
    type: 'SpecialDroneActionProperties';
    activeActions: SpecialDroneAction[];
    queuedActions: SpecialDroneAction[];
};

export namespace SpecialDroneActionProperties {
    export const Parse = (reader: BinaryReadable): SpecialDroneActionProperties => {
        reader.readInt32(); //0

        const countActiveActions = reader.readInt32();
        const activeActions = [];
        for (let i = 0; i < countActiveActions; i++) {
            activeActions.push({
                actionName: reader.readString(),
                properties: PropertiesList.ParseList(reader, 0)
            } satisfies SpecialDroneAction);
        }

        const countQueuedActions = reader.readInt32();
        const queuedActions = [];
        for (let i = 0; i < countQueuedActions; i++) {
            queuedActions.push({
                actionName: reader.readString(),
                properties: PropertiesList.ParseList(reader, 0)
            } satisfies SpecialDroneAction);
        }

        return {
            type: 'SpecialDroneActionProperties',
            activeActions,
            queuedActions
        };
    };

    export const Serialize = (writer: ByteWriter, property: SpecialDroneActionProperties) => {
        writer.writeInt32(0);

        writer.writeInt32((property as SpecialDroneActionProperties).activeActions.length);
        for (const action of (property as SpecialDroneActionProperties).activeActions) {
            writer.writeString(action.actionName);
            PropertiesList.SerializeList(action.properties, writer, 0);
        }

        writer.writeInt32((property as SpecialDroneActionProperties).queuedActions.length);
        for (const action of (property as SpecialDroneActionProperties).queuedActions) {
            writer.writeString(action.actionName);
            PropertiesList.SerializeList(action.properties, writer, 0);
        }
    };
}
