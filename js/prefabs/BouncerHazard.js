var Unstable = Unstable || {};

Unstable.BouncerHazard = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);

    this.speed = properties.speed;
    this.body.velocity.setTo(parseInt(properties.velocityX), parseInt(properties.velocityY));
    this.body.bounce.set(1);
};

Unstable.BouncerHazard.prototype = Object.create(Unstable.Hazard.prototype);
Unstable.BouncerHazard.prototype.constructor = Unstable.BouncerHazard;

Unstable.BouncerHazard.prototype.update = function() {
  this.game_state.game.physics.arcade.collide(this, this.game_state.groups.colliders);
}
//
// Unstable.BouncerHazard.collide = function(bouncer, other) {
//   this.bounce();
// }
//
// Unstable.BouncerHazard.bounce = function() {
//
// }
