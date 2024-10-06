import { ChunkCompressionInfo } from "../../file.types";
import { Level } from "./level.class";
import { ByteArray4, Grids } from "./save-reader";
import { SatisfactorySaveHeader } from "./save.types";

export class SatisfactorySave {
	public name: string;
	public header: SatisfactorySaveHeader;
	public gridHash: ByteArray4 = [0, 0, 0, 0];
	public grids: Grids = {};
	public levels: Level[] = [];
	public compressionInfo?: ChunkCompressionInfo;

	constructor(name: string, header: SatisfactorySaveHeader) {
		this.name = name;
		this.header = header;
	}
}