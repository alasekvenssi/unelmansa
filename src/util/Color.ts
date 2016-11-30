export default class Color {
	constructor(public r: number = 0, public g: number = 0, public b: number = 0, public a: number = 255) { }

	getRGB(): string {
		return `rgb(${this.r}, ${this.g}, ${this.b})`;
	}

	getRGBA(): string {
		return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a / 255})`;
	}

	toString(): string {
		return this.getRGBA();
	}

	toInt32(): number {
		return this.r | (this.g << 8) | (this.b << 16) | (this.a << 24);
	}
	toInt24(): number {
		return this.r | (this.g << 8) | (this.b << 16);
	}

	isValid(): boolean {
		if (this.r < 0 || this.r > 255 || this.g < 0 || this.g > 255 || this.b < 0 || this.b > 255 || this.a < 0 || this.a > 255) {
			return false;
		} else {
			return true;
		}
	}

	static randomRGB(): Color {
		return new Color(
			Math.floor(Math.random() * 255),
			Math.floor(Math.random() * 255),
			Math.floor(Math.random() * 255)
		);
	}

	static randomRGBA(): Color {
		return new Color(
			Math.floor(Math.random() * 255),
			Math.floor(Math.random() * 255),
			Math.floor(Math.random() * 255),
			Math.floor(Math.random() * 255)
		);
	}

	static fromInt32(num: number): Color {
		return new Color(num & 0xFF, (num >> 8) & 0xFF, (num >> 16) & 0xFF, (num >> 24) & 0xFF);
	}
	static fromInt24(num: number): Color {
		return new Color(num & 0xFF, (num >> 8) & 0xFF, (num >> 16) & 0xFF);
	}

	static fromString(colorString: string): Color {
		colorString = colorString.trim();

		if (colorString.length == 0) {
			return Color.Transparent;
		}

		let result: Color = new Color();

		if ((colorString.length == 7 || colorString.length == 9) && colorString[0] == '#') {
			let colors: string[] = ["", "", ""];
			for (let i: number = 0; i < 6; ++i) {
				let colorsIdx: number = Math.floor(i / 2);
				colors[colorsIdx] += colorString[i + 1].toUpperCase();
			}

			result.r = parseInt(colors[0], 16);
			result.g = parseInt(colors[1], 16);
			result.b = parseInt(colors[2], 16);
		}

		if (colorString.length == 9 && colorString[0] == '#') {
			let alpha: string = (colorString[7] + colorString[8]).toUpperCase();
			result.a = parseInt(alpha, 16);
		}

		if (colorString[0] == '#') {
			if (!result.isValid()) {
				throw `Invalid params`;
			}

			return result;
		}

		let temp: string = "";
		let array: string[];

		for (let i: number = 0; i < colorString.length; ++i) {
			if (!isNaN(parseInt(colorString[i], 10)) || colorString[i] == ',' || colorString[i] == '.') {
				temp += colorString[i];
			}
		}

		array = temp.split(',', 5);
		if (array.length != 3 && array.length != 4) {
			throw `Invalid amout of ','`;
		}

		result = new Color(parseInt(array[0], 10), parseInt(array[1], 10), parseInt(array[2], 10));
		if (array.length == 4) {
			result.a = parseFloat(array[3]);
		}

		if (!result.isValid()) {
			throw `Invalid params`;
		}

		return result;
	}

	public static readonly Black: Color = new Color(0, 0, 0);
	public static readonly Blue: Color = new Color(0, 0, 255);
	public static readonly Cyan: Color = new Color(0, 255, 255);
	public static readonly Green: Color = new Color(0, 255, 0);
	public static readonly Magenta: Color = new Color(255, 0, 255);
	public static readonly Red: Color = new Color(255, 0, 0);
	public static readonly Transparent: Color = new Color(0, 0, 0, 0);
	public static readonly White: Color = new Color(255, 255, 255);
	public static readonly Yellow: Color = new Color(255, 255, 0);
}