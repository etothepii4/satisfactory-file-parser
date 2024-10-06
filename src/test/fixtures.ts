import { SaveReader } from '../parser/satisfactory/save/save-reader';
import { SaveWriter } from '../parser/satisfactory/save/save-writer';

export class FixtureSaveWriter extends SaveWriter {
	constructor() { super(); }
}
export class FixtureSaveReader extends SaveReader {
	constructor(buffer: ArrayBuffer) { super(buffer, () => { }); }
}

export const MAX_VALUE_INT32 = 2147483647;
export const MIN_VALUE_INT32 = -2147483648;
export const MAX_VALUE_UINT32 = 4294967294;
export const FLOAT_PRECISION_DIGIT_COUNT = 6; // float has 6.92 digits of precision