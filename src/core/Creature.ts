import Vec2 from "../util/Vec2"
import { Entity } from "./Entity"
import { Simulable } from "../physics/Interface"
import { Context2D } from "../graphics/Context2D"
import Color from "../util/Color"
import * as Intersections from "../physics/Intersections"
import * as utilMath from "../util/Math"
import * as Consts from "./Consts"
import DisjointNode from "../util/DisjointSet"
import * as Generator from "./Generator"
import * as Compress from "./Compress"
import PseudoGradient from "../util/PseudoGradient"

let bonePseudoGradient: PseudoGradient = new PseudoGradient();
bonePseudoGradient.insert({ value: 0.00, color: Color.White  }); // low friction
bonePseudoGradient.insert({ value: 0.33, color: Color.Yellow });
bonePseudoGradient.insert({ value: 0.66, color: Color.Red    });
bonePseudoGradient.insert({ value: 1.00, color: Color.Black  }); // high friction
bonePseudoGradient.prepare();

export class Creature extends Entity {
	constructor(
		public bones: CreatureBone[] = new Array<CreatureBone>(),
		public muscles: CreatureMuscle[] = new Array<CreatureMuscle>(),
		public result: number = -Infinity
	) {
		super();
	}

	movable(): boolean { return false; } // movable are its parts, creature is just group

	forEachSimulable(callback: (object: Simulable) => void): void {
		for (let muscle of this.muscles) {
			callback(muscle);
		}
		for (let bone of this.bones) {
			callback(bone);
		}
	}

	render(context: Context2D): void {
		for (let muscle of this.muscles) {
			muscle.render(context);
		}
		for (let bone of this.bones) {
			bone.render(context);
		}
	}

	currentResult(): number {
		let fitness: number = Infinity;
		for (let bone of this.bones) {
			fitness = Math.min(fitness, bone.position.x);
		}
		return fitness;
	}

	extremes(): Intersections.AABB {
		let aabb = new Intersections.AABB(new Vec2(Infinity, Infinity), new Vec2(-Infinity, -Infinity));

		for (let bone of this.bones) {
			aabb.min.x = Math.min(aabb.min.x, bone.position.x - bone.radius);
			aabb.min.y = Math.min(aabb.min.y, bone.position.y - bone.radius);
			aabb.max.x = Math.max(aabb.max.x, bone.position.x + bone.radius);
			aabb.max.y = Math.max(aabb.max.y, bone.position.y + bone.radius);
		}
		return aabb;
	}

	center(): Vec2 {
		let avg = new Vec2();
		for (let bone of this.bones) {
			avg = avg.add(bone.position);
		}
		return avg.div(this.bones.length);
	}

	update(timeDelta: number): void {
		for (let i: number = 0; i < this.bones.length; ++i) {
			this.bones[i].update(timeDelta);
		}

		for (let i: number = 0; i < this.muscles.length; ++i) {
			this.muscles[i].update(timeDelta);
		}
	}

	private makeDisjointSet(): Array<DisjointNode> {
		let disjoint: Array<DisjointNode> = new Array<DisjointNode>(this.bones.length);

		for (let i: number = 0; i < this.bones.length; ++i) {
			disjoint[i] = new DisjointNode();
		}

		for (let i: number = 0; i < this.muscles.length; ++i) {
			let lhsId: number = this.bones.indexOf(this.muscles[i].bone1);
			let rhsId: number = this.bones.indexOf(this.muscles[i].bone2);

			disjoint[lhsId].union(disjoint[rhsId]);
		}

		return disjoint;
	}

	isStronglyConnected(): boolean {
		return (this.bones.length <= 1 ? true : this.makeDisjointSet()[0].getSize() == this.bones.length);
	}

	makeStronglyConnected(): this {
		if (this.isStronglyConnected()) {
			return this;
		}

		let disjoint: Array<DisjointNode> = this.makeDisjointSet();
		for (let i: number = 1; i < disjoint.length; ++i) {
			if (disjoint[0].isSameSet(disjoint[i]) == false) {
				this.muscles.push(Generator.generateCreatureMuscle(this.bones[0], this.bones[i]));
				disjoint[0].union(disjoint[i]);
			}
		}

		return this;
	}

