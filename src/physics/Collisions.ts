import Vec2 from "../util/Vec2";
import Intersections = require("./Intersections");

interface physicalBody {

	shape: Intersections.Shape;

	velocity: Vec2;
	mass: number;
	elasticity: number;
}

export default function Collide(lhs: physicalBody, rhs: physicalBody): void {
	if(Intersections.areIntersecting(lhs, rhs)) {

		let coefficientOfRestitution: number = (lhs.elasticity + rhs.elasticity)/2;
		
		if(lhs.mass == Infinity && rhs.mass == Infinity) {
			return;
		}

		else if(lhs.mass != Infinity && rhs.mass != Infinity) {
			let LhsVelocity: Vec2 = new Vec2(lhs.velocity.x, lhs.velocity.y);


			lhs.velocity.x = (lhs.mass * lhs.velocity.x + rhs.mass * rhs.velocity.x + 
				rhs.mass * coefficientOfRestitution * (rhs.velocity.x - lhs.velocity.x))/
				(lhs.mass + rhs.mass);

			lhs.velocity.y = (lhs.mass * lhs.velocity.y + rhs.mass * rhs.velocity.y + 
				rhs.mass * coefficientOfRestitution * (rhs.velocity.y - lhs.velocity.y))/
				(lhs.mass + rhs.mass);


			rhs.velocity.y = (rhs.mass * rhs.velocity.y + lhs.mass * LhsVelocity.y + 
				lhs.mass * coefficientOfRestitution * (LhsVelocity.y - rhs.velocity.y))/
				(rhs.mass + lhs.mass);

			rhs.velocity.x = (rhs.mass * rhs.velocity.x + lhs.mass * LhsVelocity.x + 
				lhs.mass * coefficientOfRestitution * (LhsVelocity.x - rhs.velocity.x))/
				(rhs.mass + lhs.mass);
		}

		else if(lhs.mass != Infinity && rhs.mass == Infinity) {
			lhs.velocity.x = rhs.velocity.x + coefficientOfRestitution*(rhs.velocity.x - lhs. velocity.x);
			lhs.velocity.y = rhs.velocity.y + coefficientOfRestitution*(rhs.velocity.y - lhs. velocity.y);
		}


		else if(lhs.mass == Infinity && rhs.mass != Infinity) {
			Collide(rhs, lhs);
		}		
	}
}
