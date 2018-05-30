const concat = require('concat');
const fs = require('fs');
const buildDir = 'build';
const bundleName = 'bundle.js';

if (!fs.existsSync(buildDir)){
    fs.mkdirSync(buildDir);
}

// var recursive = require("recursive-readdir");
// fs.createReadStream('test.log').pipe(fs.createWriteStream('newLog.log'));

try {
concat(
    [
        "js/helpers/fsm.js",
        "js/helpers/TrophyManager.js",
        "js/helpers/VolumeManager.js",
        "js/states/BootState.js",
        "js/states/LoadingState.js",
        "js/states/MenuState.js",
        "js/states/LevelManagerState.js",
        "js/states/TiledState.js",
        "js/states/EndState.js",
        "js/states/SettingsState.js",
        "js/states/IntroductionState.js",
        "js/plugins/ScreenShake.js",
        "js/prefabs/Prefab.js",
        "js/prefabs/Cloud.js",
        "js/prefabs/BackdropManager.js",
        "js/prefabs/Particles.js",
        "js/prefabs/Timer.js",
        "js/prefabs/Player.js",
        "js/prefabs/Scenery.js",
        "js/prefabs/Hazard.js",
        "js/prefabs/BouncerHazard.js",
        "js/prefabs/TrackerHazard.js",
        "js/prefabs/Turret.js",
        "js/prefabs/SliderEnemy.js",
        "js/prefabs/Projectile.js",
        "js/prefabs/Collider.js",
        "js/prefabs/Goal.js",
        "js/prefabs/Coin.js",
        "js/prefabs/Trigger.js",
        "js/prefabs/Teleporter.js",
        "js/prefabs/TeleporterTarget.js",
    ],
    `${buildDir}/${bundleName}`,
);
} catch (e) {
    console.log(e);
}
