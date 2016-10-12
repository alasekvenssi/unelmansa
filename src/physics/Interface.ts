import Vec2 from "../util/Vec2";
import * as Intersections from "./Intersections";

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
