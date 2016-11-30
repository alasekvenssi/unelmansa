import Color from "./Color"

class PseudoGradientElement {
    public value: number;
    public color: Color;
}

export default class PseudoGradient {
    constructor(public vec: Array<PseudoGradientElement> = new Array<PseudoGradientElement>()) {

    }

    get(value: number): Color {
        if (this.vec.length == 0) {
            return Color.Transparent;
        }

        if (value < this.vec[0].value) {
            return this.vec[0].color;
        } else if (value >= this.vec[this.vec.length - 1].value) {
            return this.vec[this.vec.length - 1].color;
        }

        for (let i: number = 0; i < this.vec.length - 1; ++i) {
            if (this.vec[i].value <= value && this.vec[i + 1].value > value) {
                let relative: number = (value - this.vec[i].value) / (this.vec[i + 1].value - this.vec[i].value);
                return new Color(
                    Math.round(this.vec[i].color.r * (1 - relative) + this.vec[i + 1].color.r * relative),
                    Math.round(this.vec[i].color.g * (1 - relative) + this.vec[i + 1].color.g * relative),
                    Math.round(this.vec[i].color.b * (1 - relative) + this.vec[i + 1].color.b * relative),
                    Math.round(this.vec[i].color.a * (1 - relative) + this.vec[i + 1].color.a * relative)
                );
            }
        }

        return Color.Transparent;
    }

    insert(elem: PseudoGradientElement): void {
        this.vec.push(elem);
    }

    prepare(): void {
        this.vec.sort(
            (lhs: PseudoGradientElement, rhs: PseudoGradientElement) => {
                if (lhs.value < rhs.value) {
                    return -1;
                } else if (lhs.value > rhs.value) {
                    return 1;
                } else {
                    return 0;
                }
            }
        )
    }
}