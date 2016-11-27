import {LineCap, LineJoin, TextBaseline, Context2D} from "./Context2D"
import Color from "../util/Color"
import Vec2 from "../util/Vec2"
import {Font} from "../util/Font"
import TransformMatrix from "../util/TransformMatrix"
import {Image} from "./Image"
import {Gradient} from "./Gradient"

class EventListEntry {
	constructor(public upper: number, public callback: ()=>void) {}
};

export class InteractiveContext2D extends Context2D {

	private eventList: Array<EventListEntry> = new Array<EventListEntry>();
	private topEvent: number = 0xFFFFFF;
	private eventCount: number = 0;

	constructor(public drawCtx: Context2D, public eventCtx: Context2D) {
		super();
		this.updateEventColor();
	}

	private updateEventColor() {
		let col = Color.fromInt24(this.topEvent);
		this.eventCtx.fillColor(col).strokeColor(col);
	}

	bindClick(callback: ()=>void): this {
		this.eventList[this.eventCount++] = new EventListEntry(this.topEvent, callback);
		this.topEvent = this.eventCount-1;
		this.updateEventColor();

		return this;
	}

	popClick(): this {
		this.topEvent = this.eventList[this.topEvent].upper;
		this.updateEventColor();

		return this;
	}

	reset(): this {
		this.eventCount = 0;
		this.topEvent = 0xFFFFFF;

		this.drawCtx.reset();
		this.updateEventColor();
		this.eventCtx.resetTransform().drawRect(0, 0, this.width(), this.height(), true, false);
		return this;
	}

	click(x: number, y: number): this {
		let index = this.eventCtx.getPixel(x, y).toInt24();

		while (index >= 0 && index < this.eventCount) {
			this.eventList[index].callback();
			index = this.eventList[index].upper;
		}
		return this;
	}


	width(): number {
		return this.drawCtx.width();
	}
	height(): number {
		return this.drawCtx.height();
	}

	getPixel(x: number, y: number): Color {
		return this.drawCtx.getPixel(x, y);
	}

	clearRect(x: number, y: number, width: number, height: number): this {
		this.drawCtx.clearRect(x, y, width, height);
		this.eventCtx.drawRect(x, y, width, height, true, false);
		return this;
	}

	drawRect(x: number, y: number, width: number, height: number, fill: boolean, stroke: boolean): this {
		this.drawCtx.drawRect(x, y, width, height, fill, stroke);
		this.eventCtx.drawRect(x, y, width, height, fill, stroke);
		return this;
	}
	drawPath(fill: boolean, stroke: boolean): this {
		this.drawCtx.drawPath(fill, stroke);
		this.eventCtx.drawPath(fill, stroke);
		return this;
	}
	drawText(x: number, y: number, text: string, baseline: string, fill: boolean, stroke: boolean): this {
		this.drawCtx.drawText(x, y, text, baseline, fill, stroke);
		this.eventCtx.drawText(x, y, text, baseline, fill, stroke);
		return this;
	}

	drawImage(img: Image, x: number, y: number): this;
	drawImage(img: Image, x: number, y: number, width: number, height: number): this;
	drawImage(img: Image, x: number, y: number, width: number, height: number,
		sx: number, sy: number, sourceWidth: number, sourceHeight: number): this;
	drawImage(img: Image, x: number, y: number, width?: number, height?: number,
		sx?: number, sy?: number, sourceWidth?: number, sourceHeight?: number): this {

		this.drawCtx.drawImage(img, x, y, width, height, sx, sy, sourceWidth, sourceHeight);

		if (!width) {
			width = img.width();
		}
		if (!height) {
			height = img.height();
		}
		this.eventCtx.drawRect(x, y, width, height, true, false);
		return this;
	}

	beginPath(startX?: number, startY?: number): this {
		this.drawCtx.beginPath(startX, startY);
		this.eventCtx.beginPath(startX, startY);
		return this;
	}
	closePath(): this {
		this.drawCtx.closePath();
		this.eventCtx.closePath();
		return this;
	}
	movePath(startX: number, startY: number): this {
		this.drawCtx.movePath(startX, startY);
		this.eventCtx.movePath(startX, startY);
		return this;
	}

