class Vec2 {
	constructor(x: number = 0, y: number = 0) {
		this.x = x;
		this.y = y;
	}

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

	dist(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	dot(rhs: Vec2): number {
		return this.x * rhs.x + this.y * rhs.y;
	}

	cross(rhs: Vec2): number {
		return this.x * rhs.y - this.y * rhs.x;
	}

	cuboidArea(rhs: Vec2): number {
		return Math.abs(this.cross(rhs));
	}

	triangleArea(rhs: Vec2): number {
		return this.cuboidArea(rhs) / 2;
	}

	normal(): Vec2 {
		return this.div(this.dist());
	}

	x: number;
	y: number;
}