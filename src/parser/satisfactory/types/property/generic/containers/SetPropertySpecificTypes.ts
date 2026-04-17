import { FPropertyTagNode } from "../../../structs/binary/FPropertyTagNode";
import { AbstractBaseProperty } from "../AbstractBaseProperty";
import { IntProperty } from "../IntProperty";
import { NameProperty } from "../NameProperty";
import { ObjectProperty } from "../ObjectProperty";
import { StrProperty } from "../StrProperty";
import { Uint32Property } from "../Uint32Property";
import { isSetProperty } from "./SetProperty";
import { StructProperty } from "./StructProperty";

// Helpers to create type guards.
// Not necessarily needed, but checking for a "StrSetProperty" can be useful i guess.
type SpecificSetPropertyType<TSubtype extends AbstractBaseProperty, TSubtypevalue = TSubtype['value']> = AbstractBaseProperty & {
    propertyTagType: {
        name: 'SetProperty';
        children: [{
            name: TSubtype['type'];
            children: FPropertyTagNode[];
        }];
    };
    values: TSubtypevalue[];
};
type ExtractSubtype<T> = T extends SpecificSetPropertyType<infer U> ? U : never;
function createSetPropertyGuardFor<TArrayProperty extends SpecificSetPropertyType<AbstractBaseProperty>>(
    typeName: ExtractSubtype<TArrayProperty>['type']
) {
    return (
        property: AbstractBaseProperty
    ): property is TArrayProperty => {
        return (
            isSetProperty(property) &&
            property.propertyTagType?.children[0]?.name === typeName
        );
    };
}

export type Uint32SetProperty = SpecificSetPropertyType<Uint32Property>;
export const isUint32SetProperty = createSetPropertyGuardFor<Uint32SetProperty>('Uint32Property');

export type IntSetProperty = SpecificSetPropertyType<IntProperty>;
export const isIntSetProperty = createSetPropertyGuardFor<IntSetProperty>('IntProperty');

export type ObjectSetProperty = SpecificSetPropertyType<ObjectProperty>;
export const isObjectSetProperty = createSetPropertyGuardFor<ObjectSetProperty>('ObjectProperty');

export type StrSetProperty = SpecificSetPropertyType<StrProperty>;
export const isStrSetProperty = createSetPropertyGuardFor<StrSetProperty>('StrProperty');

export type NameSetProperty = SpecificSetPropertyType<NameProperty>;
export const isNameSetProperty = createSetPropertyGuardFor<NameSetProperty>('NameProperty');

export type StructSetProperty = SpecificSetPropertyType<StructProperty>;
export const isStructSetProperty = createSetPropertyGuardFor<StructSetProperty>('StructProperty');
