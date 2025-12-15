import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { GUIDInfo } from '../../../structs/GUIDInfo';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { StructProperty } from '../StructProperty';

export const isStructArrayProperty = (property: any): property is StructArrayProperty => !Array.isArray(property) && property.type === 'StructArrayProperty';

export type StructArrayProperty = AbstractBaseProperty & {
    type: 'StructArrayProperty';
    subtype: string;
    values: StructProperty[];
    structValueFields: ArrayPropertyStructValueFields;
};

export namespace StructArrayProperty {

    export const Parse = (reader: ContextReader, elementCount: number, subtype: string, ueType: string, index: number = 0): StructArrayProperty => {

        const name = reader.readString(); // Same as currentProperty.name
        const allUEType = reader.readString(); // StructProperty

        const binarySize = reader.readInt32(); // structureSize
        const allIndex = reader.readInt32(); // Since ArrayProperty itself has an index already, this was never observed to be anything else than 0.

        const allStructType = reader.readString();
        const allGuid = GUIDInfo.read(reader);

        const allUnk1 = reader.readInt32();
        const allUnk2 = reader.readInt32();
        const allUnk3 = reader.readInt32();
        const allUnk4 = reader.readInt32();

        const structValueFields: ArrayPropertyStructValueFields = { allStructType, allIndex: allIndex > 0 ? allIndex : undefined, allGuid };
        if (allUnk1 !== 0) {
            structValueFields.allUnk1 = allUnk1;
        }
        if (allUnk2 !== 0) {
            structValueFields.allUnk2 = allUnk2;
        }
        if (allUnk3 !== 0) {
            structValueFields.allUnk3 = allUnk3;
        }
        if (allUnk4 !== 0) {
            structValueFields.allUnk4 = allUnk4;
        }


        const before = reader.getBufferPosition();
        const values = new Array(elementCount).fill(0).map(() => {

            const struct: StructProperty = {
                ...AbstractBaseProperty.Create({ index: allIndex, ueType: allUEType, guidInfo: allGuid, type: '' }),
                type: 'StructProperty',
                subtype: allStructType,
                value: { values: [] }
            };

            // we do NOT assign individual unk's here. Since they are only serialized always on ArrayProperty's Level once for all elements.
            struct.value = StructProperty.ParseValue(reader, allStructType, binarySize);
            return struct;
        });
        const readBytes = reader.getBufferPosition() - before;
        if (readBytes !== binarySize) {
            throw new Error(`possibly corrupt in array of struct. read ${readBytes} bytes but ${binarySize} were indicated. ${elementCount} elements of struct subtype ${allStructType}.`);
        }

        return {
            ...AbstractBaseProperty.Create({ index, ueType, type: '' }),
            type: 'StructArrayProperty',
            structValueFields,
            subtype,
            values
        } satisfies StructArrayProperty;
    }

    export const Serialize = (writer: ContextWriter, property: StructArrayProperty): void => {
        writer.writeString(property.name);
        writer.writeString(property.subtype);

        const lenIndicator = writer.getBufferPosition();
        writer.writeInt32(0);
        writer.writeInt32(property.structValueFields!.allIndex ?? 0);

        writer.writeString(property.structValueFields!.allStructType);
        GUIDInfo.write(writer, property.structValueFields!.allGuid)

        writer.writeInt32(property.structValueFields!.allUnk1 ?? 0);
        writer.writeInt32(property.structValueFields!.allUnk2 ?? 0);
        writer.writeInt32(property.structValueFields!.allUnk3 ?? 0);
        writer.writeInt32(property.structValueFields!.allUnk4 ?? 0);

        const before = writer.getBufferPosition();
        property.values.forEach(v => StructProperty.SerializeValue(writer, property.structValueFields!.allStructType, v.value));
        writer.writeBinarySizeFromPosition(lenIndicator, before);
    }
}

export type ArrayPropertyStructValueFields = {
    allStructType: string;
    allIndex?: number;
    allGuid: GUIDInfo;
    allUnk1?: number;
    allUnk2?: number;
    allUnk3?: number;
    allUnk4?: number;
};
