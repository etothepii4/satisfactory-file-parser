import { ChunkCompressionInfo } from "../../file.types";
import { Levels } from './level.class';
import { SatisfactorySaveHeader } from './satisfactory-save-header';
import { Grids, SaveBodyValidation } from "./save-reader";

export class SatisfactorySave {
	public name: string;
	public header: SatisfactorySaveHeader;
	public gridHash: SaveBodyValidation = { version: 6, hash1: [0, 0, 0, 0], hash2: [0, 0, 0, 0] };
	public grids: Grids = {};
	public levels: Levels = {};
	public compressionInfo?: ChunkCompressionInfo;

	constructor(name: string, header: SatisfactorySaveHeader) {
		this.name = name;
		this.header = header;
	}
}