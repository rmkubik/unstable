var Unstable = Unstable || {};

Unstable.Hazard = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    // game_state.game.physics.arcade.enable(this);
    game_state.game.physics.p2.enable(this);

    console.log(properties);
    this.body.setCollisionGroup(this.game_state.collision_groups[properties.cgroup]);
    this.game_state.render_groups[properties.rgroup].add(this);
    this.body.collides(this.game_state.collision_groups["players"]);
};

Unstable.Hazard.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Hazard.prototype.constructor = Unstable.Hazard;

Unstable.Hazard.prototype.die = function() {
  this.kill();
}
