import Vec2 from "../util/Vec2"
import Color from "../util/Color"
import { Font, FontWeight } from "../util/Font"
import { Renderable } from "../graphics/Renderable"
import { Context2D } from "../graphics/Context2D"
import { Simulable } from "../physics/Interface"
import * as Intersections from "../physics/Intersections"
import { Image } from "../graphics/Image"
import * as Consts from "../core/Consts"

export abstract class Entity implements Renderable, Simulable {
    velocity: Vec2 = new Vec2(0, 0);
    acceleration: Vec2 = new Vec2(0, 0);

    constructor(
        public position: Vec2 = new Vec2(0, 0),
        public mass: number = 0,
        public elasticity: number = 0,
        public friction: number = 0
    ) { }

    bounding(): Intersections.Bounding { return undefined; }
    movable(): boolean { return this.mass != Infinity; }

    forEachSimulable(callback: (object: Simulable) => void): void {
        callback(this);
    }

    render(context: Context2D): void { }
    update(timeDelta: number): void { }

    affect(physical: Simulable[]): void { }
}

export class Ground extends Entity {
    constructor(public image: Image = undefined, _elasticity: number = Consts.GROUND_ELASTICITY) {
        super(new Vec2(0, 0), Infinity, _elasticity, Consts.GROUND_FRICTION);
    }

    bounding(): Intersections.Bounding {
        return new Intersections.AABB(new Vec2(-Infinity, -Infinity), new Vec2(Infinity, 0));
    }

    affect(affectedObjects: Simulable[]): void {
        for (let affectedObject of affectedObjects) {
            if (affectedObject.movable()) {
                affectedObject.acceleration = affectedObject.acceleration.add(new Vec2(0, -Consts.PHYSICS_GRAVITY));
            }
        }
    }

    render(context: Context2D): void {
        let matrix = context.transformMatrix(); // hacky calculations of visible area
        let minX = -matrix[0][2] / matrix[0][0];
        let maxX = minX + context.width() / matrix[0][0];

        let minI = Math.floor(minX / 200) - 1;
        let maxI = Math.ceil(maxX / 200) + 1;

        if (this.image) {
            for (let i = minI; i <= maxI; i++) {
                context.save().translate(i * 200 - 1, 0).scale(1, -1);
                context.drawImage(this.image, 0, 0, 200, 200);
                context.restore();
            }
        } else {
            context.fillRGBA(0, 127, 0).drawRect(-100000, -100000, 200000, 100000, true, false);
        }

        for (let i = minI; i <= maxI; i++) {
            context.fillColor(Color.Black).drawRect(i * 200 - 1, -100000, 2, 100000, true, false);

            context.save().translate(i * 200 - 1, 0).scale(1, -1);
            context.fillColor(Color.White).strokeColor(Color.Black).lineWidth(2);
            context.font(new Font("Arial", 40, "normal", FontWeight.Bold));
            context.drawText(12, 12, (i * 200).toString(), "hanging", true, true);
            context.restore();
        }
    }
}

export class Air extends Entity {
    constructor(public image: Image = undefined, public resistance: number = Consts.AIR_RESISTANCE) {
        super();
    }

    affect(objects: Simulable[]): void {
        for (let obj of objects) {
            if (obj.movable()) {
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
