// types & classes for convenience
export * from './parser/satisfactory/blueprint/blueprint.types';
export { DataFields } from './parser/satisfactory/objects/DataFields';
export * from './parser/satisfactory/objects/GUIDInfo';
export * from './parser/satisfactory/objects/property/generic/ArrayProperty';
export * from './parser/satisfactory/objects/property/generic/BasicProperty';
export * from './parser/satisfactory/objects/property/generic/BoolProperty';
export * from './parser/satisfactory/objects/property/generic/ByteProperty';
export * from './parser/satisfactory/objects/property/generic/DoubleProperty';
export * from './parser/satisfactory/objects/property/generic/EnumProperty';
export * from './parser/satisfactory/objects/property/generic/FloatProperty';
export * from './parser/satisfactory/objects/property/generic/Int32Property';
export * from './parser/satisfactory/objects/property/generic/Int64Property';
export * from './parser/satisfactory/objects/property/generic/Int8Property';
export * from './parser/satisfactory/objects/property/generic/MapProperty';
export * from './parser/satisfactory/objects/property/generic/ObjectProperty';
export * from './parser/satisfactory/objects/property/generic/SetProperty';
export * from './parser/satisfactory/objects/property/generic/StrProperty';
export * from './parser/satisfactory/objects/property/generic/StructProperty';
export * from './parser/satisfactory/objects/property/generic/TextProperty';
export * from './parser/satisfactory/objects/property/generic/Uint32Property';
export * from './parser/satisfactory/objects/property/generic/Uint64Property';
export * from './parser/satisfactory/objects/property/generic/Uint8Property';
export * from './parser/satisfactory/objects/property/special/SpecialAnyProperty';
export * from './parser/satisfactory/objects/SaveComponent';
export * from './parser/satisfactory/objects/SaveEntity';
export * from './parser/satisfactory/objects/ue/MD5Hash';
export * from './parser/satisfactory/objects/values/GUID';
export * from './parser/satisfactory/objects/values/ObjectReference';
export * from './parser/satisfactory/objects/values/SoftObjectReference';
export { Level } from './parser/satisfactory/save/level.class';
export { SatisfactorySave } from './parser/satisfactory/save/satisfactory-save';
export * from './parser/satisfactory/save/save.types';
export * from './parser/satisfactory/structs/util.types';

// should better be removed in a future update to prevent shenanigans.
export { BinaryOperable } from './parser/byte/binary-operable.interface';
export { BinaryReadable } from './parser/byte/binary-readable.interface';
export { ByteReader } from './parser/byte/byte-reader.class';
export { ByteWriter } from './parser/byte/byte-writer.class';
export { BlueprintConfigReader, BlueprintReader } from './parser/satisfactory/blueprint/blueprint-reader';
export { BlueprintConfigWriter, BlueprintWriter } from './parser/satisfactory/blueprint/blueprint-writer';
export { SaveReader } from './parser/satisfactory/save/save-reader';
export { SaveWriter } from './parser/satisfactory/save/save-writer';
export { SaveStreamJsonStringifier } from './parser/stream/reworked/save-stream-json-stringifier';
export { SaveStreamWriter } from './parser/stream/reworked/save-stream-writer.class';

// errors
export * from './parser/error/parser.error';

// facade
export * from './parser/file.types';
export { Parser } from './parser/parser';
export { ReadableStreamParser } from './parser/stream/reworked/readable-stream-parser';


// edit
export * from './parser/satisfactory/edit/edit-constants';
