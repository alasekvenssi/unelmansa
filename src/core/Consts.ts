/* ================ Mutation ================ */
export const MUTATION_CHANCE = 0.1;

export const MUTATION_RELATIVE_FRICTION_DIFF = 0.3;
export const MUTATION_BONE_FRICTION_CHANCE = 0.4;

export const MUTATION_ELASTICITY_FRICTION_DIFF = 0.3;
export const MUTATION_ELASTICITY_FRICTION_CHANCE = 0.4;

export const MUTATION_RELATIVE_STRENGTH_DIFF = 0.3;
export const MUTATION_MUSCLE_STRENGTH_CHANCE = 0.4;
export const MUTATION_MUSCLE_MIN_LEN_CHANCE = 0.3;
export const MUTATION_MUSCLE_MAX_LEN_CHANGE = 0.3;
export const MUTATION_MUSCLE_REALTIVE_LEN_DIFF = 0.1;

export const MUTATION_DELETE_BONE_CHANCE = 0.1;

export const MUTATION_ADD_BONE_CHANCE = 0.2;
export const MUTATION_CONNECTION_CHANCE = 0.66;

export const MUTATION_CHANGE_BONE_POS_CHANCE = 0.2;
export const MUTATION_CHANGE_BONE_POS_MIN = -20;
export const MUTATION_CHANGE_BONE_POS_MAX = 20;

/* ================ Generator ================ */
export const GENERATOR_BONE_MIN_RADIUS = 25;
export const GENERATOR_BONE_MAX_RADIUS = 40;
	
export const GENERATOR_MUSCLE_MIN_LENGTH_DIST_FACTOR = 0.3;
export const GENERATOR_MUSCLE_MAX_LENGTH_DIST_FACTOR = 0.9;
export const GENERATOR_MUSCLE_MIN_LENGTH_CONST = 0;
export const GENERATOR_MUSCLE_MAX_LENGTH_CONST = 500;
export const GENERATOR_MUSCLE_MIN_RELATIVE_LENGTH_DIFF = 0.1;
export const GENERATOR_MUSCLE_MAX_RELATIVE_LENGTH_DIFF = 0.8;

export const GENERATOR_MUSCLE_MIN_STRENGTH = 10;
export const GENERATOR_MUSCLE_MAX_STRENGTH = 80;

export const GENERATOR_MUSCLE_MIN_INTERVAL = 0.5;
export const GENERATOR_MUSCLE_MAX_INTERVAL = 8;

export const GENERATOR_MUSCLE_MIN_EXPAND_FACTOR = 0.16;
export const GENERATOR_MUSCLE_MAX_EXPAND_FACTOR = 0.80;

export const GENERATOR_BONE_MIN_AMOUNT = 2;
export const GENERATOR_BONE_MAX_AMOUNT = 7;

/* ================ CreatureDiff ================ */
export const CREATUREDIFF_BONE_ELASTICITY_DIFF_THRESHOLD = 0.1; // Jeżeli różnica elastyczności dwóch kości będzie większa niż ta zmienna to licznik punktów zwiększy się o CREATUREDIFF_BONE_DIFF_POINTS
export const CREATUREDIFF_BONE_FRICTION_DIFF_THRESHOLD = 0.1; // Analogicznie jak wyżej
export const CREATUREDIFF_BONE_MASS_DIFF_THRESHOLD = 5; // Analogicznie jak wyżej
export const CREATUREDIFF_BONE_POS_DIFF_THRESHOLD = 10; // Analogicznie jak wyżej
export const CREATUREDIFF_BONE_RADIUS_DIFF_THRESHOLD = 2; // Analogicznie jak wyżej

export const CREATUREDIFF_BONE_ELASTICITY_AVG_DIFF_THRESHOLD = 0.1; // Analogicznie jak wyżej z różnicą że chodzi o średnią arytmetyczną
export const CREATUREDIFF_BONE_FRICTION_AVG_DIFF_THRESHOLD = 0.1; // Analogicznie jak wyżej
export const CREATUREDIFF_BONE_MASS_AVG_DIFF_THRESHOLD = 5; // Analogicznie jak wyżej
export const CREATUREDIFF_BONE_POS_AVG_DIFF_THRESHOLD = 10; // Analogicznie jak wyżej
export const CREATUREDIFF_BONE_RADIUS_AVG_DIFF_THRESHOLD = 2; // Analogicznie jak wyżej

