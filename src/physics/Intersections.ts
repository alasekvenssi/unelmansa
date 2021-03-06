import Vec2 from "../util/Vec2"

export abstract class Bounding { }

export class Circle extends Bounding {
	constructor(
		public position: Vec2,
		public radius: number) {
		super()
	}
}

export class AABB extends Bounding {
	constructor(
		public min: Vec2,
		public max: Vec2) {
		super()
	}
}

export function areIntersecting(lhs: Bounding, rhs: Bounding): boolean {
	if (lhs == undefined || rhs == undefined) {
		return false;
	}

	else if ((lhs instanceof Circle) && (rhs instanceof Circle)) {
		return circleVsCircle(lhs, rhs);
	}

	else if (lhs instanceof Circle && rhs instanceof AABB) {
		return circleVsAABB(lhs, rhs);
	}

	else if (lhs instanceof AABB && rhs instanceof Circle) {
		return circleVsAABB(rhs, lhs);
	}

	else if (lhs instanceof AABB && rhs instanceof AABB) {
		return AABBVsAABB(lhs, rhs);
	}

	else {
		throw "Can't check intersections between these objects.";
	}

}

function circleVsAABB(lhs: Circle, rhs: AABB): boolean {
	let CircleAABB: AABB = {
		min: lhs.position.sub(new Vec2(lhs.radius, lhs.radius)),
		max: lhs.position.add(new Vec2(lhs.radius, lhs.radius))
	};
	return AABBVsAABB(CircleAABB, rhs);
}

function circleVsCircle(lhs: Circle, rhs: Circle): boolean {
	return lhs.position.distance(rhs.position) <= lhs.radius + rhs.radius;
}

function AABBVsAABB(lhs: AABB, rhs: AABB): boolean {

	if (lhs.max.x < rhs.min.x || lhs.min.x > rhs.max.x) {
		return false;
	}

	else if (lhs.max.y < rhs.min.y || lhs.min.y > rhs.max.y) {
		return false;
	}

	return true;
}

export function interpenetrationVector(lhs: Bounding, rhs: Bounding): Vec2 {
	if (lhs instanceof Circle && rhs instanceof AABB) {
		return new Vec2(0, lhs.radius - lhs.position.y + rhs.max.y);
	}
	if (lhs instanceof AABB && rhs instanceof Circle) {
		return interpenetrationVector(rhs, lhs);
	}
	if (lhs instanceof Circle && rhs instanceof Circle) {
		return lhs.position.sub(rhs.position).normal().mul(lhs.radius + rhs.radius - lhs.position.distance(rhs.position));
	}
	return new Vec2(0, 0);
}
