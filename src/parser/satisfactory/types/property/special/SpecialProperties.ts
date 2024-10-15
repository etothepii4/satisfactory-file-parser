import { BinaryReadable } from '../../../../byte/binary-readable.interface';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { ObjectReference } from '../../structs/ObjectReference';
import { Transform } from '../../structs/Transform';
import { vec2 } from '../../structs/vec2';
import { vec3 } from '../../structs/vec3';
import { BuildableSubsystemSpecialProperties, BuildableTypeInstance, ConveyorChainActorSpecialProperties, ConveyorChainSegmentSpecialProperties, ConveyorItemSpecialProperties, EmptySpecialProperties, PlayerSpecialProperties, PowerLineSpecialProperties, SpecialAnyProperties } from './SpecialAnyProperties';



export namespace SpecialProperties {

    export const ParseClassSpecificSpecialProperties = (reader: BinaryReadable, typePath: string, remainingLen: number): SpecialAnyProperties => {
        let property;

        const start = reader.getBufferPosition();
        switch (typePath) {
            case '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk1/Build_ConveyorBeltMk1.Build_ConveyorBeltMk1_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk2/Build_ConveyorBeltMk2.Build_ConveyorBeltMk2_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk3/Build_ConveyorBeltMk3.Build_ConveyorBeltMk3_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk4/Build_ConveyorBeltMk4.Build_ConveyorBeltMk4_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk5/Build_ConveyorBeltMk5.Build_ConveyorBeltMk5_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk6/Build_ConveyorBeltMk6.Build_ConveyorBeltMk6_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk1/Build_ConveyorLiftMk1.Build_ConveyorLiftMk1_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk2/Build_ConveyorLiftMk2.Build_ConveyorLiftMk2_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk3/Build_ConveyorLiftMk3.Build_ConveyorLiftMk3_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk4/Build_ConveyorLiftMk4.Build_ConveyorLiftMk4_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk5/Build_ConveyorLiftMk5.Build_ConveyorLiftMk5_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk6/Build_ConveyorLiftMk6.Build_ConveyorLiftMk6_C':

                // since U1.0 the conveyor items are now in ConveyorChainActor. Not anymore on the belt itself. so this count of items is always 0.
                reader.readInt32();
                property = {} satisfies EmptySpecialProperties;
                break;

            case '/Script/FactoryGame.FGConveyorChainActor':


                const lastBelt = ObjectReference.read(reader);
                const firstBelt = ObjectReference.read(reader);
                const countBeltsInChain = reader.readInt32();

                const beltsInChain: ConveyorChainSegmentSpecialProperties[] = [];
                for (let i = 0; i < countBeltsInChain; i++) {
                    const chainActorRef = ObjectReference.read(reader);
                    const beltRef = ObjectReference.read(reader);
                    const someCount = reader.readInt32();

                    //2,  6*24 + 12 somethings, not always 0
                    //4, 12*24 + 12 somethings
                    //6, 18*24 + 12 somethings
                    //almost looks like GUIDs
                    const unknownUseBytes = Array.from(reader.readBytes(someCount * 3 * 24 + 12));

                    // indices which items of this chain are on this belt.
                    const firstItemIndex = reader.readInt32();
                    const lastItemIndex = reader.readInt32();
                    const beltIndexInChain = reader.readInt32();

                    beltsInChain.push({
                        chainActorRef,
                        beltRef,
                        someCount,
                        unknownUseBytes,
                        firstItemIndex,
                        lastItemIndex,
                        beltIndexInChain
                    });
                }

                const unknownInts = [reader.readInt32(), reader.readInt32()] satisfies [number, number];
                const firstChainItemIndex = reader.readInt32();
                const lastChainItemIndex = reader.readInt32();
                const countItemsInChain = reader.readInt32();

                const items: ConveyorItemSpecialProperties[] = [];
                for (let n = 0; n < countItemsInChain; n++) {
                    reader.readInt32(); //0
                    const itemName = reader.readString();
                    reader.readInt32(); //0
                    const position = reader.readInt32();
                    items.push({ itemName, position });
                }

                property = {
                    firstBelt: firstBelt,
                    lastBelt: lastBelt,
                    beltsInChain,
                    unknownInts,
                    firstChainItemIndex,
                    lastChainItemIndex,
                    items
                } satisfies ConveyorChainActorSpecialProperties;

                break;

            case '/Game/FactoryGame/Buildable/Factory/PowerLine/Build_PowerLine.Build_PowerLine_C':
            case '/Game/FactoryGame/Events/Christmas/Buildings/PowerLineLights/Build_XmassLightsLine.Build_XmassLightsLine_C':

                property = {
                    source: ObjectReference.read(reader),
                    target: ObjectReference.read(reader)
                } as PowerLineSpecialProperties;

                if (remainingLen - (reader.getBufferPosition() - start) >= 24) {
                    property.sourceTranslation = vec3.ParseF(reader);
                    property.targetTranslation = vec3.ParseF(reader);
                }

                break;

            case '/Game/FactoryGame/Character/Player/BP_PlayerState.BP_PlayerState_C':

                // TODO - i don't know enough about player state yet. need more players.
                property = {} as PlayerSpecialProperties;

                // 241 = byte, byte, length? flag, id with length bytes
                property.flag = reader.readByte(); // 241?
                switch (property.flag) {
                    case 248: // default EOS
                        const eos = reader.readString();
                        property.eosData = reader.readString();
                        break;
                    case 25: // steam!?
                        break;
                    default:
                        break;
                }
                break;

            //buildables like foundations are now here
            // Persistent_Level:PersistentLevel.LightweightBuildableSubsystem
            case '/Script/FactoryGame.FGLightweightBuildableSubsystem':

                property = { buildables: [] } as BuildableSubsystemSpecialProperties;

                const entriesCount = reader.readInt32();
                if (entriesCount > 0) {

                    for (let i = 0; i < entriesCount; i++) {
                        reader.readInt32(); //0
                        const typePath = reader.readString();
                        const count = reader.readInt32();

                        const instances = [];
                        for (let j = 0; j < count; j++) {

                            const transform = Transform.Parse(reader);

                            reader.readInt32(); // 0


                            const swatchSlotTypePath = reader.readString();

                            reader.readInt32(); // 0
                            reader.readInt64(); // 0

                            const patternPath = reader.readString();

                            //TODO: whatever this is, not sure whether something is gonna be here.
                            const zeroes = vec2.Parse(reader);
                            const oneZeroOne = vec3.Parse(reader);
                            const unknownUseNumbers = [zeroes, oneZeroOne] as [vec2, vec3];

                            reader.readInt32(); // 0

                            const paintFinishPath = reader.readString();

                            reader.readInt32(); // 0
                            reader.readBytes(1); // 0

                            const recipeTypePath = reader.readString();

                            const blueprintProxy = ObjectReference.read(reader);

                            instances.push({
                                transform,
                                unknownUseNumbers,
                                swatchSlotTypePath,
                                paintFinishPath,
                                recipeTypePath,
                                patternPath,
                                blueprintProxy
                            } satisfies BuildableTypeInstance);
                        }

                        property.buildables.push({
                            typePath,
                            instances
                        });
                    }
                }

                break;

            default:
                // ignore / empty. Rest will land in trailing data anyway.
                property = {} satisfies EmptySpecialProperties;
                break;
        }

        return property;
    }

