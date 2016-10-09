import Color from "../../util/Color"
import Vec2 from "../../util/Vec2"
import {Font} from "../../util/Font"
import TransformMatrix from "../../util/TransformMatrix"
import {LineCap, LineJoin, Context2D} from "../Context2D"
import {Image} from "../Image"
import WebImage from "./WebImage"

export default class CanvasContext2D extends Context2D {
	protected currentTransform: TransformMatrix = new TransformMatrix(1, 0, 0, 0, 1, 0);
	protected transformHistory = new Array<TransformMatrix>();

	constructor(public ctx: CanvasRenderingContext2D) { super(); }

	width(): number {
		return this.ctx.canvas.width;
	}
	height(): number {
		return this.ctx.canvas.height;
	}

	clearRect(x: number, y: number, width: number, height: number): this {
		this.ctx.clearRect(x, y, width, height); return this;
	}

	drawRect(x: number, y: number, width: number, height: number, fill: boolean, stroke: boolean): this {
		if (fill) { this.ctx.fillRect(x, y, width, height); }
		if (stroke) { this.ctx.strokeRect(x, y, width, height); }
		return this;
	}
	drawPath(fill: boolean, stroke: boolean): this {
		if (fill) { this.ctx.fill(); }
		if (stroke) { this.ctx.stroke(); }
		return this;
	}
	drawText(x: number, y: number, text: string, baseline: string, fill: boolean, stroke: boolean): this {
		this.ctx.textBaseline = baseline;
		if (fill) { this.ctx.fillText(text, x, y); }
		if (stroke) { this.ctx.strokeText(text, x, y); }
		return this;
	}

	drawImage(img: Image, x: number, y: number): this;
	drawImage(img: Image, x: number, y: number, width: number, height: number): this;
	drawImage(img: Image, x: number, y: number, width: number, height: number,
		sx: number, sy: number, sourceWidth: number, sourceHeight: number): this;
	drawImage(img: Image, x: number, y: number, width?: number, height?: number,
		sx?: number, sy?: number, sourceWidth?: number, sourceHeight?: number): this {

		if (img instanceof WebImage) {
			if (sx && sy && sourceWidth && sourceHeight) {
				this.ctx.drawImage(img.image, sx, sy, sourceWidth, sourceHeight, x, y, width, height);
			} else if (width && height) {
				this.ctx.drawImage(img.image, x, y, width, height);
			} else {
				this.ctx.drawImage(img.image, x, y);
			}
		} else {
			throw "Unsupported image";
		}
		return this;
	}

	beginPath(startX: number, startY: number): this {
		this.ctx.beginPath();
		this.ctx.moveTo(startX, startY);
		return this;
	}
	closePath(): this {
		this.ctx.closePath(); return this;
	}
	movePath(startX: number, startY: number): this {
		this.ctx.moveTo(startX, startY); return this;
	}

	pathLine(endX: number, endY: number): this {
		this.ctx.lineTo(endX, endY); return this;
	}
	pathBezier(cp1X: number, cp1Y: number, cp2X: number, cp2Y: number, endX: number, endY: number): this {
		this.ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY); return this;
	}
	pathQuadratic(cpX: number, cpY: number, endX: number, endY: number): this {
		this.ctx.quadraticCurveTo(cpX, cpY, endX, endY); return this;
	}
	pathArc(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number, antiClockwise: boolean): this {
		this.ctx.arc(centerX, centerY, radius, startAngle, endAngle, antiClockwise); return this;
	}
	pathArcByControlPoints(x1: number, y1: number, x2: number, y2: number, radius: number): this {
		this.ctx.arcTo(x1, y1, x2, y2, radius); return this;
	}

	lineWidth(): number;
	lineWidth(val: number): this;
	lineWidth(val?: number): any {
		if (val) {
			this.ctx.lineWidth = val; return this;
		}
		return this.ctx.lineWidth;
	}

	lineCap(): LineCap;
	lineCap(val: LineCap): this;
	lineCap(val?: LineCap): any {
		if (val) {
			this.ctx.lineCap = val; return this;
		}
		return this.ctx.lineCap;
	}

	lineJoin(): LineJoin;
	lineJoin(val: LineJoin): this;
	lineJoin(val?: LineJoin): any {
		if (val) {
			this.ctx.lineJoin = val; return this;
		}
		return this.ctx.lineJoin;
	}

	fillColor(): Color;
	fillColor(color: Color): this;
	fillColor(color?: Color): any {
		if (color) {
			this.ctx.fillStyle = color.toString(); return this;
		}
		if (typeof this.ctx.fillStyle === "string") {
			return Color.fromString(<string>this.ctx.fillStyle);
		}
		return undefined;
	}

	strokeColor(): Color;
	strokeColor(color: Color): this;
	strokeColor(color?: Color): any {
		if (color) {
			this.ctx.strokeStyle = color.toString(); return this;
		}
		if (typeof this.ctx.strokeStyle === "string") {
			return Color.fromString(<string>this.ctx.strokeStyle);
		}
		return undefined;
	}

	shadowBlur(): number;
	shadowBlur(level: number): this;
	shadowBlur(level?: number): any {
		if (level) {
			this.ctx.shadowBlur = level; return this;
		}
		return this.ctx.shadowBlur;
	}

	shadowColor(): Color;
	shadowColor(color: Color): this;
	shadowColor(color?: Color): any {
		if (color) {
			this.ctx.shadowColor = color.toString(); return this;
		}
		return Color.fromString(this.ctx.shadowColor);
	}

	shadowOffset(): Vec2;
	shadowOffset(x: number, y: number): this;
	shadowOffset(x?: number, y?: number): any {
		if (x && y) {
			this.ctx.shadowOffsetX = x;
			this.ctx.shadowOffsetY = y;
			return this;
		}
		return new Vec2(this.ctx.shadowOffsetX, this.ctx.shadowOffsetY);
	}

	font(): Font;
	font(font: Font): this;
	font(font?: Font): any {
		if (font) {
			this.ctx.font = font.toString(); return this;
		}
		return Font.fromString(this.ctx.font);
	}

	alpha(): number;
	alpha(val: number): this;
	alpha(val?: number): any {
		if (val) {
			this.ctx.globalAlpha = val; return this;
		}
		return this.ctx.globalAlpha;
	}

	protected onTransformChanged() {
		let m = this.currentTransform;
		this.ctx.setTransform(m[0][0], m[1][0], m[0][1], m[1][1], m[0][2], m[1][2]);
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

	save(): this {
		this.transformHistory.push(this.currentTransform);
		this.ctx.save();
		return this;
	}

	restore(): this {
		this.ctx.restore();
		this.transformMatrix(this.transformHistory.pop());
		return this;
	}
}