	clone(): Creature {
		let myClone = new Creature();

		for (let bone of this.bones) {
			myClone.bones.push(new CreatureBone(
				bone.position,
				bone.radius,
				bone.mass,
				bone.elasticity,
				bone.friction
			)
			)
		}

		let getMuscleIn = function (lhs: CreatureBone, rhs: CreatureBone, muscles: CreatureMuscle[]) {
			for (let i = 0; i < muscles.length; ++i) {

				if ((muscles[i].bone1 == lhs && muscles[i].bone2 == rhs) || (muscles[i].bone1 == rhs && muscles[i].bone2 == lhs)) {
					return muscles[i];
				}
			}
			return undefined;
		}

		for (let i = 0; i < this.bones.length; ++i) {
			for (let j = i + 1; j < this.bones.length; ++j) {
				let muscle: CreatureMuscle = getMuscleIn(this.bones[i], this.bones[j], this.muscles);
				if (muscle != undefined) {
					myClone.muscles.push(new CreatureMuscle(
						myClone.bones[i],
						myClone.bones[j],
						muscle.minLength,
						muscle.maxLength,
						muscle.strength,
						muscle.timerInterval,
						muscle.expandFactor
					)
					);
				}
			}
		}

		return myClone;
	}

	mutate(): Creature {
		if (!utilMath.randomChance(Consts.MUTATION_CHANCE)) {
			return this;
		}

		// Remove nodes
		for (let i: number = this.bones.length - 1; i >= 0; --i) {
			if (this.bones.length > 1 && utilMath.randomChance(Consts.MUTATION_DELETE_BONE_CHANCE)) {
				for (let j: number = this.muscles.length - 1; j >= 0; --j) {
					if (this.muscles[j].bone1 == this.bones[i] || this.muscles[j].bone2 == this.bones[i]) {
						this.muscles.splice(j, 1);
					}
				}
				this.bones.splice(i, 1);
			}
		}

		this.makeStronglyConnected();

		// Add random node
		if (utilMath.randomChance(Consts.MUTATION_ADD_BONE_CHANCE)) {
			this.bones.push(Generator.generateCreatureBone());
			let edges: number = 0;

			for (let i: number = 0; i < this.bones.length - 1; ++i) {
				if (utilMath.randomChance(Consts.MUTATION_CONNECTION_CHANCE)) {
					this.muscles.push(Generator.generateCreatureMuscle(this.bones[i], this.bones[this.bones.length - 1]));
					edges++;
				}
			}

			if (edges == 0) {
				this.bones.pop();
			}
		}

		// Random bone friction
		for (let i: number = 0; i < this.bones.length; ++i) {
			if (utilMath.randomChance(Consts.MUTATION_BONE_FRICTION_CHANCE)) {
				let diff: number = this.bones[i].friction * (Consts.MUTATION_RELATIVE_FRICTION_DIFF / 2) * Math.random();
				diff *= (utilMath.randomChance(0.5) ? -1 : 1);

				let newFriction = this.bones[i].friction + diff;
				newFriction = Math.min(newFriction, 1);
				newFriction = Math.max(newFriction, 0);

				this.bones[i].friction = newFriction;
			}
		}

		// Random bone elasticity
		for (let i: number = 0; i < this.bones.length; ++i) {
			if (utilMath.randomChance(Consts.MUTATION_ELASTICITY_FRICTION_CHANCE)) {
				let diff: number = this.bones[i].friction * (Consts.MUTATION_ELASTICITY_FRICTION_DIFF / 2) * Math.random();
				diff *= (utilMath.randomChance(0.5) ? -1 : 1);

				let newElasticity = this.bones[i].friction + diff;
				newElasticity = Math.min(newElasticity, 1);
				newElasticity = Math.max(newElasticity, 0);

				this.bones[i].elasticity = newElasticity;
			}
		}

		// Random bone position
		for (let bone of this.bones) {
			if (utilMath.randomChance(Consts.MUTATION_CHANGE_BONE_POS_CHANCE)) {
				this.position.x += utilMath.random(Consts.MUTATION_CHANGE_BONE_POS_MIN, Consts.MUTATION_CHANGE_BONE_POS_MAX);
				this.position.y += utilMath.random(Consts.MUTATION_CHANGE_BONE_POS_MIN, Consts.MUTATION_CHANGE_BONE_POS_MAX);
			}
		}

		// Random musscle strength
		for (let i: number = 0; i < this.muscles.length; ++i) {
			if (utilMath.randomChance(Consts.MUTATION_MUSCLE_STRENGTH_CHANCE)) {
				let diff: number = this.muscles[i].strength * (Consts.MUTATION_RELATIVE_STRENGTH_DIFF / 2) * Math.random();
				diff *= (utilMath.randomChance(0.5) ? -1 : 1);

				let newStrength = this.muscles[i].strength + diff;
				newStrength = Math.max(newStrength, 0);

				this.muscles[i].strength = newStrength;
			}
		}

		// Random muscle min len
		for(let i: number = 0; i < this.muscles.length; ++i) {
			if(utilMath.randomChance(Consts.MUTATION_MUSCLE_MIN_LEN_CHANCE)) {
				let diff: number = this.muscles[i].minLength * (Consts.MUTATION_MUSCLE_REALTIVE_LEN_DIFF / 2) * Math.random();
				diff *= (utilMath.randomChance(0.5) ? -1 : 1);

				let newMinLen = this.muscles[i].minLength + diff;
				newMinLen = Math.max(newMinLen, 0);

				this.muscles[i].minLength = newMinLen;
				if(this.muscles[i].minLength > this.muscles[i].maxLength) {
					[this.muscles[i].minLength, this.muscles[i].maxLength] = [this.muscles[i].maxLength, this.muscles[i].minLength];
				}

			}
		}

		// Random muscle max len
		for(let i: number = 0; i < this.muscles.length; ++i) {
			if(utilMath.randomChance(Consts.MUTATION_MUSCLE_MAX_LEN_CHANGE)) {
				let diff: number = this.muscles[i].maxLength * (Consts.MUTATION_MUSCLE_REALTIVE_LEN_DIFF / 2) * Math.random();
				diff *= (utilMath.randomChance(0.5) ? -1 : 1);

				let newMaxLen = this.muscles[i].maxLength + diff;
				newMaxLen = Math.max(0, newMaxLen);

				this.muscles[i].maxLength = newMaxLen;
				if(this.muscles[i].minLength > this.muscles[i].maxLength) {
					[this.muscles[i].minLength, this.muscles[i].maxLength] = [this.muscles[i].maxLength, this.muscles[i].minLength];
				}
			}
		}

		return this;
	}

