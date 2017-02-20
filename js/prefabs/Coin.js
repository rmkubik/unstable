var Unstable = Unstable || {};

Unstable.Coin = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);
    game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.setSize(10, 10, 7, 10);
    this.anchor.setTo(0.5, 1);
    //colliderTest.visible = false;
    //test comment for commit

    this.game_state = game_state;

    this.bounce = {};
    this.bounce.top = 1;
    this.bounce.bottom = -2;

    this.shadowOffset = -1;
    this.shadow = game.add.sprite(position.x, position.y + this.shadowOffset, "shadow", 1);
    this.shadow.anchor.setTo(0.5, 1);
    this.shadow.alpha = 0.4;
    this.game_state.groups["shadows"].add(this.shadow);

    var bounceUpTween = this.game_state.game.add.tween(this).to({x:this.x, y:this.y+this.bounce.top},700);
    var bounceDownTween = this.game_state.game.add.tween(this).to({x:this.x, y:this.y+this.bounce.bottom},700);
    bounceUpTween.onComplete.add(function() {
      bounceDownTween.start();
    })
    bounceDownTween.onComplete.add(function() {
      bounceUpTween.start();
    })
    var upOrDown = game_state.game.rnd.integerInRange(0, 1);
    if (upOrDown === 0)
      bounceUpTween.start();
    else
      bounceDownTween.start();

    this.emitter = new Unstable.Emitter(game_state, {x:this.x, y:this.y},{
      offset:{x: 0, y: -12},
      maxParticles:100,
      width: 2,
      minParticleSpeed: {x: -40, y: -40},
      maxParticleSpeed: {x: 40, y: 40},
      gravity: 0,
      burst: true,
      lifetime: 0, //450
      frequency: 10,
      particleClass: "coin"
    });

    this.spawnpoint = {x: this.x, y: this.y};
};

Unstable.Coin.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Coin.prototype.constructor = Unstable.Coin;

Unstable.Coin.prototype.update = function() {

}

Unstable.Coin.prototype.die = function() {
  this.emitter.burst(this.x, this.y);
  this.game_state.goals.forEach(function(goal){
    this.emitter.seekParticlesToLocation({x:goal.x, y:goal.y}, this.reachedGoal, this);
  }, this);
  this.game_state.game.sound.play("sfx_coin");
  this.kill();
  this.shadow.kill();
}

Unstable.Coin.prototype.reachedGoal = function() {
  this.game_state.coins += 1;
  this.game_state.goals.forEach(function(goal) {
    if (!goal.ready) {
      goal.updateReady();
    }
  });
}
