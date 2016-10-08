import {Context2D} from "./Context2D"

export interface Renderable {
	render(context: Context2D): void;
}
