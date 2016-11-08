import Vec2 from "../util/Vec2";
import * as Intersections from "./Intersections";

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
	if(Intersections.areIntersecting(lhs.bounding(), rhs.bounding())) {

		let coefficientOfRestitution: number = (lhs.elasticity + rhs.elasticity)/2;
		let coefficientOfDynamicFriction: number = (lhs.friction + rhs.friction)/2;
		let normal: Vec2 = normalVector(lhs.bounding(), rhs.bounding());

		if(lhs.mass == Infinity && rhs.mass == Infinity) {
			return;
		}

		if(lhs.mass != Infinity && rhs.mass != Infinity) {
			let lhsVelocityOrthogontal: Vec2 = rhs.velocity.projection(normal).mul((coefficientOfRestitution + 1) * rhs.mass).add(
				lhs.velocity.projection(normal).mul(lhs.mass - coefficientOfRestitution*rhs.mass)).mul(1/(lhs.mass+rhs.mass));

			let lhsVelocityTangent: Vec2 = lhs.velocity.projection(new Vec2(-normal.y, normal.x));


			let rhsVelocityOrthogontal: Vec2 = lhs.velocity.projection(normal).mul((coefficientOfRestitution + 1) * lhs.mass).sub(
				rhs.velocity.projection(normal).mul(lhs.mass - coefficientOfRestitution*rhs.mass)).mul(1/(lhs.mass+rhs.mass));

			let rhsVelocityTangent: Vec2 = rhs.velocity.projection(new Vec2(-normal.y, normal.x));


			let interpenetration: Vec2 = Intersections.interpenetrationVector(lhs.bounding(), rhs.bounding());
			lhs.position = lhs.position.add(interpenetration.mul(rhs.mass/(lhs.mass + rhs.mass)));
			rhs.position = rhs.position.sub(interpenetration.mul(lhs.mass/(lhs.mass + rhs.mass)));

			lhs.acceleration = lhs.acceleration.sub(rhs.acceleration.projection(normal));
			rhs.acceleration = rhs.acceleration.sub(lhs.acceleration.projection(normal));

			lhs.velocity = lhsVelocityOrthogontal.add(lhsVelocityTangent);
			rhs.velocity = rhsVelocityOrthogontal.add(rhsVelocityTangent);
		}

		else if(lhs.mass != Infinity && rhs.mass == Infinity) {

			let lhsAccelerationOrthogontal: Vec2 = lhs.acceleration.projection(normal);
			let lhsAccelerationTangent: Vec2 = lhs.acceleration.projection(new Vec2(-normal.y, normal.x));
			// console.log(lhs.acceleration);
			// console.log("A: ", lhsAccelerationOrthogontal.mul(lhs.mass).length());


			lhs.position = lhs.position.add(Intersections.interpenetrationVector(lhs.bounding(), rhs.bounding()));

			// lhs.acceleration = lhs.acceleration.sub(lhs.acceleration.projection(normal));
			// console.log(lhs.acceleration);

			let lhsVelocityOrthogontal: Vec2 = rhs.velocity.projection(normal).mul(coefficientOfRestitution + 1).sub(
				lhs.velocity.projection(normal).mul(coefficientOfRestitution));

			let lhsVelocityTangent: Vec2 = lhs.velocity.projection(new Vec2(-normal.y, normal.x));
			// console.log("R: ", lhsVelocityTangent.normal().mul(-lhsAccelerationOrthogontal.mul(lhs.mass).length()));
			if(lhsVelocityTangent.length() > lhsAccelerationOrthogontal.length() * lhs.mass) {
				lhs.acceleration = lhs.acceleration.add(lhsVelocityTangent.normal().mul(-lhsAccelerationOrthogontal.mul(lhs.mass).length()));
			}
			else if(lhsVelocityTangent.length() > 5)
			{
				lhs.acceleration = lhs.acceleration.add(lhsVelocityTangent.normal().mul(-lhsAccelerationOrthogontal.mul(lhs.mass).length() * 
					lhsVelocityTangent.length() / (lhsAccelerationOrthogontal.length() * lhs.mass)**(0.65)));
			}
			else
			{
				;
			}
			// console.log("A: ", lhs.acceleration);
			// console.log("V: ", lhs.velocity);

			// console.log("V: ", lhsVelocityOrthogontal.mul(lhs.mass), lhsVelocityTangent);

			lhs.velocity = lhsVelocityOrthogontal.add(lhsVelocityTangent);
		}

		else if(lhs.mass == Infinity && rhs.mass != Infinity) {
			Collide(rhs, lhs);
		}
	}
}

export function normalVector(lhs: Intersections.Bounding, rhs: Intersections.Bounding)
{
	if(lhs instanceof Intersections.Circle && rhs instanceof Intersections.Circle) {
		let orthogontal: Vec2 = lhs.position.sub(rhs.position).normal();
		return orthogontal;
	}
	else {
		return new Vec2(0,1);
	}
}
