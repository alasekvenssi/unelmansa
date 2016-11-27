import {Scene} from "../../core/Scene"
import {Ground, Air} from "../../core/Entity"
import {Creature, CreatureBone, CreatureMuscle} from "../../core/Creature"
import {InteractiveCanvasWindow} from "../../graphics/browser/CanvasWindow"
import Renderer from "../../graphics/Renderer"
import {RenderTransform} from "../../graphics/Renderable"
import TransformMatrix from "../../util/TransformMatrix"
import Vec2 from "../../util/Vec2"
import Color from "../../util/Color"
import WebImage from "../../graphics/browser/WebImage"
import {InteractiveContext2D} from "../../graphics/InteractiveContext2D"
import SimulationView from "../../ui/SimulationView"

let simView = new SimulationView();

let view = new InteractiveCanvasWindow(window, 2);
let renderer = new Renderer(view.context, simView, 1, true);

renderer.start();
