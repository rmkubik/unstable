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

    this.groups = {};
    this.groups["shadows"] = this.game.add.group();
    this.groups["objects"] = this.game.add.group();

    Unstable.Emitter.init();
};

Unstable.IntroductionState.prototype.preload = function() {
    "use strict";

};

Unstable.IntroductionState.prototype.create = function() {
    "use strict";
    var style = {
      font: "16px Helvetica",
      fill: "#FFFFFF",
      align: "center"
    };
    var text = game.add.text(game.width / 2, game.height / 2 - 100,
        "You are unstable, when you fall you get back up again.", style);
    text.anchor.set(0.5);
    text.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 2);

    text = game.add.text(game.width / 2, game.height / 2 - 25,
        "Arrow keys or WASD to move.", style);
    text.anchor.set(0.5);
    text.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 2);

    text = game.add.text(game.width / 2 - 32, game.height / 2 + 10,
        "Collect all the coins.", style);
    text.anchor.set(0.5);
    text.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 2);

    var coin = new Unstable.Coin(this,
        { x: game.width / 2 + 64, y: game.height / 2 + 16 },
        {
            "frame": "6",
            "group": "coins",
            "pgroup": "coins",
            "rgroup": "objects",
            "texture": "img_objects"
        }
    );
    coin = new Unstable.Coin(this,
        { x: game.width / 2 + 84, y: game.height / 2 + 16 },
        {
            "frame": "6",
            "group": "coins",
            "pgroup": "coins",
            "rgroup": "objects",
            "texture": "img_objects"
        }
    );
    coin = new Unstable.Coin(this,
        { x: game.width / 2 + 104, y: game.height / 2 + 16 },
        {
            "frame": "6",
            "group": "coins",
            "pgroup": "coins",
            "rgroup": "objects",
            "texture": "img_objects"
        }
    );

    text = game.add.text(game.width / 2 - 16, game.height / 2 + 45,
        "Get to the goal.", style);
    text.anchor.set(0.5);
    text.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 2);

    var goal = new Unstable.Goal(this,
        { x: game.width / 2 + 84, y: game.height / 2 + 53 },
        {
            "frame": "8",
            "group": "goal",
            "height": "8",
            "pgroup": "goals",
            "rgroup": "objects",
            "texture": "img_objects",
            "width": "8",
            "displayTrophies": false,
            "id": 0,
            "link": "lvl_hub1",
            "threshold": 0,
            "levelPrereq": "",
            "destGoalId": 0,
        }
    );

    var playButton = game.add.button(game.width / 2 - 24,
      game.height / 2 + 100, "buttonSheet", this.endIntroduction, this, 8, 8, 9);
    playButton.scale.setTo(2);
};

Unstable.IntroductionState.prototype.endIntroduction = function() {
    Unstable.globals.showIntroduction = false;
    this.game.state.start("LevelManager", true, false, this.game_data, this.levelLink);
};
