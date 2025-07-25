import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { SaveCustomVersion } from '../../../save/save-custom-version';
import { col4 } from '../../structs/col4';
import { DynamicStructPropertyValue } from '../../structs/DynamicStructPropertyValue';
import { FGDynamicStruct } from '../../structs/FGDynamicStruct';
import { GUID } from '../../structs/GUID';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { FICFrameRange } from '../../structs/mods/FicsItCam/FICFrameRange';
import { ObjectReference } from '../../structs/ObjectReference';
import { vec3 } from '../../structs/vec3';
import { vec4 } from '../../structs/vec4';
import { AbstractBaseProperty } from './AbstractBaseProperty';


export type BasicMultipleStructPropertyValue = {
    values: any;
};

export type BasicStructPropertyValue = {
    value: any;
};

export type BoxStructPropertyValue = {
    min: vec3;
    max: vec3;
    isValid: boolean;
};

export type RailroadTrackPositionStructPropertyValue = {
    root: string;
    instanceName: string;
    offset: number;
    forward: number;
};

export type InventoryItemStructPropertyValue = {
    itemReference: ObjectReference;
    itemState?: FGDynamicStruct;
    legacyItemStateActor?: ObjectReference;
};

export type FICFrameRangeStructPropertyValue = {
    begin: string;
    end: string;
};

export type ClientIdentityInfo = {
    offlineId: string;
    accountIds: Record<number, number[]>;
};

export type GENERIC_STRUCT_PROPERTY_VALUE = BasicMultipleStructPropertyValue | BasicStructPropertyValue | BoxStructPropertyValue | RailroadTrackPositionStructPropertyValue |
    InventoryItemStructPropertyValue | FICFrameRangeStructPropertyValue | ClientIdentityInfo | DynamicStructPropertyValue | col4 | vec3 | vec4 | string;

export const isStructProperty = (property: any): property is StructProperty => !Array.isArray(property) && property.type === 'StructProperty';

export type StructProperty = AbstractBaseProperty & {
    type: 'StructProperty';
    subtype: string;
    value: GENERIC_STRUCT_PROPERTY_VALUE;
    unk1?: number;
    unk2?: number;
    unk3?: number;
    unk4?: number;
};

export namespace StructProperty {

    export const Parse = (reader: ContextReader, ueType: string, index: number, size: number): StructProperty => {
        const subtype = reader.readString();
        const guidInfo = GUIDInfo.read(reader);

        const struct: StructProperty = {
            ...AbstractBaseProperty.Create({ index, ueType, guidInfo, type: '' }),
            type: 'StructProperty',
            value: { values: [] },
            subtype
        };

        const unk1 = reader.readInt32();
        if (unk1 !== 0) {
            struct.unk1 = unk1;
        }

        const unk2 = reader.readInt32();
        if (unk2 !== 0) {
            struct.unk2 = unk2;
        }

        const unk3 = reader.readInt32();
        if (unk3 !== 0) {
            struct.unk3 = unk3;
        }

        const unk4 = reader.readInt32();
        if (unk4 !== 0) {
            struct.unk4 = unk4;
        }

        const before = reader.getBufferPosition();
        struct.value = ParseValue(reader, struct.subtype, size);
        const readBytes = reader.getBufferPosition() - before;
        if (readBytes !== size) {
            if (size - readBytes === 4) {
                // U8, fine
                reader.skipBytes(size - readBytes);
            } else {
                throw new Error(`possibly corrupt. Read ${readBytes} for StructProperty Content of ${struct.subtype}, but ${size} were indicated.`);
            }
        }

        return struct;
    }

    export const ParseValue = (reader: ContextReader, subtype: string, size: number): GENERIC_STRUCT_PROPERTY_VALUE => {

        let value: GENERIC_STRUCT_PROPERTY_VALUE;

        switch (subtype) {
            case 'Color':
                value = col4.ParseBGRA(reader);
                break;

            case 'IntPoint':
                value = reader.readInt64().toString();
                break;

            case 'LinearColor':
                value = col4.ParseRGBA(reader);
                break;

            case 'Vector':
            case 'Rotator':
            case 'Vector2D':
                value = (reader.context.saveVersion >= SaveCustomVersion.UnrealEngine5) ? vec3.Parse(reader) : vec3.ParseF(reader);
                break;

            case 'Quat':
            case 'Vector4':
            case 'Vector4D':
                value = (reader.context.saveVersion >= SaveCustomVersion.UnrealEngine5) ? vec4.Parse(reader) : vec4.ParseF(reader);
                break;

            case 'Box':
                value = ((size === 25) ? {
                    min: vec3.ParseF(reader),
                    max: vec3.ParseF(reader),
                    isValid: reader.readByte() >= 1
                } : {
                    min: vec3.Parse(reader),
                    max: vec3.Parse(reader),
                    isValid: reader.readByte() >= 1
                }) satisfies BoxStructPropertyValue;
                break;

            case 'RailroadTrackPosition':
                value = {
                    root: reader.readString(),
                    instanceName: reader.readString(),
                    offset: reader.readFloat32(),
                    forward: reader.readFloat32()
                };
                break;

            case 'TimerHandle':
                value = reader.readString();
                break;

            case 'Guid':
                value = GUID.read(reader);
                break;

            case 'ClientIdentityInfo':
                const offlineId = reader.readString();
                const numAccountIds = reader.readInt32();

                const accountIds: Record<number, number[]> = {};
                for (let i = 0; i < numAccountIds; i++) {
                    const platformFlagMaybe = reader.readByte();    // 1 for Epic, 6 for steam ? Only seen 1s and 6s so far.
                    const idSize = reader.readInt32();
                    const accountId = Array.from(reader.readBytes(idSize));
                    accountIds[platformFlagMaybe] = accountId;
                }

                value = {
                    offlineId,
                    accountIds
                } satisfies ClientIdentityInfo;
                break;

            case 'InventoryItem':
                const before = reader.getBufferPosition();

                value = {
                    itemReference: ObjectReference.read(reader)
                } satisfies InventoryItemStructPropertyValue;

                // inventory items have potentially an item state. but not before explicit version
                if (reader.context.saveVersion >= SaveCustomVersion.RefactoredInventoryItemState) {
                    value.itemState = FGDynamicStruct.Parse(reader);
                } else {
                    value.legacyItemStateActor = ObjectReference.read(reader);
                }

                break;

            case 'FluidBox':
                value = {
                    value: reader.readFloat32()
                };
                break;

            case 'SlateBrush':
                value = reader.readString();
                break;

            case 'DateTime':
                value = reader.readInt64().toString();
                break;

            // MODS
            case 'FICFrameRange': // https://github.com/Panakotta00/FicsIt-Cam/blob/master/Source/FicsItCam/Public/Data/FICTypes.h#35
                value = FICFrameRange.Parse(reader);
                break;

            default:
                //TODO: use buildversion
                value = DynamicStructPropertyValue.read(reader, subtype);
        }

        return value;
    }

