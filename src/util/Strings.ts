// Split string and ignore empty elements
export function fields(str: string, separator: string): string[] {
	return str.split(separator).filter(function (elem: string) {
		return elem.length != 0;
	});
}
