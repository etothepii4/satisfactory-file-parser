import { ContextReader } from '../../../context/context-reader';
import { ContextWriter } from '../../../context/context-writer';
import { PropertiesMap } from '../property/generic/AbstractBaseProperty';
import { PropertiesList } from '../property/PropertiesList';
import { FINItemStateFileSystem } from './mods/FicsItNetworks/FINItemStateFileSystem';
import { ObjectReference } from './ObjectReference';


/**
 * generic Dynamic struct. if @param hasValidStruct is true, it also has a @param structReference and @param properties. Else not.
 * @param rawBytes is only filled for the FIN mod so far.
 */
export type FGDynamicStruct = {
    hasValidStruct: boolean;
    structReference?: ObjectReference;
    properties?: PropertiesMap;
    rawBytes?: number[];
};

export namespace FGDynamicStruct {
    export const Parse = (reader: ContextReader): FGDynamicStruct => {

        const struct: FGDynamicStruct = {
            hasValidStruct: reader.readInt32() >= 1
        };

        if (struct.hasValidStruct) {
            struct.structReference = ObjectReference.read(reader);

            if (reader.context.mods.FicsItNetworks !== undefined && FINItemStateFileSystem.IsFINItemStateFileSystem(struct)) {
                struct.rawBytes = FINItemStateFileSystem.read(reader);
            } else {
                const binarySize = reader.readInt32();
                struct.properties = PropertiesList.ParseList(reader);
            }

        }

        return struct;
    }

    export const Serialize = (writer: ContextWriter, struct: FGDynamicStruct): void => {
        writer.writeInt32(struct.hasValidStruct ? 1 : 0);
        if (struct.hasValidStruct) {
            ObjectReference.write(writer, struct.structReference!);

            const before = writer.getBufferPosition();
            writer.writeInt32Zero();
            if (FINItemStateFileSystem.IsFINItemStateFileSystem(struct)) {
                FINItemStateFileSystem.write(writer, struct.rawBytes!);
            } else {
                PropertiesList.SerializeList(writer, struct.properties!);
            }
            writer.writeBinarySizeFromPosition(before, before + 4);
        }
    }
}