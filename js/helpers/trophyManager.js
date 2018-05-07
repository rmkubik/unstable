function TrophyManager(state) {
    var initialCompletionTier = -1;
    var initialTimeTrialTier = -1;
    if (state) {
        initialCompletionTier = calcCompletionTrophy(state);
        initialTimeTrialTier = calcTimeTrialTrophy(state);
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
        calcCompletionTrophy: calcCompletionTrophy
    }
}
