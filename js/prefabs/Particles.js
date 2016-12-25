var Unstable = Unstable || {};

Unstable.Emitter = function (game_state, position, properties) {
    "use strict";
    //  Create our bitmapData which we'll use as our particle texture
    var bmd = game.add.bitmapData(8, 8);
    bmd.context.fillStyle = "#FF0000";
    bmd.context.fillRect(0, 0, 3, 3);
    //  Put the bitmapData into the cache
    game.cache.addBitmapData('particleFuse', bmd);

    this.emitter = game_state.game.add.emitter(game_state.game.world.centerX, 200, 300);

    // this.emitter = game.add.emitter(game.world.centerX, 200, 200);
    this.emitter.width = 2;
    this.emitter.particleClass = Unstable.FuseParticle;
    this.emitter.makeParticles();
    this.emitter.minParticleSpeed.set(0, -10);
    this.emitter.maxParticleSpeed.set(0, -30);

    this.emitter.setRotation(0, 0);
    // this.emitter.setScale(0.1, 1, 0.1, 1, 12000, Phaser.Easing.Quintic.Out);
    this.emitter.gravity = 150;
    this.emitter.start(false, 400, 150);
};

Unstable.Emitter.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Emitter.prototype.constructor = Unstable.Emitter;

Unstable.Emitter.prototype.updatePos = function(x, y) {
  this.emitter.x = x;
  this.emitter.y = y;
}

Unstable.FuseParticle = function (game, x, y) {
    Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleFuse'));
};

Unstable.FuseParticle.prototype = Object.create(Phaser.Particle.prototype);
Unstable.FuseParticle.prototype.constructor = Unstable.FuseParticle;
