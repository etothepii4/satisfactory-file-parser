import { ContextReader } from "../../../../context/context-reader";
import { ContextWriter } from "../../../../context/context-writer";
import { col4 } from "../col4";


/**
 * specific binary struct
 */

export type FLinearColor = col4;

export namespace FLinearColor {

    export const read = (reader: ContextReader): FLinearColor => {
        return col4.ParseRGBA(reader);
    }

    export const write = (writer: ContextWriter, value: FLinearColor): void => {
        col4.SerializeRGBA(writer, value);
    }
}