import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { SoftObjectReference } from '../../structs/SoftObjectReference';
import { AbstractBaseProperty } from './AbstractBaseProperty';

export const isSoftObjectProperty = (property: AbstractBaseProperty | AbstractBaseProperty[]): property is SoftObjectProperty => !Array.isArray(property) && property.type === 'SoftObjectProperty';

export class SoftObjectProperty extends AbstractBaseProperty {

    constructor(public value: SoftObjectReference, ueType: string = 'SoftObjectProperty', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'SoftObjectProperty', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): SoftObjectProperty {
        const guidInfo = GUIDInfo.read(reader);
        const value = SoftObjectReference.read(reader);
        return new SoftObjectProperty(value, ueType, guidInfo, index);
    }

    public static ReadValue(reader: BinaryReadable): SoftObjectReference {
        return SoftObjectReference.read(reader);
    }

    public static CalcOverhead(property: SoftObjectProperty): number {
        return 1;
    }

    public static Serialize(writer: ByteWriter, property: SoftObjectProperty): void {
        GUIDInfo.write(writer, property.guidInfo);
        SoftObjectReference.write(writer, property.value);
    }

    public static SerializeValue(writer: ByteWriter, value: SoftObjectReference): void {
        SoftObjectReference.write(writer, value);
    }
}
