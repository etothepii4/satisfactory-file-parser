
import { BinaryReadable } from "../../../byte/binary-readable.interface";
import { ByteWriter } from '../../../byte/byte-writer.class';
import { ParserError } from '../../../error/parser.error';
import { SaveWriter } from "../../save/save-writer";
import { SaveObject } from "../objects/SaveObject";
import { ObjectReference } from '../structs/ObjectReference';
import { Transform } from '../structs/Transform';
import { vec2 } from '../structs/vec2';
import { vec3 } from '../structs/vec3';
import { ArrayProperty } from './generic/ArrayProperty';
import { AbstractBaseProperty } from "./generic/BasicProperty";
import { BoolProperty } from './generic/BoolProperty';
import { ByteProperty } from './generic/ByteProperty';
import { DoubleProperty } from './generic/DoubleProperty';
import { EnumProperty } from './generic/EnumProperty';
import { FloatProperty } from './generic/FloatProperty';
import { Int32Property } from './generic/Int32Property';
import { Int64Property } from './generic/Int64Property';
import { Int8Property } from './generic/Int8Property';
import { MapProperty } from './generic/MapProperty';
import { ObjectProperty } from './generic/ObjectProperty';
import { SetProperty } from './generic/SetProperty';
import { SoftObjectProperty } from './generic/SoftObjectProperty';
import { StrProperty } from './generic/StrProperty';
import { StructProperty } from './generic/StructProperty';
import { TextProperty } from './generic/TextProperty';
import { Uint32Property } from './generic/Uint32Property';
import { Uint64Property } from './generic/Uint64Property';
import { Uint8Property } from './generic/Uint8Property';
import { BuildableSubsystemSpecialProperty, BuildableTypeInstance, ConveyorChainActorSpecialProperty, ConveyorChainSegmentSpecialProperty, ConveyorItemSpecialProperty, EmptySpecialProperty, PlayerSpecialProperty, PowerLineSpecialProperty, SpecialAnyProperty } from './special/SpecialAnyProperty';


export class DataFields {

	constructor() {

	}

	public static ParseProperties(obj: SaveObject, length: number, reader: BinaryReadable, buildVersion: number, typePath: string): void {
		const start = reader.getBufferPosition();

		obj.properties = {};
		if (length === 0) {
			console.warn(`properties length for object ${obj.instanceName} was indicated as 0. Which is suspicious. Skipping object properties.`);
			return;
		}

		let propertyName: string = reader.readString();
		while (propertyName !== 'None') {
			const parsedProperty = DataFields.ParseProperty(reader, buildVersion, propertyName);

			// if it already exists, make it an array.
			if (obj.properties[propertyName]) {
				if (!Array.isArray(obj.properties[propertyName])) {
					obj.properties[propertyName] = [obj.properties[propertyName] as AbstractBaseProperty];
				}
				(obj.properties[propertyName] as AbstractBaseProperty[]).push(parsedProperty);
			} else {
				obj.properties[propertyName] = parsedProperty;
			}

			propertyName = reader.readString();
		}

		reader.readInt32();	// 0

		const remainingLen = length - (reader.getBufferPosition() - start);
		obj.specialProperties = DataFields.ParseAdditionalSpecialProperties(reader, typePath, remainingLen);

		const remainingSize = length - (reader.getBufferPosition() - start);
		if (remainingSize > 0) {
			obj.trailingData = Array.from(reader.readBytes(remainingSize));
		} else if (remainingSize < 0) {
			throw new ParserError('ParserError', `Unexpected. Read more bytes than are indicated for entity ${obj.instanceName}. bytes left to read is ${remainingSize}`);
		}
	}

