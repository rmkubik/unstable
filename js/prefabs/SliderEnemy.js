var Unstable = Unstable || {};

Unstable.SliderEnemy = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);
    this.anchor.setTo(0.5, 1);

    this.cooldown = 3;
    this.speed = 90;
    this.coolingDown = false;
    this.axis = 'x';
    this.firingOffsetTolerance = 10;
    this.prevDirection;

};

Unstable.SliderEnemy.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.SliderEnemy.prototype.constructor = Unstable.SliderEnemy;

Unstable.SliderEnemy.prototype.update = function() {
  var diff = this.game_state.player.y - this.y;
  if (Math.abs(diff) <= this.firingOffsetTolerance && !this.coolingDown) {
      this.game_state.game.sound.play("sfx_turretShoot");
      new Unstable.Projectile(
          this.game_state,
          {
              x: this.position.x,
              y: this.position.y - this.body.height/2
          },
          {
              x: 75,
              y: 0
          },
          {
              group: "hazards",
              texture: "enemy_sheet",
              frame: "4",
              speed: 75,
              rgroup: "objects",
              pgroup: "hazards"
          }
      );
      this.coolingDown = true;
      game.time.events.add(Phaser.Timer.SECOND * this.cooldown, this.resetCooldown, this);
  } else {
      var x = 0;
      var y = 0;
      if (this.prevDirection === Math.sign(diff)) {
          y = Math.sign(diff) * this.speed;
      } else if (this.prevDirection !== undefined) {
          this.y = this.game_state.player.y;
      }
      this.body.velocity.setTo(x, y);
      this.prevDirection = Math.sign(diff);
  }
  // switch x/y axis
  // if player more than MAGICNUMBER units away in axis, move toward them
  // else stop and shoot
}

Unstable.SliderEnemy.prototype.resetCooldown = function() {
  this.coolingDown = false;
}
