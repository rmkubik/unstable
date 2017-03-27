var Unstable = Unstable || {};

Unstable.Teleporter = function(game_state, position, properties) {
  "use strict";
  Unstable.Prefab.call(this, game_state, position, properties);
  game_state.game.physics.arcade.enable(this);
  this.body.immovable = true;

  this.game_state = game_state;
  this.id = properties.id;
  this.destId = properties.destId;
}

Unstable.Teleporter.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Teleporter.prototype.constructor = Unstable.Teleporter;
