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
    this.highScores = [];
    this.highScores[0] = game.add.text(position.x + 60, position.y, "0.000", style);
    this.highScores[1] = game.add.text(position.x + 120, position.y, "0.000", style);
    this.highScores[2] = game.add.text(position.x + 180, position.y, "0.000", style);

    this.drawHighScores();

    this.game_state = game_state;

    this.state = fsm(
        {
            playerUnmoved: {
                playerMoved: function() {
                    this.startTime = this.game_state.game.time.totalElapsedSeconds();
                    this.state.transition('playing');
                }.bind(this)
            },
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
        properties.paused ? 'playerUnmoved' : 'playing'
    );
};

Unstable.Timer.prototype.constructor = Unstable.Timer;

Unstable.Timer.prototype.update = function() {
    if (this.state.currentState === 'playing') {
        var time = this.game_state.game.time.totalElapsedSeconds() - this.startTime;
        this.text.setText(time.toFixed(3));
    }
}

Unstable.Timer.prototype.drawHighScores = function() {
    this.times = Unstable.globals.levels[Unstable.globals.current_level].times;
    this.times.forEach(function(time, index) {
        this.highScores[index].setText(time.toFixed(3));
    }.bind(this));
}

Unstable.Timer.prototype.pause = function() {
    this.state.action('pause');
}

Unstable.Timer.prototype.play = function() {
    this.state.action('play');
}

Unstable.Timer.prototype.playerMoved = function() {
    this.state.action('playerMoved');
}

Unstable.Timer.prototype.saveTime = function(levelKey) {
    var times = Unstable.globals.levels[levelKey].times.slice();
    times.push(this.game_state.game.time.totalElapsedSeconds() - this.startTime);
    times.sort();
    Unstable.globals.levels[levelKey].times = times.slice(0, 3);
    Unstable.saveProgress();
}
