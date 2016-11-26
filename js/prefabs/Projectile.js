var Unstable = Unstable || {};

Unstable.Projectile = function (game_state, position, velocity, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);

    this.anchor.setTo(0.5);
    this.body.setSize(7, 4, 9, 10);

    //this.rotation = turret.rotation;
    //game.physics.arcade.velocityFromRotation(this.rotation, properties.speed, this.body.velocity);
    this.body.velocity.x = velocity.x;
    this.body.velocity.y = velocity.y;

    this.shadowOffset = -6;
    this.shadow = game.add.sprite(position.x, position.y + this.shadowOffset, "shadow", 2);
    this.shadow.anchor.setTo(0.5);
    this.shadow.alpha = 0.4;
    this.game_state.groups["shadows"].add(this.shadow);
};

Unstable.Projectile.prototype = Object.create(Unstable.Hazard.prototype);
Unstable.Projectile.prototype.constructor = Unstable.Projectile;

Unstable.Projectile.prototype.update = function() {
  // this.game_state.game.physics.arcade.collide(this, this.game_state.groups.colliders);
  this.shadow.x = this.x;
  this.shadow.y = this.y + this.shadowOffset;
}

Unstable.Projectile.prototype.die = function() {
  this.kill();
  this.shadow.kill();
}
