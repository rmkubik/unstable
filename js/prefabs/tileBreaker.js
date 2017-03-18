var Unstable = Unstable || {};

Unstable.TileBreaker = function(game_state, position, properties) {
  "use strict";
  Unstable.Prefab.call(this, game_state, position, properties);
  // variable size and height to encompase multiple tiles?
  // particle and effect emitters live here?
}

Unstable.TileBreaker.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.TileBreaker.prototype.constructor = Unstable.TileBreaker;

//function to break appropriate tiles when triggered
