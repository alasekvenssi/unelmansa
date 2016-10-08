import {Context2D} from "../../graphics/Context2D"
import CanvasWindow from "../../graphics/browser/CanvasWindow"
import CanvasContext2D from "../../graphics/browser/CanvasContext2D"
import Color from "../../util/Color"

let view = new CanvasWindow(window, 2);
let ctx = view.context;

let angle = 0;
let lastTime = Date.now();
setInterval(() => { angle += (Math.PI / 360)*2; }, 20);

function draw() {
	ctx.reset().fillColor(Color.Yellow).strokeColor(Color.Black).lineWidth(3).alpha(0.95);

	for (let x = 0; x <= 25; x++) {
		for (let y = 0; y <= 25; y++) {
			ctx.resetTransform().translate(200*x, 200*y).rotate(angle*(((x+y)%2)*2-1)).drawRect(0, 0, 200, 200, true, true);
		}
	}
	requestAnimationFrame(draw);

	let now = Date.now();
	document.title = `${Math.round(1000/(now-lastTime))} fps`;
	lastTime = now;
}
draw();
