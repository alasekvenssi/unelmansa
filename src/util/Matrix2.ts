import {TransformMatrix} from "./TransformMatrix"
import {MathUtil}        from "./Math"

type CloneOperator = (y: number, x: number, InArray: number[][], OutArray: number[][]) => void;
type ApplyOperator = (y: number, x: number, array: number[][]) => void;

function defaultCloneOperator(y: number, x: number, InArray: number[][], OutArray: number[][]): void {
	OutArray[y][x] = InArray[y][x];
}

export class Matrix2 extends Array<Array<number>> {
	constructor(private h: number = 0, private w: number = 0, value: number = 0) {
		super(h);

		for(let y: number = 0; y < h; ++y) {
			this[y] = new Array<number>(w);
			for(let x: number = 0; x < w; ++x) {
				this[y][x] = value;
			}
		}
	}

	mul(rhs: Matrix2): Matrix2 {
		if(this.getWidth() != rhs.getHeight()) {
			throw `Invalid matrix multiplication`;
		}

		let result: Matrix2 = Matrix2.zeros(rhs.getWidth(), this.getHeight()); 
		for(let y: number = 0; y < this.getHeight(); ++y) {
			for(let x: number = 0; x < rhs.getWidth(); ++x) {
				for(let l: number = 0; l < this.getWidth(); ++l) {
					result[y][x] += this[y][l] * rhs[l][x];
				}
			}
		}

		return result;
	}

	clone(op: CloneOperator = defaultCloneOperator): Matrix2 {
		let result: Matrix2 = new Matrix2(this.getHeight(), this.getWidth());
		
		for(let y: number = 0; y < this.h; ++y) {
			for(let x: number = 0; x < this.w; ++x) {
				op(y, x, this, result);
			}
		}

		return result;
	}

	apply(op: ApplyOperator) {
		for(let y: number = 0; y < this.h; ++y) {
			for(let x: number = 0; x < this.w; ++x) {
				op(y, x, this);
			}
		}
	}

	toTransformMatrix(): TransformMatrix {
		if(this.getWidth() != 3 || this.getHeight() != 3) {
			throw `Invalid matrix size`;
		} else if(this[2][0] != 0 || this[2][1] != 0) {
			throw `Invalid last row`;
		} else if(this[2][2] == 0) {
			throw 'Invalid scale';
		}

		let result: TransformMatrix = new TransformMatrix();
		for(let y: number = 0; y < this.h-1; ++y) {
			for(let x: number = 0; x < this.w; ++x) {
				result[y][x] = this[y][x] / this[2][2];
			}
		}

		return result;
	}

	static eye(size: number): Matrix2 {
		let result: Matrix2 = new Matrix2(size, size);
		
		for(let i: number = 0; i < size; ++i) {
			result[i][i] = 1;
		}

		return result;
	}

	static zeros(h: number, w: number): Matrix2 {
		return new Matrix2(h, w, 0);
	}

	static ones(h: number, w: number): Matrix2 {
		return new Matrix2(h, w, 1);
	}

	fill(value: number = 0): Matrix2 {
		for(let y: number = 0; y < this.h; ++y) {
			for(let x: number = 0; x < this.w; ++x) {
				this[y][x] = value;
			}
		}

		return this;
	}

	set(y: number, x: number, value: number): Matrix2 {
		if(x < 0 || x >= this.w || y < 0 || y >= this.h) {
			throw `Out of range`;
		}

		this[y][x] = value;
		return this;
	}

	get(x: number, y: number): number {
		if(x < 0 || x >= this.w || y < 0 || y >= this.h) {
			throw `Out of range`;
		}

		return this[y][x];
	}

	pow(exponent: number): Matrix2 {
		if(exponent < 0) {
			throw `Invalid exponent`;
		} else if(exponent == 0) {
			return this.getWidth() != this.getHeight() ? new Matrix2() : Matrix2.eye(this.getWidth());
		} else if(exponent == 1) {
			return this;
		}

		let temp: Matrix2 = this.pow(Math.floor(exponent/2));
		return exponent % 2 == 0 ? temp.mul(temp) : temp.mul(temp).mul(this);
	}

	print(): void {
		for(let y: number = 0; y < this.h; ++y) {
			console.log(MathUtil.roundArray(this[y]));
		}
		console.log('-');
	}

	getTotal(): number {
		return this.getWidth() * this.getHeight();
	}

	getWidth(): number {
		return this.w;
	}

	getHeight(): number {
		return this.h;
	}
}