import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { BlueprintConfigVersion } from '../../../blueprint/blueprint-config-version';
import { SaveCustomVersion } from '../../../save/save-custom-version';

export type FPlayerInfoHandle = {
    serviceProvider: number;
    playerInfoTableIndex: number;
};

export namespace FPlayerInfoHandle {
    export function read(reader: ContextReader): FPlayerInfoHandle {

        const handle: FPlayerInfoHandle = {
            serviceProvider: 0,
            playerInfoTableIndex: 0
        };

        if (reader.context.saveVersion.object < SaveCustomVersion.NewPlayerInfoHandleSerializationFormat) {
            handle.serviceProvider = reader.readUint8();
            handle.playerInfoTableIndex = reader.readUint8();
        } else if (
            (reader.context.saveVersion.object >= SaveCustomVersion.NewPlayerInfoHandleSerializationFormat)
            || reader.context.blueprintConfigVersion >= BlueprintConfigVersion.RemovedFilteredProfanityName
        ) {
            handle.serviceProvider = reader.readUint8();
            handle.playerInfoTableIndex = reader.readInt32();
        }

        return handle;
    }

    export function write(writer: ContextWriter, handle: FPlayerInfoHandle): void {
        if (writer.context.saveVersion.object < SaveCustomVersion.NewPlayerInfoHandleSerializationFormat) {
            writer.writeUint8(handle.serviceProvider);
            writer.writeUint8(handle.playerInfoTableIndex);
        } else if (writer.context.saveVersion.object >= SaveCustomVersion.NewPlayerInfoHandleSerializationFormat) {
            writer.writeUint8(handle.serviceProvider);
            writer.writeInt32(handle.playerInfoTableIndex);
        }
    }
};