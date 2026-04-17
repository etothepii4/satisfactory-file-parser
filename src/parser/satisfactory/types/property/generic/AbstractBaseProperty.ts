import { FPropertyTag } from '../../structs/binary/FPropertyTag';
import { FPropertyTagNode } from '../../structs/binary/FPropertyTagNode';
import { GUID } from '../../structs/binary/GUID';


export type PropertiesMap = {
	[name: string]: (AbstractBaseProperty & any) | (AbstractBaseProperty & any)[];
};

/**
 * @propertyTagType present in late 1.1 saves and later. more precisely describes the "type" of property than just the "type" field.
 * @type denotes the property type, which maps 1:1 now with parser types. "ueType" was removed.
 * @name property name
 * @guidInfo denotes the GUID info of this property, i think there never was one observed. they always were not defined.
 * @index index of a property, in case it is part of an array (NOT to confuse with ArrayProperty).
 * @rawBytes if the property could not be parsed, it fills the rawBytes array instead.
 */
export type AbstractBaseProperty = {
	[key: string]: any;
	type: string;
	name: string;
	propertyTagType: FPropertyTagNode;
	index?: number;
	flags?: number;
	propertyGuid?: GUID;
	structGuid?: GUID;
	rawBytes?: number[];
};

export namespace AbstractBaseProperty {
	/**
	 * creates a basic property with all metadata from the tag. but without value yet.
	 */
	export function CreateFromTag(tag: FPropertyTag): AbstractBaseProperty {
		return {
			type: tag.propertyTagType.name,
			name: tag.propertyName,
			propertyTagType: tag.propertyTagType,
			...(tag.index && tag.index !== 0 && { index: tag.index }),
			...(tag.propertyGuid !== undefined && tag.propertyGuid.some(number => number !== 0) && { propertyGuid: tag.propertyGuid }),
			...(tag.structGuid !== undefined && tag.structGuid.some(number => number !== 0) && { structGuid: tag.structGuid }),
			...(tag.flags !== undefined && tag.flags !== 0 && { flags: tag.flags }),
		} satisfies AbstractBaseProperty
	}
}