var Unstable = Unstable || {};

Unstable.Teleporter = function(game_state, position, properties) {
  "use strict";
  Unstable.Prefab.call(this, game_state, position, properties);
  game_state.game.physics.arcade.enable(this);
  this.body.immovable = true;
  this.anchor.setTo(0.5, 1);

  this.game_state = game_state;
  this.targetTile = JSON.parse(properties.targetTile);
}

Unstable.Teleporter.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Teleporter.prototype.constructor = Unstable.Teleporter;
