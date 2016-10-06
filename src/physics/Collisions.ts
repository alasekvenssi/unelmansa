import {Vec2} from "../util/Vec2"

enum Shape {
	Rectangular,
	Circle
}

interface Rectangular {
	shape: Shape;
	max: Vec2;
	min: Vec2;
}

interface Circle{
	shape: Shape;
	radius: number;
	position: Vec2;
}

export function areIntersecting(lhs: any, rhs: any): boolean {

	if(lhs.shape == Shape.Circle && rhs.shape == Shape.Circle) {
		return circleCircleIntersecting(lhs, rhs);
	}

	else if(lhs.shape == Shape.Circle && rhs.shape == Shape.Rectangular) {
		return circleRectangularIntersecting(lhs, rhs);
	}

	else if(lhs.shape == Shape.Rectangular && rhs.shape == Shape.Circle) {
		return circleRectangularIntersecting(rhs, lhs);
	}

	else if(lhs.shape == Shape.Rectangular && rhs.shape == Shape.Rectangular) {
		rectangularRectangularIntersecting(lhs, rhs);
	}

	else {
		throw "Can't check intersections between these objects.";	
	}
}

function circleRectangularIntersecting(lhs: Circle, rhs: Rectangular): boolean {
	return true; // TODO
}

function circleCircleIntersecting(lhs: Circle, rhs: Circle): boolean {
	return lhs.position.distance(rhs.position) <= lhs.radius + rhs.radius;
}

function rectangularRectangularIntersecting(lhs: Rectangular, rhs: Rectangular): boolean {
	return true; // TODO
}


let x: Circle = {shape: Shape.Circle, radius: 5, position: new Vec2(0,0)};
let y: Circle = {shape: Shape.Circle, radius: 5, position: new Vec2(0,11)};


console.log(areIntersecting(x, y));
