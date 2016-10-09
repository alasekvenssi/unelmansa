import {Context2D} from "./Context2D"
import TransformMatrix from "../util/TransformMatrix"

export interface Renderable {
	render(context: Context2D): void;
}

export class RenderTransform implements Renderable {
	constructor(public transform: TransformMatrix, public item: Renderable) {}

	render(ctx: Context2D) {
		ctx.save();
		ctx.transform(this.transform);
		this.item.render(ctx);
		ctx.restore();
	}
}

export class RenderGroup implements Renderable {
	items = new Array<Renderable>();

	render(ctx: Context2D) {
		for (let item of this.items) {
			item.render(ctx);
		}
	}
}
