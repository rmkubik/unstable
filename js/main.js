var Unstable = Unstable || {};

Unstable.version = "1.0.0";

/**
 * category - LevelName | Volume
 * action - Start | Finish | Die | Medal | Mute
 * label - LevelName | Time | Deaths/Level
 */
Unstable.track = function (category, action, label, value) {
    gtag(
        'event',
        action,
        {
            'event_category': category,
            'event_label': label,
            'value': value
        }
    );
}

Unstable.trackLevel = function (level) {
    if (Unstable.globals.levels.hasOwnProperty(level)) {
        Unstable.globals.levels[level].times.forEach(function (time) {
            if (time.player) {
                Unstable.track('level', 'completed', Unstable.globals.levels[level].key, time.time);
            }
        });

        if (level.completion === 1) {
            if (Unstable.globals.levels[level].key === "lvl_tight") {
                Unstable.track('level', 'completed', 'lvl_hub1');
            }

            if (Unstable.globals.levels[level].key === "lvl_sticks") {
                Unstable.track('level', 'completed', 'lvl_hub2');
            }

            if (
                Unstable.globals.levels[level].key === "lvl_finalCountdown"
            ) {
                Unstable.track('level', 'completed', 'lvl_hub3');
            }
        }
    }
}

Unstable.saveProgress = function () {
    Unstable.sendScores();
    if (Unstable.isLocalStorageAvailable()) {
        var saveState = Unstable.createSaveState();
        localStorage.setItem(
            "com.ryankubik.unstable.saveState",
            JSON.stringify(saveState)
        );
    } else {
        console.log(
            "Saving game state failed - local storage is not available"
        );
    }
};

Unstable.resetProgress = function () {
    if (Unstable.isLocalStorageAvailable()) {
        var gameDataText = game.cache.getText("game_data");
        var gameData = JSON.parse(gameDataText);

        this.globals.current_level = "lvl_hub1";
        this.globals.levels = gameData.levels;
        this.globals.showIntroduction = true;
        Unstable.saveProgress();
    } else {
        console.log(
            "Resetting game state failed - local storage is not available"
        );
    }
};

Unstable.backupProgress = function () {
    if (Unstable.isLocalStorageAvailable()) {
        var saveState = localStorage.getItem(
            "com.ryankubik.unstable.saveState"
        );
        localStorage.setItem(
            "com.ryankubik.unstable.saveState.backup",
            saveState
        );
    }
};

Unstable.removeSave = function () {
    if (Unstable.isLocalStorageAvailable()) {
        localStorage.removeItem("com.ryankubik.unstable.saveState");
    }
};

Unstable.createSaveState = function () {
    var saveState = {};

    saveState.current_level = this.globals.current_level;
    saveState.levels = this.globals.levels;
    saveState.showIntroduction = this.globals.showIntroduction;
    saveState.volume = this.globals.audio.getVolumeObject();
    saveState.version = Unstable.version;

    return saveState;
};

Unstable.sendScores = function () {
    kongregate.stats.submit("initialized", 1);

    Unstable.trackLevel(Unstable.globals.current_level);

    var lowestTimeTrialTier = 0;
    var allCompleted = true;
    Object.keys(Unstable.globals.levels).forEach(function (level) {
        if (Unstable.globals.levels.hasOwnProperty(level)) {
            Unstable.globals.levels[level].times.forEach(function (time) {
                if (time.player) {
                    kongregate.stats.submit(
                        Unstable.globals.levels[level].key + ".time",
                        Math.floor(time.time * 1000)
                    );
                }
            });

            var tier = new TrophyManager().calcTimeTrialTrophy(
                Unstable.globals.levels[level]
            );
            if (tier < lowestTimeTrialTier) {
                lowestTimeTrialTier = tier;
            }

            if (level.completion === -1) {
                allCompleted = false;
            }

            if (level.completion === 1) {
                if (Unstable.globals.levels[level].key === "lvl_tight") {
                    kongregate.stats.submit("lvl_hub1.completed", 1);
                }

                if (Unstable.globals.levels[level].key === "lvl_sticks") {
                    kongregate.stats.submit("lvl_hub2.completed", 1);
                }

                if (
                    Unstable.globals.levels[level].key === "lvl_finalCountdown"
                ) {
                    kongregate.stats.submit("lvl_hub3.completed", 1);
                }
            }
        }
    });

    if (allCompleted) {
        if (lowestTimeTrialTier === 1) {
            kongregate.stats.submit("all_bronze_unlocked", 1);
            Unstable.track('trophy', 'unlocked', 'all_bronze');
        }

        if (lowestTimeTrialTier === 2) {
            kongregate.stats.submit("all_bronze_unlocked", 1);
            kongregate.stats.submit("all_silver_unlocked", 1);
            Unstable.track('trophy', 'unlocked', 'all_bronze');
            Unstable.track('trophy', 'unlocked', 'all_silver');
        }

        if (lowestTimeTrialTier === 3) {
            kongregate.stats.submit("all_bronze_unlocked", 1);
            kongregate.stats.submit("all_silver_unlocked", 1);
            kongregate.stats.submit("hundred_percented", 1);
            Unstable.track('trophy', 'unlocked', 'all_bronze');
            Unstable.track('trophy', 'unlocked', 'all_silver');
            Unstable.track('trophy', 'unlocked', 'hundred_percented');
        }
    }
};

Unstable.isSaveValid = function (saveState) {
    return saveState.version === Unstable.version;
};

Unstable.isLocalStorageAvailable = function () {
    var test = "com.ryankubik.unstable.test";
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
};

// var game = new Phaser.Game("100%", "100%", Phaser.AUTO);
var game = new Phaser.Game(
    480,
    480,
    Phaser.AUTO,
    "unstable",
    null,
    false,
    false
);
game.state.add("BootState", new Unstable.BootState());
game.state.add("LoadingState", new Unstable.LoadingState());
game.state.add("MenuState", new Unstable.MenuState());
game.state.add("LevelManager", new Unstable.LevelManagerState());
game.state.add("IntroductionState", new Unstable.IntroductionState());
game.state.add("GameState", new Unstable.TiledState());
game.state.add("SettingsState", new Unstable.SettingsState());
game.state.add("EndState", new Unstable.EndState());
game.state.start("BootState", true, false, "assets/levels/game_data.json");
