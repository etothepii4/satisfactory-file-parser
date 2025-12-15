import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { SaveCustomVersion } from '../../../save/save-custom-version';
import { FClientIdentityInfo } from '../../structs/binary/FClientIdentityInfo';
import { FColor } from '../../structs/binary/FColor';
import { FLinearColor } from '../../structs/binary/FLinearColor';
import { GUID } from '../../structs/binary/GUID';
import { col4 } from '../../structs/col4';
import { DynamicStructPropertyValue } from '../../structs/DynamicStructPropertyValue';
import { FGDynamicStruct } from '../../structs/FGDynamicStruct';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { FICFrameRange } from '../../structs/mods/FicsItCam/FICFrameRange';
import { FINGPUT1BufferPixel } from '../../structs/mods/FicsItNetworks/FINGPUT1BufferPixel';
import { FINNetworkTrace } from '../../structs/mods/FicsItNetworks/FINNetworkTrace';
import { FLBBalancerIndexing } from '../../structs/mods/ModularLoadBalancers/FLBBalancerIndexing';
import { ObjectReference } from '../../structs/ObjectReference';
import { vec2 } from '../../structs/vec2';
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

export type GENERIC_STRUCT_PROPERTY_VALUE = BasicMultipleStructPropertyValue | BasicStructPropertyValue | BoxStructPropertyValue | RailroadTrackPositionStructPropertyValue |
    InventoryItemStructPropertyValue | FICFrameRangeStructPropertyValue | FClientIdentityInfo | DynamicStructPropertyValue | col4 | vec2 | vec3 | vec4 | string |
    FINNetworkTrace | FINGPUT1BufferPixel | FLBBalancerIndexing;

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

    export const Parse = (reader: ContextReader, ueType: string, index: number, size: number, subtype: string): StructProperty => {

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
                value = FColor.read(reader);
                break;

            case 'IntPoint':
                value = reader.readInt64().toString();
                break;

            case 'LinearColor':
                value = FLinearColor.read(reader);
                break;

            case 'Vector2D':
                value = (reader.context.saveVersion >= SaveCustomVersion.SwitchTo64BitSaveArchive) ? vec2.Parse(reader) : vec2.ParseF(reader);
                break;

            case 'Vector':
            case 'Rotator':
                value = (reader.context.saveVersion >= SaveCustomVersion.SwitchTo64BitSaveArchive) ? vec3.Parse(reader) : vec3.ParseF(reader);
                break;

            case 'Quat':
            case 'Vector4':
            case 'Vector4D':
                value = (reader.context.saveVersion >= SaveCustomVersion.SwitchTo64BitSaveArchive) ? vec4.Parse(reader) : vec4.ParseF(reader);
                break;

            case 'Box':
                value = ((reader.context.saveVersion >= SaveCustomVersion.SwitchTo64BitSaveArchive) ? {
                    min: vec3.Parse(reader),
                    max: vec3.Parse(reader),
                    isValid: reader.readByte() >= 1
                } : {
                    min: vec3.ParseF(reader),
                    max: vec3.ParseF(reader),
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
                value = FClientIdentityInfo.read(reader);
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

            // FixsitCamera mod
            case 'FICFrameRange':
                value = FICFrameRange.read(reader);
                break;

            // MLB mod
            case 'LBBalancerIndexing':
                value = FLBBalancerIndexing.read(reader);
                break;

            // FicsIt-Networks mod
            case 'FINNetworkTrace':
            case 'FIRTrace':
                value = FINNetworkTrace.read(reader);
                break;

            case 'FINGPUT1BufferPixel':
                value = FINGPUT1BufferPixel.read(reader);
                break;

            default:
                //TODO: use buildversion
                value = DynamicStructPropertyValue.read(reader, subtype);
                break;
        }

        return value;
    }

    export const CalcOverhead = (property: StructProperty, subtype: string): number => {
        return subtype.length + 5 + 4 + 4 + 4 + 4 + 1;
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
                FColor.write(writer, value as FColor);
                break;

            case 'IntPoint':
                writer.writeInt64(BigInt(value as string))
                break;

            case 'LinearColor':
                FLinearColor.write(writer, value as FLinearColor);
                break;

            case 'Vector2D':
                value = value as vec2;
                if (writer.context.saveVersion >= SaveCustomVersion.SwitchTo64BitSaveArchive) {
                    vec2.Serialize(writer, value);
                } else {
                    vec2.SerializeF(writer, value);
                }
                break;

            case 'Vector':
            case 'Rotator':
                value = value as vec3;
                if (writer.context.saveVersion >= SaveCustomVersion.SwitchTo64BitSaveArchive) {
                    vec3.Serialize(writer, value as vec3);
                } else {
                    vec3.SerializeF(writer, value as vec3);
                }
                break;

            case 'Quat':
            case 'Vector4':
            case 'Vector4D':
                value = value as vec4;
                if (writer.context.saveVersion >= SaveCustomVersion.SwitchTo64BitSaveArchive) {
                    vec4.Serialize(writer, value as vec4);
                } else {
                    vec4.SerializeF(writer, value as vec4);
                }
                break;

            case 'Box':
                value = value as BoxStructPropertyValue;
                if (writer.context.saveVersion >= SaveCustomVersion.SwitchTo64BitSaveArchive) {
                    vec3.Serialize(writer, value.min);
                    vec3.Serialize(writer, value.max);
                } else {
                    vec3.SerializeF(writer, value.min);
                    vec3.SerializeF(writer, value.max);
                }
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
                FClientIdentityInfo.write(writer, value as FClientIdentityInfo);
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
            case 'FICFrameRange':
                value = value as FICFrameRange;
                FICFrameRange.write(writer, value);
                break;

            // MLB mod
            case 'LBBalancerIndexing':
                FLBBalancerIndexing.write(writer, value as FLBBalancerIndexing);
                break;

            // FicsItNetworks mod
            case 'FINNetworkTrace':
            case 'FIRTrace':
                value = value as FINNetworkTrace;
                FINNetworkTrace.write(writer, value);
                break;

            case 'FINGPUT1BufferPixel':
                value = value as FINGPUT1BufferPixel;
                FINGPUT1BufferPixel.write(writer, value);
                break;

            default:
                //TODO: use buildversion
                value = value as DynamicStructPropertyValue;
                DynamicStructPropertyValue.write(writer, value);
                break;
        }
    }
}


