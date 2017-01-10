var Unstable = Unstable || {};

Unstable.LevelManagerState = function () {
  "use strict";
  Phaser.State.call(this);
};

//Unstable.LevelManagerState.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.LevelManagerState.prototype.constructor = Unstable.LevelManagerState;

Unstable.LevelManagerState.prototype.init = function (game_data, levelLink) {
  // this.levels = game_data.levels;
  this.game_data = game_data;
  this.levelLink = levelLink;
}

Unstable.LevelManagerState.prototype.preload = function () {

}

Unstable.LevelManagerState.prototype.create = function () {
  this.nextLevel();
}

Unstable.LevelManagerState.prototype.nextLevel = function() {
  // this.game_data.map = this.levels[Unstable.current_level++];
  this.game_data.map = Unstable.globals.levels[this.levelLink];
  Unstable.globals.current_level = this.levelLink;
  this.game.state.start("GameState", true, false, this.game_data);
}
