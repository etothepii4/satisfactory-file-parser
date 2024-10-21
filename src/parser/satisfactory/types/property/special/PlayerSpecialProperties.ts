import { ByteReader } from '../../../../byte/byte-reader.class';
import { ByteWriter } from '../../../../byte/byte-writer.class';



export const isPlayerSpecialProperties = (obj: any): obj is PlayerSpecialProperties => obj.type === 'PlayerSpecialProperties';

export type PlayerSpecialProperties = {
    type: 'PlayerSpecialProperties';
    flag: number;
    eosData?: string;
    steamPlayerData?: string;
};

export namespace PlayerSpecialProperties {
    export const Parse = (reader: ByteReader): PlayerSpecialProperties => {

        const flag = reader.readByte(); // 241?


        // TODO - i don't know enough about player state yet. need more players.
        const property: PlayerSpecialProperties = {
            type: 'PlayerSpecialProperties',
            flag
        };

        // 241 = byte, byte, length? flag, id with length bytes
        switch (property.flag) {
            case 248: // default EOS
                const eos = reader.readString();
                property.eosData = reader.readString();
                break;
            case 25: // steam!?
                break;
            default:
                break;
        }

        return property;
    };

    export const Serialize = (writer: ByteWriter, property: PlayerSpecialProperties) => {
        writer.writeByte((property as PlayerSpecialProperties).flag);
        switch ((property as PlayerSpecialProperties).flag) {
            case 248: // default EOS
                writer.writeString('EOS');
                writer.writeString((property as PlayerSpecialProperties).eosData!);
                break;
            case 25: // steam!?
                break;
            default:
                break;

        }
    };
}
