/// <reference types="jest" />
/// <reference types="node" />

import * as fs from 'node:fs';
import * as path from 'node:path';
import { Writable } from 'node:stream';
import { format, isDeepStrictEqual } from 'node:util';
import { ArrayProperty, ContextReader, DynamicStructPropertyValue, IntProperty, InventoryItemStructPropertyValue, Level, ObjectProperty, Parser, ReadableStreamParser, SatisfactorySave, SaveComponent, SaveEntity, SaveObject, StructProperty } from '../index';
import * as PropertiesListMod from '../parser/satisfactory/types/property/PropertiesList';
import * as FINNetworkTraceMod from '../parser/satisfactory/types/structs/mods/FicsItNetworks/FINNetworkTrace';

beforeAll(() => {
	const logOutput = process.stdout;
	console.log = (...e: any[]) => {
		logOutput.write(e.map(el => format(el)).join(' ') + '\n');
	};
});

const ParseSaveSync = (savename: string, file: ArrayBufferLike, onDecompressedSaveBody?: (body: ArrayBufferLike) => void, throwErrors: boolean = true): SatisfactorySave => {
	console.log(`## parsing save ${savename}`);
	const save = Parser.ParseSave(savename, file, {
		onDecompressedSaveBody,
		onProgressCallback: (progress, msg) => {
			console.log(`${savename} parsing progress`, progress, msg);
		},
		throwErrors
	});
	return save;
};


const ParseBlueprintSync = (
	blueprintname: string,
	file: ArrayBufferLike,
	configFileBuffer: ArrayBufferLike,
	onDecompressedBlueprintBody: NonNullable<Parameters<typeof Parser.ParseBlueprintFiles>[3]>['onDecompressedBlueprintBody']
) => {
	return Parser.ParseBlueprintFiles(blueprintname, file, configFileBuffer, {
		onDecompressedBlueprintBody,
		throwErrors: true
	});
}

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



describe('modification of saves', () => {
	const FindFirst = (save: SatisfactorySave, condition: (obj: SaveObject) => boolean): { object: SaveEntity | SaveComponent, level: Level } | undefined => {
		for (const level of Object.values(save.levels)) {
			const potentialObject = level.objects.find(condition);
			if (potentialObject) {
				return {
					level,
					object: potentialObject
				};
			}
		}
	}

	const ModifyObjects = (save: SatisfactorySave, ...modifiedObjects: (SaveEntity | SaveComponent)[]) => {
		for (const modifiedObject of modifiedObjects) {
			for (const level of Object.values(save.levels)) {
				for (let i = 0; i < level.objects.length; i++) {
					if (level.objects[i].instanceName === modifiedObject.instanceName) {
						level.objects[i] = modifiedObject;
					}
				}
			}
		}
	}

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
		const inventory = Object.values(save.levels).flatMap(level => level.objects).find(obj => obj.instanceName === inventoryReference.value.pathName) as SaveComponent;
		const inventoryStacks = inventory.properties.mInventoryStacks as ArrayProperty;
		const firstStack = inventoryStacks.values[0];

		// modify first item stack
		(((firstStack as DynamicStructPropertyValue).properties.Item as StructProperty).value as InventoryItemStructPropertyValue).itemReference = {
			levelName: '',
			pathName: '/Game/FactoryGame/Resource/Parts/Rotor/Desc_Rotor.Desc_Rotor_C'
		};
		((firstStack as DynamicStructPropertyValue).properties.NumItems as IntProperty).value = 5;

		return [firstContainer];
	};


	/**
	 * this test iterates through a list of "modificationMethods", where each modifies one or multiple objects. The test then checks whether the update persists through serialization and de-serialization.
	 */
	it.each([
		['modifies position of first player', ModifyPlayer],
		['modifies an item stack in a storage container', ModifyStorageContainer]
	])('example %s correctly', (_, modificationMethod: (save: SatisfactorySave) => { object: SaveEntity | SaveComponent, level: Level }[]) => {
		const savename = '265';
		const file = new Uint8Array(fs.readFileSync(path.join(__dirname, savename + '.sav'))).buffer;
		const save = ParseSaveSync(savename, file);

		// modify, write save, read save again
		const modifiedObjects = modificationMethod(save);
		ModifyObjects(save, ...modifiedObjects.map(wrapper => wrapper.object));
		WriteSaveSync(save, binary => {
			fs.writeFileSync(path.join(__dirname, savename + '_on-writing.bin'), Buffer.from(binary));
		});
		const modifiedFile = new Uint8Array(fs.readFileSync(path.join(__dirname, save.name + '_on-writing.sav'))).buffer;
		const modifiedSave = ParseSaveSync(savename, modifiedFile);

		// for each modified object, check that modified save file has the equal object.
		for (const modifiedObject of modifiedObjects) {
			const relevantLevel = modifiedSave.levels[modifiedObject.level.name] as Level;
			const objectToCheck = relevantLevel.objects.find(obj => obj.instanceName === modifiedObject.object.instanceName) as SaveEntity | SaveComponent;
			expect(isDeepStrictEqual(objectToCheck, modifiedObject.object)).toEqual(true);
		}
	});
});

