import { ContextReader } from "../../../../context/context-reader";
import { ContextWriter } from "../../../../context/context-writer";
import { EUnrealEngineObjectUE5Version } from "../../../../unreal-engine/EUnrealEngineObjectUE5Version";
import { SaveCustomVersion } from "../../../save/save-custom-version";
import { AbstractBaseProperty } from "../../property/generic/AbstractBaseProperty";
import { BoolProperty } from "../../property/generic/BoolProperty";
import { ByteProperty } from "../../property/generic/ByteProperty";
import { EnumProperty } from "../../property/generic/EnumProperty";
import { OptionalGUID } from "../GUIDInfo";
import { FPropertyTagNode } from "./FPropertyTagNode";
import { GUID } from "./GUID";

/**
 * @propertyTagType with its nested structure describes the whole type + subtype.
 */
export type FPropertyTag = {
    propertyName: string;
    binarySize: number;
    index?: number;
    flags?: number;
    propertyGuid?: GUID;

    propertyTagType: FPropertyTagNode;

    propertyType?: string;
    subtype?: string;

    structGuid?: GUID;
    boolValue?: boolean;
    mapKeyType?: string;
    mapValueType?: string;
    byteValueEnumName?: string;
    enumValueEnumName?: string;
};

export namespace FPropertyTag {

    export function IsCompletePropertyTagType(readerOrWriter: ContextReader | ContextWriter) {
        return readerOrWriter.context.saveVersion.object >= SaveCustomVersion.SerializeDataPackageVersionAndCustomVersions
            && readerOrWriter.context.packageFileVersionUE5.object >= EUnrealEngineObjectUE5Version.PROPERTY_TAG_COMPLETE_TYPE_NAME;
    }

    /**
     * in order to keep the parsed properties and their values simple, we will merge fields from tag into property.
     */
    export function read(reader: ContextReader): FPropertyTag {

        const tag: FPropertyTag = {
            propertyName: reader.readString(),
            binarySize: 0,
            propertyTagType: { name: '', children: [] }
        };

        if (tag.propertyName === 'None') {
            return tag;
        }

        if (IsCompletePropertyTagType(reader)) {

            tag.propertyTagType = FPropertyTagNode.read(reader);
            tag.binarySize = reader.readInt32();
            tag.flags = reader.readUint8();
            if (tag.flags & 0x1) {
                tag.index = reader.readInt32();
            }
            if (tag.flags & 0x2) {
                tag.propertyGuid = GUID.read(reader);
            }

        } else {
            tag.propertyType = reader.readString();
            tag.binarySize = reader.readInt32();
            tag.index = reader.readInt32();

            if (tag.propertyType === 'ArrayProperty') {
                tag.subtype = reader.readString();
            } else if (tag.propertyType === 'StructProperty') {
                tag.subtype = reader.readString();
                tag.structGuid = GUID.read(reader);
            } else if (tag.propertyType === 'SetProperty') {
                tag.subtype = reader.readString();
            } else if (tag.propertyType === 'BoolProperty') {
                tag.boolValue = reader.readInt8() > 0;
            } else if (tag.propertyType === 'ByteProperty') {
                tag.byteValueEnumName = reader.readString();
            } else if (tag.propertyType === 'EnumProperty') {
                tag.enumValueEnumName = reader.readString();
            } else if (tag.propertyType === 'MapProperty') {
                tag.mapKeyType = reader.readString();
                tag.mapValueType = reader.readString();
            }
            tag.propertyGuid = OptionalGUID.read(reader);

            // we construct our artificial property tag type. so that we can handle tags the same way across versions
            // Here we deviate from the structure of the official FPropertyTag
            tag.propertyTagType = {
                name: tag.propertyType,
                children: []
            };
            if (tag.subtype !== undefined) {
                tag.propertyTagType.children.push(
                    {
                        name: tag.subtype,
                        children: []
                    }
                );
            } else if (tag.mapKeyType !== undefined && tag.mapValueType !== undefined) {
                tag.propertyTagType.children.push(
                    {
                        name: tag.mapKeyType,
                        children: []
                    },
                    {
                        name: tag.mapValueType,
                        children: []
                    }
                );
            }
        }

        return tag;
    }

