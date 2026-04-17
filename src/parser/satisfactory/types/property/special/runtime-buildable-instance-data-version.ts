
/**
 * Source: SaveCustomVersion.h
 */
export enum RuntimeBuildableInstanceDataVersion {
    NoVersion,

    InitialVersion,
    // 2025-03-18: Added data specific to the type of the lightweight buildable. Used for beams.
    AddedTypeSpecificData,
    // 2025-09-26: Added BuiltBy info for leightweight buildables to make sure that things like foundations that are inherently lightweight dont violate sony TRC
    AddedBuiltBy,
    // 2026-03-19: Clamped the pattern rotation between 0-3. Any values over 3 were erroneously introduced and thus are wrapped to 0
    FixedUpInvalidPatternRotations,

    // -----<new versions can be added above this line>-------------------------------------------------
    VersionPlusOne,
    LatestVersion = VersionPlusOne - 1
}