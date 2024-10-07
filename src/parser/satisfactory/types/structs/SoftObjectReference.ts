import { BinaryReadable } from "../../../byte/binary-readable.interface";
import { ByteWriter } from "../../../byte/byte-writer.class";

export type SoftObjectReference = {
	instanceName: string;
	pathName: string;
	unk: number;
};

export namespace SoftObjectReference {
	export const read = (reader: BinaryReadable): SoftObjectReference => {
		return {
			pathName: reader.readString(),
			instanceName: reader.readString(),
			unk: reader.readInt32()	//TODO: other values than 0 not seen yet.
		};
	};

	export const write = (writer: ByteWriter, ref: SoftObjectReference): void => {
		writer.writeString(ref.pathName);
		writer.writeString(ref.instanceName);
		writer.writeInt32(ref.unk);
	};
};
