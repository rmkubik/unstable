var Unstable = Unstable || {};

Unstable.BouncerHazard = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);

    this.speed = properties.speed;
    this.body.velocity.setTo(parseInt(properties.velocityX), parseInt(properties.velocityY));
    this.body.bounce.set(1);

    this.body.setSize(14, 6, 5, 18);
    this.anchor.setTo(0.5, 1);

    this.shadowOffset = 2;
    this.shadow = game.add.sprite(position.x, position.y + this.shadowOffset, "shadow");
    this.shadow.anchor.setTo(0.5, 1);
    this.shadow.alpha = 0.4;
    this.game_state.groups["shadows"].add(this.shadow);

    this.animations.add("bomb_move", [0, 1, 2, 3], 8, true);
    this.animations.play("bomb_move");

    this.emitter = new Unstable.Emitter(game_state,{x:this.x,y:this.y},{
      offset:{x: 10,y: -18},
      maxParticles: 10,
      width: 2,
      minParticleSpeed: {x: 60, y: -10},
      maxParticleSpeed: {x: 80, y: -30},
      gravity: 5,
      burst: false,
      lifetime: 150,
      frequency: 65,
      particleClass: "fuse"
    });

    this.explosionEmitter = new Unstable.Emitter(game_state, {x:this.x, y:this.y},{
      offset:{x: 0, y: -12},
      maxParticles: 30,
      width: 2,
      minParticleSpeed: {x: -40, y: -40},
      maxParticleSpeed: {x: 40, y: 40},
      gravity: 0,
      burst: true,
      lifetime: 0,
      frequency: 30,
      particleClass: "fuse"
    });

    this.spawnpoint = {x: this.x, y: this.y};

    this.game_state.aliveBombCount++;
};

Unstable.BouncerHazard.prototype = Object.create(Unstable.Hazard.prototype);
Unstable.BouncerHazard.prototype.constructor = Unstable.BouncerHazard;

Unstable.BouncerHazard.prototype.update = function() {
  this.game_state.game.physics.arcade.collide(this, this.game_state.groups.colliders);
  //this.angle += 4;
  if (this.body.velocity.x > 0) {
    this.scale.x = 1;
    this.emitter.flipDirection(-1);
  } else {
    this.scale.x = -1;
    this.emitter.flipDirection(1);
  }

  this.shadow.x = this.x;
  this.shadow.y = this.y + this.shadowOffset;
  this.emitter.updatePos(this.x, this.y);
}

Unstable.BouncerHazard.prototype.die = function() {
  this.kill();
  this.shadow.kill();
  this.emitter.destroy();
  this.game_state.aliveBombCount--;
  this.explosionEmitter.burst(this.x, this.y);
  this.explosionEmitter.seekParticlesToLocation(this.spawnpoint);
}
