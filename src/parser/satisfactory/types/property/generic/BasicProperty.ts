import { GUIDInfo } from '../../structs/GUIDInfo';


export type PropertiesMap = {
	[name: string]: AbstractBaseProperty | AbstractBaseProperty[];
};

export abstract class AbstractProperty {
	constructor(public type: string, public index?: number) { }
}

export abstract class AbstractBaseProperty extends AbstractProperty {

	public name: string = '';

	// overhead like Guid is not calculated into property size
	constructor(type: string, public ueType: string, index: number) {
		super(type, index && index !== 0 ? index : undefined);
	}
}

/**
 * @type denotes our internal type.
 * @ueType denotes the type like Unreal Engine calls it, like IntProperty
 * @guidInfo denotes the GUID info of this property, i think there never was one observed. they always were not defined.
 * @index index of a property, in case it is part of an array.
 */
type AbstractBasePropertyOptions = {
	type: string;
	ueType: string;
	guidInfo?: GUIDInfo;
	index: number;
};
export abstract class BasicProperty extends AbstractBaseProperty {

	public guidInfo: GUIDInfo;

	// type: string, ueType: string, public guidInfo: GUIDInfo, index: number = 0
	constructor(options: AbstractBasePropertyOptions) {
		super(options.type, options.ueType, options.index ?? 0);
		if (options.guidInfo !== undefined) {
			this.guidInfo = options.guidInfo;
		}
	}
}

