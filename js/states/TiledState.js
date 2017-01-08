var Unstable = Unstable || {};

Unstable.TiledState = function () {
    "use strict";
    Phaser.State.call(this);
};

Unstable.TiledState.prototype = Object.create(Phaser.State.prototype);
Unstable.TiledState.prototype.constructor = Unstable.TiledState;

Unstable.TiledState.prototype.init = function (level_data) {
    "use strict";
    this.level_data = level_data;

    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    // start physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    // create map and set tilesets
    this.map = this.game.add.tilemap(level_data.map.key);
    this.map.addTilesetImage(this.map.tilesets[1].name, level_data.map.tileset);
    this.map.addTilesetImage(this.map.tilesets[2].name, "collision");

    Unstable.Emitter.init();
};

Unstable.TiledState.prototype.create = function () {
    "use strict";
    var group_name, object_layer, collision_tiles;

    this.goals = [];

    this.groups = {};
    this.groups["colliders"] = this.game.add.group();

    // create map layers
    this.layers = {};
    this.map.layers.forEach(function (layer) {
        if (!layer.properties.collision) {
          this.layers[layer.name] = this.map.createLayer(layer.name);
        } else { // collision layer
            layer.data.forEach(function (data_row) { // find tiles used in the layer
                data_row.forEach(function (tile) {
                  if (tile.index > 0) {
                    new Unstable.Collider(this, {x:tile.x * 24,y:tile.y * 24}, {group:"colliders",texture:"",width:24,height:24});
                  }
                }, this);
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
        if (this.map.objects.hasOwnProperty(object_layer)) {
            // create layer objects
            this.map.objects[object_layer].forEach(this.create_object, this);
        }
    }

    this.coins = 0;

    var restart_key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    restart_key.onDown.add(this.restart_level, this);
};

Unstable.TiledState.prototype.update = function() {
  this.groups["objects"].sort('y', Phaser.Group.SORT_ASCENDING); //depth sorting
}

Unstable.TiledState.prototype.create_object = function (object) {
    "use strict";
    var position, prefab;
    // tiled coordinates starts in the bottom left corner
    position = {"x": object.x, "y": object.y - (this.map.tileHeight)};
    // create object according to its type
    switch (object.type) {
    case "player":
      prefab = new Unstable.Player(this, position, object.properties);
      this.player = prefab;
      break;
    case "goal":
      prefab = new Unstable.Goal(this, position, object.properties);
      this.goals.push(prefab);
      break;
    case "coin":
      prefab = new Unstable.Coin(this, position, object.properties);
      break;
    case "hazard":
      prefab = new Unstable.Hazard(this, position, object.properties);
      break;
    case "bouncer":
      prefab = new Unstable.BouncerHazard(this, position, object.properties);
      break;
    case "tree":
      prefab = new Unstable.Prefab(this, position, object.properties);
      prefab.anchor.setTo(0, 0.5);
      break;
    case "bush":
      prefab = new Unstable.Prefab(this, position, object.properties);
      break;
    case "crate":
      prefab = new Unstable.Prefab(this, position, object.properties);
      break;
    case "turret":
      prefab = new Unstable.Turret(this, position, object.properties);
    }
    this.prefabs[object.name] = prefab;
};

Unstable.TiledState.prototype.restart_level = function () {
    "use strict";
    if (this.player.alive) {
      this.player.die();
    }
    this.game.state.restart(true, false, this.level_data);
};
