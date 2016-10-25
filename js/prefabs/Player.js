var Unstable = Unstable || {};

Unstable.Player = function(game_state, position, properties) {
  "use strict";
  Unstable.Prefab.call(this, game_state, position, properties);

  this.walking_speed = 150;
  this.jumping_speed = 30;
  this.bouncing = 5;

  this.game_state.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = true;

  this.body.height = 16;
  this.body.halfHeight = 8;
  this.anchor.setTo(0, 1);

  this.cursors = this.game_state.game.input.keyboard.createCursorKeys();
}

Unstable.Player.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Player.prototype.constructor = Unstable.Player;

Unstable.Player.prototype.update = function() {
  this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);

  if (this.cursors.right.isDown && this.body.velocity.x >= 0) {
      // move right
      this.body.velocity.x = this.walking_speed;
  } else if (this.cursors.left.isDown && this.body.velocity.x <= 0) {
      // move left
      this.body.velocity.x = -this.walking_speed;
  } else {
      // stop
      this.body.velocity.x = 0;
  }
  if (this.cursors.down.isDown && this.body.velocity.y >= 0) {
    //move down
    this.body.velocity.y = this.walking_speed;
  } else if (this.cursors.up.isDown && this.body.velocity.y <= 0) {
    //move up
    this.body.velocity.y = -this.walking_speed;
  } else {
    //stop
    this.body.velocity.y = 0;
  }
}
