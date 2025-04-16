
/**
 * Source: FGSaveManagerInterface.h
 */
export enum SaveHeaderType {
    InitialVersion = 0,

    // @2017-01-20: Added BuildVersion, MapName and MapOptions
    PrepareForLoadingMaps,

    // @2017-02-07: Added SessionId for autosaves
    AddedSessionId,

    // @2018-02-23 Added PlayDuration to header
    AddedPlayDuration,

    // @2018-04-10 SessionID from int32 to FString, also added when the save was saved
    SessionIDStringAndSaveTimeAdded,

    // @2019-01-15 Added session visibility to the header so we can set it up with the same visibility
    AddedSessionVisibility,

    // @2019-06-19 This was put in the wrong save version thingy and is now on experimental so can't remove it.
    LookAtTheComment,

    // @2021-01-22 UE4.25 Engine Upgrade. FEditorObjectVersion Changes occurred (notably with FText serialization)
    UE425EngineUpdate,

    // @2021-03-24 Added Modding properties and support
    AddedModdingParams,

    // @2021-04-15 UE4.26 Engine Upgrade. FEditorObjectVersion Changes occurred
    UE426EngineUpdate,

    // @2022-03-22 Added GUID to identify saves, it is for analytics purposes.
    AddedSaveIdentifier,

    // @2022-11-14 Added support for partitioned worlds (UE5)
    AddedWorldPartitionSupport,

    // @2023-03-08 Added checksum to detect save game modifications.
    AddedSaveModificationChecksum,

    // @2023-04-18 Added variable to indicate if creative mode is enabled for this save.
    AddedIsCreativeModeEnabled,

    // @2024-09-12 Added saveName to the header to have proper names on Consoles	<FL> [bgr]
    AddedSaveName,
}