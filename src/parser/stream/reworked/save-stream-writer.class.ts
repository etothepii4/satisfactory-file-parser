import { WritableStreamDefaultWriter } from "stream/web";
import { ChunkCompressionInfo } from '../../file.types';
import { ByteArray4, Grids } from '../../satisfactory/save/save-reader';
import { SatisfactorySaveHeader } from '../../satisfactory/save/save.types';
import { SaveObject } from "../../satisfactory/types/objects/SaveObject";
import { ObjectReference } from '../../satisfactory/types/structs/ObjectReference';

type Mode = 'BEFORE_START' | 'OPENED_SAVE' | 'FINISHED_HEADER' | 'OPENED_LEVELS' | 'FINISHED_LEVELS' | 'OPENED_LEVEL' | 'FINISHED_LEVEL' | 'FINISHED_SAVE'
	| 'WROTE_COMPRESSION_INFO' | 'WROTE_OBJECT' | 'SWITCH_TO_COLLECTABLES' | 'WROTE_COLLECTABLE' | 'WROTE_GRID_HASH' | 'WROTE_GRIDS';

class ModeStateTracker {
	constructor(public mode: Mode) {

	}

	public checkIsComingFrom(...allowedPredecessors: Mode[]) {
		if (!allowedPredecessors.includes(this.mode)) {
			throw new Error(`Wrong order of commands. mode is ${this.mode}. but only ${allowedPredecessors.join(', ')} is/are allowed.`);
		}
	}

	public advance(newMode: Mode) {
		this.mode = newMode;
	}
}

export class SaveStreamWriter {

	private mode: Mode;
	private tracker: ModeStateTracker;

	// we need some flat structure to keep track of number of elements.
	private formatTracker: {
		levels: {
			objectCount: number;
			collectablesCount: number;
		}[]
	};

	constructor(private writer: WritableStreamDefaultWriter<string>) {
		this.mode = 'BEFORE_START';
		this.tracker = new ModeStateTracker(this.mode);
		this.formatTracker = {
			levels: []
		};
	}

	private createExecutionFunction = async (allowedInputModes: Mode[], fn: () => Promise<void> | void, targetMode: Mode): Promise<void> => {
		this.tracker.checkIsComingFrom(...allowedInputModes);
		await fn();
		this.tracker.advance(targetMode);
	}

	public beginSave = () => this.createExecutionFunction(
		['BEFORE_START'],
		async () => {
			await this.writer.write('{');
		},
		'OPENED_SAVE'
	);

	public writeHeader = (header: SatisfactorySaveHeader) => this.createExecutionFunction(
		['OPENED_SAVE'],
		async () => {
			await this.writer.write(`"header": ${JSON.stringify(header)}`);
		},
		'FINISHED_HEADER'
	);

	public writeCompressionInfo = (compressionInfo: ChunkCompressionInfo) => this.createExecutionFunction(
		['FINISHED_HEADER'],
		async () => {
			await this.writer.write(`, "compressionInfo": ${JSON.stringify(compressionInfo)}`);
		},
		'WROTE_COMPRESSION_INFO'
	);

	public writeGridHash = (gridHash: ByteArray4) => this.createExecutionFunction(
		['WROTE_COMPRESSION_INFO'],
		async () => {
			await this.writer.write(`, "gridHash": ${JSON.stringify(gridHash)}`);
		},
		'WROTE_GRID_HASH'
	);

	public writeGrids = (grids: Grids) => this.createExecutionFunction(
		['WROTE_GRID_HASH'],
		async () => {
			await this.writer.write(`, "grids": ${JSON.stringify(grids)}`);
		},
		'WROTE_GRIDS'
	);

	public openLevels = () => this.createExecutionFunction(
		['WROTE_GRIDS'],
		async () => {
			await this.writer.write(`, "levels": [`);
		},
		'OPENED_LEVELS'
	);

	public openLevel = (levelName: string) => this.createExecutionFunction(
		['OPENED_LEVELS', 'FINISHED_LEVEL'],
		async () => {
			this.formatTracker.levels.push({
				objectCount: 0, collectablesCount: 0
			});
			const prefix = this.formatTracker.levels.length > 1 ? ', ' : '';
			await this.writer.write(`${prefix}{"name": "${levelName}", "objects": [`);
		},
		'OPENED_LEVEL'
	);

	public writeObjects = (...objects: SaveObject[]) => this.createExecutionFunction(
		['OPENED_LEVEL', 'WROTE_OBJECT'],
		async () => {
			const stringified = objects.map(saveObj => JSON.stringify(saveObj));

			for (const obj of stringified) {
				await this.writer.write(`${this.formatTracker.levels.at(-1)!.objectCount >= 1 ? ', ' : ''}${obj}`);
				this.formatTracker.levels.at(-1)!.objectCount++;
			}
		},
		'WROTE_OBJECT'
	);

	public switchInLevelToCollectables = (...objects: SaveObject[]) => this.createExecutionFunction(
		['OPENED_LEVEL', 'WROTE_OBJECT'],
		async () => {
			await this.writer.write(`], "collectables": [`);
		},
		'SWITCH_TO_COLLECTABLES'
	);

	public writeCollectables = (...collectables: ObjectReference[]) => this.createExecutionFunction(
		['SWITCH_TO_COLLECTABLES', 'WROTE_COLLECTABLE'],
		async () => {
			const stringified = collectables.map(coll => JSON.stringify(coll));

			for (const obj of stringified) {
				await this.writer.write(`${this.formatTracker.levels.at(-1)!.collectablesCount >= 1 ? ', ' : ''}${obj}`);
				this.formatTracker.levels.at(-1)!.collectablesCount++;
			}
		},
		'WROTE_COLLECTABLE'
	);

	public endLevel = () => this.createExecutionFunction(
		['SWITCH_TO_COLLECTABLES', 'WROTE_COLLECTABLE'],
		async () => {
			await this.writer.write(`]}`);
		},
		'FINISHED_LEVEL'
	);

	public endLevels = () => this.createExecutionFunction(
		['OPENED_LEVELS', 'FINISHED_LEVEL'],
		async () => {
			await this.writer.write(`]`);
		},
		'FINISHED_LEVELS'
	);

	public endSave = () => this.createExecutionFunction(
		['FINISHED_LEVELS'],
		async () => {
			await this.writer.write('}');
		},
		'FINISHED_SAVE'
	);

	public async close(): Promise<void> {
		return this.writer.close();
	}
}