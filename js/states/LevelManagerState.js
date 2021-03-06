var Unstable = Unstable || {};

Unstable.LevelManagerState = function () {
  "use strict";
  Phaser.State.call(this);
};

//Unstable.LevelManagerState.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.LevelManagerState.prototype.constructor = Unstable.LevelManagerState;

Unstable.LevelManagerState.prototype.init = function (game_data, levelLink, destGoalId) {
  // this.levels = game_data.levels;
  this.game_data = game_data;
  this.levelLink = levelLink;
  this.destGoalId = destGoalId;
}

Unstable.LevelManagerState.prototype.create = function () {
  this.nextLevel();
}

Unstable.LevelManagerState.prototype.nextLevel = function() {
  if (Unstable.globals.showIntroduction) {
    this.game.state.start("IntroductionState", true, false, this.game_data, this.levelLink);
  } else if (this.levelLink === "victory") {
    this.game.state.start("EndState", true, false, this.game_data);
  } else {
    // this.game_data.map = this.levels[Unstable.current_level++];
    this.game_data.map = Unstable.globals.levels[this.levelLink];
    Unstable.globals.current_level = this.levelLink;
    this.game.state.start("GameState", true, false, this.game_data, this.destGoalId);
  }
}
