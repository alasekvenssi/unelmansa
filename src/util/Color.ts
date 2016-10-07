export class Color {
	constructor(public r: number = 0, public g: number = 0, public b: number = 0, public a: number = 255) {}

	getRGB(): string {
		return `rgb(${this.r}, ${this.g}, ${this.b})`;
	}

	getRGBA(): string {
		return`rgba(${this.r}, ${this.g}, ${this.b}, ${this.a/255})`;
	}

	toString(): string {
		return this.getRGBA();
	}

	isValid(): boolean {
		if(this.r < 0 || this.r > 255 || this.g < 0 || this.g > 255 || this.b < 0 || this.b > 255 || this.a < 0 || this.a > 255) {
			return false;
		} else {
			return true;
		}
	}

	static fromString(colorString: string): Color {
		let temp: string = "";
		let array: string[];
		let result: Color;

		for(let i: number = 0; i < colorString.length; ++i) {
			if(!isNaN(parseInt(colorString[i], 10)) || colorString[i] == ',' || colorString[i] == '.') {
				temp += colorString[i];
			}
		}

		array = temp.split(',', 5);
		if(array.length != 3 && array.length != 4) {
			throw `Invalid amout of ','`;
		}

		result = new Color(parseInt(array[0], 10), parseInt(array[1], 10), parseInt(array[2], 10));
		if(array.length == 4) {
			result.a = parseFloat(array[3]);
		}

		return result.isValid() ? result : Color.Transparent;
	}

	public static readonly Black:       Color = new Color(0  , 0  , 0     );
	public static readonly Blue:        Color = new Color(0  , 0  , 255   );
	public static readonly Cyan:        Color = new Color(0  , 255, 255   );
	public static readonly Green:       Color = new Color(0  , 255, 0     );
	public static readonly Magenta:     Color = new Color(255, 0  , 255   );
	public static readonly Red:         Color = new Color(255, 0  , 0     );
	public static readonly Transparent: Color = new Color(0  , 0  , 0  , 0);
	public static readonly White:       Color = new Color(255, 255, 255   );
	public static readonly Yellow:      Color = new Color(255, 255, 0     );
}