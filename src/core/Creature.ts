import Vec2 from "../util/Vec2"
import {Entity} from "./Entity"
import {Simulable} from "../physics/Interface"
import {Context2D} from "../graphics/Context2D"
import Color from "../util/Color"
import * as Intersections from "../physics/Intersections"
import * as utilMath from "../util/Math"
import * as Consts from "./Consts"
import DisjointNode from "../util/DisjointSet"
import * as Generator from "./Generator"

export class Creature extends Entity {
	constructor(
		public bones: CreatureBone[] = new Array<CreatureBone>(),
		public muscles: CreatureMuscle[] = new Array<CreatureMuscle>(),
		public result: number = -Infinity
	) {
		super();
	}

	movable(): boolean { return false; } // movable are its parts, creature is just group

	forEachSimulable(callback: (object: Simulable)=>void): void {
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

	center(): Vec2 {
		let avg = new Vec2();
		for (let bone of this.bones) {
			avg = avg.add(bone.position);
		}
		return avg.div(this.bones.length);
	}

	update(timeDelta: number): void {
		this.updateBonesColor();

		for(let i: number = 0; i < this.bones.length; ++i) {
			this.bones[i].update(timeDelta);
		}

		for(let i: number = 0; i < this.muscles.length; ++i) {
			this.muscles[i].update(timeDelta);
		}
	}

	isStronglyConnected(): boolean {
		let disjoint : Array<DisjointNode> = new Array<DisjointNode>(this.bones.length);
		
		for(let i : number = 0; i < this.bones.length; ++i) {
			disjoint[i] = new DisjointNode();
		}

		for(let i : number = 0; i < this.muscles.length; ++i) {
			let lhsId : number = this.bones.indexOf(this.muscles[i].bone1);
			let rhsId : number = this.bones.indexOf(this.muscles[i].bone2);

			disjoint[lhsId].union(disjoint[rhsId]);
		}

		return disjoint[0].getSize() == this.bones.length;
	}

	updateBonesColor(): void {
		let maxFriction : number = 0;

		for(let i : number = 0; i < this.bones.length; ++i) {
			maxFriction = Math.max(maxFriction, this.bones[i].friction);
		}

		for(let i : number = 0; i < this.bones.length; ++i) {
			let relative : number = this.bones[i].friction / maxFriction;
			// this.bones[i].color = new Color(255, 255*this.bones[i].friction / maxFriction, 255*this.bones[i].friction / maxFriction);
			this.bones[i].color = new Color(Math.round(255*relative), 255, Math.round(255*relative));
		}
	}

    clone(): Creature {
        let myClone = new Creature();

        for(let bone of this.bones) {
            myClone.bones.push(new CreatureBone(
                    bone.position,
                    bone.radius,
                    bone.mass,
                    bone.elasticity,
                    bone.friction
                )
            )
        }

        let getMuscleIn = function(lhs: CreatureBone, rhs: CreatureBone, muscles: CreatureMuscle[]) {
            for (let i = 0; i < muscles.length; ++i) {
                
                if((muscles[i].bone1 == lhs && muscles[i].bone2 == rhs) || (muscles[i].bone1 == rhs && muscles[i].bone2 == lhs)) {
                    return muscles[i];
                }
            }
            return undefined;
        }

        for (let i = 0; i < this.bones.length; ++i) {
            for (let j = i+1; j < this.bones.length; ++j) {
                let muscle: CreatureMuscle = getMuscleIn(this.bones[i], this.bones[j], this.muscles);
                if(muscle != undefined) {
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
		if(!utilMath.randomChance(Consts.MUTATION_CHANCE)) {
			return this;
		}

		// Remove nodes
		for(let i : number = this.bones.length-1; i >= 0; --i) {
			if(utilMath.randomChance(Consts.MUTATION_DELETE_NODE_CHANCE)) {
				for(let j : number = this.muscles.length-1; j >= 0; --j) {
					if(this.muscles[j].bone1 == this.bones[i] || this.muscles[j].bone2 == this.bones[i]) {
						this.muscles.splice(j, 1);
					}
				}
				this.bones.splice(i, 1);
			}
		}

		// Random bone friction
		for(let i : number = 0; i < this.bones.length; ++i) {
			if(utilMath.randomChance(Consts.MUTATION_BONE_FRICTION_CHANCE)) {
				let diff : number = this.bones[i].friction * (Consts.MUTATION_RELATIVE_FRICTION_DIFF / 2) * Math.random();
				diff *= (utilMath.randomChance(0.5) ? -1 : 1);
			
				let newFriction = this.bones[i].friction + diff;
				newFriction = Math.min(newFriction, 1);
				newFriction = Math.max(newFriction, 0);

				this.bones[i].friction = newFriction;
			}
		}

		// Random musscle strength
		for(let i : number = 0; i < this.muscles.length; ++i) {
			if(utilMath.randomChance(Consts.MUTATION_MUSCLE_STRENGTH_CHANCE)) {
				let diff : number = this.muscles[i].strength * (Consts.MUTATION_RELATIVE_STRENGTH_DIFF / 2) * Math.random();
				diff *= (utilMath.randomChance(0.5) ? -1 : 1);

				let newStrength = this.muscles[i].strength + diff;
				newStrength = Math.max(newStrength, 0);

				this.muscles[i].strength = newStrength;
			}
		}
		
		// Add random node
		if(utilMath.randomChance(Consts.MUTATION_ADD_NODE_CHANCE)) {
			this.bones.push(Generator.generateCreatureBone());
			let edges : number = 0;

			for(let i : number = 0; i < this.bones.length-1; ++i) {
				if(utilMath.randomChance(Consts.MUTATION_CONNECTION_CHANCE)) {
					this.muscles.push(Generator.generateCreatureMuscle(this.bones[i], this.bones[this.bones.length-1]));
					edges++;
				}
			}

			if(edges == 0) {
				this.bones.pop();
			}
		}

		return this;
	}
}

export class CreatureBone extends Entity {
	constructor(
		position: Vec2 = new Vec2(0,0), public radius: number = 1, 
		_mass: number = 1, _elasticity: number = 0.75, _friction: number = 0
	) {
		super(position, _mass, _elasticity, _friction);
		this.color = Color.randomRGB();
	}

	bounding() : Intersections.Bounding {
		return new Intersections.Circle(this.position, this.radius); // Circle
	}

	render(context: Context2D): void {
		context.fillColor(this.color).strokeColor(Color.Black).lineWidth(4).drawCircle(
			this.position.x, this.position.y, this.radius, true, true
		);
	}

	public color: Color;
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

		this.bone1.acceleration = this.bone1.acceleration.add(forceDirection.mul(this.strength*(this.targetLength - this.bonesDistance())/this.bone1.mass));
		this.bone2.acceleration = this.bone2.acceleration.add(forceDirection.mul(this.strength*(this.bonesDistance() - this.targetLength)/this.bone2.mass));
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
