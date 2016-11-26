var Unstable = Unstable || {};

Unstable.Coin = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);
    game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.setSize(9, 9, 7.5, 7.5);
    //colliderTest.visible = false;

    this.shadowOffset = 2;
    this.shadow = game.add.sprite(position.x, position.y + this.shadowOffset, "shadow");
    this.shadow.anchor.setTo(0);
    this.shadow.alpha = 0.4;
    this.game_state.groups["shadows"].add(this.shadow);
};

Unstable.Coin.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Coin.prototype.constructor = Unstable.Coin;

Unstable.Coin.prototype.die = function() {
  this.kill();
  this.shadow.kill();
}
