import {Creature} from "./Creature"
import Generate from "./Generator";
import Vec2 from "../util/Vec2";


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
			this.push(Generate());
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
		// Test() ???

		this.removeSlowest();
		this.addRandomlyGeneratedCreatures(this.population.length);
		this.moveAllToStartingPosition;
	}

	population: Creature[];
}