export const CREATUREDIFF_BONE_DIFF_POINTS = 1337; // Ilość punktów dodawanych do licznika

export const CREATUREDIFF_MUSCLE_EXP_FACTOR_DIFF_THRESHOLD = 0.1; // Jeżeli różnica expandFactor dwóch mięśni będzie większa niż ta zmienna to licznik punktów zwiększy się o CREATUREDIFF_MUSCLE_DIFF_POINTS
export const CREATUREDIFF_MUSCLE_INTERVAL_TIME_DIFF_THRESHOLD = 0.3; // Analogicznie Jak wyżej
export const CREATUREDIFF_MUSCLE_MAX_LEN_DIFF_THRESHOLD = 10; // Analogicznie Jak wyżej
export const CREATUREDIFF_MUSCLE_MIN_LEN_DIFF_THRESHOLD = 10; // Analogicznie Jak wyżej
export const CREATUREDIFF_MUSCLE_STR_DIFF_THRESHOLD = 5; // Analogicznie Jak wyżej

export const CREATUREDIFF_MUSCLE_EXP_FACTOR_AVG_DIFF_THRESHOLD = 0.1; // Analogicznie Jak wyżej z różnicą że chodzi o średnią arytmetyczną
export const CREATUREDIFF_MUSCLE_INTERVAL_TIME_AVG_DIFF_THRESHOLD = 0.3; // Analogicznie Jak wyżej
export const CREATUREDIFF_MUSCLE_MAX_LEN_AVG_DIFF_THRESHOLD = 10; // Analogicznie Jak wyżej
export const CREATUREDIFF_MUSCLE_MIN_LEN_AVG_DIFF_THRESHOLD = 10; // Analogicznie Jak wyżej
export const CREATUREDIFF_MUSCLE_STR_AVG_DIFF_THRESHOLD = 5; // Analogicznie Jak wyżej

export const CREATUREDIFF_MUSCLE_BONES_DIFF_POINTS = 200; // Ilość punktów dodawanych do licznika gdy dwa mięśnie łączą różne kości muscle1.bone1 != muscle2.bone1 || muscle1.bone2 != muscle2.bone2
export const CREATUREDIFF_MUSCLE_DIFF_POINTS = 100; // Ilość punktów dodawanych za różnicę w właściwościach mięśni, gdy mięśnie łączą te same kości

export const CREATUREDIFF_MULTIPLIER = 2000000; // Ilość karnych punktów jest liczona ze wzoru 1/(diff + 1) * CREATUREDIFF_MULTIPLIER
export const CREATUREDIFF_THRESHOLD = 5e5;  // Jeżeli ilość punktów będzie większa niż ta zmienna to funckja zwróci infinity

/* ================ PHYSICS ================ */
export const ARE_BALLS_COLLIDABLE = true;
export const PHYSICS_GRAVITY = 981;
export const GROUND_ELASTICITY = 0.5;
export const GROUND_FRICTION = 0.5;
export const AIR_RESISTANCE = 0.5;

/* ================ POPULATION ================ */
export const POPULATION_SIZE = 200;
export const FRACTION_OF_BREEDED_POPULATION = 0.5;
export const ENABLE_MASS_DESTRUCTION = true;
export const MASS_DESTRUCTION_FACTOR = 0.99;
export const MASS_DESTRUCTION_INTERVAL = 200;
export const HOW_MANY_COMPARISONS = 5;
export const COMPARE_EVERYONE_INTERVAL = 10;
export const NO_HOPE_VALUE = -1e4;
export const KILLING_CHANCE_FACTOR = 1.4;

/* ================ SIMULATION ================ */
export const RUN_DURATION = 20;
export const SIMULATION_RESOLUTION = 30;
