import Vec2 from "../util/Vec2"
import Color from "../util/Color"
import {Font} from "../util/Font"
import {Renderable} from "../graphics/Renderable"
import {Context2D} from "../graphics/Context2D"
import {Simulable} from "../physics/Interface"
import * as Intersections from "../physics/Intersections"
import {Image} from "../graphics/Image"

export abstract class Entity implements Renderable, Simulable {
	velocity: Vec2 = new Vec2(0, 0);
	acceleration: Vec2 = new Vec2(0, 0);

	constructor(
		public position: Vec2 = new Vec2(0, 0),
		public mass: number = 0,
		public elasticity: number = 0,
		public friction: number = 0
	) {}

	bounding(): Intersections.Bounding { return undefined; }
	movable(): boolean { return this.mass != Infinity; }

	forEachSimulable(callback: (object: Simulable)=>void): void {
		callback(this);	
	}

	render(context: Context2D): void {}
	update(timeDelta: number): void {}

	affect(physical: Simulable[]): void {}
}

export class Ground extends Entity {
	constructor(public image: Image = undefined, _elasticity: number = 1) {
		super(new Vec2(0, 0), Infinity, _elasticity, 0.5);
	}

	bounding(): Intersections.Bounding {
		return new Intersections.AABB(new Vec2(-Infinity, -Infinity), new Vec2(Infinity, 0));
	}

	affect(affectedObjects: Simulable[]): void {
		for (let affectedObject of affectedObjects) {
			if(affectedObject.movable()) {
				affectedObject.acceleration = affectedObject.acceleration.add(new Vec2(0,-1000));
			}
		}
	}

	render(context: Context2D): void {
		if (this.image) {
			for (let i = -10; i <= 10; i++) {
				context.save().translate(i*200-1, 0).scale(1, -1);
				context.drawImage(this.image, 0, 0, 200, 200);
				context.restore();
			}
		} else {
			context.fillRGBA(0, 127, 0).drawRect(-100000, -100000, 200000, 100000, true, false);

			for (let i = -10; i <= 10; i++) {
				context.fillColor(Color.Black).drawRect(i*200-1, -100000, 2, 100000, true, false);

				context.save().translate(i*200-1, 0).scale(1, -1);
				context.font(new Font("Arial", 30)).drawText(12, 12, i.toString(), "top", true, false);
				context.restore();
			}
		}
	}
}

export class Air extends Entity {
	constructor(public image: Image = undefined, public resistance: number = 0.5) {
		super();
	}

	affect(objects: Simulable[]): void {
		for (let obj of objects) {
			if(obj.movable()) {
				obj.acceleration = obj.acceleration.sub(obj.velocity.mul(this.resistance));
			}
		}
	}

	render(context: Context2D): void {
		if (this.image) {
			context.save().resetTransform();
			context.drawImage(this.image, 0, 0, context.width(), context.height());
			context.restore();
		}
	}
}