    export function write(writer: ContextWriter, tag: FPropertyTag): void {
        writer.writeString(tag.propertyName);

        if (IsCompletePropertyTagType(writer)) {

            FPropertyTagNode.write(writer, tag.propertyTagType!);
            writer.writeInt32(tag.binarySize);
            writer.writeUint8(tag.flags ?? 0);
            if (tag.flags! & 0x1) {
                writer.writeInt32(tag.index!);
            }
            if (tag.flags! & 0x2) {
                GUID.write(writer, tag.propertyGuid!);
            }

        } else {
            writer.writeString(tag.propertyType!);
            writer.writeInt32(tag.binarySize);
            writer.writeInt32(tag.index ?? 0);

            if (tag.propertyType === 'ArrayProperty') {
                writer.writeString(tag.subtype!);
            } else if (tag.propertyType === 'StructProperty') {
                writer.writeString(tag.subtype!);
                GUID.write(writer, tag.structGuid!);
            } else if (tag.propertyType === 'SetProperty') {
                writer.writeString(tag.subtype!);
            } else if (tag.propertyType === 'BoolProperty') {
                writer.writeInt8(tag.boolValue ? 1 : 0);
            } else if (tag.propertyType === 'ByteProperty') {
                writer.writeString(tag.byteValueEnumName!);
            } else if (tag.propertyType === 'EnumProperty') {
                writer.writeString(tag.enumValueEnumName!)
            } else if (tag.propertyType === 'MapProperty') {
                writer.writeString(tag.mapKeyType!);
                writer.writeString(tag.mapValueType!);
            }
            OptionalGUID.write(writer, tag.propertyGuid);
        }
    }

    /**
     * since we merge tag & property when reading, we need to separate them here.
     */
    export function writeFromProperty(writer: ContextWriter, property: AbstractBaseProperty): { binarySizeLocation: number } {
        writer.writeString(property.name);
        let binarySizeLocation = writer.getBufferPosition();

        if (IsCompletePropertyTagType(writer)) {

            FPropertyTagNode.write(writer, property.propertyTagType!);
            binarySizeLocation = writer.getBufferPosition();
            writer.writeInt32(0);
            writer.writeUint8(property.flags ?? 0);
            if (property.flags! & 0x1) {
                writer.writeInt32(property.index!);
            }
            if (property.flags! & 0x2) {
                GUID.write(writer, property.propertyGuid!);
            }

        } else {
            writer.writeString(property.propertyTagType.name);
            binarySizeLocation = writer.getBufferPosition();
            writer.writeInt32(0);
            writer.writeInt32(property.index ?? 0);

            if (property.propertyTagType.name === 'ArrayProperty') {
                writer.writeString(property.propertyTagType.children[0].name);
            } else if (property.propertyTagType.name === 'StructProperty') {
                writer.writeString(property.propertyTagType.children[0].name);
                GUID.write(writer, property.structGuid ?? [0, 0, 0, 0]);
            } else if (property.propertyTagType.name === 'SetProperty') {
                writer.writeString(property.propertyTagType.children[0].name);
            } else if (property.propertyTagType.name === 'BoolProperty') {
                writer.writeInt8((property as BoolProperty).value ? 1 : 0);
            } else if (property.propertyTagType.name === 'ByteProperty') {
                writer.writeString((property as ByteProperty).value.type!);
            } else if (property.propertyTagType.name === 'EnumProperty') {
                writer.writeString((property as EnumProperty).value.name)
            } else if (property.propertyTagType.name === 'MapProperty') {
                writer.writeString(property.propertyTagType.children[0].name);
                writer.writeString(property.propertyTagType.children[1].name);
            }
            OptionalGUID.write(writer, property.propertyGuid);
        }

        return {
            binarySizeLocation
        };
    }
}