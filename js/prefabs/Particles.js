var Unstable = Unstable || {};

Unstable.Emitter = function (game_state, position, properties) {
    "use strict";
    this.game_state = game_state;
    this.offset = properties.offset;
    this.emitter = game_state.game.add.emitter(position.x + this.offset.x, position.y + this.offset.y, properties.maxParticles);

    this.emitter.width = properties.width;
    switch (properties.particleClass) {
      case "fuse":
        this.emitter.particleClass = Unstable.FuseParticle;
        break;
      case "coin":
        this.emitter.particleClass = Unstable.CoinParticle;
        break;
      case "player":
        this.emitter.particleClass = Unstable.PlayerParticle;
        break;
      case "bridge":
        this.emitter.particleClass = Unstable.BridgeParticle;
        break;
      default:
        console.log("invalid particle class");
        break;
    }
    this.emitter.makeParticles();

    this.minParticleSpeed = properties.minParticleSpeed;
    this.maxParticleSpeed = properties.maxParticleSpeed;

    this.direction = -1;

    if (properties.scale !== undefined) {
      this.emitter.setScale(
        properties.scale.minX,
        properties.scale.maxX,
        properties.scale.minY,
        properties.scale.maxY,
        properties.scale.rate,
        properties.scale.ease,
        properties.scale.yoyo
      );
    }

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

  var bmd2 = game.add.bitmapData(8, 8);
  bmd2.context.fillStyle = "#E7CE2F";
  bmd2.context.fillRect(0, 0, 4, 4);
  //  Put the bitmapData into the cache
  game.cache.addBitmapData('particleCoin', bmd2);

  var bmd3 = game.add.bitmapData(8, 8);
  bmd3.context.fillStyle = "#FFFFFF";
  bmd3.context.fillRect(0, 0, 4, 4);
  //  Put the bitmapData into the cache
  game.cache.addBitmapData('particlePlayer', bmd3);

  var bmd4 = game.add.bitmapData(8, 8);
  bmd4.context.fillStyle = "#663C0F";
  bmd4.context.fillRect(0, 0, 4, 4);
  //  Put the bitmapData into the cache
  game.cache.addBitmapData('particleBridgeLight', bmd4);

  var bmd5 = game.add.bitmapData(8, 8);
  bmd5.context.fillStyle = "#4E3313";
  bmd5.context.fillRect(0, 0, 4, 4);
  //  Put the bitmapData into the cache
  game.cache.addBitmapData('particleBridgeDark', bmd5);
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

Unstable.Emitter.prototype.updateParticles = function(updateFunc) {
  this.emitter.forEach(updateFunc, this);
}

Unstable.Emitter.prototype.destroy = function() {
  this.emitter.destroy();
}

Unstable.Emitter.prototype.returnToSpawn = function(prefab) {
  this.burst(prefab.x, prefab.y);
  var partsToSpawn = function(spawn) {
    this.updateParticles(function(particle) {
      var seekSpawnTween = this.game_state.game.add.tween(particle).to({x:spawn.x, y:spawn.y}, 0.5 * Phaser.Timer.SECOND);
      seekSpawnTween.onComplete.add(function() {
        particle.kill();
        this.game_state.restart_level();
      }, this);
      seekSpawnTween.start();
    })
  }
  game.time.events.add(Phaser.Timer.SECOND, partsToSpawn, this, prefab.spawnpoint);
}

Unstable.Emitter.prototype.seekParticlesToLocation = function (location, callback, context, param) {
  var initialDelay = 1;
  var travelTime = 0.5;
  param = param || null;
  var partsToLocation = function(location) {
    this.updateParticles(function(particle) {
      var seekLocationTween = this.game_state.game.add.tween(particle)
        .to({x:location.x, y:location.y}, travelTime * Phaser.Timer.SECOND);
      seekLocationTween.onComplete.add(function() {
        particle.kill();
      }, this);
      seekLocationTween.start();
    });
    if (callback !== undefined && callback !== null) {
      game.time.events.add(travelTime * Phaser.Timer.SECOND, callback, context, param);
      // callback.call(context);
    }
  }
  game.time.events.add(initialDelay * Phaser.Timer.SECOND, partsToLocation, this, location);
};

Unstable.BridgeParticle = function (game, x, y) {
    Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleBridgeLight'));
};

Unstable.BridgeParticle.prototype = Object.create(Phaser.Particle.prototype);
Unstable.BridgeParticle.prototype.constructor = Unstable.BridgeParticle;

Unstable.FuseParticle = function (game, x, y) {
    Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleFuse'));
};

Unstable.FuseParticle.prototype = Object.create(Phaser.Particle.prototype);
Unstable.FuseParticle.prototype.constructor = Unstable.FuseParticle;

Unstable.CoinParticle = function (game, x, y) {
    Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleCoin'));
};

Unstable.CoinParticle.prototype = Object.create(Phaser.Particle.prototype);
Unstable.CoinParticle.prototype.constructor = Unstable.CoinParticle;

Unstable.PlayerParticle = function (game, x, y) {
    Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particlePlayer'));
};

Unstable.PlayerParticle.prototype = Object.create(Phaser.Particle.prototype);
Unstable.PlayerParticle.prototype.constructor = Unstable.PlayerParticle;
