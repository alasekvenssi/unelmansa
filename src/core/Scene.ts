import {Renderable} from "../graphics/Renderable"
import {Entity} from "./Entity"
import {Simulable} from "../physics/Interface"
import {Context2D} from "../graphics/Context2D"
import * as Arrays from "../util/Arrays"

export class Scene implements Renderable {
	entities: Entity[] = new Array<Entity>();
	physical: Simulable[] = new Array<Simulable>();

	addEntity(entity: Entity) {
		this.entities.push(entity);
		entity.forEachSimulable((obj: Simulable) => this.addSimulable(obj));
	}
	removeEntity(entity: Entity) {
		Arrays.remove(this.entities, entity);
		entity.forEachSimulable((obj: Simulable) => this.removeSimulable(obj));
	}

	private addSimulable(object: Simulable) {
		this.physical.push(object);
	}
	private removeSimulable(object: Simulable) {
		Arrays.remove(this.physical, object);
	}

	update(timeDelta: number) {
		for (let entity of this.entities) {
			entity.update(timeDelta);
		}
		// Simulate();
	}

	render(context: Context2D) {
		context.save().scale(1, -1); // flip Y coordinate
		for (let entity of this.entities) {
			entity.render(context);
		}
		context.restore();
	}
}
