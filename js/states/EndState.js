var Unstable = Unstable || {};

Unstable.EndState = function () {
    "use strict";
    Phaser.State.call(this);
};

Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.prototype.constructor = Unstable.EndState;

Unstable.EndState.prototype.init = function (gameData) {
    "use strict";
    this.gameData = gameData;
};

Unstable.EndState.prototype.preload = function () {
    "use strict";

};

Unstable.EndState.prototype.create = function () {
    "use strict";
    "use strict";
    var style = {
      font: "16px Arial",
      fill: "#FFFFFF",
      align: "center"
    };
    var text = game.add.text(game.width / 2, game.height / 2 - 100,
        "You made it to the end! ", style);
    text.anchor.set(0.5);
    text = game.add.text(game.width / 2, game.height / 2 - 50,
        "Thanks for playing this beta version of the game.", style);
    text.anchor.set(0.5);
    text = game.add.text(game.width / 2, game.height / 2,
        "Please send any feedback my way!", style);
    text.anchor.set(0.5);
    var playButton = game.add.button(game.width / 2 - 24,
      game.height / 2 + 100, "buttonSheet", this.navToMenu, this, 8, 8, 9);
    playButton.scale.setTo(2);
};

Unstable.EndState.prototype.navToMenu = function() {
    Unstable.globals.showIntroduction = false;
    this.game.state.start("MenuState", true, false, this.gameData);
};
