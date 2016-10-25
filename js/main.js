var Unstable = Unstable || {};

var game = new Phaser.Game("100%", "100%", Phaser.CANVAS);
game.state.add("BootState", new Unstable.BootState());
game.state.add("LoadingState", new Unstable.LoadingState());
game.state.add("GameState", new Unstable.TiledState());
game.state.start("BootState", true, false, "assets/levels/level1.json");
