import { BinaryOperable } from "./binary-operable.interface";

/**
 * Describes the ability to read bytes in different forms.
 */
export interface BinaryReadable extends BinaryOperable {

    skipBytes: (count?: number) => void;
    readBytes: (count: number) => Uint8Array;
    readByte: () => number;
    readHex: (count: number) => string;
    readInt8: () => number;
    readUint8: () => number;
    readInt16: () => number;
    readUint16: () => number;
    readInt32: () => number;
    readUint32: () => number;
    readInt64: () => bigint;
    readUint64: () => bigint;
    readFloat32: () => number;
    readDouble: () => number;
    readString: () => string;

    getBufferProgress: () => number;
}