	public static ParseAdditionalSpecialProperties(reader: BinaryReadable, typePath: string, remainingLen: number): SpecialAnyProperty {
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
				property = {} satisfies EmptySpecialProperty;
				break;

			case '/Script/FactoryGame.FGConveyorChainActor':


				const lastBelt = ObjectReference.read(reader);
				const firstBelt = ObjectReference.read(reader);
				const countBeltsInChain = reader.readInt32();

				const beltsInChain: ConveyorChainSegmentSpecialProperty[] = [];
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

				const items: ConveyorItemSpecialProperty[] = [];
				for (let n = 0; n < countItemsInChain; n++) {
					reader.readInt32();	//0
					const itemName = reader.readString();
					reader.readInt32();	//0
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
				} satisfies ConveyorChainActorSpecialProperty;

				break;

			case '/Game/FactoryGame/Buildable/Factory/PowerLine/Build_PowerLine.Build_PowerLine_C':
			case '/Game/FactoryGame/Events/Christmas/Buildings/PowerLineLights/Build_XmassLightsLine.Build_XmassLightsLine_C':

				property = {
					source: ObjectProperty.ReadValue(reader),
					target: ObjectProperty.ReadValue(reader)
				} as PowerLineSpecialProperty

				if (remainingLen - (reader.getBufferPosition() - start) >= 24) {
					property.sourceTranslation = vec3.ParseF(reader);
					property.targetTranslation = vec3.ParseF(reader);
				}

				break;

			case '/Game/FactoryGame/Character/Player/BP_PlayerState.BP_PlayerState_C':

				// TODO - i don't know enough about player state yet. need more players.
				property = {} as PlayerSpecialProperty;

				// 241 = byte, byte, length? flag, id with length bytes

				property.flag = reader.readByte();	// 241?
				switch (property.flag) {
					case 248:	// default EOS
						const eos = reader.readString();
						property.eosData = reader.readString();
						break;
					case 25:	// steam!?
						break;
					default:
						break;
				}
				break;

			//buildables like foundations are now here
			// Persistent_Level:PersistentLevel.LightweightBuildableSubsystem
			case '/Script/FactoryGame.FGLightweightBuildableSubsystem':

				property = { buildables: [] } as BuildableSubsystemSpecialProperty;

				const entriesCount = reader.readInt32();
				if (entriesCount > 0) {

					for (let i = 0; i < entriesCount; i++) {
						reader.readInt32();	//0
						const typePath = reader.readString();
						const count = reader.readInt32();

						const instances = [];
						for (let j = 0; j < count; j++) {

							const transform = Transform.Parse(reader);

							reader.readInt32();	// 0


							const swatchSlotTypePath = reader.readString();

							reader.readInt32();		// 0
							reader.readInt64();		// 0

							const patternPath = reader.readString();

							//TODO: whatever this is, not sure whether something is gonna be here.
							const zeroes = vec2.Parse(reader);
							const oneZeroOne = vec3.Parse(reader);
							const unknownUseNumbers = [zeroes, oneZeroOne] as [vec2, vec3];

							reader.readInt32();		// 0

							const paintFinishPath = reader.readString();

							reader.readInt32();		// 0
							reader.readBytes(1);	// 0

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
				property = {} satisfies EmptySpecialProperty;
				break;
		}

		return property;
	}

	public static ParseProperty(reader: BinaryReadable, buildVersion: number, propertyName: string): AbstractBaseProperty {
		let currentProperty: any = {};

		//TODO assign type and index after parsing.
		const propertyType = reader.readString();
		const binarySize = reader.readInt32();

		const index = reader.readInt32();
		const before = reader.getBufferPosition();

		let overhead = 0;
		switch (propertyType) {
			case 'BoolProperty':
				currentProperty = BoolProperty.Parse(reader, propertyType, index);
				overhead = BoolProperty.CalcOverhead(currentProperty);
				break;

			case 'ByteProperty':
				currentProperty = ByteProperty.Parse(reader, propertyType, index);
				overhead = ByteProperty.CalcOverhead(currentProperty);
				break;

			case 'Int8Property':
				currentProperty = Int8Property.Parse(reader, propertyType, index);
				overhead = Int8Property.CalcOverhead(currentProperty);
				break;


			case 'UInt8Property':
				currentProperty = Uint8Property.Parse(reader, propertyType, index);
				overhead = Uint8Property.CalcOverhead(currentProperty);
				break;

			case 'IntProperty':
			case 'Int32Property':
				currentProperty = Int32Property.Parse(reader, propertyType, index);
				overhead = Int32Property.CalcOverhead(currentProperty);
				break;

			case 'UInt32Property':
				currentProperty = Uint32Property.Parse(reader, propertyType, index);
				overhead = Uint32Property.CalcOverhead(currentProperty);
				break;

			case 'Int64Property':
				currentProperty = Int64Property.Parse(reader, propertyType, index);
				overhead = Int64Property.CalcOverhead(currentProperty);
				break;

			case 'UInt64Property':
				currentProperty = Uint64Property.Parse(reader, propertyType, index);
				break;

			case 'SingleProperty':
			case 'FloatProperty':
				currentProperty = FloatProperty.Parse(reader, propertyType, index);
				overhead = FloatProperty.CalcOverhead(currentProperty);
				break;

			case 'DoubleProperty':
				currentProperty = DoubleProperty.Parse(reader, propertyType, index);
				overhead = DoubleProperty.CalcOverhead(currentProperty);
				break;

			case 'StrProperty':
			case 'NameProperty':
				currentProperty = StrProperty.Parse(reader, propertyType, index);
				overhead = StrProperty.CalcOverhead(currentProperty);
				break;

			case 'ObjectProperty':
			case 'InterfaceProperty':
				currentProperty = ObjectProperty.Parse(reader, propertyType, index);
				overhead = ObjectProperty.CalcOverhead(currentProperty);
				break;

			case 'SoftObjectProperty':
				currentProperty = SoftObjectProperty.Parse(reader, propertyType, index);
				overhead = SoftObjectProperty.CalcOverhead(currentProperty);
				break;

			case 'EnumProperty':
				currentProperty = EnumProperty.Parse(reader, propertyType, index);
				overhead = EnumProperty.CalcOverhead(currentProperty);
				break;

			case 'StructProperty':
				currentProperty = StructProperty.Parse(reader, propertyType, index, binarySize);
				overhead = StructProperty.CalcOverhead(currentProperty);
				break;

			case 'ArrayProperty':
				currentProperty = ArrayProperty.Parse(reader, propertyType, index, propertyName);
				overhead = ArrayProperty.CalcOverhead(currentProperty);
				break;

			case 'MapProperty':
				currentProperty = MapProperty.Parse(reader, propertyName, buildVersion, binarySize);
				overhead = MapProperty.CalcOverhead(currentProperty);
				break;

			case 'TextProperty':
				currentProperty = TextProperty.Parse(reader, propertyType, index);
				overhead = TextProperty.CalcOverhead(currentProperty);
				break;

			case 'SetProperty':
				currentProperty = SetProperty.Parse(reader, propertyType, index, propertyName);
				overhead = SetProperty.CalcOverhead(currentProperty);
				break;

			default:
				throw new Error(`Unimplemented type ${propertyType}`);
		}

		currentProperty.name = propertyName;

		const readBytes = reader.getBufferPosition() - before - overhead;
		if (readBytes !== binarySize) {
			console.warn(`possibly corrupt. Read ${readBytes} for ${propertyType} ${propertyName}, but ${binarySize} were indicated.`);
			throw new ParserError('ParserError', `possibly corrupt. Read ${readBytes} bytes for ${propertyType} ${propertyName}, but ${binarySize} bytes were indicated.`);
		}

		return currentProperty;
	}

	public static Serialize(obj: SaveObject, writer: SaveWriter, buildVersion: number, typePath: string): void {
		for (const property of Object.values(obj.properties).flatMap(val => Array.isArray(val) ? val : [val])) {
			writer.writeString(property.name);
			DataFields.SerializeProperty(writer, property, property.name, buildVersion);
		}
		writer.writeString('None');

		writer.writeInt32(0);
		DataFields.SerializeAdditionalSpecialProperties(writer, typePath, obj.specialProperties);
		writer.writeBytesArray(obj.trailingData);
	}

	public static SerializeAdditionalSpecialProperties(writer: ByteWriter, typePath: string, property: SpecialAnyProperty): void {


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

				ObjectReference.write(writer, (property as ConveyorChainActorSpecialProperty).lastBelt);
				ObjectReference.write(writer, (property as ConveyorChainActorSpecialProperty).firstBelt);
				writer.writeInt32((property as ConveyorChainActorSpecialProperty).beltsInChain.length);

				for (const belt of (property as ConveyorChainActorSpecialProperty).beltsInChain) {
					ObjectReference.write(writer, belt.chainActorRef);
					ObjectReference.write(writer, belt.beltRef);
					writer.writeInt32(belt.someCount);

					writer.writeBytesArray(belt.unknownUseBytes);

					writer.writeInt32(belt.firstItemIndex);
					writer.writeInt32(belt.lastItemIndex);
					writer.writeInt32(belt.beltIndexInChain);
				}

				writer.writeInt32((property as ConveyorChainActorSpecialProperty).unknownInts[0]);
				writer.writeInt32((property as ConveyorChainActorSpecialProperty).unknownInts[1]);
				writer.writeInt32((property as ConveyorChainActorSpecialProperty).firstChainItemIndex);
				writer.writeInt32((property as ConveyorChainActorSpecialProperty).lastChainItemIndex);
				writer.writeInt32((property as ConveyorChainActorSpecialProperty).items.length);

				for (const item of (property as ConveyorChainActorSpecialProperty).items) {
					writer.writeInt32(0);
					writer.writeString(item.itemName);
					writer.writeInt32(0);
					writer.writeInt32(item.position);
				}
				break;

			case '/Game/FactoryGame/Buildable/Factory/PowerLine/Build_PowerLine.Build_PowerLine_C':
			case '/Game/FactoryGame/Events/Christmas/Buildings/PowerLineLights/Build_XmassLightsLine.Build_XmassLightsLine_C':

				ObjectProperty.SerializeValue(writer, (property as PowerLineSpecialProperty).source);
				ObjectProperty.SerializeValue(writer, (property as PowerLineSpecialProperty).target);

				break;

			case '/Game/FactoryGame/Character/Player/BP_PlayerState.BP_PlayerState_C':

				writer.writeByte((property as PlayerSpecialProperty).flag);
				switch ((property as PlayerSpecialProperty).flag) {
					case 248:	// default EOS
						writer.writeString('EOS');
						writer.writeString((property as PlayerSpecialProperty).eosData!);
						break;
					case 25:	// steam!?
						break;
					default:
						break;

				}
				break;


			case '/Script/FactoryGame.FGLightweightBuildableSubsystem':

				writer.writeInt32((property as BuildableSubsystemSpecialProperty).buildables.length);

				if ((property as BuildableSubsystemSpecialProperty).buildables.length > 0) {

					for (const buildable of (property as BuildableSubsystemSpecialProperty).buildables) {
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


	public static SerializeProperty(writer: ByteWriter, property: AbstractBaseProperty, propertyName: string, buildVersion: number): void {

		writer.writeString(property.ueType);

		// binary length indicator
		const lenIndicator = writer.getBufferPosition();
		writer.writeInt32(0);

		// write index if it is not 0. Since it normally is.
		writer.writeInt32(property.index ?? 0);

		const start = writer.getBufferPosition();
		let overhead = 0;
		switch (property.ueType) {
			case 'BoolProperty':
				overhead = BoolProperty.CalcOverhead(property as BoolProperty);
				BoolProperty.Serialize(writer, property as BoolProperty);
				break;

			case 'ByteProperty':
				overhead = ByteProperty.CalcOverhead(property as ByteProperty);
				ByteProperty.Serialize(writer, property as ByteProperty);
				break;

			case 'Int8Property':
				overhead = Int8Property.CalcOverhead(property as Int8Property);
				Int8Property.Serialize(writer, property as Int8Property);
				break;

			case 'UInt8Property':
				overhead = Uint8Property.CalcOverhead(property as Uint8Property);
				Uint8Property.Serialize(writer, property as Uint8Property);
				break;

			case 'IntProperty':
			case 'Int32Property':
				overhead = Int32Property.CalcOverhead(property as Int32Property);
				Int32Property.Serialize(writer, property as Int32Property);
				break;

			case 'UInt32Property':
				overhead = Uint32Property.CalcOverhead(property as Uint32Property);
				Uint32Property.Serialize(writer, property as Uint32Property);
				break;

			case 'Int64Property':
				overhead = Int64Property.CalcOverhead(property as Int64Property);
				Int64Property.Serialize(writer, property as Int64Property);
				break;

			case 'UInt64PRoperty':
				overhead = Uint64Property.CalcOverhead(property as Int64Property);
				Uint64Property.Serialize(writer, property as Int64Property);
				break;

			case 'SingleProperty':
			case 'FloatProperty':
				overhead = FloatProperty.CalcOverhead(property as FloatProperty);
				FloatProperty.Serialize(writer, property as FloatProperty);
				break;

			case 'DoubleProperty':
				overhead = DoubleProperty.CalcOverhead(property as DoubleProperty);
				DoubleProperty.Serialize(writer, property as DoubleProperty);
				break;

			case 'StrProperty':
			case 'NameProperty':
				overhead = StrProperty.CalcOverhead(property as StrProperty);
				StrProperty.Serialize(writer, property as StrProperty);
				break;

			case 'ObjectProperty':
			case 'InterfaceProperty':
				overhead = ObjectProperty.CalcOverhead(property as ObjectProperty);
				ObjectProperty.Serialize(writer, property as ObjectProperty);
				break;

			case 'SoftObjectProperty':
				overhead = SoftObjectProperty.CalcOverhead(property as SoftObjectProperty);
				SoftObjectProperty.Serialize(writer, property as SoftObjectProperty);
				break;

			case 'EnumProperty':
				overhead = EnumProperty.CalcOverhead(property as EnumProperty);
				EnumProperty.Serialize(writer, property as EnumProperty);
				break;

			case 'ByteProperty':
				overhead = ByteProperty.CalcOverhead(property as ByteProperty);
				ByteProperty.Serialize(writer, property as ByteProperty);
				break;

			case 'StructProperty':
				overhead = StructProperty.CalcOverhead(property as StructProperty);
				StructProperty.Serialize(writer, property as StructProperty);
				break;

			case 'ArrayProperty':
				overhead = ArrayProperty.CalcOverhead(property as ArrayProperty<any>);
				ArrayProperty.Serialize(writer, property as ArrayProperty<any>, propertyName);
				break;

			case 'MapProperty':
				overhead = MapProperty.CalcOverhead(property as MapProperty);
				MapProperty.Serialize(writer, property as MapProperty);
				break;

			case 'TextProperty':
				overhead = TextProperty.CalcOverhead(property as TextProperty);
				TextProperty.Serialize(writer, property as TextProperty);
				break;

			case 'SetProperty':
				overhead = SetProperty.CalcOverhead(property as SetProperty<any>);
				SetProperty.Serialize(writer, property as SetProperty<any>);
				break;

			default:
				throw new Error(`Unimplemented type ${property.type}`);
		}

		// replace len indicator.
		writer.writeBinarySizeFromPosition(lenIndicator, start + overhead);
	}
}