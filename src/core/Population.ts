import { Creature, CreatureBone, CreatureMuscle } from "./Creature"
import * as Generator from "./Generator";
import Vec2 from "../util/Vec2";
import Breed from "./Breed"
import { Scene } from "./Scene"
import * as Consts from "./Consts"
import * as Util from "./Util"
import * as MathUtil from "../util/Math"
import * as Compress from "./Compress"

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

		for (let i = 0; i < this.population.length; ++i) {
			let lhs = this.population[i];
			let delta = 0;
			
			for(let j = 0; j < i; ++j) {
				let rhs = this.population[j];
				delta += Consts.CREATUREDIFF_MULTIPLIER/(lhs.diff(rhs) + 1);//Math.max(Consts.CREATUREDIFF_MULTIPLIER/(lhs.diff(rhs) + 1), delta);
			}

			// console.log(delta)
			delta *= 50/lhs.bones.length;
			lhs.result -= delta;
			lhs.minusPoints = delta;
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
		return JSON.stringify(Compress.compressPopulation(this));
	}

	load(json: string): void {
		let packed = <Compress.PopulationPacked>JSON.parse(json);
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
