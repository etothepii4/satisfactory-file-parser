
/**
 * Source: FGFactoryBlueprintTypes.h
 */
export enum BlueprintHeaderVersion {
    // First version
    InitialVersion = 0,

    // Added item costs to the header
    AddedItemCosts,

    // Added recipe array for recipes used in the blueprint
    AddedUsedRecipes,

    // -----<new versions can be added above this line>-----
    VersionPlusOne,
    LatestVersion = VersionPlusOne - 1 // Last version to use
}