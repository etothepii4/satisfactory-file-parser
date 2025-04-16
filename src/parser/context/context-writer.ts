import { ByteWriter } from '../byte/byte-writer.class';
import { ReaderWriterContext } from './context';


export abstract class ContextWriter extends ByteWriter {
    public context: ReaderWriterContext = {} as ReaderWriterContext;
};