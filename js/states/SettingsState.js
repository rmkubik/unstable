var Unstable = Unstable || {};

Unstable.SettingsState = function () {
    "use strict";
    Phaser.State.call(this);
};

Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.prototype.constructor = Unstable.SettingsState;

Unstable.SettingsState.prototype.init = function (level_file) {
    "use strict";
    this.level_file = level_file;
};

Unstable.SettingsState.prototype.create = function () {
    "use strict";
    var style = {
      font: "64px Arial",
      fill: "#FFFFFF",
      align: "center"
    };
    var text = game.add.text(game.width / 2, game.height / 2 - 100,
      "Settings", style);
    text.anchor.set(0.5);
    var menuButton = game.add.button(game.width / 2 - 100,
      game.height / 2 - 24, "buttonSheet", this.openMenu, this, 4, 4, 5);
    menuButton.scale.setTo(2);
    var soundButton = game.add.button(game.width/2, game.height/2 - 24, "buttonSheet", null, this, 6, 6, 9);
    soundButton.scale.setTo(2);
};

Unstable.SettingsState.prototype.openMenu = function () {
  this.game.state.start("MenuState", true, false, this.level_file);
};
