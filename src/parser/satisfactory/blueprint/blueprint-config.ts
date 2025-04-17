import { ContextReader } from '../../context/context-reader';
import { ContextWriter } from '../../context/context-writer';
import { SaveCustomVersion } from '../save/save-custom-version';
import { col4 } from '../types/structs/col4';


/** @public */
export interface BlueprintConfig {
    configVersion: number;
    description: string;
    color: col4;
    iconID: number;
    referencedIconLibrary?: string;
    iconLibraryType?: string;
}

export namespace BlueprintConfig {
    export const Parse = (reader: ContextReader) => {
        const configVersion = reader.readInt32();
        const description = reader.readString();
        const iconID = reader.readInt32();
        const color = col4.ParseRGBA(reader);

        const config: BlueprintConfig = {
            configVersion,
            description,
            color,
            iconID,
        };

        // TODO: check if thats 100% solid logic.
        // since 1.0, created blueprints have those two strings
        if (reader.context.saveVersion >= SaveCustomVersion.Version1) {
            //if (reader.getBufferPosition() < reader.getBufferLength()) {
            config.referencedIconLibrary = reader.readString();
            config.iconLibraryType = reader.readString();
            //}
        }

        return config;
    };

    export const Serialize = (writer: ContextWriter, config: BlueprintConfig) => {
        writer.writeInt32(config.configVersion);
        writer.writeString(config.description);
        writer.writeInt32(config.iconID);
        col4.SerializeRGBA(writer, config.color);

        if (writer.context.saveVersion >= SaveCustomVersion.Version1) {
            writer.writeString(config.referencedIconLibrary ?? '');
            writer.writeString(config.iconLibraryType ?? '');
        }
    }
}