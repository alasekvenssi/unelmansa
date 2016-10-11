import Vec2 from "../util/Vec2";
import Intersections = require("./Intersections");

export interface Simulable {
	mass: number;
	elasticity: number;
	friction: number;

	velocity: Vec2;
	acceleration: Vec2;

	bounding(): any;
	movable(): boolean;

	affect(physical: Simulable[]): void;
}

export interface Simulable2 {
	shape: Intersections.Shape;

	mass: number;
	elasticity: number;
	friction: number;

	velocity: Vec2;
	acceleration: Vec2;
	move(timeInterval: number): void;

	min?: Vec2;
	max?: Vec2;

	radius?: number;
	position?: Vec2;

	affect?(affectedObjects: Simulable[]): void;
}
