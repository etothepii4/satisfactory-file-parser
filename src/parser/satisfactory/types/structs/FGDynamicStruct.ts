import { ContextReader } from '../../../context/context-reader';
import { ContextWriter } from '../../../context/context-writer';
import { PropertiesMap } from '../property/generic/AbstractBaseProperty';
import { PropertiesList } from '../property/PropertiesList';
import { ObjectReference } from './ObjectReference';


export type FGDynamicStruct = {
    hasValidStruct: boolean;
    structReference?: ObjectReference;
    properties?: PropertiesMap;
}

export namespace FGDynamicStruct {
    export const Parse = (reader: ContextReader): FGDynamicStruct => {
        const hasValidStruct = reader.readInt32() >= 1;
        let structReference;
        let properties;

        if (hasValidStruct) {
            structReference = ObjectReference.read(reader);
            const binarySize = reader.readInt32();
            properties = PropertiesList.ParseList(reader);
        }

        return {
            hasValidStruct,
            structReference,
            properties
        } satisfies FGDynamicStruct;
    }

    export const Serialize = (writer: ContextWriter, struct: FGDynamicStruct): void => {
        writer.writeInt32(struct.hasValidStruct ? 1 : 0);
        if (struct.hasValidStruct) {
            ObjectReference.write(writer, struct.structReference!);
            const before = writer.getBufferPosition();
            writer.writeInt32Zero();
            PropertiesList.SerializeList(writer, struct.properties!);
            writer.writeBinarySizeFromPosition(before, before + 4);
        }
    }
}