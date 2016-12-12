import { EventType } from "../Context2D"
import CanvasContext2D from "./CanvasContext2D"
import { InteractiveContext2D } from "../InteractiveContext2D"

function makeFullCanvas(wnd: Window, zIndex: string = "10"): HTMLCanvasElement {
	let canvas = wnd.document.createElement("canvas");
	wnd.document.body.appendChild(canvas);

	canvas.style.position = "fixed";
	canvas.style.left = "0px";
	canvas.style.top = "0px";
	canvas.style.width = "100%";
	canvas.style.height = "100%";
	canvas.style.zIndex = zIndex;
	return canvas;
}

export class CanvasWindow {
	public canvas: HTMLCanvasElement;
	public context: CanvasContext2D;

	constructor(public hostWindow: Window = window, protected resolution: number = 1) {
		this.canvas = makeFullCanvas(this.hostWindow);

		this.hostWindow.addEventListener("resize", () => this.onResize());
		this.onResize();

		this.context = new CanvasContext2D(this.canvas.getContext("2d"));
	}

	protected onResize() {
		this.canvas.width = this.hostWindow.innerWidth * this.resolution;
		this.canvas.height = this.hostWindow.innerHeight * this.resolution;
	}

	width(): number { return this.canvas.width; }
	height(): number { return this.canvas.height; }
}

export class InteractiveCanvasWindow {
	public drawCanvas: HTMLCanvasElement;
	public eventCanvas: HTMLCanvasElement;
	public context: InteractiveContext2D;

	constructor(public hostWindow: Window = window, protected resolution: number = 1, debugClickmap: boolean = false) {
		if (debugClickmap) {
			this.drawCanvas = hostWindow.document.createElement("canvas");
			this.eventCanvas = makeFullCanvas(this.hostWindow, "10");
		} else {
			this.eventCanvas = hostWindow.document.createElement("canvas");
			this.drawCanvas = makeFullCanvas(this.hostWindow, "10");
		}

		this.hostWindow.addEventListener("resize", () => this.onResize());
		this.hostWindow.addEventListener("click", (evt) => this.onClick(evt));
		this.onResize();

		this.context = new InteractiveContext2D(
			new CanvasContext2D(this.drawCanvas.getContext("2d")),
			new CanvasContext2D(this.eventCanvas.getContext("2d"))
		);
	}

	protected onResize() {
		this.drawCanvas.width = this.eventCanvas.width = this.hostWindow.innerWidth * this.resolution;
		this.drawCanvas.height = this.eventCanvas.height = this.hostWindow.innerHeight * this.resolution;
	}

	protected onClick(evt: any) {
		this.callEvent(EventType.Click, evt.clientX, evt.clientY);
	}

	protected callEvent(type: EventType, x: number, y: number, data?: any) {
		this.context.callEvent(type, x * this.resolution, y * this.resolution, data);
	}

	width(): number { return this.drawCanvas.width; }
	height(): number { return this.drawCanvas.height; }
}
