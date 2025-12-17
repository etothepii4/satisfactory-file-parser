import { ContextReader } from "../../../../context/context-reader";
import { ContextWriter } from "../../../../context/context-writer";
import { col4 } from "../col4";


/**
 * specific binary struct
 */

export type FColor = col4;

export namespace FColor {

    export const read = (reader: ContextReader): FColor => {
        return col4.ParseBGRA(reader);
    }

    export const write = (writer: ContextWriter, value: FColor): void => {
        col4.SerializeBGRA(writer, value);
    }
}