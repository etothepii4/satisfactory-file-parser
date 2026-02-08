import { ContextReader } from "../../../../../context/context-reader";
import { ContextWriter } from "../../../../../context/context-writer";
import { ObjectReferencesList } from "../../../../save/object-references-list";
import { DynamicStructPropertyValue } from "../../DynamicStructPropertyValue";
import { ObjectReference } from "../../ObjectReference";
import { FINNetworkTrace } from "./FINNetworkTrace";


export type FINLuaRuntimePersistenceState = {
    traces: FINNetworkTrace[];
    references: ObjectReference[];
    thread: string;
    globals: string;
    structs: FIRInstancedStruct[];
    remainingRawData: number[];
};

export type FIRInstancedStruct = DynamicStructPropertyValue | {
    [key: string]: any;
    remainingRawBytes: number[];
}

/**
 *  declared at https://github.com/Panakotta00/FicsIt-Networks/blob/789c32fdc857fc9971f7f73fbbf3789c64f637bc/Source/FicsItNetworksLua/Private/FINLuaRuntimePersistence.cpp#L8
 */
export namespace FINLuaRuntimePersistenceState {

    export const read = (reader: ContextReader, size: number): FINLuaRuntimePersistenceState => {

        const start = reader.getBufferPosition();
        const state: FINLuaRuntimePersistenceState = {
            traces: [],
            references: [],
            thread: '',
            globals: '',
            structs: [],
            remainingRawData: []
        };

        const countTraces = reader.readInt32();
        for (let i = 0; i < countTraces; i++) {
            state.traces.push(FINNetworkTrace.read(reader));
        }

        state.references = ObjectReferencesList.ReadList(reader);

        state.thread = reader.readString();
        state.globals = reader.readString();

        // TODO: in a future version map out more of the FicsitNetworks mod.
        // we already know here come the structs. but not every type is clear yet.
        /*
        const countStructs = reader.readInt32();
        for (let i = 0; i < countStructs; i++) {

            reader.readInt32();
            const subtype = reader.readString();
            let struct: FIRInstancedStruct = { remainingRawBytes: [] };

            switch (subtype) {
                case '/Script/FicsItNetworksLua.FINLuaEventRegistry':
                case '/Script/FicsItNetworksMisc.FINFutureReflection':
                case '/Script/FicsItNetworksLua.FINEventFilterExpression':
                case '/Script/FactoryGame.PrefabSignData':
                    if (reader.context.saveVersion >= SaveCustomVersion.Version1) {
                        struct = DynamicStructPropertyValue.read(reader, subtype);
                    }
                    break;
            }

            state.structs.push(struct);
        }
        */

        const remainingSize = size - (reader.getBufferPosition() - start);
        state.remainingRawData = Array.from(reader.readBytes(remainingSize));

        return state;
    }

    export const write = (writer: ContextWriter, state: FINLuaRuntimePersistenceState): void => {

        writer.writeInt32(state.traces.length);
        for (const trace of state.traces) {
            FINNetworkTrace.write(writer, trace);
        }

        ObjectReferencesList.SerializeList(writer, state.references);

        writer.writeString(state.thread);
        writer.writeString(state.globals);
        writer.writeBytesArray(state.remainingRawData);
    }
}