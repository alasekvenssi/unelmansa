import Vec2 from "../util/Vec2";
import * as Intersections from "./Intersections";

export interface Simulable {
	mass: number;
	elasticity: number;
	friction: number;
	position: Vec2;

	velocity: Vec2;
	acceleration: Vec2;

	bounding(): Intersections.Bounding;
	movable(): boolean;

	affect(physical: Simulable[]): void;
}
