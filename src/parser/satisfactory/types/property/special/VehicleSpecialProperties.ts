import { ByteReader } from '../../../../byte/byte-reader.class';
import { ByteWriter } from '../../../../byte/byte-writer.class';
import { ObjectReference } from '../../structs/ObjectReference';

export const isVehicleSpecialProperties = (obj: any): obj is VehicleSpecialProperties => obj.type === 'VehicleSpecialProperties';

export type VehicleSpecialProperties = {
    type: 'VehicleSpecialProperties';
    objects: {
        name: string;
        unknownBytes: number[];
        unknownFlag: number;
    }[];
    vehicleInFront?: ObjectReference;
    vehicleBehind?: ObjectReference;
};

export namespace VehicleSpecialProperties {
    export const Parse = (reader: ByteReader, remainingLen: number, typePath: string): VehicleSpecialProperties => {
        const start = reader.getBufferPosition();

        const objects = [];
        const countObjects = reader.readInt32();
        for (let i = 0; i < countObjects; i++) {
            objects.push({
                name: reader.readString(),
                unknownBytes: Array.from(reader.readBytes(104)),
                unknownFlag: reader.readByte() // 1
            });
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

    export const Serialize = (writer: ByteWriter, property: VehicleSpecialProperties) => {
        writer.writeInt32(property.objects.length);
        for (const object of property.objects) {
            writer.writeString(object.name);
            writer.writeBytesArray(object.unknownBytes);
            writer.writeByte(object.unknownFlag);
        }

        if (property.vehicleInFront !== undefined
            && property.vehicleBehind !== undefined) {
            ObjectReference.write(writer, property.vehicleInFront!);
            ObjectReference.write(writer, property.vehicleBehind!);
        }
    };
}
