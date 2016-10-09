import {Context2D} from "./Context2D"
import {Renderable} from "./Renderable"
import Color from "../util/Color"
import {Font} from "../util/Font"
import * as Arrays from "../util/Arrays"

export default class Renderer {
	private frameRequestID: number;
	private fpsCounter = new FpsCounter(10);

	constructor(public context: Context2D, public item: Renderable, public scale: number = 1, public drawFps: boolean = false) {}

	protected renderLoop() {
		this.context.reset().scale(this.scale, this.scale);

		if (this.item) {
			this.context.save();
			this.item.render(this.context);
			this.context.restore();
		}

		this.fpsCounter.countTick();
		if (this.drawFps) {
			this.context.fillColor(Color.Black).font(new Font("Courier New", 20));
			this.context.drawText(10, 10, this.averageFps() + " fps", "hanging", true, false);
		}

		this.start(); // request next frame
	}

	start() {
		this.frameRequestID = requestAnimationFrame(() => this.renderLoop());
	}
	stop() {
		cancelAnimationFrame(this.frameRequestID);
	}

	averageFps(): number {
		return this.fpsCounter.fps();
	}
}

class FpsCounter {
	private times: number[];
	private pos = 0;
	private sum = 0;
	private lastTime = Date.now();

	constructor(samples: number) {
		this.times = Arrays.fillArray(new Array<number>(samples), 0, samples, 0);
	}

	countTick() {
		let now = Date.now();
		let diff = now - this.lastTime;
		this.lastTime = now;

		this.sum += diff - this.times[this.pos];
		this.times[this.pos] = diff;
		this.pos = (this.pos + 1) % this.times.length;
	}

	fps(): number {
		return Math.round(this.times.length*1000 / this.sum);
	}
}