describe('parsing of saves', () => {
	const saveList: string[] = [

		'EmptySave10WithoutDestroyedActors',				// 1.0 Empty Save without destroyed actors.
		'Release-001',			// 1.0 Save, almost empty.
		'Release-032',			// 1.0 Save
		'265',					// U8 save ported to 1.0
		'269',					// U8 save ported to 1.0

		'Fresh-1.1-Dismantled',	// 1.1 with Dismantled Crashsite.

		'Unlock-1.1-2',			// 1.1 Save
		'FreshStartU8001-vehicles-2',	// U8 save
		'FreshStart001',		// U6/U7 save
		'FreshStart002',		// U6/U7 save, even lower saveVersion (36)

		'Release-Ported-U1-to-U1.1',							// U1 ported to U1.1
		'Release-Ported-U1-to-U1.1-Collected-Nuts-and-Berry',	// U1 ported to U1.1
		'Release-Ported-U1-to-U1.1-Collected-Blue-Slug',		// U1 ported to U1.1

		// Mods in 1.1
		'ficsitcam-1',
		'structuralsolutions-1',
		'x3-roads-signs',
		'pep-modtest-1',
		'Modding-Testing-MLB-003',	// 1.1 modular LBs and alternates

		'Dunarr-076',				// 1.1 FicsItNetworks

		'Modding-Experimental-01',		// 1.1 SaveCustomVersion 53. Already has annoying changes to properties.
		'Empty-Save-Before-1.2',		// 1.1 jsut before 1.2 release
		'Another-1-2',				// 1.2 Fresh Release
		'Ported-11-to-12-Exp'
	];

	it.each(saveList)('can parse a binary save (%s) to json with stream and with sync', async (savename: string) => {

		const filepath = path.join(__dirname, savename + '.sav');
		const binaryFilepathStream = path.join(__dirname, savename + '.stream.bin');
		const binaryFilepathSync = path.join(__dirname, savename + '.sync.bin');
		const file = new Uint8Array(fs.readFileSync(filepath)).buffer;
		const outJsonPathStream = path.join(__dirname, savename + '.stream.json');
		const outJsonPathSync = path.join(__dirname, savename + '.sync.json');

		// a high highwatermark can help in not having so many "pull"-requests to the readablesource, so less calls on consumer side.
		// However, the write speed of the writestream is still a limit for consumption.
		const outJsonStream = fs.createWriteStream(outJsonPathStream, { highWaterMark: 1024 * 1024 * 200 });
		const { stream, startStreaming } = ReadableStreamParser.CreateReadableStreamFromSaveToJson(savename, file, {
			onDecompressedSaveBody: decompressedBody => {
				fs.writeFileSync(binaryFilepathStream, Buffer.from(decompressedBody));
			}, onProgress: (progress, msg) => {
				console.log(`parsing stream progress ${savename}`, progress, msg);
			}
		});

		// streaming to file, WritableStream is from stream
		const start = performance.now();
		startStreaming();
		stream.pipeTo(Writable.toWeb(outJsonStream));

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

		const json1 = fs.readFileSync(outJsonPathSync, { encoding: 'utf-8' });
		const json2 = fs.readFileSync(outJsonPathStream, { encoding: 'utf-8' });

		// check that the minified jsons of stream and sync parsing are equal.

		const thing1 = JSON.parse(json1) as SatisfactorySave;
		const thing2 = JSON.parse(json2) as SatisfactorySave;
		expect(JSON.stringify(thing1).length).toEqual(JSON.stringify(thing2).length);

		// check reading back written save
		const saveSerializedAndRead = () => ParseSaveSync(savename, file);
		expect(saveSerializedAndRead).not.toThrow();
	});


	it.each(saveList)('can write a synchronous save (%s)', async (savename) => {
		const filepath = path.join(__dirname, savename + '.sync.json');
		const save = JSON.parse(fs.readFileSync(filepath, { encoding: 'utf-8' })) as SatisfactorySave;
		WriteSaveSync(save, binary => {
			fs.writeFileSync(path.join(__dirname, savename + '_on-writing.bin'), new Uint8Array(Buffer.from(binary)));
		});
	});
});

