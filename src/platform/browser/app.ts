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

let stefan = new Creature();

stefan.bones.push(new CreatureBone(new Vec2(-100, 780), 40, 2, 0.5, 0.5));
stefan.bones.push(new CreatureBone(new Vec2(170, 950), 40, 1, 0.5, 0.5));
stefan.bones.push(new CreatureBone(new Vec2(400, 710), 40, 1, 0.5, 0.5));
stefan.bones.push(new CreatureBone(new Vec2(350, 1090), 40, 1, 0.5, 0.5));

stefan.muscles.push(new CreatureMuscle(stefan.bones[0], stefan.bones[1], 500, 800, 15));
stefan.muscles.push(new CreatureMuscle(stefan.bones[1], stefan.bones[2], 500, 600, 100));
stefan.muscles.push(new CreatureMuscle(stefan.bones[2], stefan.bones[0], 500, 900, 15));
stefan.muscles.push(new CreatureMuscle(stefan.bones[1], stefan.bones[3], 50, 75, 10));
stefan.muscles.push(new CreatureMuscle(stefan.bones[2], stefan.bones[3], 110, 110, 5));
stefan.muscles.push(new CreatureMuscle(stefan.bones[0], stefan.bones[3], 200, 400, 25));


let scene = new Scene();

scene.addEntity(new Air(new WebImage("sky.png")));
scene.addEntity(new Ground(new WebImage("ground.jpg")));
scene.addEntity(stefan);

let camera = new RenderTransform(TransformMatrix.translate(500, 600), scene);
let view = new CanvasWindow(window, 2);
let renderer = new Renderer(view.context, camera, 1, true);

renderer.start();

let center = stefan.center();

setInterval(
	() => {
		scene.update(1/60);
		camera.transform = TransformMatrix.translate(view.width()/2-center.x, view.height() - 150);
	}, 1000/60
);