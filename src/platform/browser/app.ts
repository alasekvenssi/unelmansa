import {Scene} from "../../core/Scene"
import {Ground, Air} from "../../core/Entity"
import {Creature, CreatureBone, CreatureMuscle} from "../../core/Creature"
import CanvasWindow from "../../graphics/browser/CanvasWindow"
import Renderer from "../../graphics/Renderer"
import {RenderTransform} from "../../graphics/Renderable"
import TransformMatrix from "../../util/TransformMatrix"
import Vec2 from "../../util/Vec2"


let stefan = new Creature();

stefan.bones.push(new CreatureBone(new Vec2(-100, 780), 20, 1, 0.25, 1));
stefan.bones.push(new CreatureBone(new Vec2(170, 950), 20, 1, 0.25, 1));
stefan.bones.push(new CreatureBone(new Vec2(400, 710), 20, 1, 0.25, 1));
stefan.bones.push(new CreatureBone(new Vec2(350, 1090), 20));

stefan.muscles.push(new CreatureMuscle(stefan.bones[0], stefan.bones[1], 500, 500, 10));
stefan.muscles.push(new CreatureMuscle(stefan.bones[1], stefan.bones[2], 500, 500, 100));
stefan.muscles.push(new CreatureMuscle(stefan.bones[2], stefan.bones[0], 500, 500, 10));
stefan.muscles.push(new CreatureMuscle(stefan.bones[1], stefan.bones[3], 50, 50, 10));
stefan.muscles.push(new CreatureMuscle(stefan.bones[2], stefan.bones[3], 110, 110, 5));
stefan.muscles.push(new CreatureMuscle(stefan.bones[0], stefan.bones[3], 200, 200, 10));

let scene = new Scene();
scene.addEntity(new Ground());
scene.addEntity(new Air());
scene.addEntity(stefan);

let camera = new RenderTransform(TransformMatrix.translate(500, 600), scene);

let view = new CanvasWindow(window, 2);
let renderer = new Renderer(view.context, camera, 1, true);

renderer.start();

setInterval(
	() => {
		scene.update(1/60);

		let pos = stefan.center();
		camera.transform = TransformMatrix.translate(view.width()/2-pos.x, view.height() - 150);
	}, 1000/60
);