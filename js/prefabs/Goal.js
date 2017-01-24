var Unstable = Unstable || {};

Unstable.Goal = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);
    game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    // this.body.setSize(properties.width, properties.height,
      // (this.width - properties.width)/2, (this.height - properties.height)/2);
    this.body.setSize(20, 6, 2, 18);
    this.anchor.setTo(0.5, 1);
    //colliderTest.visible = false;

    this.game_state = game_state;
    this.threshold = properties.threshold;
    this.levelLink = properties.link;
    this.levelPrereq = properties.levelPrereq;
    this.destGoalId = properties.destGoalId;
    if (this.levelPrereq === undefined) {
      this.updateReady();
    } else {
      if (Unstable.globals.levels[this.levelPrereq] !== undefined) {
        if (Unstable.globals.levels[this.levelPrereq].completion > 0) {
          this.updateReady();
        } else {
          console.log("level prereq not completed: " + this.levelPrereq);
        }
      } else {
        console.log("this level prereq does not exist: " + this.levelPrereq);
      }
    }
};

Unstable.Goal.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Goal.prototype.constructor = Unstable.Goal;

Unstable.Goal.prototype.emit = function(coin) {

}

Unstable.Goal.prototype.updateReady = function () {
  if (this.game_state.coins >= this.threshold) {
    this.frame = 4;
    this.ready = true;
  } else {
    this.ready = false;
  }
};
