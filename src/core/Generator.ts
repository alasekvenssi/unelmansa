import {Creature} from "./Creature"
import {CreatureBone} from "./Creature"
import Vec2 from "../util/Vec2"
import {CreatureMuscle} from "./Creature"
import Collide from "../physics/Collisions";
	
export function generateCreature(): Creature {
	while(true)
	{
		let generated: Creature = new Creature();

		let numberOfBones: number = Math.floor(3*Math.random())+3;
		for (let i = 0; i < numberOfBones; ++i) {
			generated.bones.push(generateCreatureBone());
		}

		for (let i = 0; i < numberOfBones; ++i) {
			for (let j = i+1; j < numberOfBones; ++j) {
				Collide(generated.bones[i], generated.bones[j]);
				
				if(Math.random() >= 0.5) {
					generated.muscles.push(generateCreatureMuscle(generated.bones[i], generated.bones[j]));
				}
			}
		}

		if(generated.isStronglyConnected()) {
			return generated;
		}
	}
}

export function generateCreatureBone(): CreatureBone {
	let newBone: CreatureBone = new CreatureBone(
		new Vec2(Math.random()*500 - 1000, Math.random()*500 - 1000+1500),
		Math.random()*30+10,
		Math.random()*10+1,
		Math.random(),
		Math.random()
	);

	newBone.mass = Math.PI*newBone.radius / 16;
	return newBone
}

export function generateCreatureMuscle(lhs: CreatureBone, rhs: CreatureBone) {
	return new CreatureMuscle(
		lhs,
		rhs,
		lhs.position.distance(rhs.position) + 50,
		(lhs.position.distance(rhs.position) + 50) * 3,
		Math.random() * 50 + 1,
		Math.random() * 4 + 1,
		Math.random()
	);
}