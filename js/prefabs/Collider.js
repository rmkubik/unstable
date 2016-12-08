var Unstable = Unstable || {};

Unstable.Collider = function (game_state, position, properties) {
    "use strict";
    properties.texture="collision";
    Unstable.Prefab.call(this, game_state, position, properties);

    // game_state.game.physics.arcade.enable(this);
    // this.body.immovable = true;
    // this.body.width = properties.width;
    // this.body.height = properties.height;
    //colliderTest.visible = false;

    game_state.game.physics.p2.enable(this);
    this.body.setCollisionGroup(this.game_state.collision_groups[properties.cgroup]);
    this.body.collides(this.game_state.collision_groups["players"]);
    this.body.kinematic = true;

    // console.log(this.x + ":" + this.y + ":" + this.body.x + ":" + this.body.y);

};

Unstable.Collider.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Collider.prototype.constructor = Unstable.Collider;
