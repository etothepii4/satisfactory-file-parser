import { ContextReader } from "../../../../../context/context-reader";
import { ContextWriter } from "../../../../../context/context-writer";
import { col4 } from "../../col4";

export type FINGPUT1BufferPixel = {
    character: string;
    foreGroundColor: col4;
    backgroundColor: col4;
};

/**
 *  declared at https://github.com/Panakotta00/FicsIt-Networks/blob/789c32fdc857fc9971f7f73fbbf3789c64f637bc/Source/FicsItReflection/Public/FIRTrace.h#L28
 */
export namespace FINGPUT1BufferPixel {

    export const read = (reader: ContextReader): FINGPUT1BufferPixel => {
        const bufferpixel: FINGPUT1BufferPixel = {
            character: reader.readHex(2),
            foreGroundColor: col4.ParseRGBA(reader),
            backgroundColor: col4.ParseRGBA(reader)
        };
        return bufferpixel;
    }

    export const write = (writer: ContextWriter, bufferpixel: FINGPUT1BufferPixel): void => {
        writer.writeHex(bufferpixel.character);
        col4.SerializeRGBA(writer, bufferpixel.foreGroundColor);
        col4.SerializeRGBA(writer, bufferpixel.backgroundColor);
    }
}