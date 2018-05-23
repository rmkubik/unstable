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
      font: "24px Arial",
      fill: "#FFFFFF",
      align: "center"
    };
    var text = game.add.text(game.width / 2, game.height / 2 - 100,
      "Settings", style);
    text.anchor.set(0.5);

    style.font = "16px Arial";
    // style.align = "right";

    var playText = game.add.text(game.width / 2 + 32,
      game.height / 2,
      "Resume Game", style);
    playText.anchor.set(1, 0.5);

    var playButton = game.add.button(game.width / 2 + 16 + 32,
      game.height / 2, "buttonSheet", this.startGame, this, 8, 8, 9);
    playButton.anchor.set(0.5);
    // playButton.scale.setTo(2);


    var muteText = game.add.text(game.width / 2 + 32,
      game.height / 2 + 36,
      "Mute All Audio", style);
    muteText.anchor.set(1, 0.5);

    var unmutedFrames = [12, 12, 13, 12];
    var mutedFrames = [14, 14, 15, 14];
    var initialFrames = unmutedFrames;

    if (Unstable.globals.audio.isMuted()) {
        initialFrames = mutedFrames;
    }
    var muteButton = game.add.button(
        game.width / 2 + 16 + 32,
        game.height / 2 + 36,
        "buttonSheet",
        function() {
            if (Unstable.globals.audio.isMuted()) {
                Unstable.globals.audio.unMute();
                muteButton.setFrames(
                    unmutedFrames[0],
                    unmutedFrames[1],
                    unmutedFrames[2],
                    unmutedFrames[3]
                );
            } else {
                Unstable.globals.audio.mute();
                muteButton.setFrames(
                    mutedFrames[0],
                    mutedFrames[1],
                    mutedFrames[2],
                    mutedFrames[3]
                );
            }
        },
        this,
        initialFrames[0],
        initialFrames[1],
        initialFrames[2],
        initialFrames[3]
    );
    muteButton.anchor.set(0.5);
    // muteButton.scale.setTo(2);

    var volumeUpText = game.add.text(game.width / 2 + 32,
      game.height / 2 + 72,
      "Volume Up", style);
    volumeUpText.anchor.set(1, 0.5);

    var upButton = game.add.button(
        game.width / 2 + 16 + 32,
        game.height / 2 + 72,
        "buttonSheet",
        function() {
            Unstable.globals.audio.volumeUp(true);
        },
        this,
        8,
        8,
        9,
        8
    );
    upButton.anchor.setTo(0.5, 0.5);
    // upButton.scale.setTo(2);
    upButton.angle = 270;

    var volumeDownText = game.add.text(game.width / 2 + 32,
      game.height / 2 + 108,
      "Volume Down", style);
    volumeDownText.anchor.set(1, 0.5);

    var downButton = game.add.button(
        game.width / 2 + 32 + 16,
        game.height / 2 + 108,
        "buttonSheet",
        function() {
            Unstable.globals.audio.volumeDown(true);
        },
        this,
        8,
        8,
        9,
        8
    );
    downButton.anchor.setTo(0.5, 0.5);
    // downButton.scale.setTo(2);
    downButton.angle = 90;

    // var menuButton = game.add.button(game.width / 2 - 100,
    //   game.height / 2 - 24, "buttonSheet", this.openMenu, this, 4, 4, 5);
    // menuButton.scale.setTo(2);
    // var soundButton = game.add.button(game.width/2, game.height/2 - 24, "buttonSheet", null, this, 6, 6, 9);
    // soundButton.scale.setTo(2);
};

Unstable.SettingsState.prototype.startGame = function() {
  // this.game.state.start("LevelManager", true, false, this.level_file);
  this.game.state.start("LevelManager", true, false, this.level_file, Unstable.globals.current_level, null);
}

Unstable.SettingsState.prototype.openMenu = function () {
  this.game.state.start("MenuState", true, false, this.level_file);
};
