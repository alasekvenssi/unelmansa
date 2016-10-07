export class MathUtil {
	static round(x: number, precision: number = MathUtil.Epsilon): number {
		let temp: number = 10**precision;
		return Math.round(x*temp)/temp;
	}

	static roundForEach(array: number[]): number[] {
		array.forEach(function (value: number, index: number, arr: number[]): void {
			array[index] = MathUtil.round(value);
		});

		return array;
	}

	static roundArray(array: number[]): number[] {
		let result: number[] = array.slice();
		return MathUtil.roundForEach(result);
	}

	public static readonly Epsilon: number = 3; // decimal place
	public static readonly AbsError: number = 10**(-MathUtil.Epsilon);
}