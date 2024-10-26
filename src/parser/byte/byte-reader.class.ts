import { CorruptSaveError } from '../error/parser.error';
import { Alignment } from "./alignment.enum";
import { BinaryReadable } from "./binary-readable.interface";

/** @public */
export abstract class ByteReader implements BinaryReadable {

	protected bufferView!: DataView;
	protected fileBuffer!: ArrayBuffer;
	public alignment: Alignment;

	protected currentByte: number = 0;
	protected handledByte: number = 0;
	protected maxByte: number = 0;

	constructor(fileBuffer: ArrayBuffer, alignment: Alignment) {
		this.alignment = alignment;
		this.reset(fileBuffer);
	}

	/**
	 * Resets the reader on the given arraybuffer to start from the beginning.
	 * @param newFileBuffer the new array buffer to be read.
	 */
	public reset(newFileBuffer: ArrayBuffer) {
		this.fileBuffer = newFileBuffer;
		this.bufferView = new DataView(newFileBuffer, 0, this.fileBuffer.byteLength);
		this.maxByte = newFileBuffer.byteLength;
		this.currentByte = 0;
		this.handledByte = 0;
	}

	/*
	 * Byte Manipulation
	 */
	public skipBytes(byteLength = 1): void {
		this.currentByte += byteLength;
		return;
	}
	public readByte(): number {
		// TODO can i not just readByte() ??
		return parseInt(this.bufferView.getUint8(this.currentByte++).toString());
	}
	public readBytes(count: number): Uint8Array {
		return new Uint8Array(new Array(count).fill(0).map(pl => this.bufferView.getUint8(this.currentByte++)));
	}
	public bytesToHexRepresentation(bytes: number[]): string[] {
		return bytes.map(byte => ('0' + byte.toString(16)).slice(-2));
	}
	public readHex(byteLength: number, hexSeparator: string = ' '): string {
		return this.bytesToHexRepresentation(Array.from(this.readBytes(byteLength))).join(hexSeparator);
	}
	public readInt8(): number {
		let data = this.bufferView.getInt8(this.currentByte++);
		return data;
	}
	public readUint8(): number {
		let data = this.bufferView.getUint8(this.currentByte++);
		return data;
	}
	public readInt16(): number {
		let data = this.bufferView.getInt16(this.currentByte, this.alignment === Alignment.LITTLE_ENDIAN);
		this.currentByte += 2;
		return data;
	}
	public readUint16(): number {
		let data = this.bufferView.getUint16(this.currentByte, this.alignment === Alignment.LITTLE_ENDIAN);
		this.currentByte += 2;
		return data;
	}
	public readInt32(): number {
		let data = this.bufferView.getInt32(this.currentByte, this.alignment === Alignment.LITTLE_ENDIAN);
		this.currentByte += 4;
		return data;
	}
	public readUint32(): number {
		let data = this.bufferView.getUint32(this.currentByte, this.alignment === Alignment.LITTLE_ENDIAN);
		this.currentByte += 4;
		return data;
	}
	public readLong(): bigint {
		let data = this.bufferView.getBigInt64(this.currentByte, this.alignment === Alignment.LITTLE_ENDIAN);
		this.currentByte += 8;
		return data;
	}
	public readInt64(): bigint {
		return this.readLong();
	}
	public readUint64(): bigint {
		let data = this.bufferView.getBigUint64(this.currentByte, this.alignment === Alignment.LITTLE_ENDIAN);
		this.currentByte += 8;
		return data;
	}

	public readFloat32(): number {
		let data = this.bufferView.getFloat32(this.currentByte, this.alignment === Alignment.LITTLE_ENDIAN);
		this.currentByte += 4;
		return data;
	}
	public readDouble(): number {
		let data = this.bufferView.getFloat64(this.currentByte, this.alignment === Alignment.LITTLE_ENDIAN);
		this.currentByte += 8;
		return data;
	}
	public readString(): string {
		let strLength = this.readInt32();
		let startBytes = this.currentByte;

		if (strLength === 0) {
			return '';
		}

		// Range error!
		if (strLength > (this.bufferView.buffer.byteLength - this.currentByte)) {
			let errorMessage = `Cannot read string of length ${strLength} at position ${this.currentByte} as it exceeds the end at ${this.bufferView.buffer.byteLength}`;
			throw new Error(errorMessage);
		}

		// it uses UTF16 if text is non-ascii, even if it would fit into UTF8.
		if (strLength < 0) {
			const string = new Array(-strLength - 1).fill('').map(c => String.fromCharCode(this.readUint16()));
			this.currentByte += 2;
			return string.join('');
		}

		//default UTF-8
		try {
			const string = new Array(strLength - 1).fill('').map(c => String.fromCharCode(this.readUint8()));
			this.currentByte += 1;
			return string.join('');
		}
		catch (error) {
			throw new CorruptSaveError(`Cannot read UTF8 string of length ${strLength} at position ${this.currentByte}.`);
		}
	}

	public getBufferPosition = (): number => this.currentByte;

	public getBufferSlice = (begin: number, end: number | undefined): ArrayBuffer => this.bufferView.buffer.slice(begin, end);

	public getBufferProgress = (): number => this.currentByte / this.bufferView.buffer.byteLength;

	public getBufferLength = (): number => this.bufferView.buffer.byteLength;

	public getBuffer = (): ArrayBuffer => this.bufferView.buffer;
}