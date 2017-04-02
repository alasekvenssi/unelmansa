import { Renderable, RenderGroup, RenderTransform } from "../graphics/Renderable"
import Button from "../graphics/gui/Button"
import Chart from "../graphics/gui/Chart"
import Text from "../graphics/gui/Text"
import { Context2D, EventType } from "../graphics/Context2D"
import TransformMatrix from "../util/TransformMatrix"
import { Font, FontWeight } from "../util/Font"
import Color from "../util/Color"
import { Scene } from "../core/Scene"
import { Air, Ground } from "../core/Entity"
import WebImage from "../graphics/browser/WebImage"
import { Creature } from "../core/Creature"
import { CreatureBone } from "../core/Creature"
import Population from "../core/Population"
import * as Consts from "../core/Consts"
import * as CoreUtil from "../core/Util"
import * as GuiUtil from "../graphics/gui/Util"
import Vec2 from "../util/Vec2"
import MainView from "./MainView"
import { View } from "./View"

export class PopulationView extends RenderGroup implements View {
	private loadBtn = new Button("Load", () => this.load(), -569, -7, 87, 50);
	private saveBtn = new Button("Save", () => this.save(), -475, -7, 87, 50);
	private skipPopulationBtn = new Button("Skip generation", () => this.skipGenerations(1), -265, -7, 202, 50);
	private skip10PopulationsBtn = new Button("Skip 10 generations", () => this.skipGenerations(10), -7, -7, 250, 50);
	private populationBox: PopulationBox;

	private bestOfChart = new Chart(40, -100);

	private populationTxt = new Text("", 15, -30, "middle", new Font("Arial", 30, "normal", FontWeight.Bold));
	private resultTxt = new Text("", 290, -30, "middle", new Font("Arial", 30, "normal", FontWeight.Bold));

	constructor(public mainView: MainView) {
		super();

		this.populationBox = new PopulationBox(mainView.population, 10, 10, -20, -100, 55,
			(target: number) => this.onCreatureClick(target));

		this.items.push(this.populationBox);
		this.items.push(this.populationTxt);
		this.items.push(this.resultTxt);
		this.items.push(this.bestOfChart);
		// this.items.push(this.loadBtn);
		// this.items.push(this.saveBtn);
		this.items.push(this.skipPopulationBtn);
		this.items.push(this.skip10PopulationsBtn);
	}

	onShow(): void {}
	onHide(): void {}

	render(ctx: Context2D) {
		this.populationTxt.text = "Generation: " + (this.mainView.population.generation + 1);
		this.resultTxt.text = "Best result: " + this.bestCreature().resultWithoutPenalties.toFixed(0);
		this.bestOfChart.addPoint(this.mainView.population.generation + 1, this.bestCreature().resultWithoutPenalties);
		super.render(ctx);
	}

	bestCreature() {
		return this.mainView.population.population[0];
	}

	skipGenerations(amount: number) {
		let timer = "skipGenerations(" + amount + ")";
		console.time(timer);

		for (let i = 0; i < amount; i++) {
			this.mainView.population.eugenics();
			this.mainView.population.rate();
			this.bestOfChart.addPoint(this.mainView.population.generation + 1, this.bestCreature().resultWithoutPenalties);
		}

		console.timeEnd(timer);
	}

	onCreatureClick(id: number) {
		this.mainView.simulationView.showCreature(id);
		this.mainView.show(this.mainView.simulationView);
	}

	load() {} // TODO
	save() {}
}

export class PopulationBox implements Renderable {
	constructor(
		public population: Population,
		public x: number, public y: number,
		public width: number, public height: number,
		public elemSize: number,
		public callback?: (target: number)=>void
	) {}

	private creatureOver: Creature = null;
	private creatureClone: Creature = null;
	private scene: Scene = null;

	render(ctx: Context2D) {
		ctx.save();

		let bounds = GuiUtil.alignTranslate(ctx, this.x, this.y, this.width, this.height);
		for (let i = 0; i < this.population.population.length; i++) {
			this.renderCreaturePreview(ctx, bounds, i);
		}

		ctx.restore();
	}

	private renderCreaturePreview(ctx: Context2D, bounds: Vec2, id: number) {
		const boxSize = this.elemSize;
		const boxGap = 4;

		let creature = this.population.population[id];

		let mouseOver = (creature == this.creatureOver);
		if (mouseOver) {
			this.scene.update(1 / Consts.SIMULATION_RESOLUTION);
			this.creatureClone.result = creature.result;
			creature = this.creatureClone;
		}

		ctx.save();

		// Bind events

		if (this.callback) {
			ctx.bindEvent(EventType.Click, () => this.callback(id));
		}

		ctx.bindEvent(EventType.MouseEnter, () => {
			this.creatureOver = creature;
			this.creatureClone = creature.clone();
			this.scene = CoreUtil.creatureScene(this.creatureClone);
		});
		ctx.bindEvent(EventType.MouseLeave, () => {
			this.creatureOver = this.creatureClone = this.scene = null;
		});

		// Calculate position and draw box

		let columnCount = Math.floor((bounds.x-boxGap) / (boxSize+boxGap));
		let column = id % columnCount;
		let row = Math.floor(id / columnCount);

		let offsetX = (bounds.x - (columnCount*(boxSize+boxGap) - boxGap)) / 2;

		let x = (boxSize+boxGap) * column + offsetX;
		let y = (boxSize+boxGap) * row;

		ctx.translate(x, y).strokeColor(Color.Black).lineWidth(1);
		ctx.fillColor(mouseOver ? new Color(206, 229, 253) : new Color(228, 241, 254));
		ctx.drawRect(0, 0, boxSize, boxSize, true, true);

		// Draw rescaled creature

		let creatureBounds = creature.extremes();
		let scaleX = (boxSize-10) / (creatureBounds.max.x - creatureBounds.min.x);
		let scaleY = (boxSize-22) / (creatureBounds.max.y - creatureBounds.min.y);
		let scale = Math.min(scaleX, scaleY);

		let avgX = (creatureBounds.min.x + creatureBounds.max.x) / 2;
		let minY = creatureBounds.min.y;

		ctx.save();
		ctx.translate(boxSize/2, boxSize-15).scale(scale, -scale).translate(-avgX, -minY);
		creature.render(ctx);
		ctx.restore();

		// Draw fitness value

		let fitness = creature.result.toFixed(0);

		ctx.font(new Font("Arial", 10));
		ctx.fillColor(mouseOver ? new Color(70, 70, 70) : new Color(100, 100, 100));
		ctx.drawRect(0, boxSize-11, boxSize, 11, true, false);
		ctx.fillColor(Color.White).drawText(2, boxSize-5, fitness, "middle", true, false);

		ctx.restore();
	}
}
