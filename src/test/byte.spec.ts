import * as fs from 'fs';
import * as path from 'path';
import { Writable } from 'stream';
import { WritableStream } from 'stream/web';
import { Parser } from '../parser/parser';
import { SatisfactorySave } from '../parser/satisfactory/save/satisfactory-save';
import { ReadableStreamParser } from '../parser/stream/reworked/readable-stream-parser';
const util = require('util');

beforeAll(() => {
	const fileLog = fs.createWriteStream(path.join(__dirname, './test-log.txt'), { flags: 'w' });
	const logOutput = process.stdout;
	console.log = (...e: any[]) => {
		fileLog.write(e.map(el => util.format(el)).join(' ') + '\n');
		logOutput.write(e.map(el => util.format(el)).join(' ') + '\n');
	};
});


it.each([
	'Release 001',			// 1.0 Save, almost empty.
	'Release 032',			// 1.0 Save
	'astrasav',				// apparently ported save form U8(?)
	'Unlock 003',			// Save with new buildings
	'Unlock 004',			// before explosions
	'Unlock 005',			// after explosions
	'264_ohne_Mods'			// U8 save ported to 1.0 - we have no ambition to support U8 in later versions, but it works for this save.
])('can stream a binary save (%s) to json with readablestream', async (savename: string) => {
	const filepath = path.join(__dirname, savename + '.sav');
	const binaryFilepath = path.join(__dirname, savename + '.bins');
	const file = fs.readFileSync(filepath);


	const outJsonPath = path.join(__dirname, savename + '.json');

	// a high highwatermark can help in not having so many "pull"-requests to the readablesource, so less waiting on consumer side.
	// However, the write speed of the writestream is still a limit for consumption.
	const outJsonStream = fs.createWriteStream(outJsonPath, { highWaterMark: 1024 * 1024 * 200 });


	// TODO: is a progress callback on a readable stream useful?? rather report progress on consuming that stream!
	const { stream, startStreaming } = ReadableStreamParser.CreateReadableStreamFromSaveToJson(savename, file, decompressedBody => {
		fs.writeFileSync(binaryFilepath, Buffer.from(decompressedBody));
	}, (progress: number, msg: string | undefined) => {
		console.log(`${new Date().toString()}: progress`, progress, msg);
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


	// Release xxx ?
	//257 = 64 seconds when streaming to file, 60 seconds when streaming in memory
	//FreshStartU8001 = 1.6 seconds when streaming to file, 1.2 seconds when streaming in memory
	console.log(`we are looking at ${(end - start) / 1000} seconds.`);
});


/*
it.each([
	//'Creative without Mods 7-2',
	//'Creative without Mods 7-3',
	//'Creative without Mods 7-4',
	//'Froddo U8',
	//'CreativeU8',
	//'257',
	//'FreshStartU8001-vehicles-2'
	//'210', //--> should be same like without mods.
	//'210-u8-wo-mods',
	//'210-u8-wo-mods-2',	// saved at playtime 248h 16m ~40s, at 4th November 2023 19:29
	//'Creative without Mods 3',
	//'Creative without Mods 5',
	//'FreshStartU8001',	// nothing removed
	//'FreshStartU8001-2',	// still nothing.
	//'FreshStartU8001-3',	// 2 foundations
	//'FreshStartU8002',		//
	//'FreshStartU8002-2',	//  001 but conveyorpole removed immediately.
	//'FreshStartU8002-3',	// before yellow slug
	//'FreshStartU8003',	// yellow slug removed
	//'FreshStartU8004',	// purple slug and 2 berries removed
	//'FreshStartU8005',	// 1 fart rock destroyed
	//'FreshStartU8006',	// 1 fart plant destroyed
	//'FreshStartU8007',	// 5 destructible rock destroyed
	//'FreshStartU8008',	// 2 more destructible rock destroyed, without moving the player really. SeeMs like destructible large rocks and gas pillars that are removed are saved in objects.
	//'FreshStartU8009',	// 004 with a handful of plants removed with chainsaw.
	//'FreshStartU8010',	// before crashsite.
	//'FreshStartU8011',	// collecting a few items at crashsite
	//'FreshStartU8012',	// opening drop pod
	//'FreshStartU8013',	// retrived hard drive into inventory.
	//'Session_Name_is_Too_Long_U8',
	//'FreshStartU8002-2-1',
	//'FreshStartU8002-2-2',
	//'FreshStartU8002-2-1_modified',
	//'FreshStartU8002-2-2_modified'
])('can read a synchronous save', async (savename) => {
	const filepath = path.join(__dirname, savename + '.sav');
	const binaryFilepath = path.join(__dirname, savename + '.bins');
	const file = fs.readFileSync(filepath);

	const start = performance.now();
	const save = Parser.ParseSaveFile(savename, file, decompressedBody => {
		fs.writeFileSync(binaryFilepath, Buffer.from(decompressedBody));
	}, (progress, msg) => {
		if (msg) {
			console.log(`${new Date().toString()}: progress`, progress, msg);
		}
	});
	const end = performance.now();

	// stream output to json file.
	const jsonWriteStream = fs.createWriteStream(path.join(__dirname, savename + '.json'), { highWaterMark: 1024 * 1024 * 200 });
	await SaveStreamJsonStringifier.StreamStringifySave(save, Writable.toWeb(jsonWriteStream));
	jsonWriteStream.close();

	//U7 --- FreshStart001 ~= 0.5s, 210 ~= 14s
	//U8 --- FreshStart001 ~= ?, 210 ~= ?
	console.log(`we are looking at ${(end - start) / 1000} seconds.`);
});
*/



it.each([
	'Release 001',			// 1.0 Save, almost empty.
	'Release 032',			// 1.0 Save
	'astrasav',				// apparently ported save form U8(?)
	'Unlock 003',			// Save with new buildings
	'Unlock 004',			// before explosions
	'Unlock 005',			// after explosions
	'264_ohne_Mods',	// belt with items on it.
])('can write a synchronous save', async (savename) => {
	const filepath = path.join(__dirname, savename + '.json');
	const save = JSON.parse(fs.readFileSync(filepath, { encoding: 'utf-8' })) as SatisfactorySave;

	let mainFileHeader: Uint8Array;
	const mainFileBodyChunks: Uint8Array[] = [];
	const response = Parser.WriteSave(save, binary => {
		console.log('on binary.');
		fs.writeFileSync(path.join(__dirname, savename + '_on-writing.bin'), Buffer.from(binary));
	}, header => {
		console.log('on header.');
		mainFileHeader = header;
	}, chunk => {
		console.log('on main file.');
		mainFileBodyChunks.push(chunk);
	});

	// write complete .sav file back to disk
	fs.writeFileSync(path.join(__dirname, savename + '_on-writing.sav'), Buffer.concat([mainFileHeader!, ...mainFileBodyChunks]));
});


it.each([
	'release-single-wall',
	'release-storage-mk1',
	'release-storage-mk2-blueprintmk2',
	'release-two-foundations',
])('can read and write a synchronous blueprint: %s', async (blueprintname) => {
	const filepathBlueprint = path.join(__dirname, blueprintname + '.sbp');
	const filepathBlueprintConfig = path.join(__dirname, blueprintname + '.sbpcfg');
	const binaryFilepath = path.join(__dirname, blueprintname + '.bin');
	const file = fs.readFileSync(filepathBlueprint);
	const configFileBuffer = fs.readFileSync(filepathBlueprintConfig);

	const blueprint = Parser.ParseBlueprintFiles(blueprintname, file, configFileBuffer, decompressedBlueprintBody => {
		fs.writeFileSync(binaryFilepath, Buffer.from(decompressedBlueprintBody));
	});

	fs.writeFileSync(path.join(__dirname, blueprintname + '.json'), JSON.stringify(blueprint, null, 4));

	let mainFileHeader: Uint8Array;
	const mainFileBodyChunks: Uint8Array[] = [];
	const response = Parser.WriteBlueprintFiles(blueprint, binary => {
		console.log('on binary.');
		fs.writeFileSync(path.join(__dirname, blueprintname + '.bin_modified'), Buffer.from(binary));
	}, header => {
		console.log('on header.');
		mainFileHeader = header;
	}, chunk => {
		console.log('on main file.');
		mainFileBodyChunks.push(chunk);
	});

	// write complete .sbp file back to disk
	fs.writeFileSync(path.join(__dirname, blueprintname + '.sbp_modified'), Buffer.concat([mainFileHeader!, ...mainFileBodyChunks]));

	fs.writeFileSync(path.join(__dirname, blueprintname + '.sbpcfg_modified'), configFileBuffer);
});

it.skip('benchmarks await values vs real values', async () => {
	const numOperations = 5000000;
	const start1 = performance.now();
	for (let i = 0; i < numOperations; i++) {
		const x = 20;
	}
	const end1 = performance.now();
	const start2 = performance.now();
	for (let i = 0; i < numOperations; i++) {
		const x = await 20;
	}
	const end2 = performance.now();

	console.log(`executed ${numOperations} times. Synchronous code needed ${end1 - start1} ms, while await synchronous code needed ${end2 - start2} ms`);
});