describe('parsing of blueprints', () => {
	it.each([

		'U1-1-Single-Container',	// U1.1 
		'U1-1-Single-Container-2',	// U1.1

		'BlueprintWithHeaderV1',	// blueprint saved before v2 header was introduced (in U8 i think)

		'release-single-wall',					// U1
		'release-storage-mk1',					// U1
		'release-storage-mk2-blueprintmk2',		// U1
		'release-two-foundations',				// U1

		'two-foundations-1-2',					// U1.2

		'mod-circuitry'							// U1.1 mod circuitry

	])('parser can read and write a synchronous blueprint: %s', async (blueprintname) => {
		const filepathBlueprint = path.join(__dirname, blueprintname + '.sbp');
		const filepathBlueprintConfig = path.join(__dirname, blueprintname + '.sbpcfg');
		const binaryFilepath = path.join(__dirname, blueprintname + '.bins');
		const file = new Uint8Array(fs.readFileSync(filepathBlueprint)).buffer;
		const configFileBuffer = new Uint8Array(fs.readFileSync(filepathBlueprintConfig)).buffer;

		let binaryBodyLength = 0;
		const blueprint = ParseBlueprintSync(blueprintname, file, configFileBuffer, (decompressedBody) => {
			binaryBodyLength = decompressedBody.byteLength;
			fs.writeFileSync(binaryFilepath, Buffer.from(decompressedBody));
		});

		fs.writeFileSync(path.join(__dirname, blueprintname + '.json'), JSON.stringify(blueprint, null, 4));

		// write again
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
					fs.writeFileSync(path.join(__dirname, blueprintname + '.bins_modified'), new Uint8Array(Buffer.from(binary)));
					expect(binary.byteLength).toEqual(binaryBodyLength);
				},
			});

		// write complete .sbp file back to disk
		fs.writeFileSync(path.join(__dirname, blueprintname + '.sbp_modified'), new Uint8Array(Buffer.concat([mainFileHeader!, ...mainFileBodyChunks])));
		fs.writeFileSync(path.join(__dirname, blueprintname + '.sbpcfg_modified'), new Uint8Array(Buffer.from(response.configFileBinary)));

		// test reading modified blueprint again.
		const mainFileNew = new Uint8Array(fs.readFileSync(path.join(__dirname, blueprintname + '.sbp_modified'))).buffer;
		const configFileNew = new Uint8Array(fs.readFileSync(path.join(__dirname, blueprintname + '.sbpcfg_modified'))).buffer;

		const blueprintNew = ParseBlueprintSync(blueprintname, mainFileNew, configFileNew, (decompressedBody) => {
			expect(decompressedBody.byteLength).toEqual(binaryBodyLength);
		});
	});
});

describe('when ignoring errors', () => {
	let spy: jest.SpyInstance | undefined;
	const file = new Uint8Array(fs.readFileSync(path.join(__dirname, 'Dunarr-027.sav'))).buffer;
	const parseSaveWithoutErrors = () => ParseSaveSync('Dunarr', file, () => { }, false);

	afterEach(() => {
		spy?.mockRestore();
	});

	it('after encountering an error in the property read method, continues parsing.', () => {
		spy = jest.spyOn(FINNetworkTraceMod.FINNetworkTrace, 'read');

		// first call for this test throws, subsequent calls use the original read()
		(spy as jest.Mock).mockImplementationOnce((reader: any) => {
			throw new Error('unexpected error.');
		});

		expect(parseSaveWithoutErrors).not.toThrow();
		expect(spy).toHaveBeenCalled();
	});

	it('after reading a wrong number of bytes for a property, continues parsing.', () => {
		spy = jest.spyOn(FINNetworkTraceMod.FINNetworkTrace, 'read');

		(spy as jest.Mock).mockImplementationOnce((reader: ContextReader) => {

			// custom parsing method. reads way too little.
			reader.readInt32();
			return {
				reference: {
					levelName: '',
					pathName: ''
				}
			} satisfies FINNetworkTraceMod.FINNetworkTrace;
		});

		expect(parseSaveWithoutErrors).not.toThrow();
		expect(spy).toHaveBeenCalled();
	});

	it('after encountering a severe error, puts data of object into trailing data.', () => {
		spy = jest.spyOn(PropertiesListMod.PropertiesList, 'ParseList');

		(spy as jest.Mock).mockImplementationOnce((reader: any) => {
			throw new Error('unexpected error.');
		});

		const save = parseSaveWithoutErrors();
		const firstObjectInSave = Object.values(save!.levels).flatMap(level => level.objects).find(obj => obj.instanceName === 'Persistent_Level:PersistentLevel.BP_EnemySpawner371');

		expect(save).toBeDefined();
		expect(firstObjectInSave).toBeDefined();
		expect(firstObjectInSave!.trailingData.length).toEqual(475);
		expect(Object.entries(firstObjectInSave!.properties).length).toEqual(0);
	});
});