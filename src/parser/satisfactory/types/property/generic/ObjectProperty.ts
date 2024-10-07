import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { ObjectReference } from '../../structs/ObjectReference';
import { BasicProperty } from './BasicProperty';

export const isObjectProperty = (property: BasicProperty): property is ObjectProperty => property.type === 'ObjectProperty';

export class ObjectProperty extends BasicProperty {

    constructor(public value: ObjectReference, ueType: string = 'ObjectProperty', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'ObjectProperty', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): ObjectProperty {
        const guidInfo = GUIDInfo.read(reader);
        const value = ObjectProperty.ReadValue(reader);
        return new ObjectProperty(value, ueType, guidInfo, index);
    }

    public static ReadValue(reader: BinaryReadable): ObjectReference {
        const x = {
            levelName: reader.readString(),
            pathName: reader.readString()
        };
        return x;
    }

    public static CalcOverhead(property: ObjectProperty): number {
        return 1;
    }

    public static Serialize(writer: ByteWriter, property: ObjectProperty): void {
        GUIDInfo.write(writer, property.guidInfo);
        ObjectProperty.SerializeValue(writer, property.value);
    }

    public static SerializeValue(writer: ByteWriter, value: ObjectReference): void {
        writer.writeString(value.levelName);
        writer.writeString(value.pathName);
    }
}
