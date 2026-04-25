import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { SaveCustomVersion } from '../../../../save/save-custom-version';
import { FClientIdentityInfo } from '../../../structs/binary/FClientIdentityInfo';
import { FColor } from '../../../structs/binary/FColor';
import { FInventoryItem } from '../../../structs/binary/FInventoryItem';
import { FLinearColor } from '../../../structs/binary/FLinearColor';
import { FPlayerInfoHandle } from '../../../structs/binary/FPlayerInfoHandle';
import { FPropertyTag } from '../../../structs/binary/FPropertyTag';
import { FPropertyTagNode } from '../../../structs/binary/FPropertyTagNode';
import { FUniqueNetIdRepl } from '../../../structs/binary/FUniqueNetIdRepl';
import { GUID } from '../../../structs/binary/GUID';
import { col4 } from '../../../structs/col4';
import { DynamicStructPropertyValue } from '../../../structs/DynamicStructPropertyValue';
import { FICFrameRange } from '../../../structs/mods/FicsItCam/FICFrameRange';
import { FINGPUT1BufferPixel } from '../../../structs/mods/FicsItNetworks/FINGPUT1BufferPixel';
import { FINLuaRuntimePersistenceState } from '../../../structs/mods/FicsItNetworks/FINLuaRuntimePersistenceState';
import { FINNetworkTrace } from '../../../structs/mods/FicsItNetworks/FINNetworkTrace';
import { FLBBalancerIndexing } from '../../../structs/mods/ModularLoadBalancers/FLBBalancerIndexing';
import { vec2 } from '../../../structs/vec2';
import { vec3 } from '../../../structs/vec3';
import { vec4 } from '../../../structs/vec4';
import { AbstractBaseProperty } from '../AbstractBaseProperty';


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

export type FICFrameRangeStructPropertyValue = {
    begin: string;
    end: string;
};

export type GENERIC_STRUCT_PROPERTY_VALUE = BasicMultipleStructPropertyValue | BasicStructPropertyValue | BoxStructPropertyValue | RailroadTrackPositionStructPropertyValue |
    FInventoryItem | FICFrameRangeStructPropertyValue | FClientIdentityInfo | DynamicStructPropertyValue | col4 | vec2 | vec3 | vec4 | string |
    FINNetworkTrace | FINGPUT1BufferPixel | FLBBalancerIndexing | FINLuaRuntimePersistenceState | FUniqueNetIdRepl | FPlayerInfoHandle;

export const isStructProperty = (property: any): property is StructProperty => !Array.isArray(property) && property.propertyTagType.name === 'StructProperty';

export type StructProperty = AbstractBaseProperty & {
    type: 'StructProperty';
    value: GENERIC_STRUCT_PROPERTY_VALUE;
};

export namespace StructProperty {

    export function Parse(reader: ContextReader, property: StructProperty, tag: FPropertyTag): void {

        const before = reader.getBufferPosition();
        property.value = ParseValue(reader, property.propertyTagType.children[0], tag.binarySize);
        const readBytes = reader.getBufferPosition() - before;
        if (readBytes !== tag.binarySize) {
            if (tag.binarySize - readBytes === 4) {
                // U8, fine - honestly i am not sure whether this is even still relevant. with some bug fixes this most likely has been fixed.
                reader.skipBytes(tag.binarySize - readBytes);
            } else {
                throw new Error(`possibly corrupt. Read ${readBytes} for structproperty of ${JSON.stringify(property.propertyTagType.children[0].name)}, but ${tag.binarySize} were indicated.`);
            }
        }
    }

