function VolumeManager(game) {
    var sfx = {};
    var tracks = {};
    var sfxVol = 1;
    var tracksVol = 1;
    var muted = false;
    var playingSong;
    var sfxMuted = false;
    var trackMuted = false;

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
        isTrackMuted: function() {
            return trackMuted;
        },
        isSfxMuted: function() {
            return sfxMuted;
        },
        mute: function(type) {
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
        },
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
        getVolume: function(sfx) {
            if (sfx) {
                return sfxVol;
            } else {
                return tracksVol;
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
