import { Grids, SaveBodyValidation } from '../types/structs/SaveBodyValidation';
import { ObjectReference } from '../types/structs/ObjectReference';
import { Levels } from './level';
import { SatisfactorySaveHeader } from './satisfactory-save-header';
import { ChunkCompressionInfo } from './save-body-chunks';

export class SatisfactorySave {
	public name: string;
	public header: SatisfactorySaveHeader;
	public saveBodyValidation: SaveBodyValidation = { grids: {} };
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