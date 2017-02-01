var Unstable = Unstable || {};

Unstable.BackdropManager = function (game_state) {
    "use strict";

    var cloudNames = [
      "cloud1",
      "cloud2",
      "cloud3",
      "cloud4",
      "cloud5",
      "cloud6",
      "cloud7",
      "cloud8",
      "cloud9",
      "cloud10"
    ]
    cloudNames.forEach(function(cloudName) {
      new Unstable.Cloud(game_state,
        {
          x: game_state.game.rnd.integerInRange(-50, game_state.game.width + 50),
          y: game_state.game.rnd.integerInRange(-30, game_state.game.height + 30)
        },
        {
          texture: cloudName,
          speed: (game_state.game.rnd.frac() * 0.6) + 0.1,
          group: "clouds"
        }
      );
    });
};

Unstable.BackdropManager.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.BackdropManager.prototype.constructor = Unstable.BackdropManager;
