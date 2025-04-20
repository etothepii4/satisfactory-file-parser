# Satisfactory File Parser
This is a TypeScript [github project](https://github.com/etothepii4/satisfactory-file-parser) to parse Satisfactory Saves/Blueprints. Satisfactory is a game released by Coffee Stain Studios.
The reporitory is written entirely in TypeScript and is bundled on [NPM](https://www.npmjs.com/package/@etothepii/satisfactory-file-parser).
The examples listed here are Node.js. Should work in browser as well.

This parser can read, modify and write:
- Save Files `.sav`
- Blueprint Files `.sbp`, `.sbpcfg`

The parser is for deep save editing, since it just parses to JSON and back.
The purpose to have an editable structure, game logic is not known.
It is recommended that you look at the parsed save/blueprint to get an idea what you want to edit.

# Supported Versions
The version support of the Game Updates is indicated below.
The parser is pretty compatible with older saves and blueprints (for example from U8).
If you still run into errors, let me know or raise an issue.
Game Version Files of U5 and below are NOT supported.

| Game Version   |      Package                 |
|:--------------:|:-----------------------------|
| <= U5          |  ❌ not compatible           |
| U6             |  ⚠️ mostly compatible        |
| U7             |  ⚠️ mostly compatible        |
| U8             |  ✅ compatible               |
| U1.0           |  ✅ compatible               |
| U1.1           |  ✅ compatible               |



# Version Migration
The parser will NOT MIGRATE from one game version to another, for compatibility reasons.
If you parse a U8 save, the parser will also serialize it back to a U8 save.

# Installation
#### npm
`npm install @etothepii/satisfactory-file-parser`
#### yarn
`yarn add @etothepii/satisfactory-file-parser`

# Bug Reports or Feedback
You can always raise an issue on the linked [github project](https://github.com/etothepii4/satisfactory-file-parser) or hit me up on the satisfactory discord `etothepii`.

# Mod Support ✅
By Default, most Mods just reuse Properties and Structs of the base game.
If however a Mod should not be working or have just objects with a lot of trailing unparseable data, Raise an issue or contact me.

Some explicitly tested mods include:
Ficsit-Cam, Structural Solutions, Linear Motion, Container Screens, Conveyor Wall Hole, X3-Signs, X3-Roads

# Reading a Save
Reading a Save in Memory.

```js
import * as fs from 'fs';
import { Parser } from '@etothepii/satisfactory-file-parser';

const file = new Uint8Array(fs.readFileSync('./MySave.sav')).buffer;
const save = Parser.ParseSave('MySave', file);

// write to json file
fs.writeFileSync('MySave.json', JSON.stringify(save));
```


You can also read a Save via stream, to save RAM.
The binary data of the whole save will still be in memory, but the converted JSON can be streamed. (You can of course keep reading the stream in memory).
The returned `stream` is a readable WHATWG stream of type string and represents a `SatisfactorySave` object. this object can be serialized again.
WHATWG is used by default by browsers. Node js can use them using `Writable.toWeb()` and `Writable.fromWeb()` for example.
```js
import * as fs from 'fs';
import { Writable } from 'stream';
import { WritableStream } from 'stream/web';
import { ReadableStreamParser } from '@etothepii/satisfactory-file-parser';

const file = fs.readFileSync('./MySave.sav');
const jsonFileStream = fs.createWriteStream('./MySave.json', { highWaterMark: 1024 * 1024 * 200 }); // your outgoing JSON stream. In this case directly to file.  
const whatwgWriteStream = Writable.toWeb(jsonFileStream) as WritableStream<string>;                  // convert the file stream to WHATWG-compliant stream

const { stream, startStreaming } = ReadableStreamParser.CreateReadableStreamFromSaveToJson('MySave', file);

stream.pipeTo(whatwgWriteStream);
jsonFileStream.on('close', () => {
    // write stream finished
});

startStreaming();
```

# Writing a Save
Consequently, writing a parsed save file back is just as easy.
The SaveParser has callbacks to assist during syncing on different occasions during the process.
For example, when writing the header or when writing a chunk of the save body.
The splitting in individual chunks enables you to more easily stream the binary data to somewhere else.
```js
import * as fs from 'fs';
import { Parser } from "@etothepii/satisfactory-file-parser";

let fileHeader: Uint8Array;
const bodyChunks: Uint8Array[] = [];
Parser.WriteSave(save, header => {
    console.log('on save header.');
    fileHeader = header;
}, chunk => {
    console.log('on save body chunk.');
    bodyChunks.push(chunk);
});

// write complete sav file back to disk
fs.writeFileSync('./MyModifiedSave.sav', Buffer.concat([fileHeader!, ...bodyChunks]));
```


# Reading Blueprints
Blueprints consist of 2 files. The `.sbp` main file and the config file `.sbpcfg`.

```js
import * as fs from 'fs';
import { Parser } from "@etothepii/satisfactory-file-parser";

const file = new Uint8Array(fs.readFileSync('./MyBlueprint.sbp')).buffer;
const configFile = new Uint8Array(fs.readFileSync('./MyBlueprint.sbpcfg')).buffer;
const blueprint = Parser.ParseBlueprintFiles('Myblueprint', mainFile, configFile);

// write to json file
fs.writeFileSync('Myblueprint.json', JSON.stringify(blueprint));
```

# Writing Blueprints
Consequently, writing a blueprint into binary data works the same way with getting callbacks in the same style as the save parsing.
```js
import * as fs from 'fs';
import { Parser } from "@etothepii/satisfactory-file-parser";

let mainFileHeader: Uint8Array;
const mainFileBodyChunks: Uint8Array[] = [];
const summary = Parser.WriteBlueprintFiles(blueprint,
    header => {
        console.log('on main file header.');
        mainFileHeader = header;
    },
    chunk => {
        console.log('on main file body chunk.');
        mainFileBodyChunks.push(chunk);
    }
);

// write complete .sbp file back to disk
fs.writeFileSync('./MyBlueprint.sbp', Buffer.concat([mainFileHeader!, ...mainFileBodyChunks]));

// write .sbpcfg file back to disk, we get that data from the result of WriteBlueprintFiles
fs.writeFileSync('./MyBlueprint.sbpcfg', Buffer.from(summary.configFileBinary));
```

## Additional Options on the Parser Methods
For every parser call, you can pass optional callbacks to receive additional info.
Like a callback on the decompressed save body. Parsing saves provides a callback for reporting progress [0,1] and an occasional message.
```js
const save = Parser.ParseSave('MySave', file.buffer, {
    onDecompressedSaveBody: (body) => console.log('on decompressed body', body.byteLength),
    onProgressCallback: (progress, msg) => console.log(progress, msg)
});
```
```js
const { stream, startStreaming } = ReadableStreamParser.CreateReadableStreamFromSaveToJson(savename, file, {
    onProgress: (progress, msg) => console.log(`progress`, progress, msg);
});
```
```js
const blueprint = Parser.ParseBlueprintFiles('Myblueprint', file, configFile, {
    onDecompressedBlueprintBody: (body) => console.log('on decompressed body', body.byteLength),
});
```

# Save Editing Examples (in JS/TS)
```js
import { SaveComponent, SaveEntity, StructArrayProperty, Int32Property, ObjectProperty, StrProperty, StructProperty, InventoryItemStructPropertyValue, DynamicStructPropertyValue } from '@etothepii/satisfactory-file-parser';

// method to overwrite save objects
// currently quite inefficient to loop through everything, so theres room to improve in a future version. Feel free to raise an issue.
const modifyObjects = (...modifiedObjects: (SaveEntity | SaveComponent)[]) => {
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

const objects = Object.values(save.levels).flatMap(level => level.objects);
const collectables = Object.values(save.levels).flatMap(level => level.collectables);
```

## Example Print Hub Terminal Location
```js
// get hub terminals. Beware that filter returns a COPIED array and not the original objects.
const hubTerminals = objects.filter(obj => obj.typePath === '/Game/FactoryGame/Buildable/Factory/HubTerminal/Build_HubTerminal.Build_HubTerminal_C') as SaveEntity[];
const firstHubPosition = hubTerminals[0].transform.translation;
console.log(`Hub terminal is located at ${firstHubPosition.x}, ${firstHubPosition.y}, ${firstHubPosition.z}`);
```

## Example Modify Player Locations
```js
const players = objects.filter(obj => obj.typePath === '/Game/FactoryGame/Character/Player/Char_Player.Char_Player_C') as SaveEntity[];
for (const player of players) {
    const name = (player.properties.mCachedPlayerName as StrProperty).value;
    player.transform.translation = {
        x: player.transform.translation.x + 5000,
        y: player.transform.translation.y + 5000,
        z: player.transform.translation.z,
    }
    console.log(`Player ${name} is now located at ${player.transform.translation.x}, ${player.transform.translation.y}, ${player.transform.translation.z}`);
}

// modify original save objects
modifyObjects(...players);
```

## Example Overwrite Item Stack in a Storage Container
```js
// get the first storage container, either mk1 or mk2.
const storageContainers = objects.filter(obj =>
    obj.typePath === '/Game/FactoryGame/Buildable/Factory/StorageContainerMk1/Build_StorageContainerMk1.Build_StorageContainerMk1_C'
    || obj.typePath === '/Game/FactoryGame/Buildable/Factory/StorageContainerMk2/Build_StorageContainerMk2.Build_StorageContainerMk2_C'
);
const firstContainer = storageContainers[0];

// the container has a reference name to an inventory component.
const inventoryReference = firstContainer.properties.mStorageInventory as ObjectProperty;
const inventory = objects.find(obj => obj.instanceName === inventoryReference.value.pathName) as SaveComponent;
const inventoryStacks = inventory.properties.mInventoryStacks as StructArrayProperty;
const firstStack = inventoryStacks.values[0];

// Items within ItemStacks are quite nested. And StructProperties can basically be anything.
// overwrite first item stack with 5 Rotors.
(((firstStack.value as DynamicStructPropertyValue).properties.Item as StructProperty).value as InventoryItemStructPropertyValue).itemReference = {
    levelName: '',
    pathName: '/Game/FactoryGame/Resource/Parts/Rotor/Desc_Rotor.Desc_Rotor_C'
};
((firstStack.value as DynamicStructPropertyValue).properties.NumItems as Int32Property).value = 5;

// modify original save object
modifyObjects(firstContainer);
```
# [Auto-Generated TypeDoc Reference](https://raw.githack.com/etothepii4/satisfactory-file-parser/main/docs/index.html).

# [Basic Guide](https://github.com/etothepii4/satisfactory-file-parser/blob/main/GUIDE.md).
More detailed explanation of some basic things in the parser.

# [Changelog](https://github.com/etothepii4/satisfactory-file-parser/blob/main/CHANGELOG.md)

# [Licence](https://github.com/etothepii4/satisfactory-file-parser/blob/main/LICENCE.md)