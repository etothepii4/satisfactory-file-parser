import { GUIDInfo } from '../../structs/GUIDInfo';


export type PropertiesMap = {
	[name: string]: AbstractBaseProperty | AbstractBaseProperty[];
};


/**
 * @type denotes our internal type.
 * @ueType denotes the type like Unreal Engine calls it, like IntProperty
 * @name property name
 * @guidInfo denotes the GUID info of this property, i think there never was one observed. they always were not defined.
 * @index index of a property, in case it is part of an array.
 */
type AbstractBasePropertyOptions = {
	type: string;
	ueType: string;
	name?: string;
	guidInfo?: GUIDInfo;
	index?: number;
};

export abstract class AbstractBaseProperty {

	public type: string;
	public ueType: string;
	public name: string = '';
	public index: number | undefined = undefined;
	public guidInfo: GUIDInfo = undefined;

	constructor(options: AbstractBasePropertyOptions) {
		this.type = options.type;
		this.ueType = options.ueType;
		if (options.name !== undefined && options.name !== null) {
			this.name = options.name;
		}
		if (options.index !== undefined && options.index !== null && options.index !== 0) {
			this.index = options.index;
		}
		if (options.guidInfo !== undefined) {
			this.guidInfo = options.guidInfo;
		}
	}
}