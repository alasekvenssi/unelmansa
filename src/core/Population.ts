import { Creature, CreatureBone, CreatureMuscle } from "./Creature"
import * as Generator from "./Generator";
import Vec2 from "../util/Vec2";
import Breed from "./Breed"
import { Scene } from "./Scene"
import * as Consts from "./Consts"
import * as Util from "./Util"
import * as MathUtil from "../util/Math"

export default class Population {

	constructor(size: number = 1000) {
		this.addRandomlyGeneratedCreatures(size);
		this.moveAllToStartingPosition();
	}

	sortCreatures(): void {
		this.population.sort(
			function (lhs: Creature, rhs: Creature) {
				if (lhs.result == rhs.result) {
					return 0;
				}
				else if (lhs.result < rhs.result) {
					return 1;
				}
				else {
					return -1;
				}
			});
	}

	push(newCreature: Creature): void {
		this.population.push(newCreature);
	}

	removeSlowest(amount: number = this.population.length / 2): void {
		this.sortCreatures();

		for (let i = 0; i < this.population.length; i++) {
			if(MathUtil.randomChance(MathUtil.tanh(2*i / this.population.length))) {
				this.population.splice(i,1);
				amount--;
			}
		}

		while(amount > 0) {
			this.population.pop();
			amount--;	
		}
	}

	addRandomlyGeneratedCreatures(amount: number = 1): void {
		for (let i = 0; i < amount; ++i) {
			this.push(Generator.generateCreature());
		}
	}

	moveAllToStartingPosition(): void {
		for (let creature of this.population) {
			// creature.result = -Infinity;
			let center: Vec2 = creature.center();

			for (let bone of creature.bones) {
				bone.position = bone.position.sub(center);
				bone.position.y = bone.position.y + 300;
			}
		}
	}

	rate(): void {
		for (let creature of this.population) {

			if (creature.result != -Infinity) {
				continue;
			}

			let clone = creature.clone();
			this.scene.addEntity(clone);

			for (let i = 0; i < Consts.RUN_DURATION * Consts.SIMULATION_RESOLUTION; i++) {
				this.scene.update(1 / Consts.SIMULATION_RESOLUTION);
			}

			creature.result = clone.currentResult();
			this.scene.removeEntity(clone);
		}
		this.sortCreatures();
		console.log("Best: ", this.population[0].result);
	}

	eugenics(): void {
		if(Consts.ENABLE_MASS_DESTRUCTION && (this.generation + 1) % Consts.MASS_DESTRUCTION_INTERVAL == 0) {
			this.removeSlowest(Math.floor(this.population.length * Consts.MASS_DESTRUCTION_FACTOR));

			while (this.population.length < Consts.POPULATION_SIZE) {
				this.push(Generator.generateCreature());
			}
		}
		else {
			this.removeSlowest();
		}
		let oldPopulationSize = this.population.length;

		while (this.population.length < Consts.FRACTION_OF_BREEDED_POPULATION * Consts.POPULATION_SIZE) {
			let fatherIndex = 0;
			let motherIndex = 0;

			while(fatherIndex == motherIndex && oldPopulationSize != 1) {
				fatherIndex = Math.floor(Math.random() * oldPopulationSize);
				motherIndex = Math.floor(Math.random() * oldPopulationSize);
			}

			let father: Creature = this.population[fatherIndex];
			let mother: Creature = this.population[motherIndex];

			let kid: Creature = undefined;
			try {
				kid = Breed(mother, father).mutate();
			}
			catch (e) {
				continue;
			}
			this.push(kid);
		}

		while (this.population.length < Consts.POPULATION_SIZE) {
			this.push(Generator.generateCreature());
		}

		this.moveAllToStartingPosition();
		this.generation++;
	}

	population: Creature[] = new Array<Creature>();
	generation: number = 0;

	private scene: Scene = Util.creatureScene();

	save(): string {
		let packed = new PopulationPacked();
		packed.population = new Array<CreaturePacked>(this.population.length);
		packed.generation = this.generation;

		for (let i = 0; i < this.population.length; i++) {
			let creature = this.population[i];
			let packedCreature = new CreaturePacked();
			packed.population[i] = packedCreature;

			packedCreature.bones = new Array<CreatureBonePacked>(creature.bones.length);
			packedCreature.muscles = new Array<CreatureMusclePacked>(creature.muscles.length);

			for (let j = 0; j < creature.bones.length; j++) {
				let bone = creature.bones[j];
				let packedBone = new CreatureBonePacked();
				packedCreature.bones[j] = packedBone;

				packedBone.position = [bone.position.x, bone.position.y];
				packedBone.radius = bone.radius;
				packedBone.mass = bone.mass;
				packedBone.elasticity = bone.elasticity;
				packedBone.friction = bone.friction;
			}

			for (let j = 0; j < creature.muscles.length; j++) {
				let muscle = creature.muscles[j];
				let packedMuscle = new CreatureMusclePacked();
				packedCreature.muscles[j] = packedMuscle;

				packedMuscle.bone1 = creature.bones.indexOf(muscle.bone1);
				packedMuscle.bone2 = creature.bones.indexOf(muscle.bone2);
				packedMuscle.minLength = muscle.minLength;
				packedMuscle.maxLength = muscle.maxLength;
				packedMuscle.strength = muscle.strength;
				packedMuscle.timerInterval = muscle.timerInterval;
				packedMuscle.expandFactor = muscle.expandFactor;
			}
		}

		return JSON.stringify(packed);
	}

	load(json: string): void {
		let packed = <PopulationPacked>JSON.parse(json);
		this.population = new Array<Creature>(packed.population.length);
		this.generation = packed.generation;

		for (let i = 0; i < packed.population.length; i++) {
			let packedCreature = packed.population[i];
			let creature = new Creature(
				new Array<CreatureBone>(packedCreature.bones.length),
				new Array<CreatureMuscle>(packedCreature.muscles.length)
			);
			this.population[i] = creature;

			for (let j = 0; j < creature.bones.length; j++) {
				let packedBone = packedCreature.bones[j];

				creature.bones[j] = new CreatureBone(
					new Vec2(packedBone.position[0], packedBone.position[1]),
					packedBone.radius,
					packedBone.mass,
					packedBone.elasticity,
					packedBone.friction
				);
			}

			for (let j = 0; j < creature.muscles.length; j++) {
				let packedMuscle = packedCreature.muscles[j];

				creature.muscles[j] = new CreatureMuscle(
					creature.bones[packedMuscle.bone1],
					creature.bones[packedMuscle.bone2],
					packedMuscle.minLength,
					packedMuscle.maxLength,
					packedMuscle.strength,
					packedMuscle.timerInterval,
					packedMuscle.expandFactor
				);
			}
		}
	}
}

class PopulationPacked {
	population: CreaturePacked[];
	generation: number;
}
class CreaturePacked {
	bones: CreatureBonePacked[];
	muscles: CreatureMusclePacked[];
}
class CreatureBonePacked {
	position: number[];
	radius: number = 1;
	mass: number = 1;
	elasticity: number = 0.75;
	friction: number = 0;
}
class CreatureMusclePacked {
	bone1: number;
	bone2: number;
	minLength: number;
	maxLength: number;
	strength: number;
	timerInterval: number;
	expandFactor: number;
}
