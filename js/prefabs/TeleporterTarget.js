var Unstable = Unstable || {};

Unstable.TeleporterTarget = function(game_state, position, properties) {
  "use strict";
  Unstable.Prefab.call(this, game_state, position, properties);
  // game_state.game.physics.arcade.enable(this);
  // this.body.immovable = true;
  this.anchor.setTo(0.5, 1);

  this.id = properties.id;
}

Unstable.TeleporterTarget.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.TeleporterTarget.prototype.constructor = Unstable.TeleporterTarget;
