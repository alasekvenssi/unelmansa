import { Renderable, RenderGroup, RenderTransform } from "../graphics/Renderable"
import Button from "../graphics/gui/Button"
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

	private populationTxt = new Text("", 15, -30, "middle", new Font("Arial", 30, "normal", FontWeight.Bold));
	private resultTxt = new Text("", 290, -30, "middle", new Font("Arial", 30, "normal", FontWeight.Bold));

	constructor(public mainView: MainView) {
		super();

		this.populationBox = new PopulationBox(mainView.population, 10, 10, -20, -100, 55,
			(target: number) => this.onCreatureClick(target));

		this.items.push(this.populationBox);
		this.items.push(this.populationTxt);
		this.items.push(this.resultTxt);
		//this.items.push(this.loadBtn);
		//this.items.push(this.saveBtn);
		this.items.push(this.skipPopulationBtn);
		this.items.push(this.skip10PopulationsBtn);
	}

	onShow(): void {}
	onHide(): void {}

	render(ctx: Context2D) {
		this.populationTxt.text = "Generation: " + (this.mainView.population.generation + 1);
		this.resultTxt.text = "Best result: " + this.bestCreature().result.toFixed(0);

		super.render(ctx);
	}

	bestCreature() {
		return this.mainView.population.population[0];
	}

	skipGenerations(amount: number) {
		for (let i = 0; i < amount; i++) {
			this.mainView.population.eugenics();
			this.mainView.population.rate();
		}
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
		creature.updateBonesColor();

		ctx.save();
		if (this.callback) {
			ctx.bindEvent(EventType.Click, () => this.callback(id));
		}

		let columnCount = Math.floor((bounds.x-boxGap) / (boxSize+boxGap));
		let column = id % columnCount;
		let row = Math.floor(id / columnCount);

		let offsetX = (bounds.x - (columnCount*(boxSize+boxGap) - boxGap)) / 2;

		let x = (boxSize+boxGap) * column + offsetX;
		let y = (boxSize+boxGap) * row;

		ctx.translate(x, y).fillColor(Color.White).strokeColor(Color.Black).lineWidth(1);
		ctx.drawRect(0, 0, boxSize, boxSize, true, true);

		let creatureBounds = creature.extremes();
		let scaleX = (boxSize-10) / (creatureBounds.max.x - creatureBounds.min.x);
		let scaleY = (boxSize-22) / (creatureBounds.max.y - creatureBounds.min.y);
		let scale = Math.min(scaleX, scaleY);

		let avgX = (creatureBounds.min.x + creatureBounds.max.x) / 2;
		let avgY = (creatureBounds.min.y + creatureBounds.max.y) / 2;

		ctx.save();
		ctx.translate(boxSize/2, (boxSize-12)/2).scale(scale, -scale).translate(-avgX, -avgY);
		creature.render(ctx);
		ctx.restore();

		let fitness = creature.result.toFixed(0);

		ctx.font(new Font("Arial", 10));
		ctx.fillColor(new Color(100, 100, 100)).drawRect(0, boxSize-11, boxSize, 11, true, false);
		ctx.fillColor(Color.White).drawText(2, boxSize-5, fitness, "middle", true, false);

		if (this.callback) {
			ctx.popEvent();
		}
		ctx.restore();
	}
}
