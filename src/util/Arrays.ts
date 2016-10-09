type ForEachType<T> = (value: T, index: number, array: T[]) => void;

export function forEachInPlace<T>(array: T[], op: ForEachType<T>): T[] {
	array.forEach(op);
	return array;
}

export function fillArray<T>(array: T[], begin: number, end: number, value: T): T[] {
	for (let i = begin; i < end; i++) {
		array[i] = value;
	}
	return array;
}
