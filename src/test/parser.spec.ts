import * as fs from 'fs';
import * as path from 'path';
import { Writable } from 'stream';
import { WritableStream } from 'stream/web';
import { isDeepStrictEqual } from 'util';
import { Parser } from '../parser/parser';
import { Level } from '../parser/satisfactory/save/level.class';
import { SatisfactorySave } from '../parser/satisfactory/save/satisfactory-save';
import { SaveComponent } from '../parser/satisfactory/types/objects/SaveComponent';
import { SaveEntity } from '../parser/satisfactory/types/objects/SaveEntity';
import { SaveObject } from '../parser/satisfactory/types/objects/SaveObject';
import { StructArrayProperty } from '../parser/satisfactory/types/property/generic/ArrayProperty/StructArrayProperty';
import { Int32Property } from '../parser/satisfactory/types/property/generic/Int32Property';
import { ObjectProperty } from '../parser/satisfactory/types/property/generic/ObjectProperty';
import { InventoryItemStructPropertyValue, StructProperty } from '../parser/satisfactory/types/property/generic/StructProperty';
import { DynamicStructPropertyValue } from '../parser/satisfactory/types/structs/DynamicStructPropertyValue';
import { ReadableStreamParser } from '../parser/stream/reworked/readable-stream-parser';
const util = require('util');

let fileLog: fs.WriteStream;

beforeAll(() => {
	fileLog = fs.createWriteStream(path.join(__dirname, './test-log.txt'), { flags: 'w' });
	const logOutput = process.stdout;
	console.log = (...e: any[]) => {
		fileLog.write(e.map(el => util.format(el)).join(' ') + '\n');
		logOutput.write(e.map(el => util.format(el)).join(' ') + '\n');
	};
});

afterAll(() => {
	if (fileLog !== undefined) {
		fileLog.close();
	}
});

const ParseSaveSync = (savename: string, file: ArrayBuffer, onDecompressedSaveBody?: (body: ArrayBuffer) => void): SatisfactorySave => {
	console.log(`## parsing save ${savename}`);
	const save = Parser.ParseSave(savename, file, {
		onDecompressedSaveBody,
		onProgressCallback: (progress, msg) => {
			console.log(`${savename} parsing progress`, progress, msg);
		}
	});
	return save;
};

const WriteSaveSync = (save: SatisfactorySave, onBinaryBeforeCompressing?: (binary: ArrayBuffer) => void) => {
	let mainFileHeader: Uint8Array;
	const mainFileBodyChunks: Uint8Array[] = [];
	Parser.WriteSave(save,
		header => {
			mainFileHeader = header;
		},
		chunk => {
			mainFileBodyChunks.push(chunk);
		},
		{ onBinaryBeforeCompressing });

	// write complete .sav file back to disk
	fs.writeFileSync(path.join(__dirname, save.name + '_on-writing.sav'), Buffer.concat([mainFileHeader!, ...mainFileBodyChunks]));
};


const FindFirst = (save: SatisfactorySave, condition: (obj: SaveObject) => boolean): { object: SaveEntity | SaveComponent, level: Level } | undefined => {
	for (let i = 0; i < save.levels.length; i++) {
		const potentialHub = save.levels[i].objects.find(condition);
		if (potentialHub) {
			return {
				level: save.levels[i],
				object: potentialHub
			};
		}
	}
}

const ModifyObjects = (save: SatisfactorySave, ...modifiedObjects: (SaveEntity | SaveComponent)[]) => {
	for (const modifiedObject of modifiedObjects) {
		for (const level of save.levels) {
			for (let i = 0; i < level.objects.length; i++) {
				if (level.objects[i].instanceName === modifiedObject.instanceName) {
					level.objects[i] = modifiedObject;
				}
			}
		}
	}
}


const saveList = [
	'Release 001',			// 1.0 Save, almost empty.
	'Release 032',			// 1.0 Save
	'265',					// U8 save ported to 1.0 - we have no ambition to support U8 in later versions, but it works for this save.

	// Mods
	'ficsitcam-1',
	'structuralsolutions-1',
	'x3-roads-signs'
];

