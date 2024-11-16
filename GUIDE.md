
# Basic Concepts
### SatisfactorySave
The [SatisfactorySave](https://github.com/etothepii4/satisfactory-file-parser/blob/main/src/parser/satisfactory/save/satisfactory-save.ts) is the main object getting parsed/serialized.
For Save Editing, only `header` and `levels` are relevant. The rest is meta info or info that does not change when the save changes.
```js
SatisfactorySave {
	name: string;
	header: SatisfactorySaveHeader;
	levels: Level[];
	...
}
```

### Level
Each [level](https://github.com/etothepii4/satisfactory-file-parser/blob/main/src/parser/satisfactory/save/level.class.ts) has an array of `objects` and `collectibles`. Collectibles refer to the Somersloops and slugs if you collected them. Objects refer to Constructors, Manufacturers, Belts, Pipes, Foundations etc and many more. Each of them is either a [SaveEntity](https://github.com/etothepii4/satisfactory-file-parser/blob/main/src/parser/satisfactory/types/objects/SaveEntity.ts) or [SaveComponent](https://github.com/etothepii4/satisfactory-file-parser/blob/main/src/parser/satisfactory/types/objects/SaveComponent.ts), which both inherit from [SaveObject](https://github.com/etothepii4/satisfactory-file-parser/blob/main/src/parser/satisfactory/types/objects/SaveObject.ts).
```js
Level {
    objects: (SaveEntity | SaveComponent)[];
    collectables: ObjectReference[];
}
```

### SaveEntity
A `SaveEntity` has a little more than `SaveComponent`. But both have "normal" generic `properties` and some objects have actually `specialProperties`, that are very specific to this type of object and get serialized extra in the save.
```js
Level {
    objects: (SaveEntity | SaveComponent)[];
    collectables: ObjectReference[];
}
```

## Inspecting Save Objects
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