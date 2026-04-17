import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { ETextHistoryType } from '../../../../unreal-engine/ETextHistoryType';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isTextProperty = (property: any): property is TextProperty => !Array.isArray(property) && property.propertyTagType.name === 'TextProperty';

export type TextProperty = AbstractBaseProperty & {
    type: 'TextProperty';
    propertyTagType: { name: 'TextProperty', children: FPropertyTagNode[] };
    value: TextPropertyValue;
};

export namespace TextProperty {

    export function Parse(reader: ContextReader, property: TextProperty): void {
        property.value = TextProperty.ReadValue(reader);
    }

    export function ReadValue(reader: ContextReader): TextPropertyValue {
        const prop: TextPropertyValue = {
            flags: reader.readUint32(),
            historyType: reader.readInt8()
        };

        switch (prop.historyType) {
            case ETextHistoryType.Base:
                prop.namespace = reader.readString();
                prop.key = reader.readString();
                prop.value = reader.readString();
                break;

            case ETextHistoryType.NamedFormat:
            case ETextHistoryType.ArgumentFormat:
                prop.sourceFmt = ReadValue(reader);

                const argumentsCount = reader.readInt32();
                prop.arguments = [];

                for (let i = 0; i < argumentsCount; i++) {
                    let currentArgumentsData: any = {};
                    currentArgumentsData.name = reader.readString();
                    currentArgumentsData.valueType = reader.readByte();

                    switch (currentArgumentsData.valueType) {
                        case 4:
                            currentArgumentsData.argumentValue = ReadValue(reader);
                            break;
                        default:

                            throw new Error('Unimplemented FormatArgumentType `' + currentArgumentsData.valueType);
                    }

                    prop.arguments.push(currentArgumentsData);
                }
                break;
            // see https://github.com/EpicGames/UnrealEngine/blob/4.25/Engine/Source/Runtime/Core/Private/Internationalization/TextHistory.cpp#L2268
            case ETextHistoryType.Transform:
                prop.sourceText = ReadValue(reader);
                prop.transformType = reader.readByte();
                break;
            case ETextHistoryType.StringTableEntry:
                prop.tableId = reader.readString();
                prop.textKey = reader.readString();
                break;
            case ETextHistoryType.None:
                // See: https://github.com/EpicGames/UnrealEngine/blob/4.25/Engine/Source/Runtime/Core/Private/Internationalization/Text.cpp#L894

                prop.hasCultureInvariantString = reader.readInt32() === 1;

                if (prop.hasCultureInvariantString) {
                    prop.value = reader.readString();
                }
                break;

            default:
                throw new Error('Unimplemented TextProperty historyType ' + prop.historyType);
        }

        return prop;
    }

    export function Serialize(writer: ContextWriter, property: TextProperty): void {
        SerializeValue(writer, property.value);
    }

    export function SerializeValue(writer: ContextWriter, value: TextPropertyValue): void {
        writer.writeUint32(value.flags);
        writer.writeInt8(value.historyType);


        switch (value.historyType) {
            case ETextHistoryType.Base:
                writer.writeString(value.namespace!);
                writer.writeString(value.key!);
                writer.writeString(value.value!);
                break;

            case ETextHistoryType.NamedFormat:
            case ETextHistoryType.ArgumentFormat:
                SerializeValue(writer, value.sourceFmt!);

                writer.writeInt32(value.arguments!.length);

                for (const arg of value.arguments!) {
                    let currentArgumentsData: any = {};
                    writer.writeString(arg.name);
                    writer.writeByte(arg.valueType);

                    switch (arg.valueType) {
                        case 4:
                            SerializeValue(writer, arg.argumentValue!);
                            break;
                        default:

                            throw new Error('Unimplemented FormatArgumentType `' + currentArgumentsData.valueType);
                    }
                }
                break;
            // see https://github.com/EpicGames/UnrealEngine/blob/4.25/Engine/Source/Runtime/Core/Private/Internationalization/TextHistory.cpp#L2268
            case ETextHistoryType.Transform:
                SerializeValue(writer, value.sourceText!);
                writer.writeByte(value.transformType!);
                break;

            case ETextHistoryType.StringTableEntry:
                writer.writeString(value.tableId!);
                writer.writeString(value.textKey!);
                break;

            case ETextHistoryType.None:
                // See: https://github.com/EpicGames/UnrealEngine/blob/4.25/Engine/Source/Runtime/Core/Private/Internationalization/Text.cpp#L894

                writer.writeInt32(value.hasCultureInvariantString ? 1 : 0);

                if (value.hasCultureInvariantString) {
                    writer.writeString(value.value!);
                }
                break;
            default:
                throw new Error('Unimplemented historyType `' + value.historyType);
        }
    }
}

export type TextPropertyValue = {
    flags: number;
    historyType: number;

    // flag 0
    namespace?: string;
    key?: string;
    value?: string;

    // flag 1 + 3
    sourceFmt?: TextPropertyValue;
    arguments?: { name: string; valueType: number; argumentValue: TextPropertyValue; }[];

    // flag 10
    sourceText?: TextPropertyValue;
    transformType?: number;

    // flag 11
    tableId?: string;
    textKey?: string;

    // flag 255, reusing value
    hasCultureInvariantString?: boolean;
};

