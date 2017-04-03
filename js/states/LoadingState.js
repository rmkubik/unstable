var Unstable = Unstable || {};

Unstable.LoadingState = function () {
    "use strict";
    Phaser.State.call(this);
};

Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.prototype.constructor = Unstable.LoadingState;

Unstable.LoadingState.prototype.init = function (gameData) {
    "use strict";
    this.gameData = gameData;
};

Unstable.LoadingState.prototype.preload = function () {
    "use strict";
    var loadingBar = this.game.add.sprite(200, 200, "loadingBar");
    this.load.setPreloadSprite(loadingBar);

    var assets, asset_loader, asset_key, asset;
    assets = this.gameData.assets;
    for (asset_key in assets) { // load assets according to asset key
        if (assets.hasOwnProperty(asset_key)) {
            asset = assets[asset_key];
            switch (asset.type) {
            case "image":
                this.load.image(asset_key, asset.source);
                break;
            case "spritesheet":
                this.load.spritesheet(asset_key, asset.source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing);
                break;
            case "tilemap":
                this.load.tilemap(asset_key, asset.source, null, Phaser.Tilemap.TILED_JSON);
                break;
            case "imageCollection":
                //this.load.
            case "audio":
                this.load.audio(asset_key, asset.source);
                break;
            }
        }
    }
    this.load.start();

    game.plugins.screenShake = game.plugins.add(Phaser.Plugin.ScreenShake);
    game.plugins.screenShake.setup({
      shakesCount: 0,
      shakeX: true,
      shakeY: true,
      sensCoef: 1.4
    });

    if (Unstable.globals.levels === null) {
      Unstable.globals.levels = this.gameData.levels;
    } else {
      //add new levels from gameData if not already in global
      Object.getOwnPropertyNames(this.gameData.levels).forEach(function(propertyName) {
        if (this.gameData.levels.hasOwnProperty(propertyName)
          && !Unstable.globals.levels.hasOwnProperty(propertyName)) {
            Unstable.globals.levels[propertyName] = this.gameData.levels[propertyName];
        }
      }, this);
    }
};

Unstable.LoadingState.prototype.create = function () {
    "use strict";
    //this.game.levelManager.nextLevel();
    // this.game.state.start("LevelManager", true, false, this.gameData, "lvl_hub1");
    this.game.state.start("MenuState", true, false, this.gameData);
};
