// Split string and ignore empty elements
export function fields(str: string, separator: string): string[] {
	return str.split(separator).filter(function (elem: string) {
		return elem.length != 0;
	});
}

export function startsWith(str: string, prefix: string): boolean {
	return str.indexOf(prefix) == 0;
}

export function endsWith(str: string, suffix: string): boolean {
	return str.lastIndexOf(suffix) == (str.length - suffix.length);
}
