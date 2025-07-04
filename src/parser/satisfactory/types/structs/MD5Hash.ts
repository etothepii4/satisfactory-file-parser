import { ContextReader } from '../../../context/context-reader';
import { ContextWriter } from '../../../context/context-writer';


export type MD5Hash = {
    isValid: boolean;
    hash?: number[];
};

export namespace MD5Hash {
    export const read = (reader: ContextReader): MD5Hash => {
        const md5Hash: MD5Hash = { isValid: false };
        md5Hash.isValid = reader.readInt32() === 1;
        if (md5Hash.isValid) {
            md5Hash.hash = Array.from(reader.readBytes(16));
        }
        return md5Hash;
    };

    export const write = (writer: ContextWriter, md5Hash: MD5Hash): void => {
        writer.writeInt32(md5Hash.isValid ? 1 : 0);
        if (md5Hash.isValid) {
            writer.writeBytesArray(md5Hash.hash!);
        }
    };
};