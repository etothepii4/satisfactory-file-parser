
/**
 * Holds context during parsing. since levels and objects on individual basis can have varying versions (saveVersion, ue5packageVersion)
 */
export type HierarchyVersion = {
    header: number;
    level: number;
    object: number;
};

export namespace HierarchyVersion {
    export function CreateOnHeader(version: number): HierarchyVersion {
        return {
            header: version,
            level: version,
            object: version
        }
    }

    export function SetOnLevel(context: HierarchyVersion, version: number | undefined): void {
        context.level = version ?? context.header;
        context.object = version ?? context.header;
    }

    export function SetOnObject(context: HierarchyVersion, version: number | undefined): void {
        context.object = version ?? context.level;
    }
}

