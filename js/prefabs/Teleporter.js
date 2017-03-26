var Unstable = Unstable || {};

Unstable.Teleporter = function(game_state, position, properties) {
  "use strict";
  Unstable.Prefab.call(this, game_state, position, properties);
  game_state.game.physics.arcade.enable(this);
  this.body.immovable = true;

  this.game_state = game_state;
  this.id = properties.id;
  this.destId = properties.destId;

  this.emitter = new Unstable.Emitter(game_state, {x: this.x, y: this.y},{
    offset:{x: 0, y: -12},
    maxParticles: 30,
    width: 2,
    minParticleSpeed: {x: -40, y: -40},
    maxParticleSpeed: {x: 40, y: 40},
    gravity: 0,
    burst: true,
    lifetime: 0, //450
    frequency: 30,
    particleClass: "player"
  });
}

Unstable.Teleporter.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Teleporter.prototype.constructor = Unstable.Teleporter;
