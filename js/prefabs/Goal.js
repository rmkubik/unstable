var Unstable = Unstable || {};

Unstable.Goal = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);
    game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    // this.body.setSize(properties.width, properties.height,
      // (this.width - properties.width)/2, (this.height - properties.height)/2);
    this.body.setSize(20, 6, 2, 18);
    this.anchor.setTo(0.5, 1);
    //colliderTest.visible = false;

    this.coinCount = 0;

    this.game_state = game_state;
    this.threshold = properties.threshold;
    this.levelLink = properties.link;
    this.levelPrereq = properties.levelPrereq;
    this.destGoalId = properties.destGoalId;
    if (this.levelPrereq === null || this.levelPrereq === "") {
      this.updateReady();
    } else {
      if (Unstable.globals.levels[this.levelPrereq] !== null) {
        if (Unstable.globals.levels[this.levelPrereq].completion > 0) {
          this.updateReady();
        } else {
          console.log("level prereq not completed: " + this.levelPrereq);
        }
      } else {
        console.log("this level prereq does not exist: " + this.levelPrereq);
      }
    }

    this.createTrophies();
};

Unstable.Goal.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Goal.prototype.constructor = Unstable.Goal;

Unstable.Goal.prototype.emit = function(coin) {

}

Unstable.Goal.prototype.createTrophies = function() {
    // victory
    this.trophy = game.add.sprite(this.x - 6, this.y - this.height / 2 - 16, "img_objects", 0);
    this.trophy.anchor.setTo(0.5, 1);
    this.trophy.scale.setTo(0.5, 0.5);
    this.bounceTrophy(this.trophy, true);

    // time trial on the leaderboard and quickest time trial
    this.trophy2 = game.add.sprite(this.x + 6, this.y - this.height / 2 - 16, "img_objects", 5);
    this.trophy2.anchor.setTo(0.5, 1);
    this.trophy2.scale.setTo(0.5, 0.5);
    this.bounceTrophy(this.trophy2, false);

    // //
    // this.trophy3 = game.add.sprite(this.x + 12, this.y - this.height / 2 - 16, "img_objects", 7);
    // this.trophy3.anchor.setTo(0.5, 1);
    // this.trophy3.scale.setTo(0.5, 0.5);
}

Unstable.Goal.prototype.bounceTrophy = function(trophy, startBouncingUp) {
    var bounce = {};
    bounce.top = 1;
    bounce.bottom = -2;

    var bounceUpTween = this.game_state.game.add.tween(trophy).to({
        x: trophy.x,
        y: trophy.y + bounce.top
    }, 1000);

    var bounceDownTween = this.game_state.game.add.tween(trophy).to({
        x: trophy.x,
        y: trophy.y + bounce.bottom
    }, 1000);

    bounceUpTween.onComplete.add(function() {
      bounceDownTween.start();
    });

    bounceDownTween.onComplete.add(function() {
      bounceUpTween.start();
    });

    if (startBouncingUp !== undefined) {
        if (startBouncingUp) {
            bounceUpTween.start();
        } else {
            bounceDownTween.start();
        }
    } else if (this.game_state.game.rnd.integerInRange(0, 1) === 0) {
      bounceUpTween.start();
    } else {
      bounceDownTween.start();
    }
}

Unstable.Goal.prototype.updateReady = function () {
  if (this.coinCount >= this.threshold) {
    this.frame = 9;
    this.ready = true;
  } else {
    this.ready = false;
  }
};