	diff(creature: Creature): number {
		if(this.bones.length != creature.bones.length || this.muscles.length != creature.muscles.length) {
			return Infinity;
		}

		let lhs = this.clone();
		let rhs = creature.clone();

		let boneComp = (lhs: CreatureBone, rhs: CreatureBone) => {
			if(lhs.position.x != rhs.position.x) {
				return lhs.position.x < rhs.position.x ? -1 : lhs.position.x > rhs.position.x ? 1 : 0;
			} else {
				return lhs.position.y < rhs.position.y ? -1 : lhs.position.y > rhs.position.y ? 1 : 0;
			}
		};

		let muscleComp = (lhsMuscle: CreatureMuscle, rhsMuscle: CreatureMuscle) => {
			let lhsIdx = [lhs.bones.indexOf(lhsMuscle.bone1), lhs.bones.indexOf(lhsMuscle.bone2)];
			let rhsIdx = [rhs.bones.indexOf(rhsMuscle.bone1), rhs.bones.indexOf(rhsMuscle.bone2)];

			if(lhsIdx[0] > lhsIdx[1]) {[lhsIdx[0], lhsIdx[1]] = [lhsIdx[1], lhsIdx[0]]; }
			if(rhsIdx[0] > rhsIdx[1]) {[rhsIdx[0], rhsIdx[1]] = [rhsIdx[1], rhsIdx[0]]; }
		
			if(lhsIdx[0] != rhsIdx[0]) {
				return lhsIdx[0] < rhsIdx[0] ? -1 : lhsIdx[0] > rhsIdx[0] ? 1 : 0;
			} else {
				return lhsIdx[1] < rhsIdx[1] ? -1 : lhsIdx[1] > rhsIdx[1] ? 1 : 0;
			}
		};

		lhs.bones.sort(boneComp);
		rhs.bones.sort(boneComp);
		lhs.muscles.sort(muscleComp);
		rhs.muscles.sort(muscleComp);

		let boneElasticityDiffAvg     = 0;
		let boneFrictionDiffAvg       = 0;
		let boneMassDiffAvg           = 0;
		let bonePosDiffAvg            = 0;
		let boneRadiusDiffAvg         = 0;
		let diff                      = 0;
		let muscleExpFactorAvgDiff    = 0;
		let muscleIntervalTimeAvgDiff = 0;
		let muscleMaxLenAvgDiff       = 0;
		let muscleMinLenAvgDiff       = 0;
		let muscleStrAvgDiff          = 0;

		for (let i = 0; i < lhs.bones.length; ++i) {
			let bone1 = lhs.bones[i];
			let bone2 = rhs.bones[i];

			let boneElasticityDiff = Math.abs(bone1.elasticity - bone2.elasticity);
			let boneFrictionDiff   = Math.abs(bone1.friction - bone2.friction);
			let boneMassDiff       = Math.abs(bone1.mass - bone2.mass);
			let bonePosDiff        = new Vec2(bone1.position.x, bone1.position.y).distance(new Vec2(bone2.position.x, bone2.position.y));
			let boneRadiusDiff     = Math.abs(bone1.radius - bone2.radius);

			if(boneElasticityDiff > Consts.CREATUREDIFF_BONE_ELASTICITY_DIFF_THRESHOLD) { diff += Consts.CREATUREDIFF_BONE_DIFF_POINTS; }
			if(boneFrictionDiff   > Consts.CREATUREDIFF_BONE_FRICTION_DIFF_THRESHOLD)   { diff += Consts.CREATUREDIFF_BONE_DIFF_POINTS; }
			if(boneMassDiff       > Consts.CREATUREDIFF_BONE_MASS_DIFF_THRESHOLD)       { diff += Consts.CREATUREDIFF_BONE_DIFF_POINTS; }
			if(bonePosDiff        > Consts.CREATUREDIFF_BONE_POS_DIFF_THRESHOLD)        { diff += Consts.CREATUREDIFF_BONE_DIFF_POINTS; }
			if(boneRadiusDiff     > Consts.CREATUREDIFF_BONE_RADIUS_DIFF_THRESHOLD)     { diff += Consts.CREATUREDIFF_BONE_DIFF_POINTS; }

			boneElasticityDiffAvg += boneElasticityDiff / lhs.bones.length;
			boneFrictionDiffAvg   += boneFrictionDiff   / lhs.bones.length;
			boneMassDiffAvg       += boneMassDiff       / lhs.bones.length;
			bonePosDiffAvg        += bonePosDiff        / lhs.bones.length;
			boneRadiusDiffAvg     += boneRadiusDiff     / lhs.bones.length;
		}

		for(let i = 0; i < lhs.muscles.length; ++i) {
			let muscle1 = lhs.muscles[i];
			let muscle2 = rhs.muscles[i];

			let muscle1Idx = [lhs.bones.indexOf(muscle1.bone1), lhs.bones.indexOf(muscle1.bone2)];
			let muscle2Idx = [rhs.bones.indexOf(muscle2.bone1), rhs.bones.indexOf(muscle2.bone2)];
		
			if(muscle1Idx[0] > muscle1Idx[1]) {[muscle1Idx[0], muscle1Idx[1]] = [muscle1Idx[1], muscle1Idx[0]]; }
			if(muscle2Idx[0] > muscle2Idx[1]) {[muscle2Idx[0], muscle2Idx[1]] = [muscle2Idx[1], muscle2Idx[0]]; }

			if(muscle1Idx[0] != muscle2Idx[0] || muscle1Idx[1] != muscle2Idx[1]) {
				diff += Consts.CREATUREDIFF_MUSCLE_BONES_DIFF_POINTS;
				continue;
			}

			let muscleExpFactorDiff    = Math.abs(muscle1.expandFactor - muscle2.expandFactor);
			let muscleIntervalTimeDiff = Math.abs(muscle1.timerInterval - muscle2.timerInterval);
			let muscleMaxLenDiff       = Math.abs(muscle1.maxLength - muscle2.maxLength);
			let muscleMinLenDiff       = Math.abs(muscle1.minLength - muscle2.minLength);
			let muscleStrDiff          = Math.abs(muscle1.strength  - muscle2.strength);

			if(muscleExpFactorDiff    > Consts.CREATUREDIFF_MUSCLE_EXP_FACTOR_DIFF_THRESHOLD)    { diff += Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS; }
			if(muscleIntervalTimeDiff > Consts.CREATUREDIFF_MUSCLE_INTERVAL_TIME_DIFF_THRESHOLD) { diff += Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS; }
			if(muscleMaxLenDiff       > Consts.CREATUREDIFF_MUSCLE_MAX_LEN_DIFF_THRESHOLD)       { diff += Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS; }
			if(muscleMinLenDiff       > Consts.CREATUREDIFF_MUSCLE_MIN_LEN_DIFF_THRESHOLD)       { diff += Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS; }
			if(muscleStrDiff          > Consts.CREATUREDIFF_MUSCLE_STR_DIFF_THRESHOLD)           { diff += Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS; }
			
			muscleExpFactorAvgDiff    += muscleExpFactorDiff    / lhs.muscles.length;
			muscleIntervalTimeAvgDiff += muscleIntervalTimeDiff / lhs.muscles.length;
			muscleMaxLenAvgDiff       += muscleMaxLenDiff       / lhs.muscles.length;
			muscleMinLenAvgDiff       += muscleMinLenDiff       / lhs.muscles.length;
			muscleStrAvgDiff          += muscleStrDiff          / lhs.muscles.length;
		}

		if(boneElasticityDiffAvg     > Consts.CREATUREDIFF_BONE_ELASTICITY_AVG_DIFF_THRESHOLD)      { diff += Consts.CREATUREDIFF_BONE_DIFF_POINTS;   }
		if(boneFrictionDiffAvg       > Consts.CREATUREDIFF_BONE_FRICTION_AVG_DIFF_THRESHOLD)        { diff += Consts.CREATUREDIFF_BONE_DIFF_POINTS;   }
		if(boneMassDiffAvg           > Consts.CREATUREDIFF_BONE_MASS_AVG_DIFF_THRESHOLD)            { diff += Consts.CREATUREDIFF_BONE_DIFF_POINTS;   }
		if(bonePosDiffAvg            > Consts.CREATUREDIFF_BONE_POS_AVG_DIFF_THRESHOLD)             { diff += Consts.CREATUREDIFF_BONE_DIFF_POINTS;   }
		if(boneRadiusDiffAvg         > Consts.CREATUREDIFF_BONE_RADIUS_AVG_DIFF_THRESHOLD)          { diff += Consts.CREATUREDIFF_BONE_DIFF_POINTS;   }
		if(muscleExpFactorAvgDiff    > Consts.CREATUREDIFF_MUSCLE_EXP_FACTOR_AVG_DIFF_THRESHOLD)    { diff += Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS; }
		if(muscleIntervalTimeAvgDiff > Consts.CREATUREDIFF_MUSCLE_INTERVAL_TIME_AVG_DIFF_THRESHOLD) { diff += Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS; }
		if(muscleMaxLenAvgDiff       > Consts.CREATUREDIFF_MUSCLE_MAX_LEN_AVG_DIFF_THRESHOLD)       { diff += Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS; }
		if(muscleMinLenAvgDiff       > Consts.CREATUREDIFF_MUSCLE_MIN_LEN_AVG_DIFF_THRESHOLD)       { diff += Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS; }
		if(muscleStrAvgDiff          > Consts.CREATUREDIFF_MUSCLE_STR_AVG_DIFF_THRESHOLD)           { diff += Consts.CREATUREDIFF_MUSCLE_DIFF_POINTS; }

		return diff > Consts.CREATUREDIFF_THRESHOLD ? Infinity : diff;
	}

