import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';

export type FLocalUserNetIdBundle = {
    accountId: string;
    displayName: string;
    platformName: string;
};

export namespace FLocalUserNetIdBundle {
    export function read(reader: ContextReader): FLocalUserNetIdBundle {
        return {
            accountId: reader.readString(),
            displayName: reader.readString(),
            platformName: reader.readString()
        }
    }

    export function write(writer: ContextWriter, customVersion: FLocalUserNetIdBundle): void {
        writer.writeString(customVersion.accountId);
        writer.writeString(customVersion.displayName);
        writer.writeString(customVersion.platformName);
    }
};