import Vec2 from "../util/Vec2";
import * as Intersections from "./Intersections";
import * as Consts from "../core/Consts"

interface physicalBody {
	position: Vec2;
	velocity: Vec2;
	acceleration: Vec2;

	mass: number;
	elasticity: number;
	friction: number;

	bounding(): Intersections.Bounding;
}

export default function Collide(lhs: physicalBody, rhs: physicalBody): void {
	if (lhs.mass == Infinity && rhs.mass != Infinity) {
		let tmp = lhs;
		lhs = rhs;
		rhs = tmp;
	}

	let lBounds = lhs.bounding();
	let rBounds = rhs.bounding();

	if (Intersections.areIntersecting(lBounds, rBounds)) {

		if (lhs.mass == Infinity && rhs.mass == Infinity) {
			return;
		}

		let coefficientOfRestitution: number = (lhs.elasticity + rhs.elasticity) / 2;
		let coefficientOfDynamicFriction: number = (lhs.friction + rhs.friction) / 2;
		let coefficientOfStaticFriction: number = Math.sqrt(lhs.friction ** 2 + rhs.friction ** 2);
		let normal: Vec2 = normalVector(lBounds, rBounds);

		if (lhs.mass != Infinity && rhs.mass != Infinity && Consts.ARE_BALLS_COLLIDABLE) {
			let lhsVelocityOrthogontal: Vec2 = rhs.velocity.projection(normal).mul((coefficientOfRestitution + 1) * rhs.mass).add(
				lhs.velocity.projection(normal).mul(lhs.mass - coefficientOfRestitution * rhs.mass)).mul(1 / (lhs.mass + rhs.mass));

			let lhsVelocityTangent: Vec2 = lhs.velocity.projection(new Vec2(-normal.y, normal.x));


			let rhsVelocityOrthogontal: Vec2 = lhs.velocity.projection(normal).mul((coefficientOfRestitution + 1) * lhs.mass).sub(
				rhs.velocity.projection(normal).mul(lhs.mass - coefficientOfRestitution * rhs.mass)).mul(1 / (lhs.mass + rhs.mass));

			let rhsVelocityTangent: Vec2 = rhs.velocity.projection(new Vec2(-normal.y, normal.x));


			let interpenetration: Vec2 = Intersections.interpenetrationVector(lBounds, rBounds);
			lhs.position = lhs.position.add(interpenetration.mul(rhs.mass / (lhs.mass + rhs.mass)));
			rhs.position = rhs.position.sub(interpenetration.mul(lhs.mass / (lhs.mass + rhs.mass)));

			lhs.acceleration = lhs.acceleration.sub(rhs.acceleration.projection(normal));
			rhs.acceleration = rhs.acceleration.sub(lhs.acceleration.projection(normal));

			lhs.velocity = lhsVelocityOrthogontal.add(lhsVelocityTangent);
			rhs.velocity = rhsVelocityOrthogontal.add(rhsVelocityTangent);
		}

		else if (lhs.mass != Infinity && rhs.mass == Infinity) {

			let lhsAccelerationOrthogontal: Vec2 = lhs.acceleration.projection(normal);
			let lhsAccelerationTangent: Vec2 = lhs.acceleration.projection(new Vec2(-normal.y, normal.x));

			lhs.position = lhs.position.add(Intersections.interpenetrationVector(lBounds, rBounds));

			let lhsVelocityOrthogontal: Vec2 = rhs.velocity.projection(normal).mul(coefficientOfRestitution + 1).sub(
				lhs.velocity.projection(normal).mul(coefficientOfRestitution));

			let lhsVelocityTangent: Vec2 = lhs.velocity.projection(new Vec2(-normal.y, normal.x));

			if (lhsVelocityTangent.length() > 10 * lhs.mass * lhs.friction) {
				lhs.acceleration = lhs.acceleration.add(lhsVelocityTangent.normal().mul(
					-lhsAccelerationOrthogontal.mul(lhs.mass * coefficientOfDynamicFriction).length()));
			}
			else {
				lhsVelocityTangent = new Vec2(0, 0);
				if (lhsAccelerationTangent.length() <= lhsVelocityOrthogontal.length() * coefficientOfStaticFriction * lhs.mass) {
					lhs.acceleration = lhs.acceleration.sub(lhsAccelerationTangent);
				}
			}

			lhs.velocity = lhsVelocityOrthogontal.add(lhsVelocityTangent);
		}
	}
}

export function normalVector(lhs: Intersections.Bounding, rhs: Intersections.Bounding) {
	if (lhs instanceof Intersections.Circle && rhs instanceof Intersections.Circle) {
		let orthogontal: Vec2 = lhs.position.sub(rhs.position).normal();
		return orthogontal;
	}
	else {
		return new Vec2(0, 1);
	}
}
