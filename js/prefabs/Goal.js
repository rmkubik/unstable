var Unstable = Unstable || {};

Unstable.Goal = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);
    game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.setSize(properties.width, properties.height,
      (this.width - properties.width)/2, (this.height - properties.height)/2);
    //colliderTest.visible = false;

    this.game_state = game_state;
    this.threshold = properties.threshold;
    this.levelLink = properties.link;
    this.levelPrereq = properties.levelPrereq;
    if (properties.threshold === 0) {
      this.ready = true;
    } else {
      this.ready = false;
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
