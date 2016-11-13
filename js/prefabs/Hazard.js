var Unstable = Unstable || {};

Unstable.Hazard = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);
};

Unstable.Hazard.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Hazard.prototype.constructor = Unstable.Hazard;
