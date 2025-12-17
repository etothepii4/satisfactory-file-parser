import { ContextReader } from "../../../../context/context-reader";
import { ContextWriter } from "../../../../context/context-writer";


/**
 * specific binary struct
 */

export type FClientIdentityInfo = {
    offlineId: string;
    accountIds: Record<number, number[]>;
};

export namespace FClientIdentityInfo {

    export const read = (reader: ContextReader): FClientIdentityInfo => {
        const offlineId = reader.readString();
        const numAccountIds = reader.readInt32();

        const accountIds: Record<number, number[]> = {};
        for (let i = 0; i < numAccountIds; i++) {
            const platformFlagMaybe = reader.readByte();    // 1 for Epic, 6 for steam ? Only seen 1s and 6s so far.
            const idSize = reader.readInt32();
            const accountId = Array.from(reader.readBytes(idSize));
            accountIds[platformFlagMaybe] = accountId;
        }

        return {
            offlineId,
            accountIds
        } satisfies FClientIdentityInfo;
    }

    export const write = (writer: ContextWriter, value: FClientIdentityInfo): void => {
        writer.writeString(value.offlineId);
        writer.writeInt32(Object.values(value.accountIds).length);
        for (const [platformFlagMaybe, accountId] of Object.entries(value.accountIds)) {
            writer.writeByte(Number(platformFlagMaybe));
            writer.writeInt32(accountId.length);
            writer.writeBytesArray(accountId);
        }
    }
}