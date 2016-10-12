import Vec2 from "../util/Vec2";
import Intersections = require("../physics/Intersections");
import * as Sim from "../physics/Interface";

abstract class Entity {
	shape: Intersections.Shape;

	mass: number;
	elasticity: number;
	friction: number;	

	velocity: Vec2 = new Vec2(0, 0);
	acceleration: Vec2 = new Vec2(0, 0);
	abstract move(timeInterval: number): void;

	abstract affect(affectedObjects: Sim.Simulable[]): void;
}

class CreatureBone extends Entity {
	constructor(public position: Vec2 = new Vec2(0,0), public radius: number = 1, 
		_mass: number = 1, _elasticity: number = 1, _friction: number = 0) {
		super();
		this.shape = Intersections.Shape.Circle;
		this.mass = _mass;
		this.elasticity = _elasticity;
		this.friction = _friction;
	}

	affect(affectedObjects: Sim.Simulable[]): void {
		return;
	}

	move(timeInterval: number): void {
		this.velocity.add(this.acceleration);
		this.position.add(this.velocity.mul(timeInterval));
		this.acceleration = new Vec2(0, 0);
	}
}

class CreatureMuscle extends Entity {
	constructor(public leftBone: CreatureBone, public rightBone: CreatureBone, public strength: number = 1, 
		public length: number = 2sudo) {
		super();
		this.shape = Intersections.Shape.Muscle;
	}

	affect(affectedObjects: Sim.Simulable[]): void {
		let forceDirection: Vec2 = this.leftBone.position.sub(this.rightBone.position).normal();

		this.leftBone.acceleration.add(forceDirection.mul(this.strength*(length - this.getCurrentLength())));
		this.rightBone.acceleration.add(forceDirection.mul(this.strength*(this.getCurrentLength() - length)));
	}

	move(timeInterval: number): void {
		return;
	}

	getCurrentLength(): number
	{
		return this.leftBone.position.distance(this.rightBone.position);
	}
}

class Ground extends Entity {
	
	constructor(_elasticity: number = 1) {
		super();
		this.elasticity = _elasticity;
		this.mass = Infinity;
		this.shape = Intersections.Shape.AABB;
		this.min = new Vec2(-Infinity, -Infinity);
		this.max = new Vec2(Infinity, 0);
	}

	min: Vec2;
	max: Vec2;

	move(timeInterval: number): void {
		return;
	}

	affect(affectedObjects: Sim.Simulable[]): void {
		for (let affectedObject of affectedObjects) {
			if(affectedObject.mass != Infinity) {
				affectedObject.acceleration.add(new Vec2(0,-10))
			}
		}
	}
}
