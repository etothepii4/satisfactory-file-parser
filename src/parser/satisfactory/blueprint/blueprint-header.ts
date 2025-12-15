import { ContextReader } from '../../context/context-reader';
import { ContextWriter } from '../../context/context-writer';
import { ObjectReference } from '../types/structs/ObjectReference';
import { vec3 } from '../types/structs/vec3';

/** @public */
export type BlueprintHeader = {
    headerVersion: number,
    saveVersion: number,
    buildVersion: number,
    designerDimension?: vec3;
    itemCosts: [ObjectReference, number][];
    recipeReferences: ObjectReference[];
}

export namespace BlueprintHeader {

    export const Parse = (reader: ContextReader): BlueprintHeader => {

        const headerVersion = reader.readInt32();
        const saveVersion = reader.readInt32();
        const buildVersion = reader.readInt32();
        const designerDimension = vec3.ParseInt(reader); // e.g. 4,4,4 - dimensions in foundation size

        // set context
        reader.context.headerVersion = headerVersion;
        reader.context.saveVersion = saveVersion;
        reader.context.buildVersion = buildVersion;


        // list of item costs.
        let itemTypeCount = reader.readInt32();
        const itemCosts = new Array<[ObjectReference, number]>(itemTypeCount).fill([{ levelName: '', pathName: '' }, 0]);
        for (let i = 0; i < itemTypeCount; i++) {
            let itemPathName = ObjectReference.read(reader);
            let itemCount = reader.readInt32();

            itemCosts[i] = [itemPathName, itemCount];
        }

        // list of recipes
        let recipeCount = reader.readInt32();
        const recipeReferences = new Array<ObjectReference>(recipeCount).fill({ levelName: '', pathName: '' });
        for (let i = 0; i < recipeCount; i++) {
            const recipeName = ObjectReference.read(reader);
            recipeReferences[i] = recipeName;
        }

        return {
            headerVersion,
            saveVersion,
            buildVersion,
            designerDimension,
            recipeReferences,
            itemCosts
        } satisfies BlueprintHeader;

    }

    export const Serialize = (writer: ContextWriter, header: BlueprintHeader): void => {

        writer.writeInt32(header.headerVersion);
        writer.writeInt32(header.saveVersion);
        writer.writeInt32(header.buildVersion);

        // we assume a minimum of 4 foundations dimensions, standard blueprint designer.
        let dimensions = [
            header.designerDimension?.x ?? 4,
            header.designerDimension?.y ?? 4,
            header.designerDimension?.z ?? 4,
        ].map(dim => dim < 4 ? 4 : dim);
        writer.writeInt32(dimensions[0]);
        writer.writeInt32(dimensions[1]);
        writer.writeInt32(dimensions[2]);

        // list of item costs.
        writer.writeInt32(header.itemCosts.length);
        for (const itemCost of header.itemCosts) {
            ObjectReference.write(writer, itemCost[0])
            writer.writeInt32(itemCost[1]);
        }

        // list of recipes.
        writer.writeInt32(header.recipeReferences.length);
        for (const recipeReference of header.recipeReferences) {
            ObjectReference.write(writer, recipeReference);
        }
    }
}