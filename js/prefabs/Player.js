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

  this.stepSound1 = this.game.add.audio("sfx_step1");
  this.stepSound2 = this.game.add.audio("sfx_step2");
  this.stepToggle = 1;

  this.teleportSound = this.game.add.audio("sfx_teleport");

  if (properties.spawnFromGoal) {
    this.kill();
    this.shadow.kill();
  }
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
      this.stepSound1.play("", 0, 1, false, false);
      this.stepToggle = 2;
    } else if (this.stepToggle === 2) {
      this.stepSound2.play("", 0, 1, false, false);
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
  //this.game_state.restart_level();
  if (goal.ready === true) {
    this.kill();
    this.shadow.kill();
    this.emitter.burst(this.x, this.y);
    var initialDelay = null;
    if (this.game_state.timer && goal.threshold > 0) {
        this.game_state.timer.pause();
        this.game_state.timer.saveTime(Unstable.globals.current_level);
        if (this.game_state.timer.newHighScore) {
            initialDelay = 3;
        }
        Unstable.globals.levels[Unstable.globals.current_level].completion = 1;
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
    // this.game_state.game.sound.play("sfx_teleport"); //needs to be played globally
    this.teleportSound.play("", 0, 1, false, false);
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
      //TODO: CANIUSE .FIND???
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
  this.game_state.game.sound.play("sfx_death");
  this.game_state.game.plugins.screenShake.shake(6);
}