    export function ParseValue(reader: ContextReader, propertyTagType: FPropertyTagNode, size: number): GENERIC_STRUCT_PROPERTY_VALUE {

        let value: GENERIC_STRUCT_PROPERTY_VALUE;

        switch (propertyTagType.name) {
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
                value = (reader.context.saveVersion.object >= SaveCustomVersion.SwitchTo64BitSaveArchive) ? vec2.Parse(reader) : vec2.ParseF(reader);
                break;

            case 'Vector':
            case 'Rotator':
                value = (reader.context.saveVersion.object >= SaveCustomVersion.SwitchTo64BitSaveArchive) ? vec3.Parse(reader) : vec3.ParseF(reader);
                break;

            case 'Quat':
            case 'Vector4':
            case 'Vector4D':
                value = (reader.context.saveVersion.object >= SaveCustomVersion.SwitchTo64BitSaveArchive) ? vec4.Parse(reader) : vec4.ParseF(reader);
                break;

            case 'Box':
                value = ((reader.context.saveVersion.object >= SaveCustomVersion.SwitchTo64BitSaveArchive) ? {
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
                value = FInventoryItem.read(reader);
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

            case 'UniqueNetIdRepl':
                value = FUniqueNetIdRepl.read(reader, size);
                break;

            case 'PlayerInfoHandle':
                value = FPlayerInfoHandle.read(reader);
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

            case 'FINLuaProcessorStateStorage':
            case 'FINLuaRuntimePersistenceState':
                value = FINLuaRuntimePersistenceState.read(reader, size);
                break;

            default:
                value = DynamicStructPropertyValue.read(reader, propertyTagType.name);
                break;
        }

        return value;
    }

    export function Serialize(writer: ContextWriter, property: StructProperty): void {
        StructProperty.SerializeValue(writer, property.propertyTagType.children[0].name, property.value);
    }

    export function SerializeValue(writer: ContextWriter, subtype: string, value: GENERIC_STRUCT_PROPERTY_VALUE): void {

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
                if (writer.context.saveVersion.object >= SaveCustomVersion.SwitchTo64BitSaveArchive) {
                    vec2.Serialize(writer, value);
                } else {
                    vec2.SerializeF(writer, value);
                }
                break;

            case 'Vector':
            case 'Rotator':
                value = value as vec3;
                if (writer.context.saveVersion.object >= SaveCustomVersion.SwitchTo64BitSaveArchive) {
                    vec3.Serialize(writer, value as vec3);
                } else {
                    vec3.SerializeF(writer, value as vec3);
                }
                break;

            case 'Quat':
            case 'Vector4':
            case 'Vector4D':
                value = value as vec4;
                if (writer.context.saveVersion.object >= SaveCustomVersion.SwitchTo64BitSaveArchive) {
                    vec4.Serialize(writer, value as vec4);
                } else {
                    vec4.SerializeF(writer, value as vec4);
                }
                break;

            case 'Box':
                value = value as BoxStructPropertyValue;
                if (writer.context.saveVersion.object >= SaveCustomVersion.SwitchTo64BitSaveArchive) {
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
                FInventoryItem.write(writer, value as FInventoryItem);
                break;

            case 'FluidBox':
                value = value as BasicStructPropertyValue;
                writer.writeFloat32(value.value);
                break;

            case 'SlateBrush':
                writer.writeString(value as string);
                break;

            case 'DateTime':
                value = value as string;
                writer.writeInt64(BigInt(value));
                break;

            case 'UniqueNetIdRepl':
                FUniqueNetIdRepl.write(writer, value as FUniqueNetIdRepl);
                break;

            case 'PlayerInfoHandle':
                FPlayerInfoHandle.write(writer, value as FPlayerInfoHandle);
                break;

            // MODS
            case 'FICFrameRange':
                FICFrameRange.write(writer, value as FICFrameRange);
                break;

            // MLB mod
            case 'LBBalancerIndexing':
                FLBBalancerIndexing.write(writer, value as FLBBalancerIndexing);
                break;

            // FicsItNetworks mod
            case 'FINNetworkTrace':
            case 'FIRTrace':
                FINNetworkTrace.write(writer, value as FINNetworkTrace);
                break;

            case 'FINGPUT1BufferPixel':
                FINGPUT1BufferPixel.write(writer, value as FINGPUT1BufferPixel);
                break;

            case 'FINLuaProcessorStateStorage':
            case 'FINLuaRuntimePersistenceState':
                FINLuaRuntimePersistenceState.write(writer, value as FINLuaRuntimePersistenceState);
                break;

            default:
                DynamicStructPropertyValue.write(writer, value as DynamicStructPropertyValue);
                break;
        }
    }
}


