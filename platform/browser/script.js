function skipIntro() {
    var overlay = document.getElementById("Overlay");
    document.body.removeChild(overlay);
}

document.onkeydown = function(e) {
    skipIntro();
    document.onkeydown =-function(e) {}; 
};

require(["platform/browser/app"]);

var app = require("platform/browser/app");
var consts = require("core/Consts");
var view = app.mainView.simulationView;
var creatures = app.mainView.population.population;
var population = app.mainView.population;