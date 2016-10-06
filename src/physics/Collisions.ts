import {Vec2} from "../util/Vec2"

enum Shape {
	Rectangular,
	Circle
}

interface Rectangular {
	shape: Shape;
	min: Vec2;
	max: Vec2;
}

interface Circle{
	shape: Shape;
	radius: number;
	position: Vec2;
}


export function areIntersecting(lhs: any, rhs: any): boolean {
	if(lhs.shape == Shape.Circle && rhs.shape == Shape.Circle) {
		return circleVsCircle(lhs, rhs);
	}

	else if(lhs.shape == Shape.Circle && rhs.shape == Shape.Rectangular) {
		return circleVsRectangular(lhs, rhs);
	}

	else if(lhs.shape == Shape.Rectangular && rhs.shape == Shape.Circle) {
		return circleVsRectangular(rhs, lhs);
	}

	else if(lhs.shape == Shape.Rectangular && rhs.shape == Shape.Rectangular) {
		return rectangularVsRectangular(lhs, rhs);
	}

	else {
		throw "Can't check intersections between these objects.";	
	}
}

function circleVsRectangular(lhs: Circle, rhs: Rectangular): boolean {
	let CircleAABB :Rectangular = {
		shape: Shape.Rectangular, 
		min: lhs.position.substract(new Vec2(lhs.radius, lhs.radius)), 
		max: lhs.position.add(new Vec2(lhs.radius, lhs.radius))
	};
	return rectangularVsRectangular(CircleAABB, rhs);
}

function circleVsCircle(lhs: Circle, rhs: Circle): boolean {
	return lhs.position.distance(rhs.position) <= lhs.radius + rhs.radius;
}

function rectangularVsRectangular(lhs: Rectangular, rhs: Rectangular): boolean {

	if(lhs.max.x < rhs.min.x || lhs.min.x > rhs.max.x) {
		return false;
	}
	
	else if(lhs.max.y < rhs.min.y || lhs.min.y > rhs.max.y){
		return false;
	}

	return true;
}
