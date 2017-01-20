var Unstable = Unstable || {};

Unstable.BootState = function () {
    "use strict";
    Phaser.State.call(this);
};

Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.prototype.constructor = Unstable.BootState;

Unstable.BootState.prototype.init = function (level_file) {
    "use strict";
    this.level_file = level_file;
    /* init global vars */
    Unstable.globals = {};
    Unstable.globals.current_level = undefined;
    Unstable.globals.levels = {};

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
};

Unstable.BootState.prototype.preload = function () {
    "use strict";
    this.load.text("game_data", this.level_file);
    this.load.image("loadingBar", "assets/images/loading_bar.png");
};

Unstable.BootState.prototype.create = function () {
    "use strict";
    var level_text, level_data;
    level_text = this.game.cache.getText("game_data");
    level_data = JSON.parse(level_text);
    this.game.state.start("LoadingState", true, false, level_data);
};
