# Satisfactory File Parser
This is an NPM TypeScript Module to parse Satisfactory Files. Satisfactory is a game released by Coffee Stain Studios.
The reporitory is written entirely in TypeScript and comes with Type Definitions.

This parser can read, modify and write:
- Save Files `.sav`
- Blueprint Files `.sbp`, `.sbpcfg`

# Supported Versions
The version support of the packages is indicated below. Some bugs might still be present, see Bug Reporting further down.

Game Version Files of U5 and below are NOT supported.

| Game Version   |      Package                 |
|:--------------:|:-----------------------------|
| <= U5          |  ❌                          |
| U6 + U7        |  ✅ 0.0.1 - 0.0.34           |
| U8             |  ✅ 0.1.20 - 0.3.7           |
| U1.0           |  ✅ >= 0.4.20                |

# Installation via npm
`npm install @etothepii/satisfactory-file-parser`

# Usage of Save Parsing

I recommend parsing via stream, to save RAM. The binary data of the whole save will still be in memory, but the converted JSON can be streamed. (You can of course keep reading the stream in memory).
The returned `stream` is a readable WHATWG stream of type string and represents a `SatisfactorySave` object. this object can be serialized again.
WHATWG is used by default by browsers. Node js can use them using `Writable.toWeb()` and `Writable.fromWeb()` for example.

```js
import * as fs from 'fs';
import * as path from 'path';
import { Writable } from 'stream';
import { WritableStream } from 'stream/web';
import { ReadableStreamParser } from '@etothepii/satisfactory-file-parser';

const filepath = path.join(__dirname, 'MySave.sav');
const file = fs.readFileSync(filepath);
const outJsonPath = path.join(__dirname, 'MySave.json');
const jsonFileStream = fs.createWriteStream(outJsonPath, { highWaterMark: 1024 * 1024 * 200 });     // your outgoing JSON stream. In this case directly to file.
const whatwgWriteStream = Writable.toWeb(jsonFileStream) as WritableStream<string>;                  // convert the file stream to WHATWG-compliant stream

const { stream, startStreaming } = ReadableStreamParser.CreateReadableStreamFromSaveToJson('MySave', file, decompressedBody => {
    console.log('on binary body data.');
}, (progress: number, msg: string | undefined) => {
    // a callback for reporting progress as number [0,1]. Sometimes has a message.
    console.log(`progress`, progress, msg);
});

stream.pipeTo(whatwgWriteStream);
jsonFileStream.on('close', () => {
    // write stream finished
});

startStreaming();
```

Consequently, writing a parsed save file back is just as easy.
The SaveParser has callbacks to assist during syncing on different occasions during the process.
For example, when writing the header or when writing a chunk of the save body.
The splitting in individual chunks enables you to more easily stream the binary data to somewhere else.
```js
import * as fs from 'fs';
import * as path from 'path';
import { Parser } from "@etothepii/satisfactory-file-parser";

// save is your SatisfactorySave object to serialize. In this example i read it back in from a json file.
const save = JSON.parse(fs.readFileSync(path.join(__dirname, 'MySave.json'), {encoding: 'utf-8'}));

let fileHeader: Uint8Array;
const bodyChunks: Uint8Array[] = [];
Parser.WriteSave(save, binaryBeforeCompressed => { 
    console.log('on binary data before being compressed.');
}, header => {
    console.log('on save header.');
    fileHeader = header;
}, chunk => {
    console.log('on save body chunk.');
    bodyChunks.push(chunk);
});

// write complete sav file back to disk
fs.writeFileSync('./MyModifiedSave.sav', Buffer.concat([fileHeader!, ...bodyChunks]));
```


## Inspecting Save Objects
Once you have the complete parsing done, the JSON is a `SatisfactorySave` object.
You can for example loop through players and print their cached names and positions.

