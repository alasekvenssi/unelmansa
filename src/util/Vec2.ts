class Vec2 {
	constructor(public x: number = 0, public y: number = 0) { }

	add(rhs: Vec2): Vec2 {
		return new Vec2(this.x + rhs.x, this.y + rhs.y);
	}

	substract(rhs: Vec2): Vec2 {
		return new Vec2(this.x - rhs.x, this.y - rhs.y);
	}

	multiply(rhs: number): Vec2 {
		return new Vec2(this.x * rhs, this.y * rhs);
	}

	divide(rhs: number): Vec2 {
		return new Vec2(this.x / rhs, this.y / rhs);
	}

	length(): number {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	distance(rhs: Vec2): number {
		return Math.sqrt((this.x - rhs.x)**2 + (this.y - rhs.y)**2);
	}

	dot(rhs: Vec2): number {
		return this.x * rhs.x + this.y * rhs.y;
	}

	cross(rhs: Vec2): number {
		return this.x * rhs.y - this.y * rhs.x;
	}

	parallelogramArea(rhs: Vec2): number {
		return Math.abs(this.cross(rhs));
	}

	triangleArea(rhs: Vec2): number {
		return this.cuboidArea(rhs) / 2;
	}

	normal(): Vec2 {
		return this.div(this.length());
	}
}