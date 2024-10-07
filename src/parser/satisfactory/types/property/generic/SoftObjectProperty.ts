import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { GUIDInfo } from '../../structs/GUIDInfo';
import { SoftObjectReference } from '../../structs/SoftObjectReference';
import { BasicProperty } from './BasicProperty';


export class SoftObjectProperty extends BasicProperty {

    constructor(public value: SoftObjectReference, ueType: string = 'SoftObjectProperty', guidInfo: GUIDInfo = undefined, index: number = 0) {
        super({ type: 'SoftObjectProperty', ueType, guidInfo, index });
    }

    public static Parse(reader: BinaryReadable, ueType: string, index: number = 0): SoftObjectProperty {
        const guidInfo = GUIDInfo.read(reader);
        const value = SoftObjectReference.read(reader);
        return new SoftObjectProperty(value, ueType, guidInfo, index);
    }

    public static CalcOverhead(property: SoftObjectProperty): number {
        return 1;
    }

    public static Serialize(writer: ByteWriter, property: SoftObjectProperty): void {
        GUIDInfo.write(writer, property.guidInfo);
        SoftObjectReference.write(writer, property.value);
    }
}
