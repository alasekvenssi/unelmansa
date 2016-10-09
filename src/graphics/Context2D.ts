import Color from "../util/Color"
import Vec2 from "../util/Vec2"
import {Font} from "../util/Font"
import TransformMatrix from "../util/TransformMatrix"
import * as Strings from "../util/Strings"
import {Image} from "./Image"
import {Gradient} from "./Gradient"

export type LineCap = "butt" | "round" | "square";
export type LineJoin = "miter" | "round" | "bevel";
export type TextBaseline = "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";

export abstract class Context2D {
	abstract width(): number;
	abstract height(): number;

	abstract clearRect(x: number, y: number, width: number, height: number): this;

	abstract drawRect(x: number, y: number, width: number, height: number, fill: boolean, stroke: boolean): this;
	abstract drawPath(fill: boolean, stroke: boolean): this;
	abstract drawText(x: number, y: number, text: string, baseline: string, fill: boolean, stroke: boolean): this;

	abstract drawImage(img: Image, x: number, y: number): this;
	abstract drawImage(img: Image, x: number, y: number, width: number, height: number): this;
	abstract drawImage(img: Image, x: number, y: number, width: number, height: number,
		sx: number, sy: number, sourceWidth: number, sourceHeight: number): this;

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

	abstract fillGradient(val: Gradient): this;
	abstract strokeGradient(val: Gradient): this;

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

	abstract transformMatrix(): TransformMatrix;
	abstract transformMatrix(val: TransformMatrix): this;
	abstract transform(val: TransformMatrix): this;

	abstract save(): this;
	abstract restore(): this;

	reset(): this {
		return this.resetTransform().clearRect(0, 0, this.width(), this.height());
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
