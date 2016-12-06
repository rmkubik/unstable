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
    this.game_state.groups[properties.group].add(this);

    // if (properties.hasOwnProperty("cgroup") && properties.cgroup != null) {
    //   this.game_state.game.physics.p2.enable(this);
    //   this.body.setCollisionGroup(this.game_state.collision_groups[properties.cgroup]);
    // }
    //
    // if (properties.hasOwnProperty("rgroup") && properties.rgroup != null) {
    //   this.game_state.render_groups[properties.rgroup].add(this);
    // }
};

Unstable.Prefab.prototype = Object.create(Phaser.Sprite.prototype);
Unstable.Prefab.prototype.constructor = Unstable.Prefab;
