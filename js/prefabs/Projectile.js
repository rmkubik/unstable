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
};

Unstable.Projectile.prototype = Object.create(Unstable.Hazard.prototype);
Unstable.Projectile.prototype.constructor = Unstable.Projectile;

Unstable.Projectile.prototype.update = function() {
  // this.game_state.game.physics.arcade.collide(this, this.game_state.groups.colliders);
}
