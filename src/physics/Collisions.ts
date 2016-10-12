import Vec2 from "../util/Vec2";
import * as Intersections from "./Intersections";

interface physicalBody {
	position: Vec2;
	velocity: Vec2;
	mass: number;
	elasticity: number;
	friction: number;
	bounding(): Intersections.Bounding;
}

export default function Collide(lhs: physicalBody, rhs: physicalBody): void {
	if(Intersections.areIntersecting(lhs.bounding(), rhs.bounding())) {

		let coefficientOfRestitution: number = (lhs.elasticity + rhs.elasticity)/2;
		let normal: Vec2 = normalVector(lhs.bounding(), rhs.bounding());

		if(lhs.mass == Infinity && rhs.mass == Infinity) {
			return;
		}

		if(lhs.mass != Infinity && rhs.mass != Infinity) {
			let normal: Vec2 = normalVector(lhs.bounding(), rhs.bounding());

			let lhsVelocityOrthogontal: Vec2 = rhs.velocity.projection(normal).mul((coefficientOfRestitution + 1) * rhs.mass).add(
				lhs.velocity.projection(normal).mul(lhs.mass - coefficientOfRestitution*rhs.mass)).mul(1/(lhs.mass+rhs.mass));

			let lhsVelocityTangent: Vec2 = lhs.velocity.projection(new Vec2(-normal.y, normal.x)).mul(1-lhs.friction);


			let rhsVelocityOrthogontal: Vec2 = lhs.velocity.projection(normal).mul((coefficientOfRestitution + 1) * lhs.mass).sub(
				rhs.velocity.projection(normal).mul(lhs.mass - coefficientOfRestitution*rhs.mass)).mul(1/(lhs.mass+rhs.mass));

			let rhsVelocityTangent: Vec2 = rhs.velocity.projection(new Vec2(-normal.y, normal.x)).mul(1-lhs.friction);


			lhs.velocity = lhsVelocityOrthogontal.add(lhsVelocityTangent);
			rhs.velocity = rhsVelocityOrthogontal.add(rhsVelocityTangent);
		}

		else if(lhs.mass != Infinity && rhs.mass == Infinity) {
			lhs.position.y -= Intersections.intersectionDelta(lhs.bounding(), rhs.bounding());

			let lhsVelocityOrthogontal: Vec2 = rhs.velocity.projection(normal).mul(coefficientOfRestitution + 1).sub(
				lhs.velocity.projection(normal).mul(coefficientOfRestitution));

			let lhsVelocityTangent: Vec2 = lhs.velocity.projection(new Vec2(-normal.y, normal.x));

			lhs.velocity = lhsVelocityOrthogontal.add(lhsVelocityTangent);

		}

		else if(lhs.mass == Infinity && rhs.mass != Infinity) {
			Collide(rhs, lhs);
		}
	}
}

function normalVector(lhs: Intersections.Bounding, rhs: Intersections.Bounding)
{
	if(lhs instanceof Intersections.Circle && rhs instanceof Intersections.Circle) {
		let orthogontal: Vec2 = lhs.position.sub(rhs.position).normal();
		return orthogontal;
	}
	else {
		return new Vec2(0,1);
	}
}
