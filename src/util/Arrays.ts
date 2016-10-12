type ForEachType<T> = (value: T, index: number, array: T[]) => void;
type ForEachFilterType<T> = (value: T, index: number, array: T[]) => boolean;

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

export function filterInPlace<T>(array: T[], filter: ForEachFilterType<T>): T[] {
	for (let i = 0; i < array.length; i++) {
		if (!filter(array[i], i, array)) {
			array.splice(i, 1);
			i--;
		}
	}
	return array;
}

export function filter<T>(array: T[], filter: ForEachFilterType<T>): T[] {
	let filtered = new Array<T>();

	for (let i = 0; i < array.length; i++) {
		if (filter(array[i], i, array)) {
			filtered.push(array[i]);
		}
	}
	return filtered;
}

export function remove<T>(array: T[], target: T): T[] {
	return filterInPlace(array, (elem: T) => { return elem !== target; });
}
