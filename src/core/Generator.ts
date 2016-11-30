import { Creature } from "./Creature"
import { CreatureBone } from "./Creature"
import Vec2 from "../util/Vec2"
import { CreatureMuscle } from "./Creature"
import Collide from "../physics/Collisions";
import * as MathUtil from "../util/Math"
import * as Consts from "./Consts"

export function generateCreature(): Creature {
    while (true) {
        let generated: Creature = new Creature();

        let numberOfBones: number = Math.floor(MathUtil.random(Consts.GENERATOR_BONE_MIN_AMOUNT, Consts.GENERATOR_BONE_MAX_AMOUNT + 1));
        for (let i = 0; i < numberOfBones; ++i) {
            generated.bones.push(generateCreatureBone());
        }

        for (let i = 0; i < numberOfBones; ++i) {
            for (let j = i + 1; j < numberOfBones; ++j) {
                Collide(generated.bones[i], generated.bones[j]);

                if (Math.random() >= 0.5) {
                    generated.muscles.push(generateCreatureMuscle(generated.bones[i], generated.bones[j]));
                }
            }
        }

        if (generated.isStronglyConnected()) {
            return generated;
        }
    }
}

export function generateCreatureBone(): CreatureBone {
    let newBone: CreatureBone = new CreatureBone(
        new Vec2(Math.random() * 500 - 1000, Math.random() * 500 - 1000 + 1500),
        MathUtil.random(Consts.GENERATOR_BONE_MIN_RADIUS, Consts.GENERATOR_BONE_MAX_RADIUS),
        0, // Mass will be calculated later
        Math.random(),
        Math.random()
    );

    newBone.mass = Math.PI * newBone.radius / 20;
    return newBone;
}

export function generateCreatureMuscle(lhs: CreatureBone, rhs: CreatureBone) {
    let dist: number = lhs.position.distance(rhs.position);
    let len1: number = dist * MathUtil.random(Consts.GENERATOR_MUSCLE_MIN_LENGTH_DIST_FACTOR, Consts.GENERATOR_MUSCLE_MAX_LENGTH_DIST_FACTOR) +
        MathUtil.random(Consts.GENERATOR_MUSCLE_MIN_LENGTH_CONST, Consts.GENERATOR_MUSCLE_MAX_LENGTH_CONST);
    let len2: number = len1 * (1 + MathUtil.random(Consts.GENERATOR_MUSCLE_MIN_RELATIVE_LENGTH_DIFF, Consts.GENERATOR_MUSCLE_MAX_RELATIVE_LENGTH_DIFF));
    let str: number = MathUtil.random(Consts.GENERATOR_MUSCLE_MIN_STRENGTH, Consts.GENERATOR_MUSCLE_MAX_STRENGTH);
    let interval: number = MathUtil.random(Consts.GENERATOR_MUSCLE_MIN_INTERVAL, Consts.GENERATOR_MUSCLE_MAX_INTERVAL);
    let expandFactor: number = MathUtil.random(Consts.GENERATOR_MUSCLE_MIN_EXPAND_FACTOR, Consts.GENERATOR_MUSCLE_MAX_EXPAND_FACTOR);

    return new CreatureMuscle(
        lhs, rhs,
        len1, len2,
        str,
        interval,
        expandFactor
    );
}