import {RenderGroup, RenderTransform} from "../graphics/Renderable"
import Button from "../graphics/gui/Button"
import Text from "../graphics/gui/Text"
import {Context2D} from "../graphics/Context2D"
import TransformMatrix from "../util/TransformMatrix"
import {Font, FontWeight} from "../util/Font"
import {Scene} from "../core/Scene"
import {Air, Ground} from "../core/Entity"
import WebImage from "../graphics/browser/WebImage"
import {Creature} from "../core/Creature"
import Population from "../core/Population"

// Temporarily simulation is done here, to be moved!

export default class SimulationView extends RenderGroup {
	private skipPopulationBtn = new Button("Skip population", () => this.skipPopulation(), -15, -15, 405, 100);
	private skipCreatureBtn = new Button("Skip creature", () => this.skipCreature(), -435, -15, 355, 100);

	private populationTxt = new Text("", 30, -65, "middle", new Font("Arial", 60, "normal", FontWeight.Bold));
	private creatureTxt = new Text("", 550, -65, "middle", new Font("Arial", 60, "normal", FontWeight.Bold));
	private resultText = new Text("", 1000, -65, "middle", new Font("Arial", 60, "normal", FontWeight.Bold));

	scene: Scene = new Scene();
	camera: RenderTransform;

	population: Population = new Population(1000);
	populationId: number = 0;
	creatureId: number = 0;
	creatureClone: Creature;

	ticks: number = 0;
	speed: number = 1;

	constructor() {
		super();

		this.scene.addEntity(new Air(new WebImage("sky.png")));
		this.scene.addEntity(new Ground(new WebImage("ground.jpg")));

		this.camera = new RenderTransform(new TransformMatrix(), this.scene);

		this.items.push(this.camera);
		this.items.push(this.skipPopulationBtn);
		this.items.push(this.skipCreatureBtn);
		this.items.push(this.populationTxt);
		this.items.push(this.creatureTxt);
		this.items.push(this.resultText);

		this.creatureClone = this.population.population[this.creatureId].clone()
		this.scene.addEntity(this.creatureClone);

		setInterval(() => this.updateNext(), 1000/60);
	}

	render(ctx: Context2D) {
		let creature = this.creatureClone;
		console.log(creature.center());
		this.camera.transform = TransformMatrix.translate(ctx.width()/2 - creature.center().x, ctx.height() - 150);

		this.populationTxt.text = "Population: " + (this.populationId+1);
		this.creatureTxt.text = "Creature: " + (this.creatureId+1);
		this.resultText.text = "Result: " + this.creatureClone.center().x.toFixed(0);

		super.render(ctx);
	}

	private nextCreature() {
		this.scene.removeEntity(this.creatureClone);

		if (++this.creatureId >= this.population.population.length) {
			// TODO: REPRODUCTION

			this.creatureId = 0;
			this.populationId++;
		}

		this.ticks = 0;
		this.creatureClone = this.population.population[this.creatureId].clone();
		this.scene.addEntity(this.creatureClone);
	}

	private updateNext() {
		for (let i = 0; i < this.speed; i++) {
			if (this.ticks++ >= 10*60) {
				this.nextCreature()
			}
			this.scene.update(1/60);
		}
	}

	skipPopulation() {
		let last = this.populationId;
		while (this.populationId == last) {
			this.updateNext();
		}
	}

	skipCreature() {
		let last = this.creatureId;
		while (this.creatureId == last) {
			this.updateNext();
		}
	}
}
