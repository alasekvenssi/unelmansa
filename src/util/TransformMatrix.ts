import Matrix2       from "./Matrix2"
import * as MathUtil from "./Math"
import Vec2          from "./Vec2"

export default class TransformMatrix extends Array<Array<number>> {
	constructor(x11: number = 0, x12: number = 0, x13: number = 0, x21: number = 0, x22: number = 0, x23: number = 0) {
		super(TransformMatrix.h);
	
		for(let y: number = 0; y < TransformMatrix.h; ++y) {
			this[y] = new Array<number>(TransformMatrix.w);
		}

		this[0][0] = x11;
		this[0][1] = x12;
		this[0][2] = x13;
		this[1][0] = x21;
		this[1][1] = x22;
		this[1][2] = x23;
	}

	mul(rhs: TransformMatrix): TransformMatrix {
		return new TransformMatrix(
			this[0][0]*rhs[0][0]+this[0][1]*rhs[1][0],
			this[0][0]*rhs[0][1]+this[0][1]*rhs[1][1],
			this[0][0]*rhs[0][2]+this[0][1]*rhs[1][2] + this[0][2],

			this[1][0]*rhs[0][0]+this[1][1]*rhs[1][0],
			this[1][0]*rhs[0][1]+this[1][1]*rhs[1][1],
			this[1][0]*rhs[0][2]+this[1][1]*rhs[1][2] + this[1][2]
		);
	}

	apply(rhs: Vec2): Vec2 {
		return new Vec2(
			this[0][0]*rhs.x + this[0][1]*rhs.y + this[0][2],
			this[1][0]*rhs.x + this[1][1]*rhs.y + this[1][2]
		);
	}

	set(y: number, x: number, value: number): TransformMatrix {
		if(x < 0 || x >= TransformMatrix.w || y < 0 || y >= TransformMatrix.h) {
			throw 'Out of range';
		}

		this[y][x] = value;
		return this;
	}

	get(x: number, y: number): number {
		if(x < 0 || x >= TransformMatrix.w || y < 0 || y >= TransformMatrix.h) {
			throw 'Out of range';
		}

		return this[y][x];
	}

	toMatrix(): Matrix2 {
		let result: Matrix2 = new Matrix2(3, 3, 0);
		
		for(let y: number = 0; y < TransformMatrix.h; ++y) {
			for(let x: number = 0; x < TransformMatrix.w; ++x) {
				result[y][x] = this[y][x];
			}
		}

		result[2][2] = 1;
		return result;
	}

	print(): void {
		for(let y: number = 0; y < TransformMatrix.h; ++y) {
			console.log(MathUtil.roundArray(this[y]));
		}
		console.log('-');
	}

	static translate(x: number, y: number): TransformMatrix {
		return new TransformMatrix(
			1, 0, x,
			0, 1, y
		);
	}

	static scale(x: number, y: number): TransformMatrix {
		return new TransformMatrix(
			x, 0, 0,
			0, y, 0
		);
	}

	static rotate(angle: number): TransformMatrix {
		let s: number = Math.sin(angle);
		let c: number = Math.cos(angle);

		return new TransformMatrix(
			c, -s, 0,
			s, c, 0
		);
	}

	static skew(xAngle: number, yAngle: number): TransformMatrix {
		return new TransformMatrix(
			1, Math.tan(xAngle), 0,
			Math.tan(yAngle), 1, 0
		);
	}

	private static readonly w: number = 3;
	private static readonly h: number = 2;
}