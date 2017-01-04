var Unstable = Unstable || {};

Unstable.TitleState = function () {
    "use strict";
    Phaser.State.call(this);
};

Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.prototype.constructor = Unstable.TitleState;

Unstable.TitleState.prototype.init = function (level_file) {
    "use strict";
    this.level_file = level_file;
    /* init global vars */
    Unstable.current_level = 0;
};

Unstable.TitleState.prototype.preload = function () {
    "use strict";
    this.load.text("game_data", this.level_file);
};

Unstable.TitleState.prototype.create = function () {
    "use strict";
    var level_text, level_data;
    level_text = this.game.cache.getText("game_data");
    level_data = JSON.parse(level_text);
    this.game.state.start("LoadingState", true, false, level_data);
};

/*
  Boot State ->
  Loading State (loading bar) ->
  Title State (press SPACE to start) ->
  Menu State (Start Game, Controls, Audio Options, Credits)->
  Level Manager State ->
  Tiled State
*/
