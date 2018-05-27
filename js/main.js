var Unstable = Unstable || {};
Unstable.saveProgress = function() {
  if (Unstable.isLocalStorageAvailable()) {
    var saveState = {};
    saveState.current_level = this.globals.current_level;
    saveState.levels = this.globals.levels;
    saveState.showIntroduction = this.globals.showIntroduction
    localStorage.setItem("com.ryankubik.unstable.saveState", JSON.stringify(saveState));
  } else {
    console.log("Saving game state failed - local storage is not available");
  }
}

Unstable.resetProgress = function() {
    if (Unstable.isLocalStorageAvailable()) {
        var gameDataText = game.cache.getText("game_data");
        var gameData = JSON.parse(gameDataText);

        this.globals.current_level = 'lvl_hub1';
        this.globals.levels = gameData.levels;
        this.globals.showIntroduction = true;
        Unstable.saveProgress();
    } else {
      console.log("Resetting game state failed - local storage is not available");
    }
}

Unstable.isLocalStorageAvailable = function() {
    var test = 'com.ryankubik.unstable.test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        return false;
    }
}

// var game = new Phaser.Game("100%", "100%", Phaser.AUTO);
var game = new Phaser.Game(480, 480, Phaser.AUTO, "unstable", null, false, false);
game.state.add("BootState", new Unstable.BootState());
game.state.add("LoadingState", new Unstable.LoadingState());
game.state.add("MenuState", new Unstable.MenuState());
game.state.add("LevelManager", new Unstable.LevelManagerState());
game.state.add("IntroductionState", new Unstable.IntroductionState());
game.state.add("GameState", new Unstable.TiledState());
game.state.add("SettingsState", new Unstable.SettingsState());
game.state.add("EndState", new Unstable.EndState());
game.state.start("BootState", true, false, "assets/levels/game_data.json");
