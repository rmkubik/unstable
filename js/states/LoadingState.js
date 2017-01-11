var Unstable = Unstable || {};

Unstable.LoadingState = function () {
    "use strict";
    Phaser.State.call(this);
};

Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.prototype.constructor = Unstable.LoadingState;

Unstable.LoadingState.prototype.init = function (level_data) {
    "use strict";
    this.level_data = level_data;
    this.game.stage.backgroundColor = '#2A9A81';
};

Unstable.LoadingState.prototype.preload = function () {
    "use strict";
    var loadingBar = this.game.add.sprite(200, 200, "loadingBar");
    this.load.setPreloadSprite(loadingBar);

    var assets, asset_loader, asset_key, asset;
    assets = this.level_data.assets;
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
            }
        }
    }
    this.load.start();
    //this.game.levelManager = new Unstable.LevelManager(this, this.level_data);
    //this.level_data.map = this.level_data.levels[0];
    Unstable.globals.levels = this.level_data.levels;
};

Unstable.LoadingState.prototype.create = function () {
    "use strict";
    //this.game.levelManager.nextLevel();
    // this.game.state.start("LevelManager", true, false, this.level_data, "lvl_hub1");
    this.game.state.start("MenuState", true, false, this.level_data);
};
