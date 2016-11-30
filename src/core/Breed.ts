import { Creature } from "./Creature"
import { CreatureBone } from "./Creature"
import Vec2 from "../util/Vec2"
import { CreatureMuscle } from "./Creature"

export default function breed(lhs: Creature, rhs: Creature): Creature {
    if (lhs.bones.length != rhs.bones.length) {
        throw "Not implemented";
    }

    while (true) {
        let compBones = function(lhs: CreatureBone, rhs: CreatureBone) {
            if (lhs.position == rhs.position) {
                return 0;
            }
            else if (lhs.position.x < rhs.position.x) {
                return -1;
            }
            else if (lhs.position.x == rhs.position.x && lhs.position.y < rhs.position.y) {
                return -1;
            }
            else {
                return 1;
            }
        };

        lhs.bones.sort(compBones);
        rhs.bones.sort(compBones);

        let kid = new Creature();
        for (let i = 0; i < lhs.bones.length; ++i) {
            kid.bones.push(
                new CreatureBone(
                    new Vec2((lhs.bones[i].position.x + rhs.bones[i].position.x) / 2,
                        (lhs.bones[i].position.y + rhs.bones[i].position.y) / 2),
						(lhs.bones[i].radius + rhs.bones[i].radius) / 2,
						(lhs.bones[i].mass + rhs.bones[i].mass) / 2,
						(lhs.bones[i].elasticity + rhs.bones[i].elasticity) / 2,
						(lhs.bones[i].friction + rhs.bones[i].friction) / 2
                )
            )
        }

        let getMuscleIn = function(lhs: CreatureBone, rhs: CreatureBone, muscles: CreatureMuscle[]) {
            for (let i = 0; i < muscles.length; ++i) {

                if ((muscles[i].bone1 == lhs && muscles[i].bone2 == rhs) || (muscles[i].bone1 == rhs && muscles[i].bone2 == lhs)) {
                    return muscles[i];
                }
            }
            return undefined;
        }

        for (let i = 0; i < lhs.bones.length; ++i) {
            for (var j = i + 1; j < lhs.bones.length; ++j) {
                let lhsMuscle: CreatureMuscle = getMuscleIn(lhs.bones[i], lhs.bones[j], lhs.muscles);
                let rhsMuscle: CreatureMuscle = getMuscleIn(rhs.bones[i], rhs.bones[j], rhs.muscles);

                if (lhsMuscle != undefined && rhsMuscle != undefined) {
                    kid.muscles.push(new CreatureMuscle(
                        kid.bones[i],
                        kid.bones[j],
                        (lhsMuscle.minLength + rhsMuscle.minLength) / 2,
                        (lhsMuscle.maxLength + rhsMuscle.maxLength) / 2,
                        (lhsMuscle.strength + rhsMuscle.strength) / 2,
                        (lhsMuscle.timerInterval + rhsMuscle.timerInterval) / 2,
                        (lhsMuscle.expandFactor + rhsMuscle.expandFactor) / 2
                    	)
                    );

                }
                else if (lhsMuscle != undefined && Math.random() >= 0.5) {
                    kid.muscles.push(new CreatureMuscle(
                        kid.bones[i],
                        kid.bones[j],
                        lhsMuscle.minLength,
                        lhsMuscle.maxLength,
                        lhsMuscle.strength,
                        lhsMuscle.timerInterval,
                        lhsMuscle.expandFactor
                    	)
                    );
                }
                else if (rhsMuscle != undefined && Math.random() >= 0.5) {
                    kid.muscles.push(new CreatureMuscle(
                        kid.bones[i],
                        kid.bones[j],
                        rhsMuscle.minLength,
                        rhsMuscle.maxLength,
                        rhsMuscle.strength,
                        rhsMuscle.timerInterval,
                        rhsMuscle.expandFactor
                    	)
                    );
                }
            }
        }

        if (kid.isStronglyConnected()) {
            return kid;
        }
    }
}
