import { Creature, CreatureBone, CreatureMuscle } from "./Creature"
import Population from "./Population"

export class PopulationPacked {
	population: CreaturePacked[];
	generation: number;
}

export class CreaturePacked {
	bones: CreatureBonePacked[];
	muscles: CreatureMusclePacked[];
}

export class CreatureBonePacked {
	position: number[];
	radius: number = 1;
	mass: number = 1;
	elasticity: number = 0.75;
	friction: number = 0;
}

export class CreatureMusclePacked {
	bone1: number;
	bone2: number;
	minLength: number;
	maxLength: number;
	strength: number;
	timerInterval: number;
	expandFactor: number;
}

export function compressCreatureBone(bone: CreatureBone): CreatureBonePacked {
    let packedBone = new CreatureBonePacked();

    packedBone.position = [bone.position.x, bone.position.y];
    packedBone.radius = bone.radius;
    packedBone.mass = bone.mass;
    packedBone.elasticity = bone.elasticity;
    packedBone.friction = bone.friction;

    return packedBone;
}

export function compressCreatureMuscle(muscle: CreatureMuscle, creature: Creature): CreatureMusclePacked {
    let packedMuscle = new CreatureMusclePacked();

    packedMuscle.bone1 = creature.bones.indexOf(muscle.bone1);
    packedMuscle.bone2 = creature.bones.indexOf(muscle.bone2);
    packedMuscle.minLength = muscle.minLength;
    packedMuscle.maxLength = muscle.maxLength;
    packedMuscle.strength = muscle.strength;
    packedMuscle.timerInterval = muscle.timerInterval;
    packedMuscle.expandFactor = muscle.expandFactor;

    return packedMuscle;
}

export function compressCreature(creature: Creature): CreaturePacked {
    let packedCreature = new CreaturePacked();

    packedCreature.bones = new Array<CreatureBonePacked>(creature.bones.length);
    packedCreature.muscles = new Array<CreatureMusclePacked>(creature.muscles.length);

    for (let i = 0; i < creature.bones.length; ++i) {
        let bone = creature.bones[i];
        packedCreature.bones[i] = compressCreatureBone(bone);
    }

    for (let i = 0; i < creature.muscles.length; ++i) {
        let muscle = creature.muscles[i];
        packedCreature.muscles[i] = compressCreatureMuscle(muscle, creature);
    }

    return packedCreature;
}

export function compressPopulation(population: Population): PopulationPacked {
    let packed = new PopulationPacked();
    packed.population = new Array<CreaturePacked>(population.population.length);
    packed.generation = population.generation;

    for (let i = 0; i < population.population.length; ++i) {
        let creature = population.population[i];
        packed.population[i] = compressCreature(creature);
    }

    return packed;
}