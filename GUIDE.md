
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

### SaveObjects
All `SaveObjects` are either a `SaveEntity` or `SaveComponent`. Whereas a `SaveEntity` references child components. This would refer in Unreal Engine to Component and Actor if i am not mistaken.

But both have "normal" generic `properties` and some objects have actually `specialProperties`, that are very specific to this type of object and get serialized extra in the save.
```js

SaveObject {
    typePath: string;
	rootObject: string;
	instanceName: string;
    properties: PropertiesMap;
	specialProperties: SpecialProperties.AvailableSpecialPropertiesTypes;
	trailingData: number[] = [];
	objectVersion: number;
	unknownType2: number;
}

SaveComponent = SaveObject & {
    parentEntityName: string;
}

SaveEntity = SaveObject & {
    needTransform: boolean;
	transform: Transform;
	wasPlacedInLevel: boolean;
	parentObjectRoot: string;
	parentObjectName: string;
	components: ObjectReference[];
}
```

### Generic Properties
All generic properties inherit from [AbstractBaseProperty](https://github.com/etothepii4/satisfactory-file-parser/blob/main/src/parser/satisfactory/types/property/generic/AbstractBaseProperty.ts).
For a given name, an object has property of type `AbstractBaseProperty | AbstractBaseProperty[]`. Which just means, that the game on rare occasions serializes multiple properties with the same name, just different `index` as number. Often this `index` is just not relevant, but as mentioned on rare occasions, the game tries to represent an array (Not to be confused with ArrayProperty).
Other properties such as `FloatProperty` inherit from the `AbstractBAseProperty`.
```js
type AbstractBaseProperty = {
	type: string;
	ueType: string;
	name?: string;
	guidInfo?: GUIDInfo;
	index?: number;
};

type FloatProperty = AbstractBaseProperty & {
    type: 'FloatProperty';
    value: number;
};
```

### Special Properties
They are specific to the type of object they are. For example objects of type `/Script/FactoryGame.FGLightweightBuildableSubsystem` always have some special properties, the parser calls this one `BuildableSubsystemSpecialProperties`. There you will find a specific structure.
Objects without any special properties, will always have `EmptySpecialProperties`. this is just the type for the parser to know.

## Collectibles (Slugs, Mercer Spheres, Somersloops, ...)
Collectibles in Satisfactory are only stored as objects in the save file, once they are visible to you.
If you collected them, they are instead in the `collectibles` array of a level.
So therefore you CAN NOT know the total list of collectibles alone from the save file, unless you uncovered everything in your save.

## FAQ on Game Object Values
 - `Where do i find buildables?` - They are just an object like every other object. Most objects are in the `Persistent_Level`.
 - `Where does a buildable hold the selected recipe?` - Pretty much every producing buildable has `mCurrentRecipe` as the property name, to hold a reference to the specific recipe that is selected.
 - `Where does a buildable hold power shards?` - In the `mInventoryPotential` property. Which in turn references just an InventoryComponent, you would have to search for it by `instanceName`
 - `Where does a buildable hold somersloops?` - In the `mCurrentProductionBoost` property. Which is a float, representing the amount of somer-slooping the producing building does.