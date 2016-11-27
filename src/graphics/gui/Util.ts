import TransformMatrix from "../../util/TransformMatrix"
import {Context2D} from "../Context2D"

export function alignTranslate(ctx: Context2D, x: number, y: number, width: number, height: number) {
	if (x < 0) {
		x += ctx.width() - width;
	}
	if (y < 0) {
		y += ctx.height() - height;
	}
	ctx.translate(x, y);
}
