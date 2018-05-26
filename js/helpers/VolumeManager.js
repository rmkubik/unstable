function VolumeManager(game) {
    var sfx = {};
    var tracks = {};
    var sfxVol = 1;
    var tracksVol = 1;
    var muted = false;
    var playingSong;

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
        if (!muted) {
            setAllSfxVolume(vol);
        }
    }

    function setMusicVolume(vol) {
        tracksVol = vol;
        if (!muted) {
            setAllMusicVolume(vol);
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
              game.input.onTap.addOnce(game.sound.context.resume, game.sound.context);
            }
        },
        isMuted: function() {
            return muted;
        },
        mute: function() {
            muted = true;
            setAllSfxVolume(0);
            setAllMusicVolume(0);
        },
        unMute: function() {
            muted = false;
            setAllSfxVolume(sfxVol);
            setAllMusicVolume(tracksVol);
        },
        playSong: function(name) {
            if (
                name != playingSong
                && Unstable.globals.current_level !== 'lvl_hub1'
                && Unstable.globals.current_level !== 'lvl_h1l1'
                && Unstable.globals.current_level !== 'lvl_forest'
                && Unstable.globals.current_level !== 'lvl_h1l3'
                && Unstable.globals.current_level !== 'lvl_h1l4'
                && Unstable.globals.current_level !== 'lvl_h1l5'
                && Unstable.globals.current_level !== 'lvl_hub2'
                && Unstable.globals.current_level !== 'lvl_hub3'
            ) {
                if (playingSong) {
                    tracks[playingSong].pause();
                }
                tracks[name].loopFull();
                playingSong = name;
            }
        },
        volumeUp: function(sfx) {
            if (sfx) {
                setSfxVolume(sfxVol += 0.1);
            } else {
                setMusicVolume(tracksVol += 0.1);
            }
        },
        volumeDown: function(sfx) {
            if (sfx) {
                setSfxVolume(sfxVol -= 0.1);
            } else {
                setMusicVolume(tracksVol -= 0.1);
            }
        }
    }
}
