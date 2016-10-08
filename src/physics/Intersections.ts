import Vec2 from "../util/Vec2"

export enum Shape {
	AABB,
	Circle
}

interface BoundingBox {
	shape: Shape;
	
	min?: Vec2;
	max?: Vec2;

	radius?: number;
	position?: Vec2;
}


export function areIntersecting(lhs: BoundingBox, rhs: BoundingBox): boolean {
	if(lhs.shape == Shape.Circle && rhs.shape == Shape.Circle) {
		return circleVsCircle(lhs, rhs);
	}

	else if(lhs.shape == Shape.Circle && rhs.shape == Shape.AABB) {
		return circleVsAABB(lhs, rhs);
	}

	else if(lhs.shape == Shape.AABB && rhs.shape == Shape.Circle) {
		return circleVsAABB(rhs, lhs);
	}

	else if(lhs.shape == Shape.AABB && rhs.shape == Shape.AABB) {
		return AABBVsAABB(lhs, rhs);
	}

	else {
		throw "Can't check intersections between these objects.";	
	}
}

function circleVsAABB(lhs: BoundingBox, rhs: BoundingBox): boolean {
	let CircleAABB :BoundingBox = {
		shape: Shape.AABB, 
		min: lhs.position.sub(new Vec2(lhs.radius, lhs.radius)), 
		max: lhs.position.add(new Vec2(lhs.radius, lhs.radius))
	};
	return AABBVsAABB(CircleAABB, rhs);
}

function circleVsCircle(lhs: BoundingBox, rhs: BoundingBox): boolean {
	return lhs.position.distance(rhs.position) <= lhs.radius + rhs.radius;
}

function AABBVsAABB(lhs: BoundingBox, rhs: BoundingBox): boolean {

	if(lhs.max.x < rhs.min.x || lhs.min.x > rhs.max.x) {
		return false;
	}
	
	else if(lhs.max.y < rhs.min.y || lhs.min.y > rhs.max.y){
		return false;
	}

	return true;
}
