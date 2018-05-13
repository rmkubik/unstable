function VolumeManager(gameState) {
    this.sfx = {};
    this.tracks = {};

    return {
        addSfx: function(key, soundFileKey) {
            this.sfx[key] = this.game.add.sound(soundFileKey);
        },
        addTrack: function(key, trackFileKey) {
            this.tracks[key] = this.game.add.sound(trackFileKey);
        },
        setSfxVolume: function(vol) {
            var sfxKeys = Object.keys(this.sfx);
            sfxKeys.forEach(function(sound) {
                this.sfx[sound].volume = vol;
            });
        },
        setMusicVolume: function(vol) {
            var trackKeys = Object.keys(this.tracks);
            trackKeys.forEach(function(track) {
                this.tracks[track].volume = vol;
            });
        }
    }
}
