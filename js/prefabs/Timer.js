var Unstable = Unstable || {};

Unstable.Timer = function (game_state, position, properties) {
    "use strict";
    if (!properties) {
        properties = {};
    }

    this.game_state = game_state;

    var style = {
      font: "16px Arial",
      fill: "#FFFFFF",
      stroke: "#000000",
      strokeThickness: 1,
      align: "left"
    };
    this.text = game.add.text(position.x, position.y, "0.000", style);
    this.text.setShadow(0, 0, 'rgba(0, 0, 0, 1)', 3);
    this.highScores = [];
    this.highScores[0] = game.add.text(position.x + 120, position.y, "0.000", style);
    this.highScores[1] = game.add.text(position.x + 180, position.y, "0.000", style);
    this.highScores[2] = game.add.text(position.x + 240, position.y, "0.000", style);
    this.highScores.forEach(function(highScore) {
        highScore.setShadow(0, 0, 'rgba(0, 0, 0, 1)', 3);
    });

    this.drawHighScores();

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
        this.highScores[index].setText(time.time.toFixed(3));
        if (index === 0) {
            this.highScores[index].addColor('#E7CE2F', 0);
        } else if (index === 1) {
            this.highScores[index].addColor('#D6D6FE', 0);
        } else {
            this.highScores[index].addColor('#E99353', 0);
        }
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

Unstable.Timer.prototype.blink = function() {
    var blinkSpeed = 0.3 * Phaser.Timer.SECOND;

    this.text.setStyle({
        font: "24px Arial",
        fill: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 1,
        align: "left"
    });
    this.text.setShadow(0, 0, 'rgba(0, 0, 0, 1)', 3);

    this.timer = game.time.create(false);
    this.timer.loop(blinkSpeed, function() {
        this.text.visible = !this.text.visible;
    }, this);
    this.timer.start();
}

Unstable.Timer.prototype.saveTime = function(levelKey) {
    var newTime = {
        time: this.game_state.game.time.totalElapsedSeconds() - this.startTime,
        name: "player",
        player: true
    };
    var times = Unstable.globals.levels[levelKey].times.slice();
    this.newHighScore = times.some(function(time) {
        return newTime.time < time.time;
    }); // TODO: update this logic
    if (times.length < 3) { // TODO: Update this logic
        this.newHighScore = true;
    }
    if (times.length > 0) {
        this.highestScore = newTime.time < times[0].time;
    } else {
        this.highestScore = true;
    }

    if (this.newHighScore) {
        this.blink();
    }

    times.push(newTime);
    times.sort(function(a, b) {
        return a.time - b.time;
    });
    Unstable.globals.levels[levelKey].times = times.slice(0, 3);
    Unstable.saveProgress();
}
