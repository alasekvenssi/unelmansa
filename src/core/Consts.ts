/* ================ Mutation ================ */
export const MUTATION_CHANCE = 0.01;

export const MUTATION_RELATIVE_FRICTION_DIFF = 0.15;
export const MUTATION_BONE_FRICTION_CHANCE = 0.2;

export const MUTATION_ELASTICITY_FRICTION_DIFF = 0.15;
export const MUTATION_ELASTICITY_FRICTION_CHANCE = 0.2;

export const MUTATION_RELATIVE_STRENGTH_DIFF = 0.15;
export const MUTATION_MUSCLE_STRENGTH_CHANCE = 0.2;

export const MUTATION_DELETE_BONE_CHANCE = 0.05;

export const MUTATION_ADD_BONE_CHANCE = 0.1;
export const MUTATION_CONNECTION_CHANCE = 0.33;

export const MUTATION_CHANGE_BONE_POS_CHANCE = 0.1;
export const MUTATION_CHANGE_BONE_POS_MIN = -10;
export const MUTATION_CHANGE_BONE_POS_MAX = 10;

/* ================ Generator ================ */
export const GENERATOR_BONE_MIN_RADIUS = 30;
export const GENERATOR_BONE_MAX_RADIUS = 35;

export const GENERATOR_MUSCLE_MIN_LENGTH_DIST_FACTOR = 0.5;
export const GENERATOR_MUSCLE_MAX_LENGTH_DIST_FACTOR = 0.75;
export const GENERATOR_MUSCLE_MIN_LENGTH_CONST = 0;
export const GENERATOR_MUSCLE_MAX_LENGTH_CONST = 500;
export const GENERATOR_MUSCLE_MIN_RELATIVE_LENGTH_DIFF = 0.2;
export const GENERATOR_MUSCLE_MAX_RELATIVE_LENGTH_DIFF = 0.5;

export const GENERATOR_MUSCLE_MIN_STRENGTH = 30;
export const GENERATOR_MUSCLE_MAX_STRENGTH = 45;

export const GENERATOR_MUSCLE_MIN_INTERVAL = 1;
export const GENERATOR_MUSCLE_MAX_INTERVAL = 4;

export const GENERATOR_MUSCLE_MIN_EXPAND_FACTOR = 0.33;
export const GENERATOR_MUSCLE_MAX_EXPAND_FACTOR = 0.66;

export const GENERATOR_BONE_MIN_AMOUNT = 3;
export const GENERATOR_BONE_MAX_AMOUNT = 4;

/* ================ PHYSICS ================ */
export const ARE_BALLS_COLLIDABLE = false;
export const PHYSICS_GRAVITY = 981;
export const GROUND_ELASTICITY = 0.5;
export const GROUND_FRICTION = 0.5;
export const AIR_RESISTANCE = 0.5;

/* ================ POPULATION ================ */
export const POPULATION_SIZE = 200;
export const FRACTION_OF_BREEDED_POPULATION = 0.8;
export const ENABLE_MASS_DESTRUCTION = true;
export const MASS_DESTRUCTION_FACTOR = 0.99;
export const MASS_DESTRUCTION_INTERVAL = 100;


/* ================ SIMULATION ================ */
export const RUN_DURATION = 20;
export const SIMULATION_RESOLUTION = 30;
