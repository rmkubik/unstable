var Unstable = Unstable || {};

Unstable.Coin = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);
    game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.setSize(9, 9, 7.5, 7.5);
    //colliderTest.visible = false;
    //test comment for commit

    this.game_state = game_state;

    this.bounce = {};
    this.bounce.top = 1;
    this.bounce.bottom = -2;

    this.shadowOffset = -1;
    this.shadow = game.add.sprite(position.x, position.y + this.shadowOffset, "shadow", 1);
    this.shadow.anchor.setTo(0);
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
};

Unstable.Coin.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Coin.prototype.constructor = Unstable.Coin;

Unstable.Coin.prototype.update = function() {

}

Unstable.Coin.prototype.die = function() {
  var emitGoals = function(goal) {
    goal.emit(this);
  }
  this.game_state.goals.forEach(emitGoals, this);
  this.kill();
  this.shadow.kill();
}
