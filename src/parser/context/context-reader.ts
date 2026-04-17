import { ByteReader } from '../byte/byte-reader.class';
import { ReaderWriterContext } from './reader-writer-context';


export abstract class ContextReader extends ByteReader {
    public context: ReaderWriterContext = {} as ReaderWriterContext;
};