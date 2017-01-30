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
      new Unstable.Cloud(game_state,{x:0,y:0},{
        texture: cloudName,
        group: "test"
      }));
    });
};

Unstable.BackdropManager.prototype.constructor = Unstable.BackdropManager;
