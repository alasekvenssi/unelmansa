import Vec2 from "../util/Vec2"
import {Entity} from "./Entity"
import {Simulable} from "../physics/Interface"
import {Context2D} from "../graphics/Context2D"
import Color from "../util/Color"
import * as Intersections from "../physics/Intersections"
import DisjointNode from "../util/DisjointSet"

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
}

export class CreatureBone extends Entity {
	constructor(
		position: Vec2 = new Vec2(0,0), public radius: number = 1, 
		_mass: number = 1, _elasticity: number = 0.75, _friction: number = 0
	) {
		super(position, _mass, _elasticity, _friction);
		this.color = Color.randomRGB();
		this.counter = 0;
	}

	bounding() : Intersections.Bounding {
		return new Intersections.Circle(this.position, this.radius); // Circle
	}

	render(context: Context2D): void {
		if(++this.counter % 10 == 0) {
			this.color = Color.randomRGB();
		}

		context.fillColor(this.color).strokeColor(Color.Black).lineWidth(4).drawCircle(
			this.position.x, this.position.y, this.radius, true, true
		);
	}

	private counter: number;
	private color: Color;
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