const ModifyPlayer = (save: SatisfactorySave): { object: SaveEntity | SaveComponent, level: Level }[] => {
	const firstPlayer = FindFirst(save, obj => obj.typePath === '/Game/FactoryGame/Character/Player/Char_Player.Char_Player_C')!;
	(firstPlayer.object as SaveEntity).transform.translation = {
		x: (firstPlayer.object as SaveEntity).transform.translation.x + 5000,
		y: (firstPlayer.object as SaveEntity).transform.translation.y + 5000,
		z: (firstPlayer.object as SaveEntity).transform.translation.z,
	}
	return [firstPlayer];
};

const ModifyStorageContainer = (save: SatisfactorySave): { object: SaveEntity | SaveComponent, level: Level }[] => {
	const firstContainer = FindFirst(save, obj => obj.typePath === '/Game/FactoryGame/Buildable/Factory/StorageContainerMk1/Build_StorageContainerMk1.Build_StorageContainerMk1_C')!;

	const inventoryReference = firstContainer.object.properties.mStorageInventory as ObjectProperty;
	const inventory = save.levels.flatMap(level => level.objects).find(obj => obj.instanceName === inventoryReference.value.pathName) as SaveComponent;
	const inventoryStacks = inventory.properties.mInventoryStacks as StructArrayProperty;
	const firstStack = inventoryStacks.values[0];

	// modify first item stack
	(((firstStack.value as DynamicStructPropertyValue).properties.Item as StructProperty).value as InventoryItemStructPropertyValue).itemName = '/Game/FactoryGame/Resource/Parts/Rotor/Desc_Rotor.Desc_Rotor_C';
	((firstStack.value as DynamicStructPropertyValue).properties.NumItems as Int32Property).value = 5;

	return [firstContainer];
};

/**
 * this test iterates throug ha list of "modificationMethods", which each modify one or multiple objects. The test then checks whether the update persists through serialization and de-serialization.
 */
it.each([
	['modifies position of first player', ModifyPlayer],
	['modifies an item stack in a storage container', ModifyStorageContainer]
])('example %s correctly', (_, modificationMethod: (save: SatisfactorySave) => { object: SaveEntity | SaveComponent, level: Level }[]) => {
	const savename = '265';
	const file = fs.readFileSync(path.join(__dirname, savename + '.sav')).buffer;
	const save = ParseSaveSync(savename, file);

	// modify, write save, read save again
	const modifiedObjects = modificationMethod(save);
	ModifyObjects(save, ...modifiedObjects.map(wrapper => wrapper.object));
	WriteSaveSync(save);
	const modifiedFile = fs.readFileSync(path.join(__dirname, save.name + '_on-writing.sav')).buffer;
	const modifiedSave = ParseSaveSync(savename, modifiedFile);

	// for each modified object, check that modified save file has the equal object.
	for (const modifiedObject of modifiedObjects) {
		const relevantLevel = modifiedSave.levels.find(level => level.name === modifiedObject.level.name) as Level;
		const objectToCheck = relevantLevel.objects.find(obj => obj.instanceName === modifiedObject.object.instanceName) as SaveEntity | SaveComponent;
		expect(isDeepStrictEqual(objectToCheck, modifiedObject.object)).toEqual(true);
	}
});

