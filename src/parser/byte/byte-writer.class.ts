
import { Alignment } from "./alignment.enum";
import { BinaryWritable } from './binary-writable.interface';

/** @public */
export abstract class ByteWriter implements BinaryWritable {

	public alignment: Alignment;
	protected bufferArray: ArrayBuffer;
	protected bufferView: DataView;

	protected currentByte: number;

	constructor(alignment: Alignment, bufferSize: number = 500) {
		this.alignment = alignment;
		this.bufferArray = new ArrayBuffer(bufferSize);
		this.bufferView = new DataView(this.bufferArray);
		this.currentByte = 0;
	}

	/*
	 * Byte Manipulation
	 */
	public skipBytes(count: number = 1): void {
		this.extendBufferIfNeeded(count);
		this.currentByte += count;
	}
	public jumpTo(pos: number): void {
		const count = pos - this.getBufferPosition();
		this.skipBytes(count);
	}
	public writeByte(value: number): void {
		this.extendBufferIfNeeded(1);
		this.bufferView.setUint8(this.currentByte, value);
		this.currentByte += 1;
	}
	public writeBytesArray(bytes: number[]): void {
		this.writeBytes(new Uint8Array(bytes));
	}
	public writeBytes(bytes: Uint8Array): void {
		this.extendBufferIfNeeded(bytes.length);
		bytes.forEach(byte => this.bufferView.setUint8(this.currentByte++, byte));
	}
	public writeInt8(value: number): void {
		this.extendBufferIfNeeded(1);
		this.bufferView.setInt8(this.currentByte, value);
		this.currentByte += 1;
	}
	public writeUint8(value: number): void {
		this.writeByte(value);
	}
	public writeInt16(value: number): void {
		this.extendBufferIfNeeded(2);
		this.bufferView.setInt16(this.currentByte, value, this.alignment === Alignment.LITTLE_ENDIAN);
		this.currentByte += 2;
	}
	public writeUint16(value: number): void {
		this.extendBufferIfNeeded(2);
		this.bufferView.setUint16(this.currentByte, value, this.alignment === Alignment.LITTLE_ENDIAN);
		this.currentByte += 2;
	}
	public writeInt32(value: number): void {
		this.extendBufferIfNeeded(4);
		this.bufferView.setInt32(this.currentByte, value, this.alignment === Alignment.LITTLE_ENDIAN);
		this.currentByte += 4;
	}
	public writeUint32(value: number): void {
		this.extendBufferIfNeeded(4);
		this.bufferView.setUint32(this.currentByte, value, this.alignment === Alignment.LITTLE_ENDIAN);
		this.currentByte += 4;
	}
	public writeInt64(value: bigint): void {
		this.extendBufferIfNeeded(8);
		this.bufferView.setBigInt64(this.currentByte, value, this.alignment === Alignment.LITTLE_ENDIAN);
		this.currentByte += 8;
	}
	public writeUint64(value: bigint): void {
		this.extendBufferIfNeeded(8);
		this.bufferView.setBigUint64(this.currentByte, value, this.alignment === Alignment.LITTLE_ENDIAN);
		this.currentByte += 8;
	}
	public writeFloat32(value: number): void {
		this.extendBufferIfNeeded(4);
		this.bufferView.setFloat32(this.currentByte, value, this.alignment === Alignment.LITTLE_ENDIAN);
		this.currentByte += 4;
	}
	public writeDouble(value: number): void {
		this.extendBufferIfNeeded(8);
		this.bufferView.setFloat64(this.currentByte, value, this.alignment === Alignment.LITTLE_ENDIAN);
		this.currentByte += 8;
	}
	public writeString(value: string) {
		if (value.length === 0) {
			this.writeInt32(0);
			return;
		}

		// if it's safe to use ASCII, use UTF8.
		if (ByteWriter.IsASCIICompatible(value)) {
			this.writeInt32(value.length + 1);
			for (let i = 0; i < value.length; i++) {
				this.writeByte(value.charCodeAt(i));
			}
			this.writeUint8(0);
		}
		// write UTF16
		else {
			this.writeInt32(-value.length - 1);
			for (let i = 0; i < value.length; i++) {
				this.writeUint16(value.charCodeAt(i));
			}
			this.writeUint16(0);
		}
	}

	public static IsASCIICompatible = (value: string): boolean => /^[\x00-\x7F]*$/.test(value);

	public getBufferPosition = (): number => this.currentByte;

	public getBufferSlice = (start: number, end?: number): ArrayBuffer => this.bufferArray.slice(start, end);

	public getBufferLength = (): number => this.bufferArray.byteLength;

	public getBufferProgress = (): number => this.currentByte / this.bufferArray.byteLength;

	public writeBinarySizeFromPosition(lenIndicatorPos: number, start: number): void {
		const after = this.getBufferPosition();
		const writtenBytes = after - start;
		this.jumpTo(lenIndicatorPos);
		this.writeInt32(writtenBytes);
		this.jumpTo(after);
	}

	/**
	 * automatically extends the current buffer if the given space exceeds the available rest capacity of the current buffer.
	 * @param countNeededBytes the needed space
	 * @param factor how big the appended buffer should be in comparison to the current one. Values >= 1 make sense.
	 */
	protected extendBufferIfNeeded(countNeededBytes: number, factor: number = 1.5): void {
		if (this.currentByte + countNeededBytes > this.bufferView.byteLength) {
			this.bufferArray = ByteWriter.AppendBuffer(this.bufferArray, new ArrayBuffer(factor * this.bufferArray.byteLength));
			this.bufferView = new DataView(this.bufferArray);
		}
	}

	protected truncateBuffer(): void {
		this.bufferArray = this.bufferArray.slice(0, this.currentByte);
	}

	public endWriting(): ArrayBuffer {
		this.truncateBuffer();
		return this.bufferArray;
	}

	public static ToInt32(num: number): Uint8Array {
		return new Uint8Array([
			(num & 0xff000000) >> 24,
			(num & 0x00ff0000) >> 16,
			(num & 0x0000ff00) >> 8,
			(num & 0x000000ff)
		]);
	}

	public static AppendBuffer(buffer1: ArrayBuffer, buffer2: ArrayBuffer): ArrayBuffer {
		var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
		tmp.set(new Uint8Array(buffer1), 0);
		tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
		return tmp.buffer;
	};
}