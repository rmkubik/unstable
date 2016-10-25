var Unstable = Unstable || {};

Unstable.Player = function(game_state, position, properties) {
  "use strict";
  Unstable.Prefab.call(this, game_state, position, properties);

}

Unstable.Player.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Player.prototype.constructor = Unstable.Player;
