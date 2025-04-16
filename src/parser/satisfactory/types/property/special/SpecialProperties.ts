import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { BuildableSubsystemSpecialProperties, isBuildableSubsystemSpecialProperties } from './BuildableSubsystemSpecialProperties';
import { CircuitSpecialProperties, isCircuitSpecialProperties } from './CircuitSpecialProperties';
import { ConveyorChainActorSpecialProperties, isConveyorChainActorSpecialProperties } from './ConveyorChainActorSpecialProperties';
import { ConveyorSpecialProperties, isConveyorSpecialProperties } from './ConveyorSpecialProperties';
import { EmptySpecialProperties, isEmptySpecialProperties } from './EmptySpecialProperties';
import { isObjectsListSpecialProperties, ObjectsListSpecialProperties } from './ObjectsListSpecialProperties';
import { isPlayerSpecialProperties, PlayerSpecialProperties } from './PlayerSpecialProperties';
import { isPowerLineSpecialProperties, PowerLineSpecialProperties } from './PowerLineSpecialProperties';
import { isSpecialDroneActionProperties, SpecialDroneActionProperties } from './SpecialDroneActionProperties';
import { isVehicleSpecialProperties, VehicleSpecialProperties } from './VehicleSpecialProperties';



export namespace SpecialProperties {

    export type AvailableSpecialPropertiesTypes = ReturnType<typeof ParseClassSpecificSpecialProperties>;

    export const ParseClassSpecificSpecialProperties = (reader: ContextReader, typePath: string, remainingLen: number) => {
        let property;

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
                // since U1.0 the conveyor items are now in ConveyorChainActor.
                property = ConveyorSpecialProperties.Parse(reader);
                break;

            case '/Game/FactoryGame/-Shared/Blueprint/BP_CircuitSubsystem.BP_CircuitSubsystem_C':
                property = CircuitSpecialProperties.Parse(reader);
                break;

            case '/Game/FactoryGame/-Shared/Blueprint/BP_GameState.BP_GameState_C':
            case '/Game/FactoryGame/-Shared/Blueprint/BP_GameMode.BP_GameMode_C':
                property = ObjectsListSpecialProperties.Parse(reader);
                break;

            case '/Script/FactoryGame.FGConveyorChainActor':
            case '/Script/FactoryGame.FGConveyorChainActor_RepSizeMedium':
            case '/Script/FactoryGame.FGConveyorChainActor_RepSizeLarge':
            case '/Script/FactoryGame.FGConveyorChainActor_RepSizeHuge':
            case '/Script/FactoryGame.FGConveyorChainActor_RepSizeNoCull':
                property = ConveyorChainActorSpecialProperties.Parse(reader);
                break;

            case '/Game/FactoryGame/Buildable/Factory/PowerLine/Build_PowerLine.Build_PowerLine_C':
            case '/Game/FactoryGame/Events/Christmas/Buildings/PowerLineLights/Build_XmassLightsLine.Build_XmassLightsLine_C':
                property = PowerLineSpecialProperties.Parse(reader, remainingLen);
                break;

            case '/Game/FactoryGame/Buildable/Vehicle/Tractor/BP_Tractor.BP_Tractor_C':
            case '/Game/FactoryGame/Buildable/Vehicle/Truck/BP_Truck.BP_Truck_C':
            case '/Game/FactoryGame/Buildable/Vehicle/Explorer/BP_Explorer.BP_Explorer_C':
            case '/Game/FactoryGame/Buildable/Vehicle/Cyberwagon/Testa_BP_WB.Testa_BP_WB_C':
            case '/Game/FactoryGame/Buildable/Vehicle/Golfcart/BP_Golfcart.BP_Golfcart_C':
            case '/Game/FactoryGame/Buildable/Vehicle/Golfcart/BP_GolfcartGold.BP_GolfcartGold_C':
            case '/Game/FactoryGame/Buildable/Vehicle/Train/Locomotive/BP_Locomotive.BP_Locomotive_C':
            case '/Game/FactoryGame/Buildable/Vehicle/Train/Wagon/BP_FreightWagon.BP_FreightWagon_C':
                property = VehicleSpecialProperties.Parse(reader, remainingLen, typePath);
                break;

            case '/Game/FactoryGame/Buildable/Factory/DroneStation/BP_DroneTransport.BP_DroneTransport_C':
                property = SpecialDroneActionProperties.Parse(reader);
                break;

            case '/Game/FactoryGame/Character/Player/BP_PlayerState.BP_PlayerState_C':
                property = PlayerSpecialProperties.Parse(reader);
                break;

            //buildables like foundations are now here since 1.0
            case '/Script/FactoryGame.FGLightweightBuildableSubsystem':
                property = BuildableSubsystemSpecialProperties.Parse(reader);
                break;

            default:
                // ignore / empty. Rest will land in trailing data anyway.
                property = EmptySpecialProperties.Parse(reader);
                break;
        }

        return property;
    }

    export const SerializeClassSpecificSpecialProperties = (writer: ContextWriter, typePath: string, property: AvailableSpecialPropertiesTypes): void => {
        if (isConveyorSpecialProperties(property)) {
            ConveyorSpecialProperties.Serialize(writer, property);
        } else if (isCircuitSpecialProperties(property)) {
            CircuitSpecialProperties.Serialize(writer, property);
        } else if (isConveyorSpecialProperties(property)) {
            ConveyorSpecialProperties.Serialize(writer, property);
        } else if (isConveyorChainActorSpecialProperties(property)) {
            ConveyorChainActorSpecialProperties.Serialize(writer, property);
        } else if (isPowerLineSpecialProperties(property)) {
            PowerLineSpecialProperties.Serialize(writer, property);
        } else if (isObjectsListSpecialProperties(property)) {
            ObjectsListSpecialProperties.Serialize(writer, property);
        } else if (isVehicleSpecialProperties(property)) {
            VehicleSpecialProperties.Serialize(writer, property);
        } else if (isSpecialDroneActionProperties(property)) {
            SpecialDroneActionProperties.Serialize(writer, property);
        } else if (isPlayerSpecialProperties(property)) {
            PlayerSpecialProperties.Serialize(writer, property);
        } else if (isBuildableSubsystemSpecialProperties(property)) {
            BuildableSubsystemSpecialProperties.Serialize(writer, property);
        } else if (isEmptySpecialProperties(property)) {
            EmptySpecialProperties.Serialize(writer, property);
        } else {
            console.warn(`Parser is not serializing special property ${JSON.stringify(property)} of object with type ${typePath}. Unimplemented.`);
        }
    }
}
