var Unstable = Unstable || {};

Unstable.IntroductionState = function() {
    "use strict";
    Phaser.State.call(this);
};

Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.prototype.constructor = Unstable.IntroductionState;

Unstable.IntroductionState.prototype.init = function(game_data, levelLink) {
    "use strict";
    this.game_data = game_data;
    this.levelLink = levelLink;
};

Unstable.IntroductionState.prototype.preload = function() {
    "use strict";

};

Unstable.IntroductionState.prototype.create = function() {
    "use strict";
    var style = {
      font: "16px Arial",
      fill: "#FFFFFF",
      align: "center"
    };
    var text = game.add.text(game.width / 2, game.height / 2 - 100,
        "You are unstable, when you fall you get back up again.", style);
    text.anchor.set(0.5);

    text = game.add.text(game.width / 2, game.height / 2 - 25,
        "Arrow keys or WASD to move.", style);
    text.anchor.set(0.5);

    text = game.add.text(game.width / 2, game.height / 2 + 10,
        "Collect all the coins.", style);
    text.anchor.set(0.5);

    text = game.add.text(game.width / 2, game.height / 2 + 45,
        "Get to the goal.", style);
    text.anchor.set(0.5);

    var playButton = game.add.button(game.width / 2 - 24,
      game.height / 2 + 100, "buttonSheet", this.endIntroduction, this, 8, 8, 9);
    playButton.scale.setTo(2);
};

Unstable.IntroductionState.prototype.endIntroduction = function() {
    Unstable.globals.showIntroduction = false;
    this.game.state.start("LevelManager", true, false, this.game_data, this.levelLink);
};
