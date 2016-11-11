var Unstable = Unstable || {};

Unstable.LevelManagerState = function () {
  "use strict";
  Phaser.State.call(this);
};

//Unstable.LevelManagerState.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.LevelManagerState.prototype.constructor = Unstable.LevelManagerState;

Unstable.LevelManagerState.prototype.init = function (game_data) {
  this.levels = game_data.levels;
  this.game_data = game_data;
}

Unstable.LevelManagerState.prototype.preload = function () {

}

Unstable.LevelManagerState.prototype.create = function () {
  this.nextLevel();
}

Unstable.LevelManagerState.prototype.nextLevel = function() {
  console.log(Unstable.current_level);
  console.log(this.levels);
  this.game_data.map = this.levels[Unstable.current_level++];
  this.game.state.start("GameState", true, false, this.game_data);
}
