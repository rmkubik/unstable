var Unstable = Unstable || {};

Unstable.EndState = function () {
    "use strict";
    Phaser.State.call(this);
};

Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.prototype.constructor = Unstable.EndState;

Unstable.EndState.prototype.init = function (gameData) {
    "use strict";
    this.gameData = gameData;
    this.map = this.game.add.tilemap('lvl_finalCountdown');
    this.map.addTilesetImage("base", Unstable.globals.levels['lvl_finalCountdown'].tileset);
    this.map.addTilesetImage("collision", "collision");
};

Unstable.EndState.prototype.preload = function () {
    "use strict";

};

Unstable.EndState.prototype.create = function () {
    "use strict";

    this.layers = {};
    this.map.layers.forEach(function (layer) {
        if (!layer.properties.collision) {
          this.layers[layer.name] = this.map.createLayer(layer.name);
        }
    }, this);

    Unstable.Emitter.init();
    this.explosionEmitter = new Unstable.Emitter(this, { x: 0, y: 0 }, {
      offset: { x: -12, y: 12 },
      maxParticles: 500,
      width: 2,
      minParticleSpeed: { x: -40, y: -40 },
      maxParticleSpeed: { x: 40, y: 40 },
      gravity: 0,
      burst: true,
      lifetime: 5000,
      frequency: 30,
      particleClass: "fuse",
      scale: {
        minX: 1,
        maxX: 0,
        minY: 1,
        maxY: 0,
        rate: 5000,
        ease: Phaser.Easing.Exponential.In,
        yoyo: false
      }
    });


    var explosionEvent = game.time.events.repeat(Phaser.Timer.SECOND * 1, 2, function() {
        // this.game_state.map.removeTile(this.triggerParams.x, this.triggerParams.y, "base");

        // If we continuously set the repeatCount back to 2, it will loop infinitely
        // Setting repeat count to one will not queue infinitely.
        explosionEvent.repeatCount = 2;
        this.explosionEmitter.burst(
            game.rnd.integerInRange(0, game.width),
            game.rnd.integerInRange(0, game.height),
        );
    }, this);

    var style = {
      font: "16px Helvetica",
      fill: "#FFFFFF",
      align: "center"
    };
    var text = game.add.text(game.width / 2, game.height / 2 - 100,
        "You beat the final level! Thanks for playing!", style);
    text.anchor.set(0.5);
    text.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 2);

    // text = game.add.text(game.width / 2, game.height / 2 - 50,
    //     "Thanks for playing this beta version of the game.", style);
    // text.anchor.set(0.5);
    // text.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 2);

    text = game.add.text(game.width / 2, game.height / 2,
        "by: Ryan Kubik", style);
    text.anchor.set(0.5);
    text.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 2);

    var playButton = game.add.button(game.width / 2 - 24,
      game.height / 2 + 100, "buttonSheet", this.navToMenu, this, 8, 8, 9);
    playButton.scale.setTo(2);
};

Unstable.EndState.prototype.navToMenu = function() {
    Unstable.globals.showIntroduction = false;
    this.game.state.start("MenuState", true, false, this.gameData);
};
