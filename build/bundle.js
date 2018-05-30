/**
 *  {
 *      state1: {
 *          action1: callback1
 *          action2: callback2
 *      },
 *      state2: {
 *          action1: callback1
 *      }
 *  }
 */

function fsm(states, initialState) {
    this.currentState = initialState;

    return {
        action: function(action) {
            if (states[this.currentState][action]) {
                states[this.currentState][action]();
            }
        },

        transition: function(state) {
            this.currentState = state;
        },

        currentState: this.currentState
    }
}

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
        sprites: sprites,
        getCompletionPercentage: function(levels) {
            var omittedLevels = [
                "lvl_hub1",
                "lvl_hub2",
                "lvl_hub3",
                "lvl_twoQuarters",
            ];
            // for each level, total all completion trophies, 3xSpeedrun trophies
            var total = 0;
            var achieved = 0;

            Object.keys(levels).forEach(function(levelKey) {
                if (!omittedLevels.some(function(level) {
                    return level === levelKey;
                })) {
                    total += 3 + 1;
                    achieved += calcTimeTrialTrophy(levels[levelKey])
                    achieved += calcCompletionTrophy(levels[levelKey]);
                }
            });
            return Math.round((achieved / total) * 100);
        }
    }
}

function VolumeManager(game, saveState) {
    var sfx = {};
    var tracks = {};
    var sfxVol = 1;
    var tracksVol = 1;
    var muted = false;
    var playingSong;
    var sfxMuted = false;
    var trackMuted = false;
    var notChillLevelExceptions = [
        'lvl_hub1',
        'lvl_h1l1',
        'lvl_forest',
        'lvl_h1l3',
        'lvl_h1l4',
        'lvl_h1l5',
        'lvl_hub2',
        'lvl_hub3',
    ];

    if (saveState) {
        sfxVol = saveState.sfxVol !== undefined ? saveState.sfxVol : 1;
        tracksVol = saveState.tracksVol !== undefined ? saveState.tracksVol : 1;
        muted = saveState.muted !== undefined ? saveState.muted : false;
        sfxMuted = saveState.sfxMuted !== undefined ? saveState.sfxMuted : false;
        trackMuted = saveState.trackMuted !== undefined ? saveState.trackMuted : false;
    }

    function setAllSfxVolume(vol) {
        var sfxKeys = Object.keys(sfx);
        sfxKeys.forEach(function(sound) {
            sfx[sound].volume = vol;
        });
    }

    function setAllMusicVolume(vol) {
        var trackKeys = Object.keys(tracks);
        trackKeys.forEach(function(track) {
            tracks[track].volume = vol;
        });
    }

    function setSfxVolume(vol) {
        sfxVol = vol;
        if (!muted && !sfxMuted) {
            setAllSfxVolume(vol);
        }
    }

    function setMusicVolume(vol) {
        tracksVol = vol;
        if (!muted && !trackMuted) {
            setAllMusicVolume(vol);
        }
    }

    function mute(type) {
        if (!type) {
            muted = true;
            setAllSfxVolume(0);
            setAllMusicVolume(0);
        } else if (type === 'track') {
            trackMuted = true;
            setAllMusicVolume(0);
        } else if (type === 'sfx') {
            sfxMuted = true;
            setAllSfxVolume(0);
        }
    }

    return {
        sfx: sfx,
        tracks: tracks,
        addSfx: function(key, soundFileKey) {
            sfx[key] = game.add.sound(soundFileKey);
        },
        addTrack: function(key, trackFileKey) {
            tracks[key] = game.add.sound(trackFileKey);
        },
        setSfxVolume: setSfxVolume,
        setMusicVolume: setMusicVolume,
        resumeAudioContext: function() {
            if (game.sound.usingWebAudio &&
            game.sound.context.state === 'suspended')
            {
              game.input.onTap.addOnce(
                  game.sound.context.resume,
                  game.sound.context
              );
            }
        },
        isMuted: function() {
            return muted;
        },
        isTrackMuted: function() {
            return trackMuted;
        },
        isSfxMuted: function() {
            return sfxMuted;
        },
        mute: mute,
        unMute: function(type) {
            if (!type) {
                muted = false;
                setAllSfxVolume(sfxVol);
                setAllMusicVolume(tracksVol);
            } else if (type === 'track') {
                trackMuted = false;
                setAllMusicVolume(tracksVol);
            } else if (type === 'sfx') {
                sfxMuted = false;
                setAllSfxVolume(sfxVol);
            }
        },
        playSong: function(name) {
            if (
                name != playingSong
                && (name != 'notChill' || !notChillLevelExceptions.some(function(level) {
                    return Unstable.globals.current_level == level;
                }))
            ) {
                if (playingSong) {
                    tracks[playingSong].pause();
                }
                tracks[name].loopFull();
                playingSong = name;
            }
        },
        getVolume: function(sfx) {
            if (sfx) {
                return sfxVol;
            } else {
                return tracksVol;
            }
        },
        volumeUp: function(sfx) {
            if (sfx) {
                if (sfxVol < 1) {
                    setSfxVolume(sfxVol += 0.1);
                }
            } else {
                if (tracksVol < 1) {
                    setMusicVolume(tracksVol += 0.1);
                }
            }
        },
        volumeDown: function(sfx) {
            if (sfx) {
                if (sfxVol > 0) {
                    setSfxVolume(sfxVol -= 0.1);
                }
            } else {
                if (tracksVol > 0) {
                    setMusicVolume(tracksVol -= 0.1);
                }
            }
        },
        getVolumeObject: function() {
            return {
                sfxVol: sfxVol,
                tracksVol: tracksVol,
                muted: muted,
                trackMuted: trackMuted,
                sfxMuted: sfxMuted,
            }
        },
        init: function() {
            if (muted) {
                mute();
            }
            if (trackMuted) {
                mute('track');
            }
            if (sfxMuted) {
                mute('sfx');
            }
            setSfxVolume(sfxVol);
            setMusicVolume(tracksVol);
        }
    }
}

var Unstable = Unstable || {};

Unstable.BootState = function () {
    "use strict";
    Phaser.State.call(this);
};

Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.prototype.constructor = Unstable.BootState;

Unstable.BootState.prototype.init = function (gameDataFile) {
    "use strict";
    this.gameDataFile = gameDataFile;
    this.game.stage.backgroundColor = '#3799B3';//'#2A9A81';

    /* init global vars */
    var saveState;
    if (Unstable.isLocalStorageAvailable()) {
      saveState = localStorage.getItem("com.ryankubik.unstable.saveState");
      if (saveState !== null && !Unstable.isSaveValid(JSON.parse(saveState))) {
          saveState = null;
          Unstable.backupProgress();
          Unstable.removeSave();
          console.error('Your save data is invalid or corrupted!');
      }
    } else {
      saveState = null;
    }
    Unstable.globals = {};
    if (saveState === null) {
      Unstable.globals.current_level = undefined;
      Unstable.globals.levels = null;
      Unstable.globals.showIntroduction = true;

      Unstable.globals.audio = new VolumeManager(game);
    } else {
      saveState = JSON.parse(saveState);
      Unstable.globals.current_level = saveState.current_level;
      Unstable.globals.levels = saveState.levels;
      Unstable.globals.showIntroduction = saveState.showIntroduction;

      Unstable.globals.audio = new VolumeManager(game, saveState.volume);
    }

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
};

Unstable.BootState.prototype.preload = function () {
    "use strict";
    this.load.text("game_data", this.gameDataFile);
    this.load.image("loadingBar", "assets/images/loading_bar.png");
};

Unstable.BootState.prototype.create = function () {
    "use strict";
    var gameDataText, gameData;
    gameDataText = this.game.cache.getText("game_data");
    gameData = JSON.parse(gameDataText);
    this.game.state.start("LoadingState", true, false, gameData);
};

var Unstable = Unstable || {};

Unstable.LoadingState = function () {
    "use strict";
    Phaser.State.call(this);
};

Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.prototype.constructor = Unstable.LoadingState;

Unstable.LoadingState.prototype.init = function (gameData) {
    "use strict";
    this.gameData = gameData;
};

var audioAssets = [];
var assets;

Unstable.LoadingState.prototype.preload = function () {
    "use strict";
    var loadingBar = this.game.add.sprite(200, 200, "loadingBar");
    this.load.setPreloadSprite(loadingBar);

    var asset_loader, asset_key, asset;
    assets = this.gameData.assets;
    for (asset_key in assets) { // load assets according to asset key
        if (assets.hasOwnProperty(asset_key)) {
            asset = assets[asset_key];
            switch (asset.type) {
            case "image":
                this.load.image(asset_key, asset.source);
                break;
            case "spritesheet":
                this.load.spritesheet(asset_key, asset.source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing);
                break;
            case "tilemap":
                this.load.tilemap(asset_key, asset.source, null, Phaser.Tilemap.TILED_JSON);
                break;
            case "imageCollection":
                //this.load.
            case "audio":
                this.load.audio(asset_key, asset.source);
                audioAssets.push(asset_key);
                break;
            }
        }
    }
    this.load.start();

    game.plugins.screenShake = game.plugins.add(Phaser.Plugin.ScreenShake);
    game.plugins.screenShake.setup({
      shakesCount: 0,
      shakeX: true,
      shakeY: true,
      sensCoef: 1.4
    });

    if (Unstable.globals.levels === null) {
      Unstable.globals.levels = this.gameData.levels;
    } else {
      //add new levels from gameData if not already in global
      Object.getOwnPropertyNames(this.gameData.levels).forEach(function(propertyName) {
        if (this.gameData.levels.hasOwnProperty(propertyName)
          && !Unstable.globals.levels.hasOwnProperty(propertyName)) {
            Unstable.globals.levels[propertyName] = this.gameData.levels[propertyName];
        }
      }, this);
    }
};

Unstable.LoadingState.prototype.create = function () {
    "use strict";
    audioAssets.forEach(function(asset_key) {
        // take of sfx_ prefix with substring
        if (assets[asset_key].track) {
            Unstable.globals.audio.addTrack(asset_key.substring(4), asset_key);
        } else {
            Unstable.globals.audio.addSfx(asset_key.substring(4), asset_key);
        }
    });

    // set initial volumes now that all tracks/sfx are loaded
    var volumes = Unstable.globals.audio.getVolumeObject();
    Unstable.globals.audio.init();

    //this.game.levelManager.nextLevel();
    // this.game.state.start("LevelManager", true, false, this.gameData, "lvl_hub1");
    this.game.state.start("MenuState", true, false, this.gameData);
};

var Unstable = Unstable || {};

Unstable.MenuState = function () {
    "use strict";
    Phaser.State.call(this);
};

Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.prototype.constructor = Unstable.MenuState;

Unstable.MenuState.prototype.init = function (gameData) {
    "use strict";
    this.gameData = gameData;
    Unstable.globals.audio.resumeAudioContext(function() {
        Unstable.globals.audio.playSong('ambient');
    });
};

