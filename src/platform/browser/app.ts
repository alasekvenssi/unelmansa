import { Scene } from "../../core/Scene"
import { Ground, Air } from "../../core/Entity"
import { Creature, CreatureBone, CreatureMuscle } from "../../core/Creature"
import { CanvasWindow, InteractiveCanvasWindow } from "../../graphics/browser/CanvasWindow"
import Renderer from "../../graphics/Renderer"
import { RenderTransform } from "../../graphics/Renderable"
import TransformMatrix from "../../util/TransformMatrix"
import Vec2 from "../../util/Vec2"
import Color from "../../util/Color"
import WebImage from "../../graphics/browser/WebImage"
import { InteractiveContext2D } from "../../graphics/InteractiveContext2D"
import MainView from "../../ui/MainView"
import * as CoreUtil from "../../core/Util"

CoreUtil.setResources(new WebImage("sky.png"), new WebImage("ground.jpg"));

let mainView = new MainView();

let view = new InteractiveCanvasWindow(window, 1);
let renderer = new Renderer(view.context, mainView, false);

renderer.start();
