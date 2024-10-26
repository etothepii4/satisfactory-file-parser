import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { ObjectReference } from '../../structs/ObjectReference';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isObjectProperty = (property: AbstractBaseProperty | AbstractBaseProperty[]): property is ObjectProperty => !Array.isArray(property) && property.type === 'ObjectProperty';

export class ObjectProperty extends AbstractBaseProperty {

    constructor(public value: ObjectReference, ueType: string = 'ObjectProperty', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'ObjectProperty', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): ObjectProperty {
        const guidInfo = GUIDInfo.read(reader);
        const value = ObjectProperty.ReadValue(reader);
        return new ObjectProperty(value, ueType, guidInfo, index);
    }

    public static ReadValue(reader: BinaryReadable): ObjectReference {
        return ObjectReference.read(reader);
    }

    public static CalcOverhead(property: ObjectProperty): number {
        return 1;
    }

    public static Serialize(writer: ByteWriter, property: ObjectProperty): void {
        GUIDInfo.write(writer, property.guidInfo);
        ObjectProperty.SerializeValue(writer, property.value);
    }

    public static SerializeValue(writer: ByteWriter, value: ObjectReference): void {
        ObjectReference.write(writer, value);
    }
}
