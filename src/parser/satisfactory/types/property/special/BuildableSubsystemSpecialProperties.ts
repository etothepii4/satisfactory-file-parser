import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { SaveCustomVersion } from '../../../save/save-custom-version';
import { col4 } from '../../structs/col4';
import { ObjectReference } from '../../structs/ObjectReference';
import { Transform } from '../../structs/Transform';
import { PropertiesMap } from '../generic/AbstractBaseProperty';
import { PropertiesList } from '../PropertiesList';



export const isBuildableSubsystemSpecialProperties = (obj: any): obj is BuildableSubsystemSpecialProperties => obj.type === 'BuildableSubsystemSpecialProperties';

export type BuildableSubsystemSpecialProperties = {
    type: 'BuildableSubsystemSpecialProperties';
    buildables: {
        [typePath: string]: {
            typePath: string;
            instances: BuildableTypeInstance[];
        } | {
            typePath: '/Script/FactoryGame.BuildableBeamLightweightData',
            instances: BuildableBeamLightweightData[]
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

        if (reader.context.saveVersion !== undefined && reader.context.saveVersion >= SaveCustomVersion.LightweightBuildableSubsystemWritesRuntimeVersion) {
            property.currentLightweightVersion = reader.readInt32();
        }

        const entriesCount = reader.readInt32();
        if (entriesCount > 0) {

            for (let i = 0; i < entriesCount; i++) {
                reader.readInt32Zero();
                const typePath = reader.readString();
                const count = reader.readInt32();

                // when the type path is beam, the count is irrelevant? and the structure is different. Thanks CS. Added in 1.1
                if (typePath === '/Script/FactoryGame.BuildableBeamLightweightData') {

                    const instance = BuildableBeamLightweightData.Parse(reader);

                    property.buildables[typePath] = {
                        typePath,
                        instances: [...(property.buildables[typePath]?.instances ?? []), instance] as BuildableBeamLightweightData[]
                    };
                } else {

                    const instances: BuildableTypeInstance[] = [];
                    for (let j = 0; j < count; j++) {
                        console.log('buildable subsystem instance', j);
                        instances.push(BuildableTypeInstance.Parse(reader));
                    }

                    property.buildables[typePath] = {
                        typePath,
                        instances: [...(property.buildables[typePath]?.instances ?? []), ...instances] as BuildableTypeInstance[]
                    };
                }
            }
        }

        return property;
    };

    export const Serialize = (writer: ContextWriter, property: BuildableSubsystemSpecialProperties) => {

        if (writer.context.saveVersion !== undefined && writer.context.saveVersion >= SaveCustomVersion.LightweightBuildableSubsystemWritesRuntimeVersion) {
            writer.writeInt32(property.currentLightweightVersion ?? 1);
        }

        writer.writeInt32(Object.keys(property.buildables).length);

        if (Object.keys(property.buildables).length > 0) {

            for (const [typePath, buildable] of Object.entries(property.buildables)) {
                writer.writeInt32Zero();
                writer.writeString(typePath);
                writer.writeInt32(buildable.instances.length);

                for (const instance of buildable.instances) {

                    if (typePath === '/Script/FactoryGame.BuildableBeamLightweightData') {
                        BuildableBeamLightweightData.Serialize(writer, instance as BuildableBeamLightweightData);
                    } else {
                        BuildableTypeInstance.Serialize(writer, instance as BuildableTypeInstance);
                    }
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
    instanceSpecificData?: number;
};

export namespace BuildableTypeInstance {
    export const Parse = (reader: ContextReader) => {
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
        if (reader.context.saveVersion >= SaveCustomVersion.SerializePerStreamableLevelTOCVersion) {
            instanceSpecificData = reader.readInt32();   // observed 0 or 1
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

    export const Serialize = (writer: ContextWriter, instance: BuildableTypeInstance) => {
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

        if (writer.context.saveVersion >= SaveCustomVersion.SerializePerStreamableLevelTOCVersion) {
            writer.writeInt32(instance.instanceSpecificData ?? 0);
        }
    }
};

export type BuildableBeamLightweightData = {
    properties: PropertiesMap;
}

export namespace BuildableBeamLightweightData {
    export const Parse = (reader: ContextReader) => {
        return {
            properties: PropertiesList.ParseList(reader)
        };
    }

    export const Serialize = (writer: ContextWriter, instance: BuildableBeamLightweightData) => {
        PropertiesList.SerializeList(instance.properties, writer);
    }
}

