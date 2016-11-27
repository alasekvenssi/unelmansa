import {Creature} from "./Creature"
import {CreatureBone} from "./Creature"
import Vec2 from "../util/Vec2"
import {CreatureMuscle} from "./Creature"
import Collide from "../physics/Collisions";

export default function generateCreature(): Creature {
	while(true)
	{
		let generated: Creature = new Creature();

		let numberOfBones: number = Math.floor(3*Math.random())+3;
		for (let i = 0; i < numberOfBones; ++i) {
			generated.bones.push(new CreatureBone(
				new Vec2(Math.random()*200 - 100, Math.random()*100 - 100),
				Math.random()*30+10,
				Math.random()*10+1,
				Math.random(),
				Math.random()
				)
			);
		}

		for (let i = 0; i < numberOfBones; ++i) {
			for (let j = i+1; j < numberOfBones; ++j) {
				Collide(generated.bones[i], generated.bones[j]);
				
				if(Math.random() >= 0.5) {
					generated.muscles.push(new CreatureMuscle(
						generated.bones[i],
						generated.bones[j],
						generated.bones[i].position.distance(generated.bones[j].position) + 10,
						(generated.bones[i].position.distance(generated.bones[j].position) + 10)*2,
						Math.random()*50+1,
						Math.random()*4+1,
						Math.random()
						)
					);
				}
			}
		}

		if(generated.isStronglyConnected()) {
			return new Creature();
		}
	}
}
