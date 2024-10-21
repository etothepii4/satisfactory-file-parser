import * as fs from 'fs';
import * as path from 'path';
import { Writable } from 'stream';
import { WritableStream } from 'stream/web';
import { Parser } from '../parser/parser';
import { SatisfactorySave } from '../parser/satisfactory/save/satisfactory-save';
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

const saveList = [
	'Release 001',			// 1.0 Save, almost empty.
	'Release 032',			// 1.0 Save
	'264_ohne_Mods',		// U8 save ported to 1.0 - we have no ambition to support U8 in later versions, but it works for this save.

	// Mods
	'ficsitcam-1',
	'structuralsolutions-1',
	'mods-1',
	'x3-roads-signs'
];

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
	const secondParse = Parser.ParseSave(savename, file, {
		onDecompressedSaveBody: (decompressedBody) => {
			fs.writeFileSync(binaryFilepathSync, Buffer.from(decompressedBody));
		},
		onProgressCallback: (progress, msg) => {
			console.log(`progress`, progress, msg);
		}
	});
	fs.writeFileSync(outJsonPathSync, JSON.stringify(secondParse));
	const end2 = performance.now();

	console.log(`Sync Parsing took ${(end2 - start2) / 1000} seconds.`);

	// check that the minified jsons are equal.
	const json1 = fs.readFileSync(outJsonPathStream, { encoding: 'utf-8' });
	const json2 = fs.readFileSync(outJsonPathSync, { encoding: 'utf-8' });
	const thing1 = JSON.parse(json1) as SatisfactorySave;
	const thing2 = JSON.parse(json2) as SatisfactorySave;
	expect(JSON.stringify(thing1).length).toEqual(JSON.stringify(thing2).length);
});


it.each(saveList)('can write a synchronous save', async (savename) => {
	const filepath = path.join(__dirname, savename + '.sync.json');
	const save = JSON.parse(fs.readFileSync(filepath, { encoding: 'utf-8' })) as SatisfactorySave;

	let mainFileHeader: Uint8Array;
	const mainFileBodyChunks: Uint8Array[] = [];
	const response = Parser.WriteSave(save,
		header => {
			console.log('on header.');
			mainFileHeader = header;
		},
		chunk => {
			console.log('on main file.');
			mainFileBodyChunks.push(chunk);
		},
		{
			onBinaryBeforeCompressing: binary => {
				console.log('on binary.');
				fs.writeFileSync(path.join(__dirname, savename + '_on-writing.bin'), Buffer.from(binary));
			}
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
			console.log('on header.');
			mainFileHeader = header;
		}, chunk => {
			console.log('on main file.');
			mainFileBodyChunks.push(chunk);
		},
		{
			onMainFileBinaryBeforeCompressing: binary => {
				console.log('on binary.');
				fs.writeFileSync(path.join(__dirname, blueprintname + '.bins_modified'), Buffer.from(binary));
			},
		});

	// write complete .sbp file back to disk
	fs.writeFileSync(path.join(__dirname, blueprintname + '.sbp_modified'), Buffer.concat([mainFileHeader!, ...mainFileBodyChunks]));

	fs.writeFileSync(path.join(__dirname, blueprintname + '.sbpcfg_modified'), Buffer.from(response.configFileBinary));
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