```js
import { isSaveEntity, SatisfactorySave, SaveEntity, StrProperty } from '@etothepii/satisfactory-file-parser';

const objects = save.levels.flatMap(level => level.objects);
const players = objects.filter(obj => isSaveEntity(obj) && obj.typePath === '/Game/FactoryGame/Character/Player/Char_Player.Char_Player_C') as SaveEntity[];
for (const player of players) {
    const name = (player.properties.mCachedPlayerName as StrProperty).value;
    console.log(name, player.transform.translation);
}
```


# Usage of Blueprint Parsing
Note, that blueprints consist of 2 files. The `.sbp` main file and the config file `.sbpcfg`.

```js
import * as fs from 'fs';
import { Parser } from "@etothepii/satisfactory-file-parser";

const mainFile = fs.readFileSync('./MyBlueprint.sbp');
const configFile = fs.readFileSync('./MyBlueprint.sbpcfg');
const parsedBlueprint = Parser.ParseBlueprintFiles('MyBlueprint', mainFile, configFile);
```

Consequently, writing a blueprint into binary data works the same way with getting callbacks in the same style as the save parsing.
```js
import * as fs from 'fs';
import { Parser } from "@etothepii/satisfactory-file-parser";

let mainFileHeader: Uint8Array;
const mainFileBodyChunks: Uint8Array[] = [];
const summary = Parser.WriteBlueprintFiles(blueprint, mainFileBinaryBeforeCompressed => {
    console.log('on main file binary data before being compressed.');
}, header => {
    console.log('on main file blueprint header.');
    mainFileHeader = header;
}, chunk => {
    console.log('on main file blueprint body chunk.');
    mainFileBodyChunks.push(chunk);
});

// write complete .sbp file back to disk
fs.writeFileSync('./MyModifiedBlueprint.sbp', Buffer.concat([mainFileHeader!, ...mainFileBodyChunks]));

// write .sbpcfg file back to disk, we get that data from the result of WriteBlueprintFiles
fs.writeFileSync('./MyModifiedBlueprint.sbpcfg', Buffer.from(summary.configFileBinary));
```

# Bug Reports or Feedback
So far this was just a private hobby project. But i figure some people actually use it.
If you find a bug or have feedback about the parser, you can just open an issue on the github repo or hit me up on the satisfactory discord `etothepii`.

# Explicitly Supported Mods (No guarantee for other mods)
### Ficsit-Cam
### Structural Solutions

# Changelog
### [0.4.22] (2024-10-07)
#### compatibility fix
* referenced icon libraries in blueprints are now optional when being parsed.

### [0.4.21] (2024-10-07)
#### internal package restructuring
* restructured some internal packages.
* provides now typeguards for every property.

### [0.4.20] (2024-10-06)
#### bugfix
* added parsing of icon library reference to parsing blueprints.

### [0.4.19] (2024-10-06)
#### Migrated repo to public github

### [0.4.18] (2024-10-05)
#### updated README

### [0.4.17] (2024-10-05)
#### updated README
#### bugfix
* `ClientIdentityInfo` field names and structure got changed, since the meaning is now more clear.
* removed trailing object list from satisfactory save object.
* deleted entities references get serialized again, just based on collectables list.

### [0.4.16] (2024-10-03)
#### bugfix
* exporting `isSaveEntity` and `isSaveComponent` again.

### [0.4.15] (2024-10-02)
#### updated README
* changelog document doesn't seem linkable, so it is in the readme for now.

### [0.4.14] (2024-10-02)
#### updated README
* updated the code examples with more context
#### Internal renamings (won't affect you if you stick to the code examples)
* improved the interface for abstract parser classes
* extended some error log messages
* added an additional check when parsing struct property InventoryItem, since ported saves often have a few more bytes.
* changed function name `writeFloat()` to `writeFloat32()` of the save writer.
* changed variable name `saveOrBlueprintIndicator` to `objectVersion` for objects, since the meaning of that number became now more clear.


# License 
MIT License

Copyright (c) 2024 etothepii

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.