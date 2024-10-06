import { Alignment } from "./alignment.enum";

/**
 * Describes the ability to operate bytes with the help of some sort of buffer.
 */
export interface BinaryOperable {
    alignment: Alignment;

    getBufferPosition: () => number;
    getBufferLength: () => number;
}
