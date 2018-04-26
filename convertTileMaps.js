const fs = require('fs');
const path = require('path');
const util = require('util');

const levelsDir = './assets/levels'
const rawDir = path.join(levelsDir, 'raw');
const tilesetsDir = path.join(levelsDir, 'tilesets');
const buildDir = path.join(levelsDir, 'build');

const levelKeyPrefix = 'lvl_';


const readdir = util.promisify(fs.readdir);

async function loadSets() {
    const sets = {};
    const names = await readdir(tilesetsDir);
    names.forEach(name => {
        if (path.extname(name) === '.json') {
            const tileset = require('./' + path.join(tilesetsDir, name));
            sets[path.basename(name, '.json')] = tileset;
            // console.log(`loaded set: ${path.basename(name, '.json')}`);
        }
    });
    return sets;
}

async function loadMaps() {
    const maps = [];
    const names = await readdir(rawDir);
    names.forEach(name => {
        const data = require('./' + path.join(rawDir, name));
        maps.push({
            name: path.basename(name, '.json'),
            data
        });
        // console.log(`loaded map: ${path.basename(name, '.json')}`);
    });
    return maps;
}

async function loadGameData() {
    return require('./' + path.join(levelsDir, 'game_data.json'))
}

async function buildMaps() {

    const sets = await loadSets();
    const maps = await loadMaps();

    maps.forEach(map => {
        const {tilesets} = map.data;
        const externalTilesets = tilesets.filter(set => {
            return set.source !== undefined;
        });
        map.data.tilesets.forEach((set, index) => {
            if (set.source !== undefined) {
                map.data.tilesets[index] = Object.assign(
                    {},
                    sets[path.basename(set.source, '.json')],
                    { 'firstgid': set.firstgid }
                );
            }
        });

        // console.log('converted external tilesets for: ' + map.name);

        const gidSets = {};
        externalTilesets.forEach(set => {
            gidSets[set.firstgid] = sets[path.basename(set.source, '.json')];
        });

        const {layers} = map.data;
        // const objectLayers = layers.filter(layer => !!layer.objects);
        layers.forEach((layer, index) => {
            if (layer.objects) {
                const {objects} = layer;
                const newObjs = [];
                objects.forEach(obj => {
                    const objSet = gidToSet(obj.gid, gidSets);
                    // add in default properties from tileset
                    defaultProps = {};
                    if (objSet.set && objSet.set.tileproperties) {
                        if (objSet.set.tileproperties[objSet.index]) {
                            defaultProps = objSet.set.tileproperties[objSet.index];
                        }
                    }
                    const props = Object.assign(
                        {},
                        defaultProps,
                        obj.properties
                    );
                    obj.properties = props;

                    // do overrides exist on this tileset
                    let overrides = {};
                    if (objSet.set && objSet.set.tiles) {
                        // does this tile have an override
                        overrides = objSet.set.tiles[`${objSet.index}`];
                        if (!overrides) {
                            overrides = {};
                        }
                    }
                    newObjs.push(
                        Object.assign(
                            {},
                            obj,
                            overrides
                        )
                    );
                });
                map.data.layers[index].objects = newObjs;
            }
        });

        // console.log('handled object overrides for: ' + map.name);

        fs.writeFile(
            path.join(buildDir, `${map.name}.json`),
            JSON.stringify(map.data, null, 4),
            () => {}
        );
    });

    const gameData = await loadGameData();
    const levels = Object.entries(gameData.assets).filter(
        asset => asset[1].type === 'tilemap'
    );
    // remove old maps
    levels.forEach(level => {
        delete gameData.assets[level[0]];
    });
    //levelKeyPrefix
    maps.forEach(map => {
        gameData.assets[levelKeyPrefix + map.name] = {
            type: 'tilemap',
            source: path.join(buildDir, map.name) + '.json'
        }
        gameData.levels[levelKeyPrefix + map.name] = {
            "name": convertCamelToTitle(map.name),
            "key": levelKeyPrefix + map.name,
            "tileset": "tilesheet",
            "completion": -1,
            "times": []
        }
    });
    fs.writeFile(
        path.join(levelsDir, 'game_data.json'),
        JSON.stringify(gameData, null, 4),
        () => {}
    );
}

/**
 *  @param {object} sets - keys should be firstgid and value should be tileset
 */
function gidToSet(gid, sets) {
    const sortedGids = [...Object.keys(sets)].sort((a, b) => {
        return parseInt(a) - parseInt(b);
    });
    let setIndex;
    for (let i = 0; i < sortedGids.length; i++) {
        let nextGid;
        if (i === sortedGids.length - 1) {
            nextGid = 1000000000;
        } else {
            nextGid = sortedGids[i + 1];
        }

        if (gid >= sortedGids[i] && gid < nextGid) {
            setIndex = i;
            break;
        }
    }

    if (setIndex === undefined) {
        // console.log(`gid not found: ${gid}`);
    }

    const set = sets[sortedGids[setIndex]];
    const index = gid - sortedGids[setIndex];
    return ({
        set,
        index
    });
}

function convertCamelToTitle(string) {
    const words = string.split(/(?=[A-Z])/);
    words[0] = words[0][0].toUpperCase() + words[0].substr(1);
    return words.join(' ');
}

buildMaps();
