var Unstable = Unstable || {};

Unstable.Emitter = function (game_state, position, properties) {
    "use strict";
    this.offset = properties.offset;
    this.emitter = game_state.game.add.emitter(position.x + this.offset.x, position.y + this.offset.y, properties.maxParticles);

    this.emitter.width = properties.width;
    this.emitter.particleClass = Unstable.FuseParticle;
    this.emitter.makeParticles();

    this.minParticleSpeed = properties.minParticleSpeed;
    this.maxParticleSpeed = properties.maxParticleSpeed;

    this.direction = -1;

    this.emitter.minParticleSpeed.set(this.minParticleSpeed.x, this.minParticleSpeed.y);
    this.emitter.maxParticleSpeed.set(this.maxParticleSpeed.x, this.maxParticleSpeed.y);

    this.emitter.setRotation(0, 0);
    // this.emitter.setScale(0.1, 1, 0.1, 1, 12000, Phaser.Easing.Quintic.Out);
    this.emitter.gravity = properties.gravity;
    // this.emitter.start(false, 150, 65);
    this.lifetime = properties.lifetime;
    this.frequency = properties.frequency;
    if (!properties.burst) {
      this.emitter.start(properties.burst, properties.lifetime, properties.frequency);
    }
};

Unstable.Emitter.init = function() {
  //  Create our bitmapData which we'll use as our particle texture
  var bmd = game.add.bitmapData(8, 8);
  bmd.context.fillStyle = "#FF0000";
  bmd.context.fillRect(0, 0, 4, 4);
  //  Put the bitmapData into the cache
  game.cache.addBitmapData('particleFuse', bmd);
};

Unstable.Emitter.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Emitter.prototype.constructor = Unstable.Emitter;

Unstable.Emitter.prototype.updatePos = function(x, y) {
  this.emitter.x = x + this.offset.x * this.direction;
  this.emitter.y = y + this.offset.y;
}

Unstable.Emitter.prototype.flipDirection = function(direction) {
  this.direction = direction;
  this.emitter.minParticleSpeed.set(this.minParticleSpeed.x * direction, this.minParticleSpeed.y);
  this.emitter.maxParticleSpeed.set(this.maxParticleSpeed.x * direction, this.maxParticleSpeed.y);
}

Unstable.Emitter.prototype.burst = function(x, y) {
  this.updatePos(x, y);
  this.emitter.start(true, this.lifetime, 0, this.frequency);
}

Unstable.Emitter.prototype.destroy = function() {
  this.emitter.destroy();
}

Unstable.FuseParticle = function (game, x, y) {
    Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleFuse'));
};

Unstable.FuseParticle.prototype = Object.create(Phaser.Particle.prototype);
Unstable.FuseParticle.prototype.constructor = Unstable.FuseParticle;
