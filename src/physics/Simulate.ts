import Collide from "./Collisions";
import * as Interface from "./Interface";
import * as Intersections from "./Intersections";
import Vec2 from "../util/Vec2"

export default function Simulate(simulables: Interface.Simulable[], timeDelta: number): void {

	for (let physical of simulables) {
		physical.affect(simulables);
	}

	for (let i = 0; i < simulables.length; i++) {
		for (let j = i + 1; j < simulables.length; ++j) {
			Collide(simulables[i], simulables[j]);
		}
	}
	for (let physical of simulables) {
		physical.velocity = physical.velocity.add(physical.acceleration.mul(timeDelta));
		physical.acceleration = new Vec2(0, 0);
		physical.position = physical.position.add(physical.velocity.mul(timeDelta));
	}
}