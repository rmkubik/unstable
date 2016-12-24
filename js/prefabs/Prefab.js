var Unstable = Unstable || {};

Unstable.Prefab = function (game_state, position, properties) {
    "use strict";
    if (properties.texture != null) {
      if (properties.frame != null)
        Phaser.Sprite.call(this, game_state.game, position.x, position.y, properties.texture, parseInt(properties.frame));
      else
        Phaser.Sprite.call(this, game_state.game, position.x, position.y, properties.texture);
    } else {
      Phaser.Sprite.call(this, game_state.game, position.x, position.y);
    }

    this.game_state = game_state;

    console.log(properties.rgroup + ":" + properties.group);
    if (properties.rgroup != null)
      this.game_state.groups[properties.rgroup].add(this);
    else {
      this.game_state.groups[properties.group].add(this);
    }

    if (properties.pgroup != null)
      this.pgroup = properties.pgroup;
};

Unstable.Prefab.prototype = Object.create(Phaser.Sprite.prototype);
Unstable.Prefab.prototype.constructor = Unstable.Prefab;
