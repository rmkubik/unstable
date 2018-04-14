var Unstable = Unstable || {};

Unstable.Scenery = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.anchor.setTo(0.5, 1);
    this.body.checkCollision.left = false;
    this.body.checkCollision.right = false;

    if (properties.texture == "tree1") {
      this.body.setSize(4, 6, 10, 42);
    } else if (properties.texture == "tree2") {
      this.body.setSize(4, 6, 14, 42);
    } else if (properties.texture == "tree3") {
      this.body.setSize(4, 6, 6, 42);
    } else if (properties.texture == "tree4") {
      this.body.setSize(4, 6, 6, 42);
    } else if (properties.texture == "bush1") {
      this.body.setSize(24, 4, 0, 20);
    } else if (properties.texture == "bush2") {
      this.body.setSize(24, 4, 0, 20);
    } else if (properties.texture == "bush3") {
      this.body.setSize(24, 4, 0, 20);
  } else if (properties.texture == "sensor") {
      this.body.setSize(24, 4, 0, 20);
  }

};

Unstable.Scenery.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Scenery.prototype.constructor = Unstable.Turret;
