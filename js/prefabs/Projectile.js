var Unstable = Unstable || {};

Unstable.Projectile = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);
    
    game_state.game.physics.arcade.enable(this);
};

Unstable.Projectile.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Projectile.prototype.constructor = Unstable.Projectile;
