var Unstable = Unstable || {};

Unstable.Trigger = function(game_state, position, properties) {
  "use strict";
  Unstable.Prefab.call(this, game_state, position, properties);

  this.game_state = game_state;
  this.timesTriggered = 0;
  this.triggerCountAllowed = properties.triggerCountAllowed;
  this.triggerMethod = properties.triggerMethod;
}

Unstable.Trigger.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Trigger.prototype.constructor = Unstable.Trigger;

Unstable.Trigger.prototype.update = function () {
  // if (this.game_state.player)
  // if player collides with this, then execute trigger
  // set a flag to prevent trigger again
  // allow a property to set whether its a repeat trigger or not
};

Unstable.Trigger.prototype.trigger = function () {
  if (this.timesTriggered < this.triggerCountAllowed) {
    this[this.triggerMethod]();
    this.timesTriggered++;
  }
};

Unstable.Trigger.prototype.removeTiles = function () {
  //create "removeTile" objects in map file
  // this method will remove all tiles underneath them
  // and spawn any appropriate particles/effects/screenshakes/replacements
};
