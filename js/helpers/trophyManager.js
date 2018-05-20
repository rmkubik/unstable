function TrophyManager(state, gameState) {
    var initialCompletionTier = -1;
    var initialTimeTrialTier = -1;
    if (state) {
        initialCompletionTier = calcCompletionTrophy(state);
        initialTimeTrialTier = calcTimeTrialTrophy(state);
        var emitter = new Unstable.Emitter(gameState, {x: 100, y: 100},{
          offset: {x: 0, y: 0},
          maxParticles: 100,
          width: 2,
          minParticleSpeed: {x: -40, y: -40},
          maxParticleSpeed: {x: 40, y: 40},
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
        var lowestScore;
        // find lowest human highScore
        for (var i = 0; i < state.times.length; i++) {
            if (state.times[i].player) {
                lowestScore = state.times[i];
                break;
            }
        }

        var trophyTier = 0;
        // if any human score exists
        if (lowestScore) {
            if (lowestScore.time <= state.timeTrialTiers.gold) {
                trophyTier = 3;
            } else if (lowestScore.time <= state.timeTrialTiers.silver) {
                trophyTier = 2;
            } else if (lowestScore.time <= state.timeTrialTiers.bronze) {
                trophyTier = 1;
            }
        }
        return trophyTier;
    }

    function calcCompletionTrophy(state) {
        return state.completion === 1 ? 1 : 0;
    }

    function tweenTrophy(trophy, goal) {
        var originalHeight = trophy.height;
        var originalWidth = trophy.width;
        trophy.height = 0;
        trophy.width = 0;
        var tweenIn = gameState.game.add.tween(trophy).to(
            {
                width: originalWidth,
                height: originalHeight
            },
            0.25 * Phaser.Timer.SECOND,
            Phaser.Easing.Linear.In
        );
        var tweenOut = gameState.game.add.tween(trophy).to(
            {
                x: goal.x,
                y: goal.y,
                width: 0,
                height: 0
            },
            2.75 * Phaser.Timer.SECOND,
            Phaser.Easing.Exponential.In
        );
        tweenIn.chain(tweenOut);
        tweenIn.start();
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
                trophy.anchor.setTo(0.5, 0.5);
                tweenTrophy(trophy, goal);

                emitter.burst(goal.x - 25, goal.y - 50);
            }
            if (trophies.timeTrial) {
                var trophy = gameState.game.add.sprite(
                    goal.x + 25,
                    goal.y - 50,
                    "img_objects",
                    sprites.timeTrial[trophies.timeTrial]
                );
                trophy.anchor.setTo(0.5, 0.5);
                tweenTrophy(trophy, goal);

                emitter.burst(goal.x + 25, goal.y - 50);
            }
        },
        sprites: sprites
    }
}
