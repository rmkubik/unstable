var Unstable = Unstable || {};

Unstable.SliderEnemy = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);

    this.cooldown = properties.cooldown;
    this.speed = properties.speed;
    this.minSpeed = properties.minSpeed;
    this.coolingDown = false;
    this.shotSpeed = 75;

    this.axis = properties.axis;
    this.firingOffsetTolerance = 10;
    this.prevDirection;

    switch (this.axis) {
        case 'x':
            this.angle = 90;
            this.anchor.setTo(0, 0.5);
            break;
        case 'y':
            this.angle = 0;
            this.anchor.setTo(0.5, 1);
            break;
        default:
            console.error('Invalid Slider Axis: ' + this.axis);
            break;
    }
};

Unstable.SliderEnemy.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.SliderEnemy.prototype.constructor = Unstable.SliderEnemy;

Unstable.SliderEnemy.prototype.update = function() {
    var projVelocity = {
        x: 0,
        y: 0
    }
    var projPosition = {
        x: this.position.x,
        y: this.position.y - this.body.height/2
    }
    switch (this.axis) {
        case 'x':
            if (this.y < this.game_state.player.y) {
                this.scale.x = 1;
                projVelocity.y = this.shotSpeed;
                projPosition.y = this.position.y + Unstable.Projectile.prototype.yBodyOffset;
            } else {
                this.scale.x = -1;
                projVelocity.y = -this.shotSpeed;
            }
            break;
        case 'y':
            if (this.x < this.game_state.player.x) {
                this.scale.x = 1;
                projVelocity.x = this.shotSpeed;
            } else {
                this.scale.x = -1;
                projVelocity.x = -this.shotSpeed;
            }
            break;
        default:
            console.error('Invalid Slider Axis: ' + this.axis);
            break;
    }

    var diff = this.game_state.player[this.axis] - this[this.axis];
    if (Math.abs(diff) <= this.firingOffsetTolerance && !this.coolingDown) {
        this.game_state.game.sound.play("sfx_turretShoot");
        new Unstable.Projectile(
          this.game_state,
          projPosition,
          projVelocity,
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
      var pos = {
          x: 0,
          y: 0
      }
      if (this.prevDirection === Math.sign(diff)) {
          pos[this.axis] = this.calculateSpeed(diff);
      } else if (this.prevDirection !== undefined) {
          this[this.axis] = this.game_state.player[this.axis];
      }
      this.body.velocity.setTo(pos.x, pos.y);
      this.prevDirection = Math.sign(diff);
    }
}

Unstable.SliderEnemy.prototype.calculateSpeed = function(playerDiff) {
    // console.log(
    //     Math.sign(playerDiff) * this.minSpeed
    //         + (this.speed - this.minSpeed)
    //         * (Math.abs(playerDiff) / 100)
    // );
    return Math.sign(playerDiff) * this.minSpeed
                + (this.speed - this.minSpeed)
                * (playerDiff / 100);
}

Unstable.SliderEnemy.prototype.resetCooldown = function() {
  this.coolingDown = false;
}