    export const CalcOverhead = (property: StructProperty): number => {
        return property.subtype.length + 5 + 4 + 4 + 4 + 4 + 1;
    }

    export const Serialize = (writer: ContextWriter, property: StructProperty): void => {
        writer.writeString(property.subtype);
        GUIDInfo.write(writer, property.guidInfo);

        writer.writeInt32(property.unk1 ?? 0);
        writer.writeInt32(property.unk2 ?? 0);
        writer.writeInt32(property.unk3 ?? 0);
        writer.writeInt32(property.unk4 ?? 0);

        StructProperty.SerializeValue(writer, property.subtype, property.value);
    }

    export const SerializeValue = (writer: ContextWriter, subtype: string, value: GENERIC_STRUCT_PROPERTY_VALUE): void => {

        switch (subtype) {
            case 'Color':
                value = value as col4;
                col4.SerializeBGRA(writer, value);
                break;

            case 'IntPoint':
                writer.writeInt64(BigInt(value as string))
                break;

            case 'LinearColor':
                value = value as col4;
                col4.SerializeRGBA(writer, value);
                break;

            case 'Vector':
            case 'Rotator':
            case 'Vector2D':
                value = value as vec3;
                if (writer.context.saveVersion >= SaveCustomVersion.UnrealEngine5) {
                    vec3.Serialize(writer, value);
                } else {
                    vec3.SerializeF(writer, value);
                }
                break;

            case 'Quat':
            case 'Vector4':
            case 'Vector4D':
                value = value as vec4;
                if (writer.context.saveVersion >= SaveCustomVersion.UnrealEngine5) {
                    vec4.Serialize(writer, value as vec4);
                } else {
                    vec4.SerializeF(writer, value as vec4);
                }
                break;

            case 'Box':
                value = value as BoxStructPropertyValue;
                vec3.Serialize(writer, value.min);
                vec3.Serialize(writer, value.max);
                writer.writeByte(value.isValid ? 1 : 0);
                break;

            case 'RailroadTrackPosition':
                value = value as RailroadTrackPositionStructPropertyValue;
                writer.writeString(value.root);
                writer.writeString(value.instanceName);
                writer.writeFloat32(value.offset);
                writer.writeFloat32(value.forward);
                break;

            case 'TimerHandle':
                value = value as string;
                writer.writeString(value);
                break;

            case 'Guid':
                GUID.write(writer, value as GUID);
                break;

            case 'ClientIdentityInfo':
                value = value as ClientIdentityInfo;
                writer.writeString(value.offlineId);
                writer.writeInt32(Object.values(value.accountIds).length);
                for (const [platformFlagMaybe, accountId] of Object.entries(value.accountIds)) {
                    writer.writeByte(Number(platformFlagMaybe));
                    writer.writeInt32(accountId.length);
                    writer.writeBytesArray(accountId);
                }

                break;

            case 'InventoryItem':
                value = value as InventoryItemStructPropertyValue;
                ObjectReference.write(writer, value.itemReference);

                if (writer.context.saveVersion >= SaveCustomVersion.RefactoredInventoryItemState) {
                    FGDynamicStruct.Serialize(writer, value.itemState!);
                } else {
                    ObjectReference.write(writer, value.legacyItemStateActor!);
                }
                break;

            case 'FluidBox':
                value = value as BasicStructPropertyValue;
                writer.writeFloat32(value.value);
                break;

            case 'SlateBrush':
                value = value as string;
                writer.writeString(value);
                break;

            case 'DateTime':
                value = value as string;
                writer.writeInt64(BigInt(value));
                break;

            // MODS
            case 'FICFrameRange': // https://github.com/Panakotta00/FicsIt-Cam/blob/master/Source/FicsItCam/Public/Data/FICTypes.h#35
                value = value as FICFrameRange;
                FICFrameRange.Serialize(writer, value);
                break;

            default:
                //TODO: use buildversion
                value = value as DynamicStructPropertyValue;
                DynamicStructPropertyValue.write(writer, value);
        }
    }
}