Unstable.MenuState.prototype.create = function () {
    "use strict";
    this.groups = {};
    this.groups["clouds"] = this.game.add.group();
    this.backdropManager = new Unstable.BackdropManager(this);

    var logo = game.add.image(game.width / 2, game.height / 2 - 60, "logo1");
    logo.anchor.set(0.5);
    logo.scale.setTo(0.65);

    var playButton = game.add.button(game.width / 2 - 4,
      game.height / 2 + 36, "buttonSheet", this.startGame, this, 8, 8, 9);
    playButton.anchor.set(0.5);
    playButton.scale.setTo(3);
    
    Unstable.globals.audio.playSong('ambient');
};

Unstable.MenuState.prototype.parseLevelOverride = function() {
    var queryParamString = window.location.search;
    if (queryParamString === "") {
        return "lvl_hub1";
    }
    var params = queryParamString.substr(1).split('&');
    var levelParam = params[0].split('='); // assume level param is first
    return 'lvl_' + levelParam[1];
}

Unstable.MenuState.prototype.startGame = function() {
    game.sound.context.resume();
    Unstable.globals.audio.playSong('ambient');
  this.game.state.start("LevelManager", true, false, this.gameData, this.parseLevelOverride(), null);
}

Unstable.MenuState.prototype.openOptions = function() {
  this.game.state.start("SettingsState", true, false, this.gameData);
}

var Unstable = Unstable || {};

Unstable.LevelManagerState = function () {
  "use strict";
  Phaser.State.call(this);
};

//Unstable.LevelManagerState.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.LevelManagerState.prototype.constructor = Unstable.LevelManagerState;

Unstable.LevelManagerState.prototype.init = function (game_data, levelLink, destGoalId) {
  // this.levels = game_data.levels;
  this.game_data = game_data;
  this.levelLink = levelLink;
  this.destGoalId = destGoalId;
}

Unstable.LevelManagerState.prototype.create = function () {
  this.nextLevel();
}

Unstable.LevelManagerState.prototype.nextLevel = function() {
  if (Unstable.globals.showIntroduction) {
    this.game.state.start("IntroductionState", true, false, this.game_data, this.levelLink);
  } else if (this.levelLink === "victory") {
    this.game.state.start("EndState", true, false, this.game_data);
  } else {
    // this.game_data.map = this.levels[Unstable.current_level++];
    this.game_data.map = Unstable.globals.levels[this.levelLink];
    Unstable.globals.current_level = this.levelLink;
    this.game.state.start("GameState", true, false, this.game_data, this.destGoalId);
  }
}

var Unstable = Unstable || {};

Unstable.TiledState = function () {
    "use strict";
    Phaser.State.call(this);
};

Unstable.TiledState.prototype = Object.create(Phaser.State.prototype);
Unstable.TiledState.prototype.constructor = Unstable.TiledState;

Unstable.TiledState.prototype.init = function (level_data, spawnGoalId) {
    "use strict";
    this.level_data = level_data;
    this.spawnGoalId = spawnGoalId;

    // start physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.groups = {};
    this.groups["clouds"] = this.game.add.group();

    // create map and set tilesets
    this.map = this.game.add.tilemap(level_data.map.key);
    this.map.addTilesetImage("base", level_data.map.tileset);
    this.map.addTilesetImage("collision", "collision");

    Unstable.globals.audio.sfx.tank.loop = true;
    this.aliveBombCount = 0;

    Unstable.Emitter.init();

    this.spawnGoalCoords = {x: 0, y: 0};

    Unstable.globals.audio.playSong('notChill');
};

Unstable.TiledState.prototype.create = function () {
    "use strict";
    var group_name, object_layer, collision_tiles;

    this.goals = [];
    this.goalTargets = [];
    this.teleporters = [];
    this.teleporterTargets = [];
    this.collisionMap = [];

    this.coins = 0;

    // this.groups = {};
    this.groups["colliders"] = this.game.add.group();
    this.groups["enemy_colliders"] = this.game.add.group();


    // create map layers
    this.layers = {};
    this.map.layers.forEach(function (layer) {
        if (!layer.properties.collision) {
          this.layers[layer.name] = this.map.createLayer(layer.name);
        } else { // collision layer
            layer.data.forEach(function (data_row) { // find tiles used in the layer
                var row = [];
                data_row.forEach(function (tile) {
                  if (tile.index > 0) {
                    var groupName;
                    if (tile.properties.type === 'enemy_only') {
                        groupName = "enemy_colliders";
                    } else {
                        row.push(1);
                        groupName = "colliders";
                    }
                    new Unstable.Collider(this, {x:tile.x * 24,y:tile.y * 24}, {group: groupName,texture:"",width:24,height:24});
                  } else {
                    row.push(0);
                  }
                }, this);
                this.collisionMap.push(row);
            }, this);
        }
    }, this);
    // resize the world to be the size of the current layer
    this.layers[this.map.layer.name].resizeWorld();

    // create groups
    this.level_data.groups.forEach(function (group_name) {
        this.groups[group_name] = this.game.add.group();
    }, this);

    this.prefabs = {};
    this.player;

    for (object_layer in this.map.objects) {
        // get the type of an object from tiled tilesheet + gid information
        if (this.map.objects.hasOwnProperty(object_layer)) {
            // create layer objects
            this.map.objects[object_layer].forEach(this.create_object, this);
        }
    }

    var restart_key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    restart_key.onDown.add(this.restart_level, this);

    this.backdropManager = new Unstable.BackdropManager(this);

    if (this.spawnGoalId) {
        var x = this.player.x;
        var y = this.player.y;

        // TODO: CANIUSE .FIND???
        var target = this.goalTargets.find(function(target) {
          return target.id == this.spawnGoalId;
      }.bind(this));
        if (target) {
            x = target.position.x;
            y = target.position.y;
        }

      this.player.respawnEffect(this.spawnGoalCoords, {
        x: x,
        y: y
      });
    }

    if (this.coins > 0) {
        this.timer = new Unstable.Timer(this, {x: 8, y: 8}, { paused: true });
    }

    var menuButton = game.add.button(
        game.width - 24,
        0,
        "buttonSheet",
        this.openSettings,
        this,
        10,
        10,
        11,
        10
    );
    var style = {
      font: "8px Arial",
      fill: "#FFFFFF",
      align: "center"
    };
    var text = game.add.text(
        game.width - 24,
        24,
        'Menu',
        style
    );
};

Unstable.TiledState.prototype.update = function() {
  this.groups["objects"].sort('y', Phaser.Group.SORT_ASCENDING); //depth sorting

    if (this.aliveBombCount > 0) {
      if (!Unstable.globals.audio.sfx.tank.isPlaying) {
        Unstable.globals.audio.sfx.tank.play();
      }
    } else {
        Unstable.globals.audio.sfx.tank.stop();
    }

  this.timer && this.timer.update();
}

Unstable.TiledState.prototype.getPrefabProperties = function (type, properties) {
  properties = properties || {};
  if (this.isBush(type)) {
      properties.texture = type;
      type = "bush";
  } else if (this.isTree(type)) {
      properties.texture = type;
      type = "tree";
  } else if (type == "sensor") {
      properties.texture = "sensor";
  } else if (type == "signal") {
      properties.texture = "signal";
  } else if (type == "antenna") {
      properties.texture = "antenna";
  }
  var finalProperties = {};
  Object.assign(finalProperties, this.level_data.prefabs[type].properties);
  Object.getOwnPropertyNames(properties).forEach( function(property) {
    if (properties.hasOwnProperty(property)) {
      if (finalProperties.hasOwnProperty(property) ||
        (this.level_data.prefabs[type].hasOwnProperty("required_properties") &&
        this.level_data.prefabs[type].required_properties.includes(property))) {
          //override default property
          finalProperties[property] = properties[property];
      } else {
        console.error("Game data does not contain the property [" + property + "] for [" + type + "].");
      }
    }
  }, this);
  if (this.level_data.prefabs[type].hasOwnProperty("required_properties")) {
    this.level_data.prefabs[type].required_properties.forEach( function(requiredProperty) {
      if (!finalProperties.hasOwnProperty(requiredProperty)) {
        console.error("Prefab [" + type + "] does not contain required property [" + requiredProperty + "]");
      }
    }, this);
  }
  return finalProperties;
};

Unstable.TiledState.prototype.create_object = function (object) {
    "use strict";
    var position, prefab, properties;
    // tiled coordinates starts in the bottom left corner
    position = {"x": object.x, "y": object.y - (this.map.tileHeight)};
    properties = this.getPrefabProperties(object.type, object.properties);

    if (this.isBush(object.type)) {
        object.type = "bush";
    } else if (this.isTree(object.type)) {
        object.type = "tree";
    }

    // create object according to its type
    switch (object.type) {
    case "player":
      if (this.spawnGoalId) {
        properties.spawnFromGoal = true;
      }
      prefab = new Unstable.Player(this, position, properties);
      this.player = prefab;
      break;
    case "goal":
      prefab = new Unstable.Goal(this, position, properties);
      this.goals.push(prefab);
      if ((this.spawnGoalId !== null && this.spawnGoalId !== "")
        && object.properties.id == this.spawnGoalId) {
          this.spawnGoalCoords.x = position.x;
          this.spawnGoalCoords.y = position.y;
        }
      break;
    case "coin":
      this.coins++;
      prefab = new Unstable.Coin(this, position, properties);
      break;
    case "hazard":
      prefab = new Unstable.Hazard(this, position, properties);
      break;
    case "bouncer":
      prefab = new Unstable.BouncerHazard(this, position, properties);
      break;
    case "tracker":
        prefab = new Unstable.TrackerHazard(this, position, properties);
        break;
    case "antenna":
    case "signal":
    case "sensor":
    case "bush":
    case "tree":
      prefab = new Unstable.Scenery(this, position, properties);
      break;
    case "slider":
      prefab = new Unstable.SliderEnemy(this, position, properties);
      break;
    case "turret":
      prefab = new Unstable.Turret(this, position, properties);
      break;
    case "trigger":
      prefab = new Unstable.Trigger(this, position, properties);
      break;
    case "teleporter":
      prefab = new Unstable.Teleporter(this, position, properties);
      this.teleporters.push(prefab);
      break;
    case "teleporterTarget":
        prefab = new Unstable.TeleporterTarget(this, position, properties);
        this.teleporterTargets.push(prefab);
        break;
    case "goalTarget":
        this.goalTargets.push({
            position: position,
            id: properties.id
        });
        break;
    }
    // this.prefabs[object.name] = prefab;
};

Unstable.TiledState.prototype.openSettings = function() {
  // this.game.state.start("MenuState", true, false, this.level_data);
  this.game.state.start("SettingsState", true, false, this.level_data);
}

Unstable.TiledState.prototype.isBush = function(type, properties) {
    return !!(type === "bush1" || type === "bush2" || type === "bush3");
}

Unstable.TiledState.prototype.isTree = function(type, properties) {
    return !!(type === "tree1" || type === "tree2" || type === "tree3" || type === "tree4");
}

Unstable.TiledState.prototype.shutdown = function () {
  if (this.aliveBombCount > 0) {
    Unstable.globals.audio.sfx.tank.stop();
  }
};

