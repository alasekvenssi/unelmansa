import Color from "../util/Color"
import Vec2 from "../util/Vec2"
import {Font} from "../util/Font"
import TransformMatrix from "../util/TransformMatrix"
import * as Strings from "../util/Strings"

export type LineCap = "butt" | "round" | "square";
export type LineJoin = "miter" | "round" | "bevel";
export type TextBaseline = "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";

// TODO: text, images, line dash, gradients, patterns

export abstract class Context2D {
	abstract width(): number;
	abstract height(): number;

	abstract clearRect(x: number, y: number, width: number, height: number): this;

	abstract drawRect(x: number, y: number, width: number, height: number, fill: boolean, stroke: boolean): this;
	abstract drawPath(fill: boolean, stroke: boolean): this;
	abstract drawText(x: number, y: number, text: string, baseline: string, fill: boolean, stroke: boolean): this;

	abstract beginPath(startX: number, startY: number): this;
	abstract closePath(): this;
	abstract movePath(startX: number, startY: number): this;

	abstract pathLine(endX: number, endY: number): this;
	abstract pathBezier(cp1X: number, cp1Y: number, cp2X: number, cp2Y: number, endX: number, endY: number): this;
	abstract pathQuadratic(cpX: number, cpY: number, endX: number, endY: number): this;
	abstract pathArc(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number, antiClockwise: boolean): this;
	abstract pathArcByControlPoints(x1: number, y1: number, x2: number, y2: number, radius: number): this;

	abstract lineWidth(): number;
	abstract lineWidth(val: number): this;
	abstract lineCap(): LineCap;
	abstract lineCap(val: LineCap): this;
	abstract lineJoin(): LineJoin;
	abstract lineJoin(val: LineJoin): this;

	abstract fillColor(): Color;
	abstract fillColor(color: Color): this;
	abstract strokeColor(): Color;
	abstract strokeColor(color: Color): this;

	abstract shadowBlur(): number;
	abstract shadowBlur(level: number): this;
	abstract shadowColor(): Color;
	abstract shadowColor(color: Color): this;
	abstract shadowOffset(): Vec2;
	abstract shadowOffset(x: number, y: number): this;

	abstract font(): Font;
	abstract font(font: Font): this;

	abstract alpha(): number;
	abstract alpha(val: number): this;

	protected currentTransform: TransformMatrix = new TransformMatrix(1, 0, 0, 0, 1, 0);
	protected onTransformChanged(): void {}

	reset(): this {
		return this.resetTransform().clearRect(0, 0, this.width(), this.height());
	}

	transformMatrix(): TransformMatrix;
	transformMatrix(val: TransformMatrix): this;
	transformMatrix(val?: TransformMatrix): this|TransformMatrix {
		if (val) {
			this.currentTransform = val.clone();
			this.onTransformChanged();
			return this;
		}
		return this.currentTransform.clone();
	}

	transform(val: TransformMatrix): this {
		this.currentTransform = this.currentTransform.mul(val);
		this.onTransformChanged();
		return this;
	}
	resetTransform(): this {
		return this.transformMatrix(new TransformMatrix());
	}

	translate(x: number, y: number): this {
		return this.transform(TransformMatrix.translate(x, y))
	}
	scale(x: number, y: number): this {
		return this.transform(TransformMatrix.scale(x, y))
	}
	rotate(angle: number): this {
		return this.transform(TransformMatrix.rotate(angle))
	}
	skew(x: number, y: number): this {
		return this.transform(TransformMatrix.skew(x, y))
	}
}
