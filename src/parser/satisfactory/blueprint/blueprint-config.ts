import { ContextReader } from '../../context/context-reader';
import { ContextWriter } from '../../context/context-writer';
import { col4 } from '../types/structs/col4';
import { BlueprintConfigVersion } from './blueprint-config-version';


/** @public */
export interface BlueprintConfig {
    configVersion: number;
    description: string;
    color: col4;
    iconID: number;
    referencedIconLibrary?: string;
    iconLibraryType?: string;
    lastEditedBy?: {
        accountId: string;
        displayName: string;
        platformName: string;
    }[];
}

export namespace BlueprintConfig {
    export const Parse = (reader: ContextReader): BlueprintConfig => {
        const configVersion = reader.readInt32();
        const description = reader.readString();
        const iconID = reader.readInt32();
        const color = col4.ParseRGBA(reader);
        reader.context.blueprintConfigVersion = configVersion;

        const config: BlueprintConfig = {
            configVersion,
            description,
            color,
            iconID,
        };

        if (configVersion >= BlueprintConfigVersion.AddedIconLibraryPath) {
            config.referencedIconLibrary = reader.readString();
            config.iconLibraryType = reader.readString();
        }

        if (configVersion >= BlueprintConfigVersion.AddedLastEditedBy) {
            const count = reader.readInt32();
            config.lastEditedBy = [];
            for (let i = 0; i < count; i++) {
                config.lastEditedBy?.push({
                    accountId: reader.readString(),
                    displayName: reader.readString(),
                    platformName: reader.readString()
                });
            }
        }

        return config;
    };

    export const Serialize = (writer: ContextWriter, config: BlueprintConfig): void => {
        writer.writeInt32(config.configVersion);
        writer.writeString(config.description);
        writer.writeInt32(config.iconID);
        col4.SerializeRGBA(writer, config.color);

        if (config.configVersion >= BlueprintConfigVersion.AddedIconLibraryPath) {
            writer.writeString(config.referencedIconLibrary ?? '');
            writer.writeString(config.iconLibraryType ?? '');
        }

        if (config.configVersion >= BlueprintConfigVersion.AddedLastEditedBy) {
            writer.writeInt32(config.lastEditedBy!.length);
            for (const account of config.lastEditedBy!) {
                writer.writeString(account.accountId);
                writer.writeString(account.displayName);
                writer.writeString(account.platformName);
            }
        }
    }
}