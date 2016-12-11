import TransformMatrix from "../../util/TransformMatrix"
import Vec2 from "../../util/Vec2"
import { Context2D } from "../Context2D"

export function alignTranslate(ctx: Context2D, x: number, y: number, width: number, height: number): Vec2 {
	if (width < 0) {
		width += ctx.width();
	}
	if (height < 0) {
		height += ctx.height();
	}
	if (x < 0) {
		x += ctx.width() - width;
	}
	if (y < 0) {
		y += ctx.height() - height;
	}
	ctx.translate(x, y);
	return new Vec2(width, height);
}
