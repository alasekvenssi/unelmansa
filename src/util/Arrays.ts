type ForEachType<T> = (value: T, index: number, array: T[]) => void;

export function forEachInPlace<T>(array: T[], op: ForEachType<T>): T[] {
	array.forEach(op);
	return array;
}
