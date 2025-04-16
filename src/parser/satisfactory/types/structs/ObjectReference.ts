import { ContextReader } from '../../../context/context-reader';
import { ContextWriter } from '../../../context/context-writer';

export type ObjectReference = {
	levelName: string;
	pathName: string;
};

export namespace ObjectReference {
	export const read = (reader: ContextReader): ObjectReference => {
		return {
			levelName: reader.readString(),
			pathName: reader.readString()
		};
	};

	export const write = (writer: ContextWriter, ref: ObjectReference): void => {
		writer.writeString(ref.levelName);
		writer.writeString(ref.pathName);
	};
};
