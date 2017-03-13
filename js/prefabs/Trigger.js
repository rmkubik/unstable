var Unstable = Unstable || {};

Unstable.Trigger = function(game_state, position, properties) {
  "use strict";

}

Unstable.Trigger.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Trigger.prototype.constructor = Unstable.Trigger;

Unstable.Trigger.prototype.trigger = function () {
  console.error("Trigger method not set!");
};
