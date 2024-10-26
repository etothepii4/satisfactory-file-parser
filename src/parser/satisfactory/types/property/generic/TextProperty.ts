import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isTextProperty = (property: AbstractBaseProperty | AbstractBaseProperty[]): property is TextProperty => !Array.isArray(property) && property.type === 'TextProperty';

export class TextProperty extends AbstractBaseProperty {

    constructor(public value: TextPropertyValue, ueType: string = 'TextProperty', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'TextProperty', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): TextProperty {
        const guidInfo = GUIDInfo.read(reader);
        const value = TextProperty.ReadValue(reader);
        return new TextProperty(value, ueType, guidInfo, index);
    }

    public static ReadValue(reader: BinaryReadable): TextPropertyValue {
        const prop: TextPropertyValue = {
            flags: reader.readInt32(),
            historyType: reader.readByte()
        };

        switch (prop.historyType) {
            // HISTORYTYPE_BASE
            case 0:
                prop.namespace = reader.readString();
                prop.key = reader.readString();
                prop.value = reader.readString();
                break;
            // HISTORYTYPE_NAMEDFORMAT
            case 1:
            // HISTORYTYPE_ARGUMENTFORMAT
            case 3:
                prop.sourceFmt = TextProperty.ReadValue(reader);

                const argumentsCount = reader.readInt32();
                prop.arguments = [];

                for (let i = 0; i < argumentsCount; i++) {
                    let currentArgumentsData: any = {};
                    currentArgumentsData.name = reader.readString();
                    currentArgumentsData.valueType = reader.readByte();

                    switch (currentArgumentsData.valueType) {
                        case 4:
                            currentArgumentsData.argumentValue = TextProperty.ReadValue(reader);
                            break;
                        default:

                            throw new Error('Unimplemented FormatArgumentType `' + currentArgumentsData.valueType);
                    }

                    prop.arguments.push(currentArgumentsData);
                }
                break;
            // see https://github.com/EpicGames/UnrealEngine/blob/4.25/Engine/Source/Runtime/Core/Private/Internationalization/TextHistory.cpp#L2268
            // HISTORYTYPE_TRANSFORM
            case 10:
                prop.sourceText = TextProperty.ReadValue(reader);
                prop.transformType = reader.readByte();
                break;
            // HISTORYTYPE_NONE
            case 255:
                // See: https://github.com/EpicGames/UnrealEngine/blob/4.25/Engine/Source/Runtime/Core/Private/Internationalization/Text.cpp#L894

                prop.hasCultureInvariantString = reader.readInt32() === 1;

                if (prop.hasCultureInvariantString) {
                    prop.value = reader.readString();
                }
                break;

            default:
                throw new Error('Unimplemented historyType `' + prop.historyType);
        }

        return prop;
    }

    public static CalcOverhead(property: TextProperty): number {
        return 1;
    }

    public static Serialize(writer: ByteWriter, property: TextProperty): void {
        GUIDInfo.write(writer, property.guidInfo);
        TextProperty.SerializeValue(writer, property.value);
    }

    public static SerializeValue(writer: ByteWriter, value: TextPropertyValue): void {
        writer.writeInt32(value.flags);
        writer.writeByte(value.historyType);


        switch (value.historyType) {
            // HISTORYTYPE_BASE
            case 0:
                writer.writeString(value.namespace!);
                writer.writeString(value.key!);
                writer.writeString(value.value!);
                break;
            // HISTORYTYPE_NAMEDFORMAT
            case 1:
            // HISTORYTYPE_ARGUMENTFORMAT
            case 3:
                TextProperty.SerializeValue(writer, value.sourceFmt!);

                writer.writeInt32(value.arguments!.length);

                for (const arg of value.arguments!) {
                    let currentArgumentsData: any = {};
                    writer.writeString(arg.name);
                    writer.writeByte(arg.valueType);

                    switch (arg.valueType) {
                        case 4:
                            TextProperty.SerializeValue(writer, arg.argumentValue!);
                            break;
                        default:

                            throw new Error('Unimplemented FormatArgumentType `' + currentArgumentsData.valueType);
                    }
                }
                break;
            // see https://github.com/EpicGames/UnrealEngine/blob/4.25/Engine/Source/Runtime/Core/Private/Internationalization/TextHistory.cpp#L2268
            // HISTORYTYPE_TRANSFORM
            case 10:
                TextProperty.SerializeValue(writer, value.sourceText!);
                writer.writeByte(value.transformType!);
                break;
            // HISTORYTYPE_NONE
            case 255:
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

    // flag 255, reusing value
    hasCultureInvariantString?: boolean;
};

