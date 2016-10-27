var Unstable = Unstable || {};

Unstable.Prefab = function (game_state, position, properties) {
    "use strict";
    console.log(this);
    if (properties.texture != null)
      Phaser.Sprite.call(this, game_state.game, position.x, position.y, properties.texture);
    else
      Phaser.Sprite.call(this, game_state.game, position.x, position.y);

    this.game_state = game_state;

    this.game_state.groups[properties.group].add(this);
};

Unstable.Prefab.prototype = Object.create(Phaser.Sprite.prototype);
Unstable.Prefab.prototype.constructor = Unstable.Prefab;