	public minusPoints: number = 0;
}

export class CreatureBone extends Entity {
	constructor(
		position: Vec2 = new Vec2(0, 0), public radius: number = 1,
		_mass: number = 1, _elasticity: number = 0.75, _friction: number = 0
	) {
		super(position, _mass, _elasticity, _friction);
	}

	bounding(): Intersections.Bounding {
		return new Intersections.Circle(this.position, this.radius); // Circle
	}

	render(context: Context2D): void { // Temporarily removed stroke for better FPS
		let color = bonePseudoGradient.get(this.friction);
		context.fillColor(color).strokeColor(Color.Black).lineWidth(4).drawCircle(
			this.position.x, this.position.y, this.radius, true, false
		);
	}
}

export class CreatureMuscle extends Entity {
	targetLength: number; // current target length
	timer: number = 0;

	constructor(
		public bone1: CreatureBone,
		public bone2: CreatureBone,
		public minLength: number,
		public maxLength: number,
		public strength: number = 1,
		public timerInterval: number = 0.5,
		public expandFactor: number = 0.5
	) {
		super();
		this.targetLength = maxLength;
	}

	movable(): boolean { return false; }

	bonesDistance(): number {
		return this.bone1.position.distance(this.bone2.position);
	}

	affect(affectedObjects: Simulable[]): void {
		let forceDirection: Vec2 = this.bone1.position.sub(this.bone2.position).normal();

		this.bone1.acceleration = this.bone1.acceleration.add(forceDirection.mul(this.strength * (this.targetLength - this.bonesDistance()) / this.bone1.mass));
		this.bone2.acceleration = this.bone2.acceleration.add(forceDirection.mul(this.strength * (this.bonesDistance() - this.targetLength) / this.bone2.mass));
	}

	render(context: Context2D): void {
		context.strokeColor(Color.Black).lineWidth(15).drawLine(
			this.bone1.position.x, this.bone1.position.y,
			this.bone2.position.x, this.bone2.position.y, false, true
		);
	}

	update(timeDelta: number): void {
		this.timer += timeDelta
		this.timer %= this.timerInterval

		this.targetLength = (this.timer > this.timerInterval * this.expandFactor ? this.minLength : this.maxLength);
	}
}
