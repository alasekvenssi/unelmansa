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
import MainView from "./MainView"
import { View } from "./View"

export default class SimulationView extends RenderGroup implements View {
	private goBackBtn = new Button("x", () => this.mainView.show(this.mainView.populationView), -579, -7, 45, 50);
	private prevCreatureBtn = new Button("<", () => this.prevCreature(), -527, -7, 45, 50);
	private nextCreatureBtn = new Button(">", () => this.nextCreature(), -475, -7, 45, 50);
	private skipPopulationBtn = new Button("Next generation", () => this.skipGenerations(1), -265, -7, 202, 50);
	private skip10PopulationsBtn = new Button("Skip 10 generations", () => this.skipGenerations(10), -7, -7, 250, 50);

	private populationTxt = new Text("", 15, -30, "middle", new Font("Arial", 30, "normal", FontWeight.Bold));
	private creatureTxt = new Text("", 270, -30, "middle", new Font("Arial", 30, "normal", FontWeight.Bold));
	private resultText = new Text("", 500, -30, "middle", new Font("Arial", 30, "normal", FontWeight.Bold));

	scene: Scene = CoreUtil.creatureScene();
	camera: RenderTransform;

	creatureId: number = 0;
	creatureClone: Creature;

	ticks: number = 0;
	speed: number = 1;
	intervalId: number;

	constructor(public mainView: MainView) {
		super();

		this.camera = new RenderTransform(new TransformMatrix(), this.scene);

		this.items.push(this.camera);
		this.items.push(this.skipPopulationBtn);
		this.items.push(this.skip10PopulationsBtn);
		this.items.push(this.goBackBtn);
		this.items.push(this.prevCreatureBtn);
		this.items.push(this.nextCreatureBtn);
		this.items.push(this.populationTxt);
		this.items.push(this.creatureTxt);
		this.items.push(this.resultText);

		this.mainView.population.rate();

		this.creatureClone = this.mainView.population.population[this.creatureId].clone()
		this.scene.addEntity(this.creatureClone);
	}

	onShow(): void {
		this.intervalId = setInterval(() => this.updateNext(), 1000 / 60);
	}

	onHide(): void {
		clearInterval(this.intervalId);
	}

	render(ctx: Context2D) {
		let creature = this.creatureClone;

		let trans = TransformMatrix.translate(ctx.width() / 2, ctx.height() - 90);
		trans = trans.mul(TransformMatrix.scale(0.5, 0.5));
		trans = trans.mul(TransformMatrix.translate(-creature.center().x, 0));

		this.camera.transform = trans;

		this.populationTxt.text = "Generation: " + (this.mainView.population.generation + 1);
		this.creatureTxt.text = "Creature: " + (this.creatureId + 1);
		this.resultText.text = "Result: " + this.creatureClone.currentResult().toFixed(0);

		super.render(ctx);
	}

	showCreature(id: number) {
		this.scene.removeEntity(this.creatureClone);
		this.creatureId = id;
		this.ticks = 0;
		this.creatureClone = this.mainView.population.population[this.creatureId].clone();
		this.scene.addEntity(this.creatureClone);
	}

	nextCreature() {
		// if (++this.creatureId >= this.mainView.population.population.length) {
		// 	this.mainView.population.eugenics();
		// 	this.mainView.population.rate();
		// 	this.creatureId = 0;
		// }
		this.showCreature((this.creatureId+1) % this.mainView.population.population.length);
	}

	prevCreature() {
		let total = this.mainView.population.population.length;
		this.showCreature((total+this.creatureId-1) % total);
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
			this.mainView.population.eugenics();
			this.mainView.population.rate();
		}
		this.creatureId = -1;
		this.nextCreature();
	}
}
