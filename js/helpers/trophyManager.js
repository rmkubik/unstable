function TrophyManager(state, gameState) {
    var initialCompletionTier = -1;
    var initialTimeTrialTier = -1;
    if (state) {
        initialCompletionTier = calcCompletionTrophy(state);
        initialTimeTrialTier = calcTimeTrialTrophy(state);
        var emitter = new Unstable.Emitter(gameState, {x: 100, y: 100},{
          offset:{x: 0, y: -12},
          maxParticles: 100,
          width: 2,
          minParticleSpeed: {x: -60, y: -60},
          maxParticleSpeed: {x: 60, y: 60},
          gravity: 0,
          burst: true,
          lifetime: 0, //450
          frequency: 50,
          particleClass: "coin",
          scale: {
            minX: 1,
            maxX: 0,
            minY: 1,
            maxY: 0,
            rate: 4500,
            ease: Phaser.Easing.Exponential.In,
            yoyo: false
          }
        });
    }

    var sprites = {
        completion: [7, 0],
        timeTrial: [7, 10, 2, 5]
    }

    function calcTimeTrialTrophy(state) {
        var trophyTier = 0;
        if (state.times.length > 0) {
            if (state.times[0].player) {
                trophyTier = 3;
            } else if (state.times[1].player) {
                trophyTier = 2;
            } else if (state.times[2].player) {
                trophyTier = 1;
            }
        }
        return trophyTier;
    }

    function calcCompletionTrophy(state) {
        return state.completion === 1 ? 1 : 0;
    }

    return {
        calcNewTrophies: function(newState) {
            var newTrophies = {
                count: 0
            };
            var newCompletionTier = calcCompletionTrophy(newState);
            var newTimeTrialTier = calcTimeTrialTrophy(newState);

            if (newCompletionTier > initialCompletionTier) {
                newTrophies['completion'] = newCompletionTier;
                newTrophies.count++;
            }

            if (newTimeTrialTier > initialTimeTrialTier) {
                newTrophies['timeTrial'] = newTimeTrialTier;
                newTrophies.count++;
            }

            return newTrophies;
        },
        calcTimeTrialTrophy: calcTimeTrialTrophy,
        calcCompletionTrophy: calcCompletionTrophy,
        displayTrophies: function(trophies, goal) {
            if (trophies.completion) {
                var trophy = gameState.game.add.sprite(
                    goal.x - 25,
                    goal.y - 50,
                    "img_objects",
                    sprites.completion[trophies.completion]
                );
                trophy.anchor.setTo(0.5, 1);
                gameState.game.add.tween(trophy).to(
                    {
                        x: goal.x,
                        y: goal.y,
                        width: 0,
                        height: 0
                    },
                    3 * Phaser.Timer.SECOND,
                    Phaser.Easing.Exponential.In,
                    true
                );


                emitter.burst(goal.x - 25, goal.y - 50);
            }
            if (trophies.timeTrial) {
                var trophy = gameState.game.add.sprite(
                    goal.x + 25,
                    goal.y - 50,
                    "img_objects",
                    sprites.timeTrial[trophies.timeTrial]
                );
                trophy.anchor.setTo(0.5, 1);
                gameState.game.add.tween(trophy).to(
                    {
                        x: goal.x,
                        y: goal.y,
                        width: 0,
                        height: 0
                    },
                    3 * Phaser.Timer.SECOND,
                    Phaser.Easing.Exponential.In,
                    true
                );

                emitter.burst(goal.x + 25, goal.y - 50);
            }
        },
        sprites: sprites
    }
}
