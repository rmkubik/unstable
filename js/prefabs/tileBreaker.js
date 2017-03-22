var Unstable = Unstable || {};

Unstable.TileBreaker = function(game_state, position, properties) {
  "use strict";
  Unstable.Prefab.call(this, game_state, position, properties);
  game_state.game.physics.arcade.enable(this);
  this.body.immovable = true;
  // variable size and height to encompase multiple tiles?
  // particle and effect emitters live here?
  this.game_state = game_state;
}

Unstable.TileBreaker.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.TileBreaker.prototype.constructor = Unstable.TileBreaker;

//function to break appropriate tiles when triggered
Unstable.TileBreaker.prototype.breakTiles = function () {
  console.log(this.game_state.layers["base"] );
  this.game_state.game.physics.arcade.collide(this, this.game_state.layers["base"], function(breaker, tiles){console.log(tiles)}, null, this);
};
