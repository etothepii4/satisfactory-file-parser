import { ContextReader } from '../../../../../context/context-reader';
import { ContextWriter } from '../../../../../context/context-writer';
import { UnimplementedError } from '../../../../../error/parser.error';
import { LBBalancerIndexing } from '../../../structs/binary/LBBalancerIndexing';
import { DynamicStructPropertyValue } from '../../../structs/DynamicStructPropertyValue';
import { ObjectReference } from '../../../structs/ObjectReference';
import { vec3 } from '../../../structs/vec3';
import { AbstractBaseProperty } from '../AbstractBaseProperty';
import { ByteProperty } from '../ByteProperty';
import { EnumProperty } from '../EnumProperty';
import { Int64Property } from '../Int64Property';
import { IntProperty } from '../IntProperty';
import { ObjectProperty } from '../ObjectProperty';
import { StrProperty } from '../StrProperty';
import { GENERIC_STRUCT_PROPERTY_VALUE } from './StructProperty';


export type GENERIC_MAP_KEY_TYPE = number | ObjectReference | boolean | GENERIC_STRUCT_PROPERTY_VALUE | vec3;
export type GENERIC_MAP_VALUE_TYPE = number | ObjectReference | boolean | GENERIC_STRUCT_PROPERTY_VALUE | LBBalancerIndexing;

export const isMapProperty = (property: any): property is MapProperty => property !== null && !Array.isArray(property) && property.propertyTagType?.name === 'MapProperty';

export type MapProperty = AbstractBaseProperty & {
    type: 'MapProperty';
    numElementsToRemove?: number;
    values: [key: GENERIC_MAP_KEY_TYPE, value: GENERIC_MAP_VALUE_TYPE][];
};


export namespace MapProperty {

    export function Parse(reader: ContextReader, property: MapProperty): void {
        const start = reader.getBufferPosition();

        const keyType = property.propertyTagType.children[0].name;
        const valueType = property.propertyTagType.children[1].name;

        property.numElementsToRemove = reader.readInt32();
        if (property.numElementsToRemove > 0) {
            // not observed so far.
            throw new UnimplementedError('MapProperty does not yet support Number of Elements to be removed. Feel free to raise an issue.');
        }

        property.values = [];
        const elementCount = reader.readInt32();
        for (let i = 0; i < elementCount; i++) {
            let key: GENERIC_MAP_KEY_TYPE;
            let value: GENERIC_MAP_VALUE_TYPE;
            switch (keyType) {
                case 'StructProperty':

                    // We dont know the specific structure of some properties alone from the save. We have to observe and hardcode.
                    if (property.name === 'mSaveData' || property.name === 'mUnresolvedSaveData') {
                        key = vec3.ParseInt(reader);
                    } else {
                        key = DynamicStructPropertyValue.read(reader, keyType);
                    }

                    break;
                case 'ObjectProperty':
                    key = ObjectProperty.ReadValue(reader);
                    break;
                case 'StrProperty':
                case 'NameProperty':
                    key = StrProperty.ReadValue(reader);
                    break;
                case 'EnumProperty':
                    key = EnumProperty.ReadValue(reader);
                    break;
                case 'IntProperty':
                    key = IntProperty.ReadValue(reader);
                    break;
                case 'Int64Property':
                    key = Int64Property.ReadValue(reader);
                    break;
                case 'ByteProperty':
                    key = ByteProperty.ReadValue(reader);
                    break;
                default:
                    throw new Error(`not implemented map key type ${keyType}`);
            }

            switch (valueType) {
                case 'StructProperty':

                    // We dont know the specific structure of some properties alone from the save. We have to observe and hardcode.
                    if (property.name === 'mIndexMapping' && reader.context.mods.MLBAlternates !== undefined) {
                        value = LBBalancerIndexing.read(reader);
                    } else if (property.name === 'Senders' && reader.context.mods.FicsItNetworks !== undefined) {
                        value = DynamicStructPropertyValue.read(reader, valueType);
                    } else {
                        value = DynamicStructPropertyValue.read(reader, valueType);
                    }
                    break;
                case 'ObjectProperty':
                    value = ObjectProperty.ReadValue(reader);
                    break;
                case 'StrProperty':
                case 'NameProperty':
                    value = StrProperty.ReadValue(reader);
                    break;
                case 'EnumProperty':
                    value = EnumProperty.ReadValue(reader);
                    break;
                case 'IntProperty':
                    value = IntProperty.ReadValue(reader);
                    break;
                case 'Int64Property':
                    value = Int64Property.ReadValue(reader);
                    break;
                case 'ByteProperty':
                    value = ByteProperty.ReadValue(reader);
                    break;
                default:
                    throw new Error(`not implemented map value type ${valueType}`);
            }

            property.values.push([key, value]);
        }
    }

    export function Serialize(writer: ContextWriter, property: MapProperty): void {

        const keyType = property.propertyTagType.children[0].name;
        const valueType = property.propertyTagType.children[1].name;

        writer.writeInt32(property.numElementsToRemove ?? 0);
        writer.writeInt32(property.values.length);
        for (const entry of property.values) {

            switch (keyType) {
                case 'StructProperty':

                    if (property.name === 'mSaveData' || property.name === 'mUnresolvedSaveData') {
                        vec3.SerializeInt(writer, entry[0] as vec3);
                    } else {
                        DynamicStructPropertyValue.write(writer, entry[0] as DynamicStructPropertyValue);
                    }

                    break;
                case 'ObjectProperty':
                    ObjectProperty.SerializeValue(writer, entry[0] as ObjectReference);
                    break;
                case 'StrProperty':
                case 'NameProperty':
                    StrProperty.SerializeValue(writer, entry[0] as string);
                    break;
                case 'EnumProperty':
                    EnumProperty.SerializeValue(writer, entry[0] as string);
                    break;
                case 'IntProperty':
                    IntProperty.SerializeValue(writer, entry[0] as number);
                    break;
                case 'Int64Property':
                    Int64Property.SerializeValue(writer, entry[0] as string);
                    break;
                case 'ByteProperty':
                    ByteProperty.SerializeValue(writer, entry[0] as number);
                    break;
                default:
                    throw new Error(`not implemented map key type ${valueType}`);
            }

            switch (valueType) {
                case 'StructProperty':

                    if (property.name === 'mIndexMapping' && writer.context.mods.MLBAlternates !== undefined) {
                        LBBalancerIndexing.write(writer, entry[1] as LBBalancerIndexing);
                    } else if (property.name === 'Senders' && writer.context.mods.FicsItNetworks !== undefined) {
                        DynamicStructPropertyValue.write(writer, entry[1] as DynamicStructPropertyValue);
                    } else {
                        DynamicStructPropertyValue.write(writer, entry[1] as DynamicStructPropertyValue);
                    }

                    break;
                case 'ObjectProperty':
                    ObjectProperty.SerializeValue(writer, entry[1] as ObjectReference);
                    break;
                case 'StrProperty':
                case 'NameProperty':
                    StrProperty.SerializeValue(writer, entry[1] as string);
                    break;
                case 'EnumProperty':
                    EnumProperty.SerializeValue(writer, entry[1] as string);
                    break;
                case 'IntProperty':
                    IntProperty.SerializeValue(writer, entry[1] as number);
                    break;
                case 'Int64Property':
                    Int64Property.SerializeValue(writer, entry[1] as string);
                    break;
                case 'ByteProperty':
                    ByteProperty.SerializeValue(writer, entry[1] as number);
                    break;
                default:
                    throw new Error(`not implemented map value type ${valueType}`);
            }
        }
    }
}
