import Vec2 from "../util/Vec2"
import {Entity} from "./Entity"
import {Simulable} from "../physics/Interface"
import {Context2D} from "../graphics/Context2D"
import Color from "../util/Color"

export class Creature extends Entity {
	constructor(
		public bones: CreatureBone[] = new Array<CreatureBone>(),
		public muscles: CreatureMuscle[] = new Array<CreatureMuscle>()
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
}

export class CreatureBone extends Entity {
	constructor(
		position: Vec2 = new Vec2(0,0), public radius: number = 1, 
		_mass: number = 1, _elasticity: number = 1, _friction: number = 0
	) {
		super(position, _mass, _elasticity, _friction);
	}

	bounding() {
		throw "Not implemented"; // Circle
	}

	render(context: Context2D): void {
		context.fillColor(Color.Yellow).strokeColor(Color.Black).lineWidth(4).drawCircle(
			this.position.x, this.position.y, this.radius, true, true
		);
	}
}

export class CreatureMuscle extends Entity {
	targetLength: number; // current target length

	constructor(
		public bone1: CreatureBone,
		public bone2: CreatureBone,
		public minLength: number,
		public maxLength: number,
		public strength: number = 1
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

		this.bone1.acceleration.add(forceDirection.mul(this.strength*(this.targetLength - this.bonesDistance())));
		this.bone2.acceleration.add(forceDirection.mul(this.strength*(this.bonesDistance() - this.targetLength)));
	}

	render(context: Context2D): void {
		context.strokeColor(Color.Black).lineWidth(6).drawLine(
			this.bone1.position.x, this.bone1.position.y,
			this.bone2.position.x, this.bone2.position.y, false, true
		);
	}
}
