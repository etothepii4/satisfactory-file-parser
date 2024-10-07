import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUID } from '../../structs/GUID';
import { ObjectReference } from '../../structs/ObjectReference';
import { vec3 } from '../../structs/vec3';
import { BasicProperty } from './BasicProperty';
import { Int32Property } from './Int32Property';
import { ObjectProperty } from './ObjectProperty';
import { StrProperty } from './StrProperty';
import { Uint32Property } from './Uint32Property';

export const isSetProperty = (property: BasicProperty): property is SetProperty<any> => property.type === 'SetProperty';

export class SetProperty<T> extends BasicProperty {

    constructor(public subtype: string, public values: T[], ueType: string, index: number) {
        super({ type: 'SetProperty', ueType, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number, propertyName: string): SetProperty<any> {

        const subtype = reader.readString();


        const unk2 = reader.skipBytes(1); // 0
        const unk3 = reader.skipBytes(4); // 0
        const elementCount = reader.readInt32();

        let property: SetProperty<any>;
        switch (subtype) {

            case "UInt32Property":
                property = new SetProperty<number>(subtype, new Array(elementCount).fill(0).map(() => Uint32Property.ReadValue(reader)), ueType, index);
                break;

            case "IntProperty":
                property = new SetProperty<number>(subtype, new Array(elementCount).fill(0).map(() => Int32Property.ReadValue(reader)), ueType, index);
                break;

            case "ObjectProperty":
                property = new SetProperty<ObjectReference>(subtype, new Array(elementCount).fill(0).map(() => ObjectProperty.ReadValue(reader)), ueType, index);
                break;

            case "NameProperty":
                property = new SetProperty<string>(subtype, new Array(elementCount).fill(0).map(() => StrProperty.ReadValue(reader)), ueType, index);
                break;

            case "StructProperty":
                // outdated i guess

                if (propertyName === 'mRemovalLocations') {
                    property = new SetProperty<vec3>(subtype, new Array(elementCount).fill(0).map(() => vec3.ParseF(reader)), ueType, index);
                }

                if (propertyName === 'mDestroyedPickups' || propertyName === 'mLootedDropPods') {
                    property = new SetProperty<GUID>(subtype, new Array(elementCount).fill(0).map(() => GUID.read(reader)), ueType, index);
                } else {
                    throw new Error(`Not Implemented SetProperty of StructProperty for property ${propertyName}.`);
                }
                break;

            default:
                throw new Error(`Not Implemented SetProperty of ${subtype}.`);
        }

        return property!;
    }

    public static CalcOverhead(property: SetProperty<any>): number {
        return property.subtype.length + 5 + 1;
    }

    public static Serialize(writer: ByteWriter, property: SetProperty<any>): void {
        writer.writeString(property.subtype);

        //TODO: what is that
        writer.writeByte(0);
        writer.writeInt32(0);

        writer.writeInt32(property.values.length);

        switch (property.subtype) {

            case "IntProperty":
            case "Int32Property":
                property.values.forEach(v => Int32Property.SerializeValue(writer, v));
                break;

            case "UIntProperty":
            case "UInt32Property":
                property.values.forEach(v => Uint32Property.SerializeValue(writer, v));
                break;

            case "ObjectProperty":
                property.values.forEach(v => ObjectProperty.SerializeValue(writer, v));
                break;

            case "NameProperty":
                property.values.forEach(v => StrProperty.SerializeValue(writer, v));
                break;

            case "StructProperty":
                // outdated i guess
                if (property.name === 'mRemovalLocations') {
                    console.warn('serializing mRemovalLocations, this is still under investigation.');
                    property.values.forEach(v => vec3.SerializeF(writer, v));
                } else if (property.name === 'mDestroyedPickups' || property.name === 'mLootedDropPods') {
                    property.values.forEach(v => GUID.write(writer, v));
                } else {
                    throw new Error(`Not Implemented serializing SetProperty of StructProperty for property ${property.name}.`);
                }
                break;


            default:
                throw new Error(`Not Implemented SetProperty of ${property.subtype}.`);
        }
    }
}
