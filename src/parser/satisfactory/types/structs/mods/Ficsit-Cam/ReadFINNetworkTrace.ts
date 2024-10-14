import { BinaryReadable } from '../../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../../byte/byte-writer.class';
import { ObjectReference } from '../../ObjectReference';

export namespace FINNetworkTrace {

    export const read = (reader: BinaryReadable): any => {
        const networkTrace: any = {};

        networkTrace.ref = ObjectReference.read(reader);
        networkTrace.hasPrev = reader.readInt32();
        if (networkTrace.hasPrev) {
            networkTrace.prev = read(reader);
        }

        networkTrace.hasStep = reader.readInt32();
        if (networkTrace.hasStep) {
            networkTrace.step = reader.readString();
        }

        return networkTrace;
    };

    export const write = (writer: ByteWriter, obj: any): void => {

        ObjectReference.write(writer, obj.ref);
        writer.writeInt32(obj.hasPrev);
        if (obj.hasPrev) {
            write(writer, obj.prev);
        }

        writer.writeInt32(obj.hasStep);
        if (obj.hasStep) {
            writer.writeString(obj.step);
        }
    };
}

export namespace FINLuaProcessorStateStorage {

    export const read = (reader: BinaryReadable, size: number): any => {
        const stateStorage: any = { traces: [], references: [], thread: '', globals: '', remainingStructData: {} };
        const start = reader.getBufferPosition();

        const traceCount = reader.readInt32();
        for (let i = 0; i < traceCount; i++) {
            stateStorage.traces.push(FINNetworkTrace.read(reader));
        }

        const refCount = reader.readInt32();
        for (let i = 0; i < refCount; i++) {
            stateStorage.references.push(ObjectReference.read(reader));
        }

        stateStorage.thread = reader.readString();
        stateStorage.globals = reader.readString();

        const remaining = size - (reader.getBufferPosition() - start);
        stateStorage.remainingStructData = reader.readBytes(remaining);

        return stateStorage;
    };

    export const write = (writer: ByteWriter, stateStorage: any): void => {
        writer.writeInt32(stateStorage.traces.length);
        for (const trace of stateStorage.traces) {
            FINNetworkTrace.write(writer, trace);
        }

        writer.writeInt32(stateStorage.references.length);
        for (const ref of stateStorage.references) {
            ObjectReference.write(writer, ref);
        }

        writer.writeString(stateStorage.thread);
        writer.writeString(stateStorage.globals);

        writer.writeBytes(stateStorage.remainingStructData);
    };
}
