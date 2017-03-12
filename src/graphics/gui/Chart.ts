import { Renderable } from "../Renderable"
import { Context2D, EventType } from "../Context2D"
import Color from "../../util/Color"
import { Font } from "../../util/Font"
import * as GuiUtil from "./Util"
import Vec2 from "../../util/Vec2"

export default class Chart implements Renderable {
	constructor(
		// public text: string,
		// public callback: () => void,
		public x: number,
		public y: number,
		public width: number = 200,
		public height: number = 200,
		public font: Font = new Font("Arial", 25),
		public fill: Color = new Color(0xff, 0xff, 0xff),
		public stroke: Color = new Color(0x00, 0x00, 0x00),
		public fillOver: Color = new Color(0x3c, 0xa0, 0xe6),
		public strokeOver: Color = new Color(0x29, 0x80, 0xb9),
		public fillDown: Color = new Color(0x29, 0x80, 0xb9),
		public strokeDown: Color = new Color(0x34, 0x98, 0xdb),
	) { 
		this.addPoint(0,0);
		// this.addPoint(1,10);
		// this.addPoint(2,-20);
		// this.addPoint(3,30);
		// this.addPoint(4,50);
	}

	private over: boolean;
	private down: boolean;

	private minX: number = 0;
	private maxX: number = 1;
	private minY: number = -100;
	private maxY: number = 100;

	private points: Vec2[] = new Array<Vec2>();

	addPoint(x: number, y: number) {
		this.minX = Math.min(this.minX, x);
		this.maxX = Math.max(this.maxX, x + 10);
		this.minY = Math.min(this.minY, y - 10);
		this.maxY = Math.max(this.maxY, y + 100);
		this.points.push(new Vec2(x,y));	
	}

	getRealPointCoords(x: number, y: number, bounds: Vec2): Vec2 {
		(y - this.maxY) * (bounds.y)/(this.maxY - this.minY)
		return new Vec2(bounds.y - (x - this.maxX) * (bounds.x) / (this.minX - this.maxX), (y - this.maxY) * (bounds.y) / (this.minY - this.maxY));
	}

	drawLine(ctx: Context2D, lhs: Vec2, rhs: Vec2, bounds: Vec2) {
		let pointa: Vec2 = this.getRealPointCoords(lhs.x, lhs.y, bounds);
		let pointb: Vec2 = this.getRealPointCoords(rhs.x, rhs.y, bounds);
		ctx.drawLine(pointa.x, pointa.y, pointb.x, pointb.y, true, true);
	}

	render(ctx: Context2D) {
		ctx.save();
		// if (this.callback) {
		// 	ctx.bindEvent(EventType.Click, this.callback);
		// }
		
		// ctx.bindEvent(EventType.MouseDown, () => this.down = true);
		// ctx.bindEvent(EventType.MouseUp, () => this.down = false);
		// ctx.bindEvent(EventType.MouseEnter, () => this.over = true);
		// ctx.bindEvent(EventType.MouseLeave, () => this.over = this.down = false);

		// if (this.down) {
		// 	ctx.fillColor(this.fillDown).strokeColor(this.strokeDown);
		// } else if (this.over) {
		// 	ctx.fillColor(this.fillOver).strokeColor(this.strokeOver);
		// } else {
		// 	ctx.fillColor(this.fill).strokeColor(this.stroke);
		// }

		let bounds = GuiUtil.alignTranslate(ctx, this.x, this.y, this.width, this.height);
		ctx.fillColor(this.fill).strokeColor(this.stroke)
		ctx.lineWidth(2);
		ctx.drawRect(0, 0, bounds.x, bounds.y, true, true);
		


		//Draw X line
		ctx.fillColor(new Color(0xff, 0x00, 0x00)).strokeColor(new Color(0xff, 0x00, 0x00))
		this.drawLine(ctx, new Vec2(this.minX, 0), new Vec2(this.maxX, 0), bounds);

		ctx.fillColor(new Color(0x00, 0x00, 0x00)).strokeColor(new Color(0x00, 0x00, 0x00))
		let equation = (x: number) => x**(2);
        	console.log(this.points.length);
        for(let x = 1; x < this.points.length; x += 1) {
	        this.drawLine(ctx, this.points[x-1], this.points[x], bounds);
        }

		ctx.fillColor(Color.White).strokeColor(Color.Black).font(this.font);
		// ctx.drawText(15, bounds.y / 2, this.text, "middle", true, false);

		ctx.restore();
	}
}
