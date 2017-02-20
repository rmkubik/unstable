var Unstable = Unstable || {};

Unstable.MenuState = function () {
    "use strict";
    Phaser.State.call(this);
};

Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.prototype.constructor = Unstable.MenuState;

Unstable.MenuState.prototype.init = function (gameData) {
    "use strict";
    this.gameData = gameData;
};

Unstable.MenuState.prototype.create = function () {
    "use strict";
    var style = {
      font: "64px Arial",
      fill: "#FFFFFF",
      align: "center"
    };
    var text = game.add.text(game.width / 2, game.height / 2 - 100,
      "Unstable", style);
    text.anchor.set(0.5);
    style.font = "16px Arial";
    text = game.add.text(game.width / 2, game.height / 2 - 48,
        "This is a beta version, please send feedback!", style);
    text.anchor.set(0.5);
    var playButton = game.add.button(game.width / 2 - 72,
      game.height / 2 - 24, "buttonSheet", this.startGame, this, 0, 0, 1);
    playButton.scale.setTo(2);
    var optionsButton = game.add.button(game.width/2 + 24, game.height/2 - 24, "buttonSheet", this.openOptions, this, 2, 2, 3);
    optionsButton.scale.setTo(2);
};

Unstable.MenuState.prototype.startGame = function() {
  this.game.state.start("LevelManager", true, false, this.gameData, "lvl_hub1", null);
}

Unstable.MenuState.prototype.openOptions = function() {
  this.game.state.start("SettingsState", true, false, this.gameData);
}
