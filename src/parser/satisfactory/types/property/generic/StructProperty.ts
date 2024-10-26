import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { CorruptSaveError } from '../../../../error/parser.error';
import { col4 } from '../../structs/col4';
import { DynamicStructPropertyValue } from '../../structs/DynamicStructPropertyValue';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { FICFrameRange } from '../../structs/mods/FicsItCam/FICFrameRange';
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
    unk1: number;
    itemName: string;
    hasItemState: number;
    itemState?: {
        unk: number;
        pathName: string;
        binarySize: number;
        itemStateRaw: number[];
    };
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

export const isStructProperty = (property: AbstractBaseProperty | AbstractBaseProperty[]): property is StructProperty => !Array.isArray(property) && property.type === 'StructProperty';

export class StructProperty extends AbstractBaseProperty {

    public value: GENERIC_STRUCT_PROPERTY_VALUE = { values: {} };

    public unk1?: number;
    public unk2?: number;
    public unk3?: number;
    public unk4?: number;

    constructor(public subtype: string, ueType: string = 'StructProperty', index: number = 0, guidInfo: GUIDInfo = undefined) {
        super({ type: 'StructProperty', ueType, index, guidInfo });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number, size: number): StructProperty {
        const struct = new StructProperty(
            reader.readString(),
            ueType,
            index,
            GUIDInfo.read(reader)
        );

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
        struct.value = StructProperty.ParseValue(reader, struct.subtype, size);
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

    public static ParseValue(reader: BinaryReadable, subtype: string, size: number): GENERIC_STRUCT_PROPERTY_VALUE {

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
                value = (size === 12) ? vec3.ParseF(reader) : vec3.Parse(reader);
                break;

            case 'Quat':
            case 'Vector4':
            case 'Vector4D':
                value = (size === 16) ? vec4.ParseF(reader) : vec4.Parse(reader);
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
                value = reader.readString();
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
                    unk1: reader.readInt32(),
                    itemName: reader.readString(),
                    hasItemState: reader.readInt32(), // this indicates whether more properties follow
                } satisfies InventoryItemStructPropertyValue;

                if (value.hasItemState >= 1) {
                    const stateUnk = reader.readInt32(); // 0
                    const statePathName = reader.readString();
                    const stateBinarySize = reader.readInt32();
                    const itemStateRaw = Array.from(reader.readBytes(stateBinarySize)); // TODO: learn to parse these properties

                    value.itemState = {
                        unk: stateUnk,
                        pathName: statePathName,
                        binarySize: stateBinarySize,
                        itemStateRaw: itemStateRaw
                    };
                }

                // some have a 0 here. Only applies to ported saves from U8 i think.
                const bytesLeft = size - (reader.getBufferPosition() - before);
                if (bytesLeft === 0 || (bytesLeft === 4 && reader.readInt32() === 0)) {
                    // fine
                } else {
                    throw new CorruptSaveError(`save may be corrupt. InventoryItem has weird format that was not seen so far and therefore not implemented. Could be that the save is ported from way before U8.`);
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
                value = DynamicStructPropertyValue.read(reader, 0, subtype);
        }

        return value;
    }

    public static CalcOverhead(property: StructProperty): number {
        return property.subtype.length + 5 + 4 + 4 + 4 + 4 + 1;
    }

    public static Serialize(writer: ByteWriter, property: StructProperty): void {
        writer.writeString(property.subtype);
        GUIDInfo.write(writer, property.guidInfo);

        writer.writeInt32(property.unk1 ?? 0);
        writer.writeInt32(property.unk2 ?? 0);
        writer.writeInt32(property.unk3 ?? 0);
        writer.writeInt32(property.unk4 ?? 0);

        StructProperty.SerializeValue(writer, property.subtype, property.value);
    }

    public static SerializeValue(writer: ByteWriter, subtype: string, value: GENERIC_STRUCT_PROPERTY_VALUE): void {

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
                vec3.Serialize(writer, value);
                break;

            case 'Quat':
            case 'Vector4':
            case 'Vector4D':
                value = value as vec4;
                vec4.Serialize(writer, value as vec4);
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
                value = value as string;
                writer.writeString(value);
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
                writer.writeInt32(value.unk1);
                writer.writeString(value.itemName);
                writer.writeInt32(value.hasItemState);

                if (value.hasItemState >= 1) {
                    writer.writeInt32(value.itemState!.unk);
                    writer.writeString(value.itemState!.pathName);
                    writer.writeInt32(value.itemState!.binarySize);
                    writer.writeBytesArray(value.itemState!.itemStateRaw);
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
                DynamicStructPropertyValue.write(writer, 0, value);
        }
    }
}


