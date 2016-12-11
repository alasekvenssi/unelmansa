import { Renderable } from "../graphics/Renderable"

export interface View extends Renderable {
	onShow(): void;
	onHide(): void;
}
