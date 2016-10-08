import * as Strings from "./Strings"

type FontStyle = "normal" | "italic" | "oblique";
type FontVariant = "normal" | "small-caps";

export namespace FontWeight {
	export let Lighter = 300;
	export let Normal = 400;
	export let Bold = 700;
	export let Bolder = 900;

	export function fromString(text: string): number {
		let weight: number = parseInt(text);
		if (!isNaN(weight)) {
			return weight;
		}

		switch (text.toLowerCase()) {
			case "lighter": return Lighter;
			case "normal": return Normal;
			case "bold": return Bold;
			case "bolder": return Bolder;
		}
		throw undefined;
	}
}

export class Font {
	constructor(public family: string = "Arial",
				public size: number = 12,
				public style: FontStyle = "normal",
				public weight: number = FontWeight.Normal,
				public variant: FontVariant = "normal") {}

	toString(): string {
		return `${this.style} ${this.weight} ${this.variant} ${this.size}px '${this.family}'`;
	}

	// font-style font-weight font-variant font-size font-family
	// italic     bold        small-caps   13px      "Times New Roman"
	static fromString(str: string): Font {
		let fields = Strings.fields(str, " ");
		let font = new Font();
		let state = 0;

		for (let i = 0; i < fields.length; i++) {
			let field = fields[i].toLowerCase();

			if (state == 0) {
				state = 1;
				if (field == "normal" || field == "italic" || field == "oblique") {
					font.style = <FontStyle>field;
					continue;
				}
			}
			if (state == 1) {
				state = 2;
				let weight = FontWeight.fromString(field);
				if (weight) {
					font.weight = weight;
					continue;
				}
			}
			if (state == 2) {
				state = 3;
				if (field == "normal" || field == "small-caps") {
					font.variant = <FontVariant>field;
					continue;
				}
			}
			if (state == 3) {
				state = 4;
				let size = parseInt(field);
				if (Strings.endsWith(field, "px") && !isNaN(size)) {
					font.size = size;
					continue;
				}
			}

			font.family = fields.slice(i).join(" ").replace(`"`, "").replace(`'`, "");
		}
		return font;
	}
}
