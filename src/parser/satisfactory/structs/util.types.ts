import { BinaryReadable } from "../../byte/binary-readable.interface";
import { ByteWriter } from "../../byte/byte-writer.class";

export type col4 = {
	r: number;
	g: number;
	b: number;
	a: number;
};

export namespace col4 {
	export const SerializeRGBA = (writer: ByteWriter, value: col4): void => {
		writer.writeFloat32(value.r);
		writer.writeFloat32(value.g);
		writer.writeFloat32(value.b);
		writer.writeFloat32(value.a);
	};

	export const ParseRGBA = (reader: BinaryReadable): col4 => {
		return {
			r: reader.readFloat32(),
			g: reader.readFloat32(),
			b: reader.readFloat32(),
			a: reader.readFloat32(),
		}
	};

	export const SerializeBGRA = (writer: ByteWriter, value: col4): void => {
		writer.writeByte(value.b);
		writer.writeByte(value.g);
		writer.writeByte(value.r);
		writer.writeByte(value.a);
	};

	export const ParseBGRA = (reader: BinaryReadable): col4 => {
		return {
			b: reader.readByte(),
			g: reader.readByte(),
			r: reader.readByte(),
			a: reader.readByte(),
		}
	};
}

export type vec4 = vec3 & {
	w: number
};

export namespace vec4 {
	export const Parse = (reader: BinaryReadable): vec4 => {
		return {
			...(vec3.Parse(reader)),
			w: reader.readDouble()
		}
	};

	export const Serialize = (writer: ByteWriter, vec: vec4): void => {
		vec3.Serialize(writer, vec as vec3);
		writer.writeDouble(vec.w);
	};

	export const ParseF = (reader: BinaryReadable): vec4 => {
		return {
			...(vec3.ParseF(reader)),
			w: reader.readFloat32()
		}
	};

	export const SerializeF = (writer: ByteWriter, vec: vec4): void => {
		vec3.SerializeF(writer, vec as vec3);
		writer.writeFloat32(vec.w);
	};
}

export type vec3 = vec2 & {
	z: number
};

export namespace vec3 {
	export const Parse = (reader: BinaryReadable): vec3 => {
		return {
			...(vec2.Parse(reader)),
			z: reader.readDouble()
		}
	}

	export const Serialize = (writer: ByteWriter, vec: vec3): void => {
		vec2.Serialize(writer, vec as vec2);
		writer.writeDouble(vec.z);
	};

	export const ParseInt = (reader: BinaryReadable): vec3 => {
		return {
			x: reader.readInt32(),
			y: reader.readInt32(),
			z: reader.readInt32()
		}
	}

	export const SerializeInt = (writer: ByteWriter, vec: vec3): void => {
		writer.writeInt32(vec.x);
		writer.writeInt32(vec.y);
		writer.writeInt32(vec.z);
	}

	export const ParseF = (reader: BinaryReadable): vec3 => {
		return {
			...(vec2.ParseF(reader)),
			z: reader.readFloat32()
		}
	}

	export const SerializeF = (writer: ByteWriter, vec: vec3): void => {
		vec2.SerializeF(writer, vec as vec2);
		writer.writeFloat32(vec.z);
	};


	export const sub = (other: vec3, vec: vec3): vec3 => ({ x: other.x - vec.x, y: other.y - vec.y, z: other.z - vec.z });
	export const add = (vec: vec3, other: vec3): vec3 => ({ x: vec.x + other.x, y: vec.y + other.y, z: vec.z + other.z });
	export const length = (vec: vec3): number => Math.sqrt(vec.x ** 2 + vec.y ** 2 + vec.z ** 2);
	export const mult = (vec: vec3, scale: number): vec3 => ({ x: vec.x * scale, y: vec.y * scale, z: vec.z * scale });
	export const norm = (vec: vec3): vec3 => mult(vec, 1. / length(vec));

}

export type vec2 = {
	x: number;
	y: number;
};

export namespace vec2 {

	export const Parse = (reader: BinaryReadable): vec2 => {
		return {
			x: reader.readDouble(),
			y: reader.readDouble(),
		}
	}

	export const Serialize = (writer: ByteWriter, vec: vec2): void => {
		writer.writeDouble(vec.x);
		writer.writeDouble(vec.y);
	};

	export const ParseF = (reader: BinaryReadable): vec2 => {
		return {
			x: reader.readFloat32(),
			y: reader.readFloat32(),
		}
	}

	export const SerializeF = (writer: ByteWriter, vec: vec2): void => {
		writer.writeFloat32(vec.x);
		writer.writeFloat32(vec.y);
	};
}


export type Transform = {
	rotation: vec4;
	translation: vec3;
	scale3d: vec3;
};

export namespace Transform {
	export const ParseF = (reader: BinaryReadable): Transform => {
		return {
			rotation: vec4.ParseF(reader),
			translation: vec3.ParseF(reader),
			scale3d: vec3.ParseF(reader),
		}
	}

	export const Parse = (reader: BinaryReadable): Transform => {
		return {
			rotation: vec4.Parse(reader),
			translation: vec3.Parse(reader),
			scale3d: vec3.Parse(reader),
		}
	}

	export const Serialize = (writer: ByteWriter, transform: Transform): void => {
		vec4.Serialize(writer, transform.rotation);
		vec3.Serialize(writer, transform.translation);
		vec3.Serialize(writer, transform.scale3d);
	}

	export const SerializeF = (writer: ByteWriter, transform: Transform): void => {
		vec4.SerializeF(writer, transform.rotation);
		vec3.SerializeF(writer, transform.translation);
		vec3.SerializeF(writer, transform.scale3d);
	}
}

