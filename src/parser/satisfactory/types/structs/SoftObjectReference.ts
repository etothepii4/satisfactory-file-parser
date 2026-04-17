import { ContextReader } from '../../../context/context-reader';
import { ContextWriter } from '../../../context/context-writer';

export type SoftObjectReference = {
	instanceName: string;
	pathName: string;
	subPathString: number;
};

export namespace SoftObjectReference {
	export const read = (reader: ContextReader): SoftObjectReference => {
		return {
			pathName: reader.readString(),
			instanceName: reader.readString(),
			subPathString: reader.readInt32()
		};
	};

	export const write = (writer: ContextWriter, ref: SoftObjectReference): void => {
		writer.writeString(ref.pathName);
		writer.writeString(ref.instanceName);
		writer.writeInt32(ref.subPathString);
	};
};
