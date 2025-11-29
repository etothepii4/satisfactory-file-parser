# Changelog
Make sure to use the same version, when parsing and serializing saves.

### [3.2.1] (2025-11-29)
#### SaveBodyValidation moved slightly
* `save.grids` and `save.gridHash` merged together in a `save.saveBodyValidation` property. This will not affect you, unless you specifically used them. But will break parsing/serializing saves of earlier parser versions.
#### SaveBodyValidation moved slightly
* Types exported by `MapProperty` changed slightly. The `MAP_STRUCT_KEY_PROXY` got renamed to `MAP_STRUCT_PROXY`. Values in MapProperties can be struct proxies too.
#### Extending Mod Support
* Added support for Modular Load Balancer Mod and Alternates

### [3.1.3] (2025-10-01)
#### Extending Mod Support
* Added Support for Mods that have custom levels/maps. Like the Platform Expansion Program

### [3.1.2] (2025-08-30)
#### Extending Mod Support
* Added Support for Circuitry Mod

### [3.1.1] (2025-08-24)
#### Bugfix for writing Blueprints
* Fixed a bug where serialized blueprints would have 4 bytes too much and would cause issues when reading again.
#### Internal Cleanup
* provided complete enums for custom versions `BlueprintHeaderVersion`, `SaveCustomVersion`, `SaveHeaderType`

### [3.0.3] (2025-08-08)
#### Internal Cleanup
* Renamed sample test saves to not include whitespaces.
* Made some function return types explicit instead of implicit.
* added publishing the package on jsr

### [3.0.2] (2025-06-25)
#### Bugfix for Dismantled Crashsites and Map Markers
* Dismantled Crashsites weren't parsed correctly. They now correctly show up in the `destroyedActors` field of the persistent level.
* Map Markers weren't parsed correctly. They should be fixed now.

### [3.0.1] (2025-04-20)
#### Breaking Changes in Save Structure for 1.1
* The save header in 1.1 has now the save file name. Which gets used over the passed name when the file is from 1.1.
* Save objects have 1-2 new fields.
* `BuildableSubsystemSpecialProperties` have now a slightly different structure. Their buildables `typePath` gets replaced with an object reference `typeReference`.
* SaveObject's field `unknownType2` is now called `shouldMigrateObjectRefsToPersistent`.
* SaveObject's field `objectVersion` is now called `saveCustomVersion`.
* Levels also have a field `saveCustomVersion`.
* `BuildableSubsystemSpecialProperties` have one more field (`currentLightweightVersion`).
* The `parentObjectRoot` and `parentObjectName` got merged to `parentObject` as a Reference struct, instead of two strings.
* The `objects` of `VehicleSpecialProperties` are now of type `VehiclePhysicsData` instead of just listing `unknownBytes`.
* Levels within a Save are not an array, but an object with level name as key now. You can use `Object.values(levels)`to get your array.
* Blueprint Configs have now a `configVersion`
* InventoryItems' naming of fields changed. `itemStateRaw` is now better resolved into individual `properties`
* InventoryItems have now a ObjectReference `itemReference` instead of the single string `itemName`, since that is more correct. InventoryItems' fields are also mostly optional due to compatibility.

#### Internal Updates
* Some internal changes like making Reader and Writer have context. To support different save versions.
* `SatisfactorySaveHeader` and `BlueprintHeader` have their own namespace now.


### [2.1.3] (2024-11-24)
#### Update README
* fixed link to auto-generated typedoc.

### [2.1.2] (2024-11-24)
#### Update README
* fixed link to auto-generated typedoc.

### [2.1.1] (2024-11-24)
#### Blueprint structure
* Item costs and recipes in a blueprint are now correctly treated as ObjectReference, instead a single path string.
#### Internal Updates
* Migrated the rest of the generic properties towards namespaces
#### Updated README examples
#### Provided auto-generated typedoc

### [2.0.1] (2024-10-31)
#### Normal Properties Update
* Most Normal Properties classes got refactored to namespaces as well. More will come. Please refrain from using instances of them. Background being, that its anyway only static methods and types.
* Since normal properties of an object are effectively always of type `AbstractBaseProperty | AbstractBaseProperty[]`, the `AbstractBaseProperty` has now all fields and `BasicProperty` got removed as there is no difference anymore between the two. They would be the same now.
* type guards of "normal" properties like `isObjectProperty()` accept now `any` as parameter and should work now as expected
* Since ArrayProperties and SetProperties in the save format dont necessarily always have the same structure as their subtype, I introduced own types like `StrArrayProperty` and `Int32SetProperty` with corresponding type guards (e.g. `isStrArrayProperty()`). Means more overhead in code, but hence its more correct in usage.
#### Bugfix
* The total conveyor length in the special properties of a ConveyorChainActor got serialized as int32, but correctly now serializes as float32.

### [1.1.1] (2024-10-21)
#### Improved Special Properties
* Improved on SpecialProperties of BuildableSubsystem and ConveyorChainActor as the meaning became more clear.
* Special Properties are refactored into their own namespaces and exported.
* The union type `SpecialAnyProperties` is now automatically derived and more concisely named `SpecialProperties.AvailableSpecialPropertiesTypes` instead, in case you need it.

### [1.0.3] (2024-10-17)
#### Hotfix
* fix being forced to use callbacks when writing saves or blueprints.

### [1.0.2] (2024-10-17)
#### Internal renaming
* `...SpecialProperty` got all renamed to `...SpecialProperties`.

### [1.0.1] (2024-10-17)
#### Major breaking changes on Parser usage
* Cleaned Usage methods of Save / Blueprint Parsing. The callbacks are an optional additional parameter object now instead of required.
* Re-Added a method to parse Saves in memory again. (sorry for the inconvenience)
#### Internal structure changes
* `SatisfactorySave` structure changed, the `grids` and `gridHash` fields are slightly different now, since their meaning became more clear. Not relevant for normal save editing.
* `Level` is a namespace instead of a class now, since the classes had only static methods anyway.
#### module build now includes source maps
#### module build should now include a docs folder for auto-generated documentation

### [0.5.1] (2024-10-15)
#### Added Mod Support
#### Internal Renamings
* `DynamicStructPropertyValue` extracted to own file.
* Parsing of object data partially moved to `SaveObject`.
* Renamed `DataFields` class to `PropertiesList`.
* Moved parsing of class-specific properties into own namespace.
* `ObjectProperty` and `SoftObjectProperty` now reuse the correct method for parsing/serializing the reference value.

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
