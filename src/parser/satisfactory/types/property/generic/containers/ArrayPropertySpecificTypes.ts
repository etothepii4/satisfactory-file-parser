import { FPropertyTagNode } from "../../../structs/binary/FPropertyTagNode";
import { AbstractBaseProperty } from "../AbstractBaseProperty";
import { BoolProperty } from "../BoolProperty";
import { ByteProperty } from "../ByteProperty";
import { DoubleProperty } from "../DoubleProperty";
import { EnumProperty } from "../EnumProperty";
import { FloatProperty } from "../FloatProperty";
import { Int64Property } from "../Int64Property";
import { InterfaceProperty } from "../InterfaceProperty";
import { IntProperty } from "../IntProperty";
import { ObjectProperty } from "../ObjectProperty";
import { SoftObjectProperty } from "../SoftObjectProperty";
import { StrProperty } from "../StrProperty";
import { TextProperty } from "../TextProperty";
import { isArrayProperty } from "./ArrayProperty";
import { StructProperty } from "./StructProperty";

// Helpers to create type guards.
// Not necessarily needed, but checking for a "StrArrayProperty" can be useful i guess.
type SpecificArrayPropertyType<TSubtype extends AbstractBaseProperty, TSubtypevalue = TSubtype['value']> = AbstractBaseProperty & {
    propertyTagType: {
        name: 'ArrayProperty';
        children: [{
            name: TSubtype['type'];
            children: FPropertyTagNode[];
        }];
    };
    values: TSubtypevalue[];
};
type ExtractSubtype<T> = T extends SpecificArrayPropertyType<infer U> ? U : never;
function createArrayPropertyGuardFor<TArrayProperty extends SpecificArrayPropertyType<AbstractBaseProperty>>(
    typeName: ExtractSubtype<TArrayProperty>['type']
) {
    return (
        property: AbstractBaseProperty
    ): property is TArrayProperty => {
        return (
            isArrayProperty(property) &&
            property.propertyTagType?.children[0]?.name === typeName
        );
    };
}

export type BoolArrayProperty = SpecificArrayPropertyType<BoolProperty, number>;
export const isBoolArrayProperty = createArrayPropertyGuardFor<BoolArrayProperty>('BoolProperty');

export type Int64ArrayProperty = SpecificArrayPropertyType<Int64Property>;
export const isInt64ArrayProperty = createArrayPropertyGuardFor<Int64ArrayProperty>('Int64Property');

export type ByteArrayProperty = SpecificArrayPropertyType<ByteProperty, number>;
export const isByteArrayProperty = createArrayPropertyGuardFor<ByteArrayProperty>('ByteProperty');

export type DoubleArrayProperty = SpecificArrayPropertyType<DoubleProperty>;
export const isDoubleArrayProperty = createArrayPropertyGuardFor<DoubleArrayProperty>('DoubleProperty');

export type EnumArrayProperty = SpecificArrayPropertyType<EnumProperty>;
export const isEnumArrayProperty = createArrayPropertyGuardFor<EnumArrayProperty>('EnumProperty');

export type FloatArrayProperty = SpecificArrayPropertyType<FloatProperty>;
export const isFloatArrayProperty = createArrayPropertyGuardFor<FloatArrayProperty>('FloatProperty');

export type IntArrayProperty = SpecificArrayPropertyType<IntProperty>;
export const isIntArrayProperty = createArrayPropertyGuardFor<IntArrayProperty>('IntProperty');

export type ObjectArrayProperty = SpecificArrayPropertyType<ObjectProperty>;
export const isObjectArrayProperty = createArrayPropertyGuardFor<ObjectArrayProperty>('ObjectProperty');

export type InterfaceArrayProperty = SpecificArrayPropertyType<InterfaceProperty>;
export const isInterfaceArrayProperty = createArrayPropertyGuardFor<InterfaceArrayProperty>('InterfaceProperty');

export type SoftObjectArrayProperty = SpecificArrayPropertyType<SoftObjectProperty>;
export const isSoftObjectArrayProperty = createArrayPropertyGuardFor<SoftObjectArrayProperty>('SoftObjectProperty');

export type StrArrayProperty = SpecificArrayPropertyType<StrProperty>;
export const isStrArrayProperty = createArrayPropertyGuardFor<StrArrayProperty>('StrProperty');

export type StructArrayProperty = SpecificArrayPropertyType<StructProperty>;
export const isStructArrayPRoperty = createArrayPropertyGuardFor<StructArrayProperty>('StructProperty');

export type TextArrayProperty = SpecificArrayPropertyType<TextProperty>;
export const isTextArrayProperty = createArrayPropertyGuardFor<TextArrayProperty>('TextProperty');