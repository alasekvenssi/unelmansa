import {Creature} from "./Creature"
import * as Generator from "./Generator";
import Vec2 from "../util/Vec2";
import Breed from "./Breed"



export default class Population {

	constructor(size: number = 1000) {
		this.addRandomlyGeneratedCreatures(size);
		this.moveAllToStartingPosition();
	}

	sortCreatures(): void {		
		this.population.sort(
			function(lhs: Creature, rhs: Creature) {
			if(lhs.result == rhs.result) {
				return 0;
			}
			else if(lhs.result < rhs.result) {
				return -1;
			}
			else {
				return 1;
			}
		});
	}

	push(newCreature: Creature) {
		this.population.push(newCreature);
	}

	removeSlowest(amount: number = this.population.length/2) {
		this.sortCreatures();

		for (let i = 0; i < amount; ++i) {
			this.population.pop();
		}
	}

	addRandomlyGeneratedCreatures(amount: number = 1) {
		for (let i = 0; i < amount; ++i) {
			this.push(Generator.generateCreature());
		}
	}

	moveAllToStartingPosition() {
		for(let creature of this.population) {
			let center: Vec2 = creature.center();

			for(let bone of creature.bones) {
				bone.position = bone.position.sub(center);
				bone.position.y = bone.position.y + 100;
			}
		}
	}

	makeFullCycle() {
		this.removeSlowest();
		let oldPopulationSize = this.population.length;
		for (let i = 0; i < oldPopulationSize; ++i) {
			let father: Creature = this.population[Math.floor(Math.random()*oldPopulationSize)];
			let mother: Creature = this.population[Math.floor(Math.random()*oldPopulationSize)];

			this.push(Breed(mother, father).mutate());
		}
		this.moveAllToStartingPosition();
	}

	population: Creature[] = new Array<Creature>();
}
