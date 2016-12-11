import { RenderGroup, RenderTransform } from "../graphics/Renderable"
import Button from "../graphics/gui/Button"
import Text from "../graphics/gui/Text"
import { Context2D } from "../graphics/Context2D"
import TransformMatrix from "../util/TransformMatrix"
import { Font, FontWeight } from "../util/Font"
import { Scene } from "../core/Scene"
import { Air, Ground } from "../core/Entity"
import WebImage from "../graphics/browser/WebImage"
import { Creature } from "../core/Creature"
import { CreatureBone } from "../core/Creature"
import Population from "../core/Population"
import * as Consts from "../core/Consts"
import * as CoreUtil from "../core/Util"

export default class SimulationView extends RenderGroup {
	private skipCreatureBtn = new Button("Skip creature", () => this.nextCreature(), -475, -7, 175, 50);
	private skipPopulationBtn = new Button("Skip population", () => this.skipGenerations(1), -265, -7, 202, 50);
	private skip10PopulationsBtn = new Button("Skip 10 populations", () => this.skipGenerations(10), -7, -7, 250, 50);

	private populationTxt = new Text("", 15, -30, "middle", new Font("Arial", 30, "normal", FontWeight.Bold));
	private creatureTxt = new Text("", 225, -30, "middle", new Font("Arial", 30, "normal", FontWeight.Bold));
	private resultText = new Text("", 500, -30, "middle", new Font("Arial", 30, "normal", FontWeight.Bold));

	scene: Scene = CoreUtil.creatureScene();
	camera: RenderTransform;

	creatureId: number = 0;
	creatureClone: Creature;

	ticks: number = 0;
	speed: number = 1;

	constructor(public population: Population = new Population(Consts.POPULATION_SIZE)) {
		super();

		this.camera = new RenderTransform(new TransformMatrix(), this.scene);

		this.items.push(this.camera);
		this.items.push(this.skipPopulationBtn);
		this.items.push(this.skip10PopulationsBtn);
		this.items.push(this.skipCreatureBtn);
		this.items.push(this.populationTxt);
		this.items.push(this.creatureTxt);
		this.items.push(this.resultText);

		this.population.rate();

		this.creatureClone = this.population.population[this.creatureId].clone()
		this.scene.addEntity(this.creatureClone);

		setInterval(() => this.updateNext(), 1000 / 60);
	}

	render(ctx: Context2D) {
		let creature = this.creatureClone;
		this.camera.transform = TransformMatrix.translate(ctx.width() / 2 - creature.center().x, ctx.height() - 90);
		this.camera.transform = this.camera.transform.mul(TransformMatrix.scale(0.5, 0.5));

		this.populationTxt.text = "Generation: " + (this.population.generation + 1);
		this.creatureTxt.text = "Creature: " + (this.creatureId + 1);
		this.resultText.text = "Result: " + this.creatureClone.currentResult().toFixed(0);

		super.render(ctx);
	}

	nextCreature() {
		this.scene.removeEntity(this.creatureClone);

		if (++this.creatureId >= this.population.population.length) {
			this.population.eugenics();
			this.population.rate();
			this.creatureId = 0;
		}

		this.ticks = 0;
		this.creatureClone = this.population.population[this.creatureId].clone();
		this.scene.addEntity(this.creatureClone);
	}

	private updateNext() {
		for (let i = 0; i < this.speed; i++) {
			if (this.ticks++ >= Consts.RUN_DURATION * 60) {
				this.nextCreature();
			}
			this.scene.update(1 / 60);
		}
	}

	skipGenerations(amount: number) {
		for (let i = 0; i < amount; i++) {
			this.population.eugenics();
			this.population.rate();
		}
		this.creatureId = -1;
		this.nextCreature();
	}
}