Unstable.TiledState.prototype.restart_level = function () {
    "use strict";
    if (this.player.alive) {
      this.player.die();
    }
    if (this.aliveBombCount > 0) {
        Unstable.globals.audio.sfx.tank.stop();
    }
    this.game.state.restart(true, false, this.level_data, null);
};

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

var Unstable = Unstable || {};

Unstable.SettingsState = function () {
    "use strict";
    Phaser.State.call(this);
};

Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.prototype.constructor = Unstable.SettingsState;

Unstable.SettingsState.prototype.init = function (level_file) {
    "use strict";
    this.level_file = level_file;
    this.trophyManager = new TrophyManager();
};

Unstable.SettingsState.prototype.create = function () {
    "use strict";
    var style = {
      font: "24px Helvetica",
      fill: "#FFFFFF",
      align: "center"
    };
    // var text = game.add.text(game.width / 2, game.height / 2 - 100,
    //   "Menu", style);
    //   text.x -= Math.round(text.width/2);
    //   text.y -= Math.round(text.height/2);

    var logo = game.add.image(game.width / 2, game.height / 2 - 100, "menuTitle");
    logo.anchor.set(0.5);
    logo.scale.setTo(0.5);

    this.groups = {};
    this.groups["shadows"] = this.game.add.group();
    this.groups["objects"] = this.game.add.group();
    var bouncer = new Unstable.BouncerHazard(this,
        { x: game.width / 2 - 100, y: game.height / 2 - 96 },
        {
            "group": "hazards",
            "pgroup": "hazards",
            "rgroup": "objects",
            "texture": "enemy_bomb",
            "velocityX": 0,
            "velocityY": 0
        }
    );


    style.font = "16px Helvetica";
    // style.align = "right";

    var playText = game.add.text(game.width / 2 + 32,
      game.height / 2,
      "Resume Game", style);
    playText.anchor.set(1, 0.5);
    playText.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 2);

    var playButton = game.add.button(game.width / 2 + 16 + 32,
      game.height / 2, "buttonSheet", this.startGame, this, 8, 8, 9);
    playButton.anchor.set(0.5);
    // playButton.scale.setTo(2);


    var songText = game.add.text(game.width / 2 + 32,
      game.height / 2 + 36,
      this.getVolumeText(), style);
    songText.anchor.set(1, 0.5);
    songText.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 2);

    var unmutedFrames = [12, 12, 13, 12];
    var mutedFrames = [14, 14, 15, 14];
    var initialFrames = unmutedFrames;

    if (Unstable.globals.audio.isTrackMuted()) {
        initialFrames = mutedFrames;
    }
    var muteButton = game.add.button(
        game.width / 2 + 16 + 32,
        game.height / 2 + 36,
        "buttonSheet",
        function() {
            if (Unstable.globals.audio.isTrackMuted()) {
                Unstable.globals.audio.unMute('track');
                muteButton.setFrames(
                    unmutedFrames[0],
                    unmutedFrames[1],
                    unmutedFrames[2],
                    unmutedFrames[3]
                );
            } else {
                Unstable.globals.audio.mute('track');
                muteButton.setFrames(
                    mutedFrames[0],
                    mutedFrames[1],
                    mutedFrames[2],
                    mutedFrames[3]
                );
            }
        },
        this,
        initialFrames[0],
        initialFrames[1],
        initialFrames[2],
        initialFrames[3]
    );
    muteButton.anchor.set(0.5);
    // muteButton.scale.setTo(2);

    var upButton = game.add.button(
        game.width / 2 + 16 + 32 + 24,
        game.height / 2 + 36,
        "buttonSheet",
        function() {
            Unstable.globals.audio.volumeUp();
            songText.text = this.getVolumeText();
        },
        this,
        8,
        8,
        9,
        8
    );
    upButton.anchor.setTo(0.5, 0.5);
    // upButton.scale.setTo(2);
    upButton.angle = 270;

    var downButton = game.add.button(
        game.width / 2 + 16 + 32 + 24 + 24,
        game.height / 2 + 36,
        "buttonSheet",
        function() {
            Unstable.globals.audio.volumeDown();
            songText.text = this.getVolumeText();
        },
        this,
        8,
        8,
        9,
        8
    );
    downButton.anchor.setTo(0.5, 0.5);
    // downButton.scale.setTo(2);
    downButton.angle = 90;

    var sfxText = game.add.text(game.width / 2 + 32,
      game.height / 2 + 72,
      this.getSfxText(), style);
    sfxText.anchor.set(1, 0.5);
    sfxText.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 2);

    initialFrames = unmutedFrames;
    if (Unstable.globals.audio.isSfxMuted()) {
        initialFrames = mutedFrames;
    }
    var muteButton2 = game.add.button(
        game.width / 2 + 16 + 32,
        game.height / 2 + 72,
        "buttonSheet",
        function() {
            if (Unstable.globals.audio.isSfxMuted()) {
                Unstable.globals.audio.unMute('sfx');
                muteButton2.setFrames(
                    unmutedFrames[0],
                    unmutedFrames[1],
                    unmutedFrames[2],
                    unmutedFrames[3]
                );
            } else {
                Unstable.globals.audio.mute('sfx');
                muteButton2.setFrames(
                    mutedFrames[0],
                    mutedFrames[1],
                    mutedFrames[2],
                    mutedFrames[3]
                );
            }
        },
        this,
        initialFrames[0],
        initialFrames[1],
        initialFrames[2],
        initialFrames[3]
    );
    muteButton2.anchor.set(0.5);
    // muteButton.scale.setTo(2);

    var upButton2 = game.add.button(
        game.width / 2 + 16 + 32 + 24,
        game.height / 2 + 72,
        "buttonSheet",
        function() {
            Unstable.globals.audio.volumeUp(true);
            sfxText.text = this.getSfxText();
        },
        this,
        8,
        8,
        9,
        8
    );
    upButton2.anchor.setTo(0.5, 0.5);
    // upButton.scale.setTo(2);
    upButton2.angle = 270;

    var downButton2 = game.add.button(
        game.width / 2 + 16 + 32 + 24 + 24,
        game.height / 2 + 72,
        "buttonSheet",
        function() {
            Unstable.globals.audio.volumeDown(true);
            sfxText.text = this.getSfxText();
        },
        this,
        8,
        8,
        9,
        8
    );
    downButton2.anchor.setTo(0.5, 0.5);
    // downButton.scale.setTo(2);
    downButton2.angle = 90;

    var completionText = game.add.text(game.width / 2,
      game.height / 2 + 108,
      this.getCompletionText(), style);
    completionText.anchor.set(0.5, 0.5);
    completionText.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 2);

    var resetText = game.add.text(game.width / 2 + 64,
    game.height / 2 + 142,
    "Permanently Reset Progress",
    style);
    resetText.anchor.set(1, 0.5);
    resetText.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 2);

    var resetButton = game.add.button(
        game.width / 2 + 64 + 16,
        game.height / 2 + 142 - 4,
        "buttonSheet",
        function() {
            Unstable.resetProgress();
            completionText.text = this.getCompletionText();
        },
        this,
        4,
        4,
        5,
        4
    );
    resetButton.anchor.setTo(0.5, 0.5);

};

Unstable.SettingsState.prototype.getCompletionText = function() {
    return "Completion Percentage: " + this.trophyManager.getCompletionPercentage(Unstable.globals.levels) + "%";
}

Unstable.SettingsState.prototype.getVolumeText = function() {
    return "Music Volume: " + Math.trunc(Unstable.globals.audio.getVolume() * 10);
}

Unstable.SettingsState.prototype.getSfxText = function() {
    return "SFX Volume: " + Math.trunc(Unstable.globals.audio.getVolume(true) * 10);
}

Unstable.SettingsState.prototype.startGame = function() {
  // this.game.state.start("LevelManager", true, false, this.level_file);
  Unstable.saveProgress();
  this.game.state.start("LevelManager", true, false, this.level_file, Unstable.globals.current_level, null);
}

Unstable.SettingsState.prototype.openMenu = function () {
  this.game.state.start("MenuState", true, false, this.level_file);
};

var Unstable = Unstable || {};

Unstable.IntroductionState = function() {
    "use strict";
    Phaser.State.call(this);
};

Unstable.prototype = Object.create(Phaser.State.prototype);
Unstable.prototype.constructor = Unstable.IntroductionState;

Unstable.IntroductionState.prototype.init = function(game_data, levelLink) {
    "use strict";
    this.game_data = game_data;
    this.levelLink = levelLink;

    this.groups = {};
    this.groups["shadows"] = this.game.add.group();
    this.groups["objects"] = this.game.add.group();

    Unstable.Emitter.init();
};

Unstable.IntroductionState.prototype.preload = function() {
    "use strict";

};

Unstable.IntroductionState.prototype.create = function() {
    "use strict";
    var style = {
      font: "16px Helvetica",
      fill: "#FFFFFF",
      align: "center"
    };
    var text = game.add.text(game.width / 2, game.height / 2 - 100,
        "You are unstable, when you die you get back up again.", style);
    text.anchor.set(0.5);
    text.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 2);

    text = game.add.text(game.width / 2, game.height / 2 - 25,
        "Arrow keys or WASD to move.", style);
    text.anchor.set(0.5);
    text.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 2);

    text = game.add.text(game.width / 2 - 32, game.height / 2 + 10,
        "Collect all the coins.", style);
    text.anchor.set(0.5);
    text.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 2);

    var coin = new Unstable.Coin(this,
        { x: game.width / 2 + 64, y: game.height / 2 + 16 },
        {
            "frame": "6",
            "group": "coins",
            "pgroup": "coins",
            "rgroup": "objects",
            "texture": "img_objects"
        }
    );
    coin = new Unstable.Coin(this,
        { x: game.width / 2 + 84, y: game.height / 2 + 16 },
        {
            "frame": "6",
            "group": "coins",
            "pgroup": "coins",
            "rgroup": "objects",
            "texture": "img_objects"
        }
    );
    coin = new Unstable.Coin(this,
        { x: game.width / 2 + 104, y: game.height / 2 + 16 },
        {
            "frame": "6",
            "group": "coins",
            "pgroup": "coins",
            "rgroup": "objects",
            "texture": "img_objects"
        }
    );

    text = game.add.text(game.width / 2 - 16, game.height / 2 + 45,
        "Get to the goal.", style);
    text.anchor.set(0.5);
    text.setShadow(1, 1, 'rgba(0, 0, 0, 1)', 2);

    var goal = new Unstable.Goal(this,
        { x: game.width / 2 + 84, y: game.height / 2 + 53 },
        {
            "frame": "8",
            "group": "goal",
            "height": "8",
            "pgroup": "goals",
            "rgroup": "objects",
            "texture": "img_objects",
            "width": "8",
            "displayTrophies": false,
            "id": 0,
            "link": "lvl_hub1",
            "threshold": 0,
            "levelPrereq": "",
            "destGoalId": 0,
        }
    );

    var playButton = game.add.button(game.width / 2 - 24,
      game.height / 2 + 100, "buttonSheet", this.endIntroduction, this, 8, 8, 9);
    playButton.scale.setTo(2);
};

