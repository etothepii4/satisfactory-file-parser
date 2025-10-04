// types & classes for convenience
export * from './parser/satisfactory/blueprint/blueprint-config';
export * from './parser/satisfactory/blueprint/blueprint-config-version';
export * from './parser/satisfactory/blueprint/blueprint-header';
export * from './parser/satisfactory/blueprint/blueprint-header-version';
export * from './parser/satisfactory/blueprint/blueprint.types';
export * from './parser/satisfactory/save/factory-game-custom-version';
export * from './parser/satisfactory/save/level';
export * from './parser/satisfactory/save/level-to-destroyed-actors-map';
export * from './parser/satisfactory/save/satisfactory-save';
export * from './parser/satisfactory/save/satisfactory-save-header';
export * from './parser/satisfactory/save/save-body-chunks';
export * from './parser/satisfactory/save/save-custom-version';
export * from './parser/satisfactory/save/save-header-type';
export * from './parser/satisfactory/save/save.types';
export * from './parser/satisfactory/types/objects/SaveComponent';
export * from './parser/satisfactory/types/objects/SaveEntity';
export * from './parser/satisfactory/types/objects/SaveObject';
export * from './parser/satisfactory/types/property/generic/AbstractBaseProperty';
export * from './parser/satisfactory/types/property/generic/ArrayProperty/ArrayProperty';
export * from './parser/satisfactory/types/property/generic/ArrayProperty/BoolArrayProperty';
export * from './parser/satisfactory/types/property/generic/ArrayProperty/ByteArrayProperty';
export * from './parser/satisfactory/types/property/generic/ArrayProperty/DoubleArrayProperty';
export * from './parser/satisfactory/types/property/generic/ArrayProperty/EnumArrayProperty';
export * from './parser/satisfactory/types/property/generic/ArrayProperty/FloatArrayProperty';
export * from './parser/satisfactory/types/property/generic/ArrayProperty/Int32ArrayProperty';
export * from './parser/satisfactory/types/property/generic/ArrayProperty/Int64ArrayProperty';
export * from './parser/satisfactory/types/property/generic/ArrayProperty/ObjectArrayProperty';
export * from './parser/satisfactory/types/property/generic/ArrayProperty/SoftObjectArrayProperty';
export * from './parser/satisfactory/types/property/generic/ArrayProperty/StrArrayProperty';
export * from './parser/satisfactory/types/property/generic/ArrayProperty/StructArrayProperty';
export * from './parser/satisfactory/types/property/generic/ArrayProperty/TextArrayProperty';
export * from './parser/satisfactory/types/property/generic/BoolProperty';
export * from './parser/satisfactory/types/property/generic/ByteProperty';
export * from './parser/satisfactory/types/property/generic/DoubleProperty';
export * from './parser/satisfactory/types/property/generic/EnumProperty';
export * from './parser/satisfactory/types/property/generic/FloatProperty';
export * from './parser/satisfactory/types/property/generic/Int32Property';
export * from './parser/satisfactory/types/property/generic/Int64Property';
export * from './parser/satisfactory/types/property/generic/Int8Property';
export * from './parser/satisfactory/types/property/generic/MapProperty';
export * from './parser/satisfactory/types/property/generic/ObjectProperty';
export * from './parser/satisfactory/types/property/generic/SetProperty/Int32SetProperty';
export * from './parser/satisfactory/types/property/generic/SetProperty/ObjectSetProperty';
export * from './parser/satisfactory/types/property/generic/SetProperty/SetProperty';
export * from './parser/satisfactory/types/property/generic/SetProperty/StrSetProperty';
export * from './parser/satisfactory/types/property/generic/SetProperty/StructSetProperty';
export * from './parser/satisfactory/types/property/generic/SetProperty/Uint32SetProperty';
export * from './parser/satisfactory/types/property/generic/StrProperty';
export * from './parser/satisfactory/types/property/generic/StructProperty';
export * from './parser/satisfactory/types/property/generic/TextProperty';
export * from './parser/satisfactory/types/property/generic/Uint32Property';
export * from './parser/satisfactory/types/property/generic/Uint64Property';
export * from './parser/satisfactory/types/property/generic/Uint8Property';
export * from './parser/satisfactory/types/property/PropertiesList';
export * from './parser/satisfactory/types/property/special/BuildableSubsystemSpecialProperties';
export * from './parser/satisfactory/types/property/special/CircuitSpecialProperties';
export * from './parser/satisfactory/types/property/special/ConveyorChainActorSpecialProperties';
export * from './parser/satisfactory/types/property/special/ConveyorSpecialProperties';
export * from './parser/satisfactory/types/property/special/EmptySpecialProperties';
export * from './parser/satisfactory/types/property/special/ObjectsListSpecialProperties';
export * from './parser/satisfactory/types/property/special/PlayerSpecialProperties';
export * from './parser/satisfactory/types/property/special/PowerLineSpecialProperties';
export * from './parser/satisfactory/types/property/special/runtime-buildable-instance-data-version';
export * from './parser/satisfactory/types/property/special/SpecialDroneActionProperties';
export * from './parser/satisfactory/types/property/special/SpecialProperties';
export * from './parser/satisfactory/types/property/special/VehicleSpecialProperties';
export * from './parser/satisfactory/types/structs/col4';
export * from './parser/satisfactory/types/structs/DynamicStructPropertyValue';
export * from './parser/satisfactory/types/structs/FGDynamicStruct';
export * from './parser/satisfactory/types/structs/GUID';
export * from './parser/satisfactory/types/structs/GUIDInfo';
export * from './parser/satisfactory/types/structs/SaveBodyValidation';
export * from './parser/satisfactory/types/structs/MD5Hash';
export * from './parser/satisfactory/types/structs/mods/FicsItCam/FICFrameRange';
export * from './parser/satisfactory/types/structs/ObjectReference';
export * from './parser/satisfactory/types/structs/SoftObjectReference';
export * from './parser/satisfactory/types/structs/Transform';
export * from './parser/satisfactory/types/structs/vec2';
export * from './parser/satisfactory/types/structs/vec3';
export * from './parser/satisfactory/types/structs/vec4';
export * from './parser/satisfactory/types/structs/VehiclePhysicsData';

// should better be removed in a future update to prevent shenanigans.
export { BlueprintConfigReader, BlueprintReader } from './parser/satisfactory/blueprint/blueprint-reader';
export { BlueprintConfigWriter, BlueprintWriter } from './parser/satisfactory/blueprint/blueprint-writer';
export * from './parser/satisfactory/save/save-reader';
export { SaveWriter } from './parser/satisfactory/save/save-writer';
export { SaveStreamJsonStringifier } from './parser/stream/reworked/save-stream-json-stringifier';
export { SaveStreamWriter } from './parser/stream/reworked/save-stream-writer.class';

// errors
export * from './parser/error/parser.error';

// facade
export { Parser } from './parser/parser';
export { ReadableStreamParser } from './parser/stream/reworked/readable-stream-parser';

// edit
export * from './parser/satisfactory/edit/edit-constants';

