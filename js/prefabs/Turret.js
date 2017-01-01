var Unstable = Unstable || {};

Unstable.Turret = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;

    // this.turret = game.add.sprite(position.x + 12, position.y + 12, properties.texture, 0);
    // this.turret.anchor.setTo(0.5);
    this.range = 75;
    this.cooldown = 3;
    this.coolingDown = false;
    this.active = false;

    this.animations.add("turret_rise", [0, 1, 2, 3], 8);
    this.animations.add("turret_sink", [3, 2, 1, 0], 8);
    //this.animations.play("turret_rise");

};

Unstable.Turret.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Turret.prototype.constructor = Unstable.Turret;

Unstable.Turret.prototype.update = function() {
  //rotate turret
  // var rot = this.game_state.game.physics.arcade.angleBetween(this.turret, this.game_state.groups["player"].getTop());
  // this.turret.rotation = rot;

  if (this.game_state.game.physics.arcade.distanceBetween(this, this.game_state.player) < this.range) {
    if (!this.active) this.animations.play("turret_rise");
    this.active = true;
  } else {
    if (this.active) this.animations.play("turret_sink");
    this.active = false;
  }

  //shoot Projectile
  console.log(this.coolingDown + " : " + this.active);
  if (!this.coolingDown && this.active) {
    // new Unstable.Projectile(this.game_state, {x:this.position.x + 12, y:this.position.y + 12}, {group:"hazards", texture:"enemy_sheet", frame:"4", speed:75});
    if (!this.animations.currentAnim.isPlaying) {
      new Unstable.Projectile(this.game_state, {x:this.position.x + 12, y:this.position.y + 12}, {x:75, y:0} ,{
        group:"hazards", texture:"enemy_sheet", frame:"4", speed:75, rgroup:"objects", pgroup:"hazards"
      });
      new Unstable.Projectile(this.game_state, {x:this.position.x + 12, y:this.position.y + 12}, {x:-75, y:0} ,{
        group:"hazards", texture:"enemy_sheet", frame:"4", speed:75, rgroup:"objects", pgroup:"hazards"
      });
      new Unstable.Projectile(this.game_state, {x:this.position.x + 12, y:this.position.y + 12}, {x:0, y:75} ,{
        group:"hazards", texture:"enemy_sheet", frame:"4", speed:75, rgroup:"objects", pgroup:"hazards"
      });
      new Unstable.Projectile(this.game_state, {x:this.position.x + 12, y:this.position.y + 12}, {x:0, y:-75} ,{
        group:"hazards", texture:"enemy_sheet", frame:"4", speed:75, rgroup:"objects", pgroup:"hazards"
      });
      this.coolingDown = true;
      game.time.events.add(Phaser.Timer.SECOND * this.cooldown, this.resetCooldown, this);
    }
  }
}

Unstable.Turret.prototype.resetCooldown = function() {
  this.coolingDown = false;
}
