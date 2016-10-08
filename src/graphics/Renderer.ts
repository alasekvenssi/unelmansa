import {Context2D} from "./Context2D"
import {Renderable} from "./Renderable"
import Color from "../util/Color"
import {Font} from "../util/Font"

const FPS_SAMPLES = 10;

export default class Renderer {
	private fpsCounter: Array<number>;
	private fpsCounterPos = 0;
	private fpsCounterSum = 0;
	private lastTime = Date.now();

	constructor(public context: Context2D, public item: Renderable, public scale: number = 1, public drawFps: boolean = false) {
		this.fpsCounter = new Array<number>(4);
		for (let i = 0; i < FPS_SAMPLES; i++) { this.fpsCounter[i] = 0; }

		requestAnimationFrame(() => this.renderLoop());
	}

	protected renderLoop() {
		this.context.reset().scale(this.scale, this.scale);
		this.item.render(this.context);

		let now = Date.now();
		let diff = now - this.lastTime;
		this.lastTime = now;

		this.fpsCounterSum += diff - this.fpsCounter[this.fpsCounterPos];
		this.fpsCounter[this.fpsCounterPos] = diff;
		this.fpsCounterPos = (this.fpsCounterPos + 1) % FPS_SAMPLES;

		if (this.drawFps) {
			this.context.resetTransform().scale(this.scale, this.scale).alpha(1).fillColor(Color.Black).font(new Font("Courier New", 20));
			this.context.drawText(10, 10, `${this.averageFps()} fps`, "hanging", true, false);
		}

		requestAnimationFrame(() => this.renderLoop());
	}

	averageFps(): number {
		return Math.round(FPS_SAMPLES*1000 / this.fpsCounterSum);
	}
}
