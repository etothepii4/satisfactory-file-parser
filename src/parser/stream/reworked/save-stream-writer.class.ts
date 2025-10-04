import { WritableStreamDefaultWriter } from "stream/web";
import { SatisfactorySaveHeader } from '../../satisfactory/save/satisfactory-save-header';
import { ChunkCompressionInfo } from "../../satisfactory/save/save-body-chunks";
import { SaveObject } from "../../satisfactory/types/objects/SaveObject";
import { ObjectReference } from '../../satisfactory/types/structs/ObjectReference';
import { Grids, SaveBodyValidation } from "../../satisfactory/types/structs/SaveBodyValidation";

type Mode = 'BEFORE_START' | 'OPENED_SAVE' | 'FINISHED_HEADER' | 'OPENED_LEVELS' | 'FINISHED_LEVELS' | 'OPENED_LEVEL' | 'FINISHED_LEVEL' | 'FINISHED_SAVE'
	| 'WROTE_COMPRESSION_INFO' | 'WROTE_OBJECT' | 'SWITCH_TO_COLLECTABLES' | 'WROTE_COLLECTABLE' | 'WROTE_SAVE_BODY_VALIDATION';

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

/**
 * @deprecated use ReadableStreamParser instead.
 */
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

	public beginSave = (): Promise<void> => this.createExecutionFunction(
		['BEFORE_START'],
		async () => {
			await this.writer.write('{');
		},
		'OPENED_SAVE'
	);

	public writeHeader = (header: SatisfactorySaveHeader): Promise<void> => this.createExecutionFunction(
		['OPENED_SAVE'],
		async () => {
			await this.writer.write(`"header": ${JSON.stringify(header)}`);
		},
		'FINISHED_HEADER'
	);

	public writeCompressionInfo = (compressionInfo: ChunkCompressionInfo): Promise<void> => this.createExecutionFunction(
		['FINISHED_HEADER'],
		async () => {
			await this.writer.write(`, "compressionInfo": ${JSON.stringify(compressionInfo)}`);
		},
		'WROTE_COMPRESSION_INFO'
	);

	public writeSaveBodyValidation = (saveBodyValidation: SaveBodyValidation): Promise<void> => this.createExecutionFunction(
		['WROTE_COMPRESSION_INFO'],
		async () => {
			await this.writer.write(`, "saveBodyValidation": ${JSON.stringify(saveBodyValidation)}`);
		},
		'WROTE_SAVE_BODY_VALIDATION'
	);


	public openLevels = (): Promise<void> => this.createExecutionFunction(
		['WROTE_SAVE_BODY_VALIDATION'],
		async () => {
			await this.writer.write(`, "levels": [`);
		},
		'OPENED_LEVELS'
	);

	public openLevel = (levelName: string): Promise<void> => this.createExecutionFunction(
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

	public writeObjects = (...objects: SaveObject[]): Promise<void> => this.createExecutionFunction(
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

	public switchInLevelToCollectables = (...objects: SaveObject[]): Promise<void> => this.createExecutionFunction(
		['OPENED_LEVEL', 'WROTE_OBJECT'],
		async () => {
			await this.writer.write(`], "collectables": [`);
		},
		'SWITCH_TO_COLLECTABLES'
	);

	public writeCollectables = (...collectables: ObjectReference[]): Promise<void> => this.createExecutionFunction(
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

	public endLevel = (): Promise<void> => this.createExecutionFunction(
		['SWITCH_TO_COLLECTABLES', 'WROTE_COLLECTABLE'],
		async () => {
			await this.writer.write(`]}`);
		},
		'FINISHED_LEVEL'
	);

	public endLevels = (): Promise<void> => this.createExecutionFunction(
		['OPENED_LEVELS', 'FINISHED_LEVEL'],
		async () => {
			await this.writer.write(`]`);
		},
		'FINISHED_LEVELS'
	);

	public endSave = (): Promise<void> => this.createExecutionFunction(
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