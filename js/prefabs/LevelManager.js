var Unstable = Unstable || {};

Unstable.LevelManager = function (game_state, properties) {
    "use strict";
    this.levels = properties.levels;
    this.game_state = game_state;
    this.current_level = 0;
};

//Unstable.LevelManager.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.LevelManager.prototype.constructor = Unstable.LevelManager;

Unstable.LevelManager.prototype.nextLevel = function() {
  
}
