import * as MathUtil from "./Math"
import Matrix2 from "./Matrix2"

export default class Vec2 {
	constructor(public x: number = 0, public y: number = 0) { }

	add(rhs: Vec2): Vec2 {
		return new Vec2(this.x + rhs.x, this.y + rhs.y);
	}

	sub(rhs: Vec2): Vec2 {
		return new Vec2(this.x - rhs.x, this.y - rhs.y);
	}

	mul(rhs: number): Vec2 {
		return new Vec2(this.x * rhs, this.y * rhs);
	}

	div(rhs: number): Vec2 {
		return new Vec2(this.x / rhs, this.y / rhs);
	}

	length(): number;
	length(l: number): this;
	length(l?: number): any {
		if (l == undefined) {
			return Math.sqrt(this.x ** 2 + this.y ** 2);
		} else {
			let len: number = this.length();
			if (len == 0) {
				throw "Vec2 must have length for this operation";
			}

			return this.scale(l / len);
		}
	}

	distance(rhs: Vec2): number {
		return Math.sqrt((this.x - rhs.x) ** 2 + (this.y - rhs.y) ** 2);
	}

	sin(rhs: Vec2): number {
		return this.cross(rhs) / this.length() / rhs.length();
	}

	cos(rhs: Vec2): number {
		return this.dot(rhs) / this.length() / rhs.length();
	}

	projection(rhs: Vec2): Vec2 {
		return rhs.normal().mul(this.dot(rhs) / rhs.length());
	}

	dot(rhs: Vec2): number {
		return this.x * rhs.x + this.y * rhs.y;
	}

	cross(rhs: Vec2): number {
		return this.x * rhs.y - this.y * rhs.x;
	}

	normal(): Vec2 {
		return this.div(this.length());
	}

	print(): void {
		console.log([MathUtil.round(this.x), MathUtil.round(this.y)]);
		console.log('-');
	}

	toMatrix(): Matrix2 {
		return new Matrix2(2, 1).set(0, 0, this.x).set(1, 0, this.y);
	}

	scale(s: number): this {
		this.x *= s;
		this.y *= s;
		return this;
	}

	perpendicular(): Vec2[] {
		return [
			new Vec2(-this.y, this.x),
			new Vec2(this.y, -this.x)
		];
	}
}