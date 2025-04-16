import * as fs from 'fs';
import * as path from 'path';
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

const ParseSaveSync = (savename: string, file: ArrayBufferLike, onDecompressedSaveBody?: (body: ArrayBufferLike) => void): SatisfactorySave => {
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
	for (let i = 0; i < Object.values(save.levels).length; i++) {
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
		for (const level of Object.values(save.levels)) {
			for (let i = 0; i < level.objects.length; i++) {
				if (level.objects[i].instanceName === modifiedObject.instanceName) {
					level.objects[i] = modifiedObject;
				}
			}
		}
	}
}


const saveList = [
	//'Release 001',			// 1.0 Save, almost empty.
	//'Release 032',			// 1.0 Save
	//'265',					// U8 save ported to 1.0 - we have no ambition to support U8 in later versions, but it works for this save.
	//'269',					// same

	'Unlock 1.1',
	'Unlock 1.1-2',

	// Mods
	//'ficsitcam-1',
	//'structuralsolutions-1',
	//'x3-roads-signs'
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
	const inventory = Object.values(save.levels).flatMap(level => level.objects).find(obj => obj.instanceName === inventoryReference.value.pathName) as SaveComponent;
	const inventoryStacks = inventory.properties.mInventoryStacks as StructArrayProperty;
	const firstStack = inventoryStacks.values[0];

	// modify first item stack
	(((firstStack.value as DynamicStructPropertyValue).properties.Item as StructProperty).value as InventoryItemStructPropertyValue).itemName = '/Game/FactoryGame/Resource/Parts/Rotor/Desc_Rotor.Desc_Rotor_C';
	((firstStack.value as DynamicStructPropertyValue).properties.NumItems as Int32Property).value = 5;

	return [firstContainer];
};

/*
it('test byte manipulation', _ => {


	const testArrayBuffer = new ArrayBuffer(10);
	const view = new Uint8Array(testArrayBuffer, 0, testArrayBuffer.byteLength);
	const view2 = new DataView(testArrayBuffer, 0, testArrayBuffer.byteLength);
	console.log(ArrayBuffer.isView(view), view.byteOffset, view.byteLength, ArrayBuffer.isView(view2), view2.byteOffset, view2.byteLength);


	const view3 = new Uint8Array(testArrayBuffer, 10, 0);
	const view4 = new DataView(testArrayBuffer, 6, 4);
	console.log(ArrayBuffer.isView(view3), view3.byteOffset, view3.byteLength, ArrayBuffer.isView(view4), view4.byteOffset, view4.byteLength);

	// bei Uint8Array() is alles fein. ODer ArraYBuffer(32).
	// Aber bei Buffer.from(...) der ist inder regel größer mit offset. Also musst du das beachten wenn du ein File einliest?

	const file = fs.readFileSync('H://Games/Fessie_Fixed/mfx/mini-thing.dat');
	console.log('file has', file.byteOffset, file.byteLength);
	console.log('file arraybuffer has', file.buffer.byteLength, file.buffer instanceof SharedArrayBuffer, file.buffer instanceof ArrayBuffer);
	const array = new Uint8Array(file);  // Node.js' Buffer class can have an offset, that's why it is better to rewrap it in a TypedArray.  https://nodejs.org/api/buffer.html#bufbyteoffset
	console.log('array has', array.byteOffset, array.byteLength, array, array.buffer.byteLength);
	const maybeCoolView = new DataView(file.buffer);
	console.log('i have my cool view', maybeCoolView.byteOffset, maybeCoolView.byteLength, maybeCoolView.buffer.byteLength, file.readInt32LE(0), file.readInt32LE(4), file.readInt32LE(0), file.readInt32LE(8), file.readInt32LE(12), file.readInt32LE(16), file.readInt32LE(20))

	const arr = new Uint8Array([22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 66, 66, 66, 66, 67, 67, 67, 67, 68, 68, 68, 68]);
	console.log(arr.BYTES_PER_ELEMENT, arr.length, arr.byteOffset, arr.byteLength, arr, arr.buffer.byteLength);
	const data = Buffer.from(arr.buffer, 0, 32);
	console.log(data.BYTES_PER_ELEMENT, data.byteOffset, data.byteLength, data.length);


	const buf = Buffer.from(data.buffer, 6, 13);
	console.log(buf.byteOffset, buf.byteLength, buf);
	const viewNext = new DataView(buf.buffer);
	const viewOther = new Uint8Array(buf.buffer);
	console.log(viewNext.byteOffset, viewNext.byteLength, viewNext.getUint8(0), viewNext.getUint8(1), viewNext.getUint8(2), viewNext.getUint8(3), viewNext.getUint8(4), viewNext.getUint8(5), viewNext.getUint8(6), viewNext.getUint8(7));
	console.log(viewOther, viewOther.byteOffset, viewOther.byteLength);


	const save = Parser.ParseSave('whatever', array.buffer);

});
*/

