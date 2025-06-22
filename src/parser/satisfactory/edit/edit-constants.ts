
//swatches
const SWATCH_DESC_CONCRETE = '/Game/FactoryGame/Buildable/-Shared/Customization/Swatches/SwatchDesc_Concrete.SwatchDesc_Concrete_C';
const SWATCH_SLOT_DEFAULT_0 = '/Game/FactoryGame/Buildable/-Shared/Customization/Swatches/SwatchDesc_Slot0.SwatchDesc_Slot0_C';
const SWATCH_SLOT_DEFAULT_FOUNDATIONS = '/Game/FactoryGame/Buildable/-Shared/Customization/Swatches/SwatchDesc_Slot16.SwatchDesc_Slot16_C';

export const EDIT = {
	ENTITIES: {
		FOUNDATION: {
			FLAT: {
				NORMAL_8x1_01: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x1_01.Build_Foundation_8x1_01_C',
					CLASS_NAME: 'Build_Foundation_8x1_01_C',
					RECIPE: '/Game/FactoryGame/Recipes/Buildings/Foundations/Recipe_Foundation_8x1_01.Recipe_Foundation_8x1_01_C',
					DEFAULT_SWATCH: SWATCH_SLOT_DEFAULT_FOUNDATIONS
				},
				NORMAL_8x2_01: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x1_01.Build_Foundation_8x2_01_C',
					CLASS_NAME: 'Build_Foundation_8x2_01_C',
					RECIPE: '/Game/FactoryGame/Recipes/Buildings/Foundations/Recipe_Foundation_8x2_01.Recipe_Foundation_8x2_01_C',
					DEFAULT_SWATCH: SWATCH_SLOT_DEFAULT_FOUNDATIONS
				},
				NORMAL_8x4_01: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_8x1_01.Build_Foundation_8x4_01_C',
					CLASS_NAME: 'Build_Foundation_8x4_01_C',
					RECIPE: '/Game/FactoryGame/Recipes/Buildings/Foundations/Recipe_Foundation_8x4_01.Recipe_Foundation_8x4_01_C',
					DEFAULT_SWATCH: SWATCH_SLOT_DEFAULT_FOUNDATIONS
				},
				CONCRETE_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_Foundation_Concrete_8x1.Build_Foundation_Concrete_8x1_C',
					CLASS_NAME: 'Build_Foundation_Concrete_8x1_C',
					RECIPE: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Recipe_Foundation_Concrete_8x1.Recipe_Foundation_Concrete_8x1_C',
					DEFAULT_SWATCH: SWATCH_DESC_CONCRETE
				},
				CONCRETE_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_Foundation_Concrete_8x2.Build_Foundation_Concrete_8x2_C',
					CLASS_NAME: 'Build_Foundation_Concrete_8x2_C',
					RECIPE: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Recipe_Foundation_Concrete_8x1.Recipe_Foundation_Concrete_8x1_C',
					DEFAULT_SWATCH: SWATCH_DESC_CONCRETE
				},
				CONCRETE_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_Foundation_Concrete_8x4.Build_Foundation_Concrete_8x4_C',
					CLASS_NAME: 'Foundation_Concrete_8x4_C',
					RECIPE: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Recipe_Foundation_Concrete_8x4.Recipe_Foundation_Concrete_8x4_C',
					DEFAULT_SWATCH: SWATCH_DESC_CONCRETE
				},
				METAL_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_Foundation_Metal_8x4.Build_Foundation_Metal_8x1_C',
					CLASS_NAME: 'Build_Foundation_Metal_8x1_C',
					RECIPE: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Recipe_Foundation_Metal_8x4.Recipe_Foundation_Metal_8x1_C',
					DEFAULT_SWATCH: SWATCH_SLOT_DEFAULT_FOUNDATIONS
				},
				METAL_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_Foundation_Metal_8x4.Build_Foundation_Metal_8x2_C',
					CLASS_NAME: 'Build_Foundation_Metal_8x2_C',
					RECIPE: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Recipe_Foundation_Metal_8x4.Recipe_Foundation_Metal_8x2_C',
					DEFAULT_SWATCH: SWATCH_SLOT_DEFAULT_FOUNDATIONS
				},
				METAL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_Foundation_Metal_8x4.Build_Foundation_Metal_8x4_C',
					CLASS_NAME: 'Build_Foundation_Metal_8x4_C',
					RECIPE: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Recipe_Foundation_Metal_8x4.Recipe_Foundation_Metal_8x4_C',
					DEFAULT_SWATCH: SWATCH_SLOT_DEFAULT_FOUNDATIONS
				},
				CONCRETE_POLISHED_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_Foundation_ConcretePolished_8x4.Build_Foundation_ConcretePolished_8x1_C',
					CLASS_NAME: 'Build_Foundation_ConcretePolished_8x1_C',
					RECIPE: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Recipe_Foundation_ConcretePolished_8x4.Recipe_Foundation_ConcretePolished_8x1_C',
					DEFAULT_SWATCH: SWATCH_DESC_CONCRETE
				},
				CONCRETE_POLISHED_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_Foundation_ConcretePolished_8x4.Build_Foundation_ConcretePolished_8x2_C',
					CLASS_NAME: 'Build_Foundation_ConcretePolished_8x2_C',
					RECIPE: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Recipe_Foundation_ConcretePolished_8x4.Recipe_Foundation_ConcretePolished_8x2_C',
					DEFAULT_SWATCH: SWATCH_DESC_CONCRETE
				},
				CONCRETE_POLISHED_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_Foundation_ConcretePolished_8x4.Build_Foundation_ConcretePolished_8x4_C',
					CLASS_NAME: 'Build_Foundation_ConcretePolished_8x4_C',
					RECIPE: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Recipe_Foundation_ConcretePolished_8x4.Recipe_Foundation_ConcretePolished_8x4_C',
					DEFAULT_SWATCH: SWATCH_DESC_CONCRETE
				}
			},
			HALF: {
				NORMAL_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/FicsitSet/Build_QuarterPipeMiddle_Ficsit_8x1.Build_QuarterPipeMiddle_Ficsit_8x1_C',
					CLASS_NAME: 'Build_QuarterPipeMiddle_Ficsit_8x1_C',
					RECIPE: '/Game/FactoryGame/Buildable/Building/Foundation/FicsitSet/Recipe_QuarterPipeMiddle_Ficsit_4x1.Recipe_QuarterPipeMiddle_Ficsit_4x1_C'
				},
				NORMAL_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/FicsitSet/Build_QuarterPipeMiddle_Ficsit_8x2.Build_QuarterPipeMiddle_Ficsit_8x2_C',
					CLASS_NAME: 'Build_QuarterPipeMiddle_Ficsit_8x2_C'
				},
				NORMAL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/FicsitSet/Build_QuarterPipeMiddle_Ficsit_8x4.Build_QuarterPipeMiddle_Ficsit_8x4_C',
					CLASS_NAME: 'Build_QuarterPipeMiddle_Ficsit_8x4_C'
				},
				CONCRETE_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_QuarterPipeMiddle_Concrete_8x1.Build_QuarterPipeMiddle_Concrete_8x1_C',
					CLASS_NAME: 'Build_QuarterPipeMiddle_Concrete_8x1_C'
				},
				CONCRETE_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_QuarterPipeMiddle_Concrete_8x2.Build_QuarterPipeMiddle_Concrete_8x2_C',
					CLASS_NAME: 'Build_QuarterPipeMiddle_Concrete_8x2_C'
				},
				CONCRETE_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_QuarterPipeMiddle_Concrete_8x4.Build_QuarterPipeMiddle_Concrete_8x4_C',
					CLASS_NAME: 'Build_QuarterPipeMiddle_Concrete_8x4_C'
				},
				METAL_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_QuarterPipeMiddle_Grip_8x1.Build_QuarterPipeMiddle_Grip_8x1_C',
					CLASS_NAME: 'Build_QuarterPipeMiddle_Grip_8x1_C'
				},
				METAL_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_QuarterPipeMiddle_Grip_8x2.Build_QuarterPipeMiddle_Grip_8x2_C',
					CLASS_NAME: 'Build_QuarterPipeMiddle_Grip_8x2_C'
				},
				METAL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_QuarterPipeMiddle_Grip_8x4.Build_QuarterPipeMiddle_Grip_8x4_C',
					CLASS_NAME: 'Build_QuarterPipeMiddle_Grip_8x4_C'
				},
				CONCRETE_POLISHED_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_QuarterPipeMiddle_PolishedConcrete_8x1.Build_QuarterPipeMiddle_PolishedConcrete_8x1_C',
					CLASS_NAME: 'Build_QuarterPipeMiddle_PolishedConcrete_8x1_C'
				},
				CONCRETE_POLISHED_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_QuarterPipeMiddle_PolishedConcrete_8x2.Build_QuarterPipeMiddle_PolishedConcrete_8x2_C',
					CLASS_NAME: 'Build_QuarterPipeMiddle_PolishedConcrete_8x2_C'
				},
				CONCRETE_POLISHED_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_QuarterPipeMiddle_PolishedConcrete_8x4.Build_QuarterPipeMiddle_PolishedConcrete_8x4_C',
					CLASS_NAME: 'Build_QuarterPipeMiddle_PolishedConcrete_8x4_C'
				},
				ASPHALT_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_QuarterPipeMiddle_Asphalt_8x1.Build_QuarterPipeMiddle_Asphalt_8x1_C',
					CLASS_NAME: 'Build_QuarterPipeMiddle_Asphalt_8x1_C'
				},
				ASPHALT_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_QuarterPipeMiddle_Asphalt_8x2.Build_QuarterPipeMiddle_Asphalt_8x2_C',
					CLASS_NAME: 'Build_QuarterPipeMiddle_Asphalt_8x2_C'
				},
				ASPHALT_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_QuarterPipeMiddle_Asphalt_8x4.Build_QuarterPipeMiddle_Asphalt_8x4_C',
					CLASS_NAME: 'Build_QuarterPipeMiddle_Asphalt_8x4_C'
				}
			},
			RAMP: {
				SINGLE: {
					NORMAL_8x1_01: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_8x1_01.Build_Ramp_8x1_01_C',
						RECIPE: '/Game/FactoryGame/Recipes/Buildings/Ramps/Recipe_Ramp_8x1_01.Recipe_Ramp_8x1_01_C',
						DEFAULT_SWATCH: SWATCH_SLOT_DEFAULT_FOUNDATIONS
					},
					NORMAL_8x2_01: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_8x2_01.Build_Ramp_8x2_01_C',
						RECIPE: '/Game/FactoryGame/Recipes/Buildings/Ramps/Recipe_Ramp_8x2_01.Recipe_Ramp_8x2_01_C',
						DEFAULT_SWATCH: SWATCH_SLOT_DEFAULT_FOUNDATIONS
					},
					NORMAL_8x4_01: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_8x4_01.Build_Ramp_8x4_01_C',
						RECIPE: '/Game/FactoryGame/Recipes/Buildings/Ramps/Recipe_Ramp_8x4_01.Recipe_Ramp_8x4_01_C',
						DEFAULT_SWATCH: SWATCH_SLOT_DEFAULT_FOUNDATIONS
					},
					CONCRETE_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_Ramp_Concrete_8x1.Build_Ramp_Concrete_8x1_C',
						CLASS_NAME: 'Build_Ramp_Concrete_8x1_C'
					},
					CONCRETE_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_Ramp_Concrete_8x2.Build_Ramp_Concrete_8x2_C',
						CLASS_NAME: 'Build_Ramp_Concrete_8x2_C'
					},
					CONCRETE_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_Ramp_Concrete_8x4.Build_Ramp_Concrete_8x4_C',
						CLASS_NAME: 'Build_Ramp_Concrete_8x4_C'
					},
					METAL_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_Ramp_Metal_8x1.Build_Ramp_Metal_8x1_C',
						CLASS_NAME: 'Build_Ramp_Metal_8x1_C'
					},
					METAL_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_Ramp_Metal_8x2.Build_Ramp_Metal_8x2_C',
						CLASS_NAME: 'Build_Ramp_Metal_8x2_C'
					},
					METAL_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_Ramp_Metal_8x4.Build_Ramp_Metal_8x4_C',
						CLASS_NAME: 'Build_Ramp_Metal_8x4_C'
					},
					CONCRETE_POLISHED_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_Ramp_Polished_8x1.Build_Ramp_Polished_8x1_C',
						CLASS_NAME: 'Build_Ramp_Polished_8x1_C'
					},
					CONCRETE_POLISHED_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_Ramp_Polished_8x2.Build_Ramp_Polished_8x2_C',
						CLASS_NAME: 'Build_Ramp_Polished_8x2_C'
					},
					CONCRETE_POLISHED_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_Ramp_Polished_8x4.Build_Ramp_Polished_8x4_C',
						CLASS_NAME: 'Build_Ramp_Polished_8x4_C'
					},
					ASPHALT_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_Ramp_Asphalt_8x1.Build_Ramp_Asphalt_8x1_C',
						CLASS_NAME: 'Build_Ramp_Asphalt_8x1_C'
					},
					ASPHALT_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_Ramp_Asphalt_8x2.Build_Ramp_Asphalt_8x2_C',
						CLASS_NAME: 'Build_Ramp_Asphalt_8x2_C'
					},
					ASPHALT_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_Ramp_Asphalt_8x4.Build_Ramp_Asphalt_8x4_C',
						CLASS_NAME: 'Build_Ramp_Asphalt_8x4_C'
					}
				},
				DOUBLE: {
					NORMAL_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_RampDouble_8x1.Build_RampDouble_8x1_C',
						CLASS_NAME: 'Build_RampDouble_8x1_C',
						RECIPE: 'Game/FactoryGame/Recipes/Buildings/Ramps/Recipe_RampDouble_8x1.Recipe_RampDouble_8x1_C',
						DEFAULT_SWATCH: SWATCH_SLOT_DEFAULT_FOUNDATIONS
					},
					NORMAL_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_RampDouble.Build_RampDouble_C',
						CLASS_NAME: 'Build_RampDouble_C',
						DEFAULT_SWATCH: SWATCH_SLOT_DEFAULT_FOUNDATIONS
					},
					NORMAL_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_8x8x8.Build_Ramp_8x8x8_C',
						CLASS_NAME: 'Build_Ramp_8x8x8_C',
						DEFAULT_SWATCH: SWATCH_SLOT_DEFAULT_FOUNDATIONS
					},
					METAL_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_RampDouble_Metal_8x1.Build_RampDouble_Metal_8x1_C',
						CLASS_NAME: 'Build_RampDouble_Metal_8x1_C',
						RECIPE: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Recipe_RampDouble_Metal_8x1.Recipe_RampDouble_Metal_8x1_C'
					},
					METAL_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_RampDouble_Metal_8x2.Build_RampDouble_Metal_8x2_C',
						CLASS_NAME: 'Build_RampDouble_Metal_8x2_C',
						RECIPE: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Recipe_RampDouble_Metal_8x2.Recipe_RampDouble_Metal_8x2_C'
					},
					METAL_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_RampDouble_Metal_8x4.Build_RampDouble_Metal_8x4_C',
						CLASS_NAME: 'Build_RampDouble_Metal_8x4_C',
						RECIPE: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Recipe_RampDouble_Metal_8x4.Recipe_RampDouble_Metal_8x4_C',
						DEFAULT_SWATCH: SWATCH_SLOT_DEFAULT_FOUNDATIONS
					},
					CONCRETE_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_RampDouble_Concrete_8x1.Build_RampDouble_Concrete_8x1_C',
						CLASS_NAME: 'Build_RampDouble_Concrete_8x1_C'
					},
					CONCRETE_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_RampDouble_Concrete_8x2.Build_RampDouble_Concrete_8x2_C',
						CLASS_NAME: 'Build_RampDouble_Concrete_8x1_C'
					},
					CONCRETE_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_RampDouble_Concrete_8x4.Build_RampDouble_Concrete_8x4_C',
						CLASS_NAME: 'Build_RampDouble_Concrete_8x1_C'
					},
					CONCRETE_POLISHED_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_RampDouble_Polished_8x1.Build_RampDouble_Polished_8x1_C',
						CLASS_NAME: 'Build_RampDouble_Concrete_8x1_C'
					},
					CONCRETE_POLISHED_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_RampDouble_Polished_8x2.Build_RampDouble_Polished_8x2_C',
						CLASS_NAME: 'Build_RampDouble_Concrete_8x1_C'
					},
					CONCRETE_POLISHED_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_RampDouble_Polished_8x4.Build_RampDouble_Polished_8x4_C',
						CLASS_NAME: 'Build_RampDouble_Concrete_8x1_C'
					},
					ASPHALT_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_RampDouble_Asphalt_8x1.Build_RampDouble_Asphalt_8x1_C',
						CLASS_NAME: 'Build_RampDouble_Concrete_8x1_C'
					},
					ASPHALT_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_RampDouble_Asphalt_8x2.Build_RampDouble_Asphalt_8x2_C',
						CLASS_NAME: 'Build_RampDouble_Concrete_8x1_C'
					},
					ASPHALT_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_RampDouble_Asphalt_8x4.Build_RampDouble_Asphalt_8x4_C',
						CLASS_NAME: 'Build_RampDouble_Concrete_8x1_C'
					},
				},
				UPCORNER: {
					NORMAL_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_Diagonal_8x1_02.Build_Ramp_Diagonal_8x1_02_C',
						RECIPE: '/Game/FactoryGame/Recipes/Buildings/Ramps/Recipe_Ramp_Diagonal_8x1_02.Recipe_Ramp_Diagonal_8x1_02_C',
						DEFAULT_SWATCH: SWATCH_SLOT_DEFAULT_FOUNDATIONS
					},
					NORMAL_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_Diagonal_8x2_02.Build_Ramp_Diagonal_8x2_02_C',
						RECIPE: '/Game/FactoryGame/Recipes/Buildings/Ramps/Recipe_Ramp_Diagonal_8x2_02.Recipe_Ramp_Diagonal_8x2_02_C',
						DEFAULT_SWATCH: SWATCH_SLOT_DEFAULT_FOUNDATIONS
					},
					NORMAL_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_Diagonal_8x4_02.Build_Ramp_Diagonal_8x4_02_C',
						RECIPE: '/Game/FactoryGame/Recipes/Buildings/Ramps/Recipe_Ramp_Diagonal_8x4_02.Recipe_Ramp_Diagonal_8x4_02_C',
						DEFAULT_SWATCH: SWATCH_SLOT_DEFAULT_FOUNDATIONS
					},
					METAL_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_Ramp_UpCorner_Metal_8x1.Build_Ramp_UpCorner_Metal_8x1_C',
						CLASS_NAME: 'Build_Ramp_UpCorner_Metal_8x1_C'
					},
					METAL_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_Ramp_UpCorner_Metal_8x2.Build_Ramp_UpCorner_Metal_8x2_C',
						CLASS_NAME: 'Build_Ramp_UpCorner_Metal_8x2_C'
					},
					METAL_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_Ramp_UpCorner_Metal_8x4.Build_Ramp_UpCorner_Metal_8x4_C',
						CLASS_NAME: 'Build_Ramp_UpCorner_Metal_8x4_C'
					},
					CONCRETE_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_Ramp_UpCorner_Concrete_8x1.Build_Ramp_UpCorner_Concrete_8x1_C',
						CLASS_NAME: 'Build_Ramp_UpCorner_Concrete_8x1_C'
					},
					CONCRETE_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_Ramp_UpCorner_Concrete_8x2.Build_Ramp_UpCorner_Concrete_8x2_C',
						CLASS_NAME: 'Build_Ramp_UpCorner_Concrete_8x2_C'
					},
					CONCRETE_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_Ramp_UpCorner_Concrete_8x4.Build_Ramp_UpCorner_Concrete_8x4_C',
						CLASS_NAME: 'Build_Ramp_UpCorner_Concrete_8x4_C'
					},
					CONCRETE_POLISHED_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_Ramp_UpCorner_Polished_8x1.Build_Ramp_UpCorner_Polished_8x1_C',
						CLASS_NAME: 'Build_Ramp_UpCorner_Polished_8x1_C'
					},
					CONCRETE_POLISHED_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_Ramp_UpCorner_Polished_8x2.Build_Ramp_UpCorner_Polished_8x2_C',
						CLASS_NAME: 'Build_Ramp_UpCorner_Polished_8x2_C'
					},
					CONCRETE_POLISHED_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_Ramp_UpCorner_Polished_8x4.Build_Ramp_UpCorner_Polished_8x4_C',
						CLASS_NAME: 'Build_Ramp_UpCorner_Polished_8x4_C'
					},
					ASPHALT_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_Ramp_UpCorner_Asphalt_8x1.Build_Ramp_UpCorner_Asphalt_8x1_C',
						CLASS_NAME: 'Build_Ramp_UpCorner_Asphalt_8x1_C'
					},
					ASPHALT_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_Ramp_UpCorner_Asphalt_8x2.Build_Ramp_UpCorner_Asphalt_8x2_C',
						CLASS_NAME: 'Build_Ramp_UpCorner_Asphalt_8x2_C'
					},
					ASPHALT_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_Ramp_UpCorner_Asphalt_8x4.Build_Ramp_UpCorner_Asphalt_8x4_C',
						CLASS_NAME: 'Build_Ramp_UpCorner_Asphalt_8x4_C'
					},
				},
				DOWNCORNER: {
					NORMAL_8x1_C: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_Diagonal_8x1_01.Build_Ramp_Diagonal_8x1_01_C',
						CLASS_NAME: 'Build_Ramp_Diagonal_8x1_01_C'
					},
					NORMAL_8x2_C: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_Diagonal_8x2_01.Build_Ramp_Diagonal_8x2_01_C',
						CLASS_NAME: 'Build_Ramp_Diagonal_8x2_01_C'
					},
					NORMAL_8x4_C: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_Diagonal_8x4_01.Build_Ramp_Diagonal_8x4_01_C',
						CLASS_NAME: 'Build_Ramp_Diagonal_8x4_01_C'
					},
					METAL_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_Ramp_DownCorner_Metal_8x1.Build_Ramp_DownCorner_Metal_8x1_C',
						CLASS_NAME: 'Build_Ramp_DownCorner_Metal_8x1_C'
					},
					METAL_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_Ramp_DownCorner_Metal_8x2.Build_Ramp_DownCorner_Metal_8x2_C',
						CLASS_NAME: 'Build_Ramp_DownCorner_Metal_8x2_C'
					},
					METAL_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_Ramp_DownCorner_Metal_8x4.Build_Ramp_DownCorner_Metal_8x4_C',
						CLASS_NAME: 'Build_Ramp_DownCorner_Metal_8x4_C'
					},
					CONCRETE_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_Ramp_DownCorner_Concrete_8x1.Build_Ramp_DownCorner_Concrete_8x1_C',
						CLASS_NAME: 'Build_Ramp_DownCorner_Concrete_8x1_C'
					},
					CONCRETE_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_Ramp_DownCorner_Concrete_8x2.Build_Ramp_DownCorner_Concrete_8x2_C',
						CLASS_NAME: 'Build_Ramp_DownCorner_Concrete_8x2_C'
					},
					CONCRETE_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_Ramp_DownCorner_Concrete_8x4.Build_Ramp_DownCorner_Concrete_8x4_C',
						CLASS_NAME: 'Build_Ramp_DownCorner_Concrete_8x4_C'
					},
					CONCRETE_POLISHED_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_Ramp_DownCorner_Polished_8x1.Build_Ramp_DownCorner_Polished_8x1_C',
						CLASS_NAME: 'Build_Ramp_DownCorner_Polished_8x1_C'
					},
					CONCRETE_POLISHED_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_Ramp_DownCorner_Polished_8x2.Build_Ramp_DownCorner_Polished_8x2_C',
						CLASS_NAME: 'Build_Ramp_DownCorner_Polished_8x2_C'
					},
					CONCRETE_POLISHED_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_Ramp_DownCorner_Polished_8x4.Build_Ramp_DownCorner_Polished_8x4_C',
						CLASS_NAME: 'Build_Ramp_DownCorner_Polished_8x4_C'
					},
					ASPHALT_8x1: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_Ramp_DownCorner_Asphalt_8x1.Build_Ramp_DownCorner_Asphalt_8x1_C',
						CLASS_NAME: 'Build_Ramp_DownCorner_Asphalt_8x1_C'
					},
					ASPHALT_8x2: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_Ramp_DownCorner_Asphalt_8x2.Build_Ramp_DownCorner_Asphalt_8x2_C',
						CLASS_NAME: 'Build_Ramp_DownCorner_Asphalt_8x2_C'
					},
					ASPHALT_8x4: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_Ramp_DownCorner_Asphalt_8x4.Build_Ramp_DownCorner_Asphalt_8x4_C',
						CLASS_NAME: 'Build_Ramp_DownCorner_Asphalt_8x4_C'
					}
				},
				INVERTED: {
					SINGLE: {
						NORMAL_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_RampInverted_8x1.Build_RampInverted_8x1_C',
							CLASS_NAME: 'Build_RampInverted_8x1_C'
						},
						NORMAL_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_RampInverted_8x2_01.Build_RampInverted_8x2_01_C',
							CLASS_NAME: 'Build_RampInverted_8x1_C'
						},
						NORMAL_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_8x4_Inverted_01.Build_Ramp_8x4_Inverted_01_C',
							CLASS_NAME: 'Build_RampInverted_8x1_C'
						},
						METAL_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_InvertedRamp_Metal_8x1.Build_InvertedRamp_Metal_8x1_C',
							CLASS_NAME: 'Build_InvertedRamp_Metal_8x1_C'
						},
						METAL_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_InvertedRamp_Metal_8x2.Build_InvertedRamp_Metal_8x2_C',
							CLASS_NAME: 'Build_InvertedRamp_Metal_8x2_C'
						},
						METAL_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_InvertedRamp_Metal_8x4.Build_InvertedRamp_Metal_8x4_C',
							CLASS_NAME: 'Build_InvertedRamp_Metal_8x4_C'
						},
						CONCRETE_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_InvertedRamp_Concrete_8x1.Build_InvertedRamp_Concrete_8x1_C',
							CLASS_NAME: 'Build_InvertedRamp_Concrete_8x1_C'
						},
						CONCRETE_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_InvertedRamp_Concrete_8x2.Build_InvertedRamp_Concrete_8x2_C',
							CLASS_NAME: 'Build_InvertedRamp_Concrete_8x2_C'
						},
						CONCRETE_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_InvertedRamp_Concrete_8x4.Build_InvertedRamp_Concrete_8x4_C',
							CLASS_NAME: 'Build_InvertedRamp_Concrete_8x4_C'
						},
						CONCRETE_POLISHED_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_InvertedRamp_Polished_8x1.Build_InvertedRamp_Polished_8x1_C',
							CLASS_NAME: 'Build_InvertedRamp_Polished_8x1_C'
						},
						CONCRETE_POLISHED_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_InvertedRamp_Polished_8x2.Build_InvertedRamp_Polished_8x2_C',
							CLASS_NAME: 'Build_InvertedRamp_Polished_8x2_C'
						},
						CONCRETE_POLISHED_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_InvertedRamp_Polished_8x4.Build_InvertedRamp_Polished_8x4_C',
							CLASS_NAME: 'Build_InvertedRamp_Polished_8x4_C'
						},
						ASPHALT_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_InvertedRamp_Asphalt_8x1.Build_InvertedRamp_Asphalt_8x1_C',
							CLASS_NAME: 'Build_InvertedRamp_Asphalt_8x1_C'
						},
						ASPHALT_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_InvertedRamp_Asphalt_8x2.Build_InvertedRamp_Asphalt_8x2_C',
							CLASS_NAME: 'Build_InvertedRamp_Asphalt_8x2_C'
						},
						ASPHALT_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_InvertedRamp_Asphalt_8x4.Build_InvertedRamp_Asphalt_8x4_C',
							CLASS_NAME: 'Build_InvertedRamp_Asphalt_8x4_C'
						}
					},
					UCORNER: {
						NORMAL_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_RampInverted_8x1_Corner_01.Build_RampInverted_8x1_Corner_01_C',
							CLASS_NAME: 'Build_RampInverted_8x1_Corner_01_C'
						},
						NORMAL_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_RampInverted_8x2_Corner_01.Build_RampInverted_8x2_Corner_01_C',
							CLASS_NAME: 'Build_RampInverted_8x2_Corner_01_C'
						},
						NORMAL_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_RampInverted_8x4_Corner_01.Build_RampInverted_8x4_Corner_01_C',
							CLASS_NAME: 'Build_RampInverted_8x4_Corner_01_C'
						},
						CONCRETE_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_InvertedRamp_UCorner_Concrete_8x1.Build_InvertedRamp_UCorner_Concrete_8x1_C',
							CLASS_NAME: 'Build_InvertedRamp_UCorner_Concrete_8x1_C'
						},
						CONCRETE_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_InvertedRamp_UCorner_Concrete_8x2.Build_InvertedRamp_UCorner_Concrete_8x2_C',
							CLASS_NAME: 'Build_InvertedRamp_UCorner_Concrete_8x2_C'
						},
						CONCRETE_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_InvertedRamp_UCorner_Concrete_8x4.Build_InvertedRamp_UCorner_Concrete_8x4_C',
							CLASS_NAME: 'Build_InvertedRamp_UCorner_Concrete_8x4_C'
						},
						METAL_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_InvertedRamp_UCorner_Metal_8x1.Build_InvertedRamp_UCorner_Metal_8x1_C',
							CLASS_NAME: 'Build_InvertedRamp_UCorner_Metal_8x1_C'
						},
						METAL_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_InvertedRamp_UCorner_Metal_8x2.Build_InvertedRamp_UCorner_Metal_8x2_C',
							CLASS_NAME: 'Build_InvertedRamp_UCorner_Metal_8x2_C'
						},
						METAL_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_InvertedRamp_UCorner_Metal_8x4.Build_InvertedRamp_UCorner_Metal_8x4_C',
							CLASS_NAME: 'Build_InvertedRamp_UCorner_Metal_8x4_C'
						},
						CONCRETE_POLISHED_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_InvertedRamp_UCorner_Polished_8x1.Build_InvertedRamp_UCorner_Polished_8x1_C',
							CLASS_NAME: 'Build_InvertedRamp_UCorner_Polished_8x1_C'
						},
						CONCRETE_POLISHED_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_InvertedRamp_UCorner_Polished_8x2.Build_InvertedRamp_UCorner_Polished_8x2_C',
							CLASS_NAME: 'Build_InvertedRamp_UCorner_Polished_8x2_C'
						},
						CONCRETE_POLISHED_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_InvertedRamp_UCorner_Polished_8x4.Build_InvertedRamp_UCorner_Polished_8x4_C',
							CLASS_NAME: 'Build_InvertedRamp_UCorner_Polished_8x4_C'
						},
						ASPHALT_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_InvertedRamp_UCorner_Asphalt_8x1.Build_InvertedRamp_UCorner_Asphalt_8x1_C',
							CLASS_NAME: 'Build_InvertedRamp_UCorner_Asphalt_8x1_C'
						},
						ASPHALT_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_InvertedRamp_UCorner_Asphalt_8x2.Build_InvertedRamp_UCorner_Asphalt_8x2_C',
							CLASS_NAME: 'Build_InvertedRamp_UCorner_Asphalt_8x2_C'
						},
						ASPHALT_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_InvertedRamp_UCorner_Asphalt_8x4.Build_InvertedRamp_UCorner_Asphalt_8x4_C',
							CLASS_NAME: 'Build_InvertedRamp_UCorner_Asphalt_8x4_C'
						}
					},
					DCORNER: {
						NORMAL_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_RampInverted_8x1_Corner_02.Build_RampInverted_8x1_Corner_02_C',
							CLASS_NAME: 'Build_RampInverted_8x1_Corner_02_C'
						},
						NORMAL_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_RampInverted_8x2_Corner_02.Build_RampInverted_8x2_Corner_02_C',
							CLASS_NAME: 'Build_RampInverted_8x2_Corner_02_C'
						},
						NORMAL_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_RampInverted_8x4_Corner_02.Build_RampInverted_8x4_Corner_02_C',
							CLASS_NAME: 'Build_RampInverted_8x4_Corner_02_C'
						},
						CONCRETE_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_InvertedRamp_DCorner_Concrete_8x1.Build_InvertedRamp_DCorner_Concrete_8x1_C',
							CLASS_NAME: 'Build_InvertedRamp_DCorner_Concrete_8x1_C'
						},
						CONCRETE_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_InvertedRamp_DCorner_Concrete_8x2.Build_InvertedRamp_DCorner_Concrete_8x2_C',
							CLASS_NAME: 'Build_InvertedRamp_DCorner_Concrete_8x2_C'
						},
						CONCRETE_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_InvertedRamp_DCorner_Concrete_8x4.Build_InvertedRamp_DCorner_Concrete_8x4_C',
							CLASS_NAME: 'Build_InvertedRamp_DCorner_Concrete_8x4_C'
						},
						METAL_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_InvertedRamp_DCorner_Metal_8x1.Build_InvertedRamp_DCorner_Metal_8x1_C',
							CLASS_NAME: 'Build_InvertedRamp_DCorner_Metal_8x1_C'
						},
						METAL_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_InvertedRamp_DCorner_Metal_8x2.Build_InvertedRamp_DCorner_Metal_8x2_C',
							CLASS_NAME: 'Build_InvertedRamp_DCorner_Metal_8x2_C'
						},
						METAL_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_InvertedRamp_DCorner_Metal_8x4.Build_InvertedRamp_DCorner_Metal_8x4_C',
							CLASS_NAME: 'Build_InvertedRamp_DCorner_Metal_8x4_C'
						},
						CONCREtE_POLISHED_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_InvertedRamp_DCorner_Polished_8x1.Build_InvertedRamp_DCorner_Polished_8x1_C',
							CLASS_NAME: 'Build_InvertedRamp_DCorner_Polished_8x1_C'
						},
						CONCREtE_POLISHED_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_InvertedRamp_DCorner_Polished_8x2.Build_InvertedRamp_DCorner_Polished_8x2_C',
							CLASS_NAME: 'Build_InvertedRamp_DCorner_Polished_8x2_C'
						},
						CONCREtE_POLISHED_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_InvertedRamp_DCorner_Polished_8x4.Build_InvertedRamp_DCorner_Polished_8x4_C',
							CLASS_NAME: 'Build_InvertedRamp_DCorner_Polished_8x4_C'
						},
						ASPHALT_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_InvertedRamp_DCorner_Asphalt_8x1.Build_InvertedRamp_DCorner_Asphalt_8x1_C',
							CLASS_NAME: 'Build_InvertedRamp_DCorner_Asphalt_8x1_C'
						},
						ASPHALT_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_InvertedRamp_DCorner_Asphalt_8x2.Build_InvertedRamp_DCorner_Asphalt_8x2_C',
							CLASS_NAME: 'Build_InvertedRamp_DCorner_Asphalt_8x2_C'
						},
						ASPHALT_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_InvertedRamp_DCorner_Asphalt_8x4.Build_InvertedRamp_DCorner_Asphalt_8x4_C',
							CLASS_NAME: 'Build_InvertedRamp_DCorner_Asphalt_8x4_C'
						}
					}
				}
			},
			PIPE: {
				HALF: {
					QUARTER: {
						NORMAL: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/Build_QuarterPipe.Build_QuarterPipe_C',
							CLASS_NAME: 'Build_QuarterPipe_C'
						},
						CONCRETE: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_QuarterPipe_Concrete_8x4.Build_QuarterPipe_Concrete_8x4_C',
							CLASS_NAME: 'Build_QuarterPipe_Concrete_8x4_C'
						},
						METAL: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_QuarterPipe_Grip_8x4.Build_QuarterPipe_Grip_8x4_C',
							CLASS_NAME: 'Build_QuarterPipe_Grip_8x4_C'
						},
						CONCRETE_POLISHED: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_QuarterPipe_ConcretePolished_8x4.Build_QuarterPipe_ConcretePolished_8x4_C',
							CLASS_NAME: 'Build_QuarterPipe_ConcretePolished_8x4_C'
						},
						ASPHALT: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_QuarterPipe_Asphalt_8x4.Build_QuarterPipe_Asphalt_8x4_C',
							CLASS_NAME: 'Build_QuarterPipe_Asphalt_8x4_C'
						}
					},
					QUARTER_INVERTED: {
						NORMAL: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/Build_QuarterPipe_02.Build_QuarterPipe_02_C',
							CLASS_NAME: 'Build_QuarterPipe_02_C'
						},
						CONCRETE: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_DownQuarterPipe_Concrete_8x4.Build_DownQuarterPipe_Concrete_8x4_C',
							CLASS_NAME: 'Build_DownQuarterPipe_Concrete_8x4_C'
						},
						METAL: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_DownQuarterPipe_Grip_8x4.Build_DownQuarterPipe_Grip_8x4_C',
							CLASS_NAME: 'Build_DownQuarterPipe_Grip_8x4_C'
						},
						CONCRETE_POLISHED: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_DownQuarterPipe_ConcretePolished_8x4.Build_DownQuarterPipe_ConcretePolished_8x4_C',
							CLASS_NAME: 'Build_DownQuarterPipe_ConcretePolished_8x4_C'
						},
						ASPHALT: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_DownQuarterPipe_Asphalt_8x4.Build_DownQuarterPipe_Asphalt_8x4_C',
							CLASS_NAME: 'Build_DownQuarterPipe_Asphalt_8x4_C'
						}
					},
					CORNER: {
						NORMAL: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/Build_QuarterPipeCorner_01.Build_QuarterPipeCorner_01_C',
							CLASS_NAME: 'Build_QuarterPipeCorner_01_C'
						},
						CONCRETE: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_QuarterPipeInCorner_Concrete_8x4.Build_QuarterPipeInCorner_Concrete_8x4_C',
							CLASS_NAME: 'Build_QuarterPipeInCorner_Concrete_8x4_C'
						},
						METAL: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_QuarterPipeInCorner_Grip_8x4.Build_QuarterPipeInCorner_Grip_8x4_C',
							CLASS_NAME: 'Build_QuarterPipeInCorner_Grip_8x4_C'
						},
						CONCRETE_POLISHED: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_QuarterPipeInCorner_ConcretePolished_8x4.Build_QuarterPipeInCorner_ConcretePolished_8x4_C',
							CLASS_NAME: 'Build_QuarterPipeInCorner_ConcretePolished_8x4_C'
						},
						ASPHALT: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_QuarterPipeInCorner_Asphalt_8x4.Build_QuarterPipeInCorner_Asphalt_8x4_C',
							CLASS_NAME: 'Build_QuarterPipeInCorner_Asphalt_8x4_C'
						}
					},
					CORNER_INVERTED: {
						NORMAL: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/Build_QuarterPipeCorner_02.Build_QuarterPipeCorner_02_C',
							CLASS_NAME: 'Build_QuarterPipeCorner_02_C'
						},
						CONCRETE: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_DownQuarterPipeInCorner_Concrete_8x4.Build_DownQuarterPipeInCorner_Concrete_8x4_C',
							CLASS_NAME: 'Build_DownQuarterPipeInCorner_Concrete_8x4_C'
						},
						CONCRETE_POLISHED: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_DownQuarterPipeInCorner_ConcretePolished_8x4.Build_DownQuarterPipeInCorner_ConcretePolished_8x4_C',
							CLASS_NAME: 'Build_DownQuarterPipeInCorner_ConcretePolished_8x4_C'
						},
						ASPHALT: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_DownQuarterPipeInCorner_Asphalt_8x4.Build_DownQuarterPipeInCorner_Asphalt_8x4_C',
							CLASS_NAME: 'Build_DownQuarterPipeInCorner_Asphalt_8x4_C'
						},
						METAL: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_DownQuarterPipeInCorner_Grip_8x4.Build_DownQuarterPipeInCorner_Grip_8x4_C',
							CLASS_NAME: 'Build_DownQuarterPipeInCorner_Grip_8x4_C'
						}
					},
				},
				FULL: {
					CORNER: {
						QUARTER_PIPE: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/Build_QuarterPipeCorner_03.Build_QuarterPipeCorner_03_C',
							CLASS_NAME: 'Build_QuarterPipeCorner_03_C'
						},
						CONCRETE: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_QuarterPipeOutCorner_Concrete_8x4.Build_QuarterPipeOutCorner_Concrete_8x4_C',
							CLASS_NAME: 'Build_QuarterPipeOutCorner_Concrete_8x4_C'
						},
						METAL: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_QuarterPipeOutCorner_Grip_8x4.Build_QuarterPipeOutCorner_Grip_8x4_C',
							CLASS_NAME: 'Build_QuarterPipeOutCorner_Grip_8x4_C'
						},
						CONCRETE_POLISHED: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_QuarterPipeOutCorner_ConcretePolished_8x4.Build_QuarterPipeOutCorner_ConcretePolished_8x4_C',
							CLASs_NAME: 'Build_QuarterPipeOutCorner_ConcretePolished_8x4_C'
						},
						ASPHALT: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_QuarterPipeOutCorner_Asphalt_8x4.Build_QuarterPipeOutCorner_Asphalt_8x4_C',
							CLASS_NAME: 'Build_QuarterPipeOutCorner_Asphalt_8x4_C'
						}
					},
					DOWN_QUARTER_PIPE: {
						NORMAL: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/Build_QuarterPipeCorner_04.Build_QuarterPipeCorner_04_C',
							CLASS_NAME: 'Build_QuarterPipeCorner_04_C'
						},
						CONCRETE: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_DownQuarterPipeOutCorner_Concrete_8x4.Build_DownQuarterPipeOutCorner_Concrete_8x4_C',
							CLASS_NAME: 'Build_DownQuarterPipeOutCorner_Concrete_8x4_C'
						},
						CONCRETE_POLISHED: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_DownQuarterPipeOutCorner_ConcretePolished_8x4.Build_DownQuarterPipeOutCorner_ConcretePolished_8x4_C',
							CLASS_NAME: 'Build_DownQuarterPipeOutCorner_ConcretePolished_8x4_C'
						},
						METAL: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_DownQuarterPipeOutCorner_Grip_8x4.Build_DownQuarterPipeOutCorner_Grip_8x4_C',
							CLASS_NAME: 'Build_DownQuarterPipeOutCorner_Grip_8x4_C'
						},
						ASPHALT: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_DownQuarterPipeOutCorner_Asphalt_8x4.Build_DownQuarterPipeOutCorner_Asphalt_8x4_C',
							CLASS_NAME: 'Build_DownQuarterPipeOutCorner_Asphalt_8x4_C'
						}
					},
					MIDDLE_IN: {
						NORMAL_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/FicsitSet/Build_QuarterPipeMiddleInCorner_Ficsit_8x1.Build_QuarterPipeMiddleInCorner_Ficsit_8x1_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleInCorner_Ficsit_8x1_C'
						},
						NORMAL_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/FicsitSet/Build_QuarterPipeMiddleInCorner_Ficsit_8x2.Build_QuarterPipeMiddleInCorner_Ficsit_8x2_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleInCorner_Ficsit_8x2_C'
						},
						NORMAL_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/FicsitSet/Build_QuarterPipeMiddleInCorner_Ficsit_8x4.Build_QuarterPipeMiddleInCorner_Ficsit_8x4_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleInCorner_Ficsit_8x4_C'
						},
						CONCRETE_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_QuarterPipeMiddleInCorner_Concrete_8x1.Build_QuarterPipeMiddleInCorner_Concrete_8x1_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleInCorner_Concrete_8x1_C'
						},
						CONCRETE_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_QuarterPipeMiddleInCorner_Concrete_8x2.Build_QuarterPipeMiddleInCorner_Concrete_8x2_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleInCorner_Concrete_8x2_C'
						},
						CONCRETE_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_QuarterPipeMiddleInCorner_Concrete_8x4.Build_QuarterPipeMiddleInCorner_Concrete_8x4_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleInCorner_Concrete_8x4_C'
						},
						METAL_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_QuarterPipeMiddleInCorner_Grip_8x1.Build_QuarterPipeMiddleInCorner_Grip_8x1_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleInCorner_Grip_8x1_C'
						},
						METAL_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_QuarterPipeMiddleInCorner_Grip_8x2.Build_QuarterPipeMiddleInCorner_Grip_8x2_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleInCorner_Grip_8x2_C'
						},
						METAL_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_QuarterPipeMiddleInCorner_Grip_8x4.Build_QuarterPipeMiddleInCorner_Grip_8x4_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleInCorner_Grip_8x4_C'
						},
						CONCRETE_POLISHED_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_QuarterPipeMiddleInCorner_PolishedConcrete_8x1.Build_QuarterPipeMiddleInCorner_PolishedConcrete_8x1_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleInCorner_PolishedConcrete_8x1_C'
						},
						CONCRETE_POLISHED_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_QuarterPipeMiddleInCorner_PolishedConcrete_8x2.Build_QuarterPipeMiddleInCorner_PolishedConcrete_8x2_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleInCorner_PolishedConcrete_8x2_C'
						},
						CONCRETE_POLISHED_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_QuarterPipeMiddleInCorner_PolishedConcrete_8x4.Build_QuarterPipeMiddleInCorner_PolishedConcrete_8x4_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleInCorner_PolishedConcrete_8x4_C'
						},
						ASPHALT_8x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_QuarterPipeMiddleInCorner_Asphalt_8x1.Build_QuarterPipeMiddleInCorner_Asphalt_8x1_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleInCorner_Asphalt_8x1_C'
						},
						ASPHALT_8x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_QuarterPipeMiddleInCorner_Asphalt_8x2.Build_QuarterPipeMiddleInCorner_Asphalt_8x2_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleInCorner_Asphalt_8x2_C'
						},
						ASPHALT_8x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_QuarterPipeMiddleInCorner_Asphalt_8x4.Build_QuarterPipeMiddleInCorner_Asphalt_8x4_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleInCorner_Asphalt_8x4_C'
						},
					},
					QUARTER_MIDDLE_OUT: {
						NORMAL_4x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/FicsitSet/Build_QuarterPipeMiddleOutCorner_Ficsit_4x1.Build_QuarterPipeMiddleOutCorner_Ficsit_4x1_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleOutCorner_Ficsit_4x1_C'
						},
						NORMAL_4x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/FicsitSet/Build_QuarterPipeMiddleOutCorner_Ficsit_4x2.Build_QuarterPipeMiddleOutCorner_Ficsit_4x2_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleOutCorner_Ficsit_4x2_C'
						},
						NORMAL_4x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/FicsitSet/Build_QuarterPipeMiddleOutCorner_Ficsit_4x4.Build_QuarterPipeMiddleOutCorner_Ficsit_4x4_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleOutCorner_Ficsit_4x4_C'
						},
						CONCRETE_4x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_QuarterPipeMiddleOutCorner_Concrete_4x1.Build_QuarterPipeMiddleOutCorner_Concrete_4x1_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleOutCorner_Concrete_4x1_C'
						},
						CONCRETE_4x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_QuarterPipeMiddleOutCorner_Concrete_4x2.Build_QuarterPipeMiddleOutCorner_Concrete_4x2_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleOutCorner_Concrete_4x2_C'
						},
						CONCRETE_4x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_QuarterPipeMiddleOutCorner_Concrete_4x4.Build_QuarterPipeMiddleOutCorner_Concrete_4x4_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleOutCorner_Concrete_4x4_C'
						},
						METAL_4x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_QuarterPipeMiddleOutCorner_Grip_4x1.Build_QuarterPipeMiddleOutCorner_Grip_4x1_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleOutCorner_Grip_4x1_C'
						},
						METAL_4x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_QuarterPipeMiddleOutCorner_Grip_4x2.Build_QuarterPipeMiddleOutCorner_Grip_4x2_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleOutCorner_Grip_4x2_C'
						},
						METAL_4x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_QuarterPipeMiddleOutCorner_Grip_4x4.Build_QuarterPipeMiddleOutCorner_Grip_4x4_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleOutCorner_Grip_4x4_C'
						},
						CONCRETE_POLISHED_4x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_QuarterPipeMiddleOutCorner_PolishedConcrete_4x1.Build_QuarterPipeMiddleOutCorner_PolishedConcrete_4x1_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleOutCorner_PolishedConcrete_4x1_C'
						},
						CONCRETE_POLISHED_4x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_QuarterPipeMiddleOutCorner_PolishedConcrete_4x2.Build_QuarterPipeMiddleOutCorner_PolishedConcrete_4x2_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleOutCorner_PolishedConcrete_4x2_C'
						},
						CONCRETE_POLISHED_4x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_QuarterPipeMiddleOutCorner_PolishedConcrete_4x4.Build_QuarterPipeMiddleOutCorner_PolishedConcrete_4x4_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleOutCorner_PolishedConcrete_4x4_C'
						},
						ASPHALT_4x1: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_QuarterPipeMiddleOutCorner_Asphalt_4x1.Build_QuarterPipeMiddleOutCorner_Asphalt_4x1_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleOutCorner_Asphalt_4x1_C'
						},
						ASPHALT_4x2: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_QuarterPipeMiddleOutCorner_Asphalt_4x2.Build_QuarterPipeMiddleOutCorner_Asphalt_4x2_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleOutCorner_Asphalt_4x2_C'
						},
						ASPHALT_4x4: {
							TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_QuarterPipeMiddleOutCorner_Asphalt_4x4.Build_QuarterPipeMiddleOutCorner_Asphalt_4x4_C',
							CLASS_NAME: 'Build_QuarterPipeMiddleOutCorner_Asphalt_4x4_C'
						}
					}
				}
			},
			FRAME: {
				FLAT: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/Build_Foundation_Frame_01.Build_Foundation_Frame_01_C',
					CLASS_NAME: 'Build_Foundation_Frame_01_C'
				},
				FLAT_THIN: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/Build_Flat_Frame_01.Build_Flat_Frame_01_C',
					CLASS_NAME: 'Build_Flat_Frame_01_C'
				},
				RAMP: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_Frame_01.Build_Ramp_Frame_01_C',
					CLASS_NAME: 'Build_Ramp_Frame_01_C'
				},
				INVERTED_RAMP: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ramp/Build_Ramp_Frame_Inverted_01.Build_Ramp_Frame_Inverted_01_C',
					CLASS_NAME: 'Build_Ramp_Frame_Inverted_01_C'
				}
			},
			STAIRS: {
				NORMAL_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/FicsitSet/Build_Stair_FicsitSet_8x1_01.Build_Stair_FicsitSet_8x1_01_C',
					CLASS_NAME: 'Build_Stair_FicsitSet_8x1_01_C'
				},
				NORMAL_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/FicsitSet/Build_Stair_FicsitSet_8x2_01.Build_Stair_FicsitSet_8x2_01_C',
					CLASS_NAME: 'Build_Stair_FicsitSet_8x2_01_C'
				},
				NORMAL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/FicsitSet/Build_Stair_FicsitSet_8x4_01.Build_Stair_FicsitSet_8x4_01_C',
					CLASS_NAME: 'Build_Stair_FicsitSet_8x4_01_C'
				},
				CONCRETE_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_Stair_Concrete_8x1.Build_Stair_Concrete_8x1_C',
					CLASS_NAME: 'Build_Stair_Concrete_8x1_C'
				},
				CONCRETE_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_Stair_Concrete_8x2.Build_Stair_Concrete_8x2_C',
					CLASS_NAME: 'Build_Stair_Concrete_8x2_C'
				},
				CONCRETE_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/ConcreteSet/Build_Stair_Concrete_8x4.Build_Stair_Concrete_8x4_C',
					CLASS_NAME: 'Build_Stair_Concrete_8x4_C'
				},
				CONCRETE_POLISHED_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_Stair_PolishedConcrete_8x1.Build_Stair_PolishedConcrete_8x1_C',
					CLASS_NAME: 'Build_Stair_PolishedConcrete_8x1_C'
				},
				CONCRETE_POLISHED_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_Stair_PolishedConcrete_8x2.Build_Stair_PolishedConcrete_8x2_C',
					CLASS_NAME: 'Build_Stair_PolishedConcrete_8x2_C'
				},
				CONCRETE_POLISHED_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/PolishedConcreteSet/Build_Stair_PolishedConcrete_8x4.Build_Stair_PolishedConcrete_8x4_C',
					CLASS_NAME: 'Build_Stair_PolishedConcrete_8x4_C'
				},
				ASPHALT_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_Stair_Asphalt_8x1.Build_Stair_Asphalt_8x1_C',
					CLASS_NAME: 'Build_Stair_Asphalt_8x1_C'
				},
				ASPHALT_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_Stair_Asphalt_8x2.Build_Stair_Asphalt_8x2_C',
					CLASS_NAME: 'Build_Stair_Asphalt_8x2_C'
				},
				ASPHALT_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/AsphaltSet/Build_Stair_Asphalt_8x4.Build_Stair_Asphalt_8x4_C',
					CLASS_NAME: 'Build_Stair_Asphalt_8x4_C'
				},
				METAL_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_Stair_GripMetal_8x1.Build_Stair_GripMetal_8x1_C',
					CLASS_NAME: 'Build_Stair_GripMetal_8x1_C'
				},
				METAL_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_Stair_GripMetal_8x2.Build_Stair_GripMetal_8x2_C',
					CLASS_NAME: 'Build_Stair_GripMetal_8x2_C'
				},
				METAL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/GripMetal/Build_Stair_GripMetal_8x4.Build_Stair_GripMetal_8x4_C',
					CLASS_NAME: 'Build_Stair_GripMetal_8x4_C'
				},
			}
		},
		WALL: {
			SOLID: {
				NORMAL_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/FicsitWallSet/Build_Wall_Orange_8x1.Build_Wall_Orange_8x1_C',
					CLASS_NAME: 'Build_Wall_Orange_8x1_C'
				},
				NORMAL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_8x4_01.Build_Wall_8x4_01_C',
					RECIPE: '/Game/FactoryGame/Recipes/Buildings/Walls/Recipe_Wall_8x4_01.Recipe_Wall_8x4_01_C',
					CLASS_NAME: 'Build_Wall_8x4_01_C',
				},
				CONCRETE_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_8x1.Build_Wall_Concrete_8x1_C',
					CLASS_NAME: 'Build_Wall_Concrete_8x1_C'
				},
				CONCRETE_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_8x4.Build_Wall_Concrete_8x4_C',
					CLASS_NAME: 'Build_Wall_Concrete_8x4_C'
				},
				STEEL_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_SteelWall_8x1.Build_SteelWall_8x1_C',
					CLASS_NAME: 'Build_SteelWall_8x1_C'
				},
				STEEL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_8x4_02.Build_Wall_8x4_02_C',
					CLASS_NAME: 'Build_Wall_8x4_02_C'
				},
			},
			CORNER: {

				NORMAL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/FicsitWallSet/Build_Wall_Orange_8x4_Corner_01.Build_Wall_Orange_8x4_Corner_01_C',
					CLASS_NAME: 'Build_Wall_Orange_8x4_Corner_01_C'
				},
				NORMAL_8x8: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/FicsitWallSet/Build_Wall_Orange_8x8_Corner_01.Build_Wall_Orange_8x8_Corner_01_C',
					CLASS_NAME: 'Build_Wall_Orange_8x8_Corner_01_C'
				},
				NORMAL_8x4_2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/FicsitWallSet/Build_Wall_Orange_8x4_Corner_02.Build_Wall_Orange_8x4_Corner_02_C',
					CLASS_NAME: 'Build_Wall_Orange_8x4_Corner_02_C'
				},
				NORMAL_8x8_2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/FicsitWallSet/Build_Wall_Orange_8x8_Corner_02.Build_Wall_Orange_8x8_Corner_02_C',
					CLASS_NAME: 'Build_Wall_Orange_8x8_Corner_02_C'
				},
				CONCRETE_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_8x4_Corner_01.Build_Wall_Concrete_8x4_Corner_01_C',
					CLASS_NAME: 'Build_Wall_Concrete_8x4_Corner_01_C'
				},
				CONCRETE_8x4_2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_8x4_Corner_2.Build_Wall_Concrete_8x4_Corner_2_C',
					CLASS_NAME: 'Build_Wall_Concrete_8x4_Corner_2_C'
				},
				CONCRETE_8x8: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_8x8_Corner_01.Build_Wall_Concrete_8x8_Corner_01_C',
					CLASS_NAME: 'Build_Wall_Concrete_8x8_Corner_01_C'
				},
				CONCRETE_8x8_2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_8x8_Corner_2.Build_Wall_Concrete_8x8_Corner_2_C',
					CLASS_NAME: 'Build_Wall_Concrete_8x8_Corner_2_C'
				},
				STEEL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_Wall_Steel_8x4_Corner_01.Build_Wall_Steel_8x4_Corner_01_C',
					CLASS_NAME: 'Build_Wall_Steel_8x4_Corner_01_C'
				},
				STEEL_8x4_2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_Wall_Steel_8x4_Corner_2.Build_Wall_Steel_8x4_Corner_2_C',
					CLASS_NAME: 'Build_Wall_Steel_8x4_Corner_2_C'
				},
				STEEL_8x8: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_Wall_Steel_8x8_Corner_01.Build_Wall_Steel_8x8_Corner_01_C',
					CLASS_NAME: 'Build_Wall_Steel_8x8_Corner_01_C'
				},
				STEEL_8x8_2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_Wall_Steel_8x8_Corner_2.Build_Wall_Steel_8x8_Corner_2_C',
					CLASS_NAME: 'Build_Wall_Steel_8x8_Corner_2_C'
				}
			},
			GATE: {
				NORMAL_WALL_GATE: {
					RECIPE: '/Game/FactoryGame/Recipes/Buildings/Walls/Recipe_Wall_Gate_8x4_01.Recipe_Wall_Gate_8x4_01_C',
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Gate_8x4_01.Build_Wall_Gate_8x4_01_C',
					CLASS_NAME: 'Build_Wall_Gate_8x4_01_C',
				},
				AUTOMATED: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Doors/Build_Gate_Automated_8x4.Build_Gate_Automated_8x4_C',
					CLASS_NAME: 'Build_Gate_Automated_8x4_C'
				},
				CONCRETE_WALL_GATE: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_Gate_8x4.Build_Wall_Concrete_Gate_8x4_C',
					CLASS_NAME: 'Build_Wall_Concrete_Gate_8x4_C'
				},
				STEEL_WALL_GATE: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_SteelWall_8x4_Gate_01.Build_SteelWall_8x4_Gate_01_C',
					CLASS_NAME: 'Build_SteelWall_8x4_Gate_01_C'
				},
				BIG_GARAGE: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Doors/Build_BigGarageDoor_16x8.Build_BigGarageDoor_16x8_C',
					CLASS_NAME: 'Build_BigGarageDoor_16x8_C'
				}
			},
			CONVEYOR: {
				ONE_HOLE: {
					NORMAL: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_03.Build_Wall_Conveyor_8x4_03_C',
						CLASS_NAME: 'Build_Wall_Conveyor_8x4_03_C'
					},
					CONCRETE: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_8x4_ConveyorHole_01.Build_Wall_Concrete_8x4_ConveyorHole_01_C',
						CLASS_NAME: 'Build_Wall_Concrete_8x4_ConveyorHole_01_C'
					},
					STEEL: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_03_Steel.Build_Wall_Conveyor_8x4_03_Steel_C',
						CLASS_NAME: 'Build_Wall_Conveyor_8x4_03_Steel_C'
					}
				},
				TWO_HOLES: {
					NORMAL: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_02.Build_Wall_Conveyor_8x4_02_C',
						CLASS_NAME: 'Build_Wall_Conveyor_8x4_02_C'
					},
					CONCRETE: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_8x4_ConveyorHole_02.Build_Wall_Concrete_8x4_ConveyorHole_02_C',
						CLASS_NAME: 'Build_Wall_Concrete_8x4_ConveyorHole_02_C'
					},
					STEEL: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_02_Steel.Build_Wall_Conveyor_8x4_02_Steel_C',
						CLASS_NAME: 'Build_Wall_Conveyor_8x4_02_Steel_C'
					}
				},
				THREE_HOLES: {
					NORMAL: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_01.Build_Wall_Conveyor_8x4_01_C',
						CLASS_NAME: 'Build_Wall_Conveyor_8x4_01_C'
					},
					CONCRETE: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_8x4_ConveyorHole_03.Build_Wall_Concrete_8x4_ConveyorHole_03_C',
						CLASS_NAME: 'Build_Wall_Concrete_8x4_ConveyorHole_03_C'
					},
					STEEL: {
						TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Conveyor_8x4_01_Steel.Build_Wall_Conveyor_8x4_01_Steel_C',
						CLASS_NAME: 'Build_Wall_Conveyor_8x4_01_Steel_C'
					}
				}
			},
			DOOR: {
				NORMAL_CENTER: {
					RECIPE: '/Game/FactoryGame/Recipes/Buildings/Walls/Recipe_Wall_Door_8x4_01.Recipe_Wall_Door_8x4_01_C',
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_01.Build_Wall_Door_8x4_01_C',
					CLASS_NAME: 'Build_Wall_Door_8x4_01_C',
				},
				NORMAL_SIDE: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_03.Build_Wall_Door_8x4_03_C',
					CLASS_NAME: 'Build_Wall_Door_8x4_03_C'
				},
				CONCRETE_CENTER: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_CDoor_8x4.Build_Wall_Concrete_CDoor_8x4_C',
					CLASS_NAME: 'Build_Wall_Concrete_CDoor_8x4_C'
				},
				CONCRETE_SIDE: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_SDoor_8x4.Build_Wall_Concrete_SDoor_8x4_C',
					CLASS_NAME: 'Build_Wall_Concrete_SDoor_8x4_C'
				},
				STEEL_SIDE: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_03_Steel.Build_Wall_Door_8x4_03_Steel_C',
					CLASS_NAME: 'Build_Wall_Door_8x4_03_Steel_C'
				},
				STEEL_CENTER: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Door_8x4_01_Steel.Build_Wall_Door_8x4_01_Steel_C',
					CLASS_NAME: 'Build_Wall_Door_8x4_01_Steel_C'
				}
			},
			WINDOW: {
				THIN_01: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Window_Thin_8x4_01.Build_Wall_Window_Thin_8x4_01_C',
					CLASS_NAME: 'Build_Wall_Window_Thin_8x4_01_C'
				},
				THIN_02: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Window_Thin_8x4_01.Build_Wall_Window_Thin_8x4_02_C',
					CLASS_NAME: 'Build_Wall_Window_Thin_8x4_02_C'
				},
				NORMAL_8x4_01: {
					RECIPE: '/Game/FactoryGame/Recipes/Buildings/Walls/Recipe_Wall_Window_8x4_01.Recipe_Wall_Window_8x4_01_C',
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Window_8x4_01.Build_Wall_Window_8x4_01_C',
					CLASS_NAME: 'Build_Wall_Window_8x4_01_C',
				},
				NORMAL_8x4_02: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Window_8x4_02.Build_Wall_Window_8x4_02_C',
					CLASS_NAME: 'Build_Wall_Window_8x4_02_C',
				},
				NORMAL_8x4_03: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Window_8x4_03.Build_Wall_Window_8x4_03_C',
					CLASS_NAME: 'Build_Wall_Window_8x4_03_C'
				},
				NORMAL_8x4_04: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Window_8x4_04.Build_Wall_Window_8x4_04_C',
					CLASS_NAME: 'Build_Wall_Window_8x4_04_C'
				},
				NORMAL_8x4_05: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Window_8x4_05.Build_Wall_Window_8x4_05_C',
					CLASS_NAME: 'Build_Wall_Window_8x4_05_C'
				},
				NORMAL_8x4_06: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Window_8x4_06.Build_Wall_Window_8x4_06_C',
					CLASS_NAME: 'Build_Wall_Window_8x4_06_C'
				},
				NORMAL_8x4_07: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Window_8x4_07.Build_Wall_Window_8x4_07_C',
					CLASS_NAME: 'Build_Wall_Window_8x4_07_C'
				},
				CONCRETE_8x4_01: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_8x4_Window_01.Build_Wall_Concrete_8x4_Window_01_C',
					CLASS_NAME: 'Build_Wall_Concrete_8x4_Window_01_C'
				},
				CONCRETE_8x4_02: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_8x4_Window_02.Build_Wall_Concrete_8x4_Window_02_C',
					CLASS_NAME: 'Build_Wall_Concrete_8x4_Window_02_C'
				},
				CONCRETE_8x4_03: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_8x4_Window_03.Build_Wall_Concrete_8x4_Window_03_C',
					CLASS_NAME: 'Build_Wall_Concrete_8x4_Window_03_C'
				},
				CONCRETE_8x4_04: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_8x4_Window_04.Build_Wall_Concrete_8x4_Window_04_C',
					CLASS_NAME: 'Build_Wall_Concrete_8x4_Window_04_C'
				},
				STEEL_8x4_01: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_SteelWall_8x4_Window_01.Build_SteelWall_8x4_Window_01_C',
					CLASS_NAME: 'Build_SteelWall_8x4_Window_01_C'
				},
				STEEL_8x4_02: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_SteelWall_8x4_Window_02.Build_SteelWall_8x4_Window_02_C',
					CLASS_NAME: 'Build_SteelWall_8x4_Window_02_C'
				},
				STEEL_8x4_03: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_SteelWall_8x4_Window_03.Build_SteelWall_8x4_Window_03_C',
					CLASS_NAME: 'Build_SteelWall_8x4_Window_03_C'
				},
				STEEL_8x4_04: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_SteelWall_8x4_Window_04.Build_SteelWall_8x4_Window_04_C',
					CLASS_NAME: 'Build_SteelWall_8x4_Window_04_C'
				}
			},
			TRIS: {
				NORMAL_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/FicsitWallSet/Build_Wall_Orange_Tris_8x1.Build_Wall_Orange_Tris_8x1_C',
					CLASS_NAME: 'Build_Wall_Orange_Tris_8x1_C'
				},
				NORMAL_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/FicsitWallSet/Build_Wall_Orange_Tris_8x2.Build_Wall_Orange_Tris_8x2_C',
					CLASS_NAME: 'Build_Wall_Orange_Tris_8x2_C'
				},
				NORMAL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/FicsitWallSet/Build_Wall_Orange_Tris_8x4.Build_Wall_Orange_Tris_8x4_C',
					CLASS_NAME: 'Build_Wall_Orange_Tris_8x4_C'
				},
				NORMAL_8x8: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/FicsitWallSet/Build_Wall_Orange_Tris_8x8.Build_Wall_Orange_Tris_8x8_C',
					CLASS_NAME: 'Build_Wall_Orange_Tris_8x8_C'
				},
				CONCRETE_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_Tris_8x1.Build_Wall_Concrete_Tris_8x1_C',
					CLASS_NAME: 'Build_Wall_Concrete_Tris_8x1_C'
				},
				CONCRETE_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_Tris_8x2.Build_Wall_Concrete_Tris_8x2_C',
					CLASS_NAME: 'Build_Wall_Concrete_Tris_8x2_C'
				},
				CONCRETE_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_Tris_8x4.Build_Wall_Concrete_Tris_8x4_C',
					CLASS_NAME: 'Build_Wall_Concrete_Tris_8x4_C'
				},
				CONCRETE_8x8: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_Tris_8x8.Build_Wall_Concrete_Tris_8x8_C',
					CLASS_NAME: 'Build_Wall_Concrete_Tris_8x8_C'
				},
				STEEL_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_SteelWall_Tris_8x1.Build_SteelWall_Tris_8x1_C',
					CLASS_NAME: 'Build_SteelWall_Tris_8x1_C'
				},
				STEEL_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_SteelWall_Tris_8x2.Build_SteelWall_Tris_8x2_C',
					CLASS_NAME: 'Build_SteelWall_Tris_8x2_C'
				},
				STEEL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_SteelWall_Tris_8x4.Build_SteelWall_Tris_8x4_C',
					CLASS_NAME: 'Build_SteelWall_Tris_8x4_C'
				},
				STEEL_8x8: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_SteelWall_Tris_8x8.Build_SteelWall_Tris_8x8_C',
					CLASS_NAME: 'Build_SteelWall_Tris_8x8_C'
				}
			},
			FLIP_TRIS: {
				NORMAL_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/FicsitWallSet/Build_Wall_Orange_FlipTris_8x1.Build_Wall_Orange_FlipTris_8x1_C',
					CLASS_NAME: 'Build_Wall_Orange_FlipTris_8x1_C'
				},
				NORMAL_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/FicsitWallSet/Build_Wall_Orange_FlipTris_8x2.Build_Wall_Orange_FlipTris_8x2_C',
					CLASS_NAME: 'Build_Wall_Orange_FlipTris_8x2_C'
				},
				NORMAL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/FicsitWallSet/Build_Wall_Orange_FlipTris_8x4.Build_Wall_Orange_FlipTris_8x4_C',
					CLASS_NAME: 'Build_Wall_Orange_FlipTris_8x4_C'
				},
				NORMAL_8x8: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/FicsitWallSet/Build_Wall_Orange_FlipTris_8x8.Build_Wall_Orange_FlipTris_8x8_C',
					CLASS_NAME: 'Build_Wall_Orange_FlipTris_8x8_C'
				},
				CONCRETE_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_FlipTris_8x1.Build_Wall_Concrete_FlipTris_8x1_C',
					CLASS_NAME: 'Build_Wall_Concrete_FlipTris_8x1_C'
				},
				CONCRETE_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_FlipTris_8x2.Build_Wall_Concrete_FlipTris_8x2_C',
					CLASS_NAME: 'Build_Wall_Concrete_FlipTris_8x2_C'
				},
				CONCRETE_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_FlipTris_8x4.Build_Wall_Concrete_FlipTris_8x4_C',
					CLASS_NAME: 'Build_Wall_Concrete_FlipTris_8x4_C'
				},
				CONCRETE_8x8: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_FlipTris_8x8.Build_Wall_Concrete_FlipTris_8x8_C',
					CLASS_NAME: 'Build_Wall_Concrete_FlipTris_8x8_C'
				},
				STEEL_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_SteelWall_FlipTris_8x8.Build_SteelWall_FlipTris_8x1_C',
					CLASS_NAME: 'Build_SteelWall_FlipTris_8x1_C'
				},
				STEEL_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_SteelWall_FlipTris_8x8.Build_SteelWall_FlipTris_8x2_C',
					CLASS_NAME: 'Build_SteelWall_FlipTris_8x2_C'
				},
				STEEL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_SteelWall_FlipTris_8x8.Build_SteelWall_FlipTris_8x4_C',
					CLASS_NAME: 'Build_SteelWall_FlipTris_8x4_C'
				},
				STEEL_8x8: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_SteelWall_FlipTris_8x8.Build_SteelWall_FlipTris_8x8_C',
					CLASS_NAME: 'Build_SteelWall_FlipTris_8x8_C'
				}
			},
			SLANTED: {
				NORMAL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/FicsitWallSet/Build_Wall_Orange_Angular_8x4.Build_Wall_Orange_Angular_8x4_C',
					CLASS_NAME: 'Build_Wall_Orange_Angular_8x4_C'
				},
				NORMAL_8x8: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/FicsitWallSet/Build_Wall_Orange_Angular_8x8.Build_Wall_Orange_Angular_8x8_C',
					CLASS_NAME: 'Build_Wall_Orange_Angular_8x8_C'
				},
				CONCRETE_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_Angular_8x4.Build_Wall_Concrete_Angular_8x4_C',
					CLASS_NAME: 'Build_Wall_Concrete_Angular_8x4_C'
				},
				CONCRETE_8x8: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/ConcreteWallSet/Build_Wall_Concrete_Angular_8x8.Build_Wall_Concrete_Angular_8x8_C',
					CLASS_NAME: 'Build_Wall_Concrete_Angular_8x8_C'
				},
				STEEL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_WallSet_Steel_Angular_8x4.Build_WallSet_Steel_Angular_8x4_C',
					CLASS_NAME: 'Build_WallSet_Steel_Angular_8x4_C'
				},
				STEEL_8x8: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/SteelWallSet/Build_WallSet_Steel_Angular_8x8.Build_WallSet_Steel_Angular_8x8_C',
					CLASS_NAME: 'Build_WallSet_Steel_Angular_8x8_C'
				}
			},
			FRAME: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Wall/Build_Wall_Frame_01.Build_Wall_Frame_01_C',
				CLASS_NAME: 'Build_Wall_Frame_01_C'
			}
		},
		ROOF: {
			OUTCORNER: {
				NORMAL_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Orange_OutCorner_01.Build_Roof_Orange_OutCorner_01_C',
					CLASS_NAME: 'Build_Roof_Orange_OutCorner_01_C'
				},
				NORMAL_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Orange_OutCorner_02.Build_Roof_Orange_OutCorner_02_C',
					CLASS_NAME: 'Build_Roof_Orange_OutCorner_02_C'
				},
				NORMAL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Orange_OutCorner_03.Build_Roof_Orange_OutCorner_03_C',
					CLASS_NAME: 'Build_Roof_Orange_OutCorner_03_C'
				},
				TAR_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Tar_OutCorner_01.Build_Roof_Tar_OutCorner_01_C',
					CLASS_NAME: 'Build_Roof_Tar_OutCorner_01_C'
				},
				TAR_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Tar_OutCorner_02.Build_Roof_Tar_OutCorner_02_C',
					CLASS_NAME: 'Build_Roof_Tar_OutCorner_02_C'
				},
				TAR_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Tar_OutCorner_03.Build_Roof_Tar_OutCorner_03_C',
					CLASS_NAME: 'Build_Roof_Tar_OutCorner_03_C'
				},
				METAL_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Metal_OutCorner_01.Build_Roof_Metal_OutCorner_01_C',
					CLASS_NAME: 'Build_Roof_Metal_OutCorner_01_C'
				},
				METAL_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Metal_OutCorner_02.Build_Roof_Metal_OutCorner_02_C',
					CLASS_NAME: 'Build_Roof_Metal_OutCorner_02_C'
				},
				METAL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Metal_OutCorner_03.Build_Roof_Metal_OutCorner_03_C',
					CLASS_NAME: 'Build_Roof_Metal_OutCorner_03_C'
				},
				GLASS_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Window_OutCorner_01.Build_Roof_Window_OutCorner_01_C',
					CLASS_NAME: 'Build_Roof_Window_OutCorner_01_C'
				},
				GLASS_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Window_OutCorner_02.Build_Roof_Window_OutCorner_02_C',
					CLASS_NAME: 'Build_Roof_Window_OutCorner_02_C'
				},
				GLASS_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Window_OutCorner_03.Build_Roof_Window_OutCorner_03_C',
					CLASS_NAME: 'Build_Roof_Window_OutCorner_03_C'
				}
			},
			INCORNER: {
				NORMAL_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Orange_InCorner_01.Build_Roof_Orange_InCorner_01_C',
					CLASS_NAME: 'Build_Roof_Orange_InCorner_01_C'
				},
				NORMAL_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Orange_InCorner_02.Build_Roof_Orange_InCorner_02_C',
					CLASS_NAME: 'Build_Roof_Orange_InCorner_02_C'
				},
				NORMAL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Orange_InCorner_03.Build_Roof_Orange_InCorner_03_C',
					CLASS_NAME: 'Build_Roof_Orange_InCorner_03_C'
				},
				TAR_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Tar_InCorner_01.Build_Roof_Tar_InCorner_01_C',
					CLASS_NAME: 'Build_Roof_Tar_InCorner_01_C'
				},
				TAR_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Tar_InCorner_02.Build_Roof_Tar_InCorner_02_C',
					CLASS_NAME: 'Build_Roof_Tar_InCorner_02_C'
				},
				TAR_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Tar_InCorner_03.Build_Roof_Tar_InCorner_03_C',
					CLASS_NAME: 'Build_Roof_Tar_InCorner_03_C'
				},
				METAL_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Metal_InCorner_01.Build_Roof_Metal_InCorner_01_C',
					CLASS_NAME: 'Build_Roof_Metal_InCorner_01_C'
				},
				METAL_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Metal_InCorner_02.Build_Roof_Metal_InCorner_02_C',
					CLASS_NAME: 'Build_Roof_Metal_InCorner_02_C'
				},
				METAL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Metal_InCorner_03.Build_Roof_Metal_InCorner_03_C',
					CLASS_NAME: 'Build_Roof_Metal_InCorner_03_C'
				},
				GLASS_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Window_InCorner_01.Build_Roof_Window_InCorner_01_C',
					CLASS_NAME: 'Build_Roof_Window_InCorner_01_C'
				},
				GLASS_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Window_InCorner_02.Build_Roof_Window_InCorner_02_C',
					CLASS_NAME: 'Build_Roof_Window_InCorner_02_C'
				},
				GLASS_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Window_InCorner_03.Build_Roof_Window_InCorner_03_C',
					CLASS_NAME: 'Build_Roof_Window_InCorner_03_C'
				}
			},
			SLANTED: {

				NORMAL_8x0: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Orange_01.Build_Roof_Orange_01_C',
					CLASS_NAME: 'Build_Roof_Orange_01_C'
				},
				NORMAL_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Orange_02.Build_Roof_Orange_02_C',
					CLASS_NAME: 'Build_Roof_Orange_02_C'
				},
				NORMAL_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Orange_03.Build_Roof_Orange_03_C',
					CLASS_NAME: 'Build_Roof_Orange_03_C'
				},
				NORMAL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Orange_04.Build_Roof_Orange_04_C',
					CLASS_NAME: 'Build_Roof_Orange_04_C'
				},
				TAR_8x0: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Tar_01.Build_Roof_Tar_01_C',
					CLASS_NAME: 'Build_Roof_Tar_01_C'
				},
				TAR_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Tar_02.Build_Roof_Tar_02_C',
					CLASS_NAME: 'Build_Roof_Tar_02_C'
				},
				TAR_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Tar_03.Build_Roof_Tar_03_C',
					CLASS_NAME: 'Build_Roof_Tar_03_C'
				},
				TAR_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Tar_04.Build_Roof_Tar_04_C',
					CLASS_NAME: 'Build_Roof_Tar_04_C'
				},
				METAL_8x0: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_A_01.Build_Roof_A_01_C',
					CLASS_NAME: 'Build_Roof_A_01_C'
				},
				METAL_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_A_02.Build_Roof_A_02_C',
					CLASS_NAME: 'Build_Roof_A_02_C'
				},
				METAL_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_A_03.Build_Roof_A_03_C',
					CLASS_NAME: 'Build_Roof_A_03_C'
				},
				METAL_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_A_04.Build_Roof_A_04_C',
					CLASS_NAME: 'Build_Roof_A_04_C'
				},
				GLASS_8x0: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Window_01.Build_Roof_Window_01_C',
					CLASS_NAME: 'Build_Roof_Window_01_C'
				},
				GLASS_8x1: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Window_02.Build_Roof_Window_02_C',
					CLASS_NAME: 'Build_Roof_Window_02_C'
				},
				GLASS_8x2: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Window_03.Build_Roof_Window_03_C',
					CLASS_NAME: 'Build_Roof_Window_03_C'
				},
				GLASS_8x4: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Roof/Build_Roof_Window_04.Build_Roof_Window_04_C',
					CLASS_NAME: 'Build_Roof_Window_04_C'
				}
			}
		},
		CATWALK: {
			STRAIGHT: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Catwalk/Build_CatwalkStraight.Build_CatwalkStraight_C',
				CLASS_NAME: 'Build_CatwalkStraight_C'
			},
			CORNER: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Catwalk/Build_CatwalkCorner.Build_CatwalkCorner_C',
				CLASS_NAME: 'Build_CatwalkCorner_C'
			},
			T_SECTION: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Catwalk/Build_CatwalkT.Build_CatwalkT_C',
				CLASS_NAME: 'Build_CatwalkT_C'
			},
			RAMP: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Catwalk/Build_CatwalkRamp.Build_CatwalkRamp_C',
				CLASS_NAME: 'Build_CatwalkRamp_C'
			},
			STAIRS: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Catwalk/Build_CatwalkStairs.Build_CatwalkStairs_C',
				CLASS_NAME: 'Build_CatwalkStairs_C'
			},
			CROSSING: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Catwalk/Build_CatwalkCross.Build_CatwalkCross_C',
				CLASS_NAME: 'Build_CatwalkCross_C'
			}
		},
		WALKWAY: {
			STRAIGHT: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayStraight.Build_WalkwayStraight_C',
				CLASS_NAME: 'Build_WalkwayStraight_C'
			},
			T_RUN: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayTrun.Build_WalkwayTrun_C',
				CLASS_NAME: 'Build_WalkwayTrun_C'
			},
			T_WALKWAY: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayT.Build_WalkwayT_C',
				CLASS_NAME: 'Build_WalkwayT_C'
			},
			CROSS: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayCross.Build_WalkwayCross_C',
				CLASS_NAME: 'Build_WalkwayCross_C'
			},
			RAMP: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Walkway/Build_WalkwayRamp.Build_WalkwayRamp_C',
				CLASS_NAME: 'Build_WalkwayRamp_C'
			}
		},
		RAILING: {
			FENCE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Fence/Build_Fence_01.Build_Fence_01_C',
				CLASS_NAME: 'Build_Fence_01_C'
			},
			RAILING: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Fence/Build_Railing_01.Build_Railing_01_C',
				CLASS_NAME: 'Build_Railing_01_C'
			},
			BARRIER: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Fence/Build_Concrete_Barrier_01.Build_Concrete_Barrier_01_C',
				CLASS_NAME: 'Build_Concrete_Barrier_01_C'
			},
			BARRIER_LOW: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Barrier/Build_Barrier_Low_01.Build_Barrier_Low_01_C',
				CLASS_NAME: 'Build_Barrier_Low_01_C'
			},
			BARRIER_TALL: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Barrier/Build_Barrier_Tall_01.Build_Barrier_Tall_01_C',
				CLASS_NAME: 'Build_Barrier_Tall_01_C'
			},
			TARPFENCE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/TarpFence/Build_TarpFence.Build_TarpFence_C',
				CLASS_NAME: 'Build_TarpFence_C'
			},
			CHAIN_LINK_FENCE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/TarpFence/Build_ChainLinkFence.Build_ChainLinkFence_C',
				CLASS_NAME: 'Build_ChainLinkFence_C'
			},
			BARRIER_CORNER: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Fence/Build_Barrier_Corner.Build_Barrier_Corner_C',
				CLASS_NAME: 'Build_Barrier_Corner_C'
			}
		},
		WORKSHOP: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/Workshop/Build_Workshop.Build_Workshop_C',
			CLASS_NAME: 'Build_Workshop_C'
		},
		LADDER: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Ladder/Build_Ladder.Build_Ladder_C',
			CLASS_NAME: 'Build_Ladder_C'
		},
		PILLAR: {
			BASE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/Build_PillarBase.Build_PillarBase_C',
				CLASS_NAME: 'Build_PillarBase_C'
			},
			BASE_SMALL: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Pillars/Build_PillarBase_Small.Build_PillarBase_Small_C',
				CLASS_NAME: 'Build_PillarBase_Small_C'
			},
			MIDDLE_METAL: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/Build_PillarMiddle.Build_PillarMiddle_C',
				CLASS_NAME: 'Build_PillarMiddle_C'
			},
			MIDDLE_CONCRETE: {
				TYPA_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/Build_PillarMiddle_Concrete.Build_PillarMiddle_Concrete_C',
				CLASS_NAME: 'Build_PillarMiddle_Concrete_C'
			},
			MIDDLE_FRAME: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Foundation/Build_PillarMiddle_Frame.Build_PillarMiddle_Frame_C',
				CLASS_NAME: 'Build_PillarMiddle_Frame_C'
			},
			SMALL_METAL: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Pillars/Build_Pillar_Small_Metal.Build_Pillar_Small_Metal_C',
				CLASS_NAME: 'Build_Pillar_Small_Metal_C'
			},
			SMALL_CONCRETE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Pillars/Build_Pillar_Small_Concrete.Build_Pillar_Small_Concrete_C',
				CLASS_NAME: 'Build_Pillar_Small_Concrete_C'
			},
			SMALL_FRAME: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Pillars/Build_Pillar_Small_Frame.Build_Pillar_Small_Frame_C',
				CLASS_NAME: 'Build_Pillar_Small_Frame_C'
			},
		},
		BEAM: {
			PAINTED: {
				TYPE_PATH: '/Game/FactoryGame/Prototype/Buildable/Beams/Build_Beam_Painted.Build_Beam_Painted_C',
				CLASS_NAME: 'Build_Beam_Painted_C',
				RECIPE: '/Game/FactoryGame/Prototype/Buildable/Beams/Recipe_Beam_Painted.Recipe_Beam_Painted_C'
			},
			METAL: {
				TYPE_PATH: '/Game/FactoryGame/Prototype/Buildable/Beams/Build_Beam.Build_Beam_C',
				CLASS_NAME: 'Build_Beam_C',
				RECIPE: '/Game/FactoryGame/Prototype/Buildable/Beams/Recipe_Beam.Recipe_Beam_C'
			},
			CONNECTOR: {
				TYPE_PATH: '/Game/FactoryGame/Prototype/Buildable/Beams/Build_Beam_Connector.Build_Beam_Connector_C',
				CLASS_NAME: 'Build_Beam_Connector_C'
			},
			CONNECTOR_DOUBLE: {
				TYPE_PATH: '/Game/FactoryGame/Prototype/Buildable/Beams/Build_Beam_Connector_Double.Build_Beam_Connector_Double_C',
				CLASS_NAME: 'Build_Beam_Connector_Double_C'
			},
			SUPPORT: {
				TYPE_PATH: '/Game/FactoryGame/Prototype/Buildable/Beams/Build_Beam_Support.Build_Beam_Support_C',
				CLASS_NAME: 'Build_Beam_Support_C'
			},
			CABLE: {
				TYPE_PATH: '/Game/FactoryGame/Prototype/Buildable/Beams/Build_Beam_Cable.Build_Beam_Cable_C',
				CLASS_NAME: 'Build_Beam_Cable_C',
				RECIPE: '/Game/FactoryGame/Prototype/Buildable/Beams/Recipe_Beam_Cable.Recipe_Beam_Cable_C'
			},
			CABLE_CLUSTER: {
				TYPE_PATH: '/Game/FactoryGame/Prototype/Buildable/Beams/Build_Beam_Cable_Cluster.Build_Beam_Cable_Cluster_C',
				CLASS_NAME: 'Build_Beam_Cable_Cluster_C'
			},
			CONCRETE: {
				TYPE_PATH: '/Game/FactoryGame/Prototype/Buildable/Beams/Build_Beam_Concrete.Build_Beam_Concrete_C',
				CLASS_NAME: 'Build_Beam_Concrete_C'
			},
			SHELF: {
				TYPE_PATH: '/Game/FactoryGame/Prototype/Buildable/Beams/Build_Beam_Shelf.Build_Beam_Shelf_C',
				CLASS_NAME: 'Build_Beam_Shelf_C'
			},
			H: {
				TYPE_PATH: '/Game/FactoryGame/Prototype/Buildable/Beams/Build_Beam_H.Build_Beam_H_C',
				CLASS_NAME: 'Build_Beam_H_C'
			},
			BUILDABLE_BEAM_LIGHTWEIGHT_DATA: {
				TYPE_PATH: '/Script/FactoryGame.BuildableBeamLightweightData'
			}
		},
		POWER_POLE: {
			POWER_POLE_MK1: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/PowerPoleMk1/Build_PowerPoleMk1.Build_PowerPoleMk1_C',
				CLASS_NAME: 'Build_PowerPoleMk1_C',
			},
			POWER_POLE_MK2: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/PowerPoleMk2/Build_PowerPoleMk2.Build_PowerPoleMk2_C',
				CLASS_NAME: 'Build_PowerPoleMk2_C'
			},
			POWER_POLE_MK3: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/PowerPoleMk3/Build_PowerPoleMk3.Build_PowerPoleMk3_C',
				CLASS_NAME: 'Build_PowerPoleMk3_C'
			},
			POWER_POLE_WALL_MK1: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/PowerPoleWall/Build_PowerPoleWall.Build_PowerPoleWall_C',
				CLASS_NAME: 'Build_PowerPoleWall_C'
			},
			POWER_POLE_WALL_MK2: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/PowerPoleWall/Build_PowerPoleWall_Mk2.Build_PowerPoleWall_Mk2_C',
				CLASS_NAME: 'Build_PowerPoleWall_Mk2_C'
			},
		},
		POWER_LINE: {
			POWER_LINE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/PowerLine/Build_PowerLine.Build_PowerLine_C',
				CLASS_NAME: 'Build_PowerLine_C'
			},
			POWER_LINE_XMAS: {
				TYPE_PATH: '/Game/FactoryGame/Events/Christmas/Buildings/PowerLineLights/Build_XmassLightsLine.Build_XmassLightsLine_C',
				CLASS_NAME: 'Build_XmassLightsLine_C'
			}
		},
		CHRISTMAS_TREE: {
			TYPE_PATH: '/Game/FactoryGame/Events/Christmas/Buildings/TreeDecor/Build_XmassTree.Build_XmassTree_C'
		},
		TRAIN: {
			TRAIN_STATION_IDENTIFIER: {
				TYPE_PATH: '/Script/FactoryGame.FGTrainStationIdentifier'
			},
			TRAIN_STATION: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/Train/Station/Build_TrainStation.Build_TrainStation_C'
			}
		},
		RAILROAD: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/Train/Track/Build_RailroadTrack.Build_RailroadTrack_C',
			CLASS_NAME: 'Build_RailroadTrack_C',
			RECIPE: '/Game/FactoryGame/Recipes/Buildings/Recipe_RailroadTrack.Recipe_RailroadTrack_C'
		},
		RAILROAD_STOP: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/Train/EndStop/Build_RailroadEndStop.Build_RailroadEndStop_C',
			CLASS_NAME: 'Build_RailroadEndStop_C'
		},
		HUB_TERMINAL: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/HubTerminal/Build_HubTerminal.Build_HubTerminal_C',
			CLASS_NAME: 'Build_HubTerminal_C'
		},
		HUB_TRADEPOST: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/TradingPost/Build_TradingPost.Build_TradingPost_C',
			CLASS_NAME: 'Build_TradingPost_C'
		},
		LOOKOUT_TOWER: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/LookoutTower/Build_LookoutTower.Build_LookoutTower_C',
			CLASS_NAME: 'Build_LookoutTower_C'
		},
		RAILROAD_SIGNALS: {
			BLOCK_SIGNAL: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/Train/Signal/Build_RailroadBlockSignal.Build_RailroadBlockSignal_C'
			},
			PATH_SIGNAL: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/Train/Signal/Build_RailroadPathSignal.Build_RailroadPathSignal_C'
			},
		},
		RAILROAD_INTEGRATED: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/Train/Track/Build_RailroadTrackIntegrated.Build_RailroadTrackIntegrated_C',
			CLASS_NAME: 'Build_RailroadTrackIntegrated_C'
		},
		DRONE: {
			DRONE_STATION_INFO: {
				TYPE_PATH: '/Script/FactoryGame.FGDroneStationInfo'
			},
			DRONE_STATION: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/DroneStation/Build_DroneStation.Build_DroneStation_C'
			},
			DRONE_TRANSPORT: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/DroneStation/BP_DroneTransport.BP_DroneTransport_C'
			},
		},
		DROP_POD: {
			TYPE_PATH: '/Game/FactoryGame/World/Benefit/DropPod/BP_DropPod.BP_DropPod_C',
			CLASS_NAME: 'BP_DropPod_C'
		},
		VEHICLE: {
			DRIVING_TARGET_LIST: {
				TYPE_PATH: '/Script/FactoryGame.FGDrivingTargetList'
			},
			CYBER_WAGON: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Vehicle/Cyberwagon/Testa_BP_WB.Testa_BP_WB_C',
				CLASS_NAME: 'Testa_BP_WB_C'
			},
			FACTORY_CART: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Vehicle/Golfcart/BP_Golfcart.BP_Golfcart_C',
				CLASS_NAME: 'BP_Golfcart_C'
			},
			FACTORY_CART_GOLD: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Vehicle/Golfcart/BP_GolfcartGold.BP_GolfcartGold_C',
				CLASS_NAME: 'BP_GolfcartGold_C'
			},
			EXPLORER: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Vehicle/Explorer/BP_Explorer.BP_Explorer_C',
				CLASS_NAME: 'BP_Explorer_C'
			},
			TRUCK: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Vehicle/Truck/BP_Truck.BP_Truck_C',
				CLASS_NAME: 'BP_Truck_C'
			},
			TRACTOR: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Vehicle/Tractor/BP_Tractor.BP_Tractor_C',
				CLASS_NAME: 'BP_Tractor_C'
			},
			TRAIN: {
				LOCOMOTIVE: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Vehicle/Train/Locomotive/BP_Locomotive.BP_Locomotive_C',
				},
				FREIGHT_WAGON: {
					TYPE_PATH: '/Game/FactoryGame/Buildable/Vehicle/Train/Wagon/BP_FreightWagon.BP_FreightWagon_C'
				}
			}
		},
		VENT: {
			LARGE_FAN: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Vent/Build_LargeFan.Build_LargeFan_C',
				CLASS_NAME: 'Build_LargeFan_C'
			},
			LARGE_VENT: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Vent/Build_LargeVent.Build_LargeVent_C',
				CLASS_NAME: 'Build_LargeVent_C'
			}
		},
		CONVEYOR: {
			BELT_REGEX: /^\/Game\/FactoryGame\/Buildable\/Factory\/(ConveyorBeltMk[0-9]+)\/Build_(\1)\.Build_(\1)_C$/,
			LIFT_REGEX: /^\/Game\/FactoryGame\/Buildable\/Factory\/(ConveyorLiftMk[0-9]+)\/Build_(\1)\.Build_(\1)_C$/,
			BELT_MK1: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk1/Build_ConveyorBeltMk1.Build_ConveyorBeltMk1_C',
				CLASS_NAME: 'Build_ConveyorBeltMk1_C',
				RECIPE: '/Game/FactoryGame/Recipes/Buildings/Recipe_ConveyorBeltMk1.Recipe_ConveyorBeltMk1_C',
			},
			BELT_MK2: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk2/Build_ConveyorBeltMk2.Build_ConveyorBeltMk2_C',
				CLASS_NAME: 'Build_ConveyorBeltMk2_C'
			},
			BELT_MK3: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk3/Build_ConveyorBeltMk3.Build_ConveyorBeltMk3_C',
				CLASS_NAME: 'Build_ConveyorBeltMk3_C'
			},
			BELT_MK4: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk4/Build_ConveyorBeltMk4.Build_ConveyorBeltMk4_C',
				CLASS_NAME: 'Build_ConveyorBeltMk4_C'
			},
			BELT_MK5: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk5/Build_ConveyorBeltMk5.Build_ConveyorBeltMk5_C',
				CLASS_NAME: 'Build_ConveyorBeltMk5_C'
			},
			BELT_MK6: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/ConveyorBeltMk6/Build_ConveyorBeltMk6.Build_ConveyorBeltMk6_C',
				CLASS_NAME: 'Build_ConveyorBeltMk6_C'
			},
			LIFT_MK1: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk1/Build_ConveyorLiftMk1.Build_ConveyorLiftMk1_C',
				CLASS_NAME: 'Build_ConveyorLiftMk1_C'
			},
			LIFT_MK2: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk2/Build_ConveyorLiftMk2.Build_ConveyorLiftMk2_C',
				CLASS_NAME: 'Build_ConveyorLiftMk2_C'
			},
			LIFT_MK3: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk3/Build_ConveyorLiftMk3.Build_ConveyorLiftMk3_C',
				CLASS_NAME: 'Build_ConveyorLiftMk3_C'
			},
			LIFT_MK4: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk4/Build_ConveyorLiftMk4.Build_ConveyorLiftMk4_C',
				CLASS_NAME: 'Build_ConveyorLiftMk4_C'
			},
			LIFT_MK5: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk5/Build_ConveyorLiftMk5.Build_ConveyorLiftMk5_C',
				CLASS_NAME: 'Build_ConveyorLiftMk5_C'
			},
			LIFT_MK6: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/ConveyorLiftMk6/Build_ConveyorLiftMk6.Build_ConveyorLiftMk6_C',
				CLASS_NAME: 'Build_ConveyorLiftMk6_C'
			},
			MONITOR: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/ConveyorMonitor/Build_ConveyorMonitor.Build_ConveyorMonitor_C',
				CLASS_NAME: 'Build_ConveyorMonitor_C'
			},
			PRIORITY_MERGER: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/CA_MergerPriority/Build_ConveyorAttachmentMergerPriority.Build_ConveyorAttachmentMergerPriority_C',
				CLASS_NAME: 'Build_ConveyorAttachmentMergerPriority_C'
			}
		},
		PIPELINE: {
			PIPELINE_MK1: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/Pipeline/Build_Pipeline.Build_Pipeline_C'
			},
			PIPELINE_MK2: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/PipelineMk2/Build_PipelineMK2.Build_PipelineMK2_C'
			},
			PIPELINE_NETWORK: {
				TYPE_PATH: '/Script/FactoryGame.FGPipeNetwork'
			}
		},
		RADAR_TOWER: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/RadarTower/Build_RadarTower.Build_RadarTower_C',
			CLASS_NAME: 'Build_RadarTower_C'
		},
		PROJECT_ASSEMBLY: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/ProjectAssembly/BP_ProjectAssembly.BP_ProjectAssembly_C',
			CLASS_NAME: 'BP_ProjectAssembly_C'
		},
		SPACE_ELEVATOR: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/SpaceElevator/Build_SpaceElevator.Build_SpaceElevator_C',
			CLASS_NAME: 'Build_SpaceElevator_C'
		},
		EXTRACTOR: {
			MINER_MK_1: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/MinerMK1/Build_MinerMk1.Build_MinerMk1_C'
			},
			MINER_MK_2: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/MinerMk2/Build_MinerMk2.Build_MinerMk2_C'
			},
			MINER_MK_3: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/MinerMk3/Build_MinerMk3.Build_MinerMk3_C'
			},
			WATER_EXTRACTOR: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/WaterPump/Build_WaterPump.Build_WaterPump_C'
			},
			OIL_EXTRACTOR: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/OilPump/Build_OilPump.Build_OilPump_C'
			},
			WELL_PRESSURIZER: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/FrackingSmasher/Build_FrackingSmasher.Build_FrackingSmasher_C'
			},
			WELL_EXTRACTOR: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/FrackingExtractor/Build_FrackingExtractor.Build_FrackingExtractor_C'
			},
			GIFT_PRODUCER: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/Holiday/Build_TreeGiftProducer/Build_TreeGiftProducer.Build_TreeGiftProducer_C'
			},

		},
		SHELF: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/Building/StackableShelf/Build_StackableShelf.Build_StackableShelf_C',
			CLASS_NAME: 'Build_StackableShelf_C'
		},
		FACTORY: {
			CONSTRUCTOR: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/ConstructorMk1/Build_ConstructorMk1.Build_ConstructorMk1_C'
			},
			SMELTER: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/SmelterMk1/Build_SmelterMk1.Build_SmelterMk1_C'
			},
			REFINERY: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/OilRefinery/Build_OilRefinery.Build_OilRefinery_C'
			},
			BLENDER: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/Blender/Build_Blender.Build_Blender_C'
			},
			ASSEMBLER: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/AssemblerMk1/Build_AssemblerMk1.Build_AssemblerMk1_C'
			},
			MANUFACTURER: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/ManufacturerMk1/Build_ManufacturerMk1.Build_ManufacturerMk1_C'
			},
			FOUNDRY: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/FoundryMk1/Build_FoundryMk1.Build_FoundryMk1_C'
			},
			PACKAGER: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/Packager/Build_Packager.Build_Packager_C'
			},
			PARTICLE_ACCELERATOR: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/HadronCollider/Build_HadronCollider.Build_HadronCollider_C'
			},
			CONVERTER: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/Converter/Build_Converter.Build_Converter_C'
			},
			QUANTUM_ENCODER: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/QuantumEncoder/Build_QuantumEncoder.Build_QuantumEncoder_C',
				CLASS_NAME: 'Build_QuantumEncoder_C'
			},
		},
		POWER_GENERATORS: {
			COAL: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/GeneratorCoal/Build_GeneratorCoal.Build_GeneratorCoal_C',
				CLASS_NAME: 'Build_GeneratorCoal_C'
			},
			FUEL: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/GeneratorFuel/Build_GeneratorFuel.Build_GeneratorFuel_C',
				CLASS_NAME: 'Build_GeneratorFuel_C'
			},
			BIOMASS_AUTOMATED: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/GeneratorBiomass/Build_GeneratorBiomass_Automated.Build_GeneratorBiomass_Automated_C',
				CLASS_NAME: 'Build_GeneratorBiomass_Automated_C'
			},
			BIOMASS_INTEGRATED: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/GeneratorBiomass/Build_GeneratorIntegratedBiomass.Build_GeneratorIntegratedBiomass_C',
				CLASS_NAME: 'Build_GeneratorIntegratedBiomass_C'
			},
			POWER_STORAGE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/PowerStorage/Build_PowerStorageMk1.Build_PowerStorageMk1_C',
				CLASS_NAME: 'Build_PowerStorageMk1_C'
			},
			NUCLEAR: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/GeneratorNuclear/Build_GeneratorNuclear.Build_GeneratorNuclear_C',
				CLASS_NAME: 'Build_GeneratorNuclear_C'
			},
			ALIEN_POWER_BUILDING: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/AlienPower/Build_AlienPowerBuilding.Build_AlienPowerBuilding_C',
				CLASS_NAME: 'Build_AlienPowerBuilding_C'
			},
		},
		STORAGE: {
			CONTAINER_MK_1: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/StorageContainerMk1/Build_StorageContainerMk1.Build_StorageContainerMk1_C',
				CLASS_NAME: 'Build_StorageContainerMk1_C'
			},
			CONTAINER_MK_2: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/StorageContainerMk2/Build_StorageContainerMk2.Build_StorageContainerMk2_C',
				CLASS_NAME: 'Build_StorageContainerMk2_C'
			},
			CENTRAL_STORAGE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/CentralStorage/Build_CentralStorage.Build_CentralStorage_C',
				CLASS_NAME: 'Build_CentralStorage_C'
			},
			FLUID_BUFFER_MK_1: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/StorageTank/Build_PipeStorageTank.Build_PipeStorageTank_C',
				CLASS_NAME: 'Build_PipeStorageTank_C',
				RECIPE: '/Game/FactoryGame/Recipes/Buildings/Recipe_PipeStorageTank.Recipe_PipeStorageTank_C'
			},
			FLUID_BUFFER_MK_2: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/IndustrialFluidContainer/Build_IndustrialTank.Build_IndustrialTank_C',
				CLASS_NAME: 'Build_IndustrialTank_C',
				RECIPE: '/Game/FactoryGame/Recipes/Buildings/Recipe_IndustrialTank.Recipe_IndustrialTank_C'
			},
			PLAYER_CRATE: {
				TYPE_PATH: '/Game/FactoryGame/-Shared/Crate/BP_Crate.BP_Crate_C',
				CLASS_NAME: 'BP_Crate_C'
			},
			PLAYER_STORAGE_CRATE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/StoragePlayer/Build_StoragePlayer.Build_StoragePlayer_C',
				CLASS_NAME: 'Build_StoragePlayer_C'
			},
			STORAGE_CRATE_INTEGRATED: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/StoragePlayer/Build_StorageIntegrated.Build_StorageIntegrated_C',
				CLASS_NAME: 'Build_StorageIntegrated_C'
			},
			PLAYER_HAZARD_CRATE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/StoragePlayer/Build_StorageHazard.Build_StorageHazard_C',
				CLASS_NAME: 'Build_StorageHazard_C',
				RECIPE: '/Game/FactoryGame/Recipes/Buildings/Recipe_StorageHazard.Recipe_StorageHazard_C'
			},
			PLAYER_MEDICAL_CRATE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/StoragePlayer/Build_StorageMedkit.Build_StorageMedkit_C',
				CLASS_NAME: 'Build_StorageMedkit_C'
			},
		},
		POTTY: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/Building/Potty/BUILD_Potty_mk1.BUILD_Potty_mk1_C',
			CLASS_NAME: 'BUILD_Potty_mk1_C'
		},
		SIGN: {
			LARGE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/SignDigital/Build_StandaloneWidgetSign_Large.Build_StandaloneWidgetSign_Large_C',
				CLASS_NAME: 'Build_StandaloneWidgetSign_Large_C'
			},
			HUGE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/SignDigital/Build_StandaloneWidgetSign_Huge.Build_StandaloneWidgetSign_Huge_C',
				CLASS_NAME: 'Build_StandaloneWidgetSign_Huge_C'
			},
			SMALL: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/SignDigital/Build_StandaloneWidgetSign_Small.Build_StandaloneWidgetSign_Small_C',
				CLASS_NAME: 'Build_StandaloneWidgetSign_Small_C',
				RECIPE: '/Game/FactoryGame/Recipes/Buildings/Recipe_StandaloneWidgetSign_Small.Recipe_StandaloneWidgetSign_Small_C',
				PREFAB_LAYOUT: '/Game/FactoryGame/Interface/UI/InGame/Signs/SignLayouts/BPW_Sign4x1_1.BPW_Sign4x1_1_C'
			},
			SMALL_WIDE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/SignDigital/Build_StandaloneWidgetSign_SmallWide.Build_StandaloneWidgetSign_SmallWide_C',
				CLASS_NAME: 'Build_StandaloneWidgetSign_SmallWide_C',
				RECIPE: '/Game/FactoryGame/Recipes/Buildings/Recipe_StandaloneWidgetSign_SmallWide.Recipe_StandaloneWidgetSign_SmallWide_C',
				PREFAB_LAYOUT: '/Game/FactoryGame/Interface/UI/InGame/Signs/SignLayouts/BPW_Sign4x1_1.BPW_Sign4x1_1_C'
			},
			SMALL_VERY_WIDE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/SignDigital/Build_StandaloneWidgetSign_SmallVeryWide.Build_StandaloneWidgetSign_SmallVeryWide_C',
				CLASS_NAME: 'Build_StandaloneWidgetSign_SmallVeryWide_C',
			},
			SQUARE_TINY: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/SignDigital/Build_StandaloneWidgetSign_Square_Tiny.Build_StandaloneWidgetSign_Square_Tiny_C',
				CLASS_NAME: 'Build_StandaloneWidgetSign_Square_Tiny_C',
			},
			SQUARE_SMALL: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/SignDigital/Build_StandaloneWidgetSign_Square_Small.Build_StandaloneWidgetSign_Square_Small_C',
				CLASS_NAME: 'Build_StandaloneWidgetSign_Square_Small_C',
			},
			SQUARE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/SignDigital/Build_StandaloneWidgetSign_Square.Build_StandaloneWidgetSign_Square_C',
				CLASS_NAME: 'Build_StandaloneWidgetSign_Square_C',
			},
			MEDIUM: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/SignDigital/Build_StandaloneWidgetSign_Medium.Build_StandaloneWidgetSign_Medium_C',
				CLASS_NAME: 'Build_StandaloneWidgetSign_Medium_C',
			},
			PORTRAIT: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/SignDigital/Build_StandaloneWidgetSign_Portrait.Build_StandaloneWidgetSign_Portrait_C',
				CLASS_NAME: 'Build_StandaloneWidgetSign_Portrait_C',
				RECIPE: '/Game/FactoryGame/Recipes/Buildings/Recipe_StandaloneWidgetSign_Portrait.Recipe_StandaloneWidgetSign_Portrait_C',
				PREFAB_LAYOUT: '/Game/FactoryGame/Interface/UI/InGame/Signs/SignLayouts/BPW_Sign2x3_0.BPW_Sign2x3_0_C'
			}
		},
		PLAYER: {
			TYPE_PATH: '/Game/FactoryGame/Character/Player/Char_Player.Char_Player_C',
			CLASS_NAME: 'Char_Player_C'
		},
		PLAYER_STATE: {
			TYPE_PATH: '/Game/FactoryGame/Character/Player/BP_PlayerState.BP_PlayerState_C'
		},
		PORTAL: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/Portal/Build_Portal.Build_Portal_C',
			CLASS_NAME: 'Build_Portal_C'
		},
		PORTAL_SATELLITE: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/Portal/Build_PortalSatellite.Build_PortalSatellite_C',
			CLASS_NAME: 'Build_PortalSatellite_C'
		},
		CREATURE: {
			ELITE_STINGER: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Stinger/BigStinger/Char_EliteStinger.Char_EliteStinger_C',
				CLASS_NAME: 'Char_EliteStinger_C'
			},
			STINGER: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Stinger/Char_Stinger.Char_Stinger_C',
				CLASS_NAME: 'Char_Stinger_C'
			},
			CHILD_STINGER: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Stinger/SmallStinger/Char_Stinger_Child.Char_Stinger_Child',
				CLASS_NAME: 'Char_Stinger_Child'
			},
			CRAB_HATCHER: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/CrabHatcher/Char_CrabHatcher.Char_CrabHatcher_C',
				CLASS_NAME: 'Char_CrabHatcher_C'
			},
			BIG_CRAB_HATCHER: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/CrabHatcher/Char_BigCrabHatcher.Char_BigCrabHatcher_C',
				CLASS_NAME: 'Char_BigCrabHatcher_C'
			},
			FLYING_BABY_CRAB: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Crab/BabyCrab/BP_FlyingBabyCrab.BP_FlyingBabyCrab_C',
				CLASS_NAME: 'BP_FlyingBabyCrab_C'
			},
			HOG: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Hog/Char_Hog.Char_Hog_C',
				CLASS_NAME: 'Char_Hog_C'
			},
			ALPHA_HOG: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Hog/AlphaHog/Char_AlphaHog.Char_AlphaHog_C',
				CLASS_NAME: 'Char_AlphaHog_C'
			},
			CLIFF_HOG: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Hog/CliffHog/Char_CliffHog.Char_CliffHog_C',
				CLASS_NAME: 'Char_CliffHog_C'
			},
			NUCLEAR_HOG: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Hog/NuclearHog/Char_NuclearHog.Char_NuclearHog_C',
				CLASS_NAME: 'Char_NuclearHog_C'
			},
			JOHNNY_HOG: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Hog/Johnny/Char_Johnny.Char_Johnny_C',
				CLASS_NAME: 'Char_Johnny_C'
			},
			SPITTER_ALPHA: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Spitter/AlternativeSpitter/Char_Spitter_Alternative.Char_Spitter_Alternative_C',
				CLASS_NAME: 'Char_Spitter_Alternative_C'
			},
			SPITTER_DESERT_SMALL: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Spitter/SpitterDesert/Char_SpitterDesertSmall.Char_SpitterDesertSmall_C',
				CLASS_NAME: 'Char_SpitterDesertSmall_C'
			},
			SPITTER_DESERT_ALPHA: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Spitter/SpitterDesert/Char_SpitterDesertAlpha.Char_SpitterDesertAlpha_C',
				CLASS_NAME: 'Char_SpitterDesertAlpha_C'
			},
			SPITTER_FOREST_SMALL: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Spitter/SpitterForest/Char_SpitterForestSmall.Char_SpitterForestSmall_C',
				CLASS_NAME: 'Char_SpitterForestSmall_C'
			},
			SPITTER_FOREST_ALPHA: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Spitter/SpitterForest/Char_SpitterForestAlpha.Char_SpitterForestAlpha_C',
				CLASS_NAME: 'Char_SpitterForestAlpha_C'
			},
			SPITTER_RED_FOREST_SMALL: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Spitter/SpitterForestRed/Char_SpitterForestRedSmall.Char_SpitterForestRedSmall_C',
				CLASS_NAME: 'Char_SpitterForestRedSmall_C'
			},
			SPITTER_RED_FOREST_ALPHA: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Spitter/SpitterForestRed/Char_SpitterForestRedAlpha.Char_SpitterForestRedAlpha_C',
				CLASS_NAME: 'Char_SpitterForestRedAlpha_C'
			},
			SPITTER_AQUATIC_SMALL: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Spitter/SpitterAquatic/Char_SpitterAquaticSmall.Char_SpitterAquaticSmall_C',
				CLASS_NAME: 'Char_SpitterAquaticSmall_C'
			},
			SPITTER_AQUATIC_ALPHA: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Enemy/Spitter/SpitterAquatic/Char_SpitterAquaticAlpha.Char_SpitterAquaticAlpha_C',
				CLASS_NAME: 'Char_SpitterAquaticAlpha_C'
			}
		},
		ANIMAL: {
			LIZARD_DOGGO: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Wildlife/SpaceRabbit/Char_SpaceRabbit.Char_SpaceRabbit_C',
				CLASS_NAME: 'Char_SpaceRabbit_C'
			},
			BEETLE: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Wildlife/Beetle/Char_Beetle.Char_Beetle_C',
				CLASS_NAME: 'Char_Beetle_C'
			},
			SPACE_GIRAFFE: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Wildlife/SpaceGiraffe/Char_SpaceGiraffe.Char_SpaceGiraffe_C',
				CLASS_NAME: 'Char_SpaceGiraffe_C'
			},
			BIRD: {
				TYPE_PATH: '/Game/FactoryGame/Character/Creature/Wildlife/NonFlyingBird/Char_NonFlyingBird.Char_NonFlyingBird_C',
				CLASS_NAME: 'Char_NonFlyingBird_C'
			}
		},
		BUILDGUN_BP: {
			TYPE_PATH: '/Game/FactoryGame/Equipment/BuildGun/BP_BuildGun.BP_BuildGun_C',
			CLASS_NAME: 'BP_BuildGun_C'
		},
		BUILDGUN: {
			TYPE_PATH: '/Script/FactoryGame.FGBuildGun'
		},
		ELEVATOR: {
			ELEVATOR_CABIN: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/Elevator/BP_ElevatorCabin.BP_ElevatorCabin_C',
				CLASS_NAME: 'BP_ElevatorCabin_C'
			},
			STOP: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/Elevator/Build_ElevatorFloorStop.Build_ElevatorFloorStop_C',
				CLASS_NAME: 'Build_ElevatorFloorStop_C'
			},
			ELEVATOR: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/Elevator/Build_Elevator.Build_Elevator_C',
				CLASS_NAME: 'Build_Elevator_C'
			}
		},
		HYPERTUBES: {
			HYPERTUBE_SUPPORT: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/PipeHyperSupport/Build_PipeHyperSupport.Build_PipeHyperSupport_C',
				CLASS_NAME: 'Build_PipeHyperSupport_C'
			},
			HYPERTUBE_ENTRANCE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/PipeHyperStart/Build_PipeHyperStart.Build_PipeHyperStart_C',
				CLASS_NAME: 'Build_PipeHyperStart_C',
				RECIPE: '/Game/FactoryGame/Recipe_PipeHyperStart.Recipe_PipeHyperStart_C'
			},
			HYPERTUBE: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/PipeHyper/Build_PipeHyper.Build_PipeHyper_C',
				CLASS_NAME: 'Build_PipeHyper_C'
			},
			TJUNCTION: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/PipeHyperTJunction/Build_HypertubeTJunction.Build_HypertubeTJunction_C',
				CLASS_NAME: 'Build_HypertubeTJunction_C'
			},
			JUNCTION: {
				TYPE_PATH: '/Game/FactoryGame/Buildable/Factory/PipeHyperJunction/Build_HyperTubeJunction.Build_HyperTubeJunction_C',
				CLASS_NAME: 'Build_HyperTubeJunction_C'
			}
		},
		SUBSYSTEMS_AND_MANAGERS: {
			WORLD_SETTINGS: {
				TYPE_PATH: '/Script/FactoryGame.FGWorldSettings',
			},
			LIGHTWEIGHT_BUILDABLE_SUBSYSTEM: {
				TYPE_PATH: '/Script/FactoryGame.FGLightweightBuildableSubsystem'
			},
			BUILDABLE_SUBSYSTEM: {
				TYPE_PATH: '/Game/FactoryGame/-Shared/Blueprint/BP_BuildableSubsystem.BP_BuildableSubsystem_C'
			},

			FOLIAGE_REMOVAL_SUBSYSTEM: {
				TYPE_PATH: '/Script/FactoryGame.FGFoliageRemovalSubsystem'
			},
			MAP_MANAGER: {
				TYPE_PATH: '/Script/FactoryGame.FGMapManager'
			},
			RECIPE_MANAGER: {
				INSTANCE_NAME: 'Persistent_Level:PersistentLevel.recipeManager',
				TYPE_PATH: '/Script/FactoryGame.FGRecipeManager',
			},
			UNLOCK_SUBSYSTEM: {
				INSTANCE_NAME: 'Persistent_Level:PersistentLevel.unlockSubsystem',
				TYPE_PATH: '/Game/FactoryGame/Unlocks/BP_UnlockSubsystem.BP_UnlockSubsystem_C',
			},
			RESEARCH_MANAGER: {
				INSTANCE_NAME: 'Persistent_Level:PersistentLevel.ResearchManager',
				TYPE_PATH: '/Game/FactoryGame/Recipes/Research/BP_ResearchManager.BP_ResearchManager_C'
			},
			SCHEMATIC_MANAGER: {
				TYPE_PATH: '/Game/FactoryGame/Schematics/Progression/BP_SchematicManager.BP_SchematicManager_C',
			},
			STATISTICS_SUBSYSTEM: {
				TYPE_PATH: '/Script/FactoryGame.FGStatisticsSubsystem'
			},
			RESOURCE_SINK_SUBSYSTEM: {
				TYPE_PATH: '/Script/FactoryGame.FGResourceSinkSubsystem'
			},
			GAME_RULES_SUBSYSTEM: {
				TYPE_PATH: '/Script/FactoryGame.FGGameRulesSubsystem'
			}
		}
	},
	COMPONENTS: {
		HEALTH_COMPONENT: {
			TYPE_PATH: '/Script/FactoryGame.FGHealthComponent'
		},
		INVENTORY_COMPONENT: {
			TYPE_PATH: '/Script/FactoryGame.FGInventoryComponent'
		},
		POWER_CONNECTION_COMPONENT: {
			TYPE_PATH: '/Script/FactoryGame.FGPowerConnectionComponent'
		},
		POWER_INFO_COMPONENT: {
			TYPE_PATH: '/Script/FactoryGame.FGPowerInfoComponent'
		},
		POWER_CIRCUIT: {
			TYPE_PATH: '/Script/FactoryGame.FGPowerCircuit'
		},
		RAILWAY_CONNECTION_COMPONENT: {
			TYPE_PATH: '/Script/FactoryGame.FGRailroadTrackConnectionComponent'
		},
		FACTORY_CONNECTION_COMPONENT: {
			TYPE_PATH: '/Script/FactoryGame.FGFactoryConnectionComponent',
			ENUM_BASE: 'EFactoryConnectionDirection',
			ENUM_INPUT: 'EFactoryConnectionDirection' + '::FCD_INPUT',
			ENUM_OUTPUT: 'EFactoryConnectionDirection' + '::FCD_OUTPUT',
		},
		HYPERTUBE_CONNECTION_COMPONENT: {
			TYPE_PATH: '/Script/FactoryGame.FGPipeConnectionComponentHyper'
		},
		WORKBENCH_COMPONENT: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/-Shared/WorkBench/BP_WorkBenchComponent.BP_WorkBenchComponent_C'
		},
		AUTOMATED_WORKBENCH: {
			TYPE_PATH: '/Script/FactoryGame.FGBuildableAutomatedWorkBench'
		},
		WORKSHOP_COMPONENT: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/-Shared/WorkBench/BP_WorkshopComponent.BP_WorkshopComponent_C'
		}
	},
	PATTERNS: {
		FULL_FACTORY_ZONE: {
			TYPE_PATH: '/Game/FactoryGame/Buildable/-Shared/Customization/Patterns/Zones/PatternDesc_ZoneFull.PatternDesc_ZoneFull_C'
		}
	},
	EMOTES: {
		CLAP: '/Game/FactoryGame/Emotes/Emote_Clap.Emote_Clap_C',
		BUILDGUN_SPIN: '/Game/FactoryGame/Emotes/Emote_BuildGunSpin.Emote_BuildGunSpin_C',
		FACEPALM: '/Game/FactoryGame/Emotes/Emote_FacePalm.Emote_FacePalm_C',
		ROCK: '/Game/FactoryGame/Emotes/Emote_Rock.Emote_Rock_C',
		PAPER: '/Game/FactoryGame/Emotes/Emote_Paper.Emote_Paper_C',
		SCISSORS: '/Game/FactoryGame/Emotes/Emote_Scissors.Emote_Scissors_C',
		POINT: '/Game/FactoryGame/Emotes/Emote_Point.Emote_Point_C',
		WAVE: '/Game/FactoryGame/Emotes/Emote_Wave.Emote_Wave_C',
		HEART: '/Game/FactoryGame/Emotes/Emote_Heart.Emote_Heart_C',
		FINGERGUNS: '/Game/FactoryGame/Emotes/Emote_Fingerguns.Emote_Fingerguns_C',
	},
	TAPES: {
		ABSOLUTE_FICSIT: {
			DISPLAY_NAME: 'Absolute Ficsit',
			PATH_NAME: '/Game/FactoryGame/Resource/Tape/AbsoluteFicsit/Tape_AbsoluteFicsit.Tape_AbsoluteFicsit_C',
		},
		WORST_OF_GOAT_SIMULATOR: {
			DISPLAY_NAME: 'Worst of Goat Simulator',
			PATH_NAME: '/Game/FactoryGame/Resource/Tape/Goat/Tape_WorstOfGoat.Tape_WorstOfGoat_C',
		},
		JOEL_SYNTHOLM: {
			DISPLAY_NAME: 'Joel Syntholm',
			PATH_NAME: '/Game/FactoryGame/Resource/Tape/JoelSyntholm/Tape_JoelSyntholm.Tape_JoelSyntholm_C',
		},
		LE_MICHAEL: {
			DISPLAY_NAME: 'Le Michael',
			PATH_NAME: '/Game/FactoryGame/Resource/Tape/LeMichael/Tape_LeMichael.Tape_LeMichael_C',
		},
		SANCTUM: {
			DISPLAY_NAME: 'Sanctum',
			PATH_NAME: '/Game/FactoryGame/Resource/Tape/Sanctum/Tape_Sanctum.Tape_Sanctum_C',
		},
		SANCTUM_2: {
			DISPLAY_NAME: 'Sanctum 2',
			PATH_NAME: '/Game/FactoryGame/Resource/Tape/Sanctum2/Tape_Sanctum2.Tape_Sanctum2_C',
		},
		SONGS_OF_CONQUEST: {
			DISPLAY_NAME: 'Songs of Conquest',
			PATH_NAME: '/Game/FactoryGame/Resource/Tape/SongsOfConquest/Tape_SongsOfConquest.Tape_SongsOfConquest_C',
		},
		DEEP_ROCK_GALACTIC: {
			DISPLAY_NAME: 'Deep Rock Galactic',
			PATH_NAME: '/Game/FactoryGame/Resource/Tape/DeepRockGalactic/Tape_DeepRockGalactic.Tape_DeepRockGalactic_C',
		},
		HUNTDOWN: {
			DISPLAY_NAME: 'Huntdown',
			PATH_NAME: '/Game/FactoryGame/Resource/Tape/Huntdown/Tape_Huntdown.Tape_Huntdown_C',
		}
	},
	SKINS: {
		FICSMAS_STANDARD: {
			DISPLAY_NAME: 'Ficsmas Standard',
			PATH_NAME: '/Game/FactoryGame/Buildable/-Shared/Customization/Skins/Recipe_SkinFicsmas_Default.Recipe_SkinFicsmas_Default_C'
		},
		FICSMAS_PREMIUM: {
			DISPLAY_NAME: 'Ficsmas Premium',
			PATH_NAME: '/Game/FactoryGame/Buildable/-Shared/Customization/Skins/Recipe_SkinFicsmas_Premium.Recipe_SkinFicsmas_Premium_C'
		},
	},
	AREAS: {
		GRASS_FIELDS: [
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_GrassFields_1.Area_GrassFields_1_C',
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_GrassFields_2.Area_GrassFields_2_C',
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_GrassFields_3.Area_GrassFields_3_C'
		],
		EASTERN_DUNE_FOREST: [
			'FactoryGame/Content/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_EasternDuneForest_1.Area_EasternDuneForest_1_C'
		],
		WESTERN_DUNE_FOREST: [
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_WesternDuneForest_1.Area_WesternDuneForest_1_C',
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_WesternDuneForest_2.Area_WesternDuneForest_2_C',
		],
		NO_MANS_LAND: [
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_NoMansLand_1.Area_NoMansLand_1_C'
		],
		CRATER: [
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_crater_1.Area_crater_1_C',
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_crater_2.Area_crater_2_C'
		],
		SAVANNA: [
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_Savanna_1.Area_Savanna_1_C',
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_Savanna_2.Area_Savanna_2_C'
		],
		RED_JUNGLE: [
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_RedJungle_1.Area_RedJungle_1_C',
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_RedJungle_2.Area_RedJungle_2_C'
		],
		ROcKY_DESERT: [
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_RockyDesert_1.Area_RockyDesert_1_C',
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_RockyDesert_2.Area_RockyDesert_2_C'
		],
		DUNE_DESERT: [
			'FactoryGame/Content/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_DuneDesert_1.Area_DuneDesert_1_C',
			'FactoryGame/Content/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_DuneDesert_2.Area_DuneDesert_2_C'
		],
		NORTHERN_FOREST: [
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_NorthernForest_1.Area_NorthernForest_1_C',
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_NorthernForest_2.Area_NorthernForest_2_C'
		],
		SOUTHERN_FOREST: [
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_SouthernForest_1.Area_SouthernForest_1_C',
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_SouthernForest_2.Area_SouthernForest_2_C'
		],
		RED_BAMBOO: [
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_RedBambooFields_1.Area_RedBambooFields_1_C',
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_RedBambooFields_2.Area_RedBambooFields_2_C'
		],
		TITAN_FOREST: [
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_TitanForest_1.Area_TitanForest_1_C',
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_TitanForest_2.Area_TitanForest_2_C'
		],
		LAKE_FOREST: [
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_LakeForest_1.Area_LakeForest_1_C',
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_LakeForest_2.Area_LakeForest_2_C'
		],
		DESERT_CANYON: [
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_DesertCanyons_1.Area_DesertCanyons_1_C',
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_DesertCanyons_2.Area_DesertCanyons_2_C'
		],
		MAZE_CANYONS: [
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_MazeCanyons_1.Area_MazeCanyons_1_C',
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_MazeCanyons_2.Area_MazeCanyons_2_C'
		],
		SPIRE_COAST: [
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_SpireCoast.Area_SpireCoast_C'
		],
		SWAMP: [
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_Swamp_1.Area_Swamp_1_C',
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_Swamp_2.Area_Swamp_2_C'
		],
		ABYSS_CLIFFS: [
			'/Game/FactoryGame/Interface/UI/Minimap/MapAreaPersistenLevel/Area_AbyssCliffs_1.Area_AbyssCliffs_1_C'
		]
	}
} as const;
