var Unstable = Unstable || {};

Unstable.Timer = function (game_state, position, properties) {
    "use strict";
    // Unstable.Prefab.call(this, game_state, position, properties);

    var style = {
      font: "16px Arial",
      fill: "#FFFFFF",
      align: "left"
    };
    this.text = game.add.text(position.x, position.y, "0.000", style);

    // game_state.game.physics.arcade.enable(this);
    // this.body.immovable = true;
    // this.body.setSize(properties.width, properties.height, 0, 0);

    this.game_state = game_state;
    this.paused = false;

    this.startTime = this.game_state.game.time.totalElapsedSeconds();
};

// Unstable.Timer.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Timer.prototype.constructor = Unstable.Timer;

Unstable.Timer.prototype.update = function() {
    if (!this.paused) {
        var time = this.game_state.game.time.totalElapsedSeconds() - this.startTime;
        this.text.setText(time.toFixed(3));
    }
}

Unstable.Timer.prototype.pause = function() {
    this.paused = true;
}

Unstable.Timer.prototype.saveTime = function(levelKey) {
    var times = Unstable.globals.levels[levelKey].times.slice();
    times.push(this.game_state.game.time.totalElapsedSeconds() - this.startTime);
    times.sort();
    Unstable.globals.levels[levelKey].times = times.slice(0, 3);
    Unstable.saveProgress();
}