
/**
 * Source: https://github.com/EpicGames/UnrealEngine/blob/260bb2e1c5610b31c63a36206eedd289409c5f11/Engine/Source/Runtime/Core/Public/UObject/ObjectVersion.h#L40
 */
export enum EUnrealEngineObjectUE5Version {
    // Note that currently the oldest loadable package version is EUnrealEngineObjectUEVersion::VER_UE4_OLDEST_LOADABLE_PACKAGE
    // this can be enabled should we ever deprecate UE4 versions entirely
    //OLDEST_LOADABLE_PACKAGE = ???,

    // The original UE5 version, at the time this was added the UE4 version was 522, so UE5 will start from 1000 to show a clear difference
    INITIAL_VERSION = 1000,

    // Support stripping names that are not referenced from export data
    NAMES_REFERENCED_FROM_EXPORT_DATA,

    // Added a payload table of contents to the package summary
    PAYLOAD_TOC,

    // Added data to identify references from and to optional package
    OPTIONAL_RESOURCES,

    // Large world coordinates converts a number of core types to double components by default.
    LARGE_WORLD_COORDINATES,

    // Remove package GUID from FObjectExport
    REMOVE_OBJECT_EXPORT_PACKAGE_GUID,

    // Add IsInherited to the FObjectExport entry
    TRACK_OBJECT_EXPORT_IS_INHERITED,

    // Replace FName asset path in FSoftObjectPath with (package name, asset name) pair FTopLevelAssetPath
    FSOFTOBJECTPATH_REMOVE_ASSET_PATH_FNAMES,

    // Add a soft object path list to the package summary for fast remap
    ADD_SOFTOBJECTPATH_LIST,

    // Added bulk/data resource table
    DATA_RESOURCES,

    // Added script property serialization offset to export table entries for saved, versioned packages
    SCRIPT_SERIALIZATION_OFFSET,

    // Adding property tag extension,
    // Support for overridable serialization on UObject,
    // Support for overridable logic in containers
    PROPERTY_TAG_EXTENSION_AND_OVERRIDABLE_SERIALIZATION,

    // Added property tag complete type name and serialization type
    PROPERTY_TAG_COMPLETE_TYPE_NAME,

    // Changed UE::AssetRegistry::WritePackageData to include PackageBuildDependencies
    ASSETREGISTRY_PACKAGEBUILDDEPENDENCIES,

    // Added meta data serialization offset to for saved, versioned packages
    METADATA_SERIALIZATION_OFFSET,

    // Added VCells to the object graph
    VERSE_CELLS,

    // Changed PackageFileSummary to write FIoHash PackageSavedHash instead of FGuid Guid
    PACKAGE_SAVED_HASH,

    // OS shadow serialization of subobjects
    OS_SUB_OBJECT_SHADOW_SERIALIZATION,

    // Adds a table of hierarchical type information for imports in a package
    IMPORT_TYPE_HIERARCHIES,

    // -----<new versions can be added before this line>-------------------------------------------------
    // - this needs to be the last line (see note below)
    AUTOMATIC_VERSION_PLUS_ONE,
    AUTOMATIC_VERSION = AUTOMATIC_VERSION_PLUS_ONE - 1
};