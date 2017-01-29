var Unstable = Unstable || {};

Unstable.Cloud = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);
};

Unstable.Cloud.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Cloud.prototype.constructor = Unstable.Cloud;
