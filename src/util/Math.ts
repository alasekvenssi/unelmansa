import * as Arrays from "./Arrays"

export function round(x: number, precision: number = Epsilon): number {
	let temp: number = 10 ** precision;
	return Math.round(x * temp) / temp;
}

export function roundForEach(array: number[]): number[] {
	return Arrays.forEachInPlace(array, function (value: number, index: number, arr: number[]): void {
		array[index] = round(value);
	});
}

export function roundArray(array: number[]): number[] {
	let result: number[] = array.slice();
	return roundForEach(result);
}

export function randomChance(chance: number): boolean {
	return Math.random() <= chance;
}

export function random(from: number, to: number): number { // <from, to)
	return Math.random() * (to - from) + from;
}

export function tanh(x: number): number {
    var a = Math.exp(+x), b = Math.exp(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (a + b);
}



const Epsilon: number = 3; // decimal place
const AbsError: number = 10 ** (-Epsilon);