import {Creature} from "./Creature"
import Generate from "./Generator";

class Population {

	constructor(size: number = 1000) {
		this.addRandomlyGeneratedCreatures(size);
	}

	sortCreatures(): void {		
		this.population.sort(
			function(lhs: Creature, rhs: Creature) {
			if(lhs.center().x == rhs.center().x) {
				return 0;
			}
			else if(lhs.center().x < rhs.center().x) {
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

	makeFullCycle() {
		// Test() ???

		this.removeSlowest();
		this.addRandomlyGeneratedCreatures(this.population.length);
	}

	population: Creature[];
}