Unstable.IntroductionState.prototype.endIntroduction = function() {
    Unstable.globals.showIntroduction = false;
    this.game.state.start("LevelManager", true, false, this.game_data, this.levelLink);
};

'use strict';

/**
* Plugin to make screen shake FX (makes number of short camera movements).
*
*/
Phaser.Plugin.ScreenShake = function(game, parent){
  Phaser.Plugin.call(this, game, parent);

  //settings by default
  this._settings = {
    shakesCount: 0,
    shakeX: true,
    shakeY: true,
    sensCoef: 0.5
  };
  this.game.camera.bounds = null;

  /**
  * screen shake FX.
  */
  this._moveCamera = function(){
    if(this._settings.shakesCount > 0){
      var sens = this._settings.shakesCount * this._settings.sensCoef;

      if(this._settings.shakesCount % 2){
        this.game.camera.x += this._settings.shakeX ? sens : 0;
        this.game.camera.y += this._settings.shakeY ? sens : 0;
      }
      else{
        this.game.camera.x -= this._settings.shakeX ? sens : 0;
        this.game.camera.y -= this._settings.shakeY ? sens : 0;
      }

      this._settings.shakesCount--;

      if(this._settings.shakesCount === 0){
        this.game.camera.setPosition(0, 0);
      }
    }
  };
};

Phaser.Plugin.ScreenShake.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.ScreenShake.prototype.constructor = Phaser.Plugin.ScreenShake;


/**
* Change default settings object values with passed object value.
*
* @method Phaser.Plugin.ScreenShake#setup
* @param {object} [obj] - Passed object to merge
*/
Phaser.Plugin.ScreenShake.prototype.setup = function(obj){
  this._settings = Phaser.Utils.extend(false, this._settings, obj);
};


/**
* Pass value of count shakes.
*
* @method Phaser.Plugin.ScreenShake#shake
* @param {number} [count] - Value of count shakes
*/
Phaser.Plugin.ScreenShake.prototype.shake = function(count){
  this._settings.shakesCount = count;
};

Phaser.Plugin.ScreenShake.prototype.update = function(){
  this._moveCamera();
};

var Unstable = Unstable || {};

Unstable.Prefab = function (game_state, position, properties) {
    "use strict";
    if (properties.texture != null) {
      if (properties.frame != null)
        Phaser.Sprite.call(this, game_state.game, position.x, position.y, properties.texture, parseInt(properties.frame));
      else
        Phaser.Sprite.call(this, game_state.game, position.x, position.y, properties.texture);
    } else {
      Phaser.Sprite.call(this, game_state.game, position.x, position.y);
    }

    this.game_state = game_state;

    if (properties.rgroup != null)
      this.game_state.groups[properties.rgroup].add(this);
    else {
      this.game_state.groups[properties.group].add(this);
    }

    if (properties.pgroup != null)
      this.pgroup = properties.pgroup;
};

Unstable.Prefab.prototype = Object.create(Phaser.Sprite.prototype);
Unstable.Prefab.prototype.constructor = Unstable.Prefab;

var Unstable = Unstable || {};

Unstable.Cloud = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    this.speed = properties.speed;
    this.game_state = game_state;
};

Unstable.Cloud.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Cloud.prototype.constructor = Unstable.Cloud;

Unstable.Cloud.prototype.update = function() {
  if (this.x > this.game_state.game.width + this.width) {
    this.x = -this.width;
    this.y = this.game_state.game.rnd.integerInRange(
      -this.height/2,
      this.game_state.game.height + this.height/2
    );
    this.speed = (this.game_state.game.rnd.frac() * 0.6) + 0.1;
  } else {
    this.x += this.speed;
  }
}

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

var Unstable = Unstable || {};

Unstable.Emitter = function (game_state, position, properties) {
    "use strict";
    this.game_state = game_state;
    this.offset = properties.offset;
    this.emitter = game_state.game.add.emitter(position.x + this.offset.x, position.y + this.offset.y, properties.maxParticles);

    this.emitter.width = properties.width;
    switch (properties.particleClass) {
      case "fuse":
        this.emitter.particleClass = Unstable.FuseParticle;
        break;
      case "coin":
        this.emitter.particleClass = Unstable.CoinParticle;
        break;
      case "player":
        this.emitter.particleClass = Unstable.PlayerParticle;
        break;
      case "bridge":
        this.emitter.particleClass = Unstable.BridgeParticle;
        break;
      default:
        console.log("invalid particle class");
        break;
    }
    this.emitter.makeParticles();

    this.minParticleSpeed = properties.minParticleSpeed;
    this.maxParticleSpeed = properties.maxParticleSpeed;

    this.direction = -1;

    if (properties.scale !== undefined) {
      this.emitter.setScale(
        properties.scale.minX,
        properties.scale.maxX,
        properties.scale.minY,
        properties.scale.maxY,
        properties.scale.rate,
        properties.scale.ease,
        properties.scale.yoyo
      );
    }

    this.emitter.minParticleSpeed.set(this.minParticleSpeed.x, this.minParticleSpeed.y);
    this.emitter.maxParticleSpeed.set(this.maxParticleSpeed.x, this.maxParticleSpeed.y);

    this.emitter.setRotation(0, 0);
    // this.emitter.setScale(0.1, 1, 0.1, 1, 12000, Phaser.Easing.Quintic.Out);
    this.emitter.gravity = properties.gravity;
    // this.emitter.start(false, 150, 65);
    this.lifetime = properties.lifetime;
    this.frequency = properties.frequency;
    if (!properties.burst) {
      this.emitter.start(properties.burst, properties.lifetime, properties.frequency);
    }
};

Unstable.Emitter.init = function() {
  //  Create our bitmapData which we'll use as our particle texture
  var bmd = game.add.bitmapData(8, 8);
  bmd.context.fillStyle = "#FF0000";
  bmd.context.fillRect(0, 0, 4, 4);
  //  Put the bitmapData into the cache
  game.cache.addBitmapData('particleFuse', bmd);

  var bmd2 = game.add.bitmapData(8, 8);
  bmd2.context.fillStyle = "#E7CE2F";
  bmd2.context.fillRect(0, 0, 4, 4);
  //  Put the bitmapData into the cache
  game.cache.addBitmapData('particleCoin', bmd2);

  var bmd3 = game.add.bitmapData(8, 8);
  bmd3.context.fillStyle = "#FFFFFF";
  bmd3.context.fillRect(0, 0, 4, 4);
  //  Put the bitmapData into the cache
  game.cache.addBitmapData('particlePlayer', bmd3);

  var bmd4 = game.add.bitmapData(8, 8);
  bmd4.context.fillStyle = "#663C0F";
  bmd4.context.fillRect(0, 0, 4, 4);
  //  Put the bitmapData into the cache
  game.cache.addBitmapData('particleBridgeLight', bmd4);

  var bmd5 = game.add.bitmapData(8, 8);
  bmd5.context.fillStyle = "#4E3313";
  bmd5.context.fillRect(0, 0, 4, 4);
  //  Put the bitmapData into the cache
  game.cache.addBitmapData('particleBridgeDark', bmd5);
};

Unstable.Emitter.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Emitter.prototype.constructor = Unstable.Emitter;

Unstable.Emitter.prototype.updatePos = function(x, y) {
  this.emitter.x = x + this.offset.x * this.direction;
  this.emitter.y = y + this.offset.y;
}

Unstable.Emitter.prototype.flipDirection = function(direction) {
  this.direction = direction;
  this.emitter.minParticleSpeed.set(this.minParticleSpeed.x * direction, this.minParticleSpeed.y);
  this.emitter.maxParticleSpeed.set(this.maxParticleSpeed.x * direction, this.maxParticleSpeed.y);
}

Unstable.Emitter.prototype.burst = function(x, y) {
  this.updatePos(x, y);
  this.emitter.start(true, this.lifetime, 0, this.frequency);
}

Unstable.Emitter.prototype.updateParticles = function(updateFunc) {
  this.emitter.forEach(updateFunc, this);
}

Unstable.Emitter.prototype.destroy = function() {
  this.emitter.destroy();
}

Unstable.Emitter.prototype.returnToSpawn = function(prefab) {
  this.burst(prefab.x, prefab.y);
  var partsToSpawn = function(spawn) {
    this.updateParticles(function(particle) {
      var seekSpawnTween = this.game_state.game.add.tween(particle).to({x:spawn.x, y:spawn.y}, 0.5 * Phaser.Timer.SECOND);
      seekSpawnTween.onComplete.add(function() {
        particle.kill();
        this.game_state.restart_level();
      }, this);
      seekSpawnTween.start();
    })
  }
  game.time.events.add(Phaser.Timer.SECOND, partsToSpawn, this, prefab.spawnpoint);
}

Unstable.Emitter.prototype.seekParticlesToLocation = function (location, callback, context, param, initialDelay) {
  initialDelay = initialDelay || 1;
  var travelTime = 0.5;
  param = param || null;
  var partsToLocation = function(location) {
    this.updateParticles(function(particle) {
      var seekLocationTween = this.game_state.game.add.tween(particle)
        .to({x:location.x, y:location.y}, travelTime * Phaser.Timer.SECOND);
      seekLocationTween.onComplete.add(function() {
        particle.kill();
      }, this);
      seekLocationTween.start();
    });
    if (callback !== undefined && callback !== null) {
      game.time.events.add(travelTime * Phaser.Timer.SECOND, callback, context, param);
      // callback.call(context);
    }
  }
  game.time.events.add(initialDelay * Phaser.Timer.SECOND, partsToLocation, this, location);
};

Unstable.BridgeParticle = function (game, x, y) {
    Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleBridgeLight'));
};

Unstable.BridgeParticle.prototype = Object.create(Phaser.Particle.prototype);
Unstable.BridgeParticle.prototype.constructor = Unstable.BridgeParticle;

Unstable.FuseParticle = function (game, x, y) {
    Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleFuse'));
};

Unstable.FuseParticle.prototype = Object.create(Phaser.Particle.prototype);
Unstable.FuseParticle.prototype.constructor = Unstable.FuseParticle;

Unstable.CoinParticle = function (game, x, y) {
    Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleCoin'));
};

Unstable.CoinParticle.prototype = Object.create(Phaser.Particle.prototype);
Unstable.CoinParticle.prototype.constructor = Unstable.CoinParticle;

Unstable.PlayerParticle = function (game, x, y) {
    Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particlePlayer'));
};

Unstable.PlayerParticle.prototype = Object.create(Phaser.Particle.prototype);
Unstable.PlayerParticle.prototype.constructor = Unstable.PlayerParticle;

var Unstable = Unstable || {};

