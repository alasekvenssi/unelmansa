import {Context2D} from "../../graphics/Context2D"
import CanvasWindow from "../../graphics/browser/CanvasWindow"
import CanvasContext2D from "../../graphics/browser/CanvasContext2D"
import WebImage from "../../graphics/browser/WebImage"
import Color from "../../util/Color"
import {Font} from "../../util/Font"
import TransformMatrix from "../../util/TransformMatrix"
import Renderer from "../../graphics/Renderer"
import {Renderable, RenderGroup, RenderTransform} from "../../graphics/Renderable"

let img = new WebImage("test.jpg");

class TestRect implements Renderable {
	render(ctx: Context2D) {
		ctx.fillColor(Color.Yellow).strokeColor(Color.Black).lineWidth(1);
		ctx.alpha(0.95).drawRect(0, 0, 100, 100, true, true).alpha(0.5).drawImage(img, 0, 0, 100, 100);
	}
};

let rotation = new TransformMatrix();
let group = new RenderGroup();

for (let x = -1; x <= 20; x++) {
	for (let y = -1; y <= 20; y++) {
		group.items[group.items.length] = new RenderTransform(TransformMatrix.translate(100*x, 100*y),
			new RenderTransform(rotation, new TestRect()));
	}
}

let view = new CanvasWindow(window, 2);
new Renderer(view.context, group, 2, true).start();

setInterval(() => {
	let matrix = rotation.mul(TransformMatrix.rotate((Math.PI / 360)*2));
	for (let y = 0; y < 2; y++) {
		for (let x = 0; x < 3; x++) {
			rotation[y][x] = matrix[y][x];
		}
	}
}, 20);
