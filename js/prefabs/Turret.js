var Unstable = Unstable || {};

Unstable.Turret = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);

    this.turret = game.add.sprite(position.x + 12, position.y + 12, properties.texture, 1);
    this.turret.anchor.setTo(0.5);
    this.range = 50;
    this.cooldown = 5;
    this.coolingDown = false;
};

Unstable.Turret.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Turret.prototype.constructor = Unstable.Turret;

Unstable.Turret.prototype.update = function() {
  //rotate turret
  var rot = this.game_state.game.physics.arcade.angleBetween(this, this.game_state.groups["player"].getTop());
  this.turret.rotation = rot;

  //shoot Projectile
  if (!this.coolingDown) {
    new Unstable.Projectile(this.game_state, {x:this.position.x + 12, y:this.position.y + 12}, this.turret, {group:"hazards", texture:"enemy_turret", frame:"2", speed:75});
    this.coolingDown = true;
    game.time.events.add(Phaser.Timer.SECOND * this.cooldown, this.resetCooldown, this);
  }
}

Unstable.Turret.prototype.resetCooldown = function() {
  this.coolingDown = false;
}