Unstable.Timer = function (game_state, position, properties) {
    "use strict";
    if (!properties) {
        properties = {};
    }

    this.game_state = game_state;

    var style = {
      font: "16px Arial",
      fill: "#FFFFFF",
      stroke: "#000000",
      strokeThickness: 1,
      align: "left"
    };
    this.text = game.add.text(position.x, position.y, "0.000", style);
    this.text.setShadow(0, 0, 'rgba(0, 0, 0, 1)', 3);
    this.highScores = [];
    this.highScores[0] = game.add.text(position.x + 120, position.y, "0.000", style);
    this.highScores[1] = game.add.text(position.x + 180, position.y, "0.000", style);
    this.highScores[2] = game.add.text(position.x + 240, position.y, "0.000", style);
    this.highScores.forEach(function(highScore) {
        highScore.setShadow(0, 0, 'rgba(0, 0, 0, 1)', 3);
    });

    this.drawHighScores();

    this.state = fsm(
        {
            playerUnmoved: {
                playerMoved: function() {
                    this.startTime = this.game_state.game.time.totalElapsedSeconds();
                    this.state.transition('playing');
                }.bind(this)
            },
            paused: {
                play: function() {
                    this.state.transition('playing');
                }.bind(this)
            },
            playing: {
                pause: function() {
                    this.state.transition('paused');
                }.bind(this)
            }
        },
        properties.paused ? 'playerUnmoved' : 'playing'
    );
};

Unstable.Timer.prototype.constructor = Unstable.Timer;

Unstable.Timer.prototype.update = function() {
    if (this.state.currentState === 'playing') {
        var time = this.game_state.game.time.totalElapsedSeconds() - this.startTime;
        this.text.setText(time.toFixed(3));
    }
}

Unstable.Timer.prototype.drawHighScores = function() {
    this.times = Unstable.globals.levels[Unstable.globals.current_level].times;
    this.times.forEach(function(time, index) {
        this.highScores[index].setText(time.time.toFixed(3));
        var state = Unstable.globals.levels[Unstable.globals.current_level];
        if (time.time <= state.timeTrialTiers.gold) {
            this.highScores[index].addColor('#E7CE2F', 0);
        } else if (time.time <= state.timeTrialTiers.silver) {
            this.highScores[index].addColor('#D6D6FE', 0);
        } else if (time.time <= state.timeTrialTiers.bronze) {
            this.highScores[index].addColor('#E99353', 0);
        }
    }.bind(this));
}

Unstable.Timer.prototype.pause = function() {
    this.state.action('pause');
}

Unstable.Timer.prototype.play = function() {
    this.state.action('play');
}

Unstable.Timer.prototype.playerMoved = function() {
    this.state.action('playerMoved');
}

Unstable.Timer.prototype.blink = function() {
    var blinkSpeed = 0.3 * Phaser.Timer.SECOND;

    this.text.setStyle({
        font: "24px Arial",
        fill: "#FFFFFF",
        stroke: "#000000",
        strokeThickness: 1,
        align: "left"
    });
    this.text.setShadow(0, 0, 'rgba(0, 0, 0, 1)', 3);

    this.timer = game.time.create(false);
    this.timer.loop(blinkSpeed, function() {
        this.text.visible = !this.text.visible;
    }, this);
    this.timer.start();
}

Unstable.Timer.prototype.saveTime = function(levelKey) {
    var newTime = {
        time: this.game_state.game.time.totalElapsedSeconds() - this.startTime,
        name: "player",
        player: true
    };
    var times = Unstable.globals.levels[levelKey].times.slice();
    this.newHighScore = times.some(function(time) {
        return newTime.time < time.time;
    }); // TODO: update this logic
    if (times.length < 3) { // TODO: Update this logic
        this.newHighScore = true;
    }
    if (times.length > 0) {
        this.highestScore = newTime.time < times[0].time;
    } else {
        this.highestScore = true;
    }

    if (this.newHighScore) {
        this.blink();
    }

    times.push(newTime);
    times.sort(function(a, b) {
        return a.time - b.time;
    });
    Unstable.globals.levels[levelKey].times = times.slice(0, 3);
    Unstable.saveProgress();
}

var Unstable = Unstable || {};

Unstable.Player = function(game_state, position, properties) {
  "use strict";
  Unstable.Prefab.call(this, game_state, position, properties);

  this.walking_speed = 150;
  this.jumping_speed = 30;
  this.bouncing = 5;

  this.score = 0;

  this.game_state.game.physics.arcade.enable(this);
  this.body.collideWorldBounds = true;

  this.anchor.setTo(0.5, 1);
  this.body.setSize(16, 6, 0, 18);

  this.shadowOffset = 2;
  this.shadow = game.add.sprite(-1, this.shadowOffset, "shadow", 1);
  this.shadow.anchor.setTo(0.5,1);
  this.shadow.alpha = 0.4;
  this.game_state.groups["shadows"].add(this.shadow);
  //this.addChild(this.shadow);

  this.runAnimation = this.animations.add("player_run", [2, 3, 4, 5], 10, true);
  this.animations.add("player_idle", [0, 1], 1, true);

  this.animations.play("player_idle");

  this.cursors = this.game_state.game.input.keyboard.createCursorKeys();
  this.wasd = {
    up: this.game_state.game.input.keyboard.addKey(Phaser.Keyboard.W),
    down: this.game_state.game.input.keyboard.addKey(Phaser.Keyboard.S),
    left: this.game_state.game.input.keyboard.addKey(Phaser.Keyboard.A),
    right: this.game_state.game.input.keyboard.addKey(Phaser.Keyboard.D),
  };
  game.input.gamepad.start();
  this.pad1 = game.input.gamepad.pad1;


  this.emitter = new Unstable.Emitter(game_state, {x:this.x, y:this.y},{
    offset:{x: 0, y: -12},
    maxParticles: 30,
    width: 2,
    minParticleSpeed: {x: -40, y: -40},
    maxParticleSpeed: {x: 40, y: 40},
    gravity: 0,
    burst: true,
    lifetime: 0, //450
    frequency: 30,
    particleClass: "player",
    scale: {
      minX: 1,
      maxX: 0,
      minY: 1,
      maxY: 0,
      rate: 3500,
      ease: Phaser.Easing.Exponential.In,
      yoyo: false
    }
  });

  this.spawnpoint = {x: this.x, y: this.y};

  this.stepToggle = 1;

  if (properties.spawnFromGoal) {
    this.kill();
    this.shadow.kill();
  }

  this.trophyManager = new TrophyManager(
      Unstable.globals.levels[Unstable.globals.current_level],
      this.game_state
  );
}

Unstable.Player.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Player.prototype.constructor = Unstable.Player;

Unstable.Player.prototype.update = function() {
  // this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
  this.game_state.game.physics.arcade.collide(this, this.game_state.groups.colliders, this.collideColliders, null, this);
  this.game_state.game.physics.arcade.collide(this, this.game_state.groups.objects, this.collideObjects, null, this);
  this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.triggers, this.triggerCollide, null, this);

  if (
      this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)
        || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1
    ) {
        console.log('button press');
    }

  if (this.isRightDown() && this.body.velocity.x >= 0) {
      // move right
      this.body.velocity.x = this.walking_speed;
      this.shadow.x = this.x + 1;
      this.animations.play("player_run");
      this.scale.setTo(1, 1);
  } else if (this.isLeftDown() && this.body.velocity.x <= 0) {
      // move left
      this.body.velocity.x = -this.walking_speed;
      this.shadow.x = this.x - 1;
      this.animations.play("player_run");
      this.scale.setTo(-1, 1);
  } else {
      // stop
      this.body.velocity.x = 0;
      this.shadow.x = this.x;
  }

  if (this.isDownDown() && this.body.velocity.y >= 0) {
    //move down
    this.body.velocity.y = this.walking_speed;
    this.shadow.y = this.y + this.shadowOffset * 2;
    this.animations.play("player_run");
  } else if (this.isUpDown() && this.body.velocity.y <= 0) {
    //move up
    this.body.velocity.y = -this.walking_speed;
    this.shadow.y = this.y;
    this.animations.play("player_run");
  } else {
    //stop
    this.body.velocity.y = 0;
    this.shadow.y = this.y + this.shadowOffset;
  }
  if (this.body.velocity.x == 0 && this.body.velocity.y == 0) {
    this.animations.play("player_idle");
  }
  if (this.runAnimation.isPlaying) {
    if (this.stepToggle === 1) {
      Unstable.globals.audio.sfx.step1.play("", 0, undefined, false, false);
      this.stepToggle = 2;
    } else if (this.stepToggle === 2) {
      Unstable.globals.audio.sfx.step2.play("", 0, undefined, false, false);
      this.stepToggle = 1;
    }
  }
  if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
      this.game_state.timer && this.game_state.timer.playerMoved();
  }
}

Unstable.Player.prototype.isCollisionLocationEmpty = function(row, col) {
  if (row < 0 || col < 0 || row >= this.game_state.collisionMap.length
    || col >= this.game_state.collisionMap.length) {
      return false;
  }
  return this.game_state.collisionMap[row][col] == 0;
}

Unstable.Player.prototype.isRightDown = function() {
    return (
        this.cursors.right.isDown
            || this.wasd.right.isDown
            || this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT)
            || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) > 0.1
        );
}

Unstable.Player.prototype.isUpDown = function() {
    return (
        this.cursors.up.isDown
            || this.wasd.up.isDown
            || this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_UP)
            || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) < -0.1
        );}

Unstable.Player.prototype.isLeftDown = function() {
    return (
        this.cursors.left.isDown
            || this.wasd.left.isDown
            || this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT)
            || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_X) < -0.1
    );
}

Unstable.Player.prototype.isDownDown = function() {
    return (
        this.cursors.down.isDown
            || this.wasd.down.isDown
            || this.pad1.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN)
            || this.pad1.axis(Phaser.Gamepad.XBOX360_STICK_LEFT_Y) > 0.1
        );
}

Unstable.Player.prototype.collideColliders = function (player, collider) {
  var col = collider.x/24;
  var row = collider.y/24;
  var magicAdjust = 6;
  var magicAdjustX = collider.body.width/2 - magicAdjust;
  var magicAdjustY = collider.body.height/2 - magicAdjust;
  var xDiff = player.x - (collider.x + collider.body.width/2);
  var yDiff = (player.y - player.body.height/2) - (collider.y + collider.body.height/2);

  if (player.body.touching.up) {
    if (this.isCollisionLocationEmpty(row, col + 1)
      && this.isCollisionLocationEmpty(row - 1, col + 1)
      && xDiff > magicAdjustX) {
        player.x += 1;
    } else if (this.isCollisionLocationEmpty(row, col - 1)
      && this.isCollisionLocationEmpty(row - 1, col - 1)
      && xDiff < -magicAdjustX) {
        player.x -= 1;
    }
  } else if (player.body.touching.down) {
    if (this.isCollisionLocationEmpty(row, col + 1)
      && this.isCollisionLocationEmpty(row + 1, col + 1)
      && xDiff > magicAdjustX) {
        player.x += 1;
    } else if (this.isCollisionLocationEmpty(row, col - 1)
      && this.isCollisionLocationEmpty(row + 1, col - 1)
      && xDiff < -magicAdjustX) {
        player.x -= 1;
    }
  } else if (player.body.touching.right) {
    if (this.isCollisionLocationEmpty(row + 1, col)
      && this.isCollisionLocationEmpty(row + 1, col + 1)
      && yDiff > magicAdjustY) {
        player.y += 1;
    } else if (this.isCollisionLocationEmpty(row - 1, col)
      && this.isCollisionLocationEmpty(row - 1, col + 1)
      && yDiff < -magicAdjustY) {
        player.y -= 1;
    }
  } else if (player.body.touching.left) {
    if (this.isCollisionLocationEmpty(row + 1, col)
      && this.isCollisionLocationEmpty(row + 1, col - 1)
      && yDiff > magicAdjustY) {
        player.y += 1;
    } else if (this.isCollisionLocationEmpty(row - 1, col)
      && this.isCollisionLocationEmpty(row - 1, col - 1)
      && yDiff < -magicAdjustY) {
        player.y -= 1;
    }
  }
};

