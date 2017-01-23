var Unstable = Unstable || {};

Unstable.Scenery = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;

    if (properties.texture == "tree1") {
      this.body.setSize(4, 4, 10, 44);
    } else if (properties.texture == "tree2") {
      this.body.setSize(4, 4, 10, 44);
    } else if (properties.texture == "tree3") {
      this.body.setSize(4, 4, 10, 44);
    } else if (properties.texture == "tree4") {
      this.body.setSize(4, 4, 10, 44);
    } else if (properties.texture == "bush1") {
      this.body.setSize(24, 8, 0, 16);
    } else if (properties.texture == "bush2") {
      this.body.setSize(24, 8, 0, 16);
    } else if (properties.texture == "bush3") {
      this.body.setSize(24, 8, 0, 16);
    }

};

Unstable.Scenery.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Scenery.prototype.constructor = Unstable.Turret;
