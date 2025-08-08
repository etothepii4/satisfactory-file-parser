import { ContextReader } from '../../../../context/context-reader';
import { ContextWriter } from '../../../../context/context-writer';
import { ObjectReference } from '../../structs/ObjectReference';
import { VehiclePhysicsData } from '../../structs/VehiclePhysicsData';

export const isVehicleSpecialProperties = (obj: any): obj is VehicleSpecialProperties => obj.type === 'VehicleSpecialProperties';

export type VehicleSpecialProperties = {
    type: 'VehicleSpecialProperties';
    objects: VehiclePhysicsData[];
    vehicleInFront?: ObjectReference;
    vehicleBehind?: ObjectReference;
};

export namespace VehicleSpecialProperties {
    export const Parse = (reader: ContextReader, remainingLen: number, typePath: string): VehicleSpecialProperties => {
        const start = reader.getBufferPosition();

        const objects = [];
        const countObjects = reader.readInt32();
        for (let i = 0; i < countObjects; i++) {
            objects.push(VehiclePhysicsData.Parse(reader));
        }

        const property: VehicleSpecialProperties = {
            type: 'VehicleSpecialProperties',
            objects
        };

        // CAN have more data.
        const reminingVehicleSize = (remainingLen - (reader.getBufferPosition() - start));
        if ((typePath === '/Game/FactoryGame/Buildable/Vehicle/Train/Locomotive/BP_Locomotive.BP_Locomotive_C'
            || typePath === '/Game/FactoryGame/Buildable/Vehicle/Train/Wagon/BP_FreightWagon.BP_FreightWagon_C'
        ) && reminingVehicleSize > 0) {

            property.vehicleInFront = ObjectReference.read(reader);
            property.vehicleBehind = ObjectReference.read(reader);
        }

        return property;
    };

    export const Serialize = (writer: ContextWriter, property: VehicleSpecialProperties): void => {
        writer.writeInt32(property.objects.length);
        for (const object of property.objects) {
            VehiclePhysicsData.Serialize(writer, object);
        }

        if (property.vehicleInFront !== undefined
            && property.vehicleBehind !== undefined) {
            ObjectReference.write(writer, property.vehicleInFront!);
            ObjectReference.write(writer, property.vehicleBehind!);
        }
    };
}
