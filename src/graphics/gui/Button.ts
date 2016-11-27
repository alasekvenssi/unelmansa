import {Renderable} from "../Renderable"
import {Context2D} from "../Context2D"
import Color from "../../util/Color"
import {Font} from "../../util/Font"
import * as GuiUtil from "./Util"

export default class Button implements Renderable {
	constructor(
		public text: string,
		public callback: ()=>void,
		public x: number,
		public y: number,
		public width: number = 200,
		public height: number = 50,
		public font: Font = new Font("Arial", 50),
		public fill: Color = new Color(0x34, 0x98, 0xdb),
		public stroke: Color = new Color(0x29, 0x80, 0xb9)
	) {}

	render(ctx: Context2D) {
		ctx.save();
		if (this.callback) {
			ctx.bindClick(this.callback);
		}

		GuiUtil.alignTranslate(ctx, this.x, this.y, this.width, this.height);

		ctx.fillColor(this.fill).strokeColor(this.stroke).lineWidth(2);
		ctx.drawRect(0, 0, this.width, this.height, true, true);

		ctx.fillColor(Color.White).strokeColor(Color.Black).font(this.font);
		ctx.drawText(30, this.height/2, this.text, "middle", true, true);

		if (this.callback) {
			ctx.popClick();
		}
		ctx.restore();
	}
}
