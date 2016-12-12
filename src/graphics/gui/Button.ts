import { Renderable } from "../Renderable"
import { Context2D, EventType } from "../Context2D"
import Color from "../../util/Color"
import { Font } from "../../util/Font"
import * as GuiUtil from "./Util"

export default class Button implements Renderable {
	constructor(
		public text: string,
		public callback: () => void,
		public x: number,
		public y: number,
		public width: number = 100,
		public height: number = 25,
		public font: Font = new Font("Arial", 25),
		public fill: Color = new Color(0x34, 0x98, 0xdb),
		public stroke: Color = new Color(0x29, 0x80, 0xb9),
		public fillOver: Color = new Color(0x3c, 0xa0, 0xe6),
		public strokeOver: Color = new Color(0x29, 0x80, 0xb9),
		public fillDown: Color = new Color(0x29, 0x80, 0xb9),
		public strokeDown: Color = new Color(0x34, 0x98, 0xdb)
	) { }

	private over: boolean;
	private down: boolean;

	render(ctx: Context2D) {
		ctx.save();
		if (this.callback) {
			ctx.bindEvent(EventType.Click, this.callback);
			ctx.bindEvent(EventType.MouseDown, () => this.down = true);
			ctx.bindEvent(EventType.MouseUp, () => this.down = false);
			ctx.bindEvent(EventType.MouseEnter, () => this.over = true);
			ctx.bindEvent(EventType.MouseLeave, () => this.over = this.down = false);
		}

		if (this.down) {
			ctx.fillColor(this.fillDown).strokeColor(this.strokeDown);
		} else if (this.over) {
			ctx.fillColor(this.fillOver).strokeColor(this.strokeOver);
		} else {
			ctx.fillColor(this.fill).strokeColor(this.stroke);
		}

		let bounds = GuiUtil.alignTranslate(ctx, this.x, this.y, this.width, this.height);

		ctx.lineWidth(2);
		ctx.drawRect(0, 0, bounds.x, bounds.y, true, true);

		ctx.fillColor(Color.White).strokeColor(Color.Black).font(this.font);
		ctx.drawText(15, bounds.y / 2, this.text, "middle", true, false);

		ctx.restore();
	}
}
