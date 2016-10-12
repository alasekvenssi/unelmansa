import {Scene} from "../../core/Scene"
import {Ground} from "../../core/Entity"
import {Creature, CreatureBone, CreatureMuscle} from "../../core/Creature"
import CanvasWindow from "../../graphics/browser/CanvasWindow"
import Renderer from "../../graphics/Renderer"
import {RenderTransform} from "../../graphics/Renderable"
import TransformMatrix from "../../util/TransformMatrix"
import Vec2 from "../../util/Vec2"


let stefan = new Creature();

stefan.bones.push(new CreatureBone(new Vec2(0, 250), 20));
stefan.bones.push(new CreatureBone(new Vec2(170, 420), 20));
stefan.bones.push(new CreatureBone(new Vec2(300, 180), 20, 1, 0.75, 0.5));
stefan.bones.push(new CreatureBone(new Vec2(350, 390), 20));

stefan.muscles.push(new CreatureMuscle(stefan.bones[0], stefan.bones[1], 50, 100));
stefan.muscles.push(new CreatureMuscle(stefan.bones[1], stefan.bones[2], 50, 100));
stefan.muscles.push(new CreatureMuscle(stefan.bones[2], stefan.bones[0], 50, 100));
stefan.muscles.push(new CreatureMuscle(stefan.bones[1], stefan.bones[3], 50, 100));
stefan.muscles.push(new CreatureMuscle(stefan.bones[2], stefan.bones[3], 50, 100));


let scene = new Scene();
scene.addEntity(new Ground());
scene.addEntity(stefan);

let camera = new RenderTransform(TransformMatrix.translate(500, 600), scene);

let view = new CanvasWindow(window, 2);
let renderer = new Renderer(view.context, camera, 2, true);

renderer.start();

setInterval(
	() => {
		scene.update(1/120);
	}, 1000/120
);