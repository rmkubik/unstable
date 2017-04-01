var Unstable = Unstable || {};

Unstable.Trigger = function(game_state, position, properties) {
  "use strict";
  Unstable.Prefab.call(this, game_state, position, properties);
  game_state.game.physics.arcade.enable(this);
  this.body.immovable = true;
  this.body.setSize(properties.width, properties.height, -properties.width/2 + 12, -properties.height/2 + 12);
  console.log(this.body);
  console.log(this);

  this.game_state = game_state;
  this.timesTriggered = 0;
  this.triggerCountAllowed = properties.triggerCountAllowed;
  this.triggerFunction = properties.triggerFunction;
  this.triggerParams = JSON.parse(properties.triggerParams);

  this.explosionEmitter = new Unstable.Emitter(game_state, {x:this.x, y:this.y},{
    offset:{x: -12, y: 12},
    maxParticles: 30,
    width: 2,
    minParticleSpeed: {x: -40, y: -40},
    maxParticleSpeed: {x: 40, y: 40},
    gravity: 0,
    burst: true,
    lifetime: 5000,
    frequency: 30,
    particleClass: "fuse",
    scale: {
      minX: 1,
      maxX: 0,
      minY: 1,
      maxY: 0,
      rate: 5000,
      ease: Phaser.Easing.Exponential.In,
      yoyo: false
    }
  });
}

Unstable.Trigger.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Trigger.prototype.constructor = Unstable.Trigger;

Unstable.Trigger.prototype.trigger = function () {
  "use strict";
  if (this.timesTriggered < this.triggerCountAllowed) {
    this[this.triggerFunction]();
    this.timesTriggered++;
  }
};

Unstable.Trigger.prototype.removeTiles = function () {
  "use strict";
  console.log("TILES REMOVED at x:" + this.triggerParams.x + ", y: " + this.triggerParams.y);
  console.log(this.game_state.layers["base"]);
  // this.game_state.map.putTile(0, this.triggerParams.x, this.triggerParams.y, "base");
  this.game_state.map.removeTile(this.triggerParams.x, this.triggerParams.y, "base");
  this.explosionEmitter.burst(this.triggerParams.x * 24, this.triggerParams.y * 24);
  new Unstable.Collider(this.game_state, {
    x: this.triggerParams.x * 24,
    y: this.triggerParams.y * 24
  },
  {
    group: "colliders",
    texture: "",
    width: 24,
    height: 24
  });
  // this.game_state.groups.tilebreakers.forEach(function(tileBreaker) {
  //   tileBreaker.breakTiles();
  // } , this);
  // create "removeTile" objects in map file
  // this method will remove all tiles underneath them
  // and spawn any appropriate particles/effects/screenshakes/replacements
};
