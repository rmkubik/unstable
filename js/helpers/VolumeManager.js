function VolumeManager(game) {
    var sfx = {};
    var tracks = {};

    return {
        sfx: sfx,
        tracks: tracks,
        addSfx: function(key, soundFileKey) {
            sfx[key] = game.add.sound(soundFileKey);
        },
        addTrack: function(key, trackFileKey) {
            tracks[key] = game.add.sound(trackFileKey);
        },
        setSfxVolume: function(vol) {
            var sfxKeys = Object.keys(sfx);
            sfxKeys.forEach(function(sound) {
                sfx[sound].volume = vol;
            });
        },
        setMusicVolume: function(vol) {
            var trackKeys = Object.keys(tracks);
            trackKeys.forEach(function(track) {
                tracks[track].volume = vol;
            });
        }
    }
}
