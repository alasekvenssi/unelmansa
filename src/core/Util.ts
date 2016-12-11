import { Air, Ground } from "./Entity"
import { Image } from "../graphics/Image"
import { Creature } from "./Creature"
import { Scene } from "./Scene"

let SkyImage: Image;
let GroundImage: Image;

export function setResources(skyImage: Image, groundImage: Image) {
	SkyImage = skyImage;
	GroundImage = groundImage;
}

export function creatureScene(creature?: Creature): Scene {
	let scene = new Scene();
	scene.addEntity(new Air(SkyImage));
	scene.addEntity(new Ground(GroundImage));
	if (creature) {
		scene.addEntity(creature);
	}
	return scene;
}
