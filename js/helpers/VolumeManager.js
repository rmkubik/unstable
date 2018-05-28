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
        setVolumeObject: function(volumes) {
            sfxVol = volumes.sfxVol;
            tracksVol = volumes.tracksVol;
            muted: volumes.muted;
            trackMuted: volumes.trackMuted;
            sfxMuted: volumes.sfxMuted;
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