	pathLine(endX: number, endY: number): this {
		this.drawCtx.pathLine(endX, endY);
		this.eventCtx.pathLine(endX, endY);
		return this;
	}
	pathBezier(cp1X: number, cp1Y: number, cp2X: number, cp2Y: number, endX: number, endY: number): this {
		this.drawCtx.pathBezier(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
		this.eventCtx.pathBezier(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
		return this;
	}
	pathQuadratic(cpX: number, cpY: number, endX: number, endY: number): this {
		this.drawCtx.pathQuadratic(cpX, cpY, endX, endY);
		this.eventCtx.pathQuadratic(cpX, cpY, endX, endY);
		return this;
	}
	pathArc(centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number, antiClockwise: boolean = false): this {
		this.drawCtx.pathArc(centerX, centerY, radius, startAngle, endAngle, antiClockwise);
		this.eventCtx.pathArc(centerX, centerY, radius, startAngle, endAngle, antiClockwise);
		return this;
	}
	pathArcByControlPoints(x1: number, y1: number, x2: number, y2: number, radius: number): this {
		this.drawCtx.pathArcByControlPoints(x1, y1, x2, y2, radius);
		this.eventCtx.pathArcByControlPoints(x1, y1, x2, y2, radius);
		return this;
	}

	lineWidth(): number;
	lineWidth(val: number): this;
	lineWidth(val?: number): any {
		if (val) {
			this.drawCtx.lineWidth(val);
			this.eventCtx.lineWidth(val);
			return this;
		}
		return this.drawCtx.lineWidth();
	}

	lineCap(): LineCap;
	lineCap(val: LineCap): this;
	lineCap(val?: LineCap): any {
		if (val) {
			this.drawCtx.lineCap(val);
			this.eventCtx.lineCap(val);
			return this;
		}
		return this.drawCtx.lineCap();
	}

	lineJoin(): LineJoin;
	lineJoin(val: LineJoin): this;
	lineJoin(val?: LineJoin): any {
		if (val) {
			this.drawCtx.lineJoin(val);
			this.eventCtx.lineJoin(val);
			return this;
		}
		return this.drawCtx.lineJoin();
	}

	fillColor(): Color;
	fillColor(val: Color): this;
	fillColor(val?: Color): any {
		if (val) {
			this.drawCtx.fillColor(val);
			return this;
		}
		return this.drawCtx.fillColor();
	}

	strokeColor(): Color;
	strokeColor(val: Color): this;
	strokeColor(val?: Color): any {
		if (val) {
			this.drawCtx.strokeColor(val);
			return this;
		}
		return this.drawCtx.strokeColor();
	}

	fillGradient(val: Gradient): this {
		this.drawCtx.fillGradient(val);
		return this;
	}
	strokeGradient(val: Gradient): this {
		this.drawCtx.strokeGradient(val);
		return this;
	}

	shadowBlur(): number;
	shadowBlur(val: number): this;
	shadowBlur(val?: number): any {
		if (val) {
			this.drawCtx.shadowBlur(val);
			return this;
		}
		return this.drawCtx.shadowBlur();
	}

	shadowColor(): Color;
	shadowColor(val: Color): this;
	shadowColor(val?: Color): any {
		if (val) {
			this.drawCtx.shadowColor(val);
			return this;
		}
		return this.drawCtx.shadowColor();
	}

	shadowOffset(): Vec2;
	shadowOffset(x: number, y: number): this;
	shadowOffset(x?: number, y?: number): any {
		if (x && y) {
			this.drawCtx.shadowOffset(x, y);
			return this;
		}
		return this.drawCtx.shadowOffset();
	}

	font(): Font;
	font(val: Font): this;
	font(val?: Font): any {
		if (val) {
			this.drawCtx.font(val);
			this.eventCtx.font(val);
			return this;
		}
		return this.drawCtx.font();
	}

	alpha(): number;
	alpha(val: number): this;
	alpha(val?: number): any {
		if (val) {
			this.drawCtx.alpha(val);
			return this;
		}
		return this.drawCtx.alpha();
	}

	transformMatrix(): TransformMatrix;
	transformMatrix(val: TransformMatrix): this;
	transformMatrix(val?: TransformMatrix): this|TransformMatrix {
		if (val) {
			this.drawCtx.transformMatrix(val);
			this.eventCtx.transformMatrix(val);
			return this;
		}
		return this.drawCtx.transformMatrix();
	}

	transform(val: TransformMatrix): this {
		this.drawCtx.transform(val);
		this.eventCtx.transform(val);
		return this;
	}

	save(): this {
		this.drawCtx.save();
		this.eventCtx.save();
		return this;
	}

	restore(): this {
		this.drawCtx.restore();
		this.eventCtx.restore();
		return this;
	}
}
