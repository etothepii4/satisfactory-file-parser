import { ObjectReference } from '../types/structs/ObjectReference';
import { Levels } from './level';
import { SatisfactorySaveHeader } from './satisfactory-save-header';
import { ChunkCompressionInfo } from './save-body-chunks';
import { Grids, SaveBodyValidation } from "./save-reader";

export class SatisfactorySave {
	public name: string;
	public header: SatisfactorySaveHeader;
	public gridHash: SaveBodyValidation = { version: 6, hash1: [0, 0, 0, 0], hash2: [0, 0, 0, 0] };
	public grids: Grids = {};
	public levels: Levels = {};
	public compressionInfo?: ChunkCompressionInfo;
	public unresolvedWorldSaveData?: ObjectReference[];

	// since 1.1 we finally have the save file name in the header.
	constructor(name: string, header: SatisfactorySaveHeader) {
		this.name = name;
		this.header = header;
		if (header.saveName !== undefined) {
			this.name = header.saveName;
		}
	}
}