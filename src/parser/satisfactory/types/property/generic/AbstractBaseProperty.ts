import { GUIDInfo } from '../../structs/GUIDInfo';


export type PropertiesMap = {
	[name: string]: (AbstractBaseProperty & any) | (AbstractBaseProperty & any)[];
};


/**
 * @type denotes the parser's internal type.
 * @ueType denotes the type like Unreal Engine calls it, like IntProperty. Several UE Types can be mapped to a single type in the parsers view.
 * @name property name
 * @guidInfo denotes the GUID info of this property, i think there never was one observed. they always were not defined.
 * @index index of a property, in case it is part of an array (NOT to confuse with ArrayProperty).
 */
type AbstractBasePropertyOptions = {
	type: string;
	ueType: string;
	name?: string;
	guidInfo?: GUIDInfo;
	index?: number;
};

export type AbstractBaseProperty = {
	type: string;
	ueType: string;
	name: string;
	index?: number;
	guidInfo?: GUIDInfo;
};

export namespace AbstractBaseProperty {
	export const Create = (options: AbstractBasePropertyOptions): AbstractBaseProperty => (
		{
			type: options.type,
			ueType: options.ueType,
			name: (options.name !== undefined && options.name !== null) ? options.name : '',
			...((options.index !== undefined && options.index !== null && options.index !== 0) ? { index: options.index } : {}),
			...((options.guidInfo !== undefined) ? { guidInfo: options.guidInfo } : {})

		} satisfies AbstractBaseProperty
	);
}