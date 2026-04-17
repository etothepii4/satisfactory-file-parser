import { ContextReader } from '../../context/context-reader';
import { ContextWriter } from '../../context/context-writer';
import { FLocalUserNetIdBundle } from '../types/structs/binary/FLocalUserNetIdBundle';
import { FPlayerInfoHandle } from '../types/structs/binary/FPlayerInfoHandle';
import { col4 } from '../types/structs/col4';
import { BlueprintConfigVersion } from './blueprint-config-version';


/**
 * 
 * @lastEditedByLegacy is only found in older blueprints below 1.2
 * @lastEditedBy is found from 1.2 onwards.
 * 
 */
export interface BlueprintConfig {
    configVersion: number;
    description: string;
    color: col4;
    iconID: number;
    referencedIconLibrary?: string;
    iconLibraryType?: string;

    /**
     *  is only found in older blueprints below 1.2
     */
    lastEditedByLegacy?: FLocalUserNetIdBundle[];

    /**
     *  is found from 1.2 onwards.
     */
    lastEditedBy?: FPlayerInfoHandle;
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

        if (reader.context.blueprintConfigVersion >= BlueprintConfigVersion.AddedIconLibraryPath) {
            config.referencedIconLibrary = reader.readString();
            config.iconLibraryType = reader.readString();
        }

        if (reader.context.blueprintConfigVersion == BlueprintConfigVersion.AddedLastEditedBy) {
            const count = reader.readInt32();
            config.lastEditedByLegacy = [];
            for (let i = 0; i < count; i++) {
                config.lastEditedByLegacy.push(FLocalUserNetIdBundle.read(reader));
            }
        } else if (reader.context.blueprintConfigVersion >= BlueprintConfigVersion.RemovedFilteredProfanityName) {
            config.lastEditedBy = FPlayerInfoHandle.read(reader);
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

        if (config.configVersion == BlueprintConfigVersion.AddedLastEditedBy) {
            writer.writeInt32(config.lastEditedByLegacy!.length);
            for (const account of config.lastEditedByLegacy!) {
                FLocalUserNetIdBundle.write(writer, account);
            }
        } else if (config.configVersion >= BlueprintConfigVersion.RemovedFilteredProfanityName) {
            FPlayerInfoHandle.write(writer, config.lastEditedBy!);
        }
    }
}