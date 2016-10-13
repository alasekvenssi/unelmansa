import CanvasContext2D from "./CanvasContext2D"

export default class CanvasWindow {
	public canvas: HTMLCanvasElement;
	public context: CanvasContext2D;

	constructor(public hostWindow: Window = window, protected resolution: number = 1) {
		this.canvas = hostWindow.document.createElement("canvas");
		this.hostWindow.document.body.appendChild(this.canvas);

		this.canvas.style.position = "fixed";
		this.canvas.style.left = "0px";
		this.canvas.style.top = "0px";
		this.canvas.style.width = "100%";
		this.canvas.style.height = "100%";

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