    export const SerializeClassSpecificSpecialProperties = (writer: ByteWriter, typePath: string, property: SpecialAnyProperties): void => {

        switch (typePath) {
            case '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk1/Build_ConveyorBeltMk1.Build_ConveyorBeltMk1_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk2/Build_ConveyorBeltMk2.Build_ConveyorBeltMk2_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk3/Build_ConveyorBeltMk3.Build_ConveyorBeltMk3_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk4/Build_ConveyorBeltMk4.Build_ConveyorBeltMk4_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk5/Build_ConveyorBeltMk5.Build_ConveyorBeltMk5_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk6/Build_ConveyorBeltMk6.Build_ConveyorBeltMk6_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk1/Build_ConveyorLiftMk1.Build_ConveyorLiftMk1_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk2/Build_ConveyorLiftMk2.Build_ConveyorLiftMk2_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk3/Build_ConveyorLiftMk3.Build_ConveyorLiftMk3_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk4/Build_ConveyorLiftMk4.Build_ConveyorLiftMk4_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk5/Build_ConveyorLiftMk5.Build_ConveyorLiftMk5_C':
            case '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk6/Build_ConveyorLiftMk6.Build_ConveyorLiftMk6_C':

                // see parsing behavior.
                writer.writeInt32(0);
                break;


            case '/Script/FactoryGame.FGConveyorChainActor':

                ObjectReference.write(writer, (property as ConveyorChainActorSpecialProperties).lastBelt);
                ObjectReference.write(writer, (property as ConveyorChainActorSpecialProperties).firstBelt);
                writer.writeInt32((property as ConveyorChainActorSpecialProperties).beltsInChain.length);

                for (const belt of (property as ConveyorChainActorSpecialProperties).beltsInChain) {
                    ObjectReference.write(writer, belt.chainActorRef);
                    ObjectReference.write(writer, belt.beltRef);
                    writer.writeInt32(belt.someCount);

                    writer.writeBytesArray(belt.unknownUseBytes);

                    writer.writeInt32(belt.firstItemIndex);
                    writer.writeInt32(belt.lastItemIndex);
                    writer.writeInt32(belt.beltIndexInChain);
                }

                writer.writeInt32((property as ConveyorChainActorSpecialProperties).unknownInts[0]);
                writer.writeInt32((property as ConveyorChainActorSpecialProperties).unknownInts[1]);
                writer.writeInt32((property as ConveyorChainActorSpecialProperties).firstChainItemIndex);
                writer.writeInt32((property as ConveyorChainActorSpecialProperties).lastChainItemIndex);
                writer.writeInt32((property as ConveyorChainActorSpecialProperties).items.length);

                for (const item of (property as ConveyorChainActorSpecialProperties).items) {
                    writer.writeInt32(0);
                    writer.writeString(item.itemName);
                    writer.writeInt32(0);
                    writer.writeInt32(item.position);
                }
                break;

            case '/Game/FactoryGame/Buildable/Factory/PowerLine/Build_PowerLine.Build_PowerLine_C':
            case '/Game/FactoryGame/Events/Christmas/Buildings/PowerLineLights/Build_XmassLightsLine.Build_XmassLightsLine_C':

                ObjectReference.write(writer, (property as PowerLineSpecialProperties).source);
                ObjectReference.write(writer, (property as PowerLineSpecialProperties).target);

                break;

            case '/Game/FactoryGame/Character/Player/BP_PlayerState.BP_PlayerState_C':

                writer.writeByte((property as PlayerSpecialProperties).flag);
                switch ((property as PlayerSpecialProperties).flag) {
                    case 248: // default EOS
                        writer.writeString('EOS');
                        writer.writeString((property as PlayerSpecialProperties).eosData!);
                        break;
                    case 25: // steam!?
                        break;
                    default:
                        break;

                }
                break;


            case '/Script/FactoryGame.FGLightweightBuildableSubsystem':

                writer.writeInt32((property as BuildableSubsystemSpecialProperties).buildables.length);

                if ((property as BuildableSubsystemSpecialProperties).buildables.length > 0) {

                    for (const buildable of (property as BuildableSubsystemSpecialProperties).buildables) {
                        writer.writeInt32(0);
                        writer.writeString(buildable.typePath);
                        writer.writeInt32(buildable.instances.length);

                        for (const instance of buildable.instances) {

                            Transform.Serialize(writer, instance.transform);
                            writer.writeInt32(0);


                            writer.writeString(instance.swatchSlotTypePath);

                            writer.writeInt32(0);
                            writer.writeInt64(0n);

                            writer.writeString(instance.patternPath);

                            //TODO: same, whatever this is
                            vec2.Serialize(writer, instance.unknownUseNumbers[0]);
                            vec3.Serialize(writer, instance.unknownUseNumbers[1]);

                            writer.writeInt32(0);

                            writer.writeString(instance.paintFinishPath);

                            writer.writeInt32(0);
                            writer.writeByte(0);


                            writer.writeString(instance.recipeTypePath);

                            ObjectReference.write(writer, instance.blueprintProxy);
                        }
                    }
                }

                break;
        }

    }
}
