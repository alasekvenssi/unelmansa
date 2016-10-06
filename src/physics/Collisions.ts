import {Vec2} from "../util/Vec2"

enum Shape {
	Rectangle,
	Circle
}

interface boundingBox {
	shape: Shape;
	
	min?: Vec2;
	max?: Vec2;

	radius?: number;
	position?: Vec2;
}


export function areIntersecting(lhs: boundingBox, rhs: boundingBox): boolean {
	if(lhs.shape == Shape.Circle && rhs.shape == Shape.Circle) {
		return circleVsCircle(lhs, rhs);
	}

	else if(lhs.shape == Shape.Circle && rhs.shape == Shape.Rectangle) {
		return circleVsRectangle(lhs, rhs);
	}

	else if(lhs.shape == Shape.Rectangle && rhs.shape == Shape.Circle) {
		return circleVsRectangle(rhs, lhs);
	}

	else if(lhs.shape == Shape.Rectangle && rhs.shape == Shape.Rectangle) {
		return rectangleVsRectangle(lhs, rhs);
	}

	else {
		throw "Can't check intersections between these objects.";	
	}
}

function circleVsRectangle(lhs: boundingBox, rhs: boundingBox): boolean {
	let CircleAABB :boundingBox = {
		shape: Shape.Rectangle, 
		min: lhs.position.substract(new Vec2(lhs.radius, lhs.radius)), 
		max: lhs.position.add(new Vec2(lhs.radius, lhs.radius))
	};
	return rectangleVsRectangle(CircleAABB, rhs);
}

function circleVsCircle(lhs: boundingBox, rhs: boundingBox): boolean {
	return lhs.position.distance(rhs.position) <= lhs.radius + rhs.radius;
}

function rectangleVsRectangle(lhs: boundingBox, rhs: boundingBox): boolean {

	if(lhs.max.x < rhs.min.x || lhs.min.x > rhs.max.x) {
		return false;
	}
	
	else if(lhs.max.y < rhs.min.y || lhs.min.y > rhs.max.y){
		return false;
	}

	return true;
}
