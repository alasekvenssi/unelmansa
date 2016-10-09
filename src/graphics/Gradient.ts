import Vec2 from "../util/Vec2"
import Color from "../util/Color"

export class GradientColorStop {
	constructor(public offset: number, public color: Color) {}
}

export abstract class Gradient {
	constructor(public stops: Array<GradientColorStop> = new Array<GradientColorStop>()) {}

	add(offset: number, color: Color): this {
		this.stops.push(new GradientColorStop(offset, color));
		return this;
	}
}

export class LinearGradient extends Gradient {
	startPoint: Vec2;
	endPoint: Vec2;

	constructor(x1: number, y1: number, x2: number, y2: number, stops?: Array<GradientColorStop>) {
		super(stops);
		this.startPoint = new Vec2(x1, y1);
		this.endPoint = new Vec2(x2, y2);
	}
}

export class RadialGradient extends Gradient {
	startCenter: Vec2;
	endCenter: Vec2;

	constructor(
		x1: number, y1: number, public startRadius: number,
		x2: number, y2: number, public endRadius: number,
		stops?: Array<GradientColorStop>
	) {
		super(stops);
		this.startCenter = new Vec2(x1, y1);
		this.endCenter = new Vec2(x2, y2);
	}
}
