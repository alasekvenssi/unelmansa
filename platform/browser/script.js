function skipIntro() {
    if(this.flag == null) {
        var overlay = document.getElementById("Overlay");
        document.body.removeChild(overlay);
        this.flag = true;
    }
}

function initDebug() {
    this.app = require("platform/browser/app");
    this.consts = require("core/Consts");
    this.view = app.mainView.simulationView;
    this.creatures = app.mainView.population.population;
    this.population = app.mainView.population;
}

document.onkeydown = function(e) {
    skipIntro();
    document.onkeydown =-function(e) {}; 
};

document.onclick = function(e) {
    skipIntro();
    document.onclick = function(e) {};
}

require(["platform/browser/app"]);
setTimeout(initDebug, 1000);