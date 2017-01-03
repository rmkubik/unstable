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
};

Unstable.Goal.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Goal.prototype.constructor = Unstable.Goal;

Unstable.Goal.prototype.emit = function(coin) {

}

Unstable.Goal.prototype.ready = function() {
  if (this.game_state.coins >= this.threshold)
    return true;
  else
    return false;
}
