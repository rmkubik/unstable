var Unstable = Unstable || {};

Unstable.Cloud = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    this.speed = properties.speed;
};

Unstable.Cloud.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Cloud.prototype.constructor = Unstable.Cloud;

Unstable.Cloud.update = function() {
  this.x += this.speed;
}
