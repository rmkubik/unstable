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
          // console.log("level prereq not completed: " + this.levelPrereq);
        }
      } else {
        // console.log("this level prereq does not exist: " + this.levelPrereq);
      }
    }

    this.displayTrophies = properties.displayTrophies;
    if (this.displayTrophies) {
        this.createTrophies(Unstable.globals.levels[this.levelLink]);
    }

    // Make sure level exists (so not Victory or Empty)
    if (Unstable.globals.levels[this.levelLink]) {
        var style = {
          font: "8px Arial",
          fill: "#FFFFFF",
          align: "center"
        };
        var text = game.add.text(
            this.x,
            this.y + 10,
            Unstable.globals.levels[this.levelLink].name,
            style
        );

        // Setting text.anchor to (0.5, 0.5) causes blurring
        // when width of text object is an odd value.
        // https://github.com/photonstorm/phaser/issues/2370
        // Instead manually offset the position of the text object
        // and round it to an integer value.
        text.x -= Math.round(text.width/2);
        text.y -= Math.round(text.height/2);
        // text.anchor.set(0.5);
    }
};

Unstable.Goal.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Goal.prototype.constructor = Unstable.Goal;

Unstable.Goal.prototype.emit = function(coin) {

}

Unstable.Goal.prototype.createTrophies = function(state) {
    var trophyManager = new TrophyManager();

    var completionTier = trophyManager.calcCompletionTrophy(state);
    this.trophy = this.createTrophy(0, trophyManager.sprites.completion[completionTier]);
    if (completionTier > 0) {
        this.bounceTrophy(this.trophy, true);
    }

    var timeTrialTier = trophyManager.calcTimeTrialTrophy(state);
    this.trophy2 = this.createTrophy(1, trophyManager.sprites.timeTrial[timeTrialTier]);
    if (timeTrialTier > 0) {
        this.bounceTrophy(this.trophy2, false);
    }
}

Unstable.Goal.prototype.createTrophy = function(slot, frame) {
    var x = this.x + (slot === 0 ? -6 : 6);

    var trophy = game.add.sprite(
        x,
        this.y - this.height / 2 - 16,
        "img_objects",
        frame
    );
    trophy.anchor.setTo(0.5, 1);
    trophy.scale.setTo(0.5, 0.5);
    return trophy;
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
