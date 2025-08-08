import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { PropertiesMap } from '../generic/AbstractBaseProperty';
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
    export const Parse = (reader: ContextReader): SpecialDroneActionProperties => {
        reader.readInt32(); //0

        const countActiveActions = reader.readInt32();
        const activeActions = [];
        for (let i = 0; i < countActiveActions; i++) {
            activeActions.push({
                actionName: reader.readString(),
                properties: PropertiesList.ParseList(reader)
            } satisfies SpecialDroneAction);
        }

        const countQueuedActions = reader.readInt32();
        const queuedActions = [];
        for (let i = 0; i < countQueuedActions; i++) {
            queuedActions.push({
                actionName: reader.readString(),
                properties: PropertiesList.ParseList(reader,)
            } satisfies SpecialDroneAction);
        }

        return {
            type: 'SpecialDroneActionProperties',
            activeActions,
            queuedActions
        };
    };

    export const Serialize = (writer: ContextWriter, property: SpecialDroneActionProperties): void => {
        writer.writeInt32(0);

        writer.writeInt32((property as SpecialDroneActionProperties).activeActions.length);
        for (const action of (property as SpecialDroneActionProperties).activeActions) {
            writer.writeString(action.actionName);
            PropertiesList.SerializeList(writer, action.properties,);
        }

        writer.writeInt32((property as SpecialDroneActionProperties).queuedActions.length);
        for (const action of (property as SpecialDroneActionProperties).queuedActions) {
            writer.writeString(action.actionName);
            PropertiesList.SerializeList(writer, action.properties);
        }
    };
}