Unstable.Player.prototype.collideObjects = function(player, object) {
  "use strict";
  switch(object.pgroup) {
    case "hazards":
      this.hazardCollide(player, object);
      break;
    case "coins":
      this.coinCollide(player, object);
      break;
    case "goals":
      this.goalCollide(player, object);
      break;
    case "blockers":
      this.blockerCollide(player, object);
      break;
    case "teleporters":
      this.teleporterCollide(player, object);
      break;
  }
}

Unstable.Player.prototype.blockerCollide = function (player, blocker) {
  "use strict";
  var col = Math.floor(blocker.x/24);
  var row = Math.floor(blocker.y/24);
  var magicAdjust = 6;
  var magicAdjustX = blocker.body.width/2 - magicAdjust;
  var xDiff = player.x - blocker.x;
  if (player.body.touching.up) {
    if (this.isCollisionLocationEmpty(row, col + 1)
      && this.isCollisionLocationEmpty(row - 1, col + 1)
      && xDiff > magicAdjustX) {
        player.x += 1;
    } else if (this.isCollisionLocationEmpty(row, col - 1)
      && this.isCollisionLocationEmpty(row - 1, col - 1)
      && xDiff < -magicAdjustX) {
        player.x -= 1;
    }
  } else if (player.body.touching.down) {
    if (this.isCollisionLocationEmpty(row, col + 1)
      && this.isCollisionLocationEmpty(row + 1, col + 1)
      && xDiff > magicAdjustX) {
        player.x += 1;
    } else if (this.isCollisionLocationEmpty(row, col - 1)
      && this.isCollisionLocationEmpty(row + 1, col - 1)
      && xDiff < -magicAdjustX) {
        player.x -= 1;
    }
  }
};

Unstable.Player.prototype.goalCollide = function(player, goal) {
  "use strict";
  if (goal.ready === true) {
    this.kill();
    this.shadow.kill();
    this.emitter.burst(this.x, this.y);
    var initialDelay = null;
    if (this.game_state.timer && goal.threshold > 0) {
        this.game_state.timer.pause();
        this.game_state.timer.saveTime(Unstable.globals.current_level);

        Unstable.globals.levels[Unstable.globals.current_level].completion = 1;

        var newTrophies = this.trophyManager.calcNewTrophies(
            Unstable.globals.levels[Unstable.globals.current_level]
        );

        if (newTrophies.count > 0) {
            initialDelay = 3;

            if (newTrophies.completion) {

            }

            if (newTrophies.timeTrialTrophy) {

            }

            // TODO: Display trophy awards
            this.trophyManager.displayTrophies(newTrophies, goal);
        }

        if (this.game_state.timer.newHighScore) {
            // TODO: still need to display if a new high score made it into
            // the top 3, even if it doesn't award a new level of trophy
        }

        Unstable.saveProgress();
    } else if (!this.game_state.timer && goal.threshold == 0) {
        Unstable.globals.levels[Unstable.globals.current_level].completion = 1;
        Unstable.saveProgress();
    }

    var direction = this.game_state.game.rnd.integerInRange(0, 3);
    var position = {};
    switch (direction) {
        case 0:
            position.x = this.game_state.game.rnd.integerInRange(0, this.game_state.game.width);
            position.y = -50;
            break;
        case 1:
            position.x = this.game_state.game.rnd.integerInRange(0, this.game_state.game.width);
            position.y = this.game_state.game.height + 50;
            break;
        case 2:
            position.y = this.game_state.game.rnd.integerInRange(0, this.game_state.game.height);
            position.x = -50;
            break;
        case 3:
            position.y = this.game_state.game.rnd.integerInRange(0, this.game_state.game.height);
            position.x = this.game_state.game.width + 50;
            break;
    }
    this.emitter.seekParticlesToLocation(position, this.finishLevel, this, goal, initialDelay);
    Unstable.globals.audio.sfx.teleport.play("", 0, undefined, false, false);
  }
}

Unstable.Player.prototype.finishLevel = function(goal) {
  this.game.state.start("LevelManager", true, false, this.game_state.level_data, goal.levelLink, goal.destGoalId);
}

Unstable.Player.prototype.coinCollide = function(player, coin) {
  "use strict";
  coin.die();
  this.score += 1;
  // this.game_state.game.plugins.screenShake.shake(2);
}

Unstable.Player.prototype.respawnEffect = function(init, dest) {
  this.emitter.burst(init.x, init.y);
  this.emitter.seekParticlesToLocation(dest, this.resetPlayer, this, dest);
}

Unstable.Player.prototype.resetPlayer = function(dest) {
  this.reset(dest.x, dest.y);
  this.shadow.reset(dest.x, dest.y);
}

Unstable.Player.prototype.hazardCollide = function(player, hazard) {
  "use strict";
  player.die();
  hazard.die();
}

Unstable.Player.prototype.triggerCollide = function (player, trigger) {
  "use strict";
  trigger.trigger();
};

Unstable.Player.prototype.teleporterCollide = function (player, teleporter) {
  "use strict";
  this.kill();
  this.shadow.kill();
  this.emitter.burst(this.x, this.y);
  var dest = {};
  if (teleporter.targetId) {
      // TODO: CANIUSE .FIND???
    var target = this.game_state.teleporterTargets.find(function(target) {
        return target.id == teleporter.targetId;
    });
    dest.x = target.x;
    dest.y = target.y;
  } else {
    dest.x = teleporter.targetTile.x * 24;
    dest.y = teleporter.targetTile.y * 24;
  }
  this.emitter.seekParticlesToLocation(dest, this.resetPlayer, this, dest);
};

Unstable.Player.prototype.die = function() {
  this.kill();
  this.shadow.kill();
  this.emitter.burst(this.x, this.y);
  this.emitter.seekParticlesToLocation(this.spawnpoint, this.game_state.restart_level, this.game_state);
  Unstable.globals.audio.sfx.death.play();
  this.game_state.game.plugins.screenShake.shake(6);
}

var Unstable = Unstable || {};

Unstable.Scenery = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.anchor.setTo(0.5, 1);
    this.body.checkCollision.left = false;
    this.body.checkCollision.right = false;

    if (properties.texture == "tree1") {
      this.body.setSize(4, 6, 10, 42);
    } else if (properties.texture == "tree2") {
      this.body.setSize(4, 6, 14, 42);
    } else if (properties.texture == "tree3") {
      this.body.setSize(4, 6, 6, 42);
    } else if (properties.texture == "tree4") {
      this.body.setSize(4, 6, 6, 42);
    } else if (properties.texture == "bush1") {
      this.body.setSize(24, 4, 0, 20);
    } else if (properties.texture == "bush2") {
      this.body.setSize(24, 4, 0, 20);
    } else if (properties.texture == "bush3") {
      this.body.setSize(24, 4, 0, 20);
    } else if (properties.texture == "sensor") {
      this.body.setSize(24, 4, 0, 20);
    } else if (properties.texture == "antenna") {
      this.body.setSize(4, 6, 14, 42);
    } else if (properties.texture == "signal") {
      this.body.setSize(4, 6, 14, 42);
    }

};

Unstable.Scenery.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Scenery.prototype.constructor = Unstable.Turret;

var Unstable = Unstable || {};

Unstable.Hazard = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);
};

Unstable.Hazard.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Hazard.prototype.constructor = Unstable.Hazard;

Unstable.Hazard.prototype.die = function() {
  this.kill();
}

var Unstable = Unstable || {};

Unstable.BouncerHazard = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);

    this.speed = properties.speed;
    this.body.velocity.setTo(parseInt(properties.velocityX), parseInt(properties.velocityY));
    this.body.bounce.set(1);

    this.body.setSize(14, 6, 5, 18);
    this.anchor.setTo(0.5, 1);

    this.shadowOffset = 2;
    this.shadow = game.add.sprite(position.x, position.y + this.shadowOffset, "shadow");
    this.shadow.anchor.setTo(0.5, 1);
    this.shadow.alpha = 0.4;
    this.game_state.groups["shadows"].add(this.shadow);

    this.animations.add("bomb_move", [0, 1, 2, 3], 8, true);
    this.animations.play("bomb_move");

    this.emitter = new Unstable.Emitter(game_state,{x:this.x,y:this.y},{
      offset:{x: 10,y: -18},
      maxParticles: 10,
      width: 2,
      minParticleSpeed: {x: 60, y: -10},
      maxParticleSpeed: {x: 80, y: -30},
      gravity: 5,
      burst: false,
      lifetime: 150,
      frequency: 65,
      particleClass: "fuse",
      scale: {
        minX: 1,
        maxX: 0.3,
        minY: 1,
        maxY: 0.3,
        rate: 300,
        ease: Phaser.Easing.Exponential.In,
        yoyo: false
      }
    });

    this.explosionEmitter = new Unstable.Emitter(game_state, {x:this.x, y:this.y},{
      offset:{x: 0, y: -12},
      maxParticles: 30,
      width: 2,
      minParticleSpeed: {x: -40, y: -40},
      maxParticleSpeed: {x: 40, y: 40},
      gravity: 0,
      burst: true,
      lifetime: 0,
      frequency: 30,
      particleClass: "fuse",
      scale: {
        minX: 1,
        maxX: 0,
        minY: 1,
        maxY: 0,
        rate: 3500,
        ease: Phaser.Easing.Exponential.In,
        yoyo: false
      }
    });

    this.spawnpoint = {x: this.x, y: this.y};

    this.game_state.aliveBombCount++;
};

Unstable.BouncerHazard.prototype = Object.create(Unstable.Hazard.prototype);
Unstable.BouncerHazard.prototype.constructor = Unstable.BouncerHazard;

Unstable.BouncerHazard.prototype.update = function() {
  this.game_state.game.physics.arcade.collide(this, this.game_state.groups.colliders);
  this.game_state.game.physics.arcade.collide(this, this.game_state.groups.enemy_colliders);

  //this.angle += 4;
  if (this.body.velocity.x >= 0) {
    this.scale.x = 1;
    this.emitter.flipDirection(-1);
  } else {
    this.scale.x = -1;
    this.emitter.flipDirection(1);
  }

  this.shadow.x = this.x;
  this.shadow.y = this.y + this.shadowOffset;
  this.emitter.updatePos(this.x, this.y);
}

