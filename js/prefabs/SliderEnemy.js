var Unstable = Unstable || {};

Unstable.SliderEnemy = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    this.anchor.setTo(0.5, 0.5);

    this.cooldown = 3;
    this.speed = 90;
    this.coolingDown = false;
    this.axis = 'x';
    this.firingOffsetTolerance = 50;

};

Unstable.SliderEnemy.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.SliderEnemy.prototype.constructor = Unstable.SliderEnemy;

Unstable.SliderEnemy.prototype.update = function() {
  var diff = this.game_state.player.x - this.x;
  if (Math.abs(diff) <= this.firingOffsetTolerance && !this.coolingDown) {
      this.game_state.game.sound.play("sfx_turretShoot");
      new Unstable.Projectile(this.game_state, {x:this.position.x, y:this.position.y}, {x:75, y:0} ,{
        group:"hazards", texture:"enemy_sheet", frame:"4", speed:75, rgroup:"objects", pgroup:"hazards"
      });
      this.coolingDown = true;
      game.time.events.add(Phaser.Timer.SECOND * this.cooldown, this.resetCooldown, this);
  }
  // switch x/y axis
  // if player more than MAGICNUMBER units away in axis, move toward them
  // else stop and shoot
}

Unstable.SliderEnemy.prototype.resetCooldown = function() {
  this.coolingDown = false;
}