it.each(saveList)('can parse a binary save (%s) to json with stream and with sync', async (savename: string) => {
	const filepath = path.join(__dirname, savename + '.sav');
	const binaryFilepathStream = path.join(__dirname, savename + '.stream.bin');
	const binaryFilepathSync = path.join(__dirname, savename + '.sync.bin');
	const file = fs.readFileSync(filepath).buffer;
	const outJsonPathStream = path.join(__dirname, savename + '.stream.json');
	const outJsonPathSync = path.join(__dirname, savename + '.sync.json');

	// a high highwatermark can help in not having so many "pull"-requests to the readablesource, so less waiting on consumer side.
	// However, the write speed of the writestream is still a limit for consumption.
	const outJsonStream = fs.createWriteStream(outJsonPathStream, { highWaterMark: 1024 * 1024 * 200 });

	const { stream, startStreaming } = ReadableStreamParser.CreateReadableStreamFromSaveToJson(savename, file, {
		onDecompressedSaveBody: decompressedBody => {
			fs.writeFileSync(binaryFilepathStream, Buffer.from(decompressedBody));
		}, onProgress: (progress, msg) => {
			console.log(`progress`, progress, msg);
		}
	});

	// streaming to file, WritableStream is from stream/web
	const start = performance.now();
	startStreaming();
	stream.pipeTo(Writable.toWeb(outJsonStream) as WritableStream<string>);

	let end: number = 0;
	await new Promise<void>((resolve, reject) => {
		outJsonStream
			.on('close', () => {
				console.log('outstream closed.');
				end = performance.now();
				return resolve();
			})
			.on('error', (err) => {
				console.log('outstream error', err);
				return reject();
			});
	});

	console.log(`Streaming took ${(end - start) / 1000} seconds.`);


	// parse sync as well.
	const start2 = performance.now();
	const save = ParseSaveSync(savename, file, decompressedBody => {
		fs.writeFileSync(binaryFilepathSync, Buffer.from(decompressedBody));
	});
	fs.writeFileSync(outJsonPathSync, JSON.stringify(save));
	const end2 = performance.now();

	console.log(`Sync Parsing took ${(end2 - start2) / 1000} seconds.`);

	// check that the minified jsons of stream and sync parsing are equal.
	const json1 = fs.readFileSync(outJsonPathStream, { encoding: 'utf-8' });
	const json2 = fs.readFileSync(outJsonPathSync, { encoding: 'utf-8' });
	const thing1 = JSON.parse(json1) as SatisfactorySave;
	const thing2 = JSON.parse(json2) as SatisfactorySave;
	expect(JSON.stringify(thing1).length).toEqual(JSON.stringify(thing2).length);
});


it.each(saveList)('can write a synchronous save', async (savename) => {
	const filepath = path.join(__dirname, savename + '.sync.json');
	const save = JSON.parse(fs.readFileSync(filepath, { encoding: 'utf-8' })) as SatisfactorySave;
	WriteSaveSync(save, binary => {
		fs.writeFileSync(path.join(__dirname, save.name + '_on-writing.bin'), Buffer.from(binary));
	});
});


it.each([
	'release-single-wall',
	'release-storage-mk1',
	'release-storage-mk2-blueprintmk2',
	'release-two-foundations',
])('can read and write a synchronous blueprint: %s', async (blueprintname) => {
	const filepathBlueprint = path.join(__dirname, blueprintname + '.sbp');
	const filepathBlueprintConfig = path.join(__dirname, blueprintname + '.sbpcfg');
	const binaryFilepath = path.join(__dirname, blueprintname + '.bins');
	const file = fs.readFileSync(filepathBlueprint);
	const configFileBuffer = fs.readFileSync(filepathBlueprintConfig);

	const blueprint = Parser.ParseBlueprintFiles(blueprintname, file, configFileBuffer, {
		onDecompressedBlueprintBody: (decompressedBody) => {
			fs.writeFileSync(binaryFilepath, Buffer.from(decompressedBody));
		}
	});

	fs.writeFileSync(path.join(__dirname, blueprintname + '.json'), JSON.stringify(blueprint, null, 4));

	let mainFileHeader: Uint8Array;
	const mainFileBodyChunks: Uint8Array[] = [];
	const response = Parser.WriteBlueprintFiles(blueprint,
		header => {
			mainFileHeader = header;
		}, chunk => {
			mainFileBodyChunks.push(chunk);
		},
		{
			onMainFileBinaryBeforeCompressing: binary => {
				fs.writeFileSync(path.join(__dirname, blueprintname + '.bins_modified'), Buffer.from(binary));
			},
		});

	// write complete .sbp file back to disk
	fs.writeFileSync(path.join(__dirname, blueprintname + '.sbp_modified'), Buffer.concat([mainFileHeader!, ...mainFileBodyChunks]));

	fs.writeFileSync(path.join(__dirname, blueprintname + '.sbpcfg_modified'), Buffer.from(response.configFileBinary));
});
