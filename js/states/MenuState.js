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
    Unstable.globals.audio.resumeAudioContext(function() {
        Unstable.globals.audio.playSong('ambient');
    });
};

Unstable.MenuState.prototype.create = function () {
    "use strict";
    this.groups = {};
    this.groups["clouds"] = this.game.add.group();
    this.backdropManager = new Unstable.BackdropManager(this);

    var logo = game.add.image(game.width / 2, game.height / 2 - 60, "logo1");
    logo.anchor.set(0.5);
    logo.scale.setTo(0.65);

    var playButton = game.add.button(game.width / 2 - 4,
      game.height / 2 + 36, "buttonSheet", this.startGame, this, 8, 8, 9);
    playButton.anchor.set(0.5);
    playButton.scale.setTo(3);
    
    Unstable.globals.audio.playSong('ambient');
};

Unstable.MenuState.prototype.parseLevelOverride = function() {
    var queryParamString = window.location.search;
    if (queryParamString === "") {
        return "lvl_hub1";
    }
    var params = queryParamString.substr(1).split('&');
    var levelParam = params[0].split('='); // assume level param is first
    return 'lvl_' + levelParam[1];
}

Unstable.MenuState.prototype.startGame = function() {
    game.sound.context.resume();
    Unstable.globals.audio.playSong('ambient');
  this.game.state.start("LevelManager", true, false, this.gameData, this.parseLevelOverride(), null);
}

Unstable.MenuState.prototype.openOptions = function() {
  this.game.state.start("SettingsState", true, false, this.gameData);
}
