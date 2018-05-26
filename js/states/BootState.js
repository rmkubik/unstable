var Unstable = Unstable || {};

Unstable.BootState = function () {
    "use strict";
    Phaser.State.call(this);
};

Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.prototype.constructor = Unstable.BootState;

Unstable.BootState.prototype.init = function (gameDataFile) {
    "use strict";
    this.gameDataFile = gameDataFile;
    this.game.stage.backgroundColor = '#3799B3';//'#2A9A81';

    /* init global vars */
    var saveState;
    if(Unstable.isLocalStorageAvailable()) {
      saveState = localStorage.getItem("com.ryankubik.unstable.saveState");
    } else {
      saveState = null;
    }
    Unstable.globals = {};
    if (saveState === null) {
      Unstable.globals.current_level = undefined;
      Unstable.globals.levels = null;
      Unstable.globals.showIntroduction = true;
    } else {
      saveState = JSON.parse(saveState);
      Unstable.globals.current_level = saveState.current_level;
      Unstable.globals.levels = saveState.levels;
      Unstable.globals.showIntroduction = saveState.showIntroduction;
    }
    Unstable.globals.audio = new VolumeManager(game);

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.game.renderer.renderSession.roundPixels = true
};

Unstable.BootState.prototype.preload = function () {
    "use strict";
    this.load.text("game_data", this.gameDataFile);
    this.load.image("loadingBar", "assets/images/loading_bar.png");
};

Unstable.BootState.prototype.create = function () {
    "use strict";
    var gameDataText, gameData;
    gameDataText = this.game.cache.getText("game_data");
    gameData = JSON.parse(gameDataText);
    this.game.state.start("LoadingState", true, false, gameData);
};
