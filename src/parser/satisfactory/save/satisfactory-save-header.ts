import { ContextReader } from '../../context/context-reader';
import { ContextWriter } from '../../context/context-writer';
import { UnsupportedVersionError } from '../../error/parser.error';
import { MD5Hash } from '../types/structs/MD5Hash';
import { SaveHeaderType } from './save-header-type';
import { SaveReader } from './save-reader';
import { SatisfactoryModMetadata } from './save.types';

/** @public */
export type SatisfactorySaveHeader = {
    saveHeaderType: number;
    saveVersion: number;
    saveName?: string;
    buildVersion: number;
    mapName: string;
    mapOptions: string;
    sessionName: string;
    playDurationSeconds: number;
    saveDateTime: string;
    sessionVisibility: number;
    rawModMetadataString?: string;
    modMetadata?: SatisfactoryModMetadata;
    isModdedSave?: number;
    saveIdentifier?: string;
    fEditorObjectVersion?: number;
    partitionEnabledFlag?: boolean;
    consistencyHashBytes?: MD5Hash;
    creativeModeEnabled?: boolean;
}

export namespace SatisfactorySaveHeader {
    export const Parse = (reader: ContextReader): SatisfactorySaveHeader => {

        const header = {
            saveHeaderType: 0,
            saveVersion: 0,
            buildVersion: 0,
            mapName: "DEFAULT",
            mapOptions: "",
            sessionName: "",
            playDurationSeconds: 0,
            saveDateTime: "0",
            sessionVisibility: 0
        } as SatisfactorySaveHeader;

        header.saveHeaderType = reader.readInt32();
        header.saveVersion = reader.readInt32();
        header.buildVersion = reader.readInt32();

        // set context
        reader.context.saveHeaderType = header.saveHeaderType;
        reader.context.saveVersion = header.saveVersion;
        reader.context.buildVersion = header.buildVersion;

        // 14 is 1.1
        if (header.saveHeaderType >= SaveHeaderType.AddedSaveName) {
            header.saveName = reader.readString();
        }

        header.mapName = reader.readString();
        reader.context.mapName = header.mapName;

        header.mapOptions = reader.readString();
        header.sessionName = reader.readString();
        header.playDurationSeconds = reader.readInt32();
        const rawSaveDateTimeInTicks = reader.readLong(); // in UTC
        const unixMilliseconds = (rawSaveDateTimeInTicks - SaveReader.EPOCH_TICKS) / 10000n;
        header.saveDateTime = unixMilliseconds.toString();
        header.sessionVisibility = reader.readByte();

        if (header.saveHeaderType >= SaveHeaderType.UE425EngineUpdate) {
            header.fEditorObjectVersion = reader.readInt32();
        }
        if (header.saveHeaderType >= SaveHeaderType.AddedModdingParams) {
            header.rawModMetadataString = reader.readString();
            try {
                header.modMetadata = JSON.parse(header.rawModMetadataString);
            } catch (error) {
                // ignore.
            }
            header.isModdedSave = reader.readInt32();
        }

        //10 is U7
        if (header.saveHeaderType >= SaveHeaderType.AddedSaveIdentifier) {
            header.saveIdentifier = reader.readString();
        }

        if (header.saveHeaderType >= SaveHeaderType.AddedWorldPartitionSupport) {
            header.partitionEnabledFlag = reader.readInt32() === 1;
        }

        if (header.saveHeaderType >= SaveHeaderType.AddedSaveModificationChecksum) {
            header.consistencyHashBytes = MD5Hash.read(reader);
        }

        // 13 is U8 Experimental, Also First 1.0 Release
        if (header.saveHeaderType >= SaveHeaderType.AddedIsCreativeModeEnabled) {
            header.creativeModeEnabled = reader.readInt32() == 1;
        }

        if (header.saveVersion < 21) {
            throw new UnsupportedVersionError("The save version is too old to support encoding currently. Save in newer game version.");
        }

        return header;
    }

    export const Serialize = (writer: ContextWriter, header: SatisfactorySaveHeader): void => {

        writer.writeInt32(header.saveHeaderType);
        writer.writeInt32(header.saveVersion);
        writer.writeInt32(header.buildVersion);

        if (header.saveHeaderType >= SaveHeaderType.AddedSaveName) {
            writer.writeString(header.saveName ?? '');
        }

        writer.writeString(header.mapName);
        writer.writeString(header.mapOptions);
        writer.writeString(header.sessionName);
        writer.writeInt32(header.playDurationSeconds);
        writer.writeInt64(BigInt(header.saveDateTime) * 10000n + SaveReader.EPOCH_TICKS);
        writer.writeByte(header.sessionVisibility);

        if (header.saveHeaderType >= SaveHeaderType.UE425EngineUpdate) {
            writer.writeInt32(header.fEditorObjectVersion!);
        }
        if (header.saveHeaderType >= SaveHeaderType.AddedModdingParams) {
            if (header.modMetadata) {
                writer.writeString(JSON.stringify(header.modMetadata));
            } else {
                writer.writeString(header.rawModMetadataString!);
            }
            writer.writeInt32(header.isModdedSave!);
        }
        if (header.saveHeaderType >= SaveHeaderType.AddedSaveIdentifier) {
            writer.writeString(header.saveIdentifier!);
        }

        // U8 jumped directly to 13.
        if (header.saveHeaderType >= SaveHeaderType.AddedWorldPartitionSupport) {
            writer.writeInt32(header.partitionEnabledFlag ? 1 : 0);
        }

        if (header.saveHeaderType >= SaveHeaderType.AddedSaveModificationChecksum) {
            MD5Hash.write(writer, header.consistencyHashBytes!);
        }

        // 13 is U8 Experimental First Release
        if (header.saveHeaderType >= SaveHeaderType.AddedIsCreativeModeEnabled) {
            writer.writeInt32(header.creativeModeEnabled ? 1 : 0);
        }

        if (header.saveVersion < 21) {
            throw new UnsupportedVersionError("The save version is too old to be supported currently.");
        }
    }
}