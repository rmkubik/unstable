function TrophyManager() {
    // var initiallyCompleted = state.completion === 1;
    // var times = state.times;

    return {
        render: function(newState) {

        },
        calcTimeTrialTrophy: function(state) {
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
        },
        calcCompletionTrophy: function(state) {
            return state.completion === 1 ? 1 : 0;
        }
    }
}
