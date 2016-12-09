var Unstable = Unstable || {};

Unstable.BouncerHazard = function (game_state, position, properties) {
    "use strict";
    Unstable.Hazard.call(this, game_state, position, properties);

    // game_state.game.physics.arcade.enable(this);

    this.speed = properties.speed;
    // this.body.velocity.setTo(parseInt(properties.velocityX), parseInt(properties.velocityY));
    // this.body.bounce.set(1);
    this.body.collides(this.game_state.collision_groups["colliders"]);
    this.body.collides(this.game_state.collision_groups["players"]);
    this.body.fixedRotation = true;

    // this.body.setSize(18, 20, 3, 4);
    this.anchor.setTo(0.5);

    this.shadowOffset = 2;
    this.shadow = game.add.sprite(position.x, position.y + this.shadowOffset, "shadow");
    this.shadow.anchor.setTo(0.5,0.5);
    this.shadow.alpha = 0.4;
    this.game_state.groups["shadows"].add(this.shadow);

    this.animations.add("bomb_move", [0, 1, 2, 3], 8, true);
    this.animations.play("bomb_move");
};

Unstable.BouncerHazard.prototype = Object.create(Unstable.Hazard.prototype);
Unstable.BouncerHazard.prototype.constructor = Unstable.BouncerHazard;

Unstable.BouncerHazard.prototype.update = function() {
  this.game_state.game.physics.arcade.collide(this, this.game_state.groups.colliders);
  //this.angle += 4;
  if (this.body.velocity.x > 0) {
    this.scale.x = 1;
  } else {
    this.scale.x = -1;
  }

  this.shadow.x = this.x;
  this.shadow.y = this.y + this.shadowOffset;
}

Unstable.BouncerHazard.prototype.die = function() {
  this.kill();
  this.shadow.kill();
}
