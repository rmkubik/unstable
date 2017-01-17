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

  this.anchor.setTo(0.5);
  this.body.setSize(16, 12, 0, 12);

  this.shadowOffset = 2;
  this.shadow = game.add.sprite(-1, this.shadowOffset, "shadow", 1);
  this.shadow.anchor.setTo(0.5,0.5);
  this.shadow.alpha = 0.4;
  this.game_state.groups["shadows"].add(this.shadow);
  //this.addChild(this.shadow);

  this.animations.add("player_run", [2, 3, 4, 5], 10, true);
  this.animations.add("player_idle", [0, 1], 1, true);

  this.animations.play("player_idle");

  this.cursors = this.game_state.game.input.keyboard.createCursorKeys();

  this.emitter = new Unstable.Emitter(game_state, {x:this.x, y:this.y},{
    offset:{x:-12,y:12},
    maxParticles: 30,
    width: 2,
    minParticleSpeed: {x: -40, y: -40},
    maxParticleSpeed: {x: 40, y: 40},
    gravity: 0,
    burst: true,
    lifetime: 0, //450
    frequency: 30,
    particleClass: "player"
  });

  this.spawnpoint = {x: this.x, y: this.y};
}

Unstable.Player.prototype = Object.create(Unstable.Prefab.prototype);
Unstable.Player.prototype.constructor = Unstable.Player;

Unstable.Player.prototype.update = function() {
  this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
  this.game_state.game.physics.arcade.collide(this, this.game_state.groups.colliders);
  this.game_state.game.physics.arcade.collide(this, this.game_state.groups.objects, this.collideObjects, null, this);
  // this.game_state.game.physics.arcade.collide(this, this.game_state.groups.goal, this.goalCollide, null, this);
  // this.game_state.game.physics.arcade.collide(this, this.game_state.groups.coins, this.coinCollide, null, this);
  // this.game_state.game.physics.arcade.collide(this, this.game_state.groups.hazards, this.hazardCollide, null, this);

  if (this.cursors.right.isDown && this.body.velocity.x >= 0) {
      // move right
      this.body.velocity.x = this.walking_speed;
      this.shadow.x = this.x + 1;
      this.animations.play("player_run");
      this.scale.setTo(1, 1);
  } else if (this.cursors.left.isDown && this.body.velocity.x <= 0) {
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

  if (this.cursors.down.isDown && this.body.velocity.y >= 0) {
    //move down
    this.body.velocity.y = this.walking_speed;
    this.shadow.y = this.y + this.shadowOffset * 2;
    this.animations.play("player_run");
  } else if (this.cursors.up.isDown && this.body.velocity.y <= 0) {
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
}

Unstable.Player.prototype.collideObjects = function(player, object) {
  "use strict";
  console.log(object.pgroup);
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
  }
}

Unstable.Player.prototype.goalCollide = function(player, goal) {
  "use strict";
  //this.game_state.restart_level();
  if (goal.ready === true) {
      Unstable.globals.levels[Unstable.globals.current_level].completion = 1;
      this.game.state.start("LevelManager", true, false, this.game_state.level_data, goal.levelLink);
  }
}

Unstable.Player.prototype.coinCollide = function(player, coin) {
  "use strict";
  coin.die();
  this.score += 1;
  this.game_state.coins += 1;
  this.game_state.goals.forEach(function(goal) {
    if (!goal.ready) {
      console.log("goal not ready");
      goal.updateReady();
    }
    console.log("goal ready state: " + goal.ready);
  });
  console.log("score: " + this.score);
}

Unstable.Player.prototype.hazardCollide = function(player, hazard) {
  "use strict";
  player.die();
  hazard.die();
}

Unstable.Player.prototype.die = function() {
  this.kill();
  this.shadow.kill();
  this.emitter.returnToSpawn(this);
}
