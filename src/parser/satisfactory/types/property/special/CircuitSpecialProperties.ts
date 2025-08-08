import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { ObjectReference } from '../../structs/ObjectReference';



export const isCircuitSpecialProperties = (obj: any): obj is CircuitSpecialProperties => obj.type === 'CircuitSpecialProperties';

export type CircuitSpecialProperties = {
    type: 'CircuitSpecialProperties';
    circuits: {
        id: number;
        objectReference: ObjectReference;
    }[];
};

export namespace CircuitSpecialProperties {
    export const Parse = (reader: ContextReader): CircuitSpecialProperties => {
        const count = reader.readInt32();
        const circuits = [];
        for (let i = 0; i < count; i++) {
            circuits.push({
                id: reader.readInt32(),
                objectReference: ObjectReference.read(reader)
            });
        }

        return {
            type: 'CircuitSpecialProperties',
            circuits
        };
    };

    export const Serialize = (writer: ContextWriter, property: CircuitSpecialProperties): void => {
        writer.writeInt32((property as CircuitSpecialProperties).circuits.length);
        for (const circuit of (property as CircuitSpecialProperties).circuits) {
            writer.writeInt32(circuit.id);
            ObjectReference.write(writer, circuit.objectReference);
        }
    };
}