/**
 * this test iterates through a list of "modificationMethods", where each modifies one or multiple objects. The test then checks whether the update persists through serialization and de-serialization.
 */
it.skip.each([
	['modifies position of first player', ModifyPlayer],
	['modifies an item stack in a storage container', ModifyStorageContainer]
])('example %s correctly', (_, modificationMethod: (save: SatisfactorySave) => { object: SaveEntity | SaveComponent, level: Level }[]) => {
	const savename = '265';
	const file = new Uint8Array(fs.readFileSync(path.join(__dirname, savename + '.sav'))).buffer;
	const save = ParseSaveSync(savename, file);

	// modify, write save, read save again
	const modifiedObjects = modificationMethod(save);
	ModifyObjects(save, ...modifiedObjects.map(wrapper => wrapper.object));
	WriteSaveSync(save);
	const modifiedFile = new Uint8Array(fs.readFileSync(path.join(__dirname, save.name + '_on-writing.sav'))).buffer;
	const modifiedSave = ParseSaveSync(savename, modifiedFile);

	// for each modified object, check that modified save file has the equal object.
	for (const modifiedObject of modifiedObjects) {
		const relevantLevel = modifiedSave.levels[modifiedObject.level.name] as Level;
		const objectToCheck = relevantLevel.objects.find(obj => obj.instanceName === modifiedObject.object.instanceName) as SaveEntity | SaveComponent;
		expect(isDeepStrictEqual(objectToCheck, modifiedObject.object)).toEqual(true);
	}
});

it.each(saveList)('can parse a binary save (%s) to json with stream and with sync', async (savename: string) => {
	const filepath = path.join(__dirname, savename + '.sav');
	const binaryFilepathStream = path.join(__dirname, savename + '.stream.bin');
	const binaryFilepathSync = path.join(__dirname, savename + '.sync.bin');
	const file = new Uint8Array(fs.readFileSync(filepath)).buffer;
	const outJsonPathStream = path.join(__dirname, savename + '.stream.json');
	const outJsonPathSync = path.join(__dirname, savename + '.sync.json');

	/*
	// a high highwatermark can help in not having so many "pull"-requests to the readablesource, so less calls on consumer side.
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
	*/

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


it.skip.each(saveList)('can write a synchronous save', async (savename) => {
	const filepath = path.join(__dirname, savename + '.sync.json');
	const save = JSON.parse(fs.readFileSync(filepath, { encoding: 'utf-8' })) as SatisfactorySave;
	WriteSaveSync(save, binary => {
		fs.writeFileSync(path.join(__dirname, save.name + '_on-writing.bin'), Buffer.from(binary));
	});
});


it.each([
	'U1-1-Single-Container',	// U1.1
	'U1-1-Single-Container-2'	// U1.1

	//'BlueprintWithHeaderV1',	// blueprint saved before v2 header was introduced (in U8 i think)

	//'release-single-wall',					// U1
	//'release-storage-mk1',					// U1
	//'release-storage-mk2-blueprintmk2',		// U1
	//'release-two-foundations',				// U1
])('can read and write a synchronous blueprint: %s', async (blueprintname) => {
	const filepathBlueprint = path.join(__dirname, blueprintname + '.sbp');
	const filepathBlueprintConfig = path.join(__dirname, blueprintname + '.sbpcfg');
	const binaryFilepath = path.join(__dirname, blueprintname + '.bins');
	const file = new Uint8Array(fs.readFileSync(filepathBlueprint)).buffer;
	const configFileBuffer = new Uint8Array(fs.readFileSync(filepathBlueprintConfig)).buffer;

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
