import { ChunkCompressionInfo } from "../../file.types";
import { Level } from './level.class';
import { Grids, SaveBodyValidation } from "./save-reader";
import { SatisfactorySaveHeader } from "./save.types";

export class SatisfactorySave {
	public name: string;
	public header: SatisfactorySaveHeader;
	public gridHash: SaveBodyValidation = { version: 6, hash1: [0, 0, 0, 0], hash2: [0, 0, 0, 0] };
	public grids: Grids = {};
	public levels: Level[] = [];
	public compressionInfo?: ChunkCompressionInfo;

	constructor(name: string, header: SatisfactorySaveHeader) {
		this.name = name;
		this.header = header;
	}
}