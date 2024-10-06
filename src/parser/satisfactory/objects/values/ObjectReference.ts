import { BinaryReadable } from "../../../byte/binary-readable.interface";
import { ByteWriter } from "../../../byte/byte-writer.class";

export type ObjectReference = {
	levelName: string;
	pathName: string;
};

export namespace ObjectReference {
	export const read = (reader: BinaryReadable): ObjectReference => {
		return {
			levelName: reader.readString(),
			pathName: reader.readString()
		};
	};

	export const write = (writer: ByteWriter, ref: ObjectReference): void => {
		writer.writeString(ref.levelName);
		writer.writeString(ref.pathName);
	};
};
