var Unstable = Unstable || {};

Unstable.Timer = function (game_state, position, properties) {
    "use strict";
    if (!properties) {
        properties = {};
    }

    var style = {
      font: "16px Arial",
      fill: "#FFFFFF",
      align: "left"
    };
    this.text = game.add.text(position.x, position.y, "0.000", style);

    this.game_state = game_state;

    this.startTime = this.game_state.game.time.totalElapsedSeconds();
    this.state = fsm(
        {
            paused: {
                play: function() {
                    this.state.transition('playing');
                }.bind(this)
            },
            playing: {
                pause: function() {
                    this.state.transition('paused');
                }.bind(this)
            }
        },
        properties.paused ? 'paused' : 'playing'
    );
};

Unstable.Timer.prototype.constructor = Unstable.Timer;

Unstable.Timer.prototype.update = function() {
    if (this.state.currentState === 'playing') {
        var time = this.game_state.game.time.totalElapsedSeconds() - this.startTime;
        this.text.setText(time.toFixed(3));
    }
}

Unstable.Timer.prototype.pause = function() {
    this.state.action('pause');
}

Unstable.Timer.prototype.play = function() {
    this.state.action('play');
}

Unstable.Timer.prototype.saveTime = function(levelKey) {
    var times = Unstable.globals.levels[levelKey].times.slice();
    times.push(this.game_state.game.time.totalElapsedSeconds() - this.startTime);
    times.sort();
    Unstable.globals.levels[levelKey].times = times.slice(0, 3);
    Unstable.saveProgress();
}
