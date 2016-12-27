var Unstable = Unstable || {};

Unstable.Emitter = function (game_state, position, properties) {
    "use strict";
    //  Create our bitmapData which we'll use as our particle texture
    var bmd = game.add.bitmapData(8, 8);
    bmd.context.fillStyle = "#FF0000";
    bmd.context.fillRect(0, 0, 4, 4);
    //  Put the bitmapData into the cache
    game.cache.addBitmapData('particleFuse', bmd);


    this.offset = properties.offset;
    this.emitter = game_state.game.add.emitter(position.x + this.offset.x, position.y + this.offset.y, 10);

    // this.emitter = game.add.emitter(game.world.centerX, 200, 200);
    this.emitter.width = 2;
    this.emitter.particleClass = Unstable.FuseParticle;
    this.emitter.makeParticles();

    this.minParticleSpeed = {};
    this.maxParticleSpeed = {};
    this.minParticleSpeed.x = 60;
    this.maxParticleSpeed.x = 80;
    this.minParticleSpeed.y = -10;
    this.maxParticleSpeed.y = -20;

    this.direction = -1;

    this.emitter.minParticleSpeed.set(this.minParticleSpeed.x, this.minParticleSpeed.y);
    this.emitter.maxParticleSpeed.set(this.maxParticleSpeed.x, this.maxParticleSpeed.y);

    this.emitter.setRotation(0, 0);
    // this.emitter.setScale(0.1, 1, 0.1, 1, 12000, Phaser.Easing.Quintic.Out);
    this.emitter.gravity = 5;
    this.emitter.start(false, 150, 65);
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

Unstable.FuseParticle = function (game, x, y) {
    Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleFuse'));
};

Unstable.FuseParticle.prototype = Object.create(Phaser.Particle.prototype);
Unstable.FuseParticle.prototype.constructor = Unstable.FuseParticle;