Unstable.BouncerHazard.prototype.die = function() {
  this.kill();
  this.shadow.kill();
  this.emitter.destroy();
  this.game_state.aliveBombCount--;
  this.explosionEmitter.burst(this.x, this.y);
  this.explosionEmitter.seekParticlesToLocation(this.spawnpoint);
}

var Unstable = Unstable || {};

Unstable.TrackerHazard = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);

    this.speed = parseInt(properties.speed);
    // this.body.velocity.setTo(parseInt(properties.velocityX), parseInt(properties.velocityY));
    this.body.bounce.set(1);

    this.body.setSize(14, 6, 5, 18);
    this.anchor.setTo(0.5, 1);

    this.shadowOffset = 2;
    this.shadow = game.add.sprite(position.x, position.y + this.shadowOffset, "shadow");
    this.shadow.anchor.setTo(0.5, 1);
    this.shadow.alpha = 0.4;
    this.game_state.groups["shadows"].add(this.shadow);

    this.animations.add("bomb_move", [0, 1, 2, 3], 8, true);
    this.animations.play("bomb_move");

    this.gameState = game_state;

    // this.emitter = new Unstable.Emitter(game_state,{x:this.x,y:this.y},{
    //   offset:{x: 10,y: -18},
    //   maxParticles: 10,
    //   width: 2,
    //   minParticleSpeed: {x: 60, y: -10},
    //   maxParticleSpeed: {x: 80, y: -30},
    //   gravity: 5,
    //   burst: false,
    //   lifetime: 150,
    //   frequency: 65,
    //   particleClass: "fuse",
    //   scale: {
    //     minX: 1,
    //     maxX: 0.3,
    //     minY: 1,
    //     maxY: 0.3,
    //     rate: 300,
    //     ease: Phaser.Easing.Exponential.In,
    //     yoyo: false
    //   }
    // });

    this.explosionEmitter = new Unstable.Emitter(game_state, {x:this.x, y:this.y},{
      offset:{x: 0, y: -12},
      maxParticles: 30,
      width: 2,
      minParticleSpeed: {x: -40, y: -40},
      maxParticleSpeed: {x: 40, y: 40},
      gravity: 0,
      burst: true,
      lifetime: 0,
      frequency: 30,
      particleClass: "fuse",
      scale: {
        minX: 1,
        maxX: 0,
        minY: 1,
        maxY: 0,
        rate: 3500,
        ease: Phaser.Easing.Exponential.In,
        yoyo: false
      }
    });

    this.spawnpoint = {x: this.x, y: this.y};

    this.game_state.aliveBombCount++;
};

Unstable.TrackerHazard.prototype = Object.create(Unstable.Hazard.prototype);
Unstable.TrackerHazard.prototype.constructor = Unstable.TrackerHazard;

Unstable.TrackerHazard.prototype.update = function() {
  this.game_state.game.physics.arcade.collide(this, this.game_state.groups.colliders);

  var x = 0;
  var y = 0;

  var xDiff = this.gameState.player.x - this.x;
  if (Math.abs(xDiff) < 2) {
      x = 0;
  } else if (xDiff < 0) {
      x = -this.speed;
  } else if (xDiff > 0) {
      x = this.speed;
  }

  var yDiff = this.gameState.player.y - this.y;
  if (Math.abs(yDiff) < 2) {
      y = 0;
  } else if (yDiff < 0) {
      y = -this.speed;
  } else if (yDiff > 0) {
      y = this.speed;
  }

  this.body.velocity.setTo(x, y);

  if (this.body.velocity.x > 0) {
    this.scale.x = 1;
    // this.emitter.flipDirection(-1);
  } else {
    this.scale.x = -1;
    // this.emitter.flipDirection(1);
  }

  this.shadow.x = this.x;
  this.shadow.y = this.y + this.shadowOffset;
  // this.emitter.updatePos(this.x, this.y);
}

Unstable.TrackerHazard.prototype.die = function() {
  this.kill();
  this.shadow.kill();
  // this.emitter.destroy();
  this.game_state.aliveBombCount--;
  this.explosionEmitter.burst(this.x, this.y);
  this.explosionEmitter.seekParticlesToLocation(this.spawnpoint);
}

var Unstable = Unstable || {};

Unstable.Turret = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.anchor.setTo(0.5, 0.5);
    this.body.setSize(24, 12, 0, 12);

    // this.turret = game.add.sprite(position.x + 12, position.y + 12, properties.texture, 0);
    // this.turret.anchor.setTo(0.5);
    this.range = 100;
    this.cooldown = 3;
    this.coolingDown = false;
    this.active = false;

    this.animations.add("turret_rise", [0, 1, 2, 3], 8);
    this.animations.add("turret_sink", [3, 2, 1, 0], 8);
    //this.animations.play("turret_rise");

};

Unstable.Turret.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Turret.prototype.constructor = Unstable.Turret;

Unstable.Turret.prototype.update = function() {
  //rotate turret
  // var rot = this.game_state.game.physics.arcade.angleBetween(this.turret, this.game_state.groups["player"].getTop());
  // this.turret.rotation = rot;

  if (this.game_state.game.physics.arcade.distanceBetween(this, this.game_state.player) < this.range) {
    if (!this.active) {
      this.animations.play("turret_rise");
      Unstable.globals.audio.sfx.turretRaise.play();
    }
    this.active = true;
  } else {
    if (this.active) {
      this.animations.play("turret_sink");
      Unstable.globals.audio.sfx.turretLower.play();
    }
    this.active = false;
  }

  //shoot Projectile
  if (!this.coolingDown && this.active) {
    // new Unstable.Projectile(this.game_state, {x:this.position.x + 12, y:this.position.y + 12}, {group:"hazards", texture:"enemy_sheet", frame:"4", speed:75});
    if (!this.animations.currentAnim.isPlaying) {
      Unstable.globals.audio.sfx.turretShoot.play();
      new Unstable.Projectile(this.game_state, {x:this.position.x, y:this.position.y}, {x:75, y:0} ,{
        group:"hazards", texture:"enemy_sheet", frame:"4", speed:75, rgroup:"objects", pgroup:"hazards"
      });
      new Unstable.Projectile(this.game_state, {x:this.position.x, y:this.position.y}, {x:-75, y:0} ,{
        group:"hazards", texture:"enemy_sheet", frame:"4", speed:75, rgroup:"objects", pgroup:"hazards"
      });
      new Unstable.Projectile(this.game_state, {x:this.position.x, y:this.position.y}, {x:0, y:75} ,{
        group:"hazards", texture:"enemy_sheet", frame:"4", speed:75, rgroup:"objects", pgroup:"hazards"
      });
      new Unstable.Projectile(this.game_state, {x:this.position.x, y:this.position.y}, {x:0, y:-75} ,{
        group:"hazards", texture:"enemy_sheet", frame:"4", speed:75, rgroup:"objects", pgroup:"hazards"
      });
      this.coolingDown = true;
      game.time.events.add(Phaser.Timer.SECOND * this.cooldown, this.resetCooldown, this);
    }
  }
}

Unstable.Turret.prototype.resetCooldown = function() {
  this.coolingDown = false;
}

var Unstable = Unstable || {};

Unstable.SliderEnemy = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);

    this.cooldown = properties.cooldown;
    this.speed = properties.speed;
    this.minSpeed = properties.minSpeed;
    this.coolingDown = false;
    this.shotSpeed = 75;

    this.axis = properties.axis;
    this.firingOffsetTolerance = properties.firingOffsetTolerance;
    this.prevDirection;

    switch (this.axis) {
        case 'x':
            this.angle = 90;
            this.anchor.setTo(0, 0.5);
            break;
        case 'y':
            this.angle = 0;
            this.anchor.setTo(0.5, 1);
            break;
        default:
            console.error('Invalid Slider Axis: ' + this.axis);
            break;
    }
};

Unstable.SliderEnemy.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.SliderEnemy.prototype.constructor = Unstable.SliderEnemy;

Unstable.SliderEnemy.prototype.update = function() {
    var projVelocity = {
        x: 0,
        y: 0
    }
    var projPosition = {
        x: this.position.x,
        y: this.position.y - this.body.height/2
    }
    switch (this.axis) {
        case 'x':
            if (this.y < this.game_state.player.y) {
                this.scale.x = 1;
                projVelocity.y = this.shotSpeed;
                projPosition.y = this.position.y + Unstable.Projectile.prototype.yBodyOffset;
            } else {
                this.scale.x = -1;
                projVelocity.y = -this.shotSpeed;
            }
            break;
        case 'y':
            if (this.x < this.game_state.player.x) {
                this.scale.x = 1;
                projVelocity.x = this.shotSpeed;
            } else {
                this.scale.x = -1;
                projVelocity.x = -this.shotSpeed;
            }
            break;
        default:
            console.error('Invalid Slider Axis: ' + this.axis);
            break;
    }

    var diff = this.game_state.player[this.axis] - this[this.axis];
    if (Math.abs(diff) <= this.firingOffsetTolerance && !this.coolingDown) {
        Unstable.globals.audio.sfx.turretShoot.play();
        new Unstable.Projectile(
          this.game_state,
          projPosition,
          projVelocity,
          {
              group: "hazards",
              texture: "enemy_sheet",
              frame: "4",
              speed: 75,
              rgroup: "objects",
              pgroup: "hazards"
          }
        );
        this.coolingDown = true;
        game.time.events.add(Phaser.Timer.SECOND * this.cooldown, this.resetCooldown, this);
    } else {
      var pos = {
          x: 0,
          y: 0
      }
      if (this.prevDirection === Math.sign(diff)) {
          pos[this.axis] = this.calculateSpeed(diff);
      } else if (this.prevDirection !== undefined) {
          this[this.axis] = this.game_state.player[this.axis];
      }
      this.body.velocity.setTo(pos.x, pos.y);
      this.prevDirection = Math.sign(diff);
    }
}

Unstable.SliderEnemy.prototype.calculateSpeed = function(playerDiff) {
    // console.log(
    //     Math.sign(playerDiff) * this.minSpeed
    //         + (this.speed - this.minSpeed)
    //         * (Math.abs(playerDiff) / 100)
    // );
    return Math.sign(playerDiff) * this.minSpeed
                + (this.speed - this.minSpeed)
                * (playerDiff / 100);
}

Unstable.SliderEnemy.prototype.resetCooldown = function() {
  this.coolingDown = false;
}

var Unstable = Unstable || {};

Unstable.Projectile = function (game_state, position, velocity, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);

    Unstable.Projectile.prototype.yBodyOffset = 4;
    this.anchor.setTo(0.5);
    this.body.setSize(7, this.yBodyOffset, 9, 10);

    //this.rotation = turret.rotation;
    //game.physics.arcade.velocityFromRotation(this.rotation, properties.speed, this.body.velocity);
    this.body.velocity.x = velocity.x;
    this.body.velocity.y = velocity.y;

    this.shadowOffset = -6;
    this.shadow = game.add.sprite(position.x, position.y + this.shadowOffset, "shadow", 2);
    this.shadow.anchor.setTo(0.5);
    this.shadow.alpha = 0.4;
    this.game_state.groups["shadows"].add(this.shadow);
};

