import {Renderable} from "../Renderable"
import {Context2D, TextBaseline} from "../Context2D"
import Color from "../../util/Color"
import {Font} from "../../util/Font"
import * as GuiUtil from "./Util"

export default class Text implements Renderable {
	constructor(
		public text: string,
		public x: number,
		public y: number,
		public baseline: TextBaseline,
		public font: Font = new Font("Arial", 60),
		public fill: Color = Color.White,
		public stroke: Color = Color.Black
	) {}

	render(ctx: Context2D) {
		ctx.save();

		GuiUtil.alignTranslate(ctx, this.x, this.y, 0, 0);

		ctx.fillColor(this.fill).strokeColor(this.stroke).lineWidth(2).font(this.font);
		ctx.drawText(0, 0, this.text, this.baseline, true, true);

		ctx.restore();
	}
}
