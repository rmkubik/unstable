var Unstable = Unstable || {};

Unstable.Collider = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.width = properties.width;
    this.body.height = properties.height;
};

Unstable.Collider.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Collider.prototype.constructor = Unstable.Collider;
