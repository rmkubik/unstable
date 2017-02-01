var Unstable = Unstable || {};

Unstable.Cloud = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    this.speed = properties.speed;
    this.game_state = game_state;
};

Unstable.Cloud.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Cloud.prototype.constructor = Unstable.Cloud;

Unstable.Cloud.prototype.update = function() {
  if (this.x > this.game_state.game.width + this.width) {
    this.x = -this.width;
    this.y = this.game_state.game.rnd.integerInRange(
      -this.height/2,
      this.game_state.game.height + this.height/2
    );
    this.speed = (game_state.game.rnd.frac() * 0.6) + 0.1;
  } else {
    this.x += this.speed;
  }
}