Unstable.Projectile.prototype = Object.create(Unstable.Hazard.prototype);
Unstable.Projectile.prototype.constructor = Unstable.Projectile;

Unstable.Projectile.prototype.update = function() {
  // this.game_state.game.physics.arcade.collide(this, this.game_state.groups.colliders);
  this.shadow.x = this.x;
  this.shadow.y = this.y + this.shadowOffset;
}

Unstable.Projectile.prototype.die = function() {
  this.kill();
  this.shadow.kill();
}

var Unstable = Unstable || {};

Unstable.Collider = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);

    game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.setSize(properties.width, properties.height, 0, 0);
};

Unstable.Collider.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Collider.prototype.constructor = Unstable.Collider;

var Unstable = Unstable || {};

Unstable.Goal = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);
    game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    // this.body.setSize(properties.width, properties.height,
      // (this.width - properties.width)/2, (this.height - properties.height)/2);
    this.body.setSize(20, 6, 2, 18);
    this.anchor.setTo(0.5, 1);
    //colliderTest.visible = false;

    this.coinCount = 0;

    this.game_state = game_state;
    this.threshold = properties.threshold;
    this.levelLink = properties.link;
    this.levelPrereq = properties.levelPrereq;
    this.destGoalId = properties.destGoalId;
    if (this.levelPrereq === null || this.levelPrereq === "") {
      this.updateReady();
    } else {
      if (Unstable.globals.levels[this.levelPrereq] !== null) {
        if (Unstable.globals.levels[this.levelPrereq].completion > 0) {
          this.updateReady();
        } else {
          // console.log("level prereq not completed: " + this.levelPrereq);
        }
      } else {
        // console.log("this level prereq does not exist: " + this.levelPrereq);
      }
    }

    this.displayTrophies = properties.displayTrophies;
    if (this.displayTrophies) {
        this.createTrophies(Unstable.globals.levels[this.levelLink]);
    }

    // Make sure level exists (so not Victory or Empty)
    if (Unstable.globals.levels[this.levelLink]) {
        var style = {
          font: "8px Arial",
          fill: "#FFFFFF",
          align: "center"
        };
        var text = game.add.text(
            this.x,
            this.y + 10,
            Unstable.globals.levels[this.levelLink].name,
            style
        );

        // Setting text.anchor to (0.5, 0.5) causes blurring
        // when width of text object is an odd value.
        // https://github.com/photonstorm/phaser/issues/2370
        // Instead manually offset the position of the text object
        // and round it to an integer value.
        text.x -= Math.round(text.width/2);
        text.y -= Math.round(text.height/2);
        // text.anchor.set(0.5);
    }
};

Unstable.Goal.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Goal.prototype.constructor = Unstable.Goal;

Unstable.Goal.prototype.emit = function(coin) {

}

Unstable.Goal.prototype.createTrophies = function(state) {
    var trophyManager = new TrophyManager();

    var completionTier = trophyManager.calcCompletionTrophy(state);
    this.trophy = this.createTrophy(0, trophyManager.sprites.completion[completionTier]);
    if (completionTier > 0) {
        this.bounceTrophy(this.trophy, true);
    }

    var timeTrialTier = trophyManager.calcTimeTrialTrophy(state);
    this.trophy2 = this.createTrophy(1, trophyManager.sprites.timeTrial[timeTrialTier]);
    if (timeTrialTier > 0) {
        this.bounceTrophy(this.trophy2, false);
    }
}

Unstable.Goal.prototype.createTrophy = function(slot, frame) {
    var x = this.x + (slot === 0 ? -6 : 6);

    var trophy = game.add.sprite(
        x,
        this.y - this.height / 2 - 16,
        "img_objects",
        frame
    );
    trophy.anchor.setTo(0.5, 1);
    trophy.scale.setTo(0.5, 0.5);
    return trophy;
}

Unstable.Goal.prototype.bounceTrophy = function(trophy, startBouncingUp) {
    var bounce = {};
    bounce.top = 1;
    bounce.bottom = -2;

    var bounceUpTween = this.game_state.game.add.tween(trophy).to({
        x: trophy.x,
        y: trophy.y + bounce.top
    }, 1000);

    var bounceDownTween = this.game_state.game.add.tween(trophy).to({
        x: trophy.x,
        y: trophy.y + bounce.bottom
    }, 1000);

    bounceUpTween.onComplete.add(function() {
      bounceDownTween.start();
    });

    bounceDownTween.onComplete.add(function() {
      bounceUpTween.start();
    });

    if (startBouncingUp !== undefined) {
        if (startBouncingUp) {
            bounceUpTween.start();
        } else {
            bounceDownTween.start();
        }
    } else if (this.game_state.game.rnd.integerInRange(0, 1) === 0) {
      bounceUpTween.start();
    } else {
      bounceDownTween.start();
    }
}

Unstable.Goal.prototype.updateReady = function () {
  if (this.coinCount >= this.threshold) {
    this.frame = 9;
    this.ready = true;
  } else {
    this.ready = false;
  }
};

var Unstable = Unstable || {};

Unstable.Coin = function (game_state, position, properties) {
    "use strict";
    Unstable.Prefab.call(this, game_state, position, properties);
    game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.setSize(10, 10, 7, 10);
    this.anchor.setTo(0.5, 1);
    //colliderTest.visible = false;
    //test comment for commit

    this.game_state = game_state;

    this.bounce = {};
    this.bounce.top = 1;
    this.bounce.bottom = -2;

    this.shadowOffset = -1;
    this.shadow = game.add.sprite(position.x, position.y + this.shadowOffset, "shadow", 1);
    this.shadow.anchor.setTo(0.5, 1);
    this.shadow.alpha = 0.4;
    this.game_state.groups["shadows"].add(this.shadow);

    var bounceUpTween = this.game_state.game.add.tween(this).to({x:this.x, y:this.y+this.bounce.top},700);
    var bounceDownTween = this.game_state.game.add.tween(this).to({x:this.x, y:this.y+this.bounce.bottom},700);
    bounceUpTween.onComplete.add(function() {
      bounceDownTween.start();
    })
    bounceDownTween.onComplete.add(function() {
      bounceUpTween.start();
    })
    var upOrDown = game_state.game.rnd.integerInRange(0, 1);
    if (upOrDown === 0)
      bounceUpTween.start();
    else
      bounceDownTween.start();

    this.emitter = new Unstable.Emitter(game_state, {x:this.x, y:this.y},{
      offset:{x: 0, y: -12},
      maxParticles:100,
      width: 2,
      minParticleSpeed: {x: -40, y: -40},
      maxParticleSpeed: {x: 40, y: 40},
      gravity: 0,
      burst: true,
      lifetime: 0, //450
      frequency: 10,
      particleClass: "coin"
    });

    this.spawnpoint = {x: this.x, y: this.y};
};

Unstable.Coin.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Coin.prototype.constructor = Unstable.Coin;

Unstable.Coin.prototype.update = function() {

}

Unstable.Coin.prototype.die = function() {
  this.emitter.burst(this.x, this.y);
  this.game_state.goals.forEach(function(goal) {
    if (goal.threshold > 0) {
        this.emitter.seekParticlesToLocation({x:goal.x, y:goal.y}, this.reachedGoal, this, goal);
    }
  }, this);
  Unstable.globals.audio.sfx.coin.play();
  this.kill();
  this.shadow.kill();
}

Unstable.Coin.prototype.reachedGoal = function(goal) {
  goal.coinCount++;
  if (!goal.ready) {
    goal.updateReady();
  }
}

var Unstable = Unstable || {};

Unstable.Trigger = function(game_state, position, properties) {
  "use strict";
  Unstable.Prefab.call(this, game_state, position, properties);
  game_state.game.physics.arcade.enable(this);
  this.body.immovable = true;
  this.body.setSize(properties.width, properties.height, -properties.width/2 + 12, -properties.height/2 + 12);
  console.log(this.body);
  console.log(this);

  this.game_state = game_state;
  this.timesTriggered = 0;
  this.triggerCountAllowed = properties.triggerCountAllowed;
  this.triggerFunction = properties.triggerFunction;
  this.triggerParams = JSON.parse(properties.triggerParams);

  this.explosionEmitter = new Unstable.Emitter(game_state, {x:this.x, y:this.y},{
    offset:{x: -12, y: 12},
    maxParticles: 30,
    width: 2,
    minParticleSpeed: {x: -40, y: -40},
    maxParticleSpeed: {x: 40, y: 40},
    gravity: 0,
    burst: true,
    lifetime: 5000,
    frequency: 30,
    particleClass: "bridge",
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
}

Unstable.Trigger.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Trigger.prototype.constructor = Unstable.Trigger;

Unstable.Trigger.prototype.trigger = function () {
  "use strict";
  if (this.timesTriggered < this.triggerCountAllowed) {
    this[this.triggerFunction]();
    this.timesTriggered++;
  }
};

Unstable.Trigger.prototype.removeTiles = function () {
  "use strict";
  console.log("TILES REMOVED at x:" + this.triggerParams.x + ", y: " + this.triggerParams.y);
  console.log(this.game_state.layers["base"]);
  // this.game_state.map.putTile(0, this.triggerParams.x, this.triggerParams.y, "base");
  this.game_state.map.removeTile(this.triggerParams.x, this.triggerParams.y, "base");
  this.explosionEmitter.burst(this.triggerParams.x * 24, this.triggerParams.y * 24);
  new Unstable.Collider(this.game_state, {
    x: this.triggerParams.x * 24,
    y: this.triggerParams.y * 24
  },
  {
    group: "colliders",
    texture: "",
    width: 24,
    height: 24
  });
  this.game_state.game.plugins.screenShake.shake(6);
};

var Unstable = Unstable || {};

Unstable.Teleporter = function(game_state, position, properties) {
  "use strict";
  Unstable.Prefab.call(this, game_state, position, properties);
  game_state.game.physics.arcade.enable(this);
  this.body.immovable = true;
  this.anchor.setTo(0.5, 1);

  this.game_state = game_state;
  this.targetTile = JSON.parse(properties.targetTile);
  if (properties.targetId > -1) {
      this.targetId = properties.targetId;
  }
}

Unstable.Teleporter.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Teleporter.prototype.constructor = Unstable.Teleporter;

var Unstable = Unstable || {};

Unstable.TeleporterTarget = function(game_state, position, properties) {
  "use strict";
  Unstable.Prefab.call(this, game_state, position, properties);
  // game_state.game.physics.arcade.enable(this);
  // this.body.immovable = true;
  this.anchor.setTo(0.5, 1);

  this.id = properties.id;
}

Unstable.TeleporterTarget.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.TeleporterTarget.prototype.constructor = Unstable.TeleporterTarget;
