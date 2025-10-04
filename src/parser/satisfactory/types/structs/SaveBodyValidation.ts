import { ContextReader } from "../../../context/context-reader";
import { ContextWriter } from "../../../context/context-writer";



export type SaveBodyValidation = {
	grids: Grids;
};

export type Grids = {
    [parentName: string]: {
        cellSize: number;
        gridHash: number;
        children: {
            [name: string]: number;	// children object contains names and their binary size.
        }
    }
};

/**
 * Relates to FWorldPartitionValidationData in FWPSaveDataMigrationContext.h
 * so far has grids (WPActorCellMapping)
 * Is very static for normal game map.
 */
export namespace SaveBodyValidation {
    export const Parse = (reader: ContextReader): SaveBodyValidation => {

        reader.readInt32Zero();
		const grids: Grids = {};

		// normal game map has 6 grids: None, main grid, landscape grid, exploration grid, foliage grid, hlod0
		const count = reader.readInt32(); 
		for (let i=0; i<count; i++) {
			const gridName = reader.readString();

			const cellSize = reader.readInt32();
			const gridHash = reader.readUint32();
			grids[gridName] = { children: {}, cellSize, gridHash };

			const childrenCount = reader.readUint32();
			for (let i = 0; i < childrenCount; i++) {
				const levelInstanceName = reader.readString();
				const cellHash = reader.readUint32();
				grids[gridName].children[levelInstanceName] = cellHash;
			}
		}

        return {
            grids
        } satisfies SaveBodyValidation;
    }

    export const Serialize = (writer: ContextWriter, saveBodyValidation: SaveBodyValidation) => {
        writer.writeInt32(0);
        writer.writeInt32(Object.entries(saveBodyValidation.grids).length);
        for (const gridEntry of Object.entries(saveBodyValidation.grids)) {
            writer.writeString(gridEntry[0]);
            writer.writeInt32(gridEntry[1].cellSize);
            writer.writeUint32(gridEntry[1].gridHash);

            writer.writeUint32(Object.values(gridEntry[1].children).length);
            for (const child of Object.entries(gridEntry[1].children)) {
                writer.writeString(child[0]);
                writer.writeUint32(child[1]);
            }
        }
    }
}