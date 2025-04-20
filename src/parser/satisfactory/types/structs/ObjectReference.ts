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

	export const IsEqual = (ref1: ObjectReference, ref2: ObjectReference) => ref1.levelName === ref2.levelName && ref1.pathName === ref2.pathName;
};
