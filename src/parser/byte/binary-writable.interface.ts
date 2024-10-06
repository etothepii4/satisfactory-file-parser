import { BinaryOperable } from "./binary-operable.interface";

/**
 * Describes the ability to read bytes in different forms.
 */
export interface BinaryWritable extends BinaryOperable {

    skipBytes: (count?: number) => void;
    jumpTo(position: number): void;
    writeByte: (value: number) => void;
    writeBytes: (bytes: Uint8Array) => void;
    writeBytesArray: (bytes: number[]) => void;
    writeInt8: (value: number) => void;
    writeUint8: (value: number) => void;
    writeInt16: (value: number) => void;
    writeUint16: (value: number) => void;
    writeInt32: (value: number) => void;
    writeUint32: (value: number) => void;
    writeInt64: (value: bigint) => void;
    writeUint64: (value: bigint) => void;
    writeFloat32: (value: number) => void;
    writeDouble: (value: number) => void;
    writeString: (value: string) => void;

    getBufferProgress: () => number;
}