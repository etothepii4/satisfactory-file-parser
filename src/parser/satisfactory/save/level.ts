
import { ContextWriter } from '../../context/context-writer';
import { HierarchyVersion } from '../../context/hierarchical-version-context';
import { SaveComponent } from "../types/objects/SaveComponent";
import { SaveEntity } from "../types/objects/SaveEntity";
import { FSaveObjectVersionData } from '../types/structs/binary/FSaveObjectVersionData';
import { ObjectReference } from "../types/structs/ObjectReference";
import { DataBlob } from './data-blob';
import { LevelToDestroyedActorsMap } from './level-to-destroyed-actors-map';
import { ObjectReferencesList } from './object-references-list';
import { SaveCustomVersion } from './save-custom-version';
import { SaveReader } from './save-reader';
import { TOCBlob } from './toc-blob';

/**
 * type for levels
 */
export type Level = {
	name: string;
	objects: (SaveEntity | SaveComponent)[];
	collectables: ObjectReference[];
	objectVersionData?: FSaveObjectVersionData;
	saveCustomVersion?: number;
	destroyedActorsMap?: LevelToDestroyedActorsMap;
	writesDestroyedActorsInTOCBlob: boolean;
}
export type Levels = { [levelName: string]: Level };


export namespace Level {

	export function Read(reader: SaveReader, levelName: string): Level {
		const level: Level = {
			name: levelName,
			objects: [],
			collectables: [],
			writesDestroyedActorsInTOCBlob: false
		}
		const isPersistentLevel = reader.context.mapName === levelName;

		// read blobs later
		const tocBlobMarker = TOCBlob.SkipOver(reader);
		const dataBlobMarker = DataBlob.SkipOver(reader);

		// save Version in Streaming level
		if (!isPersistentLevel) {
			if (reader.context.saveVersion.header >= SaveCustomVersion.SerializePerStreamableLevelTOCVersion) {
				level.saveCustomVersion = reader.readInt32();
			}
		}

		// for persistent level, we have LevelToDestroyedActorsMap, else collectibles + object version data
		// 2nd appearance of destroyed actors / collectables. the lists are equal at both locations
		if (isPersistentLevel) {
			level.destroyedActorsMap = LevelToDestroyedActorsMap.read(reader);
		} else {
			level.collectables = ObjectReferencesList.ReadList(reader);

			if (reader.context.saveVersion.header >= SaveCustomVersion.SerializeDataPackageVersionAndCustomVersions) {
				const shouldSerializePerObjectVersionData = reader.readInt32() >= 1;
				if (shouldSerializePerObjectVersionData) {
					level.objectVersionData = FSaveObjectVersionData.read(reader);
				}
			}
		}

		// set appropriate version context.
		HierarchyVersion.SetOnLevel(reader.context.saveVersion, level.saveCustomVersion);
		HierarchyVersion.SetOnLevel(reader.context.packageFileVersionUE5, level.objectVersionData?.packageFileVersion.ue5Version);

		// jump back and read TOCBlob, DataBlob with accurate save version
		const endOfLevelPosition = reader.getBufferPosition();
		reader.jumpTo(tocBlobMarker.position);
		TOCBlob.Read(reader, level.objects);
		let remainingSize = tocBlobMarker.length - (reader.getBufferPosition() - tocBlobMarker.position);

		// remaining data of toc blob. 1st appearance of destroyed actors / collectables.
		// list is equal to 2nd location.
		if (remainingSize > 0) {
			if (isPersistentLevel) {
				level.destroyedActorsMap = LevelToDestroyedActorsMap.read(reader);
			} else {
				level.collectables = ObjectReferencesList.ReadList(reader);
			}
			level.writesDestroyedActorsInTOCBlob = true;
		}

		if (remainingSize < 0) {
			console.warn(`remaining size ${remainingSize} not > 0 in level ${level.name}. Save may be corrupt.`);
		}

		reader.jumpTo(dataBlobMarker.position);
		DataBlob.Read(levelName, reader, level.objects, dataBlobMarker.length, reader.onProgressCallback);
		level.objects = level.objects.filter(Boolean);

		reader.jumpTo(endOfLevelPosition);
		return level;
	}

	export function Serialize(writer: ContextWriter, level: Level): void {

		// set appropriate version context.
		HierarchyVersion.SetOnLevel(writer.context.saveVersion, level.saveCustomVersion);
		HierarchyVersion.SetOnLevel(writer.context.packageFileVersionUE5, level.objectVersionData?.packageFileVersion.ue5Version);

		const isPersistentLevel = writer.context.mapName === level.name;
		TOCBlob.Write(writer, level, isPersistentLevel);

		// write entities
		DataBlob.Write(writer, level.objects, level.name);


		// only NOT in the persistent level, we have saveVersion
		if (!isPersistentLevel) {
			if (writer.context.saveVersion.header >= SaveCustomVersion.SerializePerStreamableLevelTOCVersion) {
				writer.writeInt32(level.saveCustomVersion ?? SaveCustomVersion.SerializePerStreamableLevelTOCVersion);
			}
		}

		// 2nd time destroyedActors or colelctibles list.
		if (isPersistentLevel) {
			LevelToDestroyedActorsMap.write(writer, level.destroyedActorsMap ?? {});
		} else {
			ObjectReferencesList.SerializeList(writer, level.collectables);

			if (writer.context.saveVersion.header >= SaveCustomVersion.SerializeDataPackageVersionAndCustomVersions) {
				writer.writeInt32(level.objectVersionData !== undefined ? 1 : 0);
				if (level.objectVersionData !== undefined) {
					FSaveObjectVersionData.write(writer, level.objectVersionData!);
				}
			}
		}

	}

}