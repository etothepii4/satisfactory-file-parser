import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { SaveCustomVersion } from '../../../save/save-custom-version';
import { col4 } from '../../structs/col4';
import { FGDynamicStruct } from '../../structs/FGDynamicStruct';
import { ObjectReference } from '../../structs/ObjectReference';
import { Transform } from '../../structs/Transform';
import { RuntimeBuildableInstanceDataVersion } from './runtime-buildable-instance-data-version';



export const isBuildableSubsystemSpecialProperties = (obj: any): obj is BuildableSubsystemSpecialProperties => obj.type === 'BuildableSubsystemSpecialProperties';

export type BuildableSubsystemSpecialProperties = {
    type: 'BuildableSubsystemSpecialProperties';
    buildables: {
        [typePath: string]: {
            typePath: string;
            instances: BuildableTypeInstance[];
        }
    };
    currentLightweightVersion?: number;
};

export namespace BuildableSubsystemSpecialProperties {
    export const Parse = (reader: ContextReader): BuildableSubsystemSpecialProperties => {

        const property: BuildableSubsystemSpecialProperties = {
            type: 'BuildableSubsystemSpecialProperties',
            buildables: {},
            currentLightweightVersion: 0
        };

        if (reader.context.saveVersion >= SaveCustomVersion.LightweightBuildableSubsystemWritesRuntimeVersion) {
            property.currentLightweightVersion = reader.readInt32();
        }

        const entriesCount = reader.readInt32();
        if (entriesCount > 0) {

            for (let i = 0; i < entriesCount; i++) {
                reader.readInt32Zero();
                const typePath = reader.readString();
                const count = reader.readInt32();

                const instances: BuildableTypeInstance[] = [];
                for (let j = 0; j < count; j++) {
                    instances.push(BuildableTypeInstance.Parse(reader, property.currentLightweightVersion ?? 0));
                }

                property.buildables[typePath] = {
                    typePath,
                    instances: [...(property.buildables[typePath]?.instances ?? []), ...instances]
                };
            }
        }

        return property;
    };

    export const Serialize = (writer: ContextWriter, property: BuildableSubsystemSpecialProperties) => {

        if (writer.context.saveVersion >= SaveCustomVersion.LightweightBuildableSubsystemWritesRuntimeVersion) {
            writer.writeInt32(property.currentLightweightVersion ?? 1);
        }

        writer.writeInt32(Object.keys(property.buildables).length);

        if (Object.keys(property.buildables).length > 0) {

            for (const [typePath, buildable] of Object.entries(property.buildables)) {
                writer.writeInt32Zero();
                writer.writeString(typePath);
                writer.writeInt32(buildable.instances.length);

                for (const instance of buildable.instances) {
                    BuildableTypeInstance.Serialize(writer, instance as BuildableTypeInstance, property.currentLightweightVersion ?? 0);
                }
            }
        }
    };
}

export type BuildableTypeInstance = {
    transform: Transform;
    primaryColor: col4;
    secondaryColor: col4;
    usedSwatchSlot: ObjectReference;
    usedPattern: ObjectReference;
    usedMaterial: ObjectReference;
    usedSkin: ObjectReference;
    usedPaintFinish: ObjectReference;
    patternRotation: number;
    usedRecipe: ObjectReference;
    blueprintProxy: ObjectReference;
    instanceSpecificData?: FGDynamicStruct;
};

export namespace BuildableTypeInstance {
    export const Parse = (reader: ContextReader, lightWeightVersion: number) => {
        const transform = Transform.Parse(reader);

        const usedSwatchSlot = ObjectReference.read(reader);
        const usedMaterial = ObjectReference.read(reader);
        const usedPattern = ObjectReference.read(reader);
        const usedSkin = ObjectReference.read(reader);

        const primaryColor = col4.ParseRGBA(reader);
        const secondaryColor = col4.ParseRGBA(reader);

        const usedPaintFinish = ObjectReference.read(reader);
        const patternRotation = reader.readByte();
        const usedRecipe = ObjectReference.read(reader);
        const blueprintProxy = ObjectReference.read(reader);

        let instanceSpecificData;
        if (lightWeightVersion >= RuntimeBuildableInstanceDataVersion.AddedTypeSpecificData) {
            instanceSpecificData = FGDynamicStruct.Parse(reader);
        }

        return {
            transform,
            primaryColor,
            secondaryColor,
            usedSwatchSlot,
            usedMaterial,
            usedPattern,
            usedSkin,
            usedRecipe,
            usedPaintFinish,
            patternRotation,
            blueprintProxy,
            instanceSpecificData
        } satisfies BuildableTypeInstance;
    }

    export const Serialize = (writer: ContextWriter, instance: BuildableTypeInstance, lightweightVersion: number) => {
        Transform.Serialize(writer, instance.transform);

        ObjectReference.write(writer, instance.usedSwatchSlot);
        ObjectReference.write(writer, instance.usedMaterial);
        ObjectReference.write(writer, instance.usedPattern);
        ObjectReference.write(writer, instance.usedSkin);

        col4.SerializeRGBA(writer, instance.primaryColor);
        col4.SerializeRGBA(writer, instance.secondaryColor);

        ObjectReference.write(writer, instance.usedPaintFinish);
        writer.writeByte(instance.patternRotation);
        ObjectReference.write(writer, instance.usedRecipe);
        ObjectReference.write(writer, instance.blueprintProxy);

        if (lightweightVersion >= RuntimeBuildableInstanceDataVersion.AddedTypeSpecificData) {
            FGDynamicStruct.Serialize(writer, instance.instanceSpecificData!);
        }
    }
};

