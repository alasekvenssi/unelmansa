type ForEachType<T> = (value: T, index: number, array: T[]) => void;

export abstract class Arrays {
	static forEachInPlace<T>(array: T[], op: ForEachType<T>): T[] {
		array.forEach(op);
		return array;
	}
}