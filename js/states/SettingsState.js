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
    this.trophyManager = new TrophyManager();
};

Unstable.SettingsState.prototype.create = function () {
    "use strict";
    var style = {
      font: "24px Arial",
      fill: "#FFFFFF",
      align: "center"
    };
    var text = game.add.text(game.width / 2, game.height / 2 - 100,
      "Menu", style);
      text.x -= Math.round(text.width/2);
      text.y -= Math.round(text.height/2);


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


    var songText = game.add.text(game.width / 2 + 32,
      game.height / 2 + 36,
      this.getVolumeText(), style);
    songText.anchor.set(1, 0.5);

    var unmutedFrames = [12, 12, 13, 12];
    var mutedFrames = [14, 14, 15, 14];
    var initialFrames = unmutedFrames;

    if (Unstable.globals.audio.isTrackMuted()) {
        initialFrames = mutedFrames;
    }
    var muteButton = game.add.button(
        game.width / 2 + 16 + 32,
        game.height / 2 + 36,
        "buttonSheet",
        function() {
            if (Unstable.globals.audio.isTrackMuted()) {
                Unstable.globals.audio.unMute('track');
                muteButton.setFrames(
                    unmutedFrames[0],
                    unmutedFrames[1],
                    unmutedFrames[2],
                    unmutedFrames[3]
                );
            } else {
                Unstable.globals.audio.mute('track');
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

    var upButton = game.add.button(
        game.width / 2 + 16 + 32 + 24,
        game.height / 2 + 36,
        "buttonSheet",
        function() {
            Unstable.globals.audio.volumeUp();
            songText.text = this.getVolumeText();
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

    var downButton = game.add.button(
        game.width / 2 + 16 + 32 + 24 + 24,
        game.height / 2 + 36,
        "buttonSheet",
        function() {
            Unstable.globals.audio.volumeDown();
            songText.text = this.getVolumeText();
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

    var sfxText = game.add.text(game.width / 2 + 32,
      game.height / 2 + 72,
      this.getSfxText(), style);
    sfxText.anchor.set(1, 0.5);

    if (Unstable.globals.audio.isSfxMuted()) {
        initialFrames = mutedFrames;
    }
    var muteButton2 = game.add.button(
        game.width / 2 + 16 + 32,
        game.height / 2 + 72,
        "buttonSheet",
        function() {
            if (Unstable.globals.audio.isSfxMuted()) {
                Unstable.globals.audio.unMute('sfx');
                muteButton2.setFrames(
                    unmutedFrames[0],
                    unmutedFrames[1],
                    unmutedFrames[2],
                    unmutedFrames[3]
                );
            } else {
                Unstable.globals.audio.mute('sfx');
                muteButton2.setFrames(
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
    muteButton2.anchor.set(0.5);
    // muteButton.scale.setTo(2);

    var upButton2 = game.add.button(
        game.width / 2 + 16 + 32 + 24,
        game.height / 2 + 72,
        "buttonSheet",
        function() {
            Unstable.globals.audio.volumeUp(true);
            sfxText.text = this.getSfxText();
        },
        this,
        8,
        8,
        9,
        8
    );
    upButton2.anchor.setTo(0.5, 0.5);
    // upButton.scale.setTo(2);
    upButton2.angle = 270;

    var downButton2 = game.add.button(
        game.width / 2 + 16 + 32 + 24 + 24,
        game.height / 2 + 72,
        "buttonSheet",
        function() {
            Unstable.globals.audio.volumeDown(true);
            sfxText.text = this.getSfxText();
        },
        this,
        8,
        8,
        9,
        8
    );
    downButton2.anchor.setTo(0.5, 0.5);
    // downButton.scale.setTo(2);
    downButton2.angle = 90;

    var completionText = game.add.text(game.width / 2,
      game.height / 2 + 108,
      this.getCompletionText(), style);
    completionText.anchor.set(0.5, 0.5);

    var resetText = game.add.text(game.width / 2 + 64,
    game.height / 2 + 142,
    "Permanently Reset Progress",
    style);
    resetText.anchor.set(1, 0.5);

    var resetButton = game.add.button(
        game.width / 2 + 64 + 16,
        game.height / 2 + 142 - 4,
        "buttonSheet",
        function() {
            Unstable.resetProgress();
            completionText.text = this.getCompletionText();
        },
        this,
        4,
        4,
        5,
        4
    );
    resetButton.anchor.setTo(0.5, 0.5);

};

Unstable.SettingsState.prototype.getCompletionText = function() {
    return "Completion Percentage: " + this.trophyManager.getCompletionPercentage(Unstable.globals.levels) + "%";
}

Unstable.SettingsState.prototype.getVolumeText = function() {
    return "Music Volume: " + Math.trunc(Unstable.globals.audio.getVolume() * 10);
}

Unstable.SettingsState.prototype.getSfxText = function() {
    return "SFX Volume: " + Math.trunc(Unstable.globals.audio.getVolume(true) * 10);
}

Unstable.SettingsState.prototype.startGame = function() {
  // this.game.state.start("LevelManager", true, false, this.level_file);
  this.game.state.start("LevelManager", true, false, this.level_file, Unstable.globals.current_level, null);
}

Unstable.SettingsState.prototype.openMenu = function () {
  this.game.state.start("MenuState", true, false, this.level_file);
};
