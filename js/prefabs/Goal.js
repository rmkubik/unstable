var Unstable = Unstable || {};

Unstable.Goal = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);
    game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.setSize(properties.width, properties.height,
      (this.width - properties.width)/2, (this.height - properties.height)/2);
    //colliderTest.visible = false;

    this.game_state = game_state;
    this.threshold = properties.threshold;

    this.emitter = new Unstable.Emitter(game_state, {x:this.x, y:this.y},{
      offset:{x:-12,y:12},
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
};

Unstable.Goal.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Goal.prototype.constructor = Unstable.Goal;

Unstable.Goal.prototype.emit = function(coin) {
  this.emitter.burst(coin.x, coin.y);
  var partsToGoal = function(goal) {
    goal.emitter.updateParticles(function(particle) {
      var seekGoalTween = this.game_state.game.add.tween(particle).to({x:goal.x, y:goal.y}, Phaser.Timer.SECOND);
      seekGoalTween.onComplete.add(function() {
        particle.kill();
      });
      seekGoalTween.start();
    })
  }
  game.time.events.add(Phaser.Timer.SECOND * 2, partsToGoal, this, this);
}

Unstable.Goal.prototype.ready = function() {
  if (this.game_state.coins >= this.threshold)
    return true;
  else
    return false;
}
