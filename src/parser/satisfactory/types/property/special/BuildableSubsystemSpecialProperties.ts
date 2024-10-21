import { ByteReader } from '../../../../byte/byte-reader.class';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { col4 } from '../../structs/col4';
import { ObjectReference } from '../../structs/ObjectReference';
import { Transform } from '../../structs/Transform';



export const isBuildableSubsystemSpecialProperties = (obj: any): obj is BuildableSubsystemSpecialProperties => obj.type === 'BuildableSubsystemSpecialProperties';

export type BuildableSubsystemSpecialProperties = {
    type: 'BuildableSubsystemSpecialProperties';
    buildables: {
        typePath: string;
        instances: BuildableTypeInstance[];
    }[];
};

export namespace BuildableSubsystemSpecialProperties {
    export const Parse = (reader: ByteReader): BuildableSubsystemSpecialProperties => {

        const property: BuildableSubsystemSpecialProperties = {
            type: 'BuildableSubsystemSpecialProperties',
            buildables: []
        };

        const entriesCount = reader.readInt32();
        if (entriesCount > 0) {

            for (let i = 0; i < entriesCount; i++) {
                reader.readInt32(); //0
                const typePath = reader.readString();
                const count = reader.readInt32();

                const instances = [];
                for (let j = 0; j < count; j++) {

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

                    instances.push({
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
                        blueprintProxy
                    } satisfies BuildableTypeInstance);
                }

                property.buildables.push({
                    typePath,
                    instances
                });
            }
        }

        return property;
    };

    export const Serialize = (writer: ByteWriter, property: BuildableSubsystemSpecialProperties) => {

        writer.writeInt32(property.buildables.length);

        if (property.buildables.length > 0) {

            for (const buildable of property.buildables) {
                writer.writeInt32(0);
                writer.writeString(buildable.typePath);
                writer.writeInt32(buildable.instances.length);

                for (const instance of buildable.instances) {

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
};

