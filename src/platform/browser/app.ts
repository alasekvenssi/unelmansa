import {Scene} from "../../core/Scene"
import {Ground, Air} from "../../core/Entity"
import {Creature, CreatureBone, CreatureMuscle} from "../../core/Creature"
import CanvasWindow from "../../graphics/browser/CanvasWindow"
import Renderer from "../../graphics/Renderer"
import {RenderTransform} from "../../graphics/Renderable"
import TransformMatrix from "../../util/TransformMatrix"
import Vec2 from "../../util/Vec2"
import Color from "../../util/Color"
import WebImage from "../../graphics/browser/WebImage"


let stefans = [new Creature(), new Creature()];

for(let i: number = 0; i < 2; ++i) {
	stefans[i].bones.push(new CreatureBone(new Vec2(-100-i*800, 780+500), 40, 1, 0.5, 0.5));
	stefans[i].bones.push(new CreatureBone(new Vec2(170-i*800, 950+500), 40, 1, 0.5, 0.5));
	stefans[i].bones.push(new CreatureBone(new Vec2(400-i*800, 710+500), 40, 1, 0.5, 0.5));
	stefans[i].bones.push(new CreatureBone(new Vec2(350-i*800, 1090+500), 40, 1, 0.5, 0.5));

	stefans[i].muscles.push(new CreatureMuscle(stefans[i].bones[0], stefans[i].bones[1], 500, 500, 10));
	stefans[i].muscles.push(new CreatureMuscle(stefans[i].bones[1], stefans[i].bones[2], 500, 500, 100));
	stefans[i].muscles.push(new CreatureMuscle(stefans[i].bones[2], stefans[i].bones[0], 500, 500, 10));
	stefans[i].muscles.push(new CreatureMuscle(stefans[i].bones[1], stefans[i].bones[3], 50, 50, 10));
	stefans[i].muscles.push(new CreatureMuscle(stefans[i].bones[2], stefans[i].bones[3], 110, 110, 5));
	stefans[i].muscles.push(new CreatureMuscle(stefans[i].bones[0], stefans[i].bones[3], 200, 200, 10));
}

let scene = new Scene();
scene.addEntity(new Air(new WebImage("sky.png")));
scene.addEntity(new Ground(new WebImage("ground.jpg")));
scene.addEntity(stefans[0]);
setTimeout(
	() => {
		scene.addEntity(stefans[1]);
	}, 7000
);

let camera = new RenderTransform(TransformMatrix.translate(500, 600), scene);

let view = new CanvasWindow(window, 2);
let renderer = new Renderer(view.context, camera, 1, true);

renderer.start();

let center = stefans[0].center();

setInterval(
	() => {
		scene.update(1/60);
		camera.transform = TransformMatrix.translate(view.width()/2-center.x, view.height() - 150);
	}, 1000/60
);

for(let i: number = 0; i < 64; ++i) {
	setTimeout(
		() => {
			scene.addEntity(
				new CreatureBone(
					new Vec2(
						-500+Math.random()*1700,
						1500+Math.random()*200
					),
					20+Math.random()*5,
					0.2,
					0.5,
					0.5
				)
			);
		}, 2000+50*i
	);
}