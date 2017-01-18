var Unstable = Unstable || {};

Unstable.EndState = function () {
    "use strict";
    Phaser.State.call(this);
};

Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.prototype.constructor = Unstable.EndState;

Unstable.EndState.prototype.init = function (level_file) {
    "use strict";
    this.level_file = level_file;
    /* init global vars */
    Unstable.globals = {};
    Unstable.globals.current_level = undefined;
    Unstable.globals.levels = {};
};

Unstable.EndState.prototype.preload = function () {
    "use strict";
    this.load.text("game_data", this.level_file);
    this.load.image("loadingBar", "assets/images/loading_bar.png");
};

Unstable.EndState.prototype.create = function () {
    "use strict";
    var level_text, level_data;
    level_text = this.game.cache.getText("game_data");
    level_data = JSON.parse(level_text);
    this.game.state.start("LoadingState", true, false, level_data);
};
