import Vec2 from "../util/Vec2"
import Color from "../util/Color"
import {Renderable} from "../graphics/Renderable"
import {Context2D} from "../graphics/Context2D"
import {Simulable} from "../physics/Interface"

export abstract class Entity implements Renderable, Simulable {
	velocity: Vec2 = new Vec2(0, 0);
	acceleration: Vec2 = new Vec2(0, 0);

	constructor(
		public position: Vec2 = new Vec2(0, 0),
		public mass: number = 0,
		public elasticity: number = 0,
		public friction: number = 0
	) {}

	bounding(): any { return undefined; }
	movable(): boolean { return true; }

	forEachSimulable(callback: (object: Simulable)=>void): void {
		callback(this);
	}

	render(context: Context2D): void {}
	update(timeDelta: number): void {}

	affect(physical: Simulable[]): void {}
}

export class Ground extends Entity {
	constructor(_elasticity: number = 1) {
		super(new Vec2(0, 0), Infinity, _elasticity, 1);
	}

	bounding(): any {
		throw "Not implemented"; // AABB(-Infinity, -Infinity, Infinity, 0)
	}

	movable(): boolean { return false; }

	affect(affectedObjects: Simulable[]): void {
		for (let affectedObject of affectedObjects) {
			if(affectedObject.mass != Infinity) {
				affectedObject.acceleration.add(new Vec2(0,-10))
			}
		}
	}

	render(context: Context2D): void {
		context.fillRGBA(0, 127, 0).drawRect(-100000, -100000, 200000, 100000, true, false);
	}
}
