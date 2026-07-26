import { ContextReader } from "../../../../../context/context-reader";
import { ContextWriter } from "../../../../../context/context-writer";
import { PropertiesMap } from "../../../property/generic/AbstractBaseProperty";
import { PropertiesList } from "../../../property/PropertiesList";

export type FINDynamicStructHolder = {
    unk0: number;
    subtype: string;
    properties: PropertiesMap;
    remainingBytes: number[];
}

export namespace FINDynamicStructHolder {

    export const read = (reader: ContextReader, size: number): FINDynamicStructHolder => {

        const structHolder: FINDynamicStructHolder = {
            unk0: reader.readInt32(),
            subtype: reader.readString(),
            properties: {},
            remainingBytes: []
        };

        if (structHolder.subtype.length === 0) {
            return structHolder;
        }

        switch (structHolder.subtype) {
            case '/Script/FicsItNetworks.FINGPUT2DC_Box':
            case '/Script/FicsItNetworksComputer.FINGPUT2DC_Box':
            case '/Script/FicsItNetworksComputer.FINGPUT2DC_Text':
            case '/Script/FicsItNetworksComputer.FINGPUT2DC_PushClipRect':
            case '/Script/FicsItNetworksComputer.FINGPUT2DC_PopClip':
            case '/Script/FicsItNetworksLua.FINEventFilter':
            case '/Script/FactoryGame.PrefabSignData':
                structHolder.properties = PropertiesList.ParseList(reader);
                break;

            case '/Script/FicsItNetworks.FINGPUT2DC_Lines':
            case '/Script/FicsItNetworksComputer.FINGPUT2DC_Lines':
                structHolder.remainingBytes = Array.from(reader.readBytes(size));
                break;

            default:
                structHolder.remainingBytes = Array.from(reader.readBytes(size));
                break;
        }

        return structHolder;
    }

    export const write = (writer: ContextWriter, structHolder: FINDynamicStructHolder): void => {
        writer.writeInt32(structHolder.unk0);
        writer.writeString(structHolder.subtype);

        if (structHolder.subtype.length === 0) {
            return;
        }

        switch (structHolder.subtype) {
            case '/Script/FicsItNetworks.FINGPUT2DC_Box':
            case '/Script/FicsItNetworksComputer.FINGPUT2DC_Box':
            case '/Script/FicsItNetworksComputer.FINGPUT2DC_Text':
            case '/Script/FicsItNetworksComputer.FINGPUT2DC_PushClipRect':
            case '/Script/FicsItNetworksComputer.FINGPUT2DC_PopClip':
            case '/Script/FicsItNetworksLua.FINEventFilter':
            case '/Script/FactoryGame.PrefabSignData':
                PropertiesList.SerializeList(writer, structHolder.properties);
                break;

            case '/Script/FicsItNetworks.FINGPUT2DC_Lines':
            case '/Script/FicsItNetworksComputer.FINGPUT2DC_Lines':
                writer.writeBytes(new Uint8Array(structHolder.remainingBytes));
                break;

            default:
                writer.writeBytes(new Uint8Array(structHolder.remainingBytes));
                break;
        }
    }
}