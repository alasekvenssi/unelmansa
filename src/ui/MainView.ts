import { Renderable } from "../graphics/Renderable"
import { Context2D } from "../graphics/Context2D"
import Population from "../core/Population"
import * as Consts from "../core/Consts"
import { View } from "./View"
import SimulationView from "./SimulationView"
import { PopulationView } from "./PopulationView"

export default class MainView implements View {

	population: Population = new Population(Consts.POPULATION_SIZE);

	populationView: PopulationView;
	simulationView: SimulationView;

	currentView: View;

	constructor() {
		this.population.rate();
		this.populationView = new PopulationView(this);
		this.simulationView = new SimulationView(this);
		this.currentView = this.populationView;
	}

	render(ctx: Context2D) {
		this.currentView.render(ctx);
	}

	show(view: View) {
		this.currentView.onHide();
		this.currentView = view;
		this.currentView.onShow();
	}

	onShow(): void {
		this.currentView.onShow();
	}
	onHide(): void {
		this.currentView.onHide();
	}
}
