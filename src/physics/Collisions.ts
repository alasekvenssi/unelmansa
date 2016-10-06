import {Vec2} from "../util/Vec2";



class bigCircle {
	constructor(public radius: number, public position: Vec2) {
	}
}

interface Circle{
	radius: number;
	position: Vec2;

}

function isIntersecting(lhs, rhs): boolean {
	// if(lhs instanceof Circle) {
		// code...
	// }
	return true;
}

/*function isIntersecting(lhs :Rectangular, rhs :Circle) {
	console.log(lhs.position, rhs.position);
}
*/


let x: bigCircle = new bigCircle(5, new Vec2(1,1));
let y: bigCircle = new bigCircle(2, new Vec2(0,0));

// console.log(instanceof bigCircle)

isIntersecting(x, y);