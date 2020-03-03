(window.webpackJsonp = window.webpackJsonp || []).push([[1], {
    0: function(n, l, e) {
        n.exports = e("zUnb")
    },
    HlzF: function(n, l, e) {
        var t;
        !function() {
            "use strict";
            var e = function() {
                this.init()
            };
            e.prototype = {
                init: function() {
                    var n = this || u;
                    return n._counter = 1e3,
                    n._html5AudioPool = [],
                    n.html5PoolSize = 10,
                    n._codecs = {},
                    n._howls = [],
                    n._muted = !1,
                    n._volume = 1,
                    n._canPlayEvent = "canplaythrough",
                    n._navigator = "undefined" != typeof window && window.navigator ? window.navigator : null,
                    n.masterGain = null,
                    n.noAudio = !1,
                    n.usingWebAudio = !0,
                    n.autoSuspend = !0,
                    n.ctx = null,
                    n.autoUnlock = !0,
                    n._setup(),
                    n
                },
                volume: function(n) {
                    var l = this || u;
                    if (n = parseFloat(n),
                    l.ctx || h(),
                    void 0 !== n && n >= 0 && n <= 1) {
                        if (l._volume = n,
                        l._muted)
                            return l;
                        l.usingWebAudio && l.masterGain.gain.setValueAtTime(n, u.ctx.currentTime);
                        for (var e = 0; e < l._howls.length; e++)
                            if (!l._howls[e]._webAudio)
                                for (var t = l._howls[e]._getSoundIds(), r = 0; r < t.length; r++) {
                                    var i = l._howls[e]._soundById(t[r]);
                                    i && i._node && (i._node.volume = i._volume * n)
                                }
                        return l
                    }
                    return l._volume
                },
                mute: function(n) {
                    var l = this || u;
                    l.ctx || h(),
                    l._muted = n,
                    l.usingWebAudio && l.masterGain.gain.setValueAtTime(n ? 0 : l._volume, u.ctx.currentTime);
                    for (var e = 0; e < l._howls.length; e++)
                        if (!l._howls[e]._webAudio)
                            for (var t = l._howls[e]._getSoundIds(), r = 0; r < t.length; r++) {
                                var i = l._howls[e]._soundById(t[r]);
                                i && i._node && (i._node.muted = !!n || i._muted)
                            }
                    return l
                },
                unload: function() {
                    for (var n = this || u, l = n._howls.length - 1; l >= 0; l--)
                        n._howls[l].unload();
                    return n.usingWebAudio && n.ctx && void 0 !== n.ctx.close && (n.ctx.close(),
                    n.ctx = null,
                    h()),
                    n
                },
                codecs: function(n) {
                    return (this || u)._codecs[n.replace(/^x-/, "")]
                },
                _setup: function() {
                    var n = this || u;
                    if (n.state = n.ctx && n.ctx.state || "suspended",
                    n._autoSuspend(),
                    !n.usingWebAudio)
                        if ("undefined" != typeof Audio)
                            try {
                                void 0 === (new Audio).oncanplaythrough && (n._canPlayEvent = "canplay")
                            } catch (l) {
                                n.noAudio = !0
                            }
                        else
                            n.noAudio = !0;
                    try {
                        (new Audio).muted && (n.noAudio = !0)
                    } catch (l) {}
                    return n.noAudio || n._setupCodecs(),
                    n
                },
                _setupCodecs: function() {
                    var n = this || u
                      , l = null;
                    try {
                        l = "undefined" != typeof Audio ? new Audio : null
                    } catch (i) {
                        return n
                    }
                    if (!l || "function" != typeof l.canPlayType)
                        return n;
                    var e = l.canPlayType("audio/mpeg;").replace(/^no$/, "")
                      , t = n._navigator && n._navigator.userAgent.match(/OPR\/([0-6].)/g)
                      , r = t && parseInt(t[0].split("/")[1], 10) < 33;
                    return n._codecs = {
                        mp3: !(r || !e && !l.canPlayType("audio/mp3;").replace(/^no$/, "")),
                        mpeg: !!e,
                        opus: !!l.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
                        ogg: !!l.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                        oga: !!l.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
                        wav: !!l.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ""),
                        aac: !!l.canPlayType("audio/aac;").replace(/^no$/, ""),
                        caf: !!l.canPlayType("audio/x-caf;").replace(/^no$/, ""),
                        m4a: !!(l.canPlayType("audio/x-m4a;") || l.canPlayType("audio/m4a;") || l.canPlayType("audio/aac;")).replace(/^no$/, ""),
                        mp4: !!(l.canPlayType("audio/x-mp4;") || l.canPlayType("audio/mp4;") || l.canPlayType("audio/aac;")).replace(/^no$/, ""),
                        weba: !!l.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
                        webm: !!l.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ""),
                        dolby: !!l.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
                        flac: !!(l.canPlayType("audio/x-flac;") || l.canPlayType("audio/flac;")).replace(/^no$/, "")
                    },
                    n
                },
                _unlockAudio: function() {
                    var n = this || u;
                    if (!n._audioUnlocked && n.ctx) {
                        n._audioUnlocked = !1,
                        n.autoUnlock = !1,
                        n._mobileUnloaded || 44100 === n.ctx.sampleRate || (n._mobileUnloaded = !0,
                        n.unload()),
                        n._scratchBuffer = n.ctx.createBuffer(1, 1, 22050);
                        var l = function(e) {
                            for (var t = 0; t < n.html5PoolSize; t++)
                                try {
                                    var u = new Audio;
                                    u._unlocked = !0,
                                    n._releaseHtml5Audio(u)
                                } catch (e) {
                                    n.noAudio = !0
                                }
                            for (t = 0; t < n._howls.length; t++)
                                if (!n._howls[t]._webAudio)
                                    for (var r = n._howls[t]._getSoundIds(), i = 0; i < r.length; i++) {
                                        var s = n._howls[t]._soundById(r[i]);
                                        s && s._node && !s._node._unlocked && (s._node._unlocked = !0,
                                        s._node.load())
                                    }
                            n._autoResume();
                            var o = n.ctx.createBufferSource();
                            o.buffer = n._scratchBuffer,
                            o.connect(n.ctx.destination),
                            void 0 === o.start ? o.noteOn(0) : o.start(0),
                            "function" == typeof n.ctx.resume && n.ctx.resume(),
                            o.onended = function() {
                                o.disconnect(0),
                                n._audioUnlocked = !0,
                                document.removeEventListener("touchstart", l, !0),
                                document.removeEventListener("touchend", l, !0),
                                document.removeEventListener("click", l, !0);
                                for (var e = 0; e < n._howls.length; e++)
                                    n._howls[e]._emit("unlock")
                            }
                        };
                        return document.addEventListener("touchstart", l, !0),
                        document.addEventListener("touchend", l, !0),
                        document.addEventListener("click", l, !0),
                        n
                    }
                },
                _obtainHtml5Audio: function() {
                    var n = this || u;
                    if (n._html5AudioPool.length)
                        return n._html5AudioPool.pop();
                    var l = (new Audio).play();
                    return l && "undefined" != typeof Promise && (l instanceof Promise || "function" == typeof l.then) && l.catch((function() {
                        console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.")
                    }
                    )),
                    new Audio
                },
                _releaseHtml5Audio: function(n) {
                    var l = this || u;
                    return n._unlocked && l._html5AudioPool.push(n),
                    l
                },
                _autoSuspend: function() {
                    var n = this;
                    if (n.autoSuspend && n.ctx && void 0 !== n.ctx.suspend && u.usingWebAudio) {
                        for (var l = 0; l < n._howls.length; l++)
                            if (n._howls[l]._webAudio)
                                for (var e = 0; e < n._howls[l]._sounds.length; e++)
                                    if (!n._howls[l]._sounds[e]._paused)
                                        return n;
                        return n._suspendTimer && clearTimeout(n._suspendTimer),
                        n._suspendTimer = setTimeout((function() {
                            n.autoSuspend && (n._suspendTimer = null,
                            n.state = "suspending",
                            n.ctx.suspend().then((function() {
                                n.state = "suspended",
                                n._resumeAfterSuspend && (delete n._resumeAfterSuspend,
                                n._autoResume())
                            }
                            )))
                        }
                        ), 3e4),
                        n
                    }
                },
                _autoResume: function() {
                    var n = this;
                    if (n.ctx && void 0 !== n.ctx.resume && u.usingWebAudio)
                        return "running" === n.state && n._suspendTimer ? (clearTimeout(n._suspendTimer),
                        n._suspendTimer = null) : "suspended" === n.state ? (n.ctx.resume().then((function() {
                            n.state = "running";
                            for (var l = 0; l < n._howls.length; l++)
                                n._howls[l]._emit("resume")
                        }
                        )),
                        n._suspendTimer && (clearTimeout(n._suspendTimer),
                        n._suspendTimer = null)) : "suspending" === n.state && (n._resumeAfterSuspend = !0),
                        n
                }
            };
            var u = new e
              , r = function(n) {
                n.src && 0 !== n.src.length ? this.init(n) : console.error("An array of source files must be passed with any new Howl.")
            };
            r.prototype = {
                init: function(n) {
                    var l = this;
                    return u.ctx || h(),
                    l._autoplay = n.autoplay || !1,
                    l._format = "string" != typeof n.format ? n.format : [n.format],
                    l._html5 = n.html5 || !1,
                    l._muted = n.mute || !1,
                    l._loop = n.loop || !1,
                    l._pool = n.pool || 5,
                    l._preload = "boolean" != typeof n.preload || n.preload,
                    l._rate = n.rate || 1,
                    l._sprite = n.sprite || {},
                    l._src = "string" != typeof n.src ? n.src : [n.src],
                    l._volume = void 0 !== n.volume ? n.volume : 1,
                    l._xhrWithCredentials = n.xhrWithCredentials || !1,
                    l._duration = 0,
                    l._state = "unloaded",
                    l._sounds = [],
                    l._endTimers = {},
                    l._queue = [],
                    l._playLock = !1,
                    l._onend = n.onend ? [{
                        fn: n.onend
                    }] : [],
                    l._onfade = n.onfade ? [{
                        fn: n.onfade
                    }] : [],
                    l._onload = n.onload ? [{
                        fn: n.onload
                    }] : [],
                    l._onloaderror = n.onloaderror ? [{
                        fn: n.onloaderror
                    }] : [],
                    l._onplayerror = n.onplayerror ? [{
                        fn: n.onplayerror
                    }] : [],
                    l._onpause = n.onpause ? [{
                        fn: n.onpause
                    }] : [],
                    l._onplay = n.onplay ? [{
                        fn: n.onplay
                    }] : [],
                    l._onstop = n.onstop ? [{
                        fn: n.onstop
                    }] : [],
                    l._onmute = n.onmute ? [{
                        fn: n.onmute
                    }] : [],
                    l._onvolume = n.onvolume ? [{
                        fn: n.onvolume
                    }] : [],
                    l._onrate = n.onrate ? [{
                        fn: n.onrate
                    }] : [],
                    l._onseek = n.onseek ? [{
                        fn: n.onseek
                    }] : [],
                    l._onunlock = n.onunlock ? [{
                        fn: n.onunlock
                    }] : [],
                    l._onresume = [],
                    l._webAudio = u.usingWebAudio && !l._html5,
                    void 0 !== u.ctx && u.ctx && u.autoUnlock && u._unlockAudio(),
                    u._howls.push(l),
                    l._autoplay && l._queue.push({
                        event: "play",
                        action: function() {
                            l.play()
                        }
                    }),
                    l._preload && l.load(),
                    l
                },
                load: function() {
                    var n = null;
                    if (u.noAudio)
                        this._emit("loaderror", null, "No audio support.");
                    else {
                        "string" == typeof this._src && (this._src = [this._src]);
                        for (var l = 0; l < this._src.length; l++) {
                            var e, t;
                            if (this._format && this._format[l])
                                e = this._format[l];
                            else {
                                if ("string" != typeof (t = this._src[l])) {
                                    this._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                                    continue
                                }
                                (e = /^data:audio\/([^;,]+);/i.exec(t)) || (e = /\.([^.]+)$/.exec(t.split("?", 1)[0])),
                                e && (e = e[1].toLowerCase())
                            }
                            if (e || console.warn('No file extension was found. Consider using the "format" property or specify an extension.'),
                            e && u.codecs(e)) {
                                n = this._src[l];
                                break
                            }
                        }
                        if (n)
                            return this._src = n,
                            this._state = "loading",
                            "https:" === window.location.protocol && "http:" === n.slice(0, 5) && (this._html5 = !0,
                            this._webAudio = !1),
                            new i(this),
                            this._webAudio && o(this),
                            this;
                        this._emit("loaderror", null, "No codec support for selected audio sources.")
                    }
                },
                play: function(n, l) {
                    var e = this
                      , t = null;
                    if ("number" == typeof n)
                        t = n,
                        n = null;
                    else {
                        if ("string" == typeof n && "loaded" === e._state && !e._sprite[n])
                            return null;
                        if (void 0 === n && (n = "__default",
                        !e._playLock)) {
                            for (var r = 0, i = 0; i < e._sounds.length; i++)
                                e._sounds[i]._paused && !e._sounds[i]._ended && (r++,
                                t = e._sounds[i]._id);
                            1 === r ? n = null : t = null
                        }
                    }
                    var s = t ? e._soundById(t) : e._inactiveSound();
                    if (!s)
                        return null;
                    if (t && !n && (n = s._sprite || "__default"),
                    "loaded" !== e._state) {
                        s._sprite = n,
                        s._ended = !1;
                        var o = s._id;
                        return e._queue.push({
                            event: "play",
                            action: function() {
                                e.play(o)
                            }
                        }),
                        o
                    }
                    if (t && !s._paused)
                        return l || e._loadQueue("play"),
                        s._id;
                    e._webAudio && u._autoResume();
                    var a = Math.max(0, s._seek > 0 ? s._seek : e._sprite[n][0] / 1e3)
                      , c = Math.max(0, (e._sprite[n][0] + e._sprite[n][1]) / 1e3 - a)
                      , d = 1e3 * c / Math.abs(s._rate)
                      , h = e._sprite[n][0] / 1e3
                      , p = (e._sprite[n][0] + e._sprite[n][1]) / 1e3;
                    s._sprite = n,
                    s._ended = !1;
                    var f = function() {
                        s._paused = !1,
                        s._seek = a,
                        s._start = h,
                        s._stop = p,
                        s._loop = !(!s._loop && !e._sprite[n][2])
                    };
                    if (!(a >= p)) {
                        var g = s._node;
                        if (e._webAudio) {
                            var m = function() {
                                e._playLock = !1,
                                f(),
                                e._refreshBuffer(s),
                                g.gain.setValueAtTime(s._muted || e._muted ? 0 : s._volume, u.ctx.currentTime),
                                s._playStart = u.ctx.currentTime,
                                void 0 === g.bufferSource.start ? g.bufferSource.noteGrainOn(0, a, s._loop ? 86400 : c) : g.bufferSource.start(0, a, s._loop ? 86400 : c),
                                d !== 1 / 0 && (e._endTimers[s._id] = setTimeout(e._ended.bind(e, s), d)),
                                l || setTimeout((function() {
                                    e._emit("play", s._id),
                                    e._loadQueue()
                                }
                                ), 0)
                            };
                            "running" === u.state ? m() : (e._playLock = !0,
                            e.once("resume", m),
                            e._clearTimer(s._id))
                        } else {
                            var v = function() {
                                g.currentTime = a,
                                g.muted = s._muted || e._muted || u._muted || g.muted,
                                g.volume = s._volume * u.volume(),
                                g.playbackRate = s._rate;
                                try {
                                    var t = g.play();
                                    if (t && "undefined" != typeof Promise && (t instanceof Promise || "function" == typeof t.then) ? (e._playLock = !0,
                                    f(),
                                    t.then((function() {
                                        e._playLock = !1,
                                        g._unlocked = !0,
                                        l || (e._emit("play", s._id),
                                        e._loadQueue())
                                    }
                                    )).catch((function() {
                                        e._playLock = !1,
                                        e._emit("playerror", s._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction."),
                                        s._ended = !0,
                                        s._paused = !0
                                    }
                                    ))) : l || (e._playLock = !1,
                                    f(),
                                    e._emit("play", s._id),
                                    e._loadQueue()),
                                    g.playbackRate = s._rate,
                                    g.paused)
                                        return void e._emit("playerror", s._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                                    "__default" !== n || s._loop ? e._endTimers[s._id] = setTimeout(e._ended.bind(e, s), d) : (e._endTimers[s._id] = function() {
                                        e._ended(s),
                                        g.removeEventListener("ended", e._endTimers[s._id], !1)
                                    }
                                    ,
                                    g.addEventListener("ended", e._endTimers[s._id], !1))
                                } catch (r) {
                                    e._emit("playerror", s._id, r)
                                }
                            };
                            "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA" === g.src && (g.src = e._src,
                            g.load());
                            var _ = window && window.ejecta || !g.readyState && u._navigator.isCocoonJS;
                            if (g.readyState >= 3 || _)
                                v();
                            else {
                                e._playLock = !0;
                                var b = function() {
                                    v(),
                                    g.removeEventListener(u._canPlayEvent, b, !1)
                                };
                                g.addEventListener(u._canPlayEvent, b, !1),
                                e._clearTimer(s._id)
                            }
                        }
                        return s._id
                    }
                    e._ended(s)
                },
                pause: function(n) {
                    var l = this;
                    if ("loaded" !== l._state || l._playLock)
                        return l._queue.push({
                            event: "pause",
                            action: function() {
                                l.pause(n)
                            }
                        }),
                        l;
                    for (var e = l._getSoundIds(n), t = 0; t < e.length; t++) {
                        l._clearTimer(e[t]);
                        var u = l._soundById(e[t]);
                        if (u && !u._paused && (u._seek = l.seek(e[t]),
                        u._rateSeek = 0,
                        u._paused = !0,
                        l._stopFade(e[t]),
                        u._node))
                            if (l._webAudio) {
                                if (!u._node.bufferSource)
                                    continue;
                                void 0 === u._node.bufferSource.stop ? u._node.bufferSource.noteOff(0) : u._node.bufferSource.stop(0),
                                l._cleanBuffer(u._node)
                            } else
                                isNaN(u._node.duration) && u._node.duration !== 1 / 0 || u._node.pause();
                        arguments[1] || l._emit("pause", u ? u._id : null)
                    }
                    return l
                },
                stop: function(n, l) {
                    var e = this;
                    if ("loaded" !== e._state || e._playLock)
                        return e._queue.push({
                            event: "stop",
                            action: function() {
                                e.stop(n)
                            }
                        }),
                        e;
                    for (var t = e._getSoundIds(n), u = 0; u < t.length; u++) {
                        e._clearTimer(t[u]);
                        var r = e._soundById(t[u]);
                        r && (r._seek = r._start || 0,
                        r._rateSeek = 0,
                        r._paused = !0,
                        r._ended = !0,
                        e._stopFade(t[u]),
                        r._node && (e._webAudio ? r._node.bufferSource && (void 0 === r._node.bufferSource.stop ? r._node.bufferSource.noteOff(0) : r._node.bufferSource.stop(0),
                        e._cleanBuffer(r._node)) : isNaN(r._node.duration) && r._node.duration !== 1 / 0 || (r._node.currentTime = r._start || 0,
                        r._node.pause(),
                        r._node.duration === 1 / 0 && e._clearSound(r._node))),
                        l || e._emit("stop", r._id))
                    }
                    return e
                },
                mute: function(n, l) {
                    var e = this;
                    if ("loaded" !== e._state || e._playLock)
                        return e._queue.push({
                            event: "mute",
                            action: function() {
                                e.mute(n, l)
                            }
                        }),
                        e;
                    if (void 0 === l) {
                        if ("boolean" != typeof n)
                            return e._muted;
                        e._muted = n
                    }
                    for (var t = e._getSoundIds(l), r = 0; r < t.length; r++) {
                        var i = e._soundById(t[r]);
                        i && (i._muted = n,
                        i._interval && e._stopFade(i._id),
                        e._webAudio && i._node ? i._node.gain.setValueAtTime(n ? 0 : i._volume, u.ctx.currentTime) : i._node && (i._node.muted = !!u._muted || n),
                        e._emit("mute", i._id))
                    }
                    return e
                },
                volume: function() {
                    var n, l, e, t = this, r = arguments;
                    if (0 === r.length)
                        return t._volume;
                    if (1 === r.length || 2 === r.length && void 0 === r[1]) {
                        var i = t._getSoundIds()
                          , s = i.indexOf(r[0]);
                        s >= 0 ? l = parseInt(r[0], 10) : n = parseFloat(r[0])
                    } else
                        r.length >= 2 && (n = parseFloat(r[0]),
                        l = parseInt(r[1], 10));
                    if (!(void 0 !== n && n >= 0 && n <= 1))
                        return (e = l ? t._soundById(l) : t._sounds[0]) ? e._volume : 0;
                    if ("loaded" !== t._state || t._playLock)
                        return t._queue.push({
                            event: "volume",
                            action: function() {
                                t.volume.apply(t, r)
                            }
                        }),
                        t;
                    void 0 === l && (t._volume = n),
                    l = t._getSoundIds(l);
                    for (var o = 0; o < l.length; o++)
                        (e = t._soundById(l[o])) && (e._volume = n,
                        r[2] || t._stopFade(l[o]),
                        t._webAudio && e._node && !e._muted ? e._node.gain.setValueAtTime(n, u.ctx.currentTime) : e._node && !e._muted && (e._node.volume = n * u.volume()),
                        t._emit("volume", e._id));
                    return t
                },
                fade: function(n, l, e, t) {
                    var r = this;
                    if ("loaded" !== r._state || r._playLock)
                        return r._queue.push({
                            event: "fade",
                            action: function() {
                                r.fade(n, l, e, t)
                            }
                        }),
                        r;
                    n = parseFloat(n),
                    l = parseFloat(l),
                    e = parseFloat(e),
                    r.volume(n, t);
                    for (var i = r._getSoundIds(t), s = 0; s < i.length; s++) {
                        var o = r._soundById(i[s]);
                        if (o) {
                            if (t || r._stopFade(i[s]),
                            r._webAudio && !o._muted) {
                                var a = u.ctx.currentTime
                                  , c = a + e / 1e3;
                                o._volume = n,
                                o._node.gain.setValueAtTime(n, a),
                                o._node.gain.linearRampToValueAtTime(l, c)
                            }
                            r._startFadeInterval(o, n, l, e, i[s], void 0 === t)
                        }
                    }
                    return r
                },
                _startFadeInterval: function(n, l, e, t, u, r) {
                    var i = this
                      , s = l
                      , o = e - l
                      , a = Math.abs(o / .01)
                      , c = Math.max(4, a > 0 ? t / a : t)
                      , d = Date.now();
                    n._fadeTo = e,
                    n._interval = setInterval((function() {
                        var u = (Date.now() - d) / t;
                        d = Date.now(),
                        s += o * u,
                        s = Math.max(0, s),
                        s = Math.min(1, s),
                        s = Math.round(100 * s) / 100,
                        i._webAudio ? n._volume = s : i.volume(s, n._id, !0),
                        r && (i._volume = s),
                        (e < l && s <= e || e > l && s >= e) && (clearInterval(n._interval),
                        n._interval = null,
                        n._fadeTo = null,
                        i.volume(e, n._id),
                        i._emit("fade", n._id))
                    }
                    ), c)
                },
                _stopFade: function(n) {
                    var l = this._soundById(n);
                    return l && l._interval && (this._webAudio && l._node.gain.cancelScheduledValues(u.ctx.currentTime),
                    clearInterval(l._interval),
                    l._interval = null,
                    this.volume(l._fadeTo, n),
                    l._fadeTo = null,
                    this._emit("fade", n)),
                    this
                },
                loop: function() {
                    var n, l, e, t = this, u = arguments;
                    if (0 === u.length)
                        return t._loop;
                    if (1 === u.length) {
                        if ("boolean" != typeof u[0])
                            return !!(e = t._soundById(parseInt(u[0], 10))) && e._loop;
                        t._loop = n = u[0]
                    } else
                        2 === u.length && (n = u[0],
                        l = parseInt(u[1], 10));
                    for (var r = t._getSoundIds(l), i = 0; i < r.length; i++)
                        (e = t._soundById(r[i])) && (e._loop = n,
                        t._webAudio && e._node && e._node.bufferSource && (e._node.bufferSource.loop = n,
                        n && (e._node.bufferSource.loopStart = e._start || 0,
                        e._node.bufferSource.loopEnd = e._stop)));
                    return t
                },
                rate: function() {
                    var n, l, e, t = this, r = arguments;
                    if (0 === r.length)
                        l = t._sounds[0]._id;
                    else if (1 === r.length) {
                        var i = t._getSoundIds()
                          , s = i.indexOf(r[0]);
                        s >= 0 ? l = parseInt(r[0], 10) : n = parseFloat(r[0])
                    } else
                        2 === r.length && (n = parseFloat(r[0]),
                        l = parseInt(r[1], 10));
                    if ("number" != typeof n)
                        return (e = t._soundById(l)) ? e._rate : t._rate;
                    if ("loaded" !== t._state || t._playLock)
                        return t._queue.push({
                            event: "rate",
                            action: function() {
                                t.rate.apply(t, r)
                            }
                        }),
                        t;
                    void 0 === l && (t._rate = n),
                    l = t._getSoundIds(l);
                    for (var o = 0; o < l.length; o++)
                        if (e = t._soundById(l[o])) {
                            t.playing(l[o]) && (e._rateSeek = t.seek(l[o]),
                            e._playStart = t._webAudio ? u.ctx.currentTime : e._playStart),
                            e._rate = n,
                            t._webAudio && e._node && e._node.bufferSource ? e._node.bufferSource.playbackRate.setValueAtTime(n, u.ctx.currentTime) : e._node && (e._node.playbackRate = n);
                            var a = t.seek(l[o])
                              , c = (t._sprite[e._sprite][0] + t._sprite[e._sprite][1]) / 1e3 - a
                              , d = 1e3 * c / Math.abs(e._rate);
                            !t._endTimers[l[o]] && e._paused || (t._clearTimer(l[o]),
                            t._endTimers[l[o]] = setTimeout(t._ended.bind(t, e), d)),
                            t._emit("rate", e._id)
                        }
                    return t
                },
                seek: function() {
                    var n, l, e = this, t = arguments;
                    if (0 === t.length)
                        l = e._sounds[0]._id;
                    else if (1 === t.length) {
                        var r = e._getSoundIds()
                          , i = r.indexOf(t[0]);
                        i >= 0 ? l = parseInt(t[0], 10) : e._sounds.length && (l = e._sounds[0]._id,
                        n = parseFloat(t[0]))
                    } else
                        2 === t.length && (n = parseFloat(t[0]),
                        l = parseInt(t[1], 10));
                    if (void 0 === l)
                        return e;
                    if ("loaded" !== e._state || e._playLock)
                        return e._queue.push({
                            event: "seek",
                            action: function() {
                                e.seek.apply(e, t)
                            }
                        }),
                        e;
                    var s = e._soundById(l);
                    if (s) {
                        if (!("number" == typeof n && n >= 0)) {
                            if (e._webAudio) {
                                var o = e.playing(l) ? u.ctx.currentTime - s._playStart : 0
                                  , a = s._rateSeek ? s._rateSeek - s._seek : 0;
                                return s._seek + (a + o * Math.abs(s._rate))
                            }
                            return s._node.currentTime
                        }
                        var c = e.playing(l);
                        c && e.pause(l, !0),
                        s._seek = n,
                        s._ended = !1,
                        e._clearTimer(l),
                        e._webAudio || !s._node || isNaN(s._node.duration) || (s._node.currentTime = n);
                        var d = function() {
                            e._emit("seek", l),
                            c && e.play(l, !0)
                        };
                        if (c && !e._webAudio) {
                            var h = function() {
                                e._playLock ? setTimeout(h, 0) : d()
                            };
                            setTimeout(h, 0)
                        } else
                            d()
                    }
                    return e
                },
                playing: function(n) {
                    if ("number" == typeof n) {
                        var l = this._soundById(n);
                        return !!l && !l._paused
                    }
                    for (var e = 0; e < this._sounds.length; e++)
                        if (!this._sounds[e]._paused)
                            return !0;
                    return !1
                },
                duration: function(n) {
                    var l = this._duration
                      , e = this._soundById(n);
                    return e && (l = this._sprite[e._sprite][1] / 1e3),
                    l
                },
                state: function() {
                    return this._state
                },
                unload: function() {
                    for (var n = this, l = n._sounds, e = 0; e < l.length; e++)
                        l[e]._paused || n.stop(l[e]._id),
                        n._webAudio || (n._clearSound(l[e]._node),
                        l[e]._node.removeEventListener("error", l[e]._errorFn, !1),
                        l[e]._node.removeEventListener(u._canPlayEvent, l[e]._loadFn, !1),
                        u._releaseHtml5Audio(l[e]._node)),
                        delete l[e]._node,
                        n._clearTimer(l[e]._id);
                    var t = u._howls.indexOf(n);
                    t >= 0 && u._howls.splice(t, 1);
                    var r = !0;
                    for (e = 0; e < u._howls.length; e++)
                        if (u._howls[e]._src === n._src || n._src.indexOf(u._howls[e]._src) >= 0) {
                            r = !1;
                            break
                        }
                    return s && r && delete s[n._src],
                    u.noAudio = !1,
                    n._state = "unloaded",
                    n._sounds = [],
                    n = null,
                    null
                },
                on: function(n, l, e, t) {
                    return "function" == typeof l && this["_on" + n].push(t ? {
                        id: e,
                        fn: l,
                        once: t
                    } : {
                        id: e,
                        fn: l
                    }),
                    this
                },
                off: function(n, l, e) {
                    var t = this["_on" + n]
                      , u = 0;
                    if ("number" == typeof l && (e = l,
                    l = null),
                    l || e)
                        for (u = 0; u < t.length; u++) {
                            var r = e === t[u].id;
                            if (l === t[u].fn && r || !l && r) {
                                t.splice(u, 1);
                                break
                            }
                        }
                    else if (n)
                        this["_on" + n] = [];
                    else {
                        var i = Object.keys(this);
                        for (u = 0; u < i.length; u++)
                            0 === i[u].indexOf("_on") && Array.isArray(this[i[u]]) && (this[i[u]] = [])
                    }
                    return this
                },
                once: function(n, l, e) {
                    return this.on(n, l, e, 1),
                    this
                },
                _emit: function(n, l, e) {
                    for (var t = this["_on" + n], u = t.length - 1; u >= 0; u--)
                        t[u].id && t[u].id !== l && "load" !== n || (setTimeout((function(n) {
                            n.call(this, l, e)
                        }
                        ).bind(this, t[u].fn), 0),
                        t[u].once && this.off(n, t[u].fn, t[u].id));
                    return this._loadQueue(n),
                    this
                },
                _loadQueue: function(n) {
                    if (this._queue.length > 0) {
                        var l = this._queue[0];
                        l.event === n && (this._queue.shift(),
                        this._loadQueue()),
                        n || l.action()
                    }
                    return this
                },
                _ended: function(n) {
                    var l = n._sprite;
                    if (!this._webAudio && n._node && !n._node.paused && !n._node.ended && n._node.currentTime < n._stop)
                        return setTimeout(this._ended.bind(this, n), 100),
                        this;
                    var e = !(!n._loop && !this._sprite[l][2]);
                    if (this._emit("end", n._id),
                    !this._webAudio && e && this.stop(n._id, !0).play(n._id),
                    this._webAudio && e) {
                        this._emit("play", n._id),
                        n._seek = n._start || 0,
                        n._rateSeek = 0,
                        n._playStart = u.ctx.currentTime;
                        var t = 1e3 * (n._stop - n._start) / Math.abs(n._rate);
                        this._endTimers[n._id] = setTimeout(this._ended.bind(this, n), t)
                    }
                    return this._webAudio && !e && (n._paused = !0,
                    n._ended = !0,
                    n._seek = n._start || 0,
                    n._rateSeek = 0,
                    this._clearTimer(n._id),
                    this._cleanBuffer(n._node),
                    u._autoSuspend()),
                    this._webAudio || e || this.stop(n._id, !0),
                    this
                },
                _clearTimer: function(n) {
                    if (this._endTimers[n]) {
                        if ("function" != typeof this._endTimers[n])
                            clearTimeout(this._endTimers[n]);
                        else {
                            var l = this._soundById(n);
                            l && l._node && l._node.removeEventListener("ended", this._endTimers[n], !1)
                        }
                        delete this._endTimers[n]
                    }
                    return this
                },
                _soundById: function(n) {
                    for (var l = 0; l < this._sounds.length; l++)
                        if (n === this._sounds[l]._id)
                            return this._sounds[l];
                    return null
                },
                _inactiveSound: function() {
                    this._drain();
                    for (var n = 0; n < this._sounds.length; n++)
                        if (this._sounds[n]._ended)
                            return this._sounds[n].reset();
                    return new i(this)
                },
                _drain: function() {
                    var n = this._pool
                      , l = 0
                      , e = 0;
                    if (!(this._sounds.length < n)) {
                        for (e = 0; e < this._sounds.length; e++)
                            this._sounds[e]._ended && l++;
                        for (e = this._sounds.length - 1; e >= 0; e--) {
                            if (l <= n)
                                return;
                            this._sounds[e]._ended && (this._webAudio && this._sounds[e]._node && this._sounds[e]._node.disconnect(0),
                            this._sounds.splice(e, 1),
                            l--)
                        }
                    }
                },
                _getSoundIds: function(n) {
                    if (void 0 === n) {
                        for (var l = [], e = 0; e < this._sounds.length; e++)
                            l.push(this._sounds[e]._id);
                        return l
                    }
                    return [n]
                },
                _refreshBuffer: function(n) {
                    return n._node.bufferSource = u.ctx.createBufferSource(),
                    n._node.bufferSource.buffer = s[this._src],
                    n._node.bufferSource.connect(n._panner ? n._panner : n._node),
                    n._node.bufferSource.loop = n._loop,
                    n._loop && (n._node.bufferSource.loopStart = n._start || 0,
                    n._node.bufferSource.loopEnd = n._stop || 0),
                    n._node.bufferSource.playbackRate.setValueAtTime(n._rate, u.ctx.currentTime),
                    this
                },
                _cleanBuffer: function(n) {
                    var l = u._navigator && u._navigator.vendor.indexOf("Apple") >= 0;
                    if (u._scratchBuffer && n.bufferSource && (n.bufferSource.onended = null,
                    n.bufferSource.disconnect(0),
                    l))
                        try {
                            n.bufferSource.buffer = u._scratchBuffer
                        } catch (e) {}
                    return n.bufferSource = null,
                    this
                },
                _clearSound: function(n) {
                    /MSIE |Trident\//.test(u._navigator && u._navigator.userAgent) || (n.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA")
                }
            };
            var i = function(n) {
                this._parent = n,
                this.init()
            };
            i.prototype = {
                init: function() {
                    var n = this._parent;
                    return this._muted = n._muted,
                    this._loop = n._loop,
                    this._volume = n._volume,
                    this._rate = n._rate,
                    this._seek = 0,
                    this._paused = !0,
                    this._ended = !0,
                    this._sprite = "__default",
                    this._id = ++u._counter,
                    n._sounds.push(this),
                    this.create(),
                    this
                },
                create: function() {
                    var n = this._parent
                      , l = u._muted || this._muted || this._parent._muted ? 0 : this._volume;
                    return n._webAudio ? (this._node = void 0 === u.ctx.createGain ? u.ctx.createGainNode() : u.ctx.createGain(),
                    this._node.gain.setValueAtTime(l, u.ctx.currentTime),
                    this._node.paused = !0,
                    this._node.connect(u.masterGain)) : u.noAudio || (this._node = u._obtainHtml5Audio(),
                    this._errorFn = this._errorListener.bind(this),
                    this._node.addEventListener("error", this._errorFn, !1),
                    this._loadFn = this._loadListener.bind(this),
                    this._node.addEventListener(u._canPlayEvent, this._loadFn, !1),
                    this._node.src = n._src,
                    this._node.preload = "auto",
                    this._node.volume = l * u.volume(),
                    this._node.load()),
                    this
                },
                reset: function() {
                    var n = this._parent;
                    return this._muted = n._muted,
                    this._loop = n._loop,
                    this._volume = n._volume,
                    this._rate = n._rate,
                    this._seek = 0,
                    this._rateSeek = 0,
                    this._paused = !0,
                    this._ended = !0,
                    this._sprite = "__default",
                    this._id = ++u._counter,
                    this
                },
                _errorListener: function() {
                    this._parent._emit("loaderror", this._id, this._node.error ? this._node.error.code : 0),
                    this._node.removeEventListener("error", this._errorFn, !1)
                },
                _loadListener: function() {
                    var n = this._parent;
                    n._duration = Math.ceil(10 * this._node.duration) / 10,
                    0 === Object.keys(n._sprite).length && (n._sprite = {
                        __default: [0, 1e3 * n._duration]
                    }),
                    "loaded" !== n._state && (n._state = "loaded",
                    n._emit("load"),
                    n._loadQueue()),
                    this._node.removeEventListener(u._canPlayEvent, this._loadFn, !1)
                }
            };
            var s = {}
              , o = function(n) {
                var l = n._src;
                if (s[l])
                    return n._duration = s[l].duration,
                    void d(n);
                if (/^data:[^;]+;base64,/.test(l)) {
                    for (var e = atob(l.split(",")[1]), t = new Uint8Array(e.length), u = 0; u < e.length; ++u)
                        t[u] = e.charCodeAt(u);
                    c(t.buffer, n)
                } else {
                    var r = new XMLHttpRequest;
                    r.open("GET", l, !0),
                    r.withCredentials = n._xhrWithCredentials,
                    r.responseType = "arraybuffer",
                    r.onload = function() {
                        var l = (r.status + "")[0];
                        "0" === l || "2" === l || "3" === l ? c(r.response, n) : n._emit("loaderror", null, "Failed loading audio file with status: " + r.status + ".")
                    }
                    ,
                    r.onerror = function() {
                        n._webAudio && (n._html5 = !0,
                        n._webAudio = !1,
                        n._sounds = [],
                        delete s[l],
                        n.load())
                    }
                    ,
                    a(r)
                }
            }
              , a = function(n) {
                try {
                    n.send()
                } catch (l) {
                    n.onerror()
                }
            }
              , c = function(n, l) {
                var e = function() {
                    l._emit("loaderror", null, "Decoding audio data failed.")
                }
                  , t = function(n) {
                    n && l._sounds.length > 0 ? (s[l._src] = n,
                    d(l, n)) : e()
                };
                "undefined" != typeof Promise && 1 === u.ctx.decodeAudioData.length ? u.ctx.decodeAudioData(n).then(t).catch(e) : u.ctx.decodeAudioData(n, t, e)
            }
              , d = function(n, l) {
                l && !n._duration && (n._duration = l.duration),
                0 === Object.keys(n._sprite).length && (n._sprite = {
                    __default: [0, 1e3 * n._duration]
                }),
                "loaded" !== n._state && (n._state = "loaded",
                n._emit("load"),
                n._loadQueue())
            }
              , h = function() {
                if (u.usingWebAudio) {
                    try {
                        "undefined" != typeof AudioContext ? u.ctx = new AudioContext : "undefined" != typeof webkitAudioContext ? u.ctx = new webkitAudioContext : u.usingWebAudio = !1
                    } catch (r) {
                        u.usingWebAudio = !1
                    }
                    u.ctx || (u.usingWebAudio = !1);
                    var n = /iP(hone|od|ad)/.test(u._navigator && u._navigator.platform)
                      , l = u._navigator && u._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)
                      , e = l ? parseInt(l[1], 10) : null;
                    if (n && e && e < 9) {
                        var t = /safari/.test(u._navigator && u._navigator.userAgent.toLowerCase());
                        (u._navigator && u._navigator.standalone && !t || u._navigator && !u._navigator.standalone && !t) && (u.usingWebAudio = !1)
                    }
                    u.usingWebAudio && (u.masterGain = void 0 === u.ctx.createGain ? u.ctx.createGainNode() : u.ctx.createGain(),
                    u.masterGain.gain.setValueAtTime(u._muted ? 0 : u._volume, u.ctx.currentTime),
                    u.masterGain.connect(u.ctx.destination)),
                    u._setup()
                }
            };
            void 0 === (t = (function() {
                return {
                    Howler: u,
                    Howl: r
                }
            }
            ).apply(l, [])) || (n.exports = t),
            l.Howler = u,
            l.Howl = r,
            "undefined" != typeof window ? (window.HowlerGlobal = e,
            window.Howler = u,
            window.Howl = r,
            window.Sound = i) : "undefined" != typeof global && (global.HowlerGlobal = e,
            global.Howler = u,
            global.Howl = r,
            global.Sound = i)
        }(),
        function() {
            "use strict";
            var n;
            HowlerGlobal.prototype._pos = [0, 0, 0],
            HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0],
            HowlerGlobal.prototype.stereo = function(n) {
                if (!this.ctx || !this.ctx.listener)
                    return this;
                for (var l = this._howls.length - 1; l >= 0; l--)
                    this._howls[l].stereo(n);
                return this
            }
            ,
            HowlerGlobal.prototype.pos = function(n, l, e) {
                return this.ctx && this.ctx.listener ? "number" != typeof n ? this._pos : (this._pos = [n, l = "number" != typeof l ? this._pos[1] : l, e = "number" != typeof e ? this._pos[2] : e],
                void 0 !== this.ctx.listener.positionX ? (this.ctx.listener.positionX.setTargetAtTime(this._pos[0], Howler.ctx.currentTime, .1),
                this.ctx.listener.positionY.setTargetAtTime(this._pos[1], Howler.ctx.currentTime, .1),
                this.ctx.listener.positionZ.setTargetAtTime(this._pos[2], Howler.ctx.currentTime, .1)) : this.ctx.listener.setPosition(this._pos[0], this._pos[1], this._pos[2]),
                this) : this
            }
            ,
            HowlerGlobal.prototype.orientation = function(n, l, e, t, u, r) {
                if (!this.ctx || !this.ctx.listener)
                    return this;
                var i = this._orientation;
                return "number" != typeof n ? i : (this._orientation = [n, l = "number" != typeof l ? i[1] : l, e = "number" != typeof e ? i[2] : e, t = "number" != typeof t ? i[3] : t, u = "number" != typeof u ? i[4] : u, r = "number" != typeof r ? i[5] : r],
                void 0 !== this.ctx.listener.forwardX ? (this.ctx.listener.forwardX.setTargetAtTime(n, Howler.ctx.currentTime, .1),
                this.ctx.listener.forwardY.setTargetAtTime(l, Howler.ctx.currentTime, .1),
                this.ctx.listener.forwardZ.setTargetAtTime(e, Howler.ctx.currentTime, .1),
                this.ctx.listener.upX.setTargetAtTime(t, Howler.ctx.currentTime, .1),
                this.ctx.listener.upY.setTargetAtTime(u, Howler.ctx.currentTime, .1),
                this.ctx.listener.upZ.setTargetAtTime(r, Howler.ctx.currentTime, .1)) : this.ctx.listener.setOrientation(n, l, e, t, u, r),
                this)
            }
            ,
            Howl.prototype.init = (n = Howl.prototype.init,
            function(l) {
                return this._orientation = l.orientation || [1, 0, 0],
                this._stereo = l.stereo || null,
                this._pos = l.pos || null,
                this._pannerAttr = {
                    coneInnerAngle: void 0 !== l.coneInnerAngle ? l.coneInnerAngle : 360,
                    coneOuterAngle: void 0 !== l.coneOuterAngle ? l.coneOuterAngle : 360,
                    coneOuterGain: void 0 !== l.coneOuterGain ? l.coneOuterGain : 0,
                    distanceModel: void 0 !== l.distanceModel ? l.distanceModel : "inverse",
                    maxDistance: void 0 !== l.maxDistance ? l.maxDistance : 1e4,
                    panningModel: void 0 !== l.panningModel ? l.panningModel : "HRTF",
                    refDistance: void 0 !== l.refDistance ? l.refDistance : 1,
                    rolloffFactor: void 0 !== l.rolloffFactor ? l.rolloffFactor : 1
                },
                this._onstereo = l.onstereo ? [{
                    fn: l.onstereo
                }] : [],
                this._onpos = l.onpos ? [{
                    fn: l.onpos
                }] : [],
                this._onorientation = l.onorientation ? [{
                    fn: l.onorientation
                }] : [],
                n.call(this, l)
            }
            ),
            Howl.prototype.stereo = function(n, e) {
                var t = this;
                if (!t._webAudio)
                    return t;
                if ("loaded" !== t._state)
                    return t._queue.push({
                        event: "stereo",
                        action: function() {
                            t.stereo(n, e)
                        }
                    }),
                    t;
                var u = void 0 === Howler.ctx.createStereoPanner ? "spatial" : "stereo";
                if (void 0 === e) {
                    if ("number" != typeof n)
                        return t._stereo;
                    t._stereo = n,
                    t._pos = [n, 0, 0]
                }
                for (var r = t._getSoundIds(e), i = 0; i < r.length; i++) {
                    var s = t._soundById(r[i]);
                    if (s) {
                        if ("number" != typeof n)
                            return s._stereo;
                        s._stereo = n,
                        s._pos = [n, 0, 0],
                        s._node && (s._pannerAttr.panningModel = "equalpower",
                        s._panner && s._panner.pan || l(s, u),
                        "spatial" === u ? void 0 !== s._panner.positionX ? (s._panner.positionX.setValueAtTime(n, Howler.ctx.currentTime),
                        s._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime),
                        s._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime)) : s._panner.setPosition(n, 0, 0) : s._panner.pan.setValueAtTime(n, Howler.ctx.currentTime)),
                        t._emit("stereo", s._id)
                    }
                }
                return t
            }
            ,
            Howl.prototype.pos = function(n, e, t, u) {
                var r = this;
                if (!r._webAudio)
                    return r;
                if ("loaded" !== r._state)
                    return r._queue.push({
                        event: "pos",
                        action: function() {
                            r.pos(n, e, t, u)
                        }
                    }),
                    r;
                if (e = "number" != typeof e ? 0 : e,
                t = "number" != typeof t ? -.5 : t,
                void 0 === u) {
                    if ("number" != typeof n)
                        return r._pos;
                    r._pos = [n, e, t]
                }
                for (var i = r._getSoundIds(u), s = 0; s < i.length; s++) {
                    var o = r._soundById(i[s]);
                    if (o) {
                        if ("number" != typeof n)
                            return o._pos;
                        o._pos = [n, e, t],
                        o._node && (o._panner && !o._panner.pan || l(o, "spatial"),
                        void 0 !== o._panner.positionX ? (o._panner.positionX.setValueAtTime(n, Howler.ctx.currentTime),
                        o._panner.positionY.setValueAtTime(e, Howler.ctx.currentTime),
                        o._panner.positionZ.setValueAtTime(t, Howler.ctx.currentTime)) : o._panner.setPosition(n, e, t)),
                        r._emit("pos", o._id)
                    }
                }
                return r
            }
            ,
            Howl.prototype.orientation = function(n, e, t, u) {
                var r = this;
                if (!r._webAudio)
                    return r;
                if ("loaded" !== r._state)
                    return r._queue.push({
                        event: "orientation",
                        action: function() {
                            r.orientation(n, e, t, u)
                        }
                    }),
                    r;
                if (e = "number" != typeof e ? r._orientation[1] : e,
                t = "number" != typeof t ? r._orientation[2] : t,
                void 0 === u) {
                    if ("number" != typeof n)
                        return r._orientation;
                    r._orientation = [n, e, t]
                }
                for (var i = r._getSoundIds(u), s = 0; s < i.length; s++) {
                    var o = r._soundById(i[s]);
                    if (o) {
                        if ("number" != typeof n)
                            return o._orientation;
                        o._orientation = [n, e, t],
                        o._node && (o._panner || (o._pos || (o._pos = r._pos || [0, 0, -.5]),
                        l(o, "spatial")),
                        void 0 !== o._panner.orientationX ? (o._panner.orientationX.setValueAtTime(n, Howler.ctx.currentTime),
                        o._panner.orientationY.setValueAtTime(e, Howler.ctx.currentTime),
                        o._panner.orientationZ.setValueAtTime(t, Howler.ctx.currentTime)) : o._panner.setOrientation(n, e, t)),
                        r._emit("orientation", o._id)
                    }
                }
                return r
            }
            ,
            Howl.prototype.pannerAttr = function() {
                var n, e, t, u = this, r = arguments;
                if (!u._webAudio)
                    return u;
                if (0 === r.length)
                    return u._pannerAttr;
                if (1 === r.length) {
                    if ("object" != typeof r[0])
                        return (t = u._soundById(parseInt(r[0], 10))) ? t._pannerAttr : u._pannerAttr;
                    n = r[0],
                    void 0 === e && (n.pannerAttr || (n.pannerAttr = {
                        coneInnerAngle: n.coneInnerAngle,
                        coneOuterAngle: n.coneOuterAngle,
                        coneOuterGain: n.coneOuterGain,
                        distanceModel: n.distanceModel,
                        maxDistance: n.maxDistance,
                        refDistance: n.refDistance,
                        rolloffFactor: n.rolloffFactor,
                        panningModel: n.panningModel
                    }),
                    u._pannerAttr = {
                        coneInnerAngle: void 0 !== n.pannerAttr.coneInnerAngle ? n.pannerAttr.coneInnerAngle : u._coneInnerAngle,
                        coneOuterAngle: void 0 !== n.pannerAttr.coneOuterAngle ? n.pannerAttr.coneOuterAngle : u._coneOuterAngle,
                        coneOuterGain: void 0 !== n.pannerAttr.coneOuterGain ? n.pannerAttr.coneOuterGain : u._coneOuterGain,
                        distanceModel: void 0 !== n.pannerAttr.distanceModel ? n.pannerAttr.distanceModel : u._distanceModel,
                        maxDistance: void 0 !== n.pannerAttr.maxDistance ? n.pannerAttr.maxDistance : u._maxDistance,
                        refDistance: void 0 !== n.pannerAttr.refDistance ? n.pannerAttr.refDistance : u._refDistance,
                        rolloffFactor: void 0 !== n.pannerAttr.rolloffFactor ? n.pannerAttr.rolloffFactor : u._rolloffFactor,
                        panningModel: void 0 !== n.pannerAttr.panningModel ? n.pannerAttr.panningModel : u._panningModel
                    })
                } else
                    2 === r.length && (n = r[0],
                    e = parseInt(r[1], 10));
                for (var i = u._getSoundIds(e), s = 0; s < i.length; s++)
                    if (t = u._soundById(i[s])) {
                        var o = t._pannerAttr;
                        o = {
                            coneInnerAngle: void 0 !== n.coneInnerAngle ? n.coneInnerAngle : o.coneInnerAngle,
                            coneOuterAngle: void 0 !== n.coneOuterAngle ? n.coneOuterAngle : o.coneOuterAngle,
                            coneOuterGain: void 0 !== n.coneOuterGain ? n.coneOuterGain : o.coneOuterGain,
                            distanceModel: void 0 !== n.distanceModel ? n.distanceModel : o.distanceModel,
                            maxDistance: void 0 !== n.maxDistance ? n.maxDistance : o.maxDistance,
                            refDistance: void 0 !== n.refDistance ? n.refDistance : o.refDistance,
                            rolloffFactor: void 0 !== n.rolloffFactor ? n.rolloffFactor : o.rolloffFactor,
                            panningModel: void 0 !== n.panningModel ? n.panningModel : o.panningModel
                        };
                        var a = t._panner;
                        a ? (a.coneInnerAngle = o.coneInnerAngle,
                        a.coneOuterAngle = o.coneOuterAngle,
                        a.coneOuterGain = o.coneOuterGain,
                        a.distanceModel = o.distanceModel,
                        a.maxDistance = o.maxDistance,
                        a.refDistance = o.refDistance,
                        a.rolloffFactor = o.rolloffFactor,
                        a.panningModel = o.panningModel) : (t._pos || (t._pos = u._pos || [0, 0, -.5]),
                        l(t, "spatial"))
                    }
                return u
            }
            ,
            Sound.prototype.init = function(n) {
                return function() {
                    var l = this._parent;
                    this._orientation = l._orientation,
                    this._stereo = l._stereo,
                    this._pos = l._pos,
                    this._pannerAttr = l._pannerAttr,
                    n.call(this),
                    this._stereo ? l.stereo(this._stereo) : this._pos && l.pos(this._pos[0], this._pos[1], this._pos[2], this._id)
                }
            }(Sound.prototype.init),
            Sound.prototype.reset = function(n) {
                return function() {
                    var l = this._parent;
                    return this._orientation = l._orientation,
                    this._stereo = l._stereo,
                    this._pos = l._pos,
                    this._pannerAttr = l._pannerAttr,
                    this._stereo ? l.stereo(this._stereo) : this._pos ? l.pos(this._pos[0], this._pos[1], this._pos[2], this._id) : this._panner && (this._panner.disconnect(0),
                    this._panner = void 0,
                    l._refreshBuffer(this)),
                    n.call(this)
                }
            }(Sound.prototype.reset);
            var l = function(n, l) {
                "spatial" === (l = l || "spatial") ? (n._panner = Howler.ctx.createPanner(),
                n._panner.coneInnerAngle = n._pannerAttr.coneInnerAngle,
                n._panner.coneOuterAngle = n._pannerAttr.coneOuterAngle,
                n._panner.coneOuterGain = n._pannerAttr.coneOuterGain,
                n._panner.distanceModel = n._pannerAttr.distanceModel,
                n._panner.maxDistance = n._pannerAttr.maxDistance,
                n._panner.refDistance = n._pannerAttr.refDistance,
                n._panner.rolloffFactor = n._pannerAttr.rolloffFactor,
                n._panner.panningModel = n._pannerAttr.panningModel,
                void 0 !== n._panner.positionX ? (n._panner.positionX.setValueAtTime(n._pos[0], Howler.ctx.currentTime),
                n._panner.positionY.setValueAtTime(n._pos[1], Howler.ctx.currentTime),
                n._panner.positionZ.setValueAtTime(n._pos[2], Howler.ctx.currentTime)) : n._panner.setPosition(n._pos[0], n._pos[1], n._pos[2]),
                void 0 !== n._panner.orientationX ? (n._panner.orientationX.setValueAtTime(n._orientation[0], Howler.ctx.currentTime),
                n._panner.orientationY.setValueAtTime(n._orientation[1], Howler.ctx.currentTime),
                n._panner.orientationZ.setValueAtTime(n._orientation[2], Howler.ctx.currentTime)) : n._panner.setOrientation(n._orientation[0], n._orientation[1], n._orientation[2])) : (n._panner = Howler.ctx.createStereoPanner(),
                n._panner.pan.setValueAtTime(n._stereo, Howler.ctx.currentTime)),
                n._panner.connect(n._node),
                n._paused || n._parent.pause(n._id, !0).play(n._id, !0)
            }
        }()
    },
    zUnb: function(n, l, e) {
        "use strict";
        function t(n) {
            return "function" == typeof n
        }
        e.r(l);
        let u = !1;
        const r = {
            Promise: void 0,
            set useDeprecatedSynchronousErrorHandling(n) {
                if (n) {
                    const n = new Error;
                    console.warn("DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n" + n.stack)
                } else
                    u && console.log("RxJS: Back to a better error behavior. Thank you. <3");
                u = n
            },
            get useDeprecatedSynchronousErrorHandling() {
                return u
            }
        };
        function i(n) {
            setTimeout(()=>{
                throw n
            }
            )
        }
        const s = {
            closed: !0,
            next(n) {},
            error(n) {
                if (r.useDeprecatedSynchronousErrorHandling)
                    throw n;
                i(n)
            },
            complete() {}
        }
          , o = Array.isArray || (n=>n && "number" == typeof n.length);
        function a(n) {
            return null !== n && "object" == typeof n
        }
        function c(n) {
            return Error.call(this),
            this.message = n ? `${n.length} errors occurred during unsubscription:\n${n.map((n,l)=>`${l + 1}) ${n.toString()}`).join("\n  ")}` : "",
            this.name = "UnsubscriptionError",
            this.errors = n,
            this
        }
        c.prototype = Object.create(Error.prototype);
        const d = c;
        let h = (()=>{
            class n {
                constructor(n) {
                    this.closed = !1,
                    this._parent = null,
                    this._parents = null,
                    this._subscriptions = null,
                    n && (this._unsubscribe = n)
                }
                unsubscribe() {
                    let n, l = !1;
                    if (this.closed)
                        return;
                    let {_parent: e, _parents: u, _unsubscribe: r, _subscriptions: i} = this;
                    this.closed = !0,
                    this._parent = null,
                    this._parents = null,
                    this._subscriptions = null;
                    let s = -1
                      , c = u ? u.length : 0;
                    for (; e; )
                        e.remove(this),
                        e = ++s < c && u[s] || null;
                    if (t(r))
                        try {
                            r.call(this)
                        } catch (h) {
                            l = !0,
                            n = h instanceof d ? p(h.errors) : [h]
                        }
                    if (o(i))
                        for (s = -1,
                        c = i.length; ++s < c; ) {
                            const e = i[s];
                            if (a(e))
                                try {
                                    e.unsubscribe()
                                } catch (h) {
                                    l = !0,
                                    n = n || [],
                                    h instanceof d ? n = n.concat(p(h.errors)) : n.push(h)
                                }
                        }
                    if (l)
                        throw new d(n)
                }
                add(l) {
                    let e = l;
                    switch (typeof l) {
                    case "function":
                        e = new n(l);
                    case "object":
                        if (e === this || e.closed || "function" != typeof e.unsubscribe)
                            return e;
                        if (this.closed)
                            return e.unsubscribe(),
                            e;
                        if (!(e instanceof n)) {
                            const l = e;
                            e = new n,
                            e._subscriptions = [l]
                        }
                        break;
                    default:
                        if (!l)
                            return n.EMPTY;
                        throw new Error("unrecognized teardown " + l + " added to Subscription.")
                    }
                    if (e._addParent(this)) {
                        const n = this._subscriptions;
                        n ? n.push(e) : this._subscriptions = [e]
                    }
                    return e
                }
                remove(n) {
                    const l = this._subscriptions;
                    if (l) {
                        const e = l.indexOf(n);
                        -1 !== e && l.splice(e, 1)
                    }
                }
                _addParent(n) {
                    let {_parent: l, _parents: e} = this;
                    return l !== n && (l ? e ? -1 === e.indexOf(n) && (e.push(n),
                    !0) : (this._parents = [n],
                    !0) : (this._parent = n,
                    !0))
                }
            }
            return n.EMPTY = function(n) {
                return n.closed = !0,
                n
            }(new n),
            n
        }
        )();
        function p(n) {
            return n.reduce((n,l)=>n.concat(l instanceof d ? l.errors : l), [])
        }
        const f = "function" == typeof Symbol ? Symbol("rxSubscriber") : "@@rxSubscriber_" + Math.random();
        class g extends h {
            constructor(n, l, e) {
                switch (super(),
                this.syncErrorValue = null,
                this.syncErrorThrown = !1,
                this.syncErrorThrowable = !1,
                this.isStopped = !1,
                arguments.length) {
                case 0:
                    this.destination = s;
                    break;
                case 1:
                    if (!n) {
                        this.destination = s;
                        break
                    }
                    if ("object" == typeof n) {
                        n instanceof g ? (this.syncErrorThrowable = n.syncErrorThrowable,
                        this.destination = n,
                        n.add(this)) : (this.syncErrorThrowable = !0,
                        this.destination = new m(this,n));
                        break
                    }
                default:
                    this.syncErrorThrowable = !0,
                    this.destination = new m(this,n,l,e)
                }
            }
            [f]() {
                return this
            }
            static create(n, l, e) {
                const t = new g(n,l,e);
                return t.syncErrorThrowable = !1,
                t
            }
            next(n) {
                this.isStopped || this._next(n)
            }
            error(n) {
                this.isStopped || (this.isStopped = !0,
                this._error(n))
            }
            complete() {
                this.isStopped || (this.isStopped = !0,
                this._complete())
            }
            unsubscribe() {
                this.closed || (this.isStopped = !0,
                super.unsubscribe())
            }
            _next(n) {
                this.destination.next(n)
            }
            _error(n) {
                this.destination.error(n),
                this.unsubscribe()
            }
            _complete() {
                this.destination.complete(),
                this.unsubscribe()
            }
            _unsubscribeAndRecycle() {
                const {_parent: n, _parents: l} = this;
                return this._parent = null,
                this._parents = null,
                this.unsubscribe(),
                this.closed = !1,
                this.isStopped = !1,
                this._parent = n,
                this._parents = l,
                this
            }
        }
        class m extends g {
            constructor(n, l, e, u) {
                let r;
                super(),
                this._parentSubscriber = n;
                let i = this;
                t(l) ? r = l : l && (r = l.next,
                e = l.error,
                u = l.complete,
                l !== s && (i = Object.create(l),
                t(i.unsubscribe) && this.add(i.unsubscribe.bind(i)),
                i.unsubscribe = this.unsubscribe.bind(this))),
                this._context = i,
                this._next = r,
                this._error = e,
                this._complete = u
            }
            next(n) {
                if (!this.isStopped && this._next) {
                    const {_parentSubscriber: l} = this;
                    r.useDeprecatedSynchronousErrorHandling && l.syncErrorThrowable ? this.__tryOrSetError(l, this._next, n) && this.unsubscribe() : this.__tryOrUnsub(this._next, n)
                }
            }
            error(n) {
                if (!this.isStopped) {
                    const {_parentSubscriber: l} = this
                      , {useDeprecatedSynchronousErrorHandling: e} = r;
                    if (this._error)
                        e && l.syncErrorThrowable ? (this.__tryOrSetError(l, this._error, n),
                        this.unsubscribe()) : (this.__tryOrUnsub(this._error, n),
                        this.unsubscribe());
                    else if (l.syncErrorThrowable)
                        e ? (l.syncErrorValue = n,
                        l.syncErrorThrown = !0) : i(n),
                        this.unsubscribe();
                    else {
                        if (this.unsubscribe(),
                        e)
                            throw n;
                        i(n)
                    }
                }
            }
            complete() {
                if (!this.isStopped) {
                    const {_parentSubscriber: n} = this;
                    if (this._complete) {
                        const l = ()=>this._complete.call(this._context);
                        r.useDeprecatedSynchronousErrorHandling && n.syncErrorThrowable ? (this.__tryOrSetError(n, l),
                        this.unsubscribe()) : (this.__tryOrUnsub(l),
                        this.unsubscribe())
                    } else
                        this.unsubscribe()
                }
            }
            __tryOrUnsub(n, l) {
                try {
                    n.call(this._context, l)
                } catch (e) {
                    if (this.unsubscribe(),
                    r.useDeprecatedSynchronousErrorHandling)
                        throw e;
                    i(e)
                }
            }
            __tryOrSetError(n, l, e) {
                if (!r.useDeprecatedSynchronousErrorHandling)
                    throw new Error("bad call");
                try {
                    l.call(this._context, e)
                } catch (t) {
                    return r.useDeprecatedSynchronousErrorHandling ? (n.syncErrorValue = t,
                    n.syncErrorThrown = !0,
                    !0) : (i(t),
                    !0)
                }
                return !1
            }
            _unsubscribe() {
                const {_parentSubscriber: n} = this;
                this._context = null,
                this._parentSubscriber = null,
                n.unsubscribe()
            }
        }
        const v = "function" == typeof Symbol && Symbol.observable || "@@observable";
        function _() {}
        function b(...n) {
            return y(n)
        }
        function y(n) {
            return n ? 1 === n.length ? n[0] : function(l) {
                return n.reduce((n,l)=>l(n), l)
            }
            : _
        }
        let w = (()=>{
            class n {
                constructor(n) {
                    this._isScalar = !1,
                    n && (this._subscribe = n)
                }
                lift(l) {
                    const e = new n;
                    return e.source = this,
                    e.operator = l,
                    e
                }
                subscribe(n, l, e) {
                    const {operator: t} = this
                      , u = function(n, l, e) {
                        if (n) {
                            if (n instanceof g)
                                return n;
                            if (n[f])
                                return n[f]()
                        }
                        return n || l || e ? new g(n,l,e) : new g(s)
                    }(n, l, e);
                    if (u.add(t ? t.call(u, this.source) : this.source || r.useDeprecatedSynchronousErrorHandling && !u.syncErrorThrowable ? this._subscribe(u) : this._trySubscribe(u)),
                    r.useDeprecatedSynchronousErrorHandling && u.syncErrorThrowable && (u.syncErrorThrowable = !1,
                    u.syncErrorThrown))
                        throw u.syncErrorValue;
                    return u
                }
                _trySubscribe(n) {
                    try {
                        return this._subscribe(n)
                    } catch (l) {
                        r.useDeprecatedSynchronousErrorHandling && (n.syncErrorThrown = !0,
                        n.syncErrorValue = l),
                        function(n) {
                            for (; n; ) {
                                const {closed: l, destination: e, isStopped: t} = n;
                                if (l || t)
                                    return !1;
                                n = e && e instanceof g ? e : null
                            }
                            return !0
                        }(n) ? n.error(l) : console.warn(l)
                    }
                }
                forEach(n, l) {
                    return new (l = k(l))((l,e)=>{
                        let t;
                        t = this.subscribe(l=>{
                            try {
                                n(l)
                            } catch (u) {
                                e(u),
                                t && t.unsubscribe()
                            }
                        }
                        , e, l)
                    }
                    )
                }
                _subscribe(n) {
                    const {source: l} = this;
                    return l && l.subscribe(n)
                }
                [v]() {
                    return this
                }
                pipe(...n) {
                    return 0 === n.length ? this : y(n)(this)
                }
                toPromise(n) {
                    return new (n = k(n))((n,l)=>{
                        let e;
                        this.subscribe(n=>e = n, n=>l(n), ()=>n(e))
                    }
                    )
                }
            }
            return n.create = l=>new n(l),
            n
        }
        )();
        function k(n) {
            if (n || (n = r.Promise || Promise),
            !n)
                throw new Error("no Promise impl found");
            return n
        }
        function C() {
            return Error.call(this),
            this.message = "object unsubscribed",
            this.name = "ObjectUnsubscribedError",
            this
        }
        C.prototype = Object.create(Error.prototype);
        const S = C;
        class x extends h {
            constructor(n, l) {
                super(),
                this.subject = n,
                this.subscriber = l,
                this.closed = !1
            }
            unsubscribe() {
                if (this.closed)
                    return;
                this.closed = !0;
                const n = this.subject
                  , l = n.observers;
                if (this.subject = null,
                !l || 0 === l.length || n.isStopped || n.closed)
                    return;
                const e = l.indexOf(this.subscriber);
                -1 !== e && l.splice(e, 1)
            }
        }
        class A extends g {
            constructor(n) {
                super(n),
                this.destination = n
            }
        }
        let E = (()=>{
            class n extends w {
                constructor() {
                    super(),
                    this.observers = [],
                    this.closed = !1,
                    this.isStopped = !1,
                    this.hasError = !1,
                    this.thrownError = null
                }
                [f]() {
                    return new A(this)
                }
                lift(n) {
                    const l = new T(this,this);
                    return l.operator = n,
                    l
                }
                next(n) {
                    if (this.closed)
                        throw new S;
                    if (!this.isStopped) {
                        const {observers: l} = this
                          , e = l.length
                          , t = l.slice();
                        for (let u = 0; u < e; u++)
                            t[u].next(n)
                    }
                }
                error(n) {
                    if (this.closed)
                        throw new S;
                    this.hasError = !0,
                    this.thrownError = n,
                    this.isStopped = !0;
                    const {observers: l} = this
                      , e = l.length
                      , t = l.slice();
                    for (let u = 0; u < e; u++)
                        t[u].error(n);
                    this.observers.length = 0
                }
                complete() {
                    if (this.closed)
                        throw new S;
                    this.isStopped = !0;
                    const {observers: n} = this
                      , l = n.length
                      , e = n.slice();
                    for (let t = 0; t < l; t++)
                        e[t].complete();
                    this.observers.length = 0
                }
                unsubscribe() {
                    this.isStopped = !0,
                    this.closed = !0,
                    this.observers = null
                }
                _trySubscribe(n) {
                    if (this.closed)
                        throw new S;
                    return super._trySubscribe(n)
                }
                _subscribe(n) {
                    if (this.closed)
                        throw new S;
                    return this.hasError ? (n.error(this.thrownError),
                    h.EMPTY) : this.isStopped ? (n.complete(),
                    h.EMPTY) : (this.observers.push(n),
                    new x(this,n))
                }
                asObservable() {
                    const n = new w;
                    return n.source = this,
                    n
                }
            }
            return n.create = (n,l)=>new T(n,l),
            n
        }
        )();
        class T extends E {
            constructor(n, l) {
                super(),
                this.destination = n,
                this.source = l
            }
            next(n) {
                const {destination: l} = this;
                l && l.next && l.next(n)
            }
            error(n) {
                const {destination: l} = this;
                l && l.error && this.destination.error(n)
            }
            complete() {
                const {destination: n} = this;
                n && n.complete && this.destination.complete()
            }
            _subscribe(n) {
                const {source: l} = this;
                return l ? this.source.subscribe(n) : h.EMPTY
            }
        }
        function I(n) {
            return n && "function" == typeof n.schedule
        }
        class R extends g {
            constructor(n, l, e) {
                super(),
                this.parent = n,
                this.outerValue = l,
                this.outerIndex = e,
                this.index = 0
            }
            _next(n) {
                this.parent.notifyNext(this.outerValue, n, this.outerIndex, this.index++, this)
            }
            _error(n) {
                this.parent.notifyError(n, this),
                this.unsubscribe()
            }
            _complete() {
                this.parent.notifyComplete(this),
                this.unsubscribe()
            }
        }
        const P = n=>l=>{
            for (let e = 0, t = n.length; e < t && !l.closed; e++)
                l.next(n[e]);
            l.closed || l.complete()
        }
          , O = n=>l=>(n.then(n=>{
            l.closed || (l.next(n),
            l.complete())
        }
        , n=>l.error(n)).then(null, i),
        l);
        function M() {
            return "function" == typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator"
        }
        const D = M()
          , N = n=>l=>{
            const e = n[D]();
            for (; ; ) {
                const n = e.next();
                if (n.done) {
                    l.complete();
                    break
                }
                if (l.next(n.value),
                l.closed)
                    break
            }
            return "function" == typeof e.return && l.add(()=>{
                e.return && e.return()
            }
            ),
            l
        }
          , L = n=>l=>{
            const e = n[v]();
            if ("function" != typeof e.subscribe)
                throw new TypeError("Provided object does not correctly implement Symbol.observable");
            return e.subscribe(l)
        }
          , j = n=>n && "number" == typeof n.length && "function" != typeof n;
        function U(n) {
            return !!n && "function" != typeof n.subscribe && "function" == typeof n.then
        }
        const H = n=>{
            if (n instanceof w)
                return l=>n._isScalar ? (l.next(n.value),
                void l.complete()) : n.subscribe(l);
            if (n && "function" == typeof n[v])
                return L(n);
            if (j(n))
                return P(n);
            if (U(n))
                return O(n);
            if (n && "function" == typeof n[D])
                return N(n);
            {
                const l = a(n) ? "an invalid object" : `'${n}'`;
                throw new TypeError(`You provided ${l} where a stream was expected.` + " You can provide an Observable, Promise, Array, or Iterable.")
            }
        }
        ;
        function F(n, l, e, t, u=new R(n,e,t)) {
            if (!u.closed)
                return H(l)(u)
        }
        class V extends g {
            notifyNext(n, l, e, t, u) {
                this.destination.next(l)
            }
            notifyError(n, l) {
                this.destination.error(n)
            }
            notifyComplete(n) {
                this.destination.complete()
            }
        }
        function $(n, l) {
            return function(e) {
                if ("function" != typeof n)
                    throw new TypeError("argument is not a function. Are you looking for `mapTo()`?");
                return e.lift(new B(n,l))
            }
        }
        class B {
            constructor(n, l) {
                this.project = n,
                this.thisArg = l
            }
            call(n, l) {
                return l.subscribe(new z(n,this.project,this.thisArg))
            }
        }
        class z extends g {
            constructor(n, l, e) {
                super(n),
                this.project = l,
                this.count = 0,
                this.thisArg = e || this
            }
            _next(n) {
                let l;
                try {
                    l = this.project.call(this.thisArg, n, this.count++)
                } catch (e) {
                    return void this.destination.error(e)
                }
                this.destination.next(l)
            }
        }
        function q(n, l) {
            return new w(l ? e=>{
                const t = new h;
                let u = 0;
                return t.add(l.schedule((function() {
                    u !== n.length ? (e.next(n[u++]),
                    e.closed || t.add(this.schedule())) : e.complete()
                }
                ))),
                t
            }
            : P(n))
        }
        function W(n, l) {
            if (!l)
                return n instanceof w ? n : new w(H(n));
            if (null != n) {
                if (function(n) {
                    return n && "function" == typeof n[v]
                }(n))
                    return function(n, l) {
                        return new w(l ? e=>{
                            const t = new h;
                            return t.add(l.schedule(()=>{
                                const u = n[v]();
                                t.add(u.subscribe({
                                    next(n) {
                                        t.add(l.schedule(()=>e.next(n)))
                                    },
                                    error(n) {
                                        t.add(l.schedule(()=>e.error(n)))
                                    },
                                    complete() {
                                        t.add(l.schedule(()=>e.complete()))
                                    }
                                }))
                            }
                            )),
                            t
                        }
                        : L(n))
                    }(n, l);
                if (U(n))
                    return function(n, l) {
                        return new w(l ? e=>{
                            const t = new h;
                            return t.add(l.schedule(()=>n.then(n=>{
                                t.add(l.schedule(()=>{
                                    e.next(n),
                                    t.add(l.schedule(()=>e.complete()))
                                }
                                ))
                            }
                            , n=>{
                                t.add(l.schedule(()=>e.error(n)))
                            }
                            ))),
                            t
                        }
                        : O(n))
                    }(n, l);
                if (j(n))
                    return q(n, l);
                if (function(n) {
                    return n && "function" == typeof n[D]
                }(n) || "string" == typeof n)
                    return function(n, l) {
                        if (!n)
                            throw new Error("Iterable cannot be null");
                        return new w(l ? e=>{
                            const t = new h;
                            let u;
                            return t.add(()=>{
                                u && "function" == typeof u.return && u.return()
                            }
                            ),
                            t.add(l.schedule(()=>{
                                u = n[D](),
                                t.add(l.schedule((function() {
                                    if (e.closed)
                                        return;
                                    let n, l;
                                    try {
                                        const e = u.next();
                                        n = e.value,
                                        l = e.done
                                    } catch (t) {
                                        return void e.error(t)
                                    }
                                    l ? e.complete() : (e.next(n),
                                    this.schedule())
                                }
                                )))
                            }
                            )),
                            t
                        }
                        : N(n))
                    }(n, l)
            }
            throw new TypeError((null !== n && typeof n || n) + " is not observable")
        }
        function G(n, l, e=Number.POSITIVE_INFINITY) {
            return "function" == typeof l ? t=>t.pipe(G((e,t)=>W(n(e, t)).pipe($((n,u)=>l(e, n, t, u))), e)) : ("number" == typeof l && (e = l),
            l=>l.lift(new K(n,e)))
        }
        class K {
            constructor(n, l=Number.POSITIVE_INFINITY) {
                this.project = n,
                this.concurrent = l
            }
            call(n, l) {
                return l.subscribe(new Q(n,this.project,this.concurrent))
            }
        }
        class Q extends V {
            constructor(n, l, e=Number.POSITIVE_INFINITY) {
                super(n),
                this.project = l,
                this.concurrent = e,
                this.hasCompleted = !1,
                this.buffer = [],
                this.active = 0,
                this.index = 0
            }
            _next(n) {
                this.active < this.concurrent ? this._tryNext(n) : this.buffer.push(n)
            }
            _tryNext(n) {
                let l;
                const e = this.index++;
                try {
                    l = this.project(n, e)
                } catch (t) {
                    return void this.destination.error(t)
                }
                this.active++,
                this._innerSub(l, n, e)
            }
            _innerSub(n, l, e) {
                const t = new R(this,void 0,void 0);
                this.destination.add(t),
                F(this, n, l, e, t)
            }
            _complete() {
                this.hasCompleted = !0,
                0 === this.active && 0 === this.buffer.length && this.destination.complete(),
                this.unsubscribe()
            }
            notifyNext(n, l, e, t, u) {
                this.destination.next(l)
            }
            notifyComplete(n) {
                const l = this.buffer;
                this.remove(n),
                this.active--,
                l.length > 0 ? this._next(l.shift()) : 0 === this.active && this.hasCompleted && this.destination.complete()
            }
        }
        function Z(n) {
            return n
        }
        function Y(n=Number.POSITIVE_INFINITY) {
            return G(Z, n)
        }
        function J(...n) {
            let l = Number.POSITIVE_INFINITY
              , e = null
              , t = n[n.length - 1];
            return I(t) ? (e = n.pop(),
            n.length > 1 && "number" == typeof n[n.length - 1] && (l = n.pop())) : "number" == typeof t && (l = n.pop()),
            null === e && 1 === n.length && n[0]instanceof w ? n[0] : Y(l)(q(n, e))
        }
        function X() {
            return function(n) {
                return n.lift(new nn(n))
            }
        }
        class nn {
            constructor(n) {
                this.connectable = n
            }
            call(n, l) {
                const {connectable: e} = this;
                e._refCount++;
                const t = new ln(n,e)
                  , u = l.subscribe(t);
                return t.closed || (t.connection = e.connect()),
                u
            }
        }
        class ln extends g {
            constructor(n, l) {
                super(n),
                this.connectable = l
            }
            _unsubscribe() {
                const {connectable: n} = this;
                if (!n)
                    return void (this.connection = null);
                this.connectable = null;
                const l = n._refCount;
                if (l <= 0)
                    return void (this.connection = null);
                if (n._refCount = l - 1,
                l > 1)
                    return void (this.connection = null);
                const {connection: e} = this
                  , t = n._connection;
                this.connection = null,
                !t || e && t !== e || t.unsubscribe()
            }
        }
        const en = class extends w {
            constructor(n, l) {
                super(),
                this.source = n,
                this.subjectFactory = l,
                this._refCount = 0,
                this._isComplete = !1
            }
            _subscribe(n) {
                return this.getSubject().subscribe(n)
            }
            getSubject() {
                const n = this._subject;
                return n && !n.isStopped || (this._subject = this.subjectFactory()),
                this._subject
            }
            connect() {
                let n = this._connection;
                return n || (this._isComplete = !1,
                n = this._connection = new h,
                n.add(this.source.subscribe(new un(this.getSubject(),this))),
                n.closed ? (this._connection = null,
                n = h.EMPTY) : this._connection = n),
                n
            }
            refCount() {
                return X()(this)
            }
        }
        .prototype
          , tn = {
            operator: {
                value: null
            },
            _refCount: {
                value: 0,
                writable: !0
            },
            _subject: {
                value: null,
                writable: !0
            },
            _connection: {
                value: null,
                writable: !0
            },
            _subscribe: {
                value: en._subscribe
            },
            _isComplete: {
                value: en._isComplete,
                writable: !0
            },
            getSubject: {
                value: en.getSubject
            },
            connect: {
                value: en.connect
            },
            refCount: {
                value: en.refCount
            }
        };
        class un extends A {
            constructor(n, l) {
                super(n),
                this.connectable = l
            }
            _error(n) {
                this._unsubscribe(),
                super._error(n)
            }
            _complete() {
                this.connectable._isComplete = !0,
                this._unsubscribe(),
                super._complete()
            }
            _unsubscribe() {
                const n = this.connectable;
                if (n) {
                    this.connectable = null;
                    const l = n._connection;
                    n._refCount = 0,
                    n._subject = null,
                    n._connection = null,
                    l && l.unsubscribe()
                }
            }
        }
        function rn() {
            return new E
        }
        const sn = "__parameters__";
        function on(n, l, e) {
            const t = function(n) {
                return function(...l) {
                    if (n) {
                        const e = n(...l);
                        for (const n in e)
                            this[n] = e[n]
                    }
                }
            }(l);
            function u(...n) {
                if (this instanceof u)
                    return t.apply(this, n),
                    this;
                const l = new u(...n);
                return e.annotation = l,
                e;
                function e(n, e, t) {
                    const u = n.hasOwnProperty(sn) ? n[sn] : Object.defineProperty(n, sn, {
                        value: []
                    })[sn];
                    for (; u.length <= t; )
                        u.push(null);
                    return (u[t] = u[t] || []).push(l),
                    n
                }
            }
            return e && (u.prototype = Object.create(e.prototype)),
            u.prototype.ngMetadataName = n,
            u.annotationCls = u,
            u
        }
        const an = on("Inject", n=>({
            token: n
        }))
          , cn = on("Optional")
          , dn = on("Self")
          , hn = on("SkipSelf");
        var pn = function(n) {
            return n[n.Default = 0] = "Default",
            n[n.Host = 1] = "Host",
            n[n.Self = 2] = "Self",
            n[n.SkipSelf = 4] = "SkipSelf",
            n[n.Optional = 8] = "Optional",
            n
        }({});
        function fn(n) {
            for (let l in n)
                if (n[l] === fn)
                    return l;
            throw Error("Could not find renamed property on target object.")
        }
        function gn(n) {
            return {
                token: n.token,
                providedIn: n.providedIn || null,
                factory: n.factory,
                value: void 0
            }
        }
        function mn(n) {
            const l = n[vn];
            return l && l.token === n ? l : null
        }
        const vn = fn({
            ngInjectableDef: fn
        });
        function _n(n) {
            if ("string" == typeof n)
                return n;
            if (n instanceof Array)
                return "[" + n.map(_n).join(", ") + "]";
            if (null == n)
                return "" + n;
            if (n.overriddenName)
                return `${n.overriddenName}`;
            if (n.name)
                return `${n.name}`;
            const l = n.toString();
            if (null == l)
                return "" + l;
            const e = l.indexOf("\n");
            return -1 === e ? l : l.substring(0, e)
        }
        const bn = fn({
            __forward_ref__: fn
        });
        function yn(n) {
            return n.__forward_ref__ = yn,
            n.toString = function() {
                return _n(this())
            }
            ,
            n
        }
        function wn(n) {
            const l = n;
            return "function" == typeof l && l.hasOwnProperty(bn) && l.__forward_ref__ === yn ? l() : n
        }
        const kn = "undefined" != typeof globalThis && globalThis
          , Cn = "undefined" != typeof window && window
          , Sn = "undefined" != typeof self && "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope && self
          , xn = "undefined" != typeof global && global
          , An = kn || xn || Cn || Sn;
        class En {
            constructor(n, l) {
                this._desc = n,
                this.ngMetadataName = "InjectionToken",
                this.ngInjectableDef = void 0,
                "number" == typeof l ? this.__NG_ELEMENT_ID__ = l : void 0 !== l && (this.ngInjectableDef = gn({
                    token: this,
                    providedIn: l.providedIn || "root",
                    factory: l.factory
                }))
            }
            toString() {
                return `InjectionToken ${this._desc}`
            }
        }
        const Tn = new En("INJECTOR",-1)
          , In = new Object
          , Rn = "ngTempTokenPath"
          , Pn = "ngTokenPath"
          , On = /\n/gm
          , Mn = "\u0275"
          , Dn = "__source"
          , Nn = fn({
            provide: String,
            useValue: fn
        });
        let Ln, jn = void 0;
        function Un(n) {
            const l = jn;
            return jn = n,
            l
        }
        function Hn(n, l=pn.Default) {
            if (void 0 === jn)
                throw new Error("inject() must be called from an injection context");
            return null === jn ? function(n, l, e) {
                const t = mn(n);
                if (t && "root" == t.providedIn)
                    return void 0 === t.value ? t.value = t.factory() : t.value;
                if (e & pn.Optional)
                    return null;
                throw new Error(`Injector: NOT_FOUND [${_n(n)}]`)
            }(n, 0, l) : jn.get(n, l & pn.Optional ? null : void 0, l)
        }
        function Fn(n, l=pn.Default) {
            return (Ln || Hn)(n, l)
        }
        class Vn {
            get(n, l=In) {
                if (l === In) {
                    const l = new Error(`NullInjectorError: No provider for ${_n(n)}!`);
                    throw l.name = "NullInjectorError",
                    l
                }
                return l
            }
        }
        function $n(n, l, e, t=null) {
            n = n && "\n" === n.charAt(0) && n.charAt(1) == Mn ? n.substr(2) : n;
            let u = _n(l);
            if (l instanceof Array)
                u = l.map(_n).join(" -> ");
            else if ("object" == typeof l) {
                let n = [];
                for (let e in l)
                    if (l.hasOwnProperty(e)) {
                        let t = l[e];
                        n.push(e + ":" + ("string" == typeof t ? JSON.stringify(t) : _n(t)))
                    }
                u = `{${n.join(", ")}}`
            }
            return `${e}${t ? "(" + t + ")" : ""}[${u}]: ${n.replace(On, "\n  ")}`
        }
        class Bn {
        }
        class zn {
        }
        function qn(n, l, e) {
            l >= n.length ? n.push(e) : n.splice(l, 0, e)
        }
        function Wn(n, l) {
            return l >= n.length - 1 ? n.pop() : n.splice(l, 1)[0]
        }
        const Gn = function() {
            var n = {
                Emulated: 0,
                Native: 1,
                None: 2,
                ShadowDom: 3
            };
            return n[n.Emulated] = "Emulated",
            n[n.Native] = "Native",
            n[n.None] = "None",
            n[n.ShadowDom] = "ShadowDom",
            n
        }()
          , Kn = (()=>("undefined" != typeof requestAnimationFrame && requestAnimationFrame || setTimeout).bind(An))()
          , Qn = "ngDebugContext"
          , Zn = "ngOriginalError"
          , Yn = "ngErrorLogger";
        function Jn(n) {
            return n[Qn]
        }
        function Xn(n) {
            return n[Zn]
        }
        function nl(n, ...l) {
            n.error(...l)
        }
        class ll {
            constructor() {
                this._console = console
            }
            handleError(n) {
                const l = this._findOriginalError(n)
                  , e = this._findContext(n)
                  , t = function(n) {
                    return n[Yn] || nl
                }(n);
                t(this._console, "ERROR", n),
                l && t(this._console, "ORIGINAL ERROR", l),
                e && t(this._console, "ERROR CONTEXT", e)
            }
            _findContext(n) {
                return n ? Jn(n) ? Jn(n) : this._findContext(Xn(n)) : null
            }
            _findOriginalError(n) {
                let l = Xn(n);
                for (; l && Xn(l); )
                    l = Xn(l);
                return l
            }
        }
        let el = !0
          , tl = !1;
        function ul() {
            return tl = !0,
            el
        }
        class rl {
            constructor(n) {
                if (this.defaultDoc = n,
                this.inertDocument = this.defaultDoc.implementation.createHTMLDocument("sanitization-inert"),
                this.inertBodyElement = this.inertDocument.body,
                null == this.inertBodyElement) {
                    const n = this.inertDocument.createElement("html");
                    this.inertDocument.appendChild(n),
                    this.inertBodyElement = this.inertDocument.createElement("body"),
                    n.appendChild(this.inertBodyElement)
                }
                this.inertBodyElement.innerHTML = '<svg><g onload="this.parentNode.remove()"></g></svg>',
                !this.inertBodyElement.querySelector || this.inertBodyElement.querySelector("svg") ? (this.inertBodyElement.innerHTML = '<svg><p><style><img src="</style><img src=x onerror=alert(1)//">',
                this.getInertBodyElement = this.inertBodyElement.querySelector && this.inertBodyElement.querySelector("svg img") && function() {
                    try {
                        return !!window.DOMParser
                    } catch (n) {
                        return !1
                    }
                }() ? this.getInertBodyElement_DOMParser : this.getInertBodyElement_InertDocument) : this.getInertBodyElement = this.getInertBodyElement_XHR
            }
            getInertBodyElement_XHR(n) {
                n = "<body><remove></remove>" + n + "</body>";
                try {
                    n = encodeURI(n)
                } catch (t) {
                    return null
                }
                const l = new XMLHttpRequest;
                l.responseType = "document",
                l.open("GET", "data:text/html;charset=utf-8," + n, !1),
                l.send(void 0);
                const e = l.response.body;
                return e.removeChild(e.firstChild),
                e
            }
            getInertBodyElement_DOMParser(n) {
                n = "<body><remove></remove>" + n + "</body>";
                try {
                    const l = (new window.DOMParser).parseFromString(n, "text/html").body;
                    return l.removeChild(l.firstChild),
                    l
                } catch (l) {
                    return null
                }
            }
            getInertBodyElement_InertDocument(n) {
                const l = this.inertDocument.createElement("template");
                return "content"in l ? (l.innerHTML = n,
                l) : (this.inertBodyElement.innerHTML = n,
                this.defaultDoc.documentMode && this.stripCustomNsAttrs(this.inertBodyElement),
                this.inertBodyElement)
            }
            stripCustomNsAttrs(n) {
                const l = n.attributes;
                for (let t = l.length - 1; 0 < t; t--) {
                    const e = l.item(t).name;
                    "xmlns:ns1" !== e && 0 !== e.indexOf("ns1:") || n.removeAttribute(e)
                }
                let e = n.firstChild;
                for (; e; )
                    e.nodeType === Node.ELEMENT_NODE && this.stripCustomNsAttrs(e),
                    e = e.nextSibling
            }
        }
        const il = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi
          , sl = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+\/]+=*$/i;
        function ol(n) {
            return (n = String(n)).match(il) || n.match(sl) ? n : (ul() && console.warn(`WARNING: sanitizing unsafe URL value ${n} (see http://g.co/ng/security#xss)`),
            "unsafe:" + n)
        }
        function al(n) {
            const l = {};
            for (const e of n.split(","))
                l[e] = !0;
            return l
        }
        function cl(...n) {
            const l = {};
            for (const e of n)
                for (const n in e)
                    e.hasOwnProperty(n) && (l[n] = !0);
            return l
        }
        const dl = al("area,br,col,hr,img,wbr")
          , hl = al("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr")
          , pl = al("rp,rt")
          , fl = cl(pl, hl)
          , gl = cl(dl, cl(hl, al("address,article,aside,blockquote,caption,center,del,details,dialog,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5,h6,header,hgroup,hr,ins,main,map,menu,nav,ol,pre,section,summary,table,ul")), cl(pl, al("a,abbr,acronym,audio,b,bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,picture,q,ruby,rp,rt,s,samp,small,source,span,strike,strong,sub,sup,time,track,tt,u,var,video")), fl)
          , ml = al("background,cite,href,itemtype,longdesc,poster,src,xlink:href")
          , vl = al("srcset")
          , _l = cl(ml, vl, al("abbr,accesskey,align,alt,autoplay,axis,bgcolor,border,cellpadding,cellspacing,class,clear,color,cols,colspan,compact,controls,coords,datetime,default,dir,download,face,headers,height,hidden,hreflang,hspace,ismap,itemscope,itemprop,kind,label,lang,language,loop,media,muted,nohref,nowrap,open,preload,rel,rev,role,rows,rowspan,rules,scope,scrolling,shape,size,sizes,span,srclang,start,summary,tabindex,target,title,translate,type,usemap,valign,value,vspace,width"), al("aria-activedescendant,aria-atomic,aria-autocomplete,aria-busy,aria-checked,aria-colcount,aria-colindex,aria-colspan,aria-controls,aria-current,aria-describedby,aria-details,aria-disabled,aria-dropeffect,aria-errormessage,aria-expanded,aria-flowto,aria-grabbed,aria-haspopup,aria-hidden,aria-invalid,aria-keyshortcuts,aria-label,aria-labelledby,aria-level,aria-live,aria-modal,aria-multiline,aria-multiselectable,aria-orientation,aria-owns,aria-placeholder,aria-posinset,aria-pressed,aria-readonly,aria-relevant,aria-required,aria-roledescription,aria-rowcount,aria-rowindex,aria-rowspan,aria-selected,aria-setsize,aria-sort,aria-valuemax,aria-valuemin,aria-valuenow,aria-valuetext"))
          , bl = al("script,style,template");
        class yl {
            constructor() {
                this.sanitizedSomething = !1,
                this.buf = []
            }
            sanitizeChildren(n) {
                let l = n.firstChild
                  , e = !0;
                for (; l; )
                    if (l.nodeType === Node.ELEMENT_NODE ? e = this.startElement(l) : l.nodeType === Node.TEXT_NODE ? this.chars(l.nodeValue) : this.sanitizedSomething = !0,
                    e && l.firstChild)
                        l = l.firstChild;
                    else
                        for (; l; ) {
                            l.nodeType === Node.ELEMENT_NODE && this.endElement(l);
                            let n = this.checkClobberedElement(l, l.nextSibling);
                            if (n) {
                                l = n;
                                break
                            }
                            l = this.checkClobberedElement(l, l.parentNode)
                        }
                return this.buf.join("")
            }
            startElement(n) {
                const l = n.nodeName.toLowerCase();
                if (!gl.hasOwnProperty(l))
                    return this.sanitizedSomething = !0,
                    !bl.hasOwnProperty(l);
                this.buf.push("<"),
                this.buf.push(l);
                const e = n.attributes;
                for (let u = 0; u < e.length; u++) {
                    const n = e.item(u)
                      , l = n.name
                      , r = l.toLowerCase();
                    if (!_l.hasOwnProperty(r)) {
                        this.sanitizedSomething = !0;
                        continue
                    }
                    let i = n.value;
                    ml[r] && (i = ol(i)),
                    vl[r] && (t = i,
                    i = (t = String(t)).split(",").map(n=>ol(n.trim())).join(", ")),
                    this.buf.push(" ", l, '="', Cl(i), '"')
                }
                var t;
                return this.buf.push(">"),
                !0
            }
            endElement(n) {
                const l = n.nodeName.toLowerCase();
                gl.hasOwnProperty(l) && !dl.hasOwnProperty(l) && (this.buf.push("</"),
                this.buf.push(l),
                this.buf.push(">"))
            }
            chars(n) {
                this.buf.push(Cl(n))
            }
            checkClobberedElement(n, l) {
                if (l && (n.compareDocumentPosition(l) & Node.DOCUMENT_POSITION_CONTAINED_BY) === Node.DOCUMENT_POSITION_CONTAINED_BY)
                    throw new Error(`Failed to sanitize html because the element is clobbered: ${n.outerHTML}`);
                return l
            }
        }
        const wl = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
          , kl = /([^\#-~ |!])/g;
        function Cl(n) {
            return n.replace(/&/g, "&amp;").replace(wl, (function(n) {
                return "&#" + (1024 * (n.charCodeAt(0) - 55296) + (n.charCodeAt(1) - 56320) + 65536) + ";"
            }
            )).replace(kl, (function(n) {
                return "&#" + n.charCodeAt(0) + ";"
            }
            )).replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }
        let Sl;
        function xl(n) {
            return "content"in n && function(n) {
                return n.nodeType === Node.ELEMENT_NODE && "TEMPLATE" === n.nodeName
            }(n) ? n.content : null
        }
        const Al = function() {
            var n = {
                NONE: 0,
                HTML: 1,
                STYLE: 2,
                SCRIPT: 3,
                URL: 4,
                RESOURCE_URL: 5
            };
            return n[n.NONE] = "NONE",
            n[n.HTML] = "HTML",
            n[n.STYLE] = "STYLE",
            n[n.SCRIPT] = "SCRIPT",
            n[n.URL] = "URL",
            n[n.RESOURCE_URL] = "RESOURCE_URL",
            n
        }();
        class El {
        }
        const Tl = new RegExp("^([-,.\"'%_!# a-zA-Z0-9]+|(?:(?:matrix|translate|scale|rotate|skew|perspective)(?:X|Y|Z|3d)?|(?:rgb|hsl)a?|(?:repeating-)?(?:linear|radial)-gradient|(?:calc|attr))\\([-0-9.%, #a-zA-Z]+\\))$","g")
          , Il = /^url\(([^)]+)\)$/
          , Rl = /([A-Z])/g;
        function Pl(n) {
            try {
                return null != n ? n.toString().slice(0, 30) : n
            } catch (l) {
                return "[ERROR] Exception while trying to serialize the value"
            }
        }
        let Ol = (()=>{
            class n {
            }
            return n.__NG_ELEMENT_ID__ = ()=>Ml(),
            n
        }
        )();
        const Ml = (...n)=>{}
          , Dl = new En("The presence of this token marks an injector as being the root injector.")
          , Nl = function(n, l, e) {
            return new $l(n,l,e)
        };
        let Ll = (()=>{
            class n {
                static create(n, l) {
                    return Array.isArray(n) ? Nl(n, l, "") : Nl(n.providers, n.parent, n.name || "")
                }
            }
            return n.THROW_IF_NOT_FOUND = In,
            n.NULL = new Vn,
            n.ngInjectableDef = gn({
                token: n,
                providedIn: "any",
                factory: ()=>Fn(Tn)
            }),
            n.__NG_ELEMENT_ID__ = -1,
            n
        }
        )();
        const jl = function(n) {
            return n
        }
          , Ul = []
          , Hl = jl
          , Fl = function() {
            return Array.prototype.slice.call(arguments)
        }
          , Vl = "\u0275";
        class $l {
            constructor(n, l=Ll.NULL, e=null) {
                this.parent = l,
                this.source = e;
                const t = this._records = new Map;
                t.set(Ll, {
                    token: Ll,
                    fn: jl,
                    deps: Ul,
                    value: this,
                    useNew: !1
                }),
                t.set(Tn, {
                    token: Tn,
                    fn: jl,
                    deps: Ul,
                    value: this,
                    useNew: !1
                }),
                function n(l, e) {
                    if (e)
                        if ((e = wn(e))instanceof Array)
                            for (let t = 0; t < e.length; t++)
                                n(l, e[t]);
                        else {
                            if ("function" == typeof e)
                                throw zl("Function/Class not supported", e);
                            if (!e || "object" != typeof e || !e.provide)
                                throw zl("Unexpected provider", e);
                            {
                                let n = wn(e.provide);
                                const t = function(n) {
                                    const l = function(n) {
                                        let l = Ul;
                                        const e = n.deps;
                                        if (e && e.length) {
                                            l = [];
                                            for (let n = 0; n < e.length; n++) {
                                                let t = 6
                                                  , u = wn(e[n]);
                                                if (u instanceof Array)
                                                    for (let n = 0, l = u; n < l.length; n++) {
                                                        const e = l[n];
                                                        e instanceof cn || e == cn ? t |= 1 : e instanceof hn || e == hn ? t &= -3 : e instanceof dn || e == dn ? t &= -5 : u = e instanceof an ? e.token : wn(e)
                                                    }
                                                l.push({
                                                    token: u,
                                                    options: t
                                                })
                                            }
                                        } else if (n.useExisting)
                                            l = [{
                                                token: wn(n.useExisting),
                                                options: 6
                                            }];
                                        else if (!(e || Nn in n))
                                            throw zl("'deps' required", n);
                                        return l
                                    }(n);
                                    let e = jl
                                      , t = Ul
                                      , u = !1
                                      , r = wn(n.provide);
                                    if (Nn in n)
                                        t = n.useValue;
                                    else if (n.useFactory)
                                        e = n.useFactory;
                                    else if (n.useExisting)
                                        ;
                                    else if (n.useClass)
                                        u = !0,
                                        e = wn(n.useClass);
                                    else {
                                        if ("function" != typeof r)
                                            throw zl("StaticProvider does not have [useValue|useFactory|useExisting|useClass] or [provide] is not newable", n);
                                        u = !0,
                                        e = r
                                    }
                                    return {
                                        deps: l,
                                        fn: e,
                                        useNew: u,
                                        value: t
                                    }
                                }(e);
                                if (!0 === e.multi) {
                                    let t = l.get(n);
                                    if (t) {
                                        if (t.fn !== Fl)
                                            throw Bl(n)
                                    } else
                                        l.set(n, t = {
                                            token: e.provide,
                                            deps: [],
                                            useNew: !1,
                                            fn: Fl,
                                            value: Ul
                                        });
                                    n = e,
                                    t.deps.push({
                                        token: n,
                                        options: 6
                                    })
                                }
                                const u = l.get(n);
                                if (u && u.fn == Fl)
                                    throw Bl(n);
                                l.set(n, t)
                            }
                        }
                }(t, n)
            }
            get(n, l, e=pn.Default) {
                const t = this._records.get(n);
                try {
                    return function n(l, e, t, u, r, i) {
                        try {
                            return function(l, e, t, u, r, i) {
                                let s;
                                if (!e || i & pn.SkipSelf)
                                    i & pn.Self || (s = u.get(l, r, pn.Default));
                                else {
                                    if (s = e.value,
                                    s == Hl)
                                        throw Error(Vl + "Circular dependency");
                                    if (s === Ul) {
                                        e.value = Hl;
                                        let l = void 0
                                          , r = e.useNew
                                          , i = e.fn
                                          , o = e.deps
                                          , a = Ul;
                                        if (o.length) {
                                            a = [];
                                            for (let l = 0; l < o.length; l++) {
                                                const e = o[l]
                                                  , r = e.options
                                                  , i = 2 & r ? t.get(e.token) : void 0;
                                                a.push(n(e.token, i, t, i || 4 & r ? u : Ll.NULL, 1 & r ? null : Ll.THROW_IF_NOT_FOUND, pn.Default))
                                            }
                                        }
                                        e.value = s = r ? new i(...a) : i.apply(l, a)
                                    }
                                }
                                return s
                            }(l, e, t, u, r, i)
                        } catch (s) {
                            throw s instanceof Error || (s = new Error(s)),
                            (s[Rn] = s[Rn] || []).unshift(l),
                            e && e.value == Hl && (e.value = Ul),
                            s
                        }
                    }(n, t, this._records, this.parent, l, e)
                } catch (u) {
                    return function(n, l, e, t) {
                        const u = n[Rn];
                        throw l[Dn] && u.unshift(l[Dn]),
                        n.message = $n("\n" + n.message, u, "StaticInjectorError", t),
                        n[Pn] = u,
                        n[Rn] = null,
                        n
                    }(u, n, 0, this.source)
                }
            }
            toString() {
                const n = [];
                return this._records.forEach((l,e)=>n.push(_n(e))),
                `StaticInjector[${n.join(", ")}]`
            }
        }
        function Bl(n) {
            return zl("Cannot mix multi providers and regular providers", n)
        }
        function zl(n, l) {
            return new Error($n(n, l, "StaticInjectorError"))
        }
        const ql = new En("AnalyzeForEntryComponents");
        let Wl = null;
        function Gl() {
            if (!Wl) {
                const n = An.Symbol;
                if (n && n.iterator)
                    Wl = n.iterator;
                else {
                    const n = Object.getOwnPropertyNames(Map.prototype);
                    for (let l = 0; l < n.length; ++l) {
                        const e = n[l];
                        "entries" !== e && "size" !== e && Map.prototype[e] === Map.prototype.entries && (Wl = e)
                    }
                }
            }
            return Wl
        }
        function Kl(n, l) {
            return n === l || "number" == typeof n && "number" == typeof l && isNaN(n) && isNaN(l)
        }
        function Ql(n, l) {
            const e = Yl(n)
              , t = Yl(l);
            if (e && t)
                return function(n, l, e) {
                    const t = n[Gl()]()
                      , u = l[Gl()]();
                    for (; ; ) {
                        const n = t.next()
                          , l = u.next();
                        if (n.done && l.done)
                            return !0;
                        if (n.done || l.done)
                            return !1;
                        if (!e(n.value, l.value))
                            return !1
                    }
                }(n, l, Ql);
            {
                const u = n && ("object" == typeof n || "function" == typeof n)
                  , r = l && ("object" == typeof l || "function" == typeof l);
                return !(e || !u || t || !r) || Kl(n, l)
            }
        }
        class Zl {
            constructor(n) {
                this.wrapped = n
            }
            static wrap(n) {
                return new Zl(n)
            }
            static unwrap(n) {
                return Zl.isWrapped(n) ? n.wrapped : n
            }
            static isWrapped(n) {
                return n instanceof Zl
            }
        }
        function Yl(n) {
            return !!Jl(n) && (Array.isArray(n) || !(n instanceof Map) && Gl()in n)
        }
        function Jl(n) {
            return null !== n && ("function" == typeof n || "object" == typeof n)
        }
        function Xl(n) {
            return !!n && "function" == typeof n.then
        }
        function ne(n) {
            return !!n && "function" == typeof n.subscribe
        }
        class le {
            constructor(n, l, e) {
                this.previousValue = n,
                this.currentValue = l,
                this.firstChange = e
            }
            isFirstChange() {
                return this.firstChange
            }
        }
        class ee {
        }
        class te {
        }
        function ue(n) {
            const l = Error(`No component factory found for ${_n(n)}. Did you add it to @NgModule.entryComponents?`);
            return l[re] = n,
            l
        }
        const re = "ngComponent";
        class ie {
            resolveComponentFactory(n) {
                throw ue(n)
            }
        }
        let se = (()=>{
            class n {
            }
            return n.NULL = new ie,
            n
        }
        )();
        class oe {
            constructor(n, l, e) {
                this._parent = l,
                this._ngModule = e,
                this._factories = new Map;
                for (let t = 0; t < n.length; t++) {
                    const l = n[t];
                    this._factories.set(l.componentType, l)
                }
            }
            resolveComponentFactory(n) {
                let l = this._factories.get(n);
                if (!l && this._parent && (l = this._parent.resolveComponentFactory(n)),
                !l)
                    throw ue(n);
                return new ae(l,this._ngModule)
            }
        }
        class ae extends te {
            constructor(n, l) {
                super(),
                this.factory = n,
                this.ngModule = l,
                this.selector = n.selector,
                this.componentType = n.componentType,
                this.ngContentSelectors = n.ngContentSelectors,
                this.inputs = n.inputs,
                this.outputs = n.outputs
            }
            create(n, l, e, t) {
                return this.factory.create(n, l, e, t || this.ngModule)
            }
        }
        function ce(...n) {}
        let de = (()=>{
            class n {
                constructor(n) {
                    this.nativeElement = n
                }
            }
            return n.__NG_ELEMENT_ID__ = ()=>he(n),
            n
        }
        )();
        const he = ce;
        class pe {
        }
        class fe {
        }
        const ge = function() {
            var n = {
                Important: 1,
                DashCase: 2
            };
            return n[n.Important] = "Important",
            n[n.DashCase] = "DashCase",
            n
        }();
        let me = (()=>{
            class n {
            }
            return n.__NG_ELEMENT_ID__ = ()=>ve(),
            n
        }
        )();
        const ve = ce;
        class _e {
            constructor(n) {
                this.full = n,
                this.major = n.split(".")[0],
                this.minor = n.split(".")[1],
                this.patch = n.split(".").slice(2).join(".")
            }
        }
        const be = new _e("8.2.14");
        class ye {
            constructor() {}
            supports(n) {
                return Yl(n)
            }
            create(n) {
                return new ke(n)
            }
        }
        const we = (n,l)=>l;
        class ke {
            constructor(n) {
                this.length = 0,
                this._linkedRecords = null,
                this._unlinkedRecords = null,
                this._previousItHead = null,
                this._itHead = null,
                this._itTail = null,
                this._additionsHead = null,
                this._additionsTail = null,
                this._movesHead = null,
                this._movesTail = null,
                this._removalsHead = null,
                this._removalsTail = null,
                this._identityChangesHead = null,
                this._identityChangesTail = null,
                this._trackByFn = n || we
            }
            forEachItem(n) {
                let l;
                for (l = this._itHead; null !== l; l = l._next)
                    n(l)
            }
            forEachOperation(n) {
                let l = this._itHead
                  , e = this._removalsHead
                  , t = 0
                  , u = null;
                for (; l || e; ) {
                    const r = !e || l && l.currentIndex < Ae(e, t, u) ? l : e
                      , i = Ae(r, t, u)
                      , s = r.currentIndex;
                    if (r === e)
                        t--,
                        e = e._nextRemoved;
                    else if (l = l._next,
                    null == r.previousIndex)
                        t++;
                    else {
                        u || (u = []);
                        const n = i - t
                          , l = s - t;
                        if (n != l) {
                            for (let e = 0; e < n; e++) {
                                const t = e < u.length ? u[e] : u[e] = 0
                                  , r = t + e;
                                l <= r && r < n && (u[e] = t + 1)
                            }
                            u[r.previousIndex] = l - n
                        }
                    }
                    i !== s && n(r, i, s)
                }
            }
            forEachPreviousItem(n) {
                let l;
                for (l = this._previousItHead; null !== l; l = l._nextPrevious)
                    n(l)
            }
            forEachAddedItem(n) {
                let l;
                for (l = this._additionsHead; null !== l; l = l._nextAdded)
                    n(l)
            }
            forEachMovedItem(n) {
                let l;
                for (l = this._movesHead; null !== l; l = l._nextMoved)
                    n(l)
            }
            forEachRemovedItem(n) {
                let l;
                for (l = this._removalsHead; null !== l; l = l._nextRemoved)
                    n(l)
            }
            forEachIdentityChange(n) {
                let l;
                for (l = this._identityChangesHead; null !== l; l = l._nextIdentityChange)
                    n(l)
            }
            diff(n) {
                if (null == n && (n = []),
                !Yl(n))
                    throw new Error(`Error trying to diff '${_n(n)}'. Only arrays and iterables are allowed`);
                return this.check(n) ? this : null
            }
            onDestroy() {}
            check(n) {
                this._reset();
                let l, e, t, u = this._itHead, r = !1;
                if (Array.isArray(n)) {
                    this.length = n.length;
                    for (let l = 0; l < this.length; l++)
                        e = n[l],
                        t = this._trackByFn(l, e),
                        null !== u && Kl(u.trackById, t) ? (r && (u = this._verifyReinsertion(u, e, t, l)),
                        Kl(u.item, e) || this._addIdentityChange(u, e)) : (u = this._mismatch(u, e, t, l),
                        r = !0),
                        u = u._next
                } else
                    l = 0,
                    function(n, l) {
                        if (Array.isArray(n))
                            for (let e = 0; e < n.length; e++)
                                l(n[e]);
                        else {
                            const e = n[Gl()]();
                            let t;
                            for (; !(t = e.next()).done; )
                                l(t.value)
                        }
                    }(n, n=>{
                        t = this._trackByFn(l, n),
                        null !== u && Kl(u.trackById, t) ? (r && (u = this._verifyReinsertion(u, n, t, l)),
                        Kl(u.item, n) || this._addIdentityChange(u, n)) : (u = this._mismatch(u, n, t, l),
                        r = !0),
                        u = u._next,
                        l++
                    }
                    ),
                    this.length = l;
                return this._truncate(u),
                this.collection = n,
                this.isDirty
            }
            get isDirty() {
                return null !== this._additionsHead || null !== this._movesHead || null !== this._removalsHead || null !== this._identityChangesHead
            }
            _reset() {
                if (this.isDirty) {
                    let n, l;
                    for (n = this._previousItHead = this._itHead; null !== n; n = n._next)
                        n._nextPrevious = n._next;
                    for (n = this._additionsHead; null !== n; n = n._nextAdded)
                        n.previousIndex = n.currentIndex;
                    for (this._additionsHead = this._additionsTail = null,
                    n = this._movesHead; null !== n; n = l)
                        n.previousIndex = n.currentIndex,
                        l = n._nextMoved;
                    this._movesHead = this._movesTail = null,
                    this._removalsHead = this._removalsTail = null,
                    this._identityChangesHead = this._identityChangesTail = null
                }
            }
            _mismatch(n, l, e, t) {
                let u;
                return null === n ? u = this._itTail : (u = n._prev,
                this._remove(n)),
                null !== (n = null === this._linkedRecords ? null : this._linkedRecords.get(e, t)) ? (Kl(n.item, l) || this._addIdentityChange(n, l),
                this._moveAfter(n, u, t)) : null !== (n = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(e, null)) ? (Kl(n.item, l) || this._addIdentityChange(n, l),
                this._reinsertAfter(n, u, t)) : n = this._addAfter(new Ce(l,e), u, t),
                n
            }
            _verifyReinsertion(n, l, e, t) {
                let u = null === this._unlinkedRecords ? null : this._unlinkedRecords.get(e, null);
                return null !== u ? n = this._reinsertAfter(u, n._prev, t) : n.currentIndex != t && (n.currentIndex = t,
                this._addToMoves(n, t)),
                n
            }
            _truncate(n) {
                for (; null !== n; ) {
                    const l = n._next;
                    this._addToRemovals(this._unlink(n)),
                    n = l
                }
                null !== this._unlinkedRecords && this._unlinkedRecords.clear(),
                null !== this._additionsTail && (this._additionsTail._nextAdded = null),
                null !== this._movesTail && (this._movesTail._nextMoved = null),
                null !== this._itTail && (this._itTail._next = null),
                null !== this._removalsTail && (this._removalsTail._nextRemoved = null),
                null !== this._identityChangesTail && (this._identityChangesTail._nextIdentityChange = null)
            }
            _reinsertAfter(n, l, e) {
                null !== this._unlinkedRecords && this._unlinkedRecords.remove(n);
                const t = n._prevRemoved
                  , u = n._nextRemoved;
                return null === t ? this._removalsHead = u : t._nextRemoved = u,
                null === u ? this._removalsTail = t : u._prevRemoved = t,
                this._insertAfter(n, l, e),
                this._addToMoves(n, e),
                n
            }
            _moveAfter(n, l, e) {
                return this._unlink(n),
                this._insertAfter(n, l, e),
                this._addToMoves(n, e),
                n
            }
            _addAfter(n, l, e) {
                return this._insertAfter(n, l, e),
                this._additionsTail = null === this._additionsTail ? this._additionsHead = n : this._additionsTail._nextAdded = n,
                n
            }
            _insertAfter(n, l, e) {
                const t = null === l ? this._itHead : l._next;
                return n._next = t,
                n._prev = l,
                null === t ? this._itTail = n : t._prev = n,
                null === l ? this._itHead = n : l._next = n,
                null === this._linkedRecords && (this._linkedRecords = new xe),
                this._linkedRecords.put(n),
                n.currentIndex = e,
                n
            }
            _remove(n) {
                return this._addToRemovals(this._unlink(n))
            }
            _unlink(n) {
                null !== this._linkedRecords && this._linkedRecords.remove(n);
                const l = n._prev
                  , e = n._next;
                return null === l ? this._itHead = e : l._next = e,
                null === e ? this._itTail = l : e._prev = l,
                n
            }
            _addToMoves(n, l) {
                return n.previousIndex === l ? n : (this._movesTail = null === this._movesTail ? this._movesHead = n : this._movesTail._nextMoved = n,
                n)
            }
            _addToRemovals(n) {
                return null === this._unlinkedRecords && (this._unlinkedRecords = new xe),
                this._unlinkedRecords.put(n),
                n.currentIndex = null,
                n._nextRemoved = null,
                null === this._removalsTail ? (this._removalsTail = this._removalsHead = n,
                n._prevRemoved = null) : (n._prevRemoved = this._removalsTail,
                this._removalsTail = this._removalsTail._nextRemoved = n),
                n
            }
            _addIdentityChange(n, l) {
                return n.item = l,
                this._identityChangesTail = null === this._identityChangesTail ? this._identityChangesHead = n : this._identityChangesTail._nextIdentityChange = n,
                n
            }
        }
        class Ce {
            constructor(n, l) {
                this.item = n,
                this.trackById = l,
                this.currentIndex = null,
                this.previousIndex = null,
                this._nextPrevious = null,
                this._prev = null,
                this._next = null,
                this._prevDup = null,
                this._nextDup = null,
                this._prevRemoved = null,
                this._nextRemoved = null,
                this._nextAdded = null,
                this._nextMoved = null,
                this._nextIdentityChange = null
            }
        }
        class Se {
            constructor() {
                this._head = null,
                this._tail = null
            }
            add(n) {
                null === this._head ? (this._head = this._tail = n,
                n._nextDup = null,
                n._prevDup = null) : (this._tail._nextDup = n,
                n._prevDup = this._tail,
                n._nextDup = null,
                this._tail = n)
            }
            get(n, l) {
                let e;
                for (e = this._head; null !== e; e = e._nextDup)
                    if ((null === l || l <= e.currentIndex) && Kl(e.trackById, n))
                        return e;
                return null
            }
            remove(n) {
                const l = n._prevDup
                  , e = n._nextDup;
                return null === l ? this._head = e : l._nextDup = e,
                null === e ? this._tail = l : e._prevDup = l,
                null === this._head
            }
        }
        class xe {
            constructor() {
                this.map = new Map
            }
            put(n) {
                const l = n.trackById;
                let e = this.map.get(l);
                e || (e = new Se,
                this.map.set(l, e)),
                e.add(n)
            }
            get(n, l) {
                const e = this.map.get(n);
                return e ? e.get(n, l) : null
            }
            remove(n) {
                const l = n.trackById;
                return this.map.get(l).remove(n) && this.map.delete(l),
                n
            }
            get isEmpty() {
                return 0 === this.map.size
            }
            clear() {
                this.map.clear()
            }
        }
        function Ae(n, l, e) {
            const t = n.previousIndex;
            if (null === t)
                return t;
            let u = 0;
            return e && t < e.length && (u = e[t]),
            t + l + u
        }
        class Ee {
            constructor() {}
            supports(n) {
                return n instanceof Map || Jl(n)
            }
            create() {
                return new Te
            }
        }
        class Te {
            constructor() {
                this._records = new Map,
                this._mapHead = null,
                this._appendAfter = null,
                this._previousMapHead = null,
                this._changesHead = null,
                this._changesTail = null,
                this._additionsHead = null,
                this._additionsTail = null,
                this._removalsHead = null,
                this._removalsTail = null
            }
            get isDirty() {
                return null !== this._additionsHead || null !== this._changesHead || null !== this._removalsHead
            }
            forEachItem(n) {
                let l;
                for (l = this._mapHead; null !== l; l = l._next)
                    n(l)
            }
            forEachPreviousItem(n) {
                let l;
                for (l = this._previousMapHead; null !== l; l = l._nextPrevious)
                    n(l)
            }
            forEachChangedItem(n) {
                let l;
                for (l = this._changesHead; null !== l; l = l._nextChanged)
                    n(l)
            }
            forEachAddedItem(n) {
                let l;
                for (l = this._additionsHead; null !== l; l = l._nextAdded)
                    n(l)
            }
            forEachRemovedItem(n) {
                let l;
                for (l = this._removalsHead; null !== l; l = l._nextRemoved)
                    n(l)
            }
            diff(n) {
                if (n) {
                    if (!(n instanceof Map || Jl(n)))
                        throw new Error(`Error trying to diff '${_n(n)}'. Only maps and objects are allowed`)
                } else
                    n = new Map;
                return this.check(n) ? this : null
            }
            onDestroy() {}
            check(n) {
                this._reset();
                let l = this._mapHead;
                if (this._appendAfter = null,
                this._forEach(n, (n,e)=>{
                    if (l && l.key === e)
                        this._maybeAddToChanges(l, n),
                        this._appendAfter = l,
                        l = l._next;
                    else {
                        const t = this._getOrCreateRecordForKey(e, n);
                        l = this._insertBeforeOrAppend(l, t)
                    }
                }
                ),
                l) {
                    l._prev && (l._prev._next = null),
                    this._removalsHead = l;
                    for (let n = l; null !== n; n = n._nextRemoved)
                        n === this._mapHead && (this._mapHead = null),
                        this._records.delete(n.key),
                        n._nextRemoved = n._next,
                        n.previousValue = n.currentValue,
                        n.currentValue = null,
                        n._prev = null,
                        n._next = null
                }
                return this._changesTail && (this._changesTail._nextChanged = null),
                this._additionsTail && (this._additionsTail._nextAdded = null),
                this.isDirty
            }
            _insertBeforeOrAppend(n, l) {
                if (n) {
                    const e = n._prev;
                    return l._next = n,
                    l._prev = e,
                    n._prev = l,
                    e && (e._next = l),
                    n === this._mapHead && (this._mapHead = l),
                    this._appendAfter = n,
                    n
                }
                return this._appendAfter ? (this._appendAfter._next = l,
                l._prev = this._appendAfter) : this._mapHead = l,
                this._appendAfter = l,
                null
            }
            _getOrCreateRecordForKey(n, l) {
                if (this._records.has(n)) {
                    const e = this._records.get(n);
                    this._maybeAddToChanges(e, l);
                    const t = e._prev
                      , u = e._next;
                    return t && (t._next = u),
                    u && (u._prev = t),
                    e._next = null,
                    e._prev = null,
                    e
                }
                const e = new Ie(n);
                return this._records.set(n, e),
                e.currentValue = l,
                this._addToAdditions(e),
                e
            }
            _reset() {
                if (this.isDirty) {
                    let n;
                    for (this._previousMapHead = this._mapHead,
                    n = this._previousMapHead; null !== n; n = n._next)
                        n._nextPrevious = n._next;
                    for (n = this._changesHead; null !== n; n = n._nextChanged)
                        n.previousValue = n.currentValue;
                    for (n = this._additionsHead; null != n; n = n._nextAdded)
                        n.previousValue = n.currentValue;
                    this._changesHead = this._changesTail = null,
                    this._additionsHead = this._additionsTail = null,
                    this._removalsHead = null
                }
            }
            _maybeAddToChanges(n, l) {
                Kl(l, n.currentValue) || (n.previousValue = n.currentValue,
                n.currentValue = l,
                this._addToChanges(n))
            }
            _addToAdditions(n) {
                null === this._additionsHead ? this._additionsHead = this._additionsTail = n : (this._additionsTail._nextAdded = n,
                this._additionsTail = n)
            }
            _addToChanges(n) {
                null === this._changesHead ? this._changesHead = this._changesTail = n : (this._changesTail._nextChanged = n,
                this._changesTail = n)
            }
            _forEach(n, l) {
                n instanceof Map ? n.forEach(l) : Object.keys(n).forEach(e=>l(n[e], e))
            }
        }
        class Ie {
            constructor(n) {
                this.key = n,
                this.previousValue = null,
                this.currentValue = null,
                this._nextPrevious = null,
                this._next = null,
                this._prev = null,
                this._nextAdded = null,
                this._nextRemoved = null,
                this._nextChanged = null
            }
        }
        let Re = (()=>{
            class n {
                constructor(n) {
                    this.factories = n
                }
                static create(l, e) {
                    if (null != e) {
                        const n = e.factories.slice();
                        l = l.concat(n)
                    }
                    return new n(l)
                }
                static extend(l) {
                    return {
                        provide: n,
                        useFactory: e=>{
                            if (!e)
                                throw new Error("Cannot extend IterableDiffers without a parent injector");
                            return n.create(l, e)
                        }
                        ,
                        deps: [[n, new hn, new cn]]
                    }
                }
                find(n) {
                    const l = this.factories.find(l=>l.supports(n));
                    if (null != l)
                        return l;
                    throw new Error(`Cannot find a differ supporting object '${n}' of type '${e = n,
                    e.name || typeof e}'`);
                    var e
                }
            }
            return n.ngInjectableDef = gn({
                token: n,
                providedIn: "root",
                factory: ()=>new n([new ye])
            }),
            n
        }
        )()
          , Pe = (()=>{
            class n {
                constructor(n) {
                    this.factories = n
                }
                static create(l, e) {
                    if (e) {
                        const n = e.factories.slice();
                        l = l.concat(n)
                    }
                    return new n(l)
                }
                static extend(l) {
                    return {
                        provide: n,
                        useFactory: e=>{
                            if (!e)
                                throw new Error("Cannot extend KeyValueDiffers without a parent injector");
                            return n.create(l, e)
                        }
                        ,
                        deps: [[n, new hn, new cn]]
                    }
                }
                find(n) {
                    const l = this.factories.find(l=>l.supports(n));
                    if (l)
                        return l;
                    throw new Error(`Cannot find a differ supporting object '${n}'`)
                }
            }
            return n.ngInjectableDef = gn({
                token: n,
                providedIn: "root",
                factory: ()=>new n([new Ee])
            }),
            n
        }
        )();
        const Oe = [new Ee]
          , Me = new Re([new ye])
          , De = new Pe(Oe);
        let Ne = (()=>{
            class n {
            }
            return n.__NG_ELEMENT_ID__ = ()=>Le(n, de),
            n
        }
        )();
        const Le = ce;
        let je = (()=>{
            class n {
            }
            return n.__NG_ELEMENT_ID__ = ()=>Ue(n, de),
            n
        }
        )();
        const Ue = ce;
        function He(n, l, e, t) {
            let u = `ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: '${l}'. Current value: '${e}'.`;
            return t && (u += " It seems like the view has been created after its parent and its children have been dirty checked. Has it been created in a change detection hook ?"),
            function(n, l) {
                const e = new Error(n);
                return Fe(e, l),
                e
            }(u, n)
        }
        function Fe(n, l) {
            n[Qn] = l,
            n[Yn] = l.logError.bind(l)
        }
        function Ve(n) {
            return new Error(`ViewDestroyedError: Attempt to use a destroyed view: ${n}`)
        }
        function $e(n, l, e) {
            const t = n.state
              , u = 1792 & t;
            return u === l ? (n.state = -1793 & t | e,
            n.initIndex = -1,
            !0) : u === e
        }
        function Be(n, l, e) {
            return (1792 & n.state) === l && n.initIndex <= e && (n.initIndex = e + 1,
            !0)
        }
        function ze(n, l) {
            return n.nodes[l]
        }
        function qe(n, l) {
            return n.nodes[l]
        }
        function We(n, l) {
            return n.nodes[l]
        }
        function Ge(n, l) {
            return n.nodes[l]
        }
        function Ke(n, l) {
            return n.nodes[l]
        }
        const Qe = {
            setCurrentNode: void 0,
            createRootView: void 0,
            createEmbeddedView: void 0,
            createComponentView: void 0,
            createNgModuleRef: void 0,
            overrideProvider: void 0,
            overrideComponentView: void 0,
            clearOverrides: void 0,
            checkAndUpdateView: void 0,
            checkNoChangesView: void 0,
            destroyView: void 0,
            resolveDep: void 0,
            createDebugContext: void 0,
            handleEvent: void 0,
            updateDirectives: void 0,
            updateRenderer: void 0,
            dirtyParentQueries: void 0
        }
          , Ze = ()=>{}
          , Ye = new Map;
        function Je(n) {
            let l = Ye.get(n);
            return l || (l = _n(n) + "_" + Ye.size,
            Ye.set(n, l)),
            l
        }
        const Xe = "$$undefined"
          , nt = "$$empty";
        function lt(n) {
            return {
                id: Xe,
                styles: n.styles,
                encapsulation: n.encapsulation,
                data: n.data
            }
        }
        let et = 0;
        function tt(n, l, e, t) {
            return !(!(2 & n.state) && Kl(n.oldValues[l.bindingIndex + e], t))
        }
        function ut(n, l, e, t) {
            return !!tt(n, l, e, t) && (n.oldValues[l.bindingIndex + e] = t,
            !0)
        }
        function rt(n, l, e, t) {
            const u = n.oldValues[l.bindingIndex + e];
            if (1 & n.state || !Ql(u, t)) {
                const r = l.bindings[e].name;
                throw He(Qe.createDebugContext(n, l.nodeIndex), `${r}: ${u}`, `${r}: ${t}`, 0 != (1 & n.state))
            }
        }
        function it(n) {
            let l = n;
            for (; l; )
                2 & l.def.flags && (l.state |= 8),
                l = l.viewContainerParent || l.parent
        }
        function st(n, l) {
            let e = n;
            for (; e && e !== l; )
                e.state |= 64,
                e = e.viewContainerParent || e.parent
        }
        function ot(n, l, e, t) {
            try {
                return it(33554432 & n.def.nodes[l].flags ? qe(n, l).componentView : n),
                Qe.handleEvent(n, l, e, t)
            } catch (u) {
                n.root.errorHandler.handleError(u)
            }
        }
        function at(n) {
            return n.parent ? qe(n.parent, n.parentNodeDef.nodeIndex) : null
        }
        function ct(n) {
            return n.parent ? n.parentNodeDef.parent : null
        }
        function dt(n, l) {
            switch (201347067 & l.flags) {
            case 1:
                return qe(n, l.nodeIndex).renderElement;
            case 2:
                return ze(n, l.nodeIndex).renderText
            }
        }
        function ht(n) {
            return !!n.parent && !!(32768 & n.parentNodeDef.flags)
        }
        function pt(n) {
            return !(!n.parent || 32768 & n.parentNodeDef.flags)
        }
        function ft(n) {
            return 1 << n % 32
        }
        function gt(n) {
            const l = {};
            let e = 0;
            const t = {};
            return n && n.forEach(([n,u])=>{
                "number" == typeof n ? (l[n] = u,
                e |= ft(n)) : t[n] = u
            }
            ),
            {
                matchedQueries: l,
                references: t,
                matchedQueryIds: e
            }
        }
        function mt(n, l) {
            return n.map(n=>{
                let e, t;
                return Array.isArray(n) ? [t,e] = n : (t = 0,
                e = n),
                e && ("function" == typeof e || "object" == typeof e) && l && Object.defineProperty(e, Dn, {
                    value: l,
                    configurable: !0
                }),
                {
                    flags: t,
                    token: e,
                    tokenKey: Je(e)
                }
            }
            )
        }
        function vt(n, l, e) {
            let t = e.renderParent;
            return t ? 0 == (1 & t.flags) || 0 == (33554432 & t.flags) || t.element.componentRendererType && t.element.componentRendererType.encapsulation === Gn.Native ? qe(n, e.renderParent.nodeIndex).renderElement : void 0 : l
        }
        const _t = new WeakMap;
        function bt(n) {
            let l = _t.get(n);
            return l || (l = n(()=>Ze),
            l.factory = n,
            _t.set(n, l)),
            l
        }
        function yt(n, l, e, t, u) {
            3 === l && (e = n.renderer.parentNode(dt(n, n.def.lastRenderRootNode))),
            wt(n, l, 0, n.def.nodes.length - 1, e, t, u)
        }
        function wt(n, l, e, t, u, r, i) {
            for (let s = e; s <= t; s++) {
                const e = n.def.nodes[s];
                11 & e.flags && Ct(n, e, l, u, r, i),
                s += e.childCount
            }
        }
        function kt(n, l, e, t, u, r) {
            let i = n;
            for (; i && !ht(i); )
                i = i.parent;
            const s = i.parent
              , o = ct(i)
              , a = o.nodeIndex + o.childCount;
            for (let c = o.nodeIndex + 1; c <= a; c++) {
                const n = s.def.nodes[c];
                n.ngContentIndex === l && Ct(s, n, e, t, u, r),
                c += n.childCount
            }
            if (!s.parent) {
                const i = n.root.projectableNodes[l];
                if (i)
                    for (let l = 0; l < i.length; l++)
                        St(n, i[l], e, t, u, r)
            }
        }
        function Ct(n, l, e, t, u, r) {
            if (8 & l.flags)
                kt(n, l.ngContent.index, e, t, u, r);
            else {
                const i = dt(n, l);
                if (3 === e && 33554432 & l.flags && 48 & l.bindingFlags ? (16 & l.bindingFlags && St(n, i, e, t, u, r),
                32 & l.bindingFlags && St(qe(n, l.nodeIndex).componentView, i, e, t, u, r)) : St(n, i, e, t, u, r),
                16777216 & l.flags) {
                    const i = qe(n, l.nodeIndex).viewContainer._embeddedViews;
                    for (let n = 0; n < i.length; n++)
                        yt(i[n], e, t, u, r)
                }
                1 & l.flags && !l.element.name && wt(n, e, l.nodeIndex + 1, l.nodeIndex + l.childCount, t, u, r)
            }
        }
        function St(n, l, e, t, u, r) {
            const i = n.renderer;
            switch (e) {
            case 1:
                i.appendChild(t, l);
                break;
            case 2:
                i.insertBefore(t, l, u);
                break;
            case 3:
                i.removeChild(t, l);
                break;
            case 0:
                r.push(l)
            }
        }
        const xt = /^:([^:]+):(.+)$/;
        function At(n) {
            if (":" === n[0]) {
                const l = n.match(xt);
                return [l[1], l[2]]
            }
            return ["", n]
        }
        function Et(n) {
            let l = 0;
            for (let e = 0; e < n.length; e++)
                l |= n[e].flags;
            return l
        }
        const Tt = new Object
          , It = Je(Ll)
          , Rt = Je(Tn)
          , Pt = Je(Bn);
        function Ot(n, l, e, t) {
            return e = wn(e),
            {
                index: -1,
                deps: mt(t, _n(l)),
                flags: n,
                token: l,
                value: e
            }
        }
        function Mt(n, l, e=Ll.THROW_IF_NOT_FOUND) {
            const t = Un(n);
            try {
                if (8 & l.flags)
                    return l.token;
                if (2 & l.flags && (e = null),
                1 & l.flags)
                    return n._parent.get(l.token, e);
                const i = l.tokenKey;
                switch (i) {
                case It:
                case Rt:
                case Pt:
                    return n
                }
                const s = n._def.providersByKey[i];
                let o;
                if (s) {
                    let l = n._providers[s.index];
                    return void 0 === l && (l = n._providers[s.index] = Dt(n, s)),
                    l === Tt ? void 0 : l
                }
                if ((o = mn(l.token)) && (u = n,
                null != (r = o).providedIn && (function(n, l) {
                    return n._def.modules.indexOf(l) > -1
                }(u, r.providedIn) || "root" === r.providedIn && u._def.isRoot))) {
                    const e = n._providers.length;
                    return n._def.providers[e] = n._def.providersByKey[l.tokenKey] = {
                        flags: 5120,
                        value: o.factory,
                        deps: [],
                        index: e,
                        token: l.token
                    },
                    n._providers[e] = Tt,
                    n._providers[e] = Dt(n, n._def.providersByKey[l.tokenKey])
                }
                return 4 & l.flags ? e : n._parent.get(l.token, e)
            } finally {
                Un(t)
            }
            var u, r
        }
        function Dt(n, l) {
            let e;
            switch (201347067 & l.flags) {
            case 512:
                e = function(n, l, e) {
                    const t = e.length;
                    switch (t) {
                    case 0:
                        return new l;
                    case 1:
                        return new l(Mt(n, e[0]));
                    case 2:
                        return new l(Mt(n, e[0]),Mt(n, e[1]));
                    case 3:
                        return new l(Mt(n, e[0]),Mt(n, e[1]),Mt(n, e[2]));
                    default:
                        const u = new Array(t);
                        for (let l = 0; l < t; l++)
                            u[l] = Mt(n, e[l]);
                        return new l(...u)
                    }
                }(n, l.value, l.deps);
                break;
            case 1024:
                e = function(n, l, e) {
                    const t = e.length;
                    switch (t) {
                    case 0:
                        return l();
                    case 1:
                        return l(Mt(n, e[0]));
                    case 2:
                        return l(Mt(n, e[0]), Mt(n, e[1]));
                    case 3:
                        return l(Mt(n, e[0]), Mt(n, e[1]), Mt(n, e[2]));
                    default:
                        const u = Array(t);
                        for (let l = 0; l < t; l++)
                            u[l] = Mt(n, e[l]);
                        return l(...u)
                    }
                }(n, l.value, l.deps);
                break;
            case 2048:
                e = Mt(n, l.deps[0]);
                break;
            case 256:
                e = l.value
            }
            return e === Tt || null === e || "object" != typeof e || 131072 & l.flags || "function" != typeof e.ngOnDestroy || (l.flags |= 131072),
            void 0 === e ? Tt : e
        }
        function Nt(n, l) {
            const e = n.viewContainer._embeddedViews;
            if ((null == l || l >= e.length) && (l = e.length - 1),
            l < 0)
                return null;
            const t = e[l];
            return t.viewContainerParent = null,
            Wn(e, l),
            Qe.dirtyParentQueries(t),
            jt(t),
            t
        }
        function Lt(n, l, e) {
            const t = l ? dt(l, l.def.lastRenderRootNode) : n.renderElement
              , u = e.renderer.parentNode(t)
              , r = e.renderer.nextSibling(t);
            yt(e, 2, u, r, void 0)
        }
        function jt(n) {
            yt(n, 3, null, null, void 0)
        }
        const Ut = new Object;
        function Ht(n, l, e, t, u, r) {
            return new Ft(n,l,e,t,u,r)
        }
        class Ft extends te {
            constructor(n, l, e, t, u, r) {
                super(),
                this.selector = n,
                this.componentType = l,
                this._inputs = t,
                this._outputs = u,
                this.ngContentSelectors = r,
                this.viewDefFactory = e
            }
            get inputs() {
                const n = []
                  , l = this._inputs;
                for (let e in l)
                    n.push({
                        propName: e,
                        templateName: l[e]
                    });
                return n
            }
            get outputs() {
                const n = [];
                for (let l in this._outputs)
                    n.push({
                        propName: l,
                        templateName: this._outputs[l]
                    });
                return n
            }
            create(n, l, e, t) {
                if (!t)
                    throw new Error("ngModule should be provided");
                const u = bt(this.viewDefFactory)
                  , r = u.nodes[0].element.componentProvider.nodeIndex
                  , i = Qe.createRootView(n, l || [], e, u, t, Ut)
                  , s = We(i, r).instance;
                return e && i.renderer.setAttribute(qe(i, 0).renderElement, "ng-version", be.full),
                new Vt(i,new qt(i),s)
            }
        }
        class Vt extends ee {
            constructor(n, l, e) {
                super(),
                this._view = n,
                this._viewRef = l,
                this._component = e,
                this._elDef = this._view.def.nodes[0],
                this.hostView = l,
                this.changeDetectorRef = l,
                this.instance = e
            }
            get location() {
                return new de(qe(this._view, this._elDef.nodeIndex).renderElement)
            }
            get injector() {
                return new Qt(this._view,this._elDef)
            }
            get componentType() {
                return this._component.constructor
            }
            destroy() {
                this._viewRef.destroy()
            }
            onDestroy(n) {
                this._viewRef.onDestroy(n)
            }
        }
        function $t(n, l, e) {
            return new Bt(n,l,e)
        }
        class Bt {
            constructor(n, l, e) {
                this._view = n,
                this._elDef = l,
                this._data = e,
                this._embeddedViews = []
            }
            get element() {
                return new de(this._data.renderElement)
            }
            get injector() {
                return new Qt(this._view,this._elDef)
            }
            get parentInjector() {
                let n = this._view
                  , l = this._elDef.parent;
                for (; !l && n; )
                    l = ct(n),
                    n = n.parent;
                return n ? new Qt(n,l) : new Qt(this._view,null)
            }
            clear() {
                for (let n = this._embeddedViews.length - 1; n >= 0; n--) {
                    const l = Nt(this._data, n);
                    Qe.destroyView(l)
                }
            }
            get(n) {
                const l = this._embeddedViews[n];
                if (l) {
                    const n = new qt(l);
                    return n.attachToViewContainerRef(this),
                    n
                }
                return null
            }
            get length() {
                return this._embeddedViews.length
            }
            createEmbeddedView(n, l, e) {
                const t = n.createEmbeddedView(l || {});
                return this.insert(t, e),
                t
            }
            createComponent(n, l, e, t, u) {
                const r = e || this.parentInjector;
                u || n instanceof ae || (u = r.get(Bn));
                const i = n.create(r, t, void 0, u);
                return this.insert(i.hostView, l),
                i
            }
            insert(n, l) {
                if (n.destroyed)
                    throw new Error("Cannot insert a destroyed View in a ViewContainer!");
                const e = n;
                return function(n, l, e, t) {
                    let u = l.viewContainer._embeddedViews;
                    null == e && (e = u.length),
                    t.viewContainerParent = n,
                    qn(u, e, t),
                    function(n, l) {
                        const e = at(l);
                        if (!e || e === n || 16 & l.state)
                            return;
                        l.state |= 16;
                        let t = e.template._projectedViews;
                        t || (t = e.template._projectedViews = []),
                        t.push(l),
                        function(n, l) {
                            if (4 & l.flags)
                                return;
                            n.nodeFlags |= 4,
                            l.flags |= 4;
                            let e = l.parent;
                            for (; e; )
                                e.childFlags |= 4,
                                e = e.parent
                        }(l.parent.def, l.parentNodeDef)
                    }(l, t),
                    Qe.dirtyParentQueries(t),
                    Lt(l, e > 0 ? u[e - 1] : null, t)
                }(this._view, this._data, l, e._view),
                e.attachToViewContainerRef(this),
                n
            }
            move(n, l) {
                if (n.destroyed)
                    throw new Error("Cannot move a destroyed View in a ViewContainer!");
                const e = this._embeddedViews.indexOf(n._view);
                return function(n, l, e) {
                    const t = n.viewContainer._embeddedViews
                      , u = t[l];
                    Wn(t, l),
                    null == e && (e = t.length),
                    qn(t, e, u),
                    Qe.dirtyParentQueries(u),
                    jt(u),
                    Lt(n, e > 0 ? t[e - 1] : null, u)
                }(this._data, e, l),
                n
            }
            indexOf(n) {
                return this._embeddedViews.indexOf(n._view)
            }
            remove(n) {
                const l = Nt(this._data, n);
                l && Qe.destroyView(l)
            }
            detach(n) {
                const l = Nt(this._data, n);
                return l ? new qt(l) : null
            }
        }
        function zt(n) {
            return new qt(n)
        }
        class qt {
            constructor(n) {
                this._view = n,
                this._viewContainerRef = null,
                this._appRef = null
            }
            get rootNodes() {
                return function(n) {
                    const l = [];
                    return yt(n, 0, void 0, void 0, l),
                    l
                }(this._view)
            }
            get context() {
                return this._view.context
            }
            get destroyed() {
                return 0 != (128 & this._view.state)
            }
            markForCheck() {
                it(this._view)
            }
            detach() {
                this._view.state &= -5
            }
            detectChanges() {
                const n = this._view.root.rendererFactory;
                n.begin && n.begin();
                try {
                    Qe.checkAndUpdateView(this._view)
                } finally {
                    n.end && n.end()
                }
            }
            checkNoChanges() {
                Qe.checkNoChangesView(this._view)
            }
            reattach() {
                this._view.state |= 4
            }
            onDestroy(n) {
                this._view.disposables || (this._view.disposables = []),
                this._view.disposables.push(n)
            }
            destroy() {
                this._appRef ? this._appRef.detachView(this) : this._viewContainerRef && this._viewContainerRef.detach(this._viewContainerRef.indexOf(this)),
                Qe.destroyView(this._view)
            }
            detachFromAppRef() {
                this._appRef = null,
                jt(this._view),
                Qe.dirtyParentQueries(this._view)
            }
            attachToAppRef(n) {
                if (this._viewContainerRef)
                    throw new Error("This view is already attached to a ViewContainer!");
                this._appRef = n
            }
            attachToViewContainerRef(n) {
                if (this._appRef)
                    throw new Error("This view is already attached directly to the ApplicationRef!");
                this._viewContainerRef = n
            }
        }
        function Wt(n, l) {
            return new Gt(n,l)
        }
        class Gt extends Ne {
            constructor(n, l) {
                super(),
                this._parentView = n,
                this._def = l
            }
            createEmbeddedView(n) {
                return new qt(Qe.createEmbeddedView(this._parentView, this._def, this._def.element.template, n))
            }
            get elementRef() {
                return new de(qe(this._parentView, this._def.nodeIndex).renderElement)
            }
        }
        function Kt(n, l) {
            return new Qt(n,l)
        }
        class Qt {
            constructor(n, l) {
                this.view = n,
                this.elDef = l
            }
            get(n, l=Ll.THROW_IF_NOT_FOUND) {
                return Qe.resolveDep(this.view, this.elDef, !!this.elDef && 0 != (33554432 & this.elDef.flags), {
                    flags: 0,
                    token: n,
                    tokenKey: Je(n)
                }, l)
            }
        }
        function Zt(n, l) {
            const e = n.def.nodes[l];
            if (1 & e.flags) {
                const l = qe(n, e.nodeIndex);
                return e.element.template ? l.template : l.renderElement
            }
            if (2 & e.flags)
                return ze(n, e.nodeIndex).renderText;
            if (20240 & e.flags)
                return We(n, e.nodeIndex).instance;
            throw new Error(`Illegal state: read nodeValue for node index ${l}`)
        }
        function Yt(n) {
            return new Jt(n.renderer)
        }
        class Jt {
            constructor(n) {
                this.delegate = n
            }
            selectRootElement(n) {
                return this.delegate.selectRootElement(n)
            }
            createElement(n, l) {
                const [e,t] = At(l)
                  , u = this.delegate.createElement(t, e);
                return n && this.delegate.appendChild(n, u),
                u
            }
            createViewRoot(n) {
                return n
            }
            createTemplateAnchor(n) {
                const l = this.delegate.createComment("");
                return n && this.delegate.appendChild(n, l),
                l
            }
            createText(n, l) {
                const e = this.delegate.createText(l);
                return n && this.delegate.appendChild(n, e),
                e
            }
            projectNodes(n, l) {
                for (let e = 0; e < l.length; e++)
                    this.delegate.appendChild(n, l[e])
            }
            attachViewAfter(n, l) {
                const e = this.delegate.parentNode(n)
                  , t = this.delegate.nextSibling(n);
                for (let u = 0; u < l.length; u++)
                    this.delegate.insertBefore(e, l[u], t)
            }
            detachView(n) {
                for (let l = 0; l < n.length; l++) {
                    const e = n[l]
                      , t = this.delegate.parentNode(e);
                    this.delegate.removeChild(t, e)
                }
            }
            destroyView(n, l) {
                for (let e = 0; e < l.length; e++)
                    this.delegate.destroyNode(l[e])
            }
            listen(n, l, e) {
                return this.delegate.listen(n, l, e)
            }
            listenGlobal(n, l, e) {
                return this.delegate.listen(n, l, e)
            }
            setElementProperty(n, l, e) {
                this.delegate.setProperty(n, l, e)
            }
            setElementAttribute(n, l, e) {
                const [t,u] = At(l);
                null != e ? this.delegate.setAttribute(n, u, e, t) : this.delegate.removeAttribute(n, u, t)
            }
            setBindingDebugInfo(n, l, e) {}
            setElementClass(n, l, e) {
                e ? this.delegate.addClass(n, l) : this.delegate.removeClass(n, l)
            }
            setElementStyle(n, l, e) {
                null != e ? this.delegate.setStyle(n, l, e) : this.delegate.removeStyle(n, l)
            }
            invokeElementMethod(n, l, e) {
                n[l].apply(n, e)
            }
            setText(n, l) {
                this.delegate.setValue(n, l)
            }
            animate() {
                throw new Error("Renderer.animate is no longer supported!")
            }
        }
        function Xt(n, l, e, t) {
            return new nu(n,l,e,t)
        }
        class nu {
            constructor(n, l, e, t) {
                this._moduleType = n,
                this._parent = l,
                this._bootstrapComponents = e,
                this._def = t,
                this._destroyListeners = [],
                this._destroyed = !1,
                this.injector = this,
                function(n) {
                    const l = n._def
                      , e = n._providers = new Array(l.providers.length);
                    for (let t = 0; t < l.providers.length; t++) {
                        const u = l.providers[t];
                        4096 & u.flags || void 0 === e[t] && (e[t] = Dt(n, u))
                    }
                }(this)
            }
            get(n, l=Ll.THROW_IF_NOT_FOUND, e=pn.Default) {
                let t = 0;
                return e & pn.SkipSelf ? t |= 1 : e & pn.Self && (t |= 4),
                Mt(this, {
                    token: n,
                    tokenKey: Je(n),
                    flags: t
                }, l)
            }
            get instance() {
                return this.get(this._moduleType)
            }
            get componentFactoryResolver() {
                return this.get(se)
            }
            destroy() {
                if (this._destroyed)
                    throw new Error(`The ng module ${_n(this.instance.constructor)} has already been destroyed.`);
                this._destroyed = !0,
                function(n, l) {
                    const e = n._def
                      , t = new Set;
                    for (let u = 0; u < e.providers.length; u++)
                        if (131072 & e.providers[u].flags) {
                            const l = n._providers[u];
                            if (l && l !== Tt) {
                                const n = l.ngOnDestroy;
                                "function" != typeof n || t.has(l) || (n.apply(l),
                                t.add(l))
                            }
                        }
                }(this),
                this._destroyListeners.forEach(n=>n())
            }
            onDestroy(n) {
                this._destroyListeners.push(n)
            }
        }
        const lu = Je(pe)
          , eu = Je(me)
          , tu = Je(de)
          , uu = Je(je)
          , ru = Je(Ne)
          , iu = Je(Ol)
          , su = Je(Ll)
          , ou = Je(Tn);
        function au(n, l, e, t, u, r, i, s) {
            const o = [];
            if (i)
                for (let c in i) {
                    const [n,l] = i[c];
                    o[n] = {
                        flags: 8,
                        name: c,
                        nonMinifiedName: l,
                        ns: null,
                        securityContext: null,
                        suffix: null
                    }
                }
            const a = [];
            if (s)
                for (let c in s)
                    a.push({
                        type: 1,
                        propName: c,
                        target: null,
                        eventName: s[c]
                    });
            return du(n, l |= 16384, e, t, u, u, r, o, a)
        }
        function cu(n, l, e, t, u) {
            return du(-1, n, l, 0, e, t, u)
        }
        function du(n, l, e, t, u, r, i, s, o) {
            const {matchedQueries: a, references: c, matchedQueryIds: d} = gt(e);
            o || (o = []),
            s || (s = []),
            r = wn(r);
            const h = mt(i, _n(u));
            return {
                nodeIndex: -1,
                parent: null,
                renderParent: null,
                bindingIndex: -1,
                outputIndex: -1,
                checkIndex: n,
                flags: l,
                childFlags: 0,
                directChildFlags: 0,
                childMatchedQueries: 0,
                matchedQueries: a,
                matchedQueryIds: d,
                references: c,
                ngContentIndex: -1,
                childCount: t,
                bindings: s,
                bindingFlags: Et(s),
                outputs: o,
                element: null,
                provider: {
                    token: u,
                    value: r,
                    deps: h
                },
                text: null,
                query: null,
                ngContent: null
            }
        }
        function hu(n, l) {
            return mu(n, l)
        }
        function pu(n, l) {
            let e = n;
            for (; e.parent && !ht(e); )
                e = e.parent;
            return vu(e.parent, ct(e), !0, l.provider.value, l.provider.deps)
        }
        function fu(n, l) {
            const e = vu(n, l.parent, (32768 & l.flags) > 0, l.provider.value, l.provider.deps);
            if (l.outputs.length)
                for (let t = 0; t < l.outputs.length; t++) {
                    const u = l.outputs[t]
                      , r = e[u.propName];
                    if (!ne(r))
                        throw new Error(`@Output ${u.propName} not initialized in '${e.constructor.name}'.`);
                    {
                        const e = r.subscribe(gu(n, l.parent.nodeIndex, u.eventName));
                        n.disposables[l.outputIndex + t] = e.unsubscribe.bind(e)
                    }
                }
            return e
        }
        function gu(n, l, e) {
            return t=>ot(n, l, e, t)
        }
        function mu(n, l) {
            const e = (8192 & l.flags) > 0
              , t = l.provider;
            switch (201347067 & l.flags) {
            case 512:
                return vu(n, l.parent, e, t.value, t.deps);
            case 1024:
                return function(n, l, e, t, u) {
                    const r = u.length;
                    switch (r) {
                    case 0:
                        return t();
                    case 1:
                        return t(bu(n, l, e, u[0]));
                    case 2:
                        return t(bu(n, l, e, u[0]), bu(n, l, e, u[1]));
                    case 3:
                        return t(bu(n, l, e, u[0]), bu(n, l, e, u[1]), bu(n, l, e, u[2]));
                    default:
                        const i = Array(r);
                        for (let t = 0; t < r; t++)
                            i[t] = bu(n, l, e, u[t]);
                        return t(...i)
                    }
                }(n, l.parent, e, t.value, t.deps);
            case 2048:
                return bu(n, l.parent, e, t.deps[0]);
            case 256:
                return t.value
            }
        }
        function vu(n, l, e, t, u) {
            const r = u.length;
            switch (r) {
            case 0:
                return new t;
            case 1:
                return new t(bu(n, l, e, u[0]));
            case 2:
                return new t(bu(n, l, e, u[0]),bu(n, l, e, u[1]));
            case 3:
                return new t(bu(n, l, e, u[0]),bu(n, l, e, u[1]),bu(n, l, e, u[2]));
            default:
                const i = new Array(r);
                for (let t = 0; t < r; t++)
                    i[t] = bu(n, l, e, u[t]);
                return new t(...i)
            }
        }
        const _u = {};
        function bu(n, l, e, t, u=Ll.THROW_IF_NOT_FOUND) {
            if (8 & t.flags)
                return t.token;
            const r = n;
            2 & t.flags && (u = null);
            const i = t.tokenKey;
            i === iu && (e = !(!l || !l.element.componentView)),
            l && 1 & t.flags && (e = !1,
            l = l.parent);
            let s = n;
            for (; s; ) {
                if (l)
                    switch (i) {
                    case lu:
                        return Yt(yu(s, l, e));
                    case eu:
                        return yu(s, l, e).renderer;
                    case tu:
                        return new de(qe(s, l.nodeIndex).renderElement);
                    case uu:
                        return qe(s, l.nodeIndex).viewContainer;
                    case ru:
                        if (l.element.template)
                            return qe(s, l.nodeIndex).template;
                        break;
                    case iu:
                        return zt(yu(s, l, e));
                    case su:
                    case ou:
                        return Kt(s, l);
                    default:
                        const n = (e ? l.element.allProviders : l.element.publicProviders)[i];
                        if (n) {
                            let l = We(s, n.nodeIndex);
                            return l || (l = {
                                instance: mu(s, n)
                            },
                            s.nodes[n.nodeIndex] = l),
                            l.instance
                        }
                    }
                e = ht(s),
                l = ct(s),
                s = s.parent,
                4 & t.flags && (s = null)
            }
            const o = r.root.injector.get(t.token, _u);
            return o !== _u || u === _u ? o : r.root.ngModule.injector.get(t.token, u)
        }
        function yu(n, l, e) {
            let t;
            if (e)
                t = qe(n, l.nodeIndex).componentView;
            else
                for (t = n; t.parent && !ht(t); )
                    t = t.parent;
            return t
        }
        function wu(n, l, e, t, u, r) {
            if (32768 & e.flags) {
                const l = qe(n, e.parent.nodeIndex).componentView;
                2 & l.def.flags && (l.state |= 8)
            }
            if (l.instance[e.bindings[t].name] = u,
            524288 & e.flags) {
                r = r || {};
                const l = Zl.unwrap(n.oldValues[e.bindingIndex + t]);
                r[e.bindings[t].nonMinifiedName] = new le(l,u,0 != (2 & n.state))
            }
            return n.oldValues[e.bindingIndex + t] = u,
            r
        }
        function ku(n, l) {
            if (!(n.def.nodeFlags & l))
                return;
            const e = n.def.nodes;
            let t = 0;
            for (let u = 0; u < e.length; u++) {
                const r = e[u];
                let i = r.parent;
                for (!i && r.flags & l && Su(n, u, r.flags & l, t++),
                0 == (r.childFlags & l) && (u += r.childCount); i && 1 & i.flags && u === i.nodeIndex + i.childCount; )
                    i.directChildFlags & l && (t = Cu(n, i, l, t)),
                    i = i.parent
            }
        }
        function Cu(n, l, e, t) {
            for (let u = l.nodeIndex + 1; u <= l.nodeIndex + l.childCount; u++) {
                const l = n.def.nodes[u];
                l.flags & e && Su(n, u, l.flags & e, t++),
                u += l.childCount
            }
            return t
        }
        function Su(n, l, e, t) {
            const u = We(n, l);
            if (!u)
                return;
            const r = u.instance;
            r && (Qe.setCurrentNode(n, l),
            1048576 & e && Be(n, 512, t) && r.ngAfterContentInit(),
            2097152 & e && r.ngAfterContentChecked(),
            4194304 & e && Be(n, 768, t) && r.ngAfterViewInit(),
            8388608 & e && r.ngAfterViewChecked(),
            131072 & e && r.ngOnDestroy())
        }
        const xu = new En("SCHEDULER_TOKEN",{
            providedIn: "root",
            factory: ()=>Kn
        })
          , Au = {}
          , Eu = function() {
            var n = {
                LocaleId: 0,
                DayPeriodsFormat: 1,
                DayPeriodsStandalone: 2,
                DaysFormat: 3,
                DaysStandalone: 4,
                MonthsFormat: 5,
                MonthsStandalone: 6,
                Eras: 7,
                FirstDayOfWeek: 8,
                WeekendRange: 9,
                DateFormat: 10,
                TimeFormat: 11,
                DateTimeFormat: 12,
                NumberSymbols: 13,
                NumberFormats: 14,
                CurrencySymbol: 15,
                CurrencyName: 16,
                Currencies: 17,
                PluralCase: 18,
                ExtraData: 19
            };
            return n[n.LocaleId] = "LocaleId",
            n[n.DayPeriodsFormat] = "DayPeriodsFormat",
            n[n.DayPeriodsStandalone] = "DayPeriodsStandalone",
            n[n.DaysFormat] = "DaysFormat",
            n[n.DaysStandalone] = "DaysStandalone",
            n[n.MonthsFormat] = "MonthsFormat",
            n[n.MonthsStandalone] = "MonthsStandalone",
            n[n.Eras] = "Eras",
            n[n.FirstDayOfWeek] = "FirstDayOfWeek",
            n[n.WeekendRange] = "WeekendRange",
            n[n.DateFormat] = "DateFormat",
            n[n.TimeFormat] = "TimeFormat",
            n[n.DateTimeFormat] = "DateTimeFormat",
            n[n.NumberSymbols] = "NumberSymbols",
            n[n.NumberFormats] = "NumberFormats",
            n[n.CurrencySymbol] = "CurrencySymbol",
            n[n.CurrencyName] = "CurrencyName",
            n[n.Currencies] = "Currencies",
            n[n.PluralCase] = "PluralCase",
            n[n.ExtraData] = "ExtraData",
            n
        }()
          , Tu = void 0;
        var Iu = ["en", [["a", "p"], ["AM", "PM"], Tu], [["AM", "PM"], Tu, Tu], [["S", "M", "T", "W", "T", "F", "S"], ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]], Tu, [["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"], ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]], Tu, [["B", "A"], ["BC", "AD"], ["Before Christ", "Anno Domini"]], 0, [6, 0], ["M/d/yy", "MMM d, y", "MMMM d, y", "EEEE, MMMM d, y"], ["h:mm a", "h:mm:ss a", "h:mm:ss a z", "h:mm:ss a zzzz"], ["{1}, {0}", Tu, "{1} 'at' {0}", Tu], [".", ",", ";", "%", "+", "-", "E", "\xd7", "\u2030", "\u221e", "NaN", ":"], ["#,##0.###", "#,##0%", "\xa4#,##0.00", "#E0"], "$", "US Dollar", {}, function(n) {
            let l = Math.floor(Math.abs(n))
              , e = n.toString().replace(/^[^.]*\.?/, "").length;
            return 1 === l && 0 === e ? 1 : 5
        }
        ];
        const Ru = "en-US";
        let Pu = Ru;
        function Ou(n) {
            var l;
            l = "Expected localeId to be defined",
            null == n && function(n) {
                throw new Error(`ASSERTION ERROR: ${n}`)
            }(l),
            "string" == typeof n && (Pu = n.toLowerCase().replace(/_/g, "-"))
        }
        class Mu extends E {
            constructor(n=!1) {
                super(),
                this.__isAsync = n
            }
            emit(n) {
                super.next(n)
            }
            subscribe(n, l, e) {
                let t, u = n=>null, r = ()=>null;
                n && "object" == typeof n ? (t = this.__isAsync ? l=>{
                    setTimeout(()=>n.next(l))
                }
                : l=>{
                    n.next(l)
                }
                ,
                n.error && (u = this.__isAsync ? l=>{
                    setTimeout(()=>n.error(l))
                }
                : l=>{
                    n.error(l)
                }
                ),
                n.complete && (r = this.__isAsync ? ()=>{
                    setTimeout(()=>n.complete())
                }
                : ()=>{
                    n.complete()
                }
                )) : (t = this.__isAsync ? l=>{
                    setTimeout(()=>n(l))
                }
                : l=>{
                    n(l)
                }
                ,
                l && (u = this.__isAsync ? n=>{
                    setTimeout(()=>l(n))
                }
                : n=>{
                    l(n)
                }
                ),
                e && (r = this.__isAsync ? ()=>{
                    setTimeout(()=>e())
                }
                : ()=>{
                    e()
                }
                ));
                const i = super.subscribe(t, u, r);
                return n instanceof h && n.add(i),
                i
            }
        }
        function Du() {
            return this._results[Gl()]()
        }
        class Nu {
            constructor() {
                this.dirty = !0,
                this._results = [],
                this.changes = new Mu,
                this.length = 0;
                const n = Gl()
                  , l = Nu.prototype;
                l[n] || (l[n] = Du)
            }
            map(n) {
                return this._results.map(n)
            }
            filter(n) {
                return this._results.filter(n)
            }
            find(n) {
                return this._results.find(n)
            }
            reduce(n, l) {
                return this._results.reduce(n, l)
            }
            forEach(n) {
                this._results.forEach(n)
            }
            some(n) {
                return this._results.some(n)
            }
            toArray() {
                return this._results.slice()
            }
            toString() {
                return this._results.toString()
            }
            reset(n) {
                this._results = function n(l, e) {
                    void 0 === e && (e = l);
                    for (let t = 0; t < l.length; t++) {
                        let u = l[t];
                        Array.isArray(u) ? (e === l && (e = l.slice(0, t)),
                        n(u, e)) : e !== l && e.push(u)
                    }
                    return e
                }(n),
                this.dirty = !1,
                this.length = this._results.length,
                this.last = this._results[this.length - 1],
                this.first = this._results[0]
            }
            notifyOnChanges() {
                this.changes.emit(this)
            }
            setDirty() {
                this.dirty = !0
            }
            destroy() {
                this.changes.complete(),
                this.changes.unsubscribe()
            }
        }
        const Lu = new En("Application Initializer");
        class ju {
            constructor(n) {
                this.appInits = n,
                this.initialized = !1,
                this.done = !1,
                this.donePromise = new Promise((n,l)=>{
                    this.resolve = n,
                    this.reject = l
                }
                )
            }
            runInitializers() {
                if (this.initialized)
                    return;
                const n = []
                  , l = ()=>{
                    this.done = !0,
                    this.resolve()
                }
                ;
                if (this.appInits)
                    for (let e = 0; e < this.appInits.length; e++) {
                        const l = this.appInits[e]();
                        Xl(l) && n.push(l)
                    }
                Promise.all(n).then(()=>{
                    l()
                }
                ).catch(n=>{
                    this.reject(n)
                }
                ),
                0 === n.length && l(),
                this.initialized = !0
            }
        }
        const Uu = new En("AppId");
        function Hu() {
            return `${Fu()}${Fu()}${Fu()}`
        }
        function Fu() {
            return String.fromCharCode(97 + Math.floor(25 * Math.random()))
        }
        const Vu = new En("Platform Initializer")
          , $u = new En("Platform ID")
          , Bu = new En("appBootstrapListener");
        class zu {
            log(n) {
                console.log(n)
            }
            warn(n) {
                console.warn(n)
            }
        }
        const qu = new En("LocaleId")
          , Wu = !1;
        function Gu() {
            throw new Error("Runtime compiler is not loaded")
        }
        const Ku = Gu
          , Qu = Gu
          , Zu = Gu
          , Yu = Gu;
        class Ju {
            constructor() {
                this.compileModuleSync = Ku,
                this.compileModuleAsync = Qu,
                this.compileModuleAndAllComponentsSync = Zu,
                this.compileModuleAndAllComponentsAsync = Yu
            }
            clearCache() {}
            clearCacheFor(n) {}
            getModuleId(n) {}
        }
        class Xu {
        }
        let nr, lr;
        function er() {
            const n = An.wtf;
            return !(!n || (nr = n.trace,
            !nr) || (lr = nr.events,
            0))
        }
        const tr = er();
        function ur(n, l) {
            return null
        }
        const rr = tr ? function(n, l=null) {
            return lr.createScope(n, l)
        }
        : (n,l)=>ur
          , ir = tr ? function(n, l) {
            return nr.leaveScope(n, l),
            l
        }
        : (n,l)=>l
          , sr = (()=>Promise.resolve(0))();
        function or(n) {
            "undefined" == typeof Zone ? sr.then(()=>{
                n && n.apply(null, null)
            }
            ) : Zone.current.scheduleMicroTask("scheduleMicrotask", n)
        }
        class ar {
            constructor({enableLongStackTrace: n=!1}) {
                if (this.hasPendingMicrotasks = !1,
                this.hasPendingMacrotasks = !1,
                this.isStable = !0,
                this.onUnstable = new Mu(!1),
                this.onMicrotaskEmpty = new Mu(!1),
                this.onStable = new Mu(!1),
                this.onError = new Mu(!1),
                "undefined" == typeof Zone)
                    throw new Error("In this configuration Angular requires Zone.js");
                var l;
                Zone.assertZonePatched(),
                this._nesting = 0,
                this._outer = this._inner = Zone.current,
                Zone.wtfZoneSpec && (this._inner = this._inner.fork(Zone.wtfZoneSpec)),
                Zone.TaskTrackingZoneSpec && (this._inner = this._inner.fork(new Zone.TaskTrackingZoneSpec)),
                n && Zone.longStackTraceZoneSpec && (this._inner = this._inner.fork(Zone.longStackTraceZoneSpec)),
                (l = this)._inner = l._inner.fork({
                    name: "angular",
                    properties: {
                        isAngularZone: !0
                    },
                    onInvokeTask: (n,e,t,u,r,i)=>{
                        try {
                            return pr(l),
                            n.invokeTask(t, u, r, i)
                        } finally {
                            fr(l)
                        }
                    }
                    ,
                    onInvoke: (n,e,t,u,r,i,s)=>{
                        try {
                            return pr(l),
                            n.invoke(t, u, r, i, s)
                        } finally {
                            fr(l)
                        }
                    }
                    ,
                    onHasTask: (n,e,t,u)=>{
                        n.hasTask(t, u),
                        e === t && ("microTask" == u.change ? (l.hasPendingMicrotasks = u.microTask,
                        hr(l)) : "macroTask" == u.change && (l.hasPendingMacrotasks = u.macroTask))
                    }
                    ,
                    onHandleError: (n,e,t,u)=>(n.handleError(t, u),
                    l.runOutsideAngular(()=>l.onError.emit(u)),
                    !1)
                })
            }
            static isInAngularZone() {
                return !0 === Zone.current.get("isAngularZone")
            }
            static assertInAngularZone() {
                if (!ar.isInAngularZone())
                    throw new Error("Expected to be in Angular Zone, but it is not!")
            }
            static assertNotInAngularZone() {
                if (ar.isInAngularZone())
                    throw new Error("Expected to not be in Angular Zone, but it is!")
            }
            run(n, l, e) {
                return this._inner.run(n, l, e)
            }
            runTask(n, l, e, t) {
                const u = this._inner
                  , r = u.scheduleEventTask("NgZoneEvent: " + t, n, dr, cr, cr);
                try {
                    return u.runTask(r, l, e)
                } finally {
                    u.cancelTask(r)
                }
            }
            runGuarded(n, l, e) {
                return this._inner.runGuarded(n, l, e)
            }
            runOutsideAngular(n) {
                return this._outer.run(n)
            }
        }
        function cr() {}
        const dr = {};
        function hr(n) {
            if (0 == n._nesting && !n.hasPendingMicrotasks && !n.isStable)
                try {
                    n._nesting++,
                    n.onMicrotaskEmpty.emit(null)
                } finally {
                    if (n._nesting--,
                    !n.hasPendingMicrotasks)
                        try {
                            n.runOutsideAngular(()=>n.onStable.emit(null))
                        } finally {
                            n.isStable = !0
                        }
                }
        }
        function pr(n) {
            n._nesting++,
            n.isStable && (n.isStable = !1,
            n.onUnstable.emit(null))
        }
        function fr(n) {
            n._nesting--,
            hr(n)
        }
        class gr {
            constructor() {
                this.hasPendingMicrotasks = !1,
                this.hasPendingMacrotasks = !1,
                this.isStable = !0,
                this.onUnstable = new Mu,
                this.onMicrotaskEmpty = new Mu,
                this.onStable = new Mu,
                this.onError = new Mu
            }
            run(n) {
                return n()
            }
            runGuarded(n) {
                return n()
            }
            runOutsideAngular(n) {
                return n()
            }
            runTask(n) {
                return n()
            }
        }
        class mr {
            constructor(n) {
                this._ngZone = n,
                this._pendingCount = 0,
                this._isZoneStable = !0,
                this._didWork = !1,
                this._callbacks = [],
                this.taskTrackingZone = null,
                this._watchAngularEvents(),
                n.run(()=>{
                    this.taskTrackingZone = "undefined" == typeof Zone ? null : Zone.current.get("TaskTrackingZone")
                }
                )
            }
            _watchAngularEvents() {
                this._ngZone.onUnstable.subscribe({
                    next: ()=>{
                        this._didWork = !0,
                        this._isZoneStable = !1
                    }
                }),
                this._ngZone.runOutsideAngular(()=>{
                    this._ngZone.onStable.subscribe({
                        next: ()=>{
                            ar.assertNotInAngularZone(),
                            or(()=>{
                                this._isZoneStable = !0,
                                this._runCallbacksIfReady()
                            }
                            )
                        }
                    })
                }
                )
            }
            increasePendingRequestCount() {
                return this._pendingCount += 1,
                this._didWork = !0,
                this._pendingCount
            }
            decreasePendingRequestCount() {
                if (this._pendingCount -= 1,
                this._pendingCount < 0)
                    throw new Error("pending async requests below zero");
                return this._runCallbacksIfReady(),
                this._pendingCount
            }
            isStable() {
                return this._isZoneStable && 0 === this._pendingCount && !this._ngZone.hasPendingMacrotasks
            }
            _runCallbacksIfReady() {
                if (this.isStable())
                    or(()=>{
                        for (; 0 !== this._callbacks.length; ) {
                            let n = this._callbacks.pop();
                            clearTimeout(n.timeoutId),
                            n.doneCb(this._didWork)
                        }
                        this._didWork = !1
                    }
                    );
                else {
                    let n = this.getPendingTasks();
                    this._callbacks = this._callbacks.filter(l=>!l.updateCb || !l.updateCb(n) || (clearTimeout(l.timeoutId),
                    !1)),
                    this._didWork = !0
                }
            }
            getPendingTasks() {
                return this.taskTrackingZone ? this.taskTrackingZone.macroTasks.map(n=>({
                    source: n.source,
                    creationLocation: n.creationLocation,
                    data: n.data
                })) : []
            }
            addCallback(n, l, e) {
                let t = -1;
                l && l > 0 && (t = setTimeout(()=>{
                    this._callbacks = this._callbacks.filter(n=>n.timeoutId !== t),
                    n(this._didWork, this.getPendingTasks())
                }
                , l)),
                this._callbacks.push({
                    doneCb: n,
                    timeoutId: t,
                    updateCb: e
                })
            }
            whenStable(n, l, e) {
                if (e && !this.taskTrackingZone)
                    throw new Error('Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/dist/task-tracking.js" loaded?');
                this.addCallback(n, l, e),
                this._runCallbacksIfReady()
            }
            getPendingRequestCount() {
                return this._pendingCount
            }
            findProviders(n, l, e) {
                return []
            }
        }
        class vr {
            constructor() {
                this._applications = new Map,
                yr.addToWindow(this)
            }
            registerApplication(n, l) {
                this._applications.set(n, l)
            }
            unregisterApplication(n) {
                this._applications.delete(n)
            }
            unregisterAllApplications() {
                this._applications.clear()
            }
            getTestability(n) {
                return this._applications.get(n) || null
            }
            getAllTestabilities() {
                return Array.from(this._applications.values())
            }
            getAllRootElements() {
                return Array.from(this._applications.keys())
            }
            findTestabilityInTree(n, l=!0) {
                return yr.findTestabilityInTree(this, n, l)
            }
        }
        class _r {
            addToWindow(n) {}
            findTestabilityInTree(n, l, e) {
                return null
            }
        }
        let br, yr = new _r, wr = function(n, l, e) {
            return n.get(Xu).createCompiler([l]).compileModuleAsync(e)
        }, kr = function(n) {
            return n instanceof ae
        };
        const Cr = new En("AllowMultipleToken");
        class Sr {
            constructor(n, l) {
                this.name = n,
                this.token = l
            }
        }
        function xr(n, l, e=[]) {
            const t = `Platform: ${l}`
              , u = new En(t);
            return (l=[])=>{
                let r = Ar();
                if (!r || r.injector.get(Cr, !1))
                    if (n)
                        n(e.concat(l).concat({
                            provide: u,
                            useValue: !0
                        }));
                    else {
                        const n = e.concat(l).concat({
                            provide: u,
                            useValue: !0
                        });
                        !function(n) {
                            if (br && !br.destroyed && !br.injector.get(Cr, !1))
                                throw new Error("There can be only one platform. Destroy the previous one to create a new one.");
                            br = n.get(Er);
                            const l = n.get(Vu, null);
                            l && l.forEach(n=>n())
                        }(Ll.create({
                            providers: n,
                            name: t
                        }))
                    }
                return function(n) {
                    const l = Ar();
                    if (!l)
                        throw new Error("No platform exists!");
                    if (!l.injector.get(n, null))
                        throw new Error("A platform with a different configuration has been created. Please destroy it first.");
                    return l
                }(u)
            }
        }
        function Ar() {
            return br && !br.destroyed ? br : null
        }
        class Er {
            constructor(n) {
                this._injector = n,
                this._modules = [],
                this._destroyListeners = [],
                this._destroyed = !1
            }
            bootstrapModuleFactory(n, l) {
                const e = function(n) {
                    let l;
                    return l = "noop" === n ? new gr : ("zone.js" === n ? void 0 : n) || new ar({
                        enableLongStackTrace: ul()
                    }),
                    l
                }(l ? l.ngZone : void 0)
                  , t = [{
                    provide: ar,
                    useValue: e
                }];
                return e.run(()=>{
                    const l = Ll.create({
                        providers: t,
                        parent: this.injector,
                        name: n.moduleType.name
                    })
                      , u = n.create(l)
                      , r = u.injector.get(ll, null);
                    if (!r)
                        throw new Error("No ErrorHandler. Is platform module (BrowserModule) included?");
                    return Wu && Ou(u.injector.get(qu, Ru) || Ru),
                    u.onDestroy(()=>Rr(this._modules, u)),
                    e.runOutsideAngular(()=>e.onError.subscribe({
                        next: n=>{
                            r.handleError(n)
                        }
                    })),
                    function(n, l, e) {
                        try {
                            const t = e();
                            return Xl(t) ? t.catch(e=>{
                                throw l.runOutsideAngular(()=>n.handleError(e)),
                                e
                            }
                            ) : t
                        } catch (t) {
                            throw l.runOutsideAngular(()=>n.handleError(t)),
                            t
                        }
                    }(r, e, ()=>{
                        const n = u.injector.get(ju);
                        return n.runInitializers(),
                        n.donePromise.then(()=>(this._moduleDoBootstrap(u),
                        u))
                    }
                    )
                }
                )
            }
            bootstrapModule(n, l=[]) {
                const e = Tr({}, l);
                return wr(this.injector, e, n).then(n=>this.bootstrapModuleFactory(n, e))
            }
            _moduleDoBootstrap(n) {
                const l = n.injector.get(Ir);
                if (n._bootstrapComponents.length > 0)
                    n._bootstrapComponents.forEach(n=>l.bootstrap(n));
                else {
                    if (!n.instance.ngDoBootstrap)
                        throw new Error(`The module ${_n(n.instance.constructor)} was bootstrapped, but it does not declare "@NgModule.bootstrap" components nor a "ngDoBootstrap" method. ` + "Please define one of these.");
                    n.instance.ngDoBootstrap(l)
                }
                this._modules.push(n)
            }
            onDestroy(n) {
                this._destroyListeners.push(n)
            }
            get injector() {
                return this._injector
            }
            destroy() {
                if (this._destroyed)
                    throw new Error("The platform has already been destroyed!");
                this._modules.slice().forEach(n=>n.destroy()),
                this._destroyListeners.forEach(n=>n()),
                this._destroyed = !0
            }
            get destroyed() {
                return this._destroyed
            }
        }
        function Tr(n, l) {
            return Array.isArray(l) ? l.reduce(Tr, n) : Object.assign({}, n, l)
        }
        let Ir = (()=>{
            class n {
                constructor(n, l, e, t, u, r) {
                    this._zone = n,
                    this._console = l,
                    this._injector = e,
                    this._exceptionHandler = t,
                    this._componentFactoryResolver = u,
                    this._initStatus = r,
                    this._bootstrapListeners = [],
                    this._views = [],
                    this._runningTick = !1,
                    this._enforceNoNewChanges = !1,
                    this._stable = !0,
                    this.componentTypes = [],
                    this.components = [],
                    this._enforceNoNewChanges = ul(),
                    this._zone.onMicrotaskEmpty.subscribe({
                        next: ()=>{
                            this._zone.run(()=>{
                                this.tick()
                            }
                            )
                        }
                    });
                    const i = new w(n=>{
                        this._stable = this._zone.isStable && !this._zone.hasPendingMacrotasks && !this._zone.hasPendingMicrotasks,
                        this._zone.runOutsideAngular(()=>{
                            n.next(this._stable),
                            n.complete()
                        }
                        )
                    }
                    )
                      , s = new w(n=>{
                        let l;
                        this._zone.runOutsideAngular(()=>{
                            l = this._zone.onStable.subscribe(()=>{
                                ar.assertNotInAngularZone(),
                                or(()=>{
                                    this._stable || this._zone.hasPendingMacrotasks || this._zone.hasPendingMicrotasks || (this._stable = !0,
                                    n.next(!0))
                                }
                                )
                            }
                            )
                        }
                        );
                        const e = this._zone.onUnstable.subscribe(()=>{
                            ar.assertInAngularZone(),
                            this._stable && (this._stable = !1,
                            this._zone.runOutsideAngular(()=>{
                                n.next(!1)
                            }
                            ))
                        }
                        );
                        return ()=>{
                            l.unsubscribe(),
                            e.unsubscribe()
                        }
                    }
                    );
                    this.isStable = J(i, s.pipe(n=>X()(function(n, l) {
                        return function(l) {
                            let e;
                            e = "function" == typeof n ? n : function() {
                                return n
                            }
                            ;
                            const t = Object.create(l, tn);
                            return t.source = l,
                            t.subjectFactory = e,
                            t
                        }
                    }(rn)(n))))
                }
                bootstrap(n, l) {
                    if (!this._initStatus.done)
                        throw new Error("Cannot bootstrap as there are still asynchronous initializers running. Bootstrap components in the `ngDoBootstrap` method of the root module.");
                    let e;
                    e = n instanceof te ? n : this._componentFactoryResolver.resolveComponentFactory(n),
                    this.componentTypes.push(e.componentType);
                    const t = kr(e) ? null : this._injector.get(Bn)
                      , u = e.create(Ll.NULL, [], l || e.selector, t);
                    u.onDestroy(()=>{
                        this._unloadComponent(u)
                    }
                    );
                    const r = u.injector.get(mr, null);
                    return r && u.injector.get(vr).registerApplication(u.location.nativeElement, r),
                    this._loadComponent(u),
                    ul() && this._console.log("Angular is running in the development mode. Call enableProdMode() to enable the production mode."),
                    u
                }
                tick() {
                    if (this._runningTick)
                        throw new Error("ApplicationRef.tick is called recursively");
                    const l = n._tickScope();
                    try {
                        this._runningTick = !0;
                        for (let n of this._views)
                            n.detectChanges();
                        if (this._enforceNoNewChanges)
                            for (let n of this._views)
                                n.checkNoChanges()
                    } catch (e) {
                        this._zone.runOutsideAngular(()=>this._exceptionHandler.handleError(e))
                    } finally {
                        this._runningTick = !1,
                        ir(l)
                    }
                }
                attachView(n) {
                    const l = n;
                    this._views.push(l),
                    l.attachToAppRef(this)
                }
                detachView(n) {
                    const l = n;
                    Rr(this._views, l),
                    l.detachFromAppRef()
                }
                _loadComponent(n) {
                    this.attachView(n.hostView),
                    this.tick(),
                    this.components.push(n),
                    this._injector.get(Bu, []).concat(this._bootstrapListeners).forEach(l=>l(n))
                }
                _unloadComponent(n) {
                    this.detachView(n.hostView),
                    Rr(this.components, n)
                }
                ngOnDestroy() {
                    this._views.slice().forEach(n=>n.destroy())
                }
                get viewCount() {
                    return this._views.length
                }
            }
            return n._tickScope = rr("ApplicationRef#tick()"),
            n
        }
        )();
        function Rr(n, l) {
            const e = n.indexOf(l);
            e > -1 && n.splice(e, 1)
        }
        class Pr {
        }
        const Or = "#"
          , Mr = "NgFactory";
        class Dr {
        }
        const Nr = {
            factoryPathPrefix: "",
            factoryPathSuffix: ".ngfactory"
        };
        class Lr {
            constructor(n, l) {
                this._compiler = n,
                this._config = l || Nr
            }
            load(n) {
                return !Wu && this._compiler instanceof Ju ? this.loadFactory(n) : this.loadAndCompile(n)
            }
            loadAndCompile(n) {
                let[l,t] = n.split(Or);
                return void 0 === t && (t = "default"),
                e("zn8P")(l).then(n=>n[t]).then(n=>jr(n, l, t)).then(n=>this._compiler.compileModuleAsync(n))
            }
            loadFactory(n) {
                let[l,t] = n.split(Or)
                  , u = Mr;
                return void 0 === t && (t = "default",
                u = ""),
                e("zn8P")(this._config.factoryPathPrefix + l + this._config.factoryPathSuffix).then(n=>n[t + u]).then(n=>jr(n, l, t))
            }
        }
        function jr(n, l, e) {
            if (!n)
                throw new Error(`Cannot find '${e}' in '${l}'`);
            return n
        }
        class Ur {
            constructor(n, l) {
                this.name = n,
                this.callback = l
            }
        }
        class Hr {
            constructor(n, l, e) {
                this.listeners = [],
                this.parent = null,
                this._debugContext = e,
                this.nativeNode = n,
                l && l instanceof Fr && l.addChild(this)
            }
            get injector() {
                return this._debugContext.injector
            }
            get componentInstance() {
                return this._debugContext.component
            }
            get context() {
                return this._debugContext.context
            }
            get references() {
                return this._debugContext.references
            }
            get providerTokens() {
                return this._debugContext.providerTokens
            }
        }
        class Fr extends Hr {
            constructor(n, l, e) {
                super(n, l, e),
                this.properties = {},
                this.attributes = {},
                this.classes = {},
                this.styles = {},
                this.childNodes = [],
                this.nativeElement = n
            }
            addChild(n) {
                n && (this.childNodes.push(n),
                n.parent = this)
            }
            removeChild(n) {
                const l = this.childNodes.indexOf(n);
                -1 !== l && (n.parent = null,
                this.childNodes.splice(l, 1))
            }
            insertChildrenAfter(n, l) {
                const e = this.childNodes.indexOf(n);
                -1 !== e && (this.childNodes.splice(e + 1, 0, ...l),
                l.forEach(l=>{
                    l.parent && l.parent.removeChild(l),
                    n.parent = this
                }
                ))
            }
            insertBefore(n, l) {
                const e = this.childNodes.indexOf(n);
                -1 === e ? this.addChild(l) : (l.parent && l.parent.removeChild(l),
                l.parent = this,
                this.childNodes.splice(e, 0, l))
            }
            query(n) {
                return this.queryAll(n)[0] || null
            }
            queryAll(n) {
                const l = [];
                return function n(l, e, t) {
                    l.childNodes.forEach(l=>{
                        l instanceof Fr && (e(l) && t.push(l),
                        n(l, e, t))
                    }
                    )
                }(this, n, l),
                l
            }
            queryAllNodes(n) {
                const l = [];
                return function n(l, e, t) {
                    l instanceof Fr && l.childNodes.forEach(l=>{
                        e(l) && t.push(l),
                        l instanceof Fr && n(l, e, t)
                    }
                    )
                }(this, n, l),
                l
            }
            get children() {
                return this.childNodes.filter(n=>n instanceof Fr)
            }
            triggerEventHandler(n, l) {
                this.listeners.forEach(e=>{
                    e.name == n && e.callback(l)
                }
                )
            }
        }
        const Vr = new Map
          , $r = function(n) {
            return Vr.get(n) || null
        };
        function Br(n) {
            Vr.set(n.nativeNode, n)
        }
        const zr = xr(null, "core", [{
            provide: $u,
            useValue: "unknown"
        }, {
            provide: Er,
            deps: [Ll]
        }, {
            provide: vr,
            deps: []
        }, {
            provide: zu,
            deps: []
        }]);
        function qr() {
            return Me
        }
        function Wr() {
            return De
        }
        function Gr(n) {
            return n ? (Wu && Ou(n),
            n) : Ru
        }
        function Kr(n) {
            let l = [];
            return n.onStable.subscribe(()=>{
                for (; l.length; )
                    l.pop()()
            }
            ),
            function(n) {
                l.push(n)
            }
        }
        class Qr {
            constructor(n) {}
        }
        function Zr(n, l, e, t, u, r) {
            n |= 1;
            const {matchedQueries: i, references: s, matchedQueryIds: o} = gt(l);
            return {
                nodeIndex: -1,
                parent: null,
                renderParent: null,
                bindingIndex: -1,
                outputIndex: -1,
                flags: n,
                checkIndex: -1,
                childFlags: 0,
                directChildFlags: 0,
                childMatchedQueries: 0,
                matchedQueries: i,
                matchedQueryIds: o,
                references: s,
                ngContentIndex: e,
                childCount: t,
                bindings: [],
                bindingFlags: 0,
                outputs: [],
                element: {
                    ns: null,
                    name: null,
                    attrs: null,
                    template: r ? bt(r) : null,
                    componentProvider: null,
                    componentView: null,
                    componentRendererType: null,
                    publicProviders: null,
                    allProviders: null,
                    handleEvent: u || Ze
                },
                provider: null,
                text: null,
                query: null,
                ngContent: null
            }
        }
        function Yr(n, l, e, t, u, r, i=[], s, o, a, c, d) {
            a || (a = Ze);
            const {matchedQueries: h, references: p, matchedQueryIds: f} = gt(e);
            let g = null
              , m = null;
            r && ([g,m] = At(r)),
            s = s || [];
            const v = new Array(s.length);
            for (let y = 0; y < s.length; y++) {
                const [n,l,e] = s[y]
                  , [t,u] = At(l);
                let r = void 0
                  , i = void 0;
                switch (15 & n) {
                case 4:
                    i = e;
                    break;
                case 1:
                case 8:
                    r = e
                }
                v[y] = {
                    flags: n,
                    ns: t,
                    name: u,
                    nonMinifiedName: u,
                    securityContext: r,
                    suffix: i
                }
            }
            o = o || [];
            const _ = new Array(o.length);
            for (let y = 0; y < o.length; y++) {
                const [n,l] = o[y];
                _[y] = {
                    type: 0,
                    target: n,
                    eventName: l,
                    propName: null
                }
            }
            const b = (i = i || []).map(([n,l])=>{
                const [e,t] = At(n);
                return [e, t, l]
            }
            );
            return d = function(n) {
                if (n && n.id === Xe) {
                    const l = null != n.encapsulation && n.encapsulation !== Gn.None || n.styles.length || Object.keys(n.data).length;
                    n.id = l ? `c${et++}` : nt
                }
                return n && n.id === nt && (n = null),
                n || null
            }(d),
            c && (l |= 33554432),
            {
                nodeIndex: -1,
                parent: null,
                renderParent: null,
                bindingIndex: -1,
                outputIndex: -1,
                checkIndex: n,
                flags: l |= 1,
                childFlags: 0,
                directChildFlags: 0,
                childMatchedQueries: 0,
                matchedQueries: h,
                matchedQueryIds: f,
                references: p,
                ngContentIndex: t,
                childCount: u,
                bindings: v,
                bindingFlags: Et(v),
                outputs: _,
                element: {
                    ns: g,
                    name: m,
                    attrs: b,
                    template: null,
                    componentProvider: null,
                    componentView: c || null,
                    componentRendererType: d,
                    publicProviders: null,
                    allProviders: null,
                    handleEvent: a || Ze
                },
                provider: null,
                text: null,
                query: null,
                ngContent: null
            }
        }
        function Jr(n, l, e) {
            const t = e.element
              , u = n.root.selectorOrNode
              , r = n.renderer;
            let i;
            if (n.parent || !u) {
                i = t.name ? r.createElement(t.name, t.ns) : r.createComment("");
                const u = vt(n, l, e);
                u && r.appendChild(u, i)
            } else
                i = r.selectRootElement(u, !!t.componentRendererType && t.componentRendererType.encapsulation === Gn.ShadowDom);
            if (t.attrs)
                for (let s = 0; s < t.attrs.length; s++) {
                    const [n,l,e] = t.attrs[s];
                    r.setAttribute(i, l, e, n)
                }
            return i
        }
        function Xr(n, l, e, t) {
            for (let i = 0; i < e.outputs.length; i++) {
                const s = e.outputs[i]
                  , o = ni(n, e.nodeIndex, (r = s.eventName,
                (u = s.target) ? `${u}:${r}` : r));
                let a = s.target
                  , c = n;
                "component" === s.target && (a = null,
                c = l);
                const d = c.renderer.listen(a || t, s.eventName, o);
                n.disposables[e.outputIndex + i] = d
            }
            var u, r
        }
        function ni(n, l, e) {
            return t=>ot(n, l, e, t)
        }
        function li(n, l, e, t) {
            if (!ut(n, l, e, t))
                return !1;
            const u = l.bindings[e]
              , r = qe(n, l.nodeIndex)
              , i = r.renderElement
              , s = u.name;
            switch (15 & u.flags) {
            case 1:
                !function(n, l, e, t, u, r) {
                    const i = l.securityContext;
                    let s = i ? n.root.sanitizer.sanitize(i, r) : r;
                    s = null != s ? s.toString() : null;
                    const o = n.renderer;
                    null != r ? o.setAttribute(e, u, s, t) : o.removeAttribute(e, u, t)
                }(n, u, i, u.ns, s, t);
                break;
            case 2:
                !function(n, l, e, t) {
                    const u = n.renderer;
                    t ? u.addClass(l, e) : u.removeClass(l, e)
                }(n, i, s, t);
                break;
            case 4:
                !function(n, l, e, t, u) {
                    let r = n.root.sanitizer.sanitize(Al.STYLE, u);
                    if (null != r) {
                        r = r.toString();
                        const n = l.suffix;
                        null != n && (r += n)
                    } else
                        r = null;
                    const i = n.renderer;
                    null != r ? i.setStyle(e, t, r) : i.removeStyle(e, t)
                }(n, u, i, s, t);
                break;
            case 8:
                !function(n, l, e, t, u) {
                    const r = l.securityContext;
                    let i = r ? n.root.sanitizer.sanitize(r, u) : u;
                    n.renderer.setProperty(e, t, i)
                }(33554432 & l.flags && 32 & u.flags ? r.componentView : n, u, i, s, t)
            }
            return !0
        }
        function ei(n, l, e) {
            let t = [];
            for (let u in e)
                t.push({
                    propName: u,
                    bindingType: e[u]
                });
            return {
                nodeIndex: -1,
                parent: null,
                renderParent: null,
                bindingIndex: -1,
                outputIndex: -1,
                checkIndex: -1,
                flags: n,
                childFlags: 0,
                directChildFlags: 0,
                childMatchedQueries: 0,
                ngContentIndex: -1,
                matchedQueries: {},
                matchedQueryIds: 0,
                references: {},
                childCount: 0,
                bindings: [],
                bindingFlags: 0,
                outputs: [],
                element: null,
                provider: null,
                text: null,
                query: {
                    id: l,
                    filterId: ft(l),
                    bindings: t
                },
                ngContent: null
            }
        }
        function ti(n) {
            const l = n.def.nodeMatchedQueries;
            for (; n.parent && pt(n); ) {
                let e = n.parentNodeDef;
                n = n.parent;
                const t = e.nodeIndex + e.childCount;
                for (let u = 0; u <= t; u++) {
                    const t = n.def.nodes[u];
                    67108864 & t.flags && 536870912 & t.flags && (t.query.filterId & l) === t.query.filterId && Ke(n, u).setDirty(),
                    !(1 & t.flags && u + t.childCount < e.nodeIndex) && 67108864 & t.childFlags && 536870912 & t.childFlags || (u += t.childCount)
                }
            }
            if (134217728 & n.def.nodeFlags)
                for (let e = 0; e < n.def.nodes.length; e++) {
                    const l = n.def.nodes[e];
                    134217728 & l.flags && 536870912 & l.flags && Ke(n, e).setDirty(),
                    e += l.childCount
                }
        }
        function ui(n, l) {
            const e = Ke(n, l.nodeIndex);
            if (!e.dirty)
                return;
            let t, u = void 0;
            if (67108864 & l.flags) {
                const e = l.parent.parent;
                u = ri(n, e.nodeIndex, e.nodeIndex + e.childCount, l.query, []),
                t = We(n, l.parent.nodeIndex).instance
            } else
                134217728 & l.flags && (u = ri(n, 0, n.def.nodes.length - 1, l.query, []),
                t = n.component);
            e.reset(u);
            const r = l.query.bindings;
            let i = !1;
            for (let s = 0; s < r.length; s++) {
                const n = r[s];
                let l;
                switch (n.bindingType) {
                case 0:
                    l = e.first;
                    break;
                case 1:
                    l = e,
                    i = !0
                }
                t[n.propName] = l
            }
            i && e.notifyOnChanges()
        }
        function ri(n, l, e, t, u) {
            for (let r = l; r <= e; r++) {
                const l = n.def.nodes[r]
                  , e = l.matchedQueries[t.id];
                if (null != e && u.push(ii(n, l, e)),
                1 & l.flags && l.element.template && (l.element.template.nodeMatchedQueries & t.filterId) === t.filterId) {
                    const e = qe(n, r);
                    if ((l.childMatchedQueries & t.filterId) === t.filterId && (ri(n, r + 1, r + l.childCount, t, u),
                    r += l.childCount),
                    16777216 & l.flags) {
                        const n = e.viewContainer._embeddedViews;
                        for (let l = 0; l < n.length; l++) {
                            const r = n[l]
                              , i = at(r);
                            i && i === e && ri(r, 0, r.def.nodes.length - 1, t, u)
                        }
                    }
                    const i = e.template._projectedViews;
                    if (i)
                        for (let n = 0; n < i.length; n++) {
                            const l = i[n];
                            ri(l, 0, l.def.nodes.length - 1, t, u)
                        }
                }
                (l.childMatchedQueries & t.filterId) !== t.filterId && (r += l.childCount)
            }
            return u
        }
        function ii(n, l, e) {
            if (null != e)
                switch (e) {
                case 1:
                    return qe(n, l.nodeIndex).renderElement;
                case 0:
                    return new de(qe(n, l.nodeIndex).renderElement);
                case 2:
                    return qe(n, l.nodeIndex).template;
                case 3:
                    return qe(n, l.nodeIndex).viewContainer;
                case 4:
                    return We(n, l.nodeIndex).instance
                }
        }
        function si(n, l) {
            return {
                nodeIndex: -1,
                parent: null,
                renderParent: null,
                bindingIndex: -1,
                outputIndex: -1,
                checkIndex: -1,
                flags: 8,
                childFlags: 0,
                directChildFlags: 0,
                childMatchedQueries: 0,
                matchedQueries: {},
                matchedQueryIds: 0,
                references: {},
                ngContentIndex: n,
                childCount: 0,
                bindings: [],
                bindingFlags: 0,
                outputs: [],
                element: null,
                provider: null,
                text: null,
                query: null,
                ngContent: {
                    index: l
                }
            }
        }
        function oi(n, l, e) {
            const t = vt(n, l, e);
            t && kt(n, e.ngContent.index, 1, t, null, void 0)
        }
        function ai(n, l) {
            return function(n, l, e) {
                const t = new Array(e.length);
                for (let u = 0; u < e.length; u++) {
                    const n = e[u];
                    t[u] = {
                        flags: 8,
                        name: n,
                        ns: null,
                        nonMinifiedName: n,
                        securityContext: null,
                        suffix: null
                    }
                }
                return {
                    nodeIndex: -1,
                    parent: null,
                    renderParent: null,
                    bindingIndex: -1,
                    outputIndex: -1,
                    checkIndex: l,
                    flags: 32,
                    childFlags: 0,
                    directChildFlags: 0,
                    childMatchedQueries: 0,
                    matchedQueries: {},
                    matchedQueryIds: 0,
                    references: {},
                    ngContentIndex: -1,
                    childCount: 0,
                    bindings: t,
                    bindingFlags: Et(t),
                    outputs: [],
                    element: null,
                    provider: null,
                    text: null,
                    query: null,
                    ngContent: null
                }
            }(0, n, new Array(l))
        }
        function ci(n, l, e) {
            const t = new Array(e.length - 1);
            for (let u = 1; u < e.length; u++)
                t[u - 1] = {
                    flags: 8,
                    name: null,
                    ns: null,
                    nonMinifiedName: null,
                    securityContext: null,
                    suffix: e[u]
                };
            return {
                nodeIndex: -1,
                parent: null,
                renderParent: null,
                bindingIndex: -1,
                outputIndex: -1,
                checkIndex: n,
                flags: 2,
                childFlags: 0,
                directChildFlags: 0,
                childMatchedQueries: 0,
                matchedQueries: {},
                matchedQueryIds: 0,
                references: {},
                ngContentIndex: l,
                childCount: 0,
                bindings: t,
                bindingFlags: 8,
                outputs: [],
                element: null,
                provider: null,
                text: {
                    prefix: e[0]
                },
                query: null,
                ngContent: null
            }
        }
        function di(n, l, e) {
            let t;
            const u = n.renderer;
            t = u.createText(e.text.prefix);
            const r = vt(n, l, e);
            return r && u.appendChild(r, t),
            {
                renderText: t
            }
        }
        function hi(n, l) {
            return (null != n ? n.toString() : "") + l.suffix
        }
        function pi(n, l, e, t) {
            let u = 0
              , r = 0
              , i = 0
              , s = 0
              , o = 0
              , a = null
              , c = null
              , d = !1
              , h = !1
              , p = null;
            for (let f = 0; f < l.length; f++) {
                const n = l[f];
                if (n.nodeIndex = f,
                n.parent = a,
                n.bindingIndex = u,
                n.outputIndex = r,
                n.renderParent = c,
                i |= n.flags,
                o |= n.matchedQueryIds,
                n.element) {
                    const l = n.element;
                    l.publicProviders = a ? a.element.publicProviders : Object.create(null),
                    l.allProviders = l.publicProviders,
                    d = !1,
                    h = !1,
                    n.element.template && (o |= n.element.template.nodeMatchedQueries)
                }
                if (gi(a, n, l.length),
                u += n.bindings.length,
                r += n.outputs.length,
                !c && 3 & n.flags && (p = n),
                20224 & n.flags) {
                    d || (d = !0,
                    a.element.publicProviders = Object.create(a.element.publicProviders),
                    a.element.allProviders = a.element.publicProviders);
                    const l = 0 != (32768 & n.flags);
                    0 == (8192 & n.flags) || l ? a.element.publicProviders[Je(n.provider.token)] = n : (h || (h = !0,
                    a.element.allProviders = Object.create(a.element.publicProviders)),
                    a.element.allProviders[Je(n.provider.token)] = n),
                    l && (a.element.componentProvider = n)
                }
                if (a ? (a.childFlags |= n.flags,
                a.directChildFlags |= n.flags,
                a.childMatchedQueries |= n.matchedQueryIds,
                n.element && n.element.template && (a.childMatchedQueries |= n.element.template.nodeMatchedQueries)) : s |= n.flags,
                n.childCount > 0)
                    a = n,
                    fi(n) || (c = n);
                else
                    for (; a && f === a.nodeIndex + a.childCount; ) {
                        const n = a.parent;
                        n && (n.childFlags |= a.childFlags,
                        n.childMatchedQueries |= a.childMatchedQueries),
                        a = n,
                        c = a && fi(a) ? a.renderParent : a
                    }
            }
            return {
                factory: null,
                nodeFlags: i,
                rootNodeFlags: s,
                nodeMatchedQueries: o,
                flags: n,
                nodes: l,
                updateDirectives: e || Ze,
                updateRenderer: t || Ze,
                handleEvent: (n,e,t,u)=>l[e].element.handleEvent(n, t, u),
                bindingCount: u,
                outputCount: r,
                lastRenderRootNode: p
            }
        }
        function fi(n) {
            return 0 != (1 & n.flags) && null === n.element.name
        }
        function gi(n, l, e) {
            const t = l.element && l.element.template;
            if (t) {
                if (!t.lastRenderRootNode)
                    throw new Error("Illegal State: Embedded templates without nodes are not allowed!");
                if (t.lastRenderRootNode && 16777216 & t.lastRenderRootNode.flags)
                    throw new Error(`Illegal State: Last root node of a template can't have embedded views, at index ${l.nodeIndex}!`)
            }
            if (20224 & l.flags && 0 == (1 & (n ? n.flags : 0)))
                throw new Error(`Illegal State: StaticProvider/Directive nodes need to be children of elements or anchors, at index ${l.nodeIndex}!`);
            if (l.query) {
                if (67108864 & l.flags && (!n || 0 == (16384 & n.flags)))
                    throw new Error(`Illegal State: Content Query nodes need to be children of directives, at index ${l.nodeIndex}!`);
                if (134217728 & l.flags && n)
                    throw new Error(`Illegal State: View Query nodes have to be top level nodes, at index ${l.nodeIndex}!`)
            }
            if (l.childCount) {
                const t = n ? n.nodeIndex + n.childCount : e - 1;
                if (l.nodeIndex <= t && l.nodeIndex + l.childCount > t)
                    throw new Error(`Illegal State: childCount of node leads outside of parent, at index ${l.nodeIndex}!`)
            }
        }
        function mi(n, l, e, t) {
            const u = bi(n.root, n.renderer, n, l, e);
            return yi(u, n.component, t),
            wi(u),
            u
        }
        function vi(n, l, e) {
            const t = bi(n, n.renderer, null, null, l);
            return yi(t, e, e),
            wi(t),
            t
        }
        function _i(n, l, e, t) {
            const u = l.element.componentRendererType;
            let r;
            return r = u ? n.root.rendererFactory.createRenderer(t, u) : n.root.renderer,
            bi(n.root, r, n, l.element.componentProvider, e)
        }
        function bi(n, l, e, t, u) {
            const r = new Array(u.nodes.length)
              , i = u.outputCount ? new Array(u.outputCount) : null;
            return {
                def: u,
                parent: e,
                viewContainerParent: null,
                parentNodeDef: t,
                context: null,
                component: null,
                nodes: r,
                state: 13,
                root: n,
                renderer: l,
                oldValues: new Array(u.bindingCount),
                disposables: i,
                initIndex: -1
            }
        }
        function yi(n, l, e) {
            n.component = l,
            n.context = e
        }
        function wi(n) {
            let l;
            ht(n) && (l = qe(n.parent, n.parentNodeDef.parent.nodeIndex).renderElement);
            const e = n.def
              , t = n.nodes;
            for (let u = 0; u < e.nodes.length; u++) {
                const r = e.nodes[u];
                let i;
                switch (Qe.setCurrentNode(n, u),
                201347067 & r.flags) {
                case 1:
                    const e = Jr(n, l, r);
                    let s = void 0;
                    if (33554432 & r.flags) {
                        const l = bt(r.element.componentView);
                        s = Qe.createComponentView(n, r, l, e)
                    }
                    Xr(n, s, r, e),
                    i = {
                        renderElement: e,
                        componentView: s,
                        viewContainer: null,
                        template: r.element.template ? Wt(n, r) : void 0
                    },
                    16777216 & r.flags && (i.viewContainer = $t(n, r, i));
                    break;
                case 2:
                    i = di(n, l, r);
                    break;
                case 512:
                case 1024:
                case 2048:
                case 256:
                    i = t[u],
                    i || 4096 & r.flags || (i = {
                        instance: hu(n, r)
                    });
                    break;
                case 16:
                    i = {
                        instance: pu(n, r)
                    };
                    break;
                case 16384:
                    i = t[u],
                    i || (i = {
                        instance: fu(n, r)
                    }),
                    32768 & r.flags && yi(qe(n, r.parent.nodeIndex).componentView, i.instance, i.instance);
                    break;
                case 32:
                case 64:
                case 128:
                    i = {
                        value: void 0
                    };
                    break;
                case 67108864:
                case 134217728:
                    i = new Nu;
                    break;
                case 8:
                    oi(n, l, r),
                    i = void 0
                }
                t[u] = i
            }
            Ri(n, Ii.CreateViewNodes),
            Di(n, 201326592, 268435456, 0)
        }
        function ki(n) {
            xi(n),
            Qe.updateDirectives(n, 1),
            Pi(n, Ii.CheckNoChanges),
            Qe.updateRenderer(n, 1),
            Ri(n, Ii.CheckNoChanges),
            n.state &= -97
        }
        function Ci(n) {
            1 & n.state ? (n.state &= -2,
            n.state |= 2) : n.state &= -3,
            $e(n, 0, 256),
            xi(n),
            Qe.updateDirectives(n, 0),
            Pi(n, Ii.CheckAndUpdate),
            Di(n, 67108864, 536870912, 0);
            let l = $e(n, 256, 512);
            ku(n, 2097152 | (l ? 1048576 : 0)),
            Qe.updateRenderer(n, 0),
            Ri(n, Ii.CheckAndUpdate),
            Di(n, 134217728, 536870912, 0),
            l = $e(n, 512, 768),
            ku(n, 8388608 | (l ? 4194304 : 0)),
            2 & n.def.flags && (n.state &= -9),
            n.state &= -97,
            $e(n, 768, 1024)
        }
        function Si(n, l, e, t, u, r, i, s, o, a, c, d, h) {
            return 0 === e ? function(n, l, e, t, u, r, i, s, o, a, c, d) {
                switch (201347067 & l.flags) {
                case 1:
                    return function(n, l, e, t, u, r, i, s, o, a, c, d) {
                        const h = l.bindings.length;
                        let p = !1;
                        return h > 0 && li(n, l, 0, e) && (p = !0),
                        h > 1 && li(n, l, 1, t) && (p = !0),
                        h > 2 && li(n, l, 2, u) && (p = !0),
                        h > 3 && li(n, l, 3, r) && (p = !0),
                        h > 4 && li(n, l, 4, i) && (p = !0),
                        h > 5 && li(n, l, 5, s) && (p = !0),
                        h > 6 && li(n, l, 6, o) && (p = !0),
                        h > 7 && li(n, l, 7, a) && (p = !0),
                        h > 8 && li(n, l, 8, c) && (p = !0),
                        h > 9 && li(n, l, 9, d) && (p = !0),
                        p
                    }(n, l, e, t, u, r, i, s, o, a, c, d);
                case 2:
                    return function(n, l, e, t, u, r, i, s, o, a, c, d) {
                        let h = !1;
                        const p = l.bindings
                          , f = p.length;
                        if (f > 0 && ut(n, l, 0, e) && (h = !0),
                        f > 1 && ut(n, l, 1, t) && (h = !0),
                        f > 2 && ut(n, l, 2, u) && (h = !0),
                        f > 3 && ut(n, l, 3, r) && (h = !0),
                        f > 4 && ut(n, l, 4, i) && (h = !0),
                        f > 5 && ut(n, l, 5, s) && (h = !0),
                        f > 6 && ut(n, l, 6, o) && (h = !0),
                        f > 7 && ut(n, l, 7, a) && (h = !0),
                        f > 8 && ut(n, l, 8, c) && (h = !0),
                        f > 9 && ut(n, l, 9, d) && (h = !0),
                        h) {
                            let h = l.text.prefix;
                            f > 0 && (h += hi(e, p[0])),
                            f > 1 && (h += hi(t, p[1])),
                            f > 2 && (h += hi(u, p[2])),
                            f > 3 && (h += hi(r, p[3])),
                            f > 4 && (h += hi(i, p[4])),
                            f > 5 && (h += hi(s, p[5])),
                            f > 6 && (h += hi(o, p[6])),
                            f > 7 && (h += hi(a, p[7])),
                            f > 8 && (h += hi(c, p[8])),
                            f > 9 && (h += hi(d, p[9]));
                            const g = ze(n, l.nodeIndex).renderText;
                            n.renderer.setValue(g, h)
                        }
                        return h
                    }(n, l, e, t, u, r, i, s, o, a, c, d);
                case 16384:
                    return function(n, l, e, t, u, r, i, s, o, a, c, d) {
                        const h = We(n, l.nodeIndex)
                          , p = h.instance;
                        let f = !1
                          , g = void 0;
                        const m = l.bindings.length;
                        return m > 0 && tt(n, l, 0, e) && (f = !0,
                        g = wu(n, h, l, 0, e, g)),
                        m > 1 && tt(n, l, 1, t) && (f = !0,
                        g = wu(n, h, l, 1, t, g)),
                        m > 2 && tt(n, l, 2, u) && (f = !0,
                        g = wu(n, h, l, 2, u, g)),
                        m > 3 && tt(n, l, 3, r) && (f = !0,
                        g = wu(n, h, l, 3, r, g)),
                        m > 4 && tt(n, l, 4, i) && (f = !0,
                        g = wu(n, h, l, 4, i, g)),
                        m > 5 && tt(n, l, 5, s) && (f = !0,
                        g = wu(n, h, l, 5, s, g)),
                        m > 6 && tt(n, l, 6, o) && (f = !0,
                        g = wu(n, h, l, 6, o, g)),
                        m > 7 && tt(n, l, 7, a) && (f = !0,
                        g = wu(n, h, l, 7, a, g)),
                        m > 8 && tt(n, l, 8, c) && (f = !0,
                        g = wu(n, h, l, 8, c, g)),
                        m > 9 && tt(n, l, 9, d) && (f = !0,
                        g = wu(n, h, l, 9, d, g)),
                        g && p.ngOnChanges(g),
                        65536 & l.flags && Be(n, 256, l.nodeIndex) && p.ngOnInit(),
                        262144 & l.flags && p.ngDoCheck(),
                        f
                    }(n, l, e, t, u, r, i, s, o, a, c, d);
                case 32:
                case 64:
                case 128:
                    return function(n, l, e, t, u, r, i, s, o, a, c, d) {
                        const h = l.bindings;
                        let p = !1;
                        const f = h.length;
                        if (f > 0 && ut(n, l, 0, e) && (p = !0),
                        f > 1 && ut(n, l, 1, t) && (p = !0),
                        f > 2 && ut(n, l, 2, u) && (p = !0),
                        f > 3 && ut(n, l, 3, r) && (p = !0),
                        f > 4 && ut(n, l, 4, i) && (p = !0),
                        f > 5 && ut(n, l, 5, s) && (p = !0),
                        f > 6 && ut(n, l, 6, o) && (p = !0),
                        f > 7 && ut(n, l, 7, a) && (p = !0),
                        f > 8 && ut(n, l, 8, c) && (p = !0),
                        f > 9 && ut(n, l, 9, d) && (p = !0),
                        p) {
                            const p = Ge(n, l.nodeIndex);
                            let g;
                            switch (201347067 & l.flags) {
                            case 32:
                                g = new Array(h.length),
                                f > 0 && (g[0] = e),
                                f > 1 && (g[1] = t),
                                f > 2 && (g[2] = u),
                                f > 3 && (g[3] = r),
                                f > 4 && (g[4] = i),
                                f > 5 && (g[5] = s),
                                f > 6 && (g[6] = o),
                                f > 7 && (g[7] = a),
                                f > 8 && (g[8] = c),
                                f > 9 && (g[9] = d);
                                break;
                            case 64:
                                g = {},
                                f > 0 && (g[h[0].name] = e),
                                f > 1 && (g[h[1].name] = t),
                                f > 2 && (g[h[2].name] = u),
                                f > 3 && (g[h[3].name] = r),
                                f > 4 && (g[h[4].name] = i),
                                f > 5 && (g[h[5].name] = s),
                                f > 6 && (g[h[6].name] = o),
                                f > 7 && (g[h[7].name] = a),
                                f > 8 && (g[h[8].name] = c),
                                f > 9 && (g[h[9].name] = d);
                                break;
                            case 128:
                                const n = e;
                                switch (f) {
                                case 1:
                                    g = n.transform(e);
                                    break;
                                case 2:
                                    g = n.transform(t);
                                    break;
                                case 3:
                                    g = n.transform(t, u);
                                    break;
                                case 4:
                                    g = n.transform(t, u, r);
                                    break;
                                case 5:
                                    g = n.transform(t, u, r, i);
                                    break;
                                case 6:
                                    g = n.transform(t, u, r, i, s);
                                    break;
                                case 7:
                                    g = n.transform(t, u, r, i, s, o);
                                    break;
                                case 8:
                                    g = n.transform(t, u, r, i, s, o, a);
                                    break;
                                case 9:
                                    g = n.transform(t, u, r, i, s, o, a, c);
                                    break;
                                case 10:
                                    g = n.transform(t, u, r, i, s, o, a, c, d)
                                }
                            }
                            p.value = g
                        }
                        return p
                    }(n, l, e, t, u, r, i, s, o, a, c, d);
                default:
                    throw "unreachable"
                }
            }(n, l, t, u, r, i, s, o, a, c, d, h) : function(n, l, e) {
                switch (201347067 & l.flags) {
                case 1:
                    return function(n, l, e) {
                        let t = !1;
                        for (let u = 0; u < e.length; u++)
                            li(n, l, u, e[u]) && (t = !0);
                        return t
                    }(n, l, e);
                case 2:
                    return function(n, l, e) {
                        const t = l.bindings;
                        let u = !1;
                        for (let r = 0; r < e.length; r++)
                            ut(n, l, r, e[r]) && (u = !0);
                        if (u) {
                            let u = "";
                            for (let n = 0; n < e.length; n++)
                                u += hi(e[n], t[n]);
                            u = l.text.prefix + u;
                            const r = ze(n, l.nodeIndex).renderText;
                            n.renderer.setValue(r, u)
                        }
                        return u
                    }(n, l, e);
                case 16384:
                    return function(n, l, e) {
                        const t = We(n, l.nodeIndex)
                          , u = t.instance;
                        let r = !1
                          , i = void 0;
                        for (let s = 0; s < e.length; s++)
                            tt(n, l, s, e[s]) && (r = !0,
                            i = wu(n, t, l, s, e[s], i));
                        return i && u.ngOnChanges(i),
                        65536 & l.flags && Be(n, 256, l.nodeIndex) && u.ngOnInit(),
                        262144 & l.flags && u.ngDoCheck(),
                        r
                    }(n, l, e);
                case 32:
                case 64:
                case 128:
                    return function(n, l, e) {
                        const t = l.bindings;
                        let u = !1;
                        for (let r = 0; r < e.length; r++)
                            ut(n, l, r, e[r]) && (u = !0);
                        if (u) {
                            const u = Ge(n, l.nodeIndex);
                            let r;
                            switch (201347067 & l.flags) {
                            case 32:
                                r = e;
                                break;
                            case 64:
                                r = {};
                                for (let u = 0; u < e.length; u++)
                                    r[t[u].name] = e[u];
                                break;
                            case 128:
                                const n = e[0]
                                  , l = e.slice(1);
                                r = n.transform(...l)
                            }
                            u.value = r
                        }
                        return u
                    }(n, l, e);
                default:
                    throw "unreachable"
                }
            }(n, l, t)
        }
        function xi(n) {
            const l = n.def;
            if (4 & l.nodeFlags)
                for (let e = 0; e < l.nodes.length; e++) {
                    const t = l.nodes[e];
                    if (4 & t.flags) {
                        const l = qe(n, e).template._projectedViews;
                        if (l)
                            for (let e = 0; e < l.length; e++) {
                                const t = l[e];
                                t.state |= 32,
                                st(t, n)
                            }
                    } else
                        0 == (4 & t.childFlags) && (e += t.childCount)
                }
        }
        function Ai(n, l, e, t, u, r, i, s, o, a, c, d, h) {
            return 0 === e ? function(n, l, e, t, u, r, i, s, o, a, c, d) {
                const h = l.bindings.length;
                h > 0 && rt(n, l, 0, e),
                h > 1 && rt(n, l, 1, t),
                h > 2 && rt(n, l, 2, u),
                h > 3 && rt(n, l, 3, r),
                h > 4 && rt(n, l, 4, i),
                h > 5 && rt(n, l, 5, s),
                h > 6 && rt(n, l, 6, o),
                h > 7 && rt(n, l, 7, a),
                h > 8 && rt(n, l, 8, c),
                h > 9 && rt(n, l, 9, d)
            }(n, l, t, u, r, i, s, o, a, c, d, h) : function(n, l, e) {
                for (let t = 0; t < e.length; t++)
                    rt(n, l, t, e[t])
            }(n, l, t),
            !1
        }
        function Ei(n, l) {
            if (Ke(n, l.nodeIndex).dirty)
                throw He(Qe.createDebugContext(n, l.nodeIndex), `Query ${l.query.id} not dirty`, `Query ${l.query.id} dirty`, 0 != (1 & n.state))
        }
        function Ti(n) {
            if (!(128 & n.state)) {
                if (Pi(n, Ii.Destroy),
                Ri(n, Ii.Destroy),
                ku(n, 131072),
                n.disposables)
                    for (let l = 0; l < n.disposables.length; l++)
                        n.disposables[l]();
                !function(n) {
                    if (!(16 & n.state))
                        return;
                    const l = at(n);
                    if (l) {
                        const e = l.template._projectedViews;
                        e && (Wn(e, e.indexOf(n)),
                        Qe.dirtyParentQueries(n))
                    }
                }(n),
                n.renderer.destroyNode && function(n) {
                    const l = n.def.nodes.length;
                    for (let e = 0; e < l; e++) {
                        const l = n.def.nodes[e];
                        1 & l.flags ? n.renderer.destroyNode(qe(n, e).renderElement) : 2 & l.flags ? n.renderer.destroyNode(ze(n, e).renderText) : (67108864 & l.flags || 134217728 & l.flags) && Ke(n, e).destroy()
                    }
                }(n),
                ht(n) && n.renderer.destroy(),
                n.state |= 128
            }
        }
        const Ii = function() {
            var n = {
                CreateViewNodes: 0,
                CheckNoChanges: 1,
                CheckNoChangesProjectedViews: 2,
                CheckAndUpdate: 3,
                CheckAndUpdateProjectedViews: 4,
                Destroy: 5
            };
            return n[n.CreateViewNodes] = "CreateViewNodes",
            n[n.CheckNoChanges] = "CheckNoChanges",
            n[n.CheckNoChangesProjectedViews] = "CheckNoChangesProjectedViews",
            n[n.CheckAndUpdate] = "CheckAndUpdate",
            n[n.CheckAndUpdateProjectedViews] = "CheckAndUpdateProjectedViews",
            n[n.Destroy] = "Destroy",
            n
        }();
        function Ri(n, l) {
            const e = n.def;
            if (33554432 & e.nodeFlags)
                for (let t = 0; t < e.nodes.length; t++) {
                    const u = e.nodes[t];
                    33554432 & u.flags ? Oi(qe(n, t).componentView, l) : 0 == (33554432 & u.childFlags) && (t += u.childCount)
                }
        }
        function Pi(n, l) {
            const e = n.def;
            if (16777216 & e.nodeFlags)
                for (let t = 0; t < e.nodes.length; t++) {
                    const u = e.nodes[t];
                    if (16777216 & u.flags) {
                        const e = qe(n, t).viewContainer._embeddedViews;
                        for (let n = 0; n < e.length; n++)
                            Oi(e[n], l)
                    } else
                        0 == (16777216 & u.childFlags) && (t += u.childCount)
                }
        }
        function Oi(n, l) {
            const e = n.state;
            switch (l) {
            case Ii.CheckNoChanges:
                0 == (128 & e) && (12 == (12 & e) ? ki(n) : 64 & e && Mi(n, Ii.CheckNoChangesProjectedViews));
                break;
            case Ii.CheckNoChangesProjectedViews:
                0 == (128 & e) && (32 & e ? ki(n) : 64 & e && Mi(n, l));
                break;
            case Ii.CheckAndUpdate:
                0 == (128 & e) && (12 == (12 & e) ? Ci(n) : 64 & e && Mi(n, Ii.CheckAndUpdateProjectedViews));
                break;
            case Ii.CheckAndUpdateProjectedViews:
                0 == (128 & e) && (32 & e ? Ci(n) : 64 & e && Mi(n, l));
                break;
            case Ii.Destroy:
                Ti(n);
                break;
            case Ii.CreateViewNodes:
                wi(n)
            }
        }
        function Mi(n, l) {
            Pi(n, l),
            Ri(n, l)
        }
        function Di(n, l, e, t) {
            if (!(n.def.nodeFlags & l && n.def.nodeFlags & e))
                return;
            const u = n.def.nodes.length;
            for (let r = 0; r < u; r++) {
                const u = n.def.nodes[r];
                if (u.flags & l && u.flags & e)
                    switch (Qe.setCurrentNode(n, u.nodeIndex),
                    t) {
                    case 0:
                        ui(n, u);
                        break;
                    case 1:
                        Ei(n, u)
                    }
                u.childFlags & l && u.childFlags & e || (r += u.childCount)
            }
        }
        let Ni = !1;
        function Li(n, l, e, t, u, r) {
            const i = u.injector.get(fe);
            return vi(Ui(n, u, i, l, e), t, r)
        }
        function ji(n, l, e, t, u, r) {
            const i = u.injector.get(fe)
              , s = Ui(n, u, new ms(i), l, e)
              , o = Ki(t);
            return fs(ns.create, vi, null, [s, o, r])
        }
        function Ui(n, l, e, t, u) {
            const r = l.injector.get(El)
              , i = l.injector.get(ll)
              , s = e.createRenderer(null, null);
            return {
                ngModule: l,
                injector: n,
                projectableNodes: t,
                selectorOrNode: u,
                sanitizer: r,
                rendererFactory: e,
                renderer: s,
                errorHandler: i
            }
        }
        function Hi(n, l, e, t) {
            const u = Ki(e);
            return fs(ns.create, mi, null, [n, l, u, t])
        }
        function Fi(n, l, e, t) {
            return e = zi.get(l.element.componentProvider.provider.token) || Ki(e),
            fs(ns.create, _i, null, [n, l, e, t])
        }
        function Vi(n, l, e, t) {
            return Xt(n, l, e, function(n) {
                const {hasOverrides: l, hasDeprecatedOverrides: e} = function(n) {
                    let l = !1
                      , e = !1;
                    return 0 === $i.size ? {
                        hasOverrides: l,
                        hasDeprecatedOverrides: e
                    } : (n.providers.forEach(n=>{
                        const t = $i.get(n.token);
                        3840 & n.flags && t && (l = !0,
                        e = e || t.deprecatedBehavior)
                    }
                    ),
                    n.modules.forEach(n=>{
                        Bi.forEach((t,u)=>{
                            mn(u).providedIn === n && (l = !0,
                            e = e || t.deprecatedBehavior)
                        }
                        )
                    }
                    ),
                    {
                        hasOverrides: l,
                        hasDeprecatedOverrides: e
                    })
                }(n);
                return l ? (function(n) {
                    for (let l = 0; l < n.providers.length; l++) {
                        const t = n.providers[l];
                        e && (t.flags |= 4096);
                        const u = $i.get(t.token);
                        u && (t.flags = -3841 & t.flags | u.flags,
                        t.deps = mt(u.deps),
                        t.value = u.value)
                    }
                    if (Bi.size > 0) {
                        let l = new Set(n.modules);
                        Bi.forEach((t,u)=>{
                            if (l.has(mn(u).providedIn)) {
                                let l = {
                                    token: u,
                                    flags: t.flags | (e ? 4096 : 0),
                                    deps: mt(t.deps),
                                    value: t.value,
                                    index: n.providers.length
                                };
                                n.providers.push(l),
                                n.providersByKey[Je(u)] = l
                            }
                        }
                        )
                    }
                }(n = n.factory(()=>Ze)),
                n) : n
            }(t))
        }
        const $i = new Map
          , Bi = new Map
          , zi = new Map;
        function qi(n) {
            let l;
            $i.set(n.token, n),
            "function" == typeof n.token && (l = mn(n.token)) && "function" == typeof l.providedIn && Bi.set(n.token, n)
        }
        function Wi(n, l) {
            const e = bt(l.viewDefFactory)
              , t = bt(e.nodes[0].element.componentView);
            zi.set(n, t)
        }
        function Gi() {
            $i.clear(),
            Bi.clear(),
            zi.clear()
        }
        function Ki(n) {
            if (0 === $i.size)
                return n;
            const l = function(n) {
                const l = [];
                let e = null;
                for (let t = 0; t < n.nodes.length; t++) {
                    const u = n.nodes[t];
                    1 & u.flags && (e = u),
                    e && 3840 & u.flags && $i.has(u.provider.token) && (l.push(e.nodeIndex),
                    e = null)
                }
                return l
            }(n);
            if (0 === l.length)
                return n;
            n = n.factory(()=>Ze);
            for (let t = 0; t < l.length; t++)
                e(n, l[t]);
            return n;
            function e(n, l) {
                for (let e = l + 1; e < n.nodes.length; e++) {
                    const l = n.nodes[e];
                    if (1 & l.flags)
                        return;
                    if (3840 & l.flags) {
                        const n = l.provider
                          , e = $i.get(n.token);
                        e && (l.flags = -3841 & l.flags | e.flags,
                        n.deps = mt(e.deps),
                        n.value = e.value)
                    }
                }
            }
        }
        function Qi(n, l, e, t, u, r, i, s, o, a, c, d, h) {
            const p = n.def.nodes[l];
            return Si(n, p, e, t, u, r, i, s, o, a, c, d, h),
            224 & p.flags ? Ge(n, l).value : void 0
        }
        function Zi(n, l, e, t, u, r, i, s, o, a, c, d, h) {
            const p = n.def.nodes[l];
            return Ai(n, p, e, t, u, r, i, s, o, a, c, d, h),
            224 & p.flags ? Ge(n, l).value : void 0
        }
        function Yi(n) {
            return fs(ns.detectChanges, Ci, null, [n])
        }
        function Ji(n) {
            return fs(ns.checkNoChanges, ki, null, [n])
        }
        function Xi(n) {
            return fs(ns.destroy, Ti, null, [n])
        }
        const ns = function() {
            var n = {
                create: 0,
                detectChanges: 1,
                checkNoChanges: 2,
                destroy: 3,
                handleEvent: 4
            };
            return n[n.create] = "create",
            n[n.detectChanges] = "detectChanges",
            n[n.checkNoChanges] = "checkNoChanges",
            n[n.destroy] = "destroy",
            n[n.handleEvent] = "handleEvent",
            n
        }();
        let ls, es, ts;
        function us(n, l) {
            es = n,
            ts = l
        }
        function rs(n, l, e, t) {
            return us(n, l),
            fs(ns.handleEvent, n.def.handleEvent, null, [n, l, e, t])
        }
        function is(n, l) {
            if (128 & n.state)
                throw Ve(ns[ls]);
            return us(n, cs(n, 0)),
            n.def.updateDirectives((function(n, e, t, ...u) {
                const r = n.def.nodes[e];
                return 0 === l ? os(n, r, t, u) : as(n, r, t, u),
                16384 & r.flags && us(n, cs(n, e)),
                224 & r.flags ? Ge(n, r.nodeIndex).value : void 0
            }
            ), n)
        }
        function ss(n, l) {
            if (128 & n.state)
                throw Ve(ns[ls]);
            return us(n, ds(n, 0)),
            n.def.updateRenderer((function(n, e, t, ...u) {
                const r = n.def.nodes[e];
                return 0 === l ? os(n, r, t, u) : as(n, r, t, u),
                3 & r.flags && us(n, ds(n, e)),
                224 & r.flags ? Ge(n, r.nodeIndex).value : void 0
            }
            ), n)
        }
        function os(n, l, e, t) {
            if (Si(n, l, e, ...t)) {
                const i = 1 === e ? t[0] : t;
                if (16384 & l.flags) {
                    const e = {};
                    for (let n = 0; n < l.bindings.length; n++) {
                        const t = l.bindings[n]
                          , s = i[n];
                        8 & t.flags && (e[(u = t.nonMinifiedName,
                        r = void 0,
                        r = u.replace(/[$@]/g, "_"),
                        `ng-reflect-${u = r.replace(Rl, (...n)=>"-" + n[1].toLowerCase())}`)] = Pl(s))
                    }
                    const t = l.parent
                      , s = qe(n, t.nodeIndex).renderElement;
                    if (t.element.name)
                        for (let l in e) {
                            const t = e[l];
                            null != t ? n.renderer.setAttribute(s, l, t) : n.renderer.removeAttribute(s, l)
                        }
                    else
                        n.renderer.setValue(s, `bindings=${JSON.stringify(e, null, 2)}`)
                }
            }
            var u, r
        }
        function as(n, l, e, t) {
            Ai(n, l, e, ...t)
        }
        function cs(n, l) {
            for (let e = l; e < n.def.nodes.length; e++) {
                const l = n.def.nodes[e];
                if (16384 & l.flags && l.bindings && l.bindings.length)
                    return e
            }
            return null
        }
        function ds(n, l) {
            for (let e = l; e < n.def.nodes.length; e++) {
                const l = n.def.nodes[e];
                if (3 & l.flags && l.bindings && l.bindings.length)
                    return e
            }
            return null
        }
        class hs {
            constructor(n, l) {
                this.view = n,
                this.nodeIndex = l,
                null == l && (this.nodeIndex = l = 0),
                this.nodeDef = n.def.nodes[l];
                let e = this.nodeDef
                  , t = n;
                for (; e && 0 == (1 & e.flags); )
                    e = e.parent;
                if (!e)
                    for (; !e && t; )
                        e = ct(t),
                        t = t.parent;
                this.elDef = e,
                this.elView = t
            }
            get elOrCompView() {
                return qe(this.elView, this.elDef.nodeIndex).componentView || this.view
            }
            get injector() {
                return Kt(this.elView, this.elDef)
            }
            get component() {
                return this.elOrCompView.component
            }
            get context() {
                return this.elOrCompView.context
            }
            get providerTokens() {
                const n = [];
                if (this.elDef)
                    for (let l = this.elDef.nodeIndex + 1; l <= this.elDef.nodeIndex + this.elDef.childCount; l++) {
                        const e = this.elView.def.nodes[l];
                        20224 & e.flags && n.push(e.provider.token),
                        l += e.childCount
                    }
                return n
            }
            get references() {
                const n = {};
                if (this.elDef) {
                    ps(this.elView, this.elDef, n);
                    for (let l = this.elDef.nodeIndex + 1; l <= this.elDef.nodeIndex + this.elDef.childCount; l++) {
                        const e = this.elView.def.nodes[l];
                        20224 & e.flags && ps(this.elView, e, n),
                        l += e.childCount
                    }
                }
                return n
            }
            get componentRenderElement() {
                const n = function(n) {
                    for (; n && !ht(n); )
                        n = n.parent;
                    return n.parent ? qe(n.parent, ct(n).nodeIndex) : null
                }(this.elOrCompView);
                return n ? n.renderElement : void 0
            }
            get renderNode() {
                return 2 & this.nodeDef.flags ? dt(this.view, this.nodeDef) : dt(this.elView, this.elDef)
            }
            logError(n, ...l) {
                let e, t;
                2 & this.nodeDef.flags ? (e = this.view.def,
                t = this.nodeDef.nodeIndex) : (e = this.elView.def,
                t = this.elDef.nodeIndex);
                const u = function(n, l) {
                    let e = -1;
                    for (let t = 0; t <= l; t++)
                        3 & n.nodes[t].flags && e++;
                    return e
                }(e, t);
                let r = -1;
                e.factory(()=>(r++,
                r === u ? n.error.bind(n, ...l) : Ze)),
                r < u && (n.error("Illegal state: the ViewDefinitionFactory did not call the logger!"),
                n.error(...l))
            }
        }
        function ps(n, l, e) {
            for (let t in l.references)
                e[t] = ii(n, l, l.references[t])
        }
        function fs(n, l, e, t) {
            const u = ls
              , r = es
              , i = ts;
            try {
                ls = n;
                const s = l.apply(e, t);
                return es = r,
                ts = i,
                ls = u,
                s
            } catch (s) {
                if (Jn(s) || !es)
                    throw s;
                throw function(n, l) {
                    return n instanceof Error || (n = new Error(n.toString())),
                    Fe(n, l),
                    n
                }(s, gs())
            }
        }
        function gs() {
            return es ? new hs(es,ts) : null
        }
        class ms {
            constructor(n) {
                this.delegate = n
            }
            createRenderer(n, l) {
                return new vs(this.delegate.createRenderer(n, l))
            }
            begin() {
                this.delegate.begin && this.delegate.begin()
            }
            end() {
                this.delegate.end && this.delegate.end()
            }
            whenRenderingDone() {
                return this.delegate.whenRenderingDone ? this.delegate.whenRenderingDone() : Promise.resolve(null)
            }
        }
        class vs {
            constructor(n) {
                this.delegate = n,
                this.debugContextFactory = gs,
                this.data = this.delegate.data
            }
            createDebugContext(n) {
                return this.debugContextFactory(n)
            }
            destroyNode(n) {
                const l = $r(n);
                !function(n) {
                    Vr.delete(n.nativeNode)
                }(l),
                l instanceof Hr && (l.listeners.length = 0),
                this.delegate.destroyNode && this.delegate.destroyNode(n)
            }
            destroy() {
                this.delegate.destroy()
            }
            createElement(n, l) {
                const e = this.delegate.createElement(n, l)
                  , t = this.createDebugContext(e);
                if (t) {
                    const l = new Fr(e,null,t);
                    l.name = n,
                    Br(l)
                }
                return e
            }
            createComment(n) {
                const l = this.delegate.createComment(n)
                  , e = this.createDebugContext(l);
                return e && Br(new Hr(l,null,e)),
                l
            }
            createText(n) {
                const l = this.delegate.createText(n)
                  , e = this.createDebugContext(l);
                return e && Br(new Hr(l,null,e)),
                l
            }
            appendChild(n, l) {
                const e = $r(n)
                  , t = $r(l);
                e && t && e instanceof Fr && e.addChild(t),
                this.delegate.appendChild(n, l)
            }
            insertBefore(n, l, e) {
                const t = $r(n)
                  , u = $r(l)
                  , r = $r(e);
                t && u && t instanceof Fr && t.insertBefore(r, u),
                this.delegate.insertBefore(n, l, e)
            }
            removeChild(n, l) {
                const e = $r(n)
                  , t = $r(l);
                e && t && e instanceof Fr && e.removeChild(t),
                this.delegate.removeChild(n, l)
            }
            selectRootElement(n, l) {
                const e = this.delegate.selectRootElement(n, l)
                  , t = gs();
                return t && Br(new Fr(e,null,t)),
                e
            }
            setAttribute(n, l, e, t) {
                const u = $r(n);
                u && u instanceof Fr && (u.attributes[t ? t + ":" + l : l] = e),
                this.delegate.setAttribute(n, l, e, t)
            }
            removeAttribute(n, l, e) {
                const t = $r(n);
                t && t instanceof Fr && (t.attributes[e ? e + ":" + l : l] = null),
                this.delegate.removeAttribute(n, l, e)
            }
            addClass(n, l) {
                const e = $r(n);
                e && e instanceof Fr && (e.classes[l] = !0),
                this.delegate.addClass(n, l)
            }
            removeClass(n, l) {
                const e = $r(n);
                e && e instanceof Fr && (e.classes[l] = !1),
                this.delegate.removeClass(n, l)
            }
            setStyle(n, l, e, t) {
                const u = $r(n);
                u && u instanceof Fr && (u.styles[l] = e),
                this.delegate.setStyle(n, l, e, t)
            }
            removeStyle(n, l, e) {
                const t = $r(n);
                t && t instanceof Fr && (t.styles[l] = null),
                this.delegate.removeStyle(n, l, e)
            }
            setProperty(n, l, e) {
                const t = $r(n);
                t && t instanceof Fr && (t.properties[l] = e),
                this.delegate.setProperty(n, l, e)
            }
            listen(n, l, e) {
                if ("string" != typeof n) {
                    const t = $r(n);
                    t && t.listeners.push(new Ur(l,e))
                }
                return this.delegate.listen(n, l, e)
            }
            parentNode(n) {
                return this.delegate.parentNode(n)
            }
            nextSibling(n) {
                return this.delegate.nextSibling(n)
            }
            setValue(n, l) {
                return this.delegate.setValue(n, l)
            }
        }
        function _s(n, l, e) {
            return new bs(n,l,e)
        }
        class bs extends zn {
            constructor(n, l, e) {
                super(),
                this.moduleType = n,
                this._bootstrapComponents = l,
                this._ngModuleDefFactory = e
            }
            create(n) {
                !function() {
                    if (Ni)
                        return;
                    Ni = !0;
                    const n = ul() ? {
                        setCurrentNode: us,
                        createRootView: ji,
                        createEmbeddedView: Hi,
                        createComponentView: Fi,
                        createNgModuleRef: Vi,
                        overrideProvider: qi,
                        overrideComponentView: Wi,
                        clearOverrides: Gi,
                        checkAndUpdateView: Yi,
                        checkNoChangesView: Ji,
                        destroyView: Xi,
                        createDebugContext: (n,l)=>new hs(n,l),
                        handleEvent: rs,
                        updateDirectives: is,
                        updateRenderer: ss
                    } : {
                        setCurrentNode: ()=>{}
                        ,
                        createRootView: Li,
                        createEmbeddedView: mi,
                        createComponentView: _i,
                        createNgModuleRef: Xt,
                        overrideProvider: Ze,
                        overrideComponentView: Ze,
                        clearOverrides: Ze,
                        checkAndUpdateView: Ci,
                        checkNoChangesView: ki,
                        destroyView: Ti,
                        createDebugContext: (n,l)=>new hs(n,l),
                        handleEvent: (n,l,e,t)=>n.def.handleEvent(n, l, e, t),
                        updateDirectives: (n,l)=>n.def.updateDirectives(0 === l ? Qi : Zi, n),
                        updateRenderer: (n,l)=>n.def.updateRenderer(0 === l ? Qi : Zi, n)
                    };
                    Qe.setCurrentNode = n.setCurrentNode,
                    Qe.createRootView = n.createRootView,
                    Qe.createEmbeddedView = n.createEmbeddedView,
                    Qe.createComponentView = n.createComponentView,
                    Qe.createNgModuleRef = n.createNgModuleRef,
                    Qe.overrideProvider = n.overrideProvider,
                    Qe.overrideComponentView = n.overrideComponentView,
                    Qe.clearOverrides = n.clearOverrides,
                    Qe.checkAndUpdateView = n.checkAndUpdateView,
                    Qe.checkNoChangesView = n.checkNoChangesView,
                    Qe.destroyView = n.destroyView,
                    Qe.resolveDep = bu,
                    Qe.createDebugContext = n.createDebugContext,
                    Qe.handleEvent = n.handleEvent,
                    Qe.updateDirectives = n.updateDirectives,
                    Qe.updateRenderer = n.updateRenderer,
                    Qe.dirtyParentQueries = ti
                }();
                const l = function(n) {
                    const l = Array.from(n.providers)
                      , e = Array.from(n.modules)
                      , t = {};
                    for (const u in n.providersByKey)
                        t[u] = n.providersByKey[u];
                    return {
                        factory: n.factory,
                        isRoot: n.isRoot,
                        providers: l,
                        modules: e,
                        providersByKey: t
                    }
                }(bt(this._ngModuleDefFactory));
                return Qe.createNgModuleRef(this.moduleType, n || Ll.NULL, this._bootstrapComponents, l)
            }
        }
        class ys {
        }
        class ws {
            constructor() {
                this.title = "TECHQUEST 2020"
            }
            ngOnInit() {}
        }
        class ks {
        }
        const Cs = new En("Location Initialized");
        class Ss {
        }
        const xs = new En("appBaseHref");
        class As {
            constructor(n, l) {
                this._subject = new Mu,
                this._urlChangeListeners = [],
                this._platformStrategy = n;
                const e = this._platformStrategy.getBaseHref();
                this._platformLocation = l,
                this._baseHref = As.stripTrailingSlash(Es(e)),
                this._platformStrategy.onPopState(n=>{
                    this._subject.emit({
                        url: this.path(!0),
                        pop: !0,
                        state: n.state,
                        type: n.type
                    })
                }
                )
            }
            path(n=!1) {
                return this.normalize(this._platformStrategy.path(n))
            }
            getState() {
                return this._platformLocation.getState()
            }
            isCurrentPathEqualTo(n, l="") {
                return this.path() == this.normalize(n + As.normalizeQueryParams(l))
            }
            normalize(n) {
                return As.stripTrailingSlash(function(n, l) {
                    return n && l.startsWith(n) ? l.substring(n.length) : l
                }(this._baseHref, Es(n)))
            }
            prepareExternalUrl(n) {
                return n && "/" !== n[0] && (n = "/" + n),
                this._platformStrategy.prepareExternalUrl(n)
            }
            go(n, l="", e=null) {
                this._platformStrategy.pushState(e, "", n, l),
                this._notifyUrlChangeListeners(this.prepareExternalUrl(n + As.normalizeQueryParams(l)), e)
            }
            replaceState(n, l="", e=null) {
                this._platformStrategy.replaceState(e, "", n, l),
                this._notifyUrlChangeListeners(this.prepareExternalUrl(n + As.normalizeQueryParams(l)), e)
            }
            forward() {
                this._platformStrategy.forward()
            }
            back() {
                this._platformStrategy.back()
            }
            onUrlChange(n) {
                this._urlChangeListeners.push(n),
                this.subscribe(n=>{
                    this._notifyUrlChangeListeners(n.url, n.state)
                }
                )
            }
            _notifyUrlChangeListeners(n="", l) {
                this._urlChangeListeners.forEach(e=>e(n, l))
            }
            subscribe(n, l, e) {
                return this._subject.subscribe({
                    next: n,
                    error: l,
                    complete: e
                })
            }
            static normalizeQueryParams(n) {
                return n && "?" !== n[0] ? "?" + n : n
            }
            static joinWithSlash(n, l) {
                if (0 == n.length)
                    return l;
                if (0 == l.length)
                    return n;
                let e = 0;
                return n.endsWith("/") && e++,
                l.startsWith("/") && e++,
                2 == e ? n + l.substring(1) : 1 == e ? n + l : n + "/" + l
            }
            static stripTrailingSlash(n) {
                const l = n.match(/#|\?|$/)
                  , e = l && l.index || n.length;
                return n.slice(0, e - ("/" === n[e - 1] ? 1 : 0)) + n.slice(e)
            }
        }
        function Es(n) {
            return n.replace(/\/index.html$/, "")
        }
        class Ts extends Ss {
            constructor(n, l) {
                super(),
                this._platformLocation = n,
                this._baseHref = "",
                null != l && (this._baseHref = l)
            }
            onPopState(n) {
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
            }
            getBaseHref() {
                return this._baseHref
            }
            path(n=!1) {
                let l = this._platformLocation.hash;
                return null == l && (l = "#"),
                l.length > 0 ? l.substring(1) : l
            }
            prepareExternalUrl(n) {
                const l = As.joinWithSlash(this._baseHref, n);
                return l.length > 0 ? "#" + l : l
            }
            pushState(n, l, e, t) {
                let u = this.prepareExternalUrl(e + As.normalizeQueryParams(t));
                0 == u.length && (u = this._platformLocation.pathname),
                this._platformLocation.pushState(n, l, u)
            }
            replaceState(n, l, e, t) {
                let u = this.prepareExternalUrl(e + As.normalizeQueryParams(t));
                0 == u.length && (u = this._platformLocation.pathname),
                this._platformLocation.replaceState(n, l, u)
            }
            forward() {
                this._platformLocation.forward()
            }
            back() {
                this._platformLocation.back()
            }
        }
        class Is extends Ss {
            constructor(n, l) {
                if (super(),
                this._platformLocation = n,
                null == l && (l = this._platformLocation.getBaseHrefFromDOM()),
                null == l)
                    throw new Error("No base href set. Please provide a value for the APP_BASE_HREF token or add a base element to the document.");
                this._baseHref = l
            }
            onPopState(n) {
                this._platformLocation.onPopState(n),
                this._platformLocation.onHashChange(n)
            }
            getBaseHref() {
                return this._baseHref
            }
            prepareExternalUrl(n) {
                return As.joinWithSlash(this._baseHref, n)
            }
            path(n=!1) {
                const l = this._platformLocation.pathname + As.normalizeQueryParams(this._platformLocation.search)
                  , e = this._platformLocation.hash;
                return e && n ? `${l}${e}` : l
            }
            pushState(n, l, e, t) {
                const u = this.prepareExternalUrl(e + As.normalizeQueryParams(t));
                this._platformLocation.pushState(n, l, u)
            }
            replaceState(n, l, e, t) {
                const u = this.prepareExternalUrl(e + As.normalizeQueryParams(t));
                this._platformLocation.replaceState(n, l, u)
            }
            forward() {
                this._platformLocation.forward()
            }
            back() {
                this._platformLocation.back()
            }
        }
        const Rs = function() {
            var n = {
                Zero: 0,
                One: 1,
                Two: 2,
                Few: 3,
                Many: 4,
                Other: 5
            };
            return n[n.Zero] = "Zero",
            n[n.One] = "One",
            n[n.Two] = "Two",
            n[n.Few] = "Few",
            n[n.Many] = "Many",
            n[n.Other] = "Other",
            n
        }()
          , Ps = function(n) {
            return function(n) {
                const l = n.toLowerCase().replace(/_/g, "-");
                let e = Au[l];
                if (e)
                    return e;
                const t = l.split("-")[0];
                if (e = Au[t],
                e)
                    return e;
                if ("en" === t)
                    return Iu;
                throw new Error(`Missing locale data for the locale "${n}".`)
            }(n)[Eu.PluralCase]
        }
          , Os = new En("UseV4Plurals");
        class Ms {
        }
        class Ds extends Ms {
            constructor(n, l) {
                super(),
                this.locale = n,
                this.deprecatedPluralFn = l
            }
            getPluralCategory(n, l) {
                switch (this.deprecatedPluralFn ? this.deprecatedPluralFn(l || this.locale, n) : Ps(l || this.locale)(n)) {
                case Rs.Zero:
                    return "zero";
                case Rs.One:
                    return "one";
                case Rs.Two:
                    return "two";
                case Rs.Few:
                    return "few";
                case Rs.Many:
                    return "many";
                default:
                    return "other"
                }
            }
        }
        class Ns {
        }
        class Ls {
            constructor(n, l, e, t) {
                this._iterableDiffers = n,
                this._keyValueDiffers = l,
                this._ngEl = e,
                this._renderer = t,
                this._initialClasses = []
            }
            getValue() {
                return null
            }
            setClass(n) {
                this._removeClasses(this._initialClasses),
                this._initialClasses = "string" == typeof n ? n.split(/\s+/) : [],
                this._applyClasses(this._initialClasses),
                this._applyClasses(this._rawClass)
            }
            setNgClass(n) {
                this._removeClasses(this._rawClass),
                this._applyClasses(this._initialClasses),
                this._iterableDiffer = null,
                this._keyValueDiffer = null,
                this._rawClass = "string" == typeof n ? n.split(/\s+/) : n,
                this._rawClass && (Yl(this._rawClass) ? this._iterableDiffer = this._iterableDiffers.find(this._rawClass).create() : this._keyValueDiffer = this._keyValueDiffers.find(this._rawClass).create())
            }
            applyChanges() {
                if (this._iterableDiffer) {
                    const n = this._iterableDiffer.diff(this._rawClass);
                    n && this._applyIterableChanges(n)
                } else if (this._keyValueDiffer) {
                    const n = this._keyValueDiffer.diff(this._rawClass);
                    n && this._applyKeyValueChanges(n)
                }
            }
            _applyKeyValueChanges(n) {
                n.forEachAddedItem(n=>this._toggleClass(n.key, n.currentValue)),
                n.forEachChangedItem(n=>this._toggleClass(n.key, n.currentValue)),
                n.forEachRemovedItem(n=>{
                    n.previousValue && this._toggleClass(n.key, !1)
                }
                )
            }
            _applyIterableChanges(n) {
                n.forEachAddedItem(n=>{
                    if ("string" != typeof n.item)
                        throw new Error(`NgClass can only toggle CSS classes expressed as strings, got ${_n(n.item)}`);
                    this._toggleClass(n.item, !0)
                }
                ),
                n.forEachRemovedItem(n=>this._toggleClass(n.item, !1))
            }
            _applyClasses(n) {
                n && (Array.isArray(n) || n instanceof Set ? n.forEach(n=>this._toggleClass(n, !0)) : Object.keys(n).forEach(l=>this._toggleClass(l, !!n[l])))
            }
            _removeClasses(n) {
                n && (Array.isArray(n) || n instanceof Set ? n.forEach(n=>this._toggleClass(n, !1)) : Object.keys(n).forEach(n=>this._toggleClass(n, !1)))
            }
            _toggleClass(n, l) {
                (n = n.trim()) && n.split(/\s+/g).forEach(n=>{
                    l ? this._renderer.addClass(this._ngEl.nativeElement, n) : this._renderer.removeClass(this._ngEl.nativeElement, n)
                }
                )
            }
        }
        let js = (()=>{
            class n {
                constructor(n) {
                    this._delegate = n
                }
                getValue() {
                    return this._delegate.getValue()
                }
            }
            return n.ngDirectiveDef = void 0,
            n
        }
        )();
        class Us extends js {
            constructor(n) {
                super(n)
            }
            set klass(n) {
                this._delegate.setClass(n)
            }
            set ngClass(n) {
                this._delegate.setNgClass(n)
            }
            ngDoCheck() {
                this._delegate.applyChanges()
            }
        }
        class Hs {
            constructor(n, l, e, t) {
                this.$implicit = n,
                this.ngForOf = l,
                this.index = e,
                this.count = t
            }
            get first() {
                return 0 === this.index
            }
            get last() {
                return this.index === this.count - 1
            }
            get even() {
                return this.index % 2 == 0
            }
            get odd() {
                return !this.even
            }
        }
        class Fs {
            constructor(n, l, e) {
                this._viewContainer = n,
                this._template = l,
                this._differs = e,
                this._ngForOfDirty = !0,
                this._differ = null
            }
            set ngForOf(n) {
                this._ngForOf = n,
                this._ngForOfDirty = !0
            }
            set ngForTrackBy(n) {
                ul() && null != n && "function" != typeof n && console && console.warn && console.warn(`trackBy must be a function, but received ${JSON.stringify(n)}. ` + "See https://angular.io/docs/ts/latest/api/common/index/NgFor-directive.html#!#change-propagation for more information."),
                this._trackByFn = n
            }
            get ngForTrackBy() {
                return this._trackByFn
            }
            set ngForTemplate(n) {
                n && (this._template = n)
            }
            ngDoCheck() {
                if (this._ngForOfDirty) {
                    this._ngForOfDirty = !1;
                    const e = this._ngForOf;
                    if (!this._differ && e)
                        try {
                            this._differ = this._differs.find(e).create(this.ngForTrackBy)
                        } catch (l) {
                            throw new Error(`Cannot find a differ supporting object '${e}' of type '${n = e,
                            n.name || typeof n}'. NgFor only supports binding to Iterables such as Arrays.`)
                        }
                }
                var n;
                if (this._differ) {
                    const n = this._differ.diff(this._ngForOf);
                    n && this._applyChanges(n)
                }
            }
            _applyChanges(n) {
                const l = [];
                n.forEachOperation((n,e,t)=>{
                    if (null == n.previousIndex) {
                        const e = this._viewContainer.createEmbeddedView(this._template, new Hs(null,this._ngForOf,-1,-1), null === t ? void 0 : t)
                          , u = new Vs(n,e);
                        l.push(u)
                    } else if (null == t)
                        this._viewContainer.remove(null === e ? void 0 : e);
                    else if (null !== e) {
                        const u = this._viewContainer.get(e);
                        this._viewContainer.move(u, t);
                        const r = new Vs(n,u);
                        l.push(r)
                    }
                }
                );
                for (let e = 0; e < l.length; e++)
                    this._perViewChange(l[e].view, l[e].record);
                for (let e = 0, t = this._viewContainer.length; e < t; e++) {
                    const n = this._viewContainer.get(e);
                    n.context.index = e,
                    n.context.count = t,
                    n.context.ngForOf = this._ngForOf
                }
                n.forEachIdentityChange(n=>{
                    this._viewContainer.get(n.currentIndex).context.$implicit = n.item
                }
                )
            }
            _perViewChange(n, l) {
                n.context.$implicit = l.item
            }
            static ngTemplateContextGuard(n, l) {
                return !0
            }
        }
        class Vs {
            constructor(n, l) {
                this.record = n,
                this.view = l
            }
        }
        class $s {
            constructor(n, l) {
                this._viewContainer = n,
                this._context = new Bs,
                this._thenTemplateRef = null,
                this._elseTemplateRef = null,
                this._thenViewRef = null,
                this._elseViewRef = null,
                this._thenTemplateRef = l
            }
            set ngIf(n) {
                this._context.$implicit = this._context.ngIf = n,
                this._updateView()
            }
            set ngIfThen(n) {
                zs("ngIfThen", n),
                this._thenTemplateRef = n,
                this._thenViewRef = null,
                this._updateView()
            }
            set ngIfElse(n) {
                zs("ngIfElse", n),
                this._elseTemplateRef = n,
                this._elseViewRef = null,
                this._updateView()
            }
            _updateView() {
                this._context.$implicit ? this._thenViewRef || (this._viewContainer.clear(),
                this._elseViewRef = null,
                this._thenTemplateRef && (this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context))) : this._elseViewRef || (this._viewContainer.clear(),
                this._thenViewRef = null,
                this._elseTemplateRef && (this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context)))
            }
        }
        class Bs {
            constructor() {
                this.$implicit = null,
                this.ngIf = null
            }
        }
        function zs(n, l) {
            if (l && !l.createEmbeddedView)
                throw new Error(`${n} must be a TemplateRef, but received '${_n(l)}'.`)
        }
        class qs {
        }
        const Ws = new En("DocumentToken")
          , Gs = "browser"
          , Ks = "server";
        let Qs = (()=>{
            class n {
            }
            return n.ngInjectableDef = gn({
                token: n,
                providedIn: "root",
                factory: ()=>new Zs(Fn(Ws),window,Fn(ll))
            }),
            n
        }
        )();
        class Zs {
            constructor(n, l, e) {
                this.document = n,
                this.window = l,
                this.errorHandler = e,
                this.offset = ()=>[0, 0]
            }
            setOffset(n) {
                this.offset = Array.isArray(n) ? ()=>n : n
            }
            getScrollPosition() {
                return this.supportScrollRestoration() ? [this.window.scrollX, this.window.scrollY] : [0, 0]
            }
            scrollToPosition(n) {
                this.supportScrollRestoration() && this.window.scrollTo(n[0], n[1])
            }
            scrollToAnchor(n) {
                if (this.supportScrollRestoration()) {
                    n = this.window.CSS && this.window.CSS.escape ? this.window.CSS.escape(n) : n.replace(/(\"|\'\ |:|\.|\[|\]|,|=)/g, "\\$1");
                    try {
                        const l = this.document.querySelector(`#${n}`);
                        if (l)
                            return void this.scrollToElement(l);
                        const e = this.document.querySelector(`[name='${n}']`);
                        if (e)
                            return void this.scrollToElement(e)
                    } catch (l) {
                        this.errorHandler.handleError(l)
                    }
                }
            }
            setHistoryScrollRestoration(n) {
                if (this.supportScrollRestoration()) {
                    const l = this.window.history;
                    l && l.scrollRestoration && (l.scrollRestoration = n)
                }
            }
            scrollToElement(n) {
                const l = n.getBoundingClientRect()
                  , e = l.left + this.window.pageXOffset
                  , t = l.top + this.window.pageYOffset
                  , u = this.offset();
                this.window.scrollTo(e - u[0], t - u[1])
            }
            supportScrollRestoration() {
                try {
                    return !!this.window && !!this.window.scrollTo
                } catch (n) {
                    return !1
                }
            }
        }
        const Ys = new w(n=>n.complete());
        function Js(n) {
            return n ? function(n) {
                return new w(l=>n.schedule(()=>l.complete()))
            }(n) : Ys
        }
        function Xs(n) {
            const l = new w(l=>{
                l.next(n),
                l.complete()
            }
            );
            return l._isScalar = !0,
            l.value = n,
            l
        }
        function no(...n) {
            let l = n[n.length - 1];
            switch (I(l) ? n.pop() : l = void 0,
            n.length) {
            case 0:
                return Js(l);
            case 1:
                return l ? q(n, l) : Xs(n[0]);
            default:
                return q(n, l)
            }
        }
        class lo extends E {
            constructor(n) {
                super(),
                this._value = n
            }
            get value() {
                return this.getValue()
            }
            _subscribe(n) {
                const l = super._subscribe(n);
                return l && !l.closed && n.next(this._value),
                l
            }
            getValue() {
                if (this.hasError)
                    throw this.thrownError;
                if (this.closed)
                    throw new S;
                return this._value
            }
            next(n) {
                super.next(this._value = n)
            }
        }
        function eo() {
            return Error.call(this),
            this.message = "no elements in sequence",
            this.name = "EmptyError",
            this
        }
        eo.prototype = Object.create(Error.prototype);
        const to = eo
          , uo = {};
        class ro {
            constructor(n) {
                this.resultSelector = n
            }
            call(n, l) {
                return l.subscribe(new io(n,this.resultSelector))
            }
        }
        class io extends V {
            constructor(n, l) {
                super(n),
                this.resultSelector = l,
                this.active = 0,
                this.values = [],
                this.observables = []
            }
            _next(n) {
                this.values.push(uo),
                this.observables.push(n)
            }
            _complete() {
                const n = this.observables
                  , l = n.length;
                if (0 === l)
                    this.destination.complete();
                else {
                    this.active = l,
                    this.toRespond = l;
                    for (let e = 0; e < l; e++) {
                        const l = n[e];
                        this.add(F(this, l, l, e))
                    }
                }
            }
            notifyComplete(n) {
                0 == (this.active -= 1) && this.destination.complete()
            }
            notifyNext(n, l, e, t, u) {
                const r = this.values
                  , i = this.toRespond ? r[e] === uo ? --this.toRespond : this.toRespond : 0;
                r[e] = l,
                0 === i && (this.resultSelector ? this._tryResultSelector(r) : this.destination.next(r.slice()))
            }
            _tryResultSelector(n) {
                let l;
                try {
                    l = this.resultSelector.apply(this, n)
                } catch (e) {
                    return void this.destination.error(e)
                }
                this.destination.next(l)
            }
        }
        function so(n) {
            return new w(l=>{
                let e;
                try {
                    e = n()
                } catch (t) {
                    return void l.error(t)
                }
                return (e ? W(e) : Js()).subscribe(l)
            }
            )
        }
        function oo() {
            return Y(1)
        }
        function ao(n, l) {
            return function(e) {
                return e.lift(new co(n,l))
            }
        }
        class co {
            constructor(n, l) {
                this.predicate = n,
                this.thisArg = l
            }
            call(n, l) {
                return l.subscribe(new ho(n,this.predicate,this.thisArg))
            }
        }
        class ho extends g {
            constructor(n, l, e) {
                super(n),
                this.predicate = l,
                this.thisArg = e,
                this.count = 0
            }
            _next(n) {
                let l;
                try {
                    l = this.predicate.call(this.thisArg, n, this.count++)
                } catch (e) {
                    return void this.destination.error(e)
                }
                l && this.destination.next(n)
            }
        }
        function po() {
            return Error.call(this),
            this.message = "argument out of range",
            this.name = "ArgumentOutOfRangeError",
            this
        }
        po.prototype = Object.create(Error.prototype);
        const fo = po;
        function go(n) {
            return function(l) {
                return 0 === n ? Js() : l.lift(new mo(n))
            }
        }
        class mo {
            constructor(n) {
                if (this.total = n,
                this.total < 0)
                    throw new fo
            }
            call(n, l) {
                return l.subscribe(new vo(n,this.total))
            }
        }
        class vo extends g {
            constructor(n, l) {
                super(n),
                this.total = l,
                this.ring = new Array,
                this.count = 0
            }
            _next(n) {
                const l = this.ring
                  , e = this.total
                  , t = this.count++;
                l.length < e ? l.push(n) : l[t % e] = n
            }
            _complete() {
                const n = this.destination;
                let l = this.count;
                if (l > 0) {
                    const e = this.count >= this.total ? this.total : this.count
                      , t = this.ring;
                    for (let u = 0; u < e; u++) {
                        const u = l++ % e;
                        n.next(t[u])
                    }
                }
                n.complete()
            }
        }
        function _o(n, l, e) {
            return function(t) {
                return t.lift(new bo(n,l,e))
            }
        }
        class bo {
            constructor(n, l, e) {
                this.nextOrObserver = n,
                this.error = l,
                this.complete = e
            }
            call(n, l) {
                return l.subscribe(new yo(n,this.nextOrObserver,this.error,this.complete))
            }
        }
        class yo extends g {
            constructor(n, l, e, u) {
                super(n),
                this._tapNext = _,
                this._tapError = _,
                this._tapComplete = _,
                this._tapError = e || _,
                this._tapComplete = u || _,
                t(l) ? (this._context = this,
                this._tapNext = l) : l && (this._context = l,
                this._tapNext = l.next || _,
                this._tapError = l.error || _,
                this._tapComplete = l.complete || _)
            }
            _next(n) {
                try {
                    this._tapNext.call(this._context, n)
                } catch (l) {
                    return void this.destination.error(l)
                }
                this.destination.next(n)
            }
            _error(n) {
                try {
                    this._tapError.call(this._context, n)
                } catch (n) {
                    return void this.destination.error(n)
                }
                this.destination.error(n)
            }
            _complete() {
                try {
                    this._tapComplete.call(this._context)
                } catch (n) {
                    return void this.destination.error(n)
                }
                return this.destination.complete()
            }
        }
        const wo = (n=ko)=>_o({
            hasValue: !1,
            next() {
                this.hasValue = !0
            },
            complete() {
                if (!this.hasValue)
                    throw n()
            }
        });
        function ko() {
            return new to
        }
        function Co(n=null) {
            return l=>l.lift(new So(n))
        }
        class So {
            constructor(n) {
                this.defaultValue = n
            }
            call(n, l) {
                return l.subscribe(new xo(n,this.defaultValue))
            }
        }
        class xo extends g {
            constructor(n, l) {
                super(n),
                this.defaultValue = l,
                this.isEmpty = !0
            }
            _next(n) {
                this.isEmpty = !1,
                this.destination.next(n)
            }
            _complete() {
                this.isEmpty && this.destination.next(this.defaultValue),
                this.destination.complete()
            }
        }
        function Ao(n, l) {
            const e = arguments.length >= 2;
            return t=>t.pipe(n ? ao((l,e)=>n(l, e, t)) : Z, go(1), e ? Co(l) : wo(()=>new to))
        }
        function Eo(n) {
            return function(l) {
                const e = new To(n)
                  , t = l.lift(e);
                return e.caught = t
            }
        }
        class To {
            constructor(n) {
                this.selector = n
            }
            call(n, l) {
                return l.subscribe(new Io(n,this.selector,this.caught))
            }
        }
        class Io extends V {
            constructor(n, l, e) {
                super(n),
                this.selector = l,
                this.caught = e
            }
            error(n) {
                if (!this.isStopped) {
                    let e;
                    try {
                        e = this.selector(n, this.caught)
                    } catch (l) {
                        return void super.error(l)
                    }
                    this._unsubscribeAndRecycle();
                    const t = new R(this,void 0,void 0);
                    this.add(t),
                    F(this, e, void 0, void 0, t)
                }
            }
        }
        function Ro(n) {
            return l=>0 === n ? Js() : l.lift(new Po(n))
        }
        class Po {
            constructor(n) {
                if (this.total = n,
                this.total < 0)
                    throw new fo
            }
            call(n, l) {
                return l.subscribe(new Oo(n,this.total))
            }
        }
        class Oo extends g {
            constructor(n, l) {
                super(n),
                this.total = l,
                this.count = 0
            }
            _next(n) {
                const l = this.total
                  , e = ++this.count;
                e <= l && (this.destination.next(n),
                e === l && (this.destination.complete(),
                this.unsubscribe()))
            }
        }
        function Mo(n, l) {
            const e = arguments.length >= 2;
            return t=>t.pipe(n ? ao((l,e)=>n(l, e, t)) : Z, Ro(1), e ? Co(l) : wo(()=>new to))
        }
        class Do {
            constructor(n, l, e) {
                this.predicate = n,
                this.thisArg = l,
                this.source = e
            }
            call(n, l) {
                return l.subscribe(new No(n,this.predicate,this.thisArg,this.source))
            }
        }
        class No extends g {
            constructor(n, l, e, t) {
                super(n),
                this.predicate = l,
                this.thisArg = e,
                this.source = t,
                this.index = 0,
                this.thisArg = e || this
            }
            notifyComplete(n) {
                this.destination.next(n),
                this.destination.complete()
            }
            _next(n) {
                let l = !1;
                try {
                    l = this.predicate.call(this.thisArg, n, this.index++, this.source)
                } catch (e) {
                    return void this.destination.error(e)
                }
                l || this.notifyComplete(!1)
            }
            _complete() {
                this.notifyComplete(!0)
            }
        }
        function Lo(n, l) {
            return "function" == typeof l ? e=>e.pipe(Lo((e,t)=>W(n(e, t)).pipe($((n,u)=>l(e, n, t, u))))) : l=>l.lift(new jo(n))
        }
        class jo {
            constructor(n) {
                this.project = n
            }
            call(n, l) {
                return l.subscribe(new Uo(n,this.project))
            }
        }
        class Uo extends V {
            constructor(n, l) {
                super(n),
                this.project = l,
                this.index = 0
            }
            _next(n) {
                let l;
                const e = this.index++;
                try {
                    l = this.project(n, e)
                } catch (t) {
                    return void this.destination.error(t)
                }
                this._innerSub(l, n, e)
            }
            _innerSub(n, l, e) {
                const t = this.innerSubscription;
                t && t.unsubscribe();
                const u = new R(this,void 0,void 0);
                this.destination.add(u),
                this.innerSubscription = F(this, n, l, e, u)
            }
            _complete() {
                const {innerSubscription: n} = this;
                n && !n.closed || super._complete(),
                this.unsubscribe()
            }
            _unsubscribe() {
                this.innerSubscription = null
            }
            notifyComplete(n) {
                this.destination.remove(n),
                this.innerSubscription = null,
                this.isStopped && super._complete()
            }
            notifyNext(n, l, e, t, u) {
                this.destination.next(l)
            }
        }
        function Ho(n, l) {
            let e = !1;
            return arguments.length >= 2 && (e = !0),
            function(t) {
                return t.lift(new Fo(n,l,e))
            }
        }
        class Fo {
            constructor(n, l, e=!1) {
                this.accumulator = n,
                this.seed = l,
                this.hasSeed = e
            }
            call(n, l) {
                return l.subscribe(new Vo(n,this.accumulator,this.seed,this.hasSeed))
            }
        }
        class Vo extends g {
            constructor(n, l, e, t) {
                super(n),
                this.accumulator = l,
                this._seed = e,
                this.hasSeed = t,
                this.index = 0
            }
            get seed() {
                return this._seed
            }
            set seed(n) {
                this.hasSeed = !0,
                this._seed = n
            }
            _next(n) {
                if (this.hasSeed)
                    return this._tryNext(n);
                this.seed = n,
                this.destination.next(n)
            }
            _tryNext(n) {
                const l = this.index++;
                let e;
                try {
                    e = this.accumulator(this.seed, n, l)
                } catch (t) {
                    this.destination.error(t)
                }
                this.seed = e,
                this.destination.next(e)
            }
        }
        function $o(n, l) {
            return G(n, l, 1)
        }
        class Bo {
            constructor(n) {
                this.callback = n
            }
            call(n, l) {
                return l.subscribe(new zo(n,this.callback))
            }
        }
        class zo extends g {
            constructor(n, l) {
                super(n),
                this.add(new h(l))
            }
        }
        let qo = null;
        function Wo() {
            return qo
        }
        class Go {
            constructor() {
                this.resourceLoaderType = null
            }
            get attrToPropMap() {
                return this._attrToPropMap
            }
            set attrToPropMap(n) {
                this._attrToPropMap = n
            }
        }
        class Ko extends Go {
            constructor() {
                super(),
                this._animationPrefix = null,
                this._transitionEnd = null;
                try {
                    const n = this.createElement("div", document);
                    if (null != this.getStyle(n, "animationName"))
                        this._animationPrefix = "";
                    else {
                        const l = ["Webkit", "Moz", "O", "ms"];
                        for (let e = 0; e < l.length; e++)
                            if (null != this.getStyle(n, l[e] + "AnimationName")) {
                                this._animationPrefix = "-" + l[e].toLowerCase() + "-";
                                break
                            }
                    }
                    const l = {
                        WebkitTransition: "webkitTransitionEnd",
                        MozTransition: "transitionend",
                        OTransition: "oTransitionEnd otransitionend",
                        transition: "transitionend"
                    };
                    Object.keys(l).forEach(e=>{
                        null != this.getStyle(n, e) && (this._transitionEnd = l[e])
                    }
                    )
                } catch (n) {
                    this._animationPrefix = null,
                    this._transitionEnd = null
                }
            }
            getDistributedNodes(n) {
                return n.getDistributedNodes()
            }
            resolveAndSetHref(n, l, e) {
                n.href = null == e ? l : l + "/../" + e
            }
            supportsDOMEvents() {
                return !0
            }
            supportsNativeShadowDOM() {
                return "function" == typeof document.body.createShadowRoot
            }
            getAnimationPrefix() {
                return this._animationPrefix ? this._animationPrefix : ""
            }
            getTransitionEnd() {
                return this._transitionEnd ? this._transitionEnd : ""
            }
            supportsAnimation() {
                return null != this._animationPrefix && null != this._transitionEnd
            }
        }
        const Qo = {
            class: "className",
            innerHtml: "innerHTML",
            readonly: "readOnly",
            tabindex: "tabIndex"
        }
          , Zo = 3
          , Yo = {
            "\b": "Backspace",
            "\t": "Tab",
            "\x7f": "Delete",
            "\x1b": "Escape",
            Del: "Delete",
            Esc: "Escape",
            Left: "ArrowLeft",
            Right: "ArrowRight",
            Up: "ArrowUp",
            Down: "ArrowDown",
            Menu: "ContextMenu",
            Scroll: "ScrollLock",
            Win: "OS"
        }
          , Jo = {
            A: "1",
            B: "2",
            C: "3",
            D: "4",
            E: "5",
            F: "6",
            G: "7",
            H: "8",
            I: "9",
            J: "*",
            K: "+",
            M: "-",
            N: ".",
            O: "/",
            "`": "0",
            "\x90": "NumLock"
        }
          , Xo = (()=>{
            if (An.Node)
                return An.Node.prototype.contains || function(n) {
                    return !!(16 & this.compareDocumentPosition(n))
                }
        }
        )();
        class na extends Ko {
            parse(n) {
                throw new Error("parse not implemented")
            }
            static makeCurrent() {
                var n;
                n = new na,
                qo || (qo = n)
            }
            hasProperty(n, l) {
                return l in n
            }
            setProperty(n, l, e) {
                n[l] = e
            }
            getProperty(n, l) {
                return n[l]
            }
            invoke(n, l, e) {
                n[l](...e)
            }
            logError(n) {
                window.console && (console.error ? console.error(n) : console.log(n))
            }
            log(n) {
                window.console && window.console.log && window.console.log(n)
            }
            logGroup(n) {
                window.console && window.console.group && window.console.group(n)
            }
            logGroupEnd() {
                window.console && window.console.groupEnd && window.console.groupEnd()
            }
            get attrToPropMap() {
                return Qo
            }
            contains(n, l) {
                return Xo.call(n, l)
            }
            querySelector(n, l) {
                return n.querySelector(l)
            }
            querySelectorAll(n, l) {
                return n.querySelectorAll(l)
            }
            on(n, l, e) {
                n.addEventListener(l, e, !1)
            }
            onAndCancel(n, l, e) {
                return n.addEventListener(l, e, !1),
                ()=>{
                    n.removeEventListener(l, e, !1)
                }
            }
            dispatchEvent(n, l) {
                n.dispatchEvent(l)
            }
            createMouseEvent(n) {
                const l = this.getDefaultDocument().createEvent("MouseEvent");
                return l.initEvent(n, !0, !0),
                l
            }
            createEvent(n) {
                const l = this.getDefaultDocument().createEvent("Event");
                return l.initEvent(n, !0, !0),
                l
            }
            preventDefault(n) {
                n.preventDefault(),
                n.returnValue = !1
            }
            isPrevented(n) {
                return n.defaultPrevented || null != n.returnValue && !n.returnValue
            }
            getInnerHTML(n) {
                return n.innerHTML
            }
            getTemplateContent(n) {
                return "content"in n && this.isTemplateElement(n) ? n.content : null
            }
            getOuterHTML(n) {
                return n.outerHTML
            }
            nodeName(n) {
                return n.nodeName
            }
            nodeValue(n) {
                return n.nodeValue
            }
            type(n) {
                return n.type
            }
            content(n) {
                return this.hasProperty(n, "content") ? n.content : n
            }
            firstChild(n) {
                return n.firstChild
            }
            nextSibling(n) {
                return n.nextSibling
            }
            parentElement(n) {
                return n.parentNode
            }
            childNodes(n) {
                return n.childNodes
            }
            childNodesAsList(n) {
                const l = n.childNodes
                  , e = new Array(l.length);
                for (let t = 0; t < l.length; t++)
                    e[t] = l[t];
                return e
            }
            clearNodes(n) {
                for (; n.firstChild; )
                    n.removeChild(n.firstChild)
            }
            appendChild(n, l) {
                n.appendChild(l)
            }
            removeChild(n, l) {
                n.removeChild(l)
            }
            replaceChild(n, l, e) {
                n.replaceChild(l, e)
            }
            remove(n) {
                return n.parentNode && n.parentNode.removeChild(n),
                n
            }
            insertBefore(n, l, e) {
                n.insertBefore(e, l)
            }
            insertAllBefore(n, l, e) {
                e.forEach(e=>n.insertBefore(e, l))
            }
            insertAfter(n, l, e) {
                n.insertBefore(e, l.nextSibling)
            }
            setInnerHTML(n, l) {
                n.innerHTML = l
            }
            getText(n) {
                return n.textContent
            }
            setText(n, l) {
                n.textContent = l
            }
            getValue(n) {
                return n.value
            }
            setValue(n, l) {
                n.value = l
            }
            getChecked(n) {
                return n.checked
            }
            setChecked(n, l) {
                n.checked = l
            }
            createComment(n) {
                return this.getDefaultDocument().createComment(n)
            }
            createTemplate(n) {
                const l = this.getDefaultDocument().createElement("template");
                return l.innerHTML = n,
                l
            }
            createElement(n, l) {
                return (l = l || this.getDefaultDocument()).createElement(n)
            }
            createElementNS(n, l, e) {
                return (e = e || this.getDefaultDocument()).createElementNS(n, l)
            }
            createTextNode(n, l) {
                return (l = l || this.getDefaultDocument()).createTextNode(n)
            }
            createScriptTag(n, l, e) {
                const t = (e = e || this.getDefaultDocument()).createElement("SCRIPT");
                return t.setAttribute(n, l),
                t
            }
            createStyleElement(n, l) {
                const e = (l = l || this.getDefaultDocument()).createElement("style");
                return this.appendChild(e, this.createTextNode(n, l)),
                e
            }
            createShadowRoot(n) {
                return n.createShadowRoot()
            }
            getShadowRoot(n) {
                return n.shadowRoot
            }
            getHost(n) {
                return n.host
            }
            clone(n) {
                return n.cloneNode(!0)
            }
            getElementsByClassName(n, l) {
                return n.getElementsByClassName(l)
            }
            getElementsByTagName(n, l) {
                return n.getElementsByTagName(l)
            }
            classList(n) {
                return Array.prototype.slice.call(n.classList, 0)
            }
            addClass(n, l) {
                n.classList.add(l)
            }
            removeClass(n, l) {
                n.classList.remove(l)
            }
            hasClass(n, l) {
                return n.classList.contains(l)
            }
            setStyle(n, l, e) {
                n.style[l] = e
            }
            removeStyle(n, l) {
                n.style[l] = ""
            }
            getStyle(n, l) {
                return n.style[l]
            }
            hasStyle(n, l, e) {
                const t = this.getStyle(n, l) || "";
                return e ? t == e : t.length > 0
            }
            tagName(n) {
                return n.tagName
            }
            attributeMap(n) {
                const l = new Map
                  , e = n.attributes;
                for (let t = 0; t < e.length; t++) {
                    const n = e.item(t);
                    l.set(n.name, n.value)
                }
                return l
            }
            hasAttribute(n, l) {
                return n.hasAttribute(l)
            }
            hasAttributeNS(n, l, e) {
                return n.hasAttributeNS(l, e)
            }
            getAttribute(n, l) {
                return n.getAttribute(l)
            }
            getAttributeNS(n, l, e) {
                return n.getAttributeNS(l, e)
            }
            setAttribute(n, l, e) {
                n.setAttribute(l, e)
            }
            setAttributeNS(n, l, e, t) {
                n.setAttributeNS(l, e, t)
            }
            removeAttribute(n, l) {
                n.removeAttribute(l)
            }
            removeAttributeNS(n, l, e) {
                n.removeAttributeNS(l, e)
            }
            templateAwareRoot(n) {
                return this.isTemplateElement(n) ? this.content(n) : n
            }
            createHtmlDocument() {
                return document.implementation.createHTMLDocument("fakeTitle")
            }
            getDefaultDocument() {
                return document
            }
            getBoundingClientRect(n) {
                try {
                    return n.getBoundingClientRect()
                } catch (l) {
                    return {
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        width: 0,
                        height: 0
                    }
                }
            }
            getTitle(n) {
                return n.title
            }
            setTitle(n, l) {
                n.title = l || ""
            }
            elementMatches(n, l) {
                return !!this.isElementNode(n) && (n.matches && n.matches(l) || n.msMatchesSelector && n.msMatchesSelector(l) || n.webkitMatchesSelector && n.webkitMatchesSelector(l))
            }
            isTemplateElement(n) {
                return this.isElementNode(n) && "TEMPLATE" === n.nodeName
            }
            isTextNode(n) {
                return n.nodeType === Node.TEXT_NODE
            }
            isCommentNode(n) {
                return n.nodeType === Node.COMMENT_NODE
            }
            isElementNode(n) {
                return n.nodeType === Node.ELEMENT_NODE
            }
            hasShadowRoot(n) {
                return null != n.shadowRoot && n instanceof HTMLElement
            }
            isShadowRoot(n) {
                return n instanceof DocumentFragment
            }
            importIntoDoc(n) {
                return document.importNode(this.templateAwareRoot(n), !0)
            }
            adoptNode(n) {
                return document.adoptNode(n)
            }
            getHref(n) {
                return n.getAttribute("href")
            }
            getEventKey(n) {
                let l = n.key;
                if (null == l) {
                    if (l = n.keyIdentifier,
                    null == l)
                        return "Unidentified";
                    l.startsWith("U+") && (l = String.fromCharCode(parseInt(l.substring(2), 16)),
                    n.location === Zo && Jo.hasOwnProperty(l) && (l = Jo[l]))
                }
                return Yo[l] || l
            }
            getGlobalEventTarget(n, l) {
                return "window" === l ? window : "document" === l ? n : "body" === l ? n.body : null
            }
            getHistory() {
                return window.history
            }
            getLocation() {
                return window.location
            }
            getBaseHref(n) {
                const l = ea || (ea = document.querySelector("base"),
                ea) ? ea.getAttribute("href") : null;
                return null == l ? null : (e = l,
                la || (la = document.createElement("a")),
                la.setAttribute("href", e),
                "/" === la.pathname.charAt(0) ? la.pathname : "/" + la.pathname);
                var e
            }
            resetBaseElement() {
                ea = null
            }
            getUserAgent() {
                return window.navigator.userAgent
            }
            setData(n, l, e) {
                this.setAttribute(n, "data-" + l, e)
            }
            getData(n, l) {
                return this.getAttribute(n, "data-" + l)
            }
            getComputedStyle(n) {
                return getComputedStyle(n)
            }
            supportsWebAnimation() {
                return "function" == typeof Element.prototype.animate
            }
            performanceNow() {
                return window.performance && window.performance.now ? window.performance.now() : (new Date).getTime()
            }
            supportsCookies() {
                return !0
            }
            getCookie(n) {
                return function(n, l) {
                    l = encodeURIComponent(l);
                    for (const e of n.split(";")) {
                        const n = e.indexOf("=")
                          , [t,u] = -1 == n ? [e, ""] : [e.slice(0, n), e.slice(n + 1)];
                        if (t.trim() === l)
                            return decodeURIComponent(u)
                    }
                    return null
                }(document.cookie, n)
            }
            setCookie(n, l) {
                document.cookie = encodeURIComponent(n) + "=" + encodeURIComponent(l)
            }
        }
        let la, ea = null;
        function ta() {
            return !!window.history.pushState
        }
        const ua = new En("TRANSITION_ID")
          , ra = [{
            provide: Lu,
            useFactory: function(n, l, e) {
                return ()=>{
                    e.get(ju).donePromise.then(()=>{
                        const e = Wo();
                        Array.prototype.slice.apply(e.querySelectorAll(l, "style[ng-transition]")).filter(l=>e.getAttribute(l, "ng-transition") === n).forEach(n=>e.remove(n))
                    }
                    )
                }
            },
            deps: [ua, Ws, Ll],
            multi: !0
        }];
        class ia {
            static init() {
                var n;
                n = new ia,
                yr = n
            }
            addToWindow(n) {
                An.getAngularTestability = (l,e=!0)=>{
                    const t = n.findTestabilityInTree(l, e);
                    if (null == t)
                        throw new Error("Could not find testability for element.");
                    return t
                }
                ,
                An.getAllAngularTestabilities = ()=>n.getAllTestabilities(),
                An.getAllAngularRootElements = ()=>n.getAllRootElements(),
                An.frameworkStabilizers || (An.frameworkStabilizers = []),
                An.frameworkStabilizers.push(n=>{
                    const l = An.getAllAngularTestabilities();
                    let e = l.length
                      , t = !1;
                    const u = function(l) {
                        t = t || l,
                        e--,
                        0 == e && n(t)
                    };
                    l.forEach((function(n) {
                        n.whenStable(u)
                    }
                    ))
                }
                )
            }
            findTestabilityInTree(n, l, e) {
                if (null == l)
                    return null;
                const t = n.getTestability(l);
                return null != t ? t : e ? Wo().isShadowRoot(l) ? this.findTestabilityInTree(n, Wo().getHost(l), !0) : this.findTestabilityInTree(n, Wo().parentElement(l), !0) : null
            }
        }
        function sa(n, l) {
            "undefined" != typeof COMPILED && COMPILED || ((An.ng = An.ng || {})[n] = l)
        }
        const oa = (()=>({
            ApplicationRef: Ir,
            NgZone: ar
        }))();
        function aa(n) {
            return $r(n)
        }
        const ca = new En("EventManagerPlugins");
        class da {
            constructor(n, l) {
                this._zone = l,
                this._eventNameToPlugin = new Map,
                n.forEach(n=>n.manager = this),
                this._plugins = n.slice().reverse()
            }
            addEventListener(n, l, e) {
                return this._findPluginFor(l).addEventListener(n, l, e)
            }
            addGlobalEventListener(n, l, e) {
                return this._findPluginFor(l).addGlobalEventListener(n, l, e)
            }
            getZone() {
                return this._zone
            }
            _findPluginFor(n) {
                const l = this._eventNameToPlugin.get(n);
                if (l)
                    return l;
                const e = this._plugins;
                for (let t = 0; t < e.length; t++) {
                    const l = e[t];
                    if (l.supports(n))
                        return this._eventNameToPlugin.set(n, l),
                        l
                }
                throw new Error(`No event manager plugin found for event ${n}`)
            }
        }
        class ha {
            constructor(n) {
                this._doc = n
            }
            addGlobalEventListener(n, l, e) {
                const t = Wo().getGlobalEventTarget(this._doc, n);
                if (!t)
                    throw new Error(`Unsupported event target ${t} for event ${l}`);
                return this.addEventListener(t, l, e)
            }
        }
        class pa {
            constructor() {
                this._stylesSet = new Set
            }
            addStyles(n) {
                const l = new Set;
                n.forEach(n=>{
                    this._stylesSet.has(n) || (this._stylesSet.add(n),
                    l.add(n))
                }
                ),
                this.onStylesAdded(l)
            }
            onStylesAdded(n) {}
            getAllStyles() {
                return Array.from(this._stylesSet)
            }
        }
        class fa extends pa {
            constructor(n) {
                super(),
                this._doc = n,
                this._hostNodes = new Set,
                this._styleNodes = new Set,
                this._hostNodes.add(n.head)
            }
            _addStylesToHost(n, l) {
                n.forEach(n=>{
                    const e = this._doc.createElement("style");
                    e.textContent = n,
                    this._styleNodes.add(l.appendChild(e))
                }
                )
            }
            addHost(n) {
                this._addStylesToHost(this._stylesSet, n),
                this._hostNodes.add(n)
            }
            removeHost(n) {
                this._hostNodes.delete(n)
            }
            onStylesAdded(n) {
                this._hostNodes.forEach(l=>this._addStylesToHost(n, l))
            }
            ngOnDestroy() {
                this._styleNodes.forEach(n=>Wo().remove(n))
            }
        }
        const ga = {
            svg: "http://www.w3.org/2000/svg",
            xhtml: "http://www.w3.org/1999/xhtml",
            xlink: "http://www.w3.org/1999/xlink",
            xml: "http://www.w3.org/XML/1998/namespace",
            xmlns: "http://www.w3.org/2000/xmlns/"
        }
          , ma = /%COMP%/g
          , va = "_nghost-%COMP%"
          , _a = "_ngcontent-%COMP%";
        function ba(n, l, e) {
            for (let t = 0; t < l.length; t++) {
                let u = l[t];
                Array.isArray(u) ? ba(n, u, e) : (u = u.replace(ma, n),
                e.push(u))
            }
            return e
        }
        function ya(n) {
            return l=>{
                !1 === n(l) && (l.preventDefault(),
                l.returnValue = !1)
            }
        }
        class wa {
            constructor(n, l, e) {
                this.eventManager = n,
                this.sharedStylesHost = l,
                this.appId = e,
                this.rendererByCompId = new Map,
                this.defaultRenderer = new ka(n)
            }
            createRenderer(n, l) {
                if (!n || !l)
                    return this.defaultRenderer;
                switch (l.encapsulation) {
                case Gn.Emulated:
                    {
                        let e = this.rendererByCompId.get(l.id);
                        return e || (e = new xa(this.eventManager,this.sharedStylesHost,l,this.appId),
                        this.rendererByCompId.set(l.id, e)),
                        e.applyToHost(n),
                        e
                    }
                case Gn.Native:
                case Gn.ShadowDom:
                    return new Aa(this.eventManager,this.sharedStylesHost,n,l);
                default:
                    if (!this.rendererByCompId.has(l.id)) {
                        const n = ba(l.id, l.styles, []);
                        this.sharedStylesHost.addStyles(n),
                        this.rendererByCompId.set(l.id, this.defaultRenderer)
                    }
                    return this.defaultRenderer
                }
            }
            begin() {}
            end() {}
        }
        class ka {
            constructor(n) {
                this.eventManager = n,
                this.data = Object.create(null)
            }
            destroy() {}
            createElement(n, l) {
                return l ? document.createElementNS(ga[l] || l, n) : document.createElement(n)
            }
            createComment(n) {
                return document.createComment(n)
            }
            createText(n) {
                return document.createTextNode(n)
            }
            appendChild(n, l) {
                n.appendChild(l)
            }
            insertBefore(n, l, e) {
                n && n.insertBefore(l, e)
            }
            removeChild(n, l) {
                n && n.removeChild(l)
            }
            selectRootElement(n, l) {
                let e = "string" == typeof n ? document.querySelector(n) : n;
                if (!e)
                    throw new Error(`The selector "${n}" did not match any elements`);
                return l || (e.textContent = ""),
                e
            }
            parentNode(n) {
                return n.parentNode
            }
            nextSibling(n) {
                return n.nextSibling
            }
            setAttribute(n, l, e, t) {
                if (t) {
                    l = t + ":" + l;
                    const u = ga[t];
                    u ? n.setAttributeNS(u, l, e) : n.setAttribute(l, e)
                } else
                    n.setAttribute(l, e)
            }
            removeAttribute(n, l, e) {
                if (e) {
                    const t = ga[e];
                    t ? n.removeAttributeNS(t, l) : n.removeAttribute(`${e}:${l}`)
                } else
                    n.removeAttribute(l)
            }
            addClass(n, l) {
                n.classList.add(l)
            }
            removeClass(n, l) {
                n.classList.remove(l)
            }
            setStyle(n, l, e, t) {
                t & ge.DashCase ? n.style.setProperty(l, e, t & ge.Important ? "important" : "") : n.style[l] = e
            }
            removeStyle(n, l, e) {
                e & ge.DashCase ? n.style.removeProperty(l) : n.style[l] = ""
            }
            setProperty(n, l, e) {
                Sa(l, "property"),
                n[l] = e
            }
            setValue(n, l) {
                n.nodeValue = l
            }
            listen(n, l, e) {
                return Sa(l, "listener"),
                "string" == typeof n ? this.eventManager.addGlobalEventListener(n, l, ya(e)) : this.eventManager.addEventListener(n, l, ya(e))
            }
        }
        const Ca = (()=>"@".charCodeAt(0))();
        function Sa(n, l) {
            if (n.charCodeAt(0) === Ca)
                throw new Error(`Found the synthetic ${l} ${n}. Please include either "BrowserAnimationsModule" or "NoopAnimationsModule" in your application.`)
        }
        class xa extends ka {
            constructor(n, l, e, t) {
                super(n),
                this.component = e;
                const u = ba(t + "-" + e.id, e.styles, []);
                l.addStyles(u),
                this.contentAttr = _a.replace(ma, t + "-" + e.id),
                this.hostAttr = function(n) {
                    return va.replace(ma, n)
                }(t + "-" + e.id)
            }
            applyToHost(n) {
                super.setAttribute(n, this.hostAttr, "")
            }
            createElement(n, l) {
                const e = super.createElement(n, l);
                return super.setAttribute(e, this.contentAttr, ""),
                e
            }
        }
        class Aa extends ka {
            constructor(n, l, e, t) {
                super(n),
                this.sharedStylesHost = l,
                this.hostEl = e,
                this.component = t,
                this.shadowRoot = t.encapsulation === Gn.ShadowDom ? e.attachShadow({
                    mode: "open"
                }) : e.createShadowRoot(),
                this.sharedStylesHost.addHost(this.shadowRoot);
                const u = ba(t.id, t.styles, []);
                for (let r = 0; r < u.length; r++) {
                    const n = document.createElement("style");
                    n.textContent = u[r],
                    this.shadowRoot.appendChild(n)
                }
            }
            nodeOrShadowRoot(n) {
                return n === this.hostEl ? this.shadowRoot : n
            }
            destroy() {
                this.sharedStylesHost.removeHost(this.shadowRoot)
            }
            appendChild(n, l) {
                return super.appendChild(this.nodeOrShadowRoot(n), l)
            }
            insertBefore(n, l, e) {
                return super.insertBefore(this.nodeOrShadowRoot(n), l, e)
            }
            removeChild(n, l) {
                return super.removeChild(this.nodeOrShadowRoot(n), l)
            }
            parentNode(n) {
                return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(n)))
            }
        }
        const Ea = (()=>"undefined" != typeof Zone && Zone.__symbol__ || function(n) {
            return "__zone_symbol__" + n
        }
        )()
          , Ta = Ea("addEventListener")
          , Ia = Ea("removeEventListener")
          , Ra = {}
          , Pa = "FALSE"
          , Oa = "ANGULAR"
          , Ma = "addEventListener"
          , Da = "removeEventListener"
          , Na = "__zone_symbol__propagationStopped"
          , La = "__zone_symbol__stopImmediatePropagation"
          , ja = (()=>{
            const n = "undefined" != typeof Zone && Zone[Ea("BLACK_LISTED_EVENTS")];
            if (n) {
                const l = {};
                return n.forEach(n=>{
                    l[n] = n
                }
                ),
                l
            }
        }
        )()
          , Ua = function(n) {
            return !!ja && ja.hasOwnProperty(n)
        }
          , Ha = function(n) {
            const l = Ra[n.type];
            if (!l)
                return;
            const e = this[l];
            if (!e)
                return;
            const t = [n];
            if (1 === e.length) {
                const n = e[0];
                return n.zone !== Zone.current ? n.zone.run(n.handler, this, t) : n.handler.apply(this, t)
            }
            {
                const l = e.slice();
                for (let e = 0; e < l.length && !0 !== n[Na]; e++) {
                    const n = l[e];
                    n.zone !== Zone.current ? n.zone.run(n.handler, this, t) : n.handler.apply(this, t)
                }
            }
        };
        class Fa extends ha {
            constructor(n, l, e) {
                super(n),
                this.ngZone = l,
                e && function(n) {
                    return n === Ks
                }(e) || this.patchEvent()
            }
            patchEvent() {
                if ("undefined" == typeof Event || !Event || !Event.prototype)
                    return;
                if (Event.prototype[La])
                    return;
                const n = Event.prototype[La] = Event.prototype.stopImmediatePropagation;
                Event.prototype.stopImmediatePropagation = function() {
                    this && (this[Na] = !0),
                    n && n.apply(this, arguments)
                }
            }
            supports(n) {
                return !0
            }
            addEventListener(n, l, e) {
                let t = e;
                if (!n[Ta] || ar.isInAngularZone() && !Ua(l))
                    n[Ma](l, t, !1);
                else {
                    let e = Ra[l];
                    e || (e = Ra[l] = Ea(Oa + l + Pa));
                    let u = n[e];
                    const r = u && u.length > 0;
                    u || (u = n[e] = []);
                    const i = Ua(l) ? Zone.root : Zone.current;
                    if (0 === u.length)
                        u.push({
                            zone: i,
                            handler: t
                        });
                    else {
                        let n = !1;
                        for (let l = 0; l < u.length; l++)
                            if (u[l].handler === t) {
                                n = !0;
                                break
                            }
                        n || u.push({
                            zone: i,
                            handler: t
                        })
                    }
                    r || n[Ta](l, Ha, !1)
                }
                return ()=>this.removeEventListener(n, l, t)
            }
            removeEventListener(n, l, e) {
                let t = n[Ia];
                if (!t)
                    return n[Da].apply(n, [l, e, !1]);
                let u = Ra[l]
                  , r = u && n[u];
                if (!r)
                    return n[Da].apply(n, [l, e, !1]);
                let i = !1;
                for (let s = 0; s < r.length; s++)
                    if (r[s].handler === e) {
                        i = !0,
                        r.splice(s, 1);
                        break
                    }
                i ? 0 === r.length && t.apply(n, [l, Ha, !1]) : n[Da].apply(n, [l, e, !1])
            }
        }
        const Va = {
            pan: !0,
            panstart: !0,
            panmove: !0,
            panend: !0,
            pancancel: !0,
            panleft: !0,
            panright: !0,
            panup: !0,
            pandown: !0,
            pinch: !0,
            pinchstart: !0,
            pinchmove: !0,
            pinchend: !0,
            pinchcancel: !0,
            pinchin: !0,
            pinchout: !0,
            press: !0,
            pressup: !0,
            rotate: !0,
            rotatestart: !0,
            rotatemove: !0,
            rotateend: !0,
            rotatecancel: !0,
            swipe: !0,
            swipeleft: !0,
            swiperight: !0,
            swipeup: !0,
            swipedown: !0,
            tap: !0
        }
          , $a = new En("HammerGestureConfig")
          , Ba = new En("HammerLoader");
        class za {
            constructor() {
                this.events = [],
                this.overrides = {}
            }
            buildHammer(n) {
                const l = new Hammer(n,this.options);
                l.get("pinch").set({
                    enable: !0
                }),
                l.get("rotate").set({
                    enable: !0
                });
                for (const e in this.overrides)
                    l.get(e).set(this.overrides[e]);
                return l
            }
        }
        class qa extends ha {
            constructor(n, l, e, t) {
                super(n),
                this._config = l,
                this.console = e,
                this.loader = t
            }
            supports(n) {
                return !(!Va.hasOwnProperty(n.toLowerCase()) && !this.isCustomEvent(n) || !window.Hammer && !this.loader && (this.console.warn(`The "${n}" event cannot be bound because Hammer.JS is not ` + "loaded and no custom loader has been specified."),
                1))
            }
            addEventListener(n, l, e) {
                const t = this.manager.getZone();
                if (l = l.toLowerCase(),
                !window.Hammer && this.loader) {
                    let t = !1
                      , u = ()=>{
                        t = !0
                    }
                    ;
                    return this.loader().then(()=>{
                        if (!window.Hammer)
                            return this.console.warn("The custom HAMMER_LOADER completed, but Hammer.JS is not present."),
                            void (u = ()=>{}
                            );
                        t || (u = this.addEventListener(n, l, e))
                    }
                    ).catch(()=>{
                        this.console.warn(`The "${l}" event cannot be bound because the custom ` + "Hammer.JS loader failed."),
                        u = ()=>{}
                    }
                    ),
                    ()=>{
                        u()
                    }
                }
                return t.runOutsideAngular(()=>{
                    const u = this._config.buildHammer(n)
                      , r = function(n) {
                        t.runGuarded((function() {
                            e(n)
                        }
                        ))
                    };
                    return u.on(l, r),
                    ()=>{
                        u.off(l, r),
                        "function" == typeof u.destroy && u.destroy()
                    }
                }
                )
            }
            isCustomEvent(n) {
                return this._config.events.indexOf(n) > -1
            }
        }
        const Wa = ["alt", "control", "meta", "shift"]
          , Ga = {
            alt: n=>n.altKey,
            control: n=>n.ctrlKey,
            meta: n=>n.metaKey,
            shift: n=>n.shiftKey
        };
        class Ka extends ha {
            constructor(n) {
                super(n)
            }
            supports(n) {
                return null != Ka.parseEventName(n)
            }
            addEventListener(n, l, e) {
                const t = Ka.parseEventName(l)
                  , u = Ka.eventCallback(t.fullKey, e, this.manager.getZone());
                return this.manager.getZone().runOutsideAngular(()=>Wo().onAndCancel(n, t.domEventName, u))
            }
            static parseEventName(n) {
                const l = n.toLowerCase().split(".")
                  , e = l.shift();
                if (0 === l.length || "keydown" !== e && "keyup" !== e)
                    return null;
                const t = Ka._normalizeKey(l.pop());
                let u = "";
                if (Wa.forEach(n=>{
                    const e = l.indexOf(n);
                    e > -1 && (l.splice(e, 1),
                    u += n + ".")
                }
                ),
                u += t,
                0 != l.length || 0 === t.length)
                    return null;
                const r = {};
                return r.domEventName = e,
                r.fullKey = u,
                r
            }
            static getEventFullKey(n) {
                let l = ""
                  , e = Wo().getEventKey(n);
                return e = e.toLowerCase(),
                " " === e ? e = "space" : "." === e && (e = "dot"),
                Wa.forEach(t=>{
                    t != e && (0,
                    Ga[t])(n) && (l += t + ".")
                }
                ),
                l += e,
                l
            }
            static eventCallback(n, l, e) {
                return t=>{
                    Ka.getEventFullKey(t) === n && e.runGuarded(()=>l(t))
                }
            }
            static _normalizeKey(n) {
                switch (n) {
                case "esc":
                    return "escape";
                default:
                    return n
                }
            }
        }
        class Qa {
        }
        class Za extends Qa {
            constructor(n) {
                super(),
                this._doc = n
            }
            sanitize(n, l) {
                if (null == l)
                    return null;
                switch (n) {
                case Al.NONE:
                    return l;
                case Al.HTML:
                    return l instanceof Ja ? l.changingThisBreaksApplicationSecurity : (this.checkNotSafeValue(l, "HTML"),
                    function(n, l) {
                        let e = null;
                        try {
                            Sl = Sl || new rl(n);
                            let t = l ? String(l) : "";
                            e = Sl.getInertBodyElement(t);
                            let u = 5
                              , r = t;
                            do {
                                if (0 === u)
                                    throw new Error("Failed to sanitize html because the input is unstable");
                                u--,
                                t = r,
                                r = e.innerHTML,
                                e = Sl.getInertBodyElement(t)
                            } while (t !== r);const i = new yl
                              , s = i.sanitizeChildren(xl(e) || e);
                            return ul() && i.sanitizedSomething && console.warn("WARNING: sanitizing HTML stripped some content, see http://g.co/ng/security#xss"),
                            s
                        } finally {
                            if (e) {
                                const n = xl(e) || e;
                                for (; n.firstChild; )
                                    n.removeChild(n.firstChild)
                            }
                        }
                    }(this._doc, String(l)));
                case Al.STYLE:
                    return l instanceof Xa ? l.changingThisBreaksApplicationSecurity : (this.checkNotSafeValue(l, "Style"),
                    function(n) {
                        if (!(n = String(n).trim()))
                            return "";
                        const l = n.match(Il);
                        return l && ol(l[1]) === l[1] || n.match(Tl) && function(n) {
                            let l = !0
                              , e = !0;
                            for (let t = 0; t < n.length; t++) {
                                const u = n.charAt(t);
                                "'" === u && e ? l = !l : '"' === u && l && (e = !e)
                            }
                            return l && e
                        }(n) ? n : (ul() && console.warn(`WARNING: sanitizing unsafe style value ${n} (see http://g.co/ng/security#xss).`),
                        "unsafe")
                    }(l));
                case Al.SCRIPT:
                    if (l instanceof nc)
                        return l.changingThisBreaksApplicationSecurity;
                    throw this.checkNotSafeValue(l, "Script"),
                    new Error("unsafe value used in a script context");
                case Al.URL:
                    return l instanceof ec || l instanceof lc ? l.changingThisBreaksApplicationSecurity : (this.checkNotSafeValue(l, "URL"),
                    ol(String(l)));
                case Al.RESOURCE_URL:
                    if (l instanceof ec)
                        return l.changingThisBreaksApplicationSecurity;
                    throw this.checkNotSafeValue(l, "ResourceURL"),
                    new Error("unsafe value used in a resource URL context (see http://g.co/ng/security#xss)");
                default:
                    throw new Error(`Unexpected SecurityContext ${n} (see http://g.co/ng/security#xss)`)
                }
            }
            checkNotSafeValue(n, l) {
                if (n instanceof Ya)
                    throw new Error(`Required a safe ${l}, got a ${n.getTypeName()} ` + "(see http://g.co/ng/security#xss)")
            }
            bypassSecurityTrustHtml(n) {
                return new Ja(n)
            }
            bypassSecurityTrustStyle(n) {
                return new Xa(n)
            }
            bypassSecurityTrustScript(n) {
                return new nc(n)
            }
            bypassSecurityTrustUrl(n) {
                return new lc(n)
            }
            bypassSecurityTrustResourceUrl(n) {
                return new ec(n)
            }
        }
        class Ya {
            constructor(n) {
                this.changingThisBreaksApplicationSecurity = n
            }
            toString() {
                return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity}` + " (see http://g.co/ng/security#xss)"
            }
        }
        class Ja extends Ya {
            getTypeName() {
                return "HTML"
            }
        }
        class Xa extends Ya {
            getTypeName() {
                return "Style"
            }
        }
        class nc extends Ya {
            getTypeName() {
                return "Script"
            }
        }
        class lc extends Ya {
            getTypeName() {
                return "URL"
            }
        }
        class ec extends Ya {
            getTypeName() {
                return "ResourceURL"
            }
        }
        const tc = xr(zr, "browser", [{
            provide: $u,
            useValue: Gs
        }, {
            provide: Vu,
            useValue: function() {
                na.makeCurrent(),
                ia.init()
            },
            multi: !0
        }, {
            provide: ks,
            useClass: class extends ks {
                constructor(n) {
                    super(),
                    this._doc = n,
                    this._init()
                }
                _init() {
                    this.location = Wo().getLocation(),
                    this._history = Wo().getHistory()
                }
                getBaseHrefFromDOM() {
                    return Wo().getBaseHref(this._doc)
                }
                onPopState(n) {
                    Wo().getGlobalEventTarget(this._doc, "window").addEventListener("popstate", n, !1)
                }
                onHashChange(n) {
                    Wo().getGlobalEventTarget(this._doc, "window").addEventListener("hashchange", n, !1)
                }
                get href() {
                    return this.location.href
                }
                get protocol() {
                    return this.location.protocol
                }
                get hostname() {
                    return this.location.hostname
                }
                get port() {
                    return this.location.port
                }
                get pathname() {
                    return this.location.pathname
                }
                get search() {
                    return this.location.search
                }
                get hash() {
                    return this.location.hash
                }
                set pathname(n) {
                    this.location.pathname = n
                }
                pushState(n, l, e) {
                    ta() ? this._history.pushState(n, l, e) : this.location.hash = e
                }
                replaceState(n, l, e) {
                    ta() ? this._history.replaceState(n, l, e) : this.location.hash = e
                }
                forward() {
                    this._history.forward()
                }
                back() {
                    this._history.back()
                }
                getState() {
                    return this._history.state
                }
            }
            ,
            deps: [Ws]
        }, {
            provide: Ws,
            useFactory: function() {
                return document
            },
            deps: []
        }]);
        function uc() {
            return new ll
        }
        class rc {
            constructor(n) {
                if (n)
                    throw new Error("BrowserModule has already been loaded. If you need access to common directives such as NgIf and NgFor from a lazy loaded module, import CommonModule instead.")
            }
            static withServerTransition(n) {
                return {
                    ngModule: rc,
                    providers: [{
                        provide: Uu,
                        useValue: n.appId
                    }, {
                        provide: ua,
                        useExisting: Uu
                    }, ra]
                }
            }
        }
        "undefined" != typeof window && window;
        class ic {
            constructor(n, l) {
                this.id = n,
                this.url = l
            }
        }
        class sc extends ic {
            constructor(n, l, e="imperative", t=null) {
                super(n, l),
                this.navigationTrigger = e,
                this.restoredState = t
            }
            toString() {
                return `NavigationStart(id: ${this.id}, url: '${this.url}')`
            }
        }
        class oc extends ic {
            constructor(n, l, e) {
                super(n, l),
                this.urlAfterRedirects = e
            }
            toString() {
                return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`
            }
        }
        class ac extends ic {
            constructor(n, l, e) {
                super(n, l),
                this.reason = e
            }
            toString() {
                return `NavigationCancel(id: ${this.id}, url: '${this.url}')`
            }
        }
        class cc extends ic {
            constructor(n, l, e) {
                super(n, l),
                this.error = e
            }
            toString() {
                return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`
            }
        }
        class dc extends ic {
            constructor(n, l, e, t) {
                super(n, l),
                this.urlAfterRedirects = e,
                this.state = t
            }
            toString() {
                return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
            }
        }
        class hc extends ic {
            constructor(n, l, e, t) {
                super(n, l),
                this.urlAfterRedirects = e,
                this.state = t
            }
            toString() {
                return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
            }
        }
        class pc extends ic {
            constructor(n, l, e, t, u) {
                super(n, l),
                this.urlAfterRedirects = e,
                this.state = t,
                this.shouldActivate = u
            }
            toString() {
                return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`
            }
        }
        class fc extends ic {
            constructor(n, l, e, t) {
                super(n, l),
                this.urlAfterRedirects = e,
                this.state = t
            }
            toString() {
                return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
            }
        }
        class gc extends ic {
            constructor(n, l, e, t) {
                super(n, l),
                this.urlAfterRedirects = e,
                this.state = t
            }
            toString() {
                return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
            }
        }
        class mc {
            constructor(n) {
                this.route = n
            }
            toString() {
                return `RouteConfigLoadStart(path: ${this.route.path})`
            }
        }
        class vc {
            constructor(n) {
                this.route = n
            }
            toString() {
                return `RouteConfigLoadEnd(path: ${this.route.path})`
            }
        }
        class _c {
            constructor(n) {
                this.snapshot = n
            }
            toString() {
                return `ChildActivationStart(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
            }
        }
        class bc {
            constructor(n) {
                this.snapshot = n
            }
            toString() {
                return `ChildActivationEnd(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
            }
        }
        class yc {
            constructor(n) {
                this.snapshot = n
            }
            toString() {
                return `ActivationStart(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
            }
        }
        class wc {
            constructor(n) {
                this.snapshot = n
            }
            toString() {
                return `ActivationEnd(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
            }
        }
        class kc {
            constructor(n, l, e) {
                this.routerEvent = n,
                this.position = l,
                this.anchor = e
            }
            toString() {
                return `Scroll(anchor: '${this.anchor}', position: '${this.position ? `${this.position[0]}, ${this.position[1]}` : null}')`
            }
        }
        class Cc {
        }
        const Sc = "primary";
        class xc {
            constructor(n) {
                this.params = n || {}
            }
            has(n) {
                return this.params.hasOwnProperty(n)
            }
            get(n) {
                if (this.has(n)) {
                    const l = this.params[n];
                    return Array.isArray(l) ? l[0] : l
                }
                return null
            }
            getAll(n) {
                if (this.has(n)) {
                    const l = this.params[n];
                    return Array.isArray(l) ? l : [l]
                }
                return []
            }
            get keys() {
                return Object.keys(this.params)
            }
        }
        function Ac(n) {
            return new xc(n)
        }
        const Ec = "ngNavigationCancelingError";
        function Tc(n) {
            const l = Error("NavigationCancelingError: " + n);
            return l[Ec] = !0,
            l
        }
        function Ic(n, l, e) {
            const t = e.path.split("/");
            if (t.length > n.length)
                return null;
            if ("full" === e.pathMatch && (l.hasChildren() || t.length < n.length))
                return null;
            const u = {};
            for (let r = 0; r < t.length; r++) {
                const l = t[r]
                  , e = n[r];
                if (l.startsWith(":"))
                    u[l.substring(1)] = e;
                else if (l !== e.path)
                    return null
            }
            return {
                consumed: n.slice(0, t.length),
                posParams: u
            }
        }
        class Rc {
            constructor(n, l) {
                this.routes = n,
                this.module = l
            }
        }
        function Pc(n, l="") {
            for (let e = 0; e < n.length; e++) {
                const t = n[e];
                Oc(t, Mc(l, t))
            }
        }
        function Oc(n, l) {
            if (!n)
                throw new Error(`\n      Invalid configuration of route '${l}': Encountered undefined route.\n      The reason might be an extra comma.\n\n      Example:\n      const routes: Routes = [\n        { path: '', redirectTo: '/dashboard', pathMatch: 'full' },\n        { path: 'dashboard',  component: DashboardComponent },, << two commas\n        { path: 'detail/:id', component: HeroDetailComponent }\n      ];\n    `);
            if (Array.isArray(n))
                throw new Error(`Invalid configuration of route '${l}': Array cannot be specified`);
            if (!n.component && !n.children && !n.loadChildren && n.outlet && n.outlet !== Sc)
                throw new Error(`Invalid configuration of route '${l}': a componentless route without children or loadChildren cannot have a named outlet set`);
            if (n.redirectTo && n.children)
                throw new Error(`Invalid configuration of route '${l}': redirectTo and children cannot be used together`);
            if (n.redirectTo && n.loadChildren)
                throw new Error(`Invalid configuration of route '${l}': redirectTo and loadChildren cannot be used together`);
            if (n.children && n.loadChildren)
                throw new Error(`Invalid configuration of route '${l}': children and loadChildren cannot be used together`);
            if (n.redirectTo && n.component)
                throw new Error(`Invalid configuration of route '${l}': redirectTo and component cannot be used together`);
            if (n.path && n.matcher)
                throw new Error(`Invalid configuration of route '${l}': path and matcher cannot be used together`);
            if (void 0 === n.redirectTo && !n.component && !n.children && !n.loadChildren)
                throw new Error(`Invalid configuration of route '${l}'. One of the following must be provided: component, redirectTo, children or loadChildren`);
            if (void 0 === n.path && void 0 === n.matcher)
                throw new Error(`Invalid configuration of route '${l}': routes must have either a path or a matcher specified`);
            if ("string" == typeof n.path && "/" === n.path.charAt(0))
                throw new Error(`Invalid configuration of route '${l}': path cannot start with a slash`);
            if ("" === n.path && void 0 !== n.redirectTo && void 0 === n.pathMatch)
                throw new Error(`Invalid configuration of route '{path: "${l}", redirectTo: "${n.redirectTo}"}': please provide 'pathMatch'. The default value of 'pathMatch' is 'prefix', but often the intent is to use 'full'.`);
            if (void 0 !== n.pathMatch && "full" !== n.pathMatch && "prefix" !== n.pathMatch)
                throw new Error(`Invalid configuration of route '${l}': pathMatch can only be set to 'prefix' or 'full'`);
            n.children && Pc(n.children, l)
        }
        function Mc(n, l) {
            return l ? n || l.path ? n && !l.path ? `${n}/` : !n && l.path ? l.path : `${n}/${l.path}` : "" : n
        }
        function Dc(n) {
            const l = n.children && n.children.map(Dc)
              , e = l ? Object.assign({}, n, {
                children: l
            }) : Object.assign({}, n);
            return !e.component && (l || e.loadChildren) && e.outlet && e.outlet !== Sc && (e.component = Cc),
            e
        }
        function Nc(n, l) {
            const e = Object.keys(n)
              , t = Object.keys(l);
            if (!e || !t || e.length != t.length)
                return !1;
            let u;
            for (let r = 0; r < e.length; r++)
                if (u = e[r],
                n[u] !== l[u])
                    return !1;
            return !0
        }
        function Lc(n) {
            return Array.prototype.concat.apply([], n)
        }
        function jc(n) {
            return n.length > 0 ? n[n.length - 1] : null
        }
        function Uc(n, l) {
            for (const e in n)
                n.hasOwnProperty(e) && l(n[e], e)
        }
        function Hc(n) {
            return ne(n) ? n : Xl(n) ? W(Promise.resolve(n)) : no(n)
        }
        function Fc(n, l, e) {
            return e ? function(n, l) {
                return Nc(n, l)
            }(n.queryParams, l.queryParams) && function n(l, e) {
                if (!zc(l.segments, e.segments))
                    return !1;
                if (l.numberOfChildren !== e.numberOfChildren)
                    return !1;
                for (const t in e.children) {
                    if (!l.children[t])
                        return !1;
                    if (!n(l.children[t], e.children[t]))
                        return !1
                }
                return !0
            }(n.root, l.root) : function(n, l) {
                return Object.keys(l).length <= Object.keys(n).length && Object.keys(l).every(e=>l[e] === n[e])
            }(n.queryParams, l.queryParams) && function n(l, e) {
                return function l(e, t, u) {
                    if (e.segments.length > u.length)
                        return !!zc(e.segments.slice(0, u.length), u) && !t.hasChildren();
                    if (e.segments.length === u.length) {
                        if (!zc(e.segments, u))
                            return !1;
                        for (const l in t.children) {
                            if (!e.children[l])
                                return !1;
                            if (!n(e.children[l], t.children[l]))
                                return !1
                        }
                        return !0
                    }
                    {
                        const n = u.slice(0, e.segments.length)
                          , r = u.slice(e.segments.length);
                        return !!zc(e.segments, n) && !!e.children[Sc] && l(e.children[Sc], t, r)
                    }
                }(l, e, e.segments)
            }(n.root, l.root)
        }
        class Vc {
            constructor(n, l, e) {
                this.root = n,
                this.queryParams = l,
                this.fragment = e
            }
            get queryParamMap() {
                return this._queryParamMap || (this._queryParamMap = Ac(this.queryParams)),
                this._queryParamMap
            }
            toString() {
                return Kc.serialize(this)
            }
        }
        class $c {
            constructor(n, l) {
                this.segments = n,
                this.children = l,
                this.parent = null,
                Uc(l, (n,l)=>n.parent = this)
            }
            hasChildren() {
                return this.numberOfChildren > 0
            }
            get numberOfChildren() {
                return Object.keys(this.children).length
            }
            toString() {
                return Qc(this)
            }
        }
        class Bc {
            constructor(n, l) {
                this.path = n,
                this.parameters = l
            }
            get parameterMap() {
                return this._parameterMap || (this._parameterMap = Ac(this.parameters)),
                this._parameterMap
            }
            toString() {
                return ld(this)
            }
        }
        function zc(n, l) {
            return n.length === l.length && n.every((n,e)=>n.path === l[e].path)
        }
        function qc(n, l) {
            let e = [];
            return Uc(n.children, (n,t)=>{
                t === Sc && (e = e.concat(l(n, t)))
            }
            ),
            Uc(n.children, (n,t)=>{
                t !== Sc && (e = e.concat(l(n, t)))
            }
            ),
            e
        }
        class Wc {
        }
        class Gc {
            parse(n) {
                const l = new id(n);
                return new Vc(l.parseRootSegment(),l.parseQueryParams(),l.parseFragment())
            }
            serialize(n) {
                var l;
                return `${`/${function n(l, e) {
                    if (!l.hasChildren())
                        return Qc(l);
                    if (e) {
                        const e = l.children[Sc] ? n(l.children[Sc], !1) : ""
                          , t = [];
                        return Uc(l.children, (l,e)=>{
                            e !== Sc && t.push(`${e}:${n(l, !1)}`)
                        }
                        ),
                        t.length > 0 ? `${e}(${t.join("//")})` : e
                    }
                    {
                        const e = qc(l, (e,t)=>t === Sc ? [n(l.children[Sc], !1)] : [`${t}:${n(e, !1)}`]);
                        return `${Qc(l)}/(${e.join("//")})`
                    }
                }(n.root, !0)}`}${function(n) {
                    const l = Object.keys(n).map(l=>{
                        const e = n[l];
                        return Array.isArray(e) ? e.map(n=>`${Yc(l)}=${Yc(n)}`).join("&") : `${Yc(l)}=${Yc(e)}`
                    }
                    );
                    return l.length ? `?${l.join("&")}` : ""
                }(n.queryParams)}${"string" == typeof n.fragment ? `#${l = n.fragment,
                encodeURI(l)}` : ""}`
            }
        }
        const Kc = new Gc;
        function Qc(n) {
            return n.segments.map(n=>ld(n)).join("/")
        }
        function Zc(n) {
            return encodeURIComponent(n).replace(/%40/g, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",")
        }
        function Yc(n) {
            return Zc(n).replace(/%3B/gi, ";")
        }
        function Jc(n) {
            return Zc(n).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&")
        }
        function Xc(n) {
            return decodeURIComponent(n)
        }
        function nd(n) {
            return Xc(n.replace(/\+/g, "%20"))
        }
        function ld(n) {
            return `${Jc(n.path)}${l = n.parameters,
            Object.keys(l).map(n=>`;${Jc(n)}=${Jc(l[n])}`).join("")}`;
            var l
        }
        const ed = /^[^\/()?;=#]+/;
        function td(n) {
            const l = n.match(ed);
            return l ? l[0] : ""
        }
        const ud = /^[^=?&#]+/
          , rd = /^[^?&#]+/;
        class id {
            constructor(n) {
                this.url = n,
                this.remaining = n
            }
            parseRootSegment() {
                return this.consumeOptional("/"),
                "" === this.remaining || this.peekStartsWith("?") || this.peekStartsWith("#") ? new $c([],{}) : new $c([],this.parseChildren())
            }
            parseQueryParams() {
                const n = {};
                if (this.consumeOptional("?"))
                    do {
                        this.parseQueryParam(n)
                    } while (this.consumeOptional("&"));return n
            }
            parseFragment() {
                return this.consumeOptional("#") ? decodeURIComponent(this.remaining) : null
            }
            parseChildren() {
                if ("" === this.remaining)
                    return {};
                this.consumeOptional("/");
                const n = [];
                for (this.peekStartsWith("(") || n.push(this.parseSegment()); this.peekStartsWith("/") && !this.peekStartsWith("//") && !this.peekStartsWith("/("); )
                    this.capture("/"),
                    n.push(this.parseSegment());
                let l = {};
                this.peekStartsWith("/(") && (this.capture("/"),
                l = this.parseParens(!0));
                let e = {};
                return this.peekStartsWith("(") && (e = this.parseParens(!1)),
                (n.length > 0 || Object.keys(l).length > 0) && (e[Sc] = new $c(n,l)),
                e
            }
            parseSegment() {
                const n = td(this.remaining);
                if ("" === n && this.peekStartsWith(";"))
                    throw new Error(`Empty path url segment cannot have parameters: '${this.remaining}'.`);
                return this.capture(n),
                new Bc(Xc(n),this.parseMatrixParams())
            }
            parseMatrixParams() {
                const n = {};
                for (; this.consumeOptional(";"); )
                    this.parseParam(n);
                return n
            }
            parseParam(n) {
                const l = td(this.remaining);
                if (!l)
                    return;
                this.capture(l);
                let e = "";
                if (this.consumeOptional("=")) {
                    const n = td(this.remaining);
                    n && (e = n,
                    this.capture(e))
                }
                n[Xc(l)] = Xc(e)
            }
            parseQueryParam(n) {
                const l = function(n) {
                    const l = n.match(ud);
                    return l ? l[0] : ""
                }(this.remaining);
                if (!l)
                    return;
                this.capture(l);
                let e = "";
                if (this.consumeOptional("=")) {
                    const n = function(n) {
                        const l = n.match(rd);
                        return l ? l[0] : ""
                    }(this.remaining);
                    n && (e = n,
                    this.capture(e))
                }
                const t = nd(l)
                  , u = nd(e);
                if (n.hasOwnProperty(t)) {
                    let l = n[t];
                    Array.isArray(l) || (l = [l],
                    n[t] = l),
                    l.push(u)
                } else
                    n[t] = u
            }
            parseParens(n) {
                const l = {};
                for (this.capture("("); !this.consumeOptional(")") && this.remaining.length > 0; ) {
                    const e = td(this.remaining)
                      , t = this.remaining[e.length];
                    if ("/" !== t && ")" !== t && ";" !== t)
                        throw new Error(`Cannot parse url '${this.url}'`);
                    let u = void 0;
                    e.indexOf(":") > -1 ? (u = e.substr(0, e.indexOf(":")),
                    this.capture(u),
                    this.capture(":")) : n && (u = Sc);
                    const r = this.parseChildren();
                    l[u] = 1 === Object.keys(r).length ? r[Sc] : new $c([],r),
                    this.consumeOptional("//")
                }
                return l
            }
            peekStartsWith(n) {
                return this.remaining.startsWith(n)
            }
            consumeOptional(n) {
                return !!this.peekStartsWith(n) && (this.remaining = this.remaining.substring(n.length),
                !0)
            }
            capture(n) {
                if (!this.consumeOptional(n))
                    throw new Error(`Expected "${n}".`)
            }
        }
        class sd {
            constructor(n) {
                this._root = n
            }
            get root() {
                return this._root.value
            }
            parent(n) {
                const l = this.pathFromRoot(n);
                return l.length > 1 ? l[l.length - 2] : null
            }
            children(n) {
                const l = od(n, this._root);
                return l ? l.children.map(n=>n.value) : []
            }
            firstChild(n) {
                const l = od(n, this._root);
                return l && l.children.length > 0 ? l.children[0].value : null
            }
            siblings(n) {
                const l = ad(n, this._root);
                return l.length < 2 ? [] : l[l.length - 2].children.map(n=>n.value).filter(l=>l !== n)
            }
            pathFromRoot(n) {
                return ad(n, this._root).map(n=>n.value)
            }
        }
        function od(n, l) {
            if (n === l.value)
                return l;
            for (const e of l.children) {
                const l = od(n, e);
                if (l)
                    return l
            }
            return null
        }
        function ad(n, l) {
            if (n === l.value)
                return [l];
            for (const e of l.children) {
                const t = ad(n, e);
                if (t.length)
                    return t.unshift(l),
                    t
            }
            return []
        }
        class cd {
            constructor(n, l) {
                this.value = n,
                this.children = l
            }
            toString() {
                return `TreeNode(${this.value})`
            }
        }
        function dd(n) {
            const l = {};
            return n && n.children.forEach(n=>l[n.value.outlet] = n),
            l
        }
        class hd extends sd {
            constructor(n, l) {
                super(n),
                this.snapshot = l,
                _d(this, n)
            }
            toString() {
                return this.snapshot.toString()
            }
        }
        function pd(n, l) {
            const e = function(n, l) {
                const e = new md([],{},{},"",{},Sc,l,null,n.root,-1,{});
                return new vd("",new cd(e,[]))
            }(n, l)
              , t = new lo([new Bc("",{})])
              , u = new lo({})
              , r = new lo({})
              , i = new lo({})
              , s = new lo("")
              , o = new fd(t,u,i,s,r,Sc,l,e.root);
            return o.snapshot = e.root,
            new hd(new cd(o,[]),e)
        }
        class fd {
            constructor(n, l, e, t, u, r, i, s) {
                this.url = n,
                this.params = l,
                this.queryParams = e,
                this.fragment = t,
                this.data = u,
                this.outlet = r,
                this.component = i,
                this._futureSnapshot = s
            }
            get routeConfig() {
                return this._futureSnapshot.routeConfig
            }
            get root() {
                return this._routerState.root
            }
            get parent() {
                return this._routerState.parent(this)
            }
            get firstChild() {
                return this._routerState.firstChild(this)
            }
            get children() {
                return this._routerState.children(this)
            }
            get pathFromRoot() {
                return this._routerState.pathFromRoot(this)
            }
            get paramMap() {
                return this._paramMap || (this._paramMap = this.params.pipe($(n=>Ac(n)))),
                this._paramMap
            }
            get queryParamMap() {
                return this._queryParamMap || (this._queryParamMap = this.queryParams.pipe($(n=>Ac(n)))),
                this._queryParamMap
            }
            toString() {
                return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`
            }
        }
        function gd(n, l="emptyOnly") {
            const e = n.pathFromRoot;
            let t = 0;
            if ("always" !== l)
                for (t = e.length - 1; t >= 1; ) {
                    const n = e[t]
                      , l = e[t - 1];
                    if (n.routeConfig && "" === n.routeConfig.path)
                        t--;
                    else {
                        if (l.component)
                            break;
                        t--
                    }
                }
            return function(n) {
                return n.reduce((n,l)=>({
                    params: Object.assign({}, n.params, l.params),
                    data: Object.assign({}, n.data, l.data),
                    resolve: Object.assign({}, n.resolve, l._resolvedData)
                }), {
                    params: {},
                    data: {},
                    resolve: {}
                })
            }(e.slice(t))
        }
        class md {
            constructor(n, l, e, t, u, r, i, s, o, a, c) {
                this.url = n,
                this.params = l,
                this.queryParams = e,
                this.fragment = t,
                this.data = u,
                this.outlet = r,
                this.component = i,
                this.routeConfig = s,
                this._urlSegment = o,
                this._lastPathIndex = a,
                this._resolve = c
            }
            get root() {
                return this._routerState.root
            }
            get parent() {
                return this._routerState.parent(this)
            }
            get firstChild() {
                return this._routerState.firstChild(this)
            }
            get children() {
                return this._routerState.children(this)
            }
            get pathFromRoot() {
                return this._routerState.pathFromRoot(this)
            }
            get paramMap() {
                return this._paramMap || (this._paramMap = Ac(this.params)),
                this._paramMap
            }
            get queryParamMap() {
                return this._queryParamMap || (this._queryParamMap = Ac(this.queryParams)),
                this._queryParamMap
            }
            toString() {
                return `Route(url:'${this.url.map(n=>n.toString()).join("/")}', path:'${this.routeConfig ? this.routeConfig.path : ""}')`
            }
        }
        class vd extends sd {
            constructor(n, l) {
                super(l),
                this.url = n,
                _d(this, l)
            }
            toString() {
                return bd(this._root)
            }
        }
        function _d(n, l) {
            l.value._routerState = n,
            l.children.forEach(l=>_d(n, l))
        }
        function bd(n) {
            const l = n.children.length > 0 ? ` { ${n.children.map(bd).join(", ")} } ` : "";
            return `${n.value}${l}`
        }
        function yd(n) {
            if (n.snapshot) {
                const l = n.snapshot
                  , e = n._futureSnapshot;
                n.snapshot = e,
                Nc(l.queryParams, e.queryParams) || n.queryParams.next(e.queryParams),
                l.fragment !== e.fragment && n.fragment.next(e.fragment),
                Nc(l.params, e.params) || n.params.next(e.params),
                function(n, l) {
                    if (n.length !== l.length)
                        return !1;
                    for (let e = 0; e < n.length; ++e)
                        if (!Nc(n[e], l[e]))
                            return !1;
                    return !0
                }(l.url, e.url) || n.url.next(e.url),
                Nc(l.data, e.data) || n.data.next(e.data)
            } else
                n.snapshot = n._futureSnapshot,
                n.data.next(n._futureSnapshot.data)
        }
        function wd(n, l) {
            var e, t;
            return Nc(n.params, l.params) && zc(e = n.url, t = l.url) && e.every((n,l)=>Nc(n.parameters, t[l].parameters)) && !(!n.parent != !l.parent) && (!n.parent || wd(n.parent, l.parent))
        }
        function kd(n) {
            return "object" == typeof n && null != n && !n.outlets && !n.segmentPath
        }
        function Cd(n, l, e, t, u) {
            let r = {};
            return t && Uc(t, (n,l)=>{
                r[l] = Array.isArray(n) ? n.map(n=>`${n}`) : `${n}`
            }
            ),
            new Vc(e.root === n ? l : function n(l, e, t) {
                const u = {};
                return Uc(l.children, (l,r)=>{
                    u[r] = l === e ? t : n(l, e, t)
                }
                ),
                new $c(l.segments,u)
            }(e.root, n, l),r,u)
        }
        class Sd {
            constructor(n, l, e) {
                if (this.isAbsolute = n,
                this.numberOfDoubleDots = l,
                this.commands = e,
                n && e.length > 0 && kd(e[0]))
                    throw new Error("Root segment cannot have matrix parameters");
                const t = e.find(n=>"object" == typeof n && null != n && n.outlets);
                if (t && t !== jc(e))
                    throw new Error("{outlets:{}} has to be the last command")
            }
            toRoot() {
                return this.isAbsolute && 1 === this.commands.length && "/" == this.commands[0]
            }
        }
        class xd {
            constructor(n, l, e) {
                this.segmentGroup = n,
                this.processChildren = l,
                this.index = e
            }
        }
        function Ad(n) {
            return "object" == typeof n && null != n && n.outlets ? n.outlets[Sc] : `${n}`
        }
        function Ed(n, l, e) {
            if (n || (n = new $c([],{})),
            0 === n.segments.length && n.hasChildren())
                return Td(n, l, e);
            const t = function(n, l, e) {
                let t = 0
                  , u = l;
                const r = {
                    match: !1,
                    pathIndex: 0,
                    commandIndex: 0
                };
                for (; u < n.segments.length; ) {
                    if (t >= e.length)
                        return r;
                    const l = n.segments[u]
                      , i = Ad(e[t])
                      , s = t < e.length - 1 ? e[t + 1] : null;
                    if (u > 0 && void 0 === i)
                        break;
                    if (i && s && "object" == typeof s && void 0 === s.outlets) {
                        if (!Od(i, s, l))
                            return r;
                        t += 2
                    } else {
                        if (!Od(i, {}, l))
                            return r;
                        t++
                    }
                    u++
                }
                return {
                    match: !0,
                    pathIndex: u,
                    commandIndex: t
                }
            }(n, l, e)
              , u = e.slice(t.commandIndex);
            if (t.match && t.pathIndex < n.segments.length) {
                const l = new $c(n.segments.slice(0, t.pathIndex),{});
                return l.children[Sc] = new $c(n.segments.slice(t.pathIndex),n.children),
                Td(l, 0, u)
            }
            return t.match && 0 === u.length ? new $c(n.segments,{}) : t.match && !n.hasChildren() ? Id(n, l, e) : t.match ? Td(n, 0, u) : Id(n, l, e)
        }
        function Td(n, l, e) {
            if (0 === e.length)
                return new $c(n.segments,{});
            {
                const t = function(n) {
                    return "object" != typeof n[0] ? {
                        [Sc]: n
                    } : void 0 === n[0].outlets ? {
                        [Sc]: n
                    } : n[0].outlets
                }(e)
                  , u = {};
                return Uc(t, (e,t)=>{
                    null !== e && (u[t] = Ed(n.children[t], l, e))
                }
                ),
                Uc(n.children, (n,l)=>{
                    void 0 === t[l] && (u[l] = n)
                }
                ),
                new $c(n.segments,u)
            }
        }
        function Id(n, l, e) {
            const t = n.segments.slice(0, l);
            let u = 0;
            for (; u < e.length; ) {
                if ("object" == typeof e[u] && void 0 !== e[u].outlets) {
                    const n = Rd(e[u].outlets);
                    return new $c(t,n)
                }
                if (0 === u && kd(e[0])) {
                    t.push(new Bc(n.segments[l].path,e[0])),
                    u++;
                    continue
                }
                const r = Ad(e[u])
                  , i = u < e.length - 1 ? e[u + 1] : null;
                r && i && kd(i) ? (t.push(new Bc(r,Pd(i))),
                u += 2) : (t.push(new Bc(r,{})),
                u++)
            }
            return new $c(t,{})
        }
        function Rd(n) {
            const l = {};
            return Uc(n, (n,e)=>{
                null !== n && (l[e] = Id(new $c([],{}), 0, n))
            }
            ),
            l
        }
        function Pd(n) {
            const l = {};
            return Uc(n, (n,e)=>l[e] = `${n}`),
            l
        }
        function Od(n, l, e) {
            return n == e.path && Nc(l, e.parameters)
        }
        const Md = (n,l,e)=>$(t=>(new Dd(l,t.targetRouterState,t.currentRouterState,e).activate(n),
        t));
        class Dd {
            constructor(n, l, e, t) {
                this.routeReuseStrategy = n,
                this.futureState = l,
                this.currState = e,
                this.forwardEvent = t
            }
            activate(n) {
                const l = this.futureState._root
                  , e = this.currState ? this.currState._root : null;
                this.deactivateChildRoutes(l, e, n),
                yd(this.futureState.root),
                this.activateChildRoutes(l, e, n)
            }
            deactivateChildRoutes(n, l, e) {
                const t = dd(l);
                n.children.forEach(n=>{
                    const l = n.value.outlet;
                    this.deactivateRoutes(n, t[l], e),
                    delete t[l]
                }
                ),
                Uc(t, (n,l)=>{
                    this.deactivateRouteAndItsChildren(n, e)
                }
                )
            }
            deactivateRoutes(n, l, e) {
                const t = n.value
                  , u = l ? l.value : null;
                if (t === u)
                    if (t.component) {
                        const u = e.getContext(t.outlet);
                        u && this.deactivateChildRoutes(n, l, u.children)
                    } else
                        this.deactivateChildRoutes(n, l, e);
                else
                    u && this.deactivateRouteAndItsChildren(l, e)
            }
            deactivateRouteAndItsChildren(n, l) {
                this.routeReuseStrategy.shouldDetach(n.value.snapshot) ? this.detachAndStoreRouteSubtree(n, l) : this.deactivateRouteAndOutlet(n, l)
            }
            detachAndStoreRouteSubtree(n, l) {
                const e = l.getContext(n.value.outlet);
                if (e && e.outlet) {
                    const l = e.outlet.detach()
                      , t = e.children.onOutletDeactivated();
                    this.routeReuseStrategy.store(n.value.snapshot, {
                        componentRef: l,
                        route: n,
                        contexts: t
                    })
                }
            }
            deactivateRouteAndOutlet(n, l) {
                const e = l.getContext(n.value.outlet);
                if (e) {
                    const t = dd(n)
                      , u = n.value.component ? e.children : l;
                    Uc(t, (n,l)=>this.deactivateRouteAndItsChildren(n, u)),
                    e.outlet && (e.outlet.deactivate(),
                    e.children.onOutletDeactivated())
                }
            }
            activateChildRoutes(n, l, e) {
                const t = dd(l);
                n.children.forEach(n=>{
                    this.activateRoutes(n, t[n.value.outlet], e),
                    this.forwardEvent(new wc(n.value.snapshot))
                }
                ),
                n.children.length && this.forwardEvent(new bc(n.value.snapshot))
            }
            activateRoutes(n, l, e) {
                const t = n.value
                  , u = l ? l.value : null;
                if (yd(t),
                t === u)
                    if (t.component) {
                        const u = e.getOrCreateContext(t.outlet);
                        this.activateChildRoutes(n, l, u.children)
                    } else
                        this.activateChildRoutes(n, l, e);
                else if (t.component) {
                    const l = e.getOrCreateContext(t.outlet);
                    if (this.routeReuseStrategy.shouldAttach(t.snapshot)) {
                        const n = this.routeReuseStrategy.retrieve(t.snapshot);
                        this.routeReuseStrategy.store(t.snapshot, null),
                        l.children.onOutletReAttached(n.contexts),
                        l.attachRef = n.componentRef,
                        l.route = n.route.value,
                        l.outlet && l.outlet.attach(n.componentRef, n.route.value),
                        Nd(n.route)
                    } else {
                        const e = function(n) {
                            for (let l = n.parent; l; l = l.parent) {
                                const n = l.routeConfig;
                                if (n && n._loadedConfig)
                                    return n._loadedConfig;
                                if (n && n.component)
                                    return null
                            }
                            return null
                        }(t.snapshot)
                          , u = e ? e.module.componentFactoryResolver : null;
                        l.attachRef = null,
                        l.route = t,
                        l.resolver = u,
                        l.outlet && l.outlet.activateWith(t, u),
                        this.activateChildRoutes(n, null, l.children)
                    }
                } else
                    this.activateChildRoutes(n, null, e)
            }
        }
        function Nd(n) {
            yd(n.value),
            n.children.forEach(Nd)
        }
        function Ld(n) {
            return "function" == typeof n
        }
        function jd(n) {
            return n instanceof Vc
        }
        class Ud {
            constructor(n) {
                this.segmentGroup = n || null
            }
        }
        class Hd {
            constructor(n) {
                this.urlTree = n
            }
        }
        function Fd(n) {
            return new w(l=>l.error(new Ud(n)))
        }
        function Vd(n) {
            return new w(l=>l.error(new Hd(n)))
        }
        function $d(n) {
            return new w(l=>l.error(new Error(`Only absolute redirects can have named outlets. redirectTo: '${n}'`)))
        }
        class Bd {
            constructor(n, l, e, t, u) {
                this.configLoader = l,
                this.urlSerializer = e,
                this.urlTree = t,
                this.config = u,
                this.allowRedirects = !0,
                this.ngModule = n.get(Bn)
            }
            apply() {
                return this.expandSegmentGroup(this.ngModule, this.config, this.urlTree.root, Sc).pipe($(n=>this.createUrlTree(n, this.urlTree.queryParams, this.urlTree.fragment))).pipe(Eo(n=>{
                    if (n instanceof Hd)
                        return this.allowRedirects = !1,
                        this.match(n.urlTree);
                    if (n instanceof Ud)
                        throw this.noMatchError(n);
                    throw n
                }
                ))
            }
            match(n) {
                return this.expandSegmentGroup(this.ngModule, this.config, n.root, Sc).pipe($(l=>this.createUrlTree(l, n.queryParams, n.fragment))).pipe(Eo(n=>{
                    if (n instanceof Ud)
                        throw this.noMatchError(n);
                    throw n
                }
                ))
            }
            noMatchError(n) {
                return new Error(`Cannot match any routes. URL Segment: '${n.segmentGroup}'`)
            }
            createUrlTree(n, l, e) {
                const t = n.segments.length > 0 ? new $c([],{
                    [Sc]: n
                }) : n;
                return new Vc(t,l,e)
            }
            expandSegmentGroup(n, l, e, t) {
                return 0 === e.segments.length && e.hasChildren() ? this.expandChildren(n, l, e).pipe($(n=>new $c([],n))) : this.expandSegment(n, e, l, e.segments, t, !0)
            }
            expandChildren(n, l, e) {
                return function(n, l) {
                    if (0 === Object.keys(n).length)
                        return no({});
                    const e = []
                      , t = []
                      , u = {};
                    return Uc(n, (n,r)=>{
                        const i = l(r, n).pipe($(n=>u[r] = n));
                        r === Sc ? e.push(i) : t.push(i)
                    }
                    ),
                    no.apply(null, e.concat(t)).pipe(oo(), Ao(), $(()=>u))
                }(e.children, (e,t)=>this.expandSegmentGroup(n, l, t, e))
            }
            expandSegment(n, l, e, t, u, r) {
                return no(...e).pipe($(i=>this.expandSegmentAgainstRoute(n, l, e, i, t, u, r).pipe(Eo(n=>{
                    if (n instanceof Ud)
                        return no(null);
                    throw n
                }
                ))), oo(), Mo(n=>!!n), Eo((n,e)=>{
                    if (n instanceof to || "EmptyError" === n.name) {
                        if (this.noLeftoversInUrl(l, t, u))
                            return no(new $c([],{}));
                        throw new Ud(l)
                    }
                    throw n
                }
                ))
            }
            noLeftoversInUrl(n, l, e) {
                return 0 === l.length && !n.children[e]
            }
            expandSegmentAgainstRoute(n, l, e, t, u, r, i) {
                return Gd(t) !== r ? Fd(l) : void 0 === t.redirectTo ? this.matchSegmentAgainstRoute(n, l, t, u) : i && this.allowRedirects ? this.expandSegmentAgainstRouteUsingRedirect(n, l, e, t, u, r) : Fd(l)
            }
            expandSegmentAgainstRouteUsingRedirect(n, l, e, t, u, r) {
                return "**" === t.path ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(n, e, t, r) : this.expandRegularSegmentAgainstRouteUsingRedirect(n, l, e, t, u, r)
            }
            expandWildCardWithParamsAgainstRouteUsingRedirect(n, l, e, t) {
                const u = this.applyRedirectCommands([], e.redirectTo, {});
                return e.redirectTo.startsWith("/") ? Vd(u) : this.lineralizeSegments(e, u).pipe(G(e=>{
                    const u = new $c(e,{});
                    return this.expandSegment(n, u, l, e, t, !1)
                }
                ))
            }
            expandRegularSegmentAgainstRouteUsingRedirect(n, l, e, t, u, r) {
                const {matched: i, consumedSegments: s, lastChild: o, positionalParamSegments: a} = zd(l, t, u);
                if (!i)
                    return Fd(l);
                const c = this.applyRedirectCommands(s, t.redirectTo, a);
                return t.redirectTo.startsWith("/") ? Vd(c) : this.lineralizeSegments(t, c).pipe(G(t=>this.expandSegment(n, l, e, t.concat(u.slice(o)), r, !1)))
            }
            matchSegmentAgainstRoute(n, l, e, t) {
                if ("**" === e.path)
                    return e.loadChildren ? this.configLoader.load(n.injector, e).pipe($(n=>(e._loadedConfig = n,
                    new $c(t,{})))) : no(new $c(t,{}));
                const {matched: u, consumedSegments: r, lastChild: i} = zd(l, e, t);
                if (!u)
                    return Fd(l);
                const s = t.slice(i);
                return this.getChildConfig(n, e, t).pipe(G(n=>{
                    const e = n.module
                      , t = n.routes
                      , {segmentGroup: u, slicedSegments: i} = function(n, l, e, t) {
                        return e.length > 0 && function(n, l, e) {
                            return e.some(e=>Wd(n, l, e) && Gd(e) !== Sc)
                        }(n, e, t) ? {
                            segmentGroup: qd(new $c(l,function(n, l) {
                                const e = {};
                                e[Sc] = l;
                                for (const t of n)
                                    "" === t.path && Gd(t) !== Sc && (e[Gd(t)] = new $c([],{}));
                                return e
                            }(t, new $c(e,n.children)))),
                            slicedSegments: []
                        } : 0 === e.length && function(n, l, e) {
                            return e.some(e=>Wd(n, l, e))
                        }(n, e, t) ? {
                            segmentGroup: qd(new $c(n.segments,function(n, l, e, t) {
                                const u = {};
                                for (const r of e)
                                    Wd(n, l, r) && !t[Gd(r)] && (u[Gd(r)] = new $c([],{}));
                                return Object.assign({}, t, u)
                            }(n, e, t, n.children))),
                            slicedSegments: e
                        } : {
                            segmentGroup: n,
                            slicedSegments: e
                        }
                    }(l, r, s, t);
                    return 0 === i.length && u.hasChildren() ? this.expandChildren(e, t, u).pipe($(n=>new $c(r,n))) : 0 === t.length && 0 === i.length ? no(new $c(r,{})) : this.expandSegment(e, u, t, i, Sc, !0).pipe($(n=>new $c(r.concat(n.segments),n.children)))
                }
                ))
            }
            getChildConfig(n, l, e) {
                return l.children ? no(new Rc(l.children,n)) : l.loadChildren ? void 0 !== l._loadedConfig ? no(l._loadedConfig) : function(n, l, e) {
                    const t = l.canLoad;
                    return t && 0 !== t.length ? W(t).pipe($(t=>{
                        const u = n.get(t);
                        let r;
                        if (function(n) {
                            return n && Ld(n.canLoad)
                        }(u))
                            r = u.canLoad(l, e);
                        else {
                            if (!Ld(u))
                                throw new Error("Invalid CanLoad guard");
                            r = u(l, e)
                        }
                        return Hc(r)
                    }
                    )).pipe(oo(), (u = n=>!0 === n,
                    n=>n.lift(new Do(u,void 0,n)))) : no(!0);
                    var u
                }(n.injector, l, e).pipe(G(e=>e ? this.configLoader.load(n.injector, l).pipe($(n=>(l._loadedConfig = n,
                n))) : function(n) {
                    return new w(l=>l.error(Tc(`Cannot load children because the guard of the route "path: '${n.path}'" returned false`)))
                }(l))) : no(new Rc([],n))
            }
            lineralizeSegments(n, l) {
                let e = []
                  , t = l.root;
                for (; ; ) {
                    if (e = e.concat(t.segments),
                    0 === t.numberOfChildren)
                        return no(e);
                    if (t.numberOfChildren > 1 || !t.children[Sc])
                        return $d(n.redirectTo);
                    t = t.children[Sc]
                }
            }
            applyRedirectCommands(n, l, e) {
                return this.applyRedirectCreatreUrlTree(l, this.urlSerializer.parse(l), n, e)
            }
            applyRedirectCreatreUrlTree(n, l, e, t) {
                const u = this.createSegmentGroup(n, l.root, e, t);
                return new Vc(u,this.createQueryParams(l.queryParams, this.urlTree.queryParams),l.fragment)
            }
            createQueryParams(n, l) {
                const e = {};
                return Uc(n, (n,t)=>{
                    if ("string" == typeof n && n.startsWith(":")) {
                        const u = n.substring(1);
                        e[t] = l[u]
                    } else
                        e[t] = n
                }
                ),
                e
            }
            createSegmentGroup(n, l, e, t) {
                const u = this.createSegments(n, l.segments, e, t);
                let r = {};
                return Uc(l.children, (l,u)=>{
                    r[u] = this.createSegmentGroup(n, l, e, t)
                }
                ),
                new $c(u,r)
            }
            createSegments(n, l, e, t) {
                return l.map(l=>l.path.startsWith(":") ? this.findPosParam(n, l, t) : this.findOrReturn(l, e))
            }
            findPosParam(n, l, e) {
                const t = e[l.path.substring(1)];
                if (!t)
                    throw new Error(`Cannot redirect to '${n}'. Cannot find '${l.path}'.`);
                return t
            }
            findOrReturn(n, l) {
                let e = 0;
                for (const t of l) {
                    if (t.path === n.path)
                        return l.splice(e),
                        t;
                    e++
                }
                return n
            }
        }
        function zd(n, l, e) {
            if ("" === l.path)
                return "full" === l.pathMatch && (n.hasChildren() || e.length > 0) ? {
                    matched: !1,
                    consumedSegments: [],
                    lastChild: 0,
                    positionalParamSegments: {}
                } : {
                    matched: !0,
                    consumedSegments: [],
                    lastChild: 0,
                    positionalParamSegments: {}
                };
            const t = (l.matcher || Ic)(e, n, l);
            return t ? {
                matched: !0,
                consumedSegments: t.consumed,
                lastChild: t.consumed.length,
                positionalParamSegments: t.posParams
            } : {
                matched: !1,
                consumedSegments: [],
                lastChild: 0,
                positionalParamSegments: {}
            }
        }
        function qd(n) {
            if (1 === n.numberOfChildren && n.children[Sc]) {
                const l = n.children[Sc];
                return new $c(n.segments.concat(l.segments),l.children)
            }
            return n
        }
        function Wd(n, l, e) {
            return (!(n.hasChildren() || l.length > 0) || "full" !== e.pathMatch) && "" === e.path && void 0 !== e.redirectTo
        }
        function Gd(n) {
            return n.outlet || Sc
        }
        class Kd {
            constructor(n) {
                this.path = n,
                this.route = this.path[this.path.length - 1]
            }
        }
        class Qd {
            constructor(n, l) {
                this.component = n,
                this.route = l
            }
        }
        function Zd(n, l, e) {
            const t = n._root;
            return function n(l, e, t, u, r={
                canDeactivateChecks: [],
                canActivateChecks: []
            }) {
                const i = dd(e);
                return l.children.forEach(l=>{
                    !function(l, e, t, u, r={
                        canDeactivateChecks: [],
                        canActivateChecks: []
                    }) {
                        const i = l.value
                          , s = e ? e.value : null
                          , o = t ? t.getContext(l.value.outlet) : null;
                        if (s && i.routeConfig === s.routeConfig) {
                            const a = function(n, l, e) {
                                if ("function" == typeof e)
                                    return e(n, l);
                                switch (e) {
                                case "pathParamsChange":
                                    return !zc(n.url, l.url);
                                case "pathParamsOrQueryParamsChange":
                                    return !zc(n.url, l.url) || !Nc(n.queryParams, l.queryParams);
                                case "always":
                                    return !0;
                                case "paramsOrQueryParamsChange":
                                    return !wd(n, l) || !Nc(n.queryParams, l.queryParams);
                                case "paramsChange":
                                default:
                                    return !wd(n, l)
                                }
                            }(s, i, i.routeConfig.runGuardsAndResolvers);
                            a ? r.canActivateChecks.push(new Kd(u)) : (i.data = s.data,
                            i._resolvedData = s._resolvedData),
                            n(l, e, i.component ? o ? o.children : null : t, u, r),
                            a && r.canDeactivateChecks.push(new Qd(o && o.outlet && o.outlet.component || null,s))
                        } else
                            s && Jd(e, o, r),
                            r.canActivateChecks.push(new Kd(u)),
                            n(l, null, i.component ? o ? o.children : null : t, u, r)
                    }(l, i[l.value.outlet], t, u.concat([l.value]), r),
                    delete i[l.value.outlet]
                }
                ),
                Uc(i, (n,l)=>Jd(n, t.getContext(l), r)),
                r
            }(t, l ? l._root : null, e, [t.value])
        }
        function Yd(n, l, e) {
            const t = function(n) {
                if (!n)
                    return null;
                for (let l = n.parent; l; l = l.parent) {
                    const n = l.routeConfig;
                    if (n && n._loadedConfig)
                        return n._loadedConfig
                }
                return null
            }(l);
            return (t ? t.module.injector : e).get(n)
        }
        function Jd(n, l, e) {
            const t = dd(n)
              , u = n.value;
            Uc(t, (n,t)=>{
                Jd(n, u.component ? l ? l.children.getContext(t) : null : l, e)
            }
            ),
            e.canDeactivateChecks.push(new Qd(u.component && l && l.outlet && l.outlet.isActivated ? l.outlet.component : null,u))
        }
        const Xd = Symbol("INITIAL_VALUE");
        function nh() {
            return Lo(n=>(function(...n) {
                let l = null
                  , e = null;
                return I(n[n.length - 1]) && (e = n.pop()),
                "function" == typeof n[n.length - 1] && (l = n.pop()),
                1 === n.length && o(n[0]) && (n = n[0]),
                q(n, e).lift(new ro(l))
            }
            )(...n.map(n=>n.pipe(Ro(1), function(...n) {
                return l=>{
                    let e = n[n.length - 1];
                    I(e) ? n.pop() : e = null;
                    const t = n.length;
                    return function(...n) {
                        return oo()(no(...n))
                    }(1 !== t || e ? t > 0 ? q(n, e) : Js(e) : Xs(n[0]), l)
                }
            }(Xd)))).pipe(Ho((n,l)=>{
                let e = !1;
                return l.reduce((n,t,u)=>{
                    if (n !== Xd)
                        return n;
                    if (t === Xd && (e = !0),
                    !e) {
                        if (!1 === t)
                            return t;
                        if (u === l.length - 1 || jd(t))
                            return t
                    }
                    return n
                }
                , n)
            }
            , Xd), ao(n=>n !== Xd), $(n=>jd(n) ? n : !0 === n), Ro(1)))
        }
        function lh(n, l) {
            return null !== n && l && l(new yc(n)),
            no(!0)
        }
        function eh(n, l) {
            return null !== n && l && l(new _c(n)),
            no(!0)
        }
        function th(n, l, e) {
            const t = l.routeConfig ? l.routeConfig.canActivate : null;
            return t && 0 !== t.length ? no(t.map(t=>so(()=>{
                const u = Yd(t, l, e);
                let r;
                if (function(n) {
                    return n && Ld(n.canActivate)
                }(u))
                    r = Hc(u.canActivate(l, n));
                else {
                    if (!Ld(u))
                        throw new Error("Invalid CanActivate guard");
                    r = Hc(u(l, n))
                }
                return r.pipe(Mo())
            }
            ))).pipe(nh()) : no(!0)
        }
        function uh(n, l, e) {
            const t = l[l.length - 1]
              , u = l.slice(0, l.length - 1).reverse().map(n=>(function(n) {
                const l = n.routeConfig ? n.routeConfig.canActivateChild : null;
                return l && 0 !== l.length ? {
                    node: n,
                    guards: l
                } : null
            }
            )(n)).filter(n=>null !== n).map(l=>so(()=>no(l.guards.map(u=>{
                const r = Yd(u, l.node, e);
                let i;
                if (function(n) {
                    return n && Ld(n.canActivateChild)
                }(r))
                    i = Hc(r.canActivateChild(t, n));
                else {
                    if (!Ld(r))
                        throw new Error("Invalid CanActivateChild guard");
                    i = Hc(r(t, n))
                }
                return i.pipe(Mo())
            }
            )).pipe(nh())));
            return no(u).pipe(nh())
        }
        class rh {
        }
        class ih {
            constructor(n, l, e, t, u, r) {
                this.rootComponentType = n,
                this.config = l,
                this.urlTree = e,
                this.url = t,
                this.paramsInheritanceStrategy = u,
                this.relativeLinkResolution = r
            }
            recognize() {
                try {
                    const n = ah(this.urlTree.root, [], [], this.config, this.relativeLinkResolution).segmentGroup
                      , l = this.processSegmentGroup(this.config, n, Sc)
                      , e = new md([],Object.freeze({}),Object.freeze(Object.assign({}, this.urlTree.queryParams)),this.urlTree.fragment,{},Sc,this.rootComponentType,null,this.urlTree.root,-1,{})
                      , t = new cd(e,l)
                      , u = new vd(this.url,t);
                    return this.inheritParamsAndData(u._root),
                    no(u)
                } catch (n) {
                    return new w(l=>l.error(n))
                }
            }
            inheritParamsAndData(n) {
                const l = n.value
                  , e = gd(l, this.paramsInheritanceStrategy);
                l.params = Object.freeze(e.params),
                l.data = Object.freeze(e.data),
                n.children.forEach(n=>this.inheritParamsAndData(n))
            }
            processSegmentGroup(n, l, e) {
                return 0 === l.segments.length && l.hasChildren() ? this.processChildren(n, l) : this.processSegment(n, l, l.segments, e)
            }
            processChildren(n, l) {
                const e = qc(l, (l,e)=>this.processSegmentGroup(n, l, e));
                return function(n) {
                    const l = {};
                    n.forEach(n=>{
                        const e = l[n.value.outlet];
                        if (e) {
                            const l = e.url.map(n=>n.toString()).join("/")
                              , t = n.value.url.map(n=>n.toString()).join("/");
                            throw new Error(`Two segments cannot have the same outlet name: '${l}' and '${t}'.`)
                        }
                        l[n.value.outlet] = n.value
                    }
                    )
                }(e),
                e.sort((n,l)=>n.value.outlet === Sc ? -1 : l.value.outlet === Sc ? 1 : n.value.outlet.localeCompare(l.value.outlet)),
                e
            }
            processSegment(n, l, e, t) {
                for (const r of n)
                    try {
                        return this.processSegmentAgainstRoute(r, l, e, t)
                    } catch (u) {
                        if (!(u instanceof rh))
                            throw u
                    }
                if (this.noLeftoversInUrl(l, e, t))
                    return [];
                throw new rh
            }
            noLeftoversInUrl(n, l, e) {
                return 0 === l.length && !n.children[e]
            }
            processSegmentAgainstRoute(n, l, e, t) {
                if (n.redirectTo)
                    throw new rh;
                if ((n.outlet || Sc) !== t)
                    throw new rh;
                let u, r = [], i = [];
                if ("**" === n.path) {
                    const r = e.length > 0 ? jc(e).parameters : {};
                    u = new md(e,r,Object.freeze(Object.assign({}, this.urlTree.queryParams)),this.urlTree.fragment,hh(n),t,n.component,n,sh(l),oh(l) + e.length,ph(n))
                } else {
                    const s = function(n, l, e) {
                        if ("" === l.path) {
                            if ("full" === l.pathMatch && (n.hasChildren() || e.length > 0))
                                throw new rh;
                            return {
                                consumedSegments: [],
                                lastChild: 0,
                                parameters: {}
                            }
                        }
                        const t = (l.matcher || Ic)(e, n, l);
                        if (!t)
                            throw new rh;
                        const u = {};
                        Uc(t.posParams, (n,l)=>{
                            u[l] = n.path
                        }
                        );
                        const r = t.consumed.length > 0 ? Object.assign({}, u, t.consumed[t.consumed.length - 1].parameters) : u;
                        return {
                            consumedSegments: t.consumed,
                            lastChild: t.consumed.length,
                            parameters: r
                        }
                    }(l, n, e);
                    r = s.consumedSegments,
                    i = e.slice(s.lastChild),
                    u = new md(r,s.parameters,Object.freeze(Object.assign({}, this.urlTree.queryParams)),this.urlTree.fragment,hh(n),t,n.component,n,sh(l),oh(l) + r.length,ph(n))
                }
                const s = function(n) {
                    return n.children ? n.children : n.loadChildren ? n._loadedConfig.routes : []
                }(n)
                  , {segmentGroup: o, slicedSegments: a} = ah(l, r, i, s, this.relativeLinkResolution);
                if (0 === a.length && o.hasChildren()) {
                    const n = this.processChildren(s, o);
                    return [new cd(u,n)]
                }
                if (0 === s.length && 0 === a.length)
                    return [new cd(u,[])];
                const c = this.processSegment(s, o, a, Sc);
                return [new cd(u,c)]
            }
        }
        function sh(n) {
            let l = n;
            for (; l._sourceSegment; )
                l = l._sourceSegment;
            return l
        }
        function oh(n) {
            let l = n
              , e = l._segmentIndexShift ? l._segmentIndexShift : 0;
            for (; l._sourceSegment; )
                l = l._sourceSegment,
                e += l._segmentIndexShift ? l._segmentIndexShift : 0;
            return e - 1
        }
        function ah(n, l, e, t, u) {
            if (e.length > 0 && function(n, l, e) {
                return e.some(e=>ch(n, l, e) && dh(e) !== Sc)
            }(n, e, t)) {
                const u = new $c(l,function(n, l, e, t) {
                    const u = {};
                    u[Sc] = t,
                    t._sourceSegment = n,
                    t._segmentIndexShift = l.length;
                    for (const r of e)
                        if ("" === r.path && dh(r) !== Sc) {
                            const e = new $c([],{});
                            e._sourceSegment = n,
                            e._segmentIndexShift = l.length,
                            u[dh(r)] = e
                        }
                    return u
                }(n, l, t, new $c(e,n.children)));
                return u._sourceSegment = n,
                u._segmentIndexShift = l.length,
                {
                    segmentGroup: u,
                    slicedSegments: []
                }
            }
            if (0 === e.length && function(n, l, e) {
                return e.some(e=>ch(n, l, e))
            }(n, e, t)) {
                const r = new $c(n.segments,function(n, l, e, t, u, r) {
                    const i = {};
                    for (const s of t)
                        if (ch(n, e, s) && !u[dh(s)]) {
                            const e = new $c([],{});
                            e._sourceSegment = n,
                            e._segmentIndexShift = "legacy" === r ? n.segments.length : l.length,
                            i[dh(s)] = e
                        }
                    return Object.assign({}, u, i)
                }(n, l, e, t, n.children, u));
                return r._sourceSegment = n,
                r._segmentIndexShift = l.length,
                {
                    segmentGroup: r,
                    slicedSegments: e
                }
            }
            const r = new $c(n.segments,n.children);
            return r._sourceSegment = n,
            r._segmentIndexShift = l.length,
            {
                segmentGroup: r,
                slicedSegments: e
            }
        }
        function ch(n, l, e) {
            return (!(n.hasChildren() || l.length > 0) || "full" !== e.pathMatch) && "" === e.path && void 0 === e.redirectTo
        }
        function dh(n) {
            return n.outlet || Sc
        }
        function hh(n) {
            return n.data || {}
        }
        function ph(n) {
            return n.resolve || {}
        }
        function fh(n, l, e, t) {
            const u = Yd(n, l, t);
            return Hc(u.resolve ? u.resolve(l, e) : u(l, e))
        }
        function gh(n) {
            return function(l) {
                return l.pipe(Lo(l=>{
                    const e = n(l);
                    return e ? W(e).pipe($(()=>l)) : W([l])
                }
                ))
            }
        }
        class mh {
        }
        class vh {
            shouldDetach(n) {
                return !1
            }
            store(n, l) {}
            shouldAttach(n) {
                return !1
            }
            retrieve(n) {
                return null
            }
            shouldReuseRoute(n, l) {
                return n.routeConfig === l.routeConfig
            }
        }
        const _h = new En("ROUTES");
        class bh {
            constructor(n, l, e, t) {
                this.loader = n,
                this.compiler = l,
                this.onLoadStartListener = e,
                this.onLoadEndListener = t
            }
            load(n, l) {
                return this.onLoadStartListener && this.onLoadStartListener(l),
                this.loadModuleFactory(l.loadChildren).pipe($(e=>{
                    this.onLoadEndListener && this.onLoadEndListener(l);
                    const t = e.create(n);
                    return new Rc(Lc(t.injector.get(_h)).map(Dc),t)
                }
                ))
            }
            loadModuleFactory(n) {
                return "string" == typeof n ? W(this.loader.load(n)) : Hc(n()).pipe(G(n=>n instanceof zn ? no(n) : W(this.compiler.compileModuleAsync(n))))
            }
        }
        class yh {
        }
        class wh {
            shouldProcessUrl(n) {
                return !0
            }
            extract(n) {
                return n
            }
            merge(n, l) {
                return n
            }
        }
        function kh(n) {
            throw n
        }
        function Ch(n, l, e) {
            return l.parse("/")
        }
        function Sh(n, l) {
            return no(null)
        }
        class xh {
            constructor(n, l, e, t, u, r, i, s) {
                this.rootComponentType = n,
                this.urlSerializer = l,
                this.rootContexts = e,
                this.location = t,
                this.config = s,
                this.lastSuccessfulNavigation = null,
                this.currentNavigation = null,
                this.navigationId = 0,
                this.isNgZoneEnabled = !1,
                this.events = new E,
                this.errorHandler = kh,
                this.malformedUriErrorHandler = Ch,
                this.navigated = !1,
                this.lastSuccessfulId = -1,
                this.hooks = {
                    beforePreactivation: Sh,
                    afterPreactivation: Sh
                },
                this.urlHandlingStrategy = new wh,
                this.routeReuseStrategy = new vh,
                this.onSameUrlNavigation = "ignore",
                this.paramsInheritanceStrategy = "emptyOnly",
                this.urlUpdateStrategy = "deferred",
                this.relativeLinkResolution = "legacy",
                this.ngModule = u.get(Bn),
                this.console = u.get(zu);
                const o = u.get(ar);
                this.isNgZoneEnabled = o instanceof ar,
                this.resetConfig(s),
                this.currentUrlTree = new Vc(new $c([],{}),{},null),
                this.rawUrlTree = this.currentUrlTree,
                this.browserUrlTree = this.currentUrlTree,
                this.configLoader = new bh(r,i,n=>this.triggerEvent(new mc(n)),n=>this.triggerEvent(new vc(n))),
                this.routerState = pd(this.currentUrlTree, this.rootComponentType),
                this.transitions = new lo({
                    id: 0,
                    currentUrlTree: this.currentUrlTree,
                    currentRawUrl: this.currentUrlTree,
                    extractedUrl: this.urlHandlingStrategy.extract(this.currentUrlTree),
                    urlAfterRedirects: this.urlHandlingStrategy.extract(this.currentUrlTree),
                    rawUrl: this.currentUrlTree,
                    extras: {},
                    resolve: null,
                    reject: null,
                    promise: Promise.resolve(!0),
                    source: "imperative",
                    restoredState: null,
                    currentSnapshot: this.routerState.snapshot,
                    targetSnapshot: null,
                    currentRouterState: this.routerState,
                    targetRouterState: null,
                    guards: {
                        canActivateChecks: [],
                        canDeactivateChecks: []
                    },
                    guardsResult: null
                }),
                this.navigations = this.setupNavigations(this.transitions),
                this.processNavigations()
            }
            setupNavigations(n) {
                const l = this.events;
                return n.pipe(ao(n=>0 !== n.id), $(n=>Object.assign({}, n, {
                    extractedUrl: this.urlHandlingStrategy.extract(n.rawUrl)
                })), Lo(n=>{
                    let e = !1
                      , t = !1;
                    return no(n).pipe(_o(n=>{
                        this.currentNavigation = {
                            id: n.id,
                            initialUrl: n.currentRawUrl,
                            extractedUrl: n.extractedUrl,
                            trigger: n.source,
                            extras: n.extras,
                            previousNavigation: this.lastSuccessfulNavigation ? Object.assign({}, this.lastSuccessfulNavigation, {
                                previousNavigation: null
                            }) : null
                        }
                    }
                    ), Lo(n=>{
                        const e = !this.navigated || n.extractedUrl.toString() !== this.browserUrlTree.toString();
                        if (("reload" === this.onSameUrlNavigation || e) && this.urlHandlingStrategy.shouldProcessUrl(n.rawUrl))
                            return no(n).pipe(Lo(n=>{
                                const e = this.transitions.getValue();
                                return l.next(new sc(n.id,this.serializeUrl(n.extractedUrl),n.source,n.restoredState)),
                                e !== this.transitions.getValue() ? Ys : [n]
                            }
                            ), Lo(n=>Promise.resolve(n)), function(n, l, e, t) {
                                return function(u) {
                                    return u.pipe(Lo(u=>(function(n, l, e, t, u) {
                                        return new Bd(n,l,e,t,u).apply()
                                    }
                                    )(n, l, e, u.extractedUrl, t).pipe($(n=>Object.assign({}, u, {
                                        urlAfterRedirects: n
                                    })))))
                                }
                            }(this.ngModule.injector, this.configLoader, this.urlSerializer, this.config), _o(n=>{
                                this.currentNavigation = Object.assign({}, this.currentNavigation, {
                                    finalUrl: n.urlAfterRedirects
                                })
                            }
                            ), function(n, l, e, t, u) {
                                return function(r) {
                                    return r.pipe(G(r=>(function(n, l, e, t, u="emptyOnly", r="legacy") {
                                        return new ih(n,l,e,t,u,r).recognize()
                                    }
                                    )(n, l, r.urlAfterRedirects, e(r.urlAfterRedirects), t, u).pipe($(n=>Object.assign({}, r, {
                                        targetSnapshot: n
                                    })))))
                                }
                            }(this.rootComponentType, this.config, n=>this.serializeUrl(n), this.paramsInheritanceStrategy, this.relativeLinkResolution), _o(n=>{
                                "eager" === this.urlUpdateStrategy && (n.extras.skipLocationChange || this.setBrowserUrl(n.urlAfterRedirects, !!n.extras.replaceUrl, n.id, n.extras.state),
                                this.browserUrlTree = n.urlAfterRedirects)
                            }
                            ), _o(n=>{
                                const e = new dc(n.id,this.serializeUrl(n.extractedUrl),this.serializeUrl(n.urlAfterRedirects),n.targetSnapshot);
                                l.next(e)
                            }
                            ));
                        if (e && this.rawUrlTree && this.urlHandlingStrategy.shouldProcessUrl(this.rawUrlTree)) {
                            const {id: e, extractedUrl: t, source: u, restoredState: r, extras: i} = n
                              , s = new sc(e,this.serializeUrl(t),u,r);
                            l.next(s);
                            const o = pd(t, this.rootComponentType).snapshot;
                            return no(Object.assign({}, n, {
                                targetSnapshot: o,
                                urlAfterRedirects: t,
                                extras: Object.assign({}, i, {
                                    skipLocationChange: !1,
                                    replaceUrl: !1
                                })
                            }))
                        }
                        return this.rawUrlTree = n.rawUrl,
                        this.browserUrlTree = n.urlAfterRedirects,
                        n.resolve(null),
                        Ys
                    }
                    ), gh(n=>{
                        const {targetSnapshot: l, id: e, extractedUrl: t, rawUrl: u, extras: {skipLocationChange: r, replaceUrl: i}} = n;
                        return this.hooks.beforePreactivation(l, {
                            navigationId: e,
                            appliedUrlTree: t,
                            rawUrlTree: u,
                            skipLocationChange: !!r,
                            replaceUrl: !!i
                        })
                    }
                    ), _o(n=>{
                        const l = new hc(n.id,this.serializeUrl(n.extractedUrl),this.serializeUrl(n.urlAfterRedirects),n.targetSnapshot);
                        this.triggerEvent(l)
                    }
                    ), $(n=>Object.assign({}, n, {
                        guards: Zd(n.targetSnapshot, n.currentSnapshot, this.rootContexts)
                    })), function(n, l) {
                        return function(e) {
                            return e.pipe(G(e=>{
                                const {targetSnapshot: t, currentSnapshot: u, guards: {canActivateChecks: r, canDeactivateChecks: i}} = e;
                                return 0 === i.length && 0 === r.length ? no(Object.assign({}, e, {
                                    guardsResult: !0
                                })) : function(n, l, e, t) {
                                    return W(n).pipe(G(n=>(function(n, l, e, t, u) {
                                        const r = l && l.routeConfig ? l.routeConfig.canDeactivate : null;
                                        return r && 0 !== r.length ? no(r.map(r=>{
                                            const i = Yd(r, l, u);
                                            let s;
                                            if (function(n) {
                                                return n && Ld(n.canDeactivate)
                                            }(i))
                                                s = Hc(i.canDeactivate(n, l, e, t));
                                            else {
                                                if (!Ld(i))
                                                    throw new Error("Invalid CanDeactivate guard");
                                                s = Hc(i(n, l, e, t))
                                            }
                                            return s.pipe(Mo())
                                        }
                                        )).pipe(nh()) : no(!0)
                                    }
                                    )(n.component, n.route, e, l, t)), Mo(n=>!0 !== n, !0))
                                }(i, t, u, n).pipe(G(e=>e && function(n) {
                                    return "boolean" == typeof n
                                }(e) ? function(n, l, e, t) {
                                    return W(l).pipe($o(l=>W([eh(l.route.parent, t), lh(l.route, t), uh(n, l.path, e), th(n, l.route, e)]).pipe(oo(), Mo(n=>!0 !== n, !0))), Mo(n=>!0 !== n, !0))
                                }(t, r, n, l) : no(e)), $(n=>Object.assign({}, e, {
                                    guardsResult: n
                                })))
                            }
                            ))
                        }
                    }(this.ngModule.injector, n=>this.triggerEvent(n)), _o(n=>{
                        if (jd(n.guardsResult)) {
                            const l = Tc(`Redirecting to "${this.serializeUrl(n.guardsResult)}"`);
                            throw l.url = n.guardsResult,
                            l
                        }
                    }
                    ), _o(n=>{
                        const l = new pc(n.id,this.serializeUrl(n.extractedUrl),this.serializeUrl(n.urlAfterRedirects),n.targetSnapshot,!!n.guardsResult);
                        this.triggerEvent(l)
                    }
                    ), ao(n=>{
                        if (!n.guardsResult) {
                            this.resetUrlToCurrentUrlTree();
                            const e = new ac(n.id,this.serializeUrl(n.extractedUrl),"");
                            return l.next(e),
                            n.resolve(!1),
                            !1
                        }
                        return !0
                    }
                    ), gh(n=>{
                        if (n.guards.canActivateChecks.length)
                            return no(n).pipe(_o(n=>{
                                const l = new fc(n.id,this.serializeUrl(n.extractedUrl),this.serializeUrl(n.urlAfterRedirects),n.targetSnapshot);
                                this.triggerEvent(l)
                            }
                            ), function(n, l) {
                                return function(e) {
                                    return e.pipe(G(e=>{
                                        const {targetSnapshot: t, guards: {canActivateChecks: u}} = e;
                                        return u.length ? W(u).pipe($o(e=>(function(n, l, e, t) {
                                            return function(n, l, e, t) {
                                                const u = Object.keys(n);
                                                if (0 === u.length)
                                                    return no({});
                                                if (1 === u.length) {
                                                    const r = u[0];
                                                    return fh(n[r], l, e, t).pipe($(n=>({
                                                        [r]: n
                                                    })))
                                                }
                                                const r = {};
                                                return W(u).pipe(G(u=>fh(n[u], l, e, t).pipe($(n=>(r[u] = n,
                                                n))))).pipe(Ao(), $(()=>r))
                                            }(n._resolve, n, l, t).pipe($(l=>(n._resolvedData = l,
                                            n.data = Object.assign({}, n.data, gd(n, e).resolve),
                                            null)))
                                        }
                                        )(e.route, t, n, l)), function(n, l) {
                                            return arguments.length >= 2 ? function(e) {
                                                return b(Ho(n, l), go(1), Co(l))(e)
                                            }
                                            : function(l) {
                                                return b(Ho((l,e,t)=>n(l, e, t + 1)), go(1))(l)
                                            }
                                        }((n,l)=>n), $(n=>e)) : no(e)
                                    }
                                    ))
                                }
                            }(this.paramsInheritanceStrategy, this.ngModule.injector), _o(n=>{
                                const l = new gc(n.id,this.serializeUrl(n.extractedUrl),this.serializeUrl(n.urlAfterRedirects),n.targetSnapshot);
                                this.triggerEvent(l)
                            }
                            ))
                    }
                    ), gh(n=>{
                        const {targetSnapshot: l, id: e, extractedUrl: t, rawUrl: u, extras: {skipLocationChange: r, replaceUrl: i}} = n;
                        return this.hooks.afterPreactivation(l, {
                            navigationId: e,
                            appliedUrlTree: t,
                            rawUrlTree: u,
                            skipLocationChange: !!r,
                            replaceUrl: !!i
                        })
                    }
                    ), $(n=>{
                        const l = function(n, l, e) {
                            const t = function n(l, e, t) {
                                if (t && l.shouldReuseRoute(e.value, t.value.snapshot)) {
                                    const u = t.value;
                                    u._futureSnapshot = e.value;
                                    const r = function(l, e, t) {
                                        return e.children.map(e=>{
                                            for (const u of t.children)
                                                if (l.shouldReuseRoute(u.value.snapshot, e.value))
                                                    return n(l, e, u);
                                            return n(l, e)
                                        }
                                        )
                                    }(l, e, t);
                                    return new cd(u,r)
                                }
                                {
                                    const t = l.retrieve(e.value);
                                    if (t) {
                                        const n = t.route;
                                        return function n(l, e) {
                                            if (l.value.routeConfig !== e.value.routeConfig)
                                                throw new Error("Cannot reattach ActivatedRouteSnapshot created from a different route");
                                            if (l.children.length !== e.children.length)
                                                throw new Error("Cannot reattach ActivatedRouteSnapshot with a different number of children");
                                            e.value._futureSnapshot = l.value;
                                            for (let t = 0; t < l.children.length; ++t)
                                                n(l.children[t], e.children[t])
                                        }(e, n),
                                        n
                                    }
                                    {
                                        const t = new fd(new lo((u = e.value).url),new lo(u.params),new lo(u.queryParams),new lo(u.fragment),new lo(u.data),u.outlet,u.component,u)
                                          , r = e.children.map(e=>n(l, e));
                                        return new cd(t,r)
                                    }
                                }
                                var u
                            }(n, l._root, e ? e._root : void 0);
                            return new hd(t,l)
                        }(this.routeReuseStrategy, n.targetSnapshot, n.currentRouterState);
                        return Object.assign({}, n, {
                            targetRouterState: l
                        })
                    }
                    ), _o(n=>{
                        this.currentUrlTree = n.urlAfterRedirects,
                        this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, n.rawUrl),
                        this.routerState = n.targetRouterState,
                        "deferred" === this.urlUpdateStrategy && (n.extras.skipLocationChange || this.setBrowserUrl(this.rawUrlTree, !!n.extras.replaceUrl, n.id, n.extras.state),
                        this.browserUrlTree = n.urlAfterRedirects)
                    }
                    ), Md(this.rootContexts, this.routeReuseStrategy, n=>this.triggerEvent(n)), _o({
                        next() {
                            e = !0
                        },
                        complete() {
                            e = !0
                        }
                    }), function(n) {
                        return l=>l.lift(new Bo(n))
                    }(()=>{
                        if (!e && !t) {
                            this.resetUrlToCurrentUrlTree();
                            const e = new ac(n.id,this.serializeUrl(n.extractedUrl),`Navigation ID ${n.id} is not equal to the current navigation id ${this.navigationId}`);
                            l.next(e),
                            n.resolve(!1)
                        }
                        this.currentNavigation = null
                    }
                    ), Eo(e=>{
                        if (t = !0,
                        function(n) {
                            return n && n[Ec]
                        }(e)) {
                            const t = jd(e.url);
                            t || (this.navigated = !0,
                            this.resetStateAndUrl(n.currentRouterState, n.currentUrlTree, n.rawUrl));
                            const u = new ac(n.id,this.serializeUrl(n.extractedUrl),e.message);
                            l.next(u),
                            n.resolve(!1),
                            t && this.navigateByUrl(e.url)
                        } else {
                            this.resetStateAndUrl(n.currentRouterState, n.currentUrlTree, n.rawUrl);
                            const t = new cc(n.id,this.serializeUrl(n.extractedUrl),e);
                            l.next(t);
                            try {
                                n.resolve(this.errorHandler(e))
                            } catch (u) {
                                n.reject(u)
                            }
                        }
                        return Ys
                    }
                    ))
                }
                ))
            }
            resetRootComponentType(n) {
                this.rootComponentType = n,
                this.routerState.root.component = this.rootComponentType
            }
            getTransition() {
                const n = this.transitions.value;
                return n.urlAfterRedirects = this.browserUrlTree,
                n
            }
            setTransition(n) {
                this.transitions.next(Object.assign({}, this.getTransition(), n))
            }
            initialNavigation() {
                this.setUpLocationChangeListener(),
                0 === this.navigationId && this.navigateByUrl(this.location.path(!0), {
                    replaceUrl: !0
                })
            }
            setUpLocationChangeListener() {
                this.locationSubscription || (this.locationSubscription = this.location.subscribe(n=>{
                    let l = this.parseUrl(n.url);
                    const e = "popstate" === n.type ? "popstate" : "hashchange"
                      , t = n.state && n.state.navigationId ? n.state : null;
                    setTimeout(()=>{
                        this.scheduleNavigation(l, e, t, {
                            replaceUrl: !0
                        })
                    }
                    , 0)
                }
                ))
            }
            get url() {
                return this.serializeUrl(this.currentUrlTree)
            }
            getCurrentNavigation() {
                return this.currentNavigation
            }
            triggerEvent(n) {
                this.events.next(n)
            }
            resetConfig(n) {
                Pc(n),
                this.config = n.map(Dc),
                this.navigated = !1,
                this.lastSuccessfulId = -1
            }
            ngOnDestroy() {
                this.dispose()
            }
            dispose() {
                this.locationSubscription && (this.locationSubscription.unsubscribe(),
                this.locationSubscription = null)
            }
            createUrlTree(n, l={}) {
                const {relativeTo: e, queryParams: t, fragment: u, preserveQueryParams: r, queryParamsHandling: i, preserveFragment: s} = l;
                ul() && r && console && console.warn && console.warn("preserveQueryParams is deprecated, use queryParamsHandling instead.");
                const o = e || this.routerState.root
                  , a = s ? this.currentUrlTree.fragment : u;
                let c = null;
                if (i)
                    switch (i) {
                    case "merge":
                        c = Object.assign({}, this.currentUrlTree.queryParams, t);
                        break;
                    case "preserve":
                        c = this.currentUrlTree.queryParams;
                        break;
                    default:
                        c = t || null
                    }
                else
                    c = r ? this.currentUrlTree.queryParams : t || null;
                return null !== c && (c = this.removeEmptyProps(c)),
                function(n, l, e, t, u) {
                    if (0 === e.length)
                        return Cd(l.root, l.root, l, t, u);
                    const r = function(n) {
                        if ("string" == typeof n[0] && 1 === n.length && "/" === n[0])
                            return new Sd(!0,0,n);
                        let l = 0
                          , e = !1;
                        const t = n.reduce((n,t,u)=>{
                            if ("object" == typeof t && null != t) {
                                if (t.outlets) {
                                    const l = {};
                                    return Uc(t.outlets, (n,e)=>{
                                        l[e] = "string" == typeof n ? n.split("/") : n
                                    }
                                    ),
                                    [...n, {
                                        outlets: l
                                    }]
                                }
                                if (t.segmentPath)
                                    return [...n, t.segmentPath]
                            }
                            return "string" != typeof t ? [...n, t] : 0 === u ? (t.split("/").forEach((t,u)=>{
                                0 == u && "." === t || (0 == u && "" === t ? e = !0 : ".." === t ? l++ : "" != t && n.push(t))
                            }
                            ),
                            n) : [...n, t]
                        }
                        , []);
                        return new Sd(e,l,t)
                    }(e);
                    if (r.toRoot())
                        return Cd(l.root, new $c([],{}), l, t, u);
                    const i = function(n, l, e) {
                        if (n.isAbsolute)
                            return new xd(l.root,!0,0);
                        if (-1 === e.snapshot._lastPathIndex)
                            return new xd(e.snapshot._urlSegment,!0,0);
                        const t = kd(n.commands[0]) ? 0 : 1;
                        return function(n, l, e) {
                            let t = n
                              , u = l
                              , r = e;
                            for (; r > u; ) {
                                if (r -= u,
                                t = t.parent,
                                !t)
                                    throw new Error("Invalid number of '../'");
                                u = t.segments.length
                            }
                            return new xd(t,!1,u - r)
                        }(e.snapshot._urlSegment, e.snapshot._lastPathIndex + t, n.numberOfDoubleDots)
                    }(r, l, n)
                      , s = i.processChildren ? Td(i.segmentGroup, i.index, r.commands) : Ed(i.segmentGroup, i.index, r.commands);
                    return Cd(i.segmentGroup, s, l, t, u)
                }(o, this.currentUrlTree, n, c, a)
            }
            navigateByUrl(n, l={
                skipLocationChange: !1
            }) {
                ul() && this.isNgZoneEnabled && !ar.isInAngularZone() && this.console.warn("Navigation triggered outside Angular zone, did you forget to call 'ngZone.run()'?");
                const e = jd(n) ? n : this.parseUrl(n)
                  , t = this.urlHandlingStrategy.merge(e, this.rawUrlTree);
                return this.scheduleNavigation(t, "imperative", null, l)
            }
            navigate(n, l={
                skipLocationChange: !1
            }) {
                return function(n) {
                    for (let l = 0; l < n.length; l++) {
                        const e = n[l];
                        if (null == e)
                            throw new Error(`The requested path contains ${e} segment at index ${l}`)
                    }
                }(n),
                this.navigateByUrl(this.createUrlTree(n, l), l)
            }
            serializeUrl(n) {
                return this.urlSerializer.serialize(n)
            }
            parseUrl(n) {
                let l;
                try {
                    l = this.urlSerializer.parse(n)
                } catch (e) {
                    l = this.malformedUriErrorHandler(e, this.urlSerializer, n)
                }
                return l
            }
            isActive(n, l) {
                if (jd(n))
                    return Fc(this.currentUrlTree, n, l);
                const e = this.parseUrl(n);
                return Fc(this.currentUrlTree, e, l)
            }
            removeEmptyProps(n) {
                return Object.keys(n).reduce((l,e)=>{
                    const t = n[e];
                    return null != t && (l[e] = t),
                    l
                }
                , {})
            }
            processNavigations() {
                this.navigations.subscribe(n=>{
                    this.navigated = !0,
                    this.lastSuccessfulId = n.id,
                    this.events.next(new oc(n.id,this.serializeUrl(n.extractedUrl),this.serializeUrl(this.currentUrlTree))),
                    this.lastSuccessfulNavigation = this.currentNavigation,
                    this.currentNavigation = null,
                    n.resolve(!0)
                }
                , n=>{
                    this.console.warn("Unhandled Navigation Error: ")
                }
                )
            }
            scheduleNavigation(n, l, e, t) {
                const u = this.getTransition();
                if (u && "imperative" !== l && "imperative" === u.source && u.rawUrl.toString() === n.toString())
                    return Promise.resolve(!0);
                if (u && "hashchange" == l && "popstate" === u.source && u.rawUrl.toString() === n.toString())
                    return Promise.resolve(!0);
                if (u && "popstate" == l && "hashchange" === u.source && u.rawUrl.toString() === n.toString())
                    return Promise.resolve(!0);
                let r = null
                  , i = null;
                const s = new Promise((n,l)=>{
                    r = n,
                    i = l
                }
                )
                  , o = ++this.navigationId;
                return this.setTransition({
                    id: o,
                    source: l,
                    restoredState: e,
                    currentUrlTree: this.currentUrlTree,
                    currentRawUrl: this.rawUrlTree,
                    rawUrl: n,
                    extras: t,
                    resolve: r,
                    reject: i,
                    promise: s,
                    currentSnapshot: this.routerState.snapshot,
                    currentRouterState: this.routerState
                }),
                s.catch(n=>Promise.reject(n))
            }
            setBrowserUrl(n, l, e, t) {
                const u = this.urlSerializer.serialize(n);
                t = t || {},
                this.location.isCurrentPathEqualTo(u) || l ? this.location.replaceState(u, "", Object.assign({}, t, {
                    navigationId: e
                })) : this.location.go(u, "", Object.assign({}, t, {
                    navigationId: e
                }))
            }
            resetStateAndUrl(n, l, e) {
                this.routerState = n,
                this.currentUrlTree = l,
                this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, e),
                this.resetUrlToCurrentUrlTree()
            }
            resetUrlToCurrentUrlTree() {
                this.location.replaceState(this.urlSerializer.serialize(this.rawUrlTree), "", {
                    navigationId: this.lastSuccessfulId
                })
            }
        }
        class Ah {
            constructor(n, l, e, t, u) {
                this.router = n,
                this.route = l,
                this.commands = [],
                null == e && t.setAttribute(u.nativeElement, "tabindex", "0")
            }
            set routerLink(n) {
                this.commands = null != n ? Array.isArray(n) ? n : [n] : []
            }
            set preserveQueryParams(n) {
                ul() && console && console.warn && console.warn("preserveQueryParams is deprecated!, use queryParamsHandling instead."),
                this.preserve = n
            }
            onClick() {
                const n = {
                    skipLocationChange: Th(this.skipLocationChange),
                    replaceUrl: Th(this.replaceUrl)
                };
                return this.router.navigateByUrl(this.urlTree, n),
                !0
            }
            get urlTree() {
                return this.router.createUrlTree(this.commands, {
                    relativeTo: this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    preserveQueryParams: Th(this.preserve),
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: Th(this.preserveFragment)
                })
            }
        }
        class Eh {
            constructor(n, l, e) {
                this.router = n,
                this.route = l,
                this.locationStrategy = e,
                this.commands = [],
                this.subscription = n.events.subscribe(n=>{
                    n instanceof oc && this.updateTargetUrlAndHref()
                }
                )
            }
            set routerLink(n) {
                this.commands = null != n ? Array.isArray(n) ? n : [n] : []
            }
            set preserveQueryParams(n) {
                ul() && console && console.warn && console.warn("preserveQueryParams is deprecated, use queryParamsHandling instead."),
                this.preserve = n
            }
            ngOnChanges(n) {
                this.updateTargetUrlAndHref()
            }
            ngOnDestroy() {
                this.subscription.unsubscribe()
            }
            onClick(n, l, e, t) {
                if (0 !== n || l || e || t)
                    return !0;
                if ("string" == typeof this.target && "_self" != this.target)
                    return !0;
                const u = {
                    skipLocationChange: Th(this.skipLocationChange),
                    replaceUrl: Th(this.replaceUrl),
                    state: this.state
                };
                return this.router.navigateByUrl(this.urlTree, u),
                !1
            }
            updateTargetUrlAndHref() {
                this.href = this.locationStrategy.prepareExternalUrl(this.router.serializeUrl(this.urlTree))
            }
            get urlTree() {
                return this.router.createUrlTree(this.commands, {
                    relativeTo: this.route,
                    queryParams: this.queryParams,
                    fragment: this.fragment,
                    preserveQueryParams: Th(this.preserve),
                    queryParamsHandling: this.queryParamsHandling,
                    preserveFragment: Th(this.preserveFragment)
                })
            }
        }
        function Th(n) {
            return "" === n || !!n
        }
        class Ih {
            constructor(n, l, e, t, u) {
                this.router = n,
                this.element = l,
                this.renderer = e,
                this.link = t,
                this.linkWithHref = u,
                this.classes = [],
                this.isActive = !1,
                this.routerLinkActiveOptions = {
                    exact: !1
                },
                this.subscription = n.events.subscribe(n=>{
                    n instanceof oc && this.update()
                }
                )
            }
            ngAfterContentInit() {
                this.links.changes.subscribe(n=>this.update()),
                this.linksWithHrefs.changes.subscribe(n=>this.update()),
                this.update()
            }
            set routerLinkActive(n) {
                const l = Array.isArray(n) ? n : n.split(" ");
                this.classes = l.filter(n=>!!n)
            }
            ngOnChanges(n) {
                this.update()
            }
            ngOnDestroy() {
                this.subscription.unsubscribe()
            }
            update() {
                this.links && this.linksWithHrefs && this.router.navigated && Promise.resolve().then(()=>{
                    const n = this.hasActiveLinks();
                    this.isActive !== n && (this.isActive = n,
                    this.classes.forEach(l=>{
                        n ? this.renderer.addClass(this.element.nativeElement, l) : this.renderer.removeClass(this.element.nativeElement, l)
                    }
                    ))
                }
                )
            }
            isLinkActive(n) {
                return l=>n.isActive(l.urlTree, this.routerLinkActiveOptions.exact)
            }
            hasActiveLinks() {
                const n = this.isLinkActive(this.router);
                return this.link && n(this.link) || this.linkWithHref && n(this.linkWithHref) || this.links.some(n) || this.linksWithHrefs.some(n)
            }
        }
        class Rh {
            constructor() {
                this.outlet = null,
                this.route = null,
                this.resolver = null,
                this.children = new Ph,
                this.attachRef = null
            }
        }
        class Ph {
            constructor() {
                this.contexts = new Map
            }
            onChildOutletCreated(n, l) {
                const e = this.getOrCreateContext(n);
                e.outlet = l,
                this.contexts.set(n, e)
            }
            onChildOutletDestroyed(n) {
                const l = this.getContext(n);
                l && (l.outlet = null)
            }
            onOutletDeactivated() {
                const n = this.contexts;
                return this.contexts = new Map,
                n
            }
            onOutletReAttached(n) {
                this.contexts = n
            }
            getOrCreateContext(n) {
                let l = this.getContext(n);
                return l || (l = new Rh,
                this.contexts.set(n, l)),
                l
            }
            getContext(n) {
                return this.contexts.get(n) || null
            }
        }
        class Oh {
            constructor(n, l, e, t, u) {
                this.parentContexts = n,
                this.location = l,
                this.resolver = e,
                this.changeDetector = u,
                this.activated = null,
                this._activatedRoute = null,
                this.activateEvents = new Mu,
                this.deactivateEvents = new Mu,
                this.name = t || Sc,
                n.onChildOutletCreated(this.name, this)
            }
            ngOnDestroy() {
                this.parentContexts.onChildOutletDestroyed(this.name)
            }
            ngOnInit() {
                if (!this.activated) {
                    const n = this.parentContexts.getContext(this.name);
                    n && n.route && (n.attachRef ? this.attach(n.attachRef, n.route) : this.activateWith(n.route, n.resolver || null))
                }
            }
            get isActivated() {
                return !!this.activated
            }
            get component() {
                if (!this.activated)
                    throw new Error("Outlet is not activated");
                return this.activated.instance
            }
            get activatedRoute() {
                if (!this.activated)
                    throw new Error("Outlet is not activated");
                return this._activatedRoute
            }
            get activatedRouteData() {
                return this._activatedRoute ? this._activatedRoute.snapshot.data : {}
            }
            detach() {
                if (!this.activated)
                    throw new Error("Outlet is not activated");
                this.location.detach();
                const n = this.activated;
                return this.activated = null,
                this._activatedRoute = null,
                n
            }
            attach(n, l) {
                this.activated = n,
                this._activatedRoute = l,
                this.location.insert(n.hostView)
            }
            deactivate() {
                if (this.activated) {
                    const n = this.component;
                    this.activated.destroy(),
                    this.activated = null,
                    this._activatedRoute = null,
                    this.deactivateEvents.emit(n)
                }
            }
            activateWith(n, l) {
                if (this.isActivated)
                    throw new Error("Cannot activate an already activated outlet");
                this._activatedRoute = n;
                const e = (l = l || this.resolver).resolveComponentFactory(n._futureSnapshot.routeConfig.component)
                  , t = this.parentContexts.getOrCreateContext(this.name).children
                  , u = new Mh(n,t,this.location.injector);
                this.activated = this.location.createComponent(e, this.location.length, u),
                this.changeDetector.markForCheck(),
                this.activateEvents.emit(this.activated.instance)
            }
        }
        class Mh {
            constructor(n, l, e) {
                this.route = n,
                this.childContexts = l,
                this.parent = e
            }
            get(n, l) {
                return n === fd ? this.route : n === Ph ? this.childContexts : this.parent.get(n, l)
            }
        }
        class Dh {
        }
        class Nh {
            preload(n, l) {
                return l().pipe(Eo(()=>no(null)))
            }
        }
        class Lh {
            preload(n, l) {
                return no(null)
            }
        }
        class jh {
            constructor(n, l, e, t, u) {
                this.router = n,
                this.injector = t,
                this.preloadingStrategy = u,
                this.loader = new bh(l,e,l=>n.triggerEvent(new mc(l)),l=>n.triggerEvent(new vc(l)))
            }
            setUpPreloading() {
                this.subscription = this.router.events.pipe(ao(n=>n instanceof oc), $o(()=>this.preload())).subscribe(()=>{}
                )
            }
            preload() {
                const n = this.injector.get(Bn);
                return this.processRoutes(n, this.router.config)
            }
            ngOnDestroy() {
                this.subscription.unsubscribe()
            }
            processRoutes(n, l) {
                const e = [];
                for (const t of l)
                    if (t.loadChildren && !t.canLoad && t._loadedConfig) {
                        const n = t._loadedConfig;
                        e.push(this.processRoutes(n.module, n.routes))
                    } else
                        t.loadChildren && !t.canLoad ? e.push(this.preloadConfig(n, t)) : t.children && e.push(this.processRoutes(n, t.children));
                return W(e).pipe(Y(), $(n=>void 0))
            }
            preloadConfig(n, l) {
                return this.preloadingStrategy.preload(l, ()=>this.loader.load(n.injector, l).pipe(G(n=>(l._loadedConfig = n,
                this.processRoutes(n.module, n.routes)))))
            }
        }
        class Uh {
            constructor(n, l, e={}) {
                this.router = n,
                this.viewportScroller = l,
                this.options = e,
                this.lastId = 0,
                this.lastSource = "imperative",
                this.restoredId = 0,
                this.store = {},
                e.scrollPositionRestoration = e.scrollPositionRestoration || "disabled",
                e.anchorScrolling = e.anchorScrolling || "disabled"
            }
            init() {
                "disabled" !== this.options.scrollPositionRestoration && this.viewportScroller.setHistoryScrollRestoration("manual"),
                this.routerEventsSubscription = this.createScrollEvents(),
                this.scrollEventsSubscription = this.consumeScrollEvents()
            }
            createScrollEvents() {
                return this.router.events.subscribe(n=>{
                    n instanceof sc ? (this.store[this.lastId] = this.viewportScroller.getScrollPosition(),
                    this.lastSource = n.navigationTrigger,
                    this.restoredId = n.restoredState ? n.restoredState.navigationId : 0) : n instanceof oc && (this.lastId = n.id,
                    this.scheduleScrollEvent(n, this.router.parseUrl(n.urlAfterRedirects).fragment))
                }
                )
            }
            consumeScrollEvents() {
                return this.router.events.subscribe(n=>{
                    n instanceof kc && (n.position ? "top" === this.options.scrollPositionRestoration ? this.viewportScroller.scrollToPosition([0, 0]) : "enabled" === this.options.scrollPositionRestoration && this.viewportScroller.scrollToPosition(n.position) : n.anchor && "enabled" === this.options.anchorScrolling ? this.viewportScroller.scrollToAnchor(n.anchor) : "disabled" !== this.options.scrollPositionRestoration && this.viewportScroller.scrollToPosition([0, 0]))
                }
                )
            }
            scheduleScrollEvent(n, l) {
                this.router.triggerEvent(new kc(n,"popstate" === this.lastSource ? this.store[this.restoredId] : null,l))
            }
            ngOnDestroy() {
                this.routerEventsSubscription && this.routerEventsSubscription.unsubscribe(),
                this.scrollEventsSubscription && this.scrollEventsSubscription.unsubscribe()
            }
        }
        const Hh = new En("ROUTER_CONFIGURATION")
          , Fh = new En("ROUTER_FORROOT_GUARD")
          , Vh = [As, {
            provide: Wc,
            useClass: Gc
        }, {
            provide: xh,
            useFactory: Kh,
            deps: [Ir, Wc, Ph, As, Ll, Pr, Ju, _h, Hh, [yh, new cn], [mh, new cn]]
        }, Ph, {
            provide: fd,
            useFactory: Qh,
            deps: [xh]
        }, {
            provide: Pr,
            useClass: Lr
        }, jh, Lh, Nh, {
            provide: Hh,
            useValue: {
                enableTracing: !1
            }
        }];
        function $h() {
            return new Sr("Router",xh)
        }
        class Bh {
            constructor(n, l) {}
            static forRoot(n, l) {
                return {
                    ngModule: Bh,
                    providers: [Vh, Gh(n), {
                        provide: Fh,
                        useFactory: Wh,
                        deps: [[xh, new cn, new hn]]
                    }, {
                        provide: Hh,
                        useValue: l || {}
                    }, {
                        provide: Ss,
                        useFactory: qh,
                        deps: [ks, [new an(xs), new cn], Hh]
                    }, {
                        provide: Uh,
                        useFactory: zh,
                        deps: [xh, Qs, Hh]
                    }, {
                        provide: Dh,
                        useExisting: l && l.preloadingStrategy ? l.preloadingStrategy : Lh
                    }, {
                        provide: Sr,
                        multi: !0,
                        useFactory: $h
                    }, [Zh, {
                        provide: Lu,
                        multi: !0,
                        useFactory: Yh,
                        deps: [Zh]
                    }, {
                        provide: Xh,
                        useFactory: Jh,
                        deps: [Zh]
                    }, {
                        provide: Bu,
                        multi: !0,
                        useExisting: Xh
                    }]]
                }
            }
            static forChild(n) {
                return {
                    ngModule: Bh,
                    providers: [Gh(n)]
                }
            }
        }
        function zh(n, l, e) {
            return e.scrollOffset && l.setOffset(e.scrollOffset),
            new Uh(n,l,e)
        }
        function qh(n, l, e={}) {
            return e.useHash ? new Ts(n,l) : new Is(n,l)
        }
        function Wh(n) {
            if (n)
                throw new Error("RouterModule.forRoot() called twice. Lazy loaded modules should use RouterModule.forChild() instead.");
            return "guarded"
        }
        function Gh(n) {
            return [{
                provide: ql,
                multi: !0,
                useValue: n
            }, {
                provide: _h,
                multi: !0,
                useValue: n
            }]
        }
        function Kh(n, l, e, t, u, r, i, s, o={}, a, c) {
            const d = new xh(null,l,e,t,u,r,i,Lc(s));
            if (a && (d.urlHandlingStrategy = a),
            c && (d.routeReuseStrategy = c),
            o.errorHandler && (d.errorHandler = o.errorHandler),
            o.malformedUriErrorHandler && (d.malformedUriErrorHandler = o.malformedUriErrorHandler),
            o.enableTracing) {
                const n = Wo();
                d.events.subscribe(l=>{
                    n.logGroup(`Router Event: ${l.constructor.name}`),
                    n.log(l.toString()),
                    n.log(l),
                    n.logGroupEnd()
                }
                )
            }
            return o.onSameUrlNavigation && (d.onSameUrlNavigation = o.onSameUrlNavigation),
            o.paramsInheritanceStrategy && (d.paramsInheritanceStrategy = o.paramsInheritanceStrategy),
            o.urlUpdateStrategy && (d.urlUpdateStrategy = o.urlUpdateStrategy),
            o.relativeLinkResolution && (d.relativeLinkResolution = o.relativeLinkResolution),
            d
        }
        function Qh(n) {
            return n.routerState.root
        }
        class Zh {
            constructor(n) {
                this.injector = n,
                this.initNavigation = !1,
                this.resultOfPreactivationDone = new E
            }
            appInitializer() {
                return this.injector.get(Cs, Promise.resolve(null)).then(()=>{
                    let n = null;
                    const l = new Promise(l=>n = l)
                      , e = this.injector.get(xh)
                      , t = this.injector.get(Hh);
                    if (this.isLegacyDisabled(t) || this.isLegacyEnabled(t))
                        n(!0);
                    else if ("disabled" === t.initialNavigation)
                        e.setUpLocationChangeListener(),
                        n(!0);
                    else {
                        if ("enabled" !== t.initialNavigation)
                            throw new Error(`Invalid initialNavigation options: '${t.initialNavigation}'`);
                        e.hooks.afterPreactivation = ()=>this.initNavigation ? no(null) : (this.initNavigation = !0,
                        n(!0),
                        this.resultOfPreactivationDone),
                        e.initialNavigation()
                    }
                    return l
                }
                )
            }
            bootstrapListener(n) {
                const l = this.injector.get(Hh)
                  , e = this.injector.get(jh)
                  , t = this.injector.get(Uh)
                  , u = this.injector.get(xh)
                  , r = this.injector.get(Ir);
                n === r.components[0] && (this.isLegacyEnabled(l) ? u.initialNavigation() : this.isLegacyDisabled(l) && u.setUpLocationChangeListener(),
                e.setUpPreloading(),
                t.init(),
                u.resetRootComponentType(r.componentTypes[0]),
                this.resultOfPreactivationDone.next(null),
                this.resultOfPreactivationDone.complete())
            }
            isLegacyEnabled(n) {
                return "legacy_enabled" === n.initialNavigation || !0 === n.initialNavigation || void 0 === n.initialNavigation
            }
            isLegacyDisabled(n) {
                return "legacy_disabled" === n.initialNavigation || !1 === n.initialNavigation
            }
        }
        function Yh(n) {
            return n.appInitializer.bind(n)
        }
        function Jh(n) {
            return n.bootstrapListener.bind(n)
        }
        const Xh = new En("Router Initializer");
        var np = lt({
            encapsulation: 2,
            styles: [],
            data: {}
        });
        function lp(n) {
            return pi(0, [(n()(),
            Yr(0, 16777216, null, null, 1, "router-outlet", [], null, null, null, null, null)), au(1, 212992, null, 0, Oh, [Ph, je, se, [8, null], Ol], null, null)], (function(n, l) {
                n(l, 1, 0)
            }
            ), null)
        }
        function ep(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 1, "ng-component", [], null, null, null, lp, np)), au(1, 49152, null, 0, Cc, [], null, null)], null, null)
        }
        var tp = Ht("ng-component", Cc, ep, {}, {}, []);
        class up {
            constructor() {}
            ngOnInit() {}
        }
        var rp = lt({
            encapsulation: 0,
            styles: [[""]],
            data: {}
        });
        function ip(n) {
            return pi(0, [], null, null)
        }
        function sp(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 1, "app-home", [], null, null, null, ip, rp)), au(1, 114688, null, 0, up, [], null, null)], (function(n, l) {
                n(l, 1, 0)
            }
            ), null)
        }
        var op = Ht("app-home", up, sp, {}, {}, []);
        class ap {
            constructor() {}
            ngOnInit() {}
        }
        var cp = lt({
            encapsulation: 0,
            styles: [[".section[_ngcontent-%COMP%]{display:-webkit-box;display:flex}.section[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]{-webkit-box-flex:0;flex:0 0 70%}.section[_ngcontent-%COMP%]   .image[_ngcontent-%COMP%]{-webkit-box-flex:0;flex:0 0 30%}.section[_ngcontent-%COMP%]   .image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:100%}"]],
            data: {}
        });
        function dp(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 28, "div", [["class", "app"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 2, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["ABOUT "])), (n()(),
            Yr(3, 0, null, null, 0, "span", [["class", "border"]], null, null, null, null, null)), (n()(),
            Yr(4, 0, null, null, 24, "div", [["class", "general-blk"]], null, null, null, null, null)), (n()(),
            Yr(5, 0, null, null, 9, "div", [["class", "section"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 6, "div", [["class", "content"]], null, null, null, null, null)), (n()(),
            Yr(7, 0, null, null, 1, "h3", [["class", "header"]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Our Department "])), (n()(),
            Yr(9, 0, null, null, 1, "p", [["align","justify"]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The Department of Computer Science and Engineering was incepted in the year 2001 with the objective of high caliber technocrats and eminent software professionals. The department has a team of well qualified, experienced and dedicated faculty members with industrial research background. "])), (n()(),
            Yr(11, 0, null, null, 1, "p", [["align","justify"]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Our Department has been permanently affiliated to Anna University and accredited by A.I.C.T.E, New Delhi. All laboratories of the department are well equipped with computers."])), (n()(),
            Yr(13, 0, null, null, 1, "div", [["class", "image"]], null, null, null, null, null)), (n()(),
            Yr(14, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/icons/mzlogo.png"]], null, null, null, null, null)), (n()(),
            Yr(15, 0, null, null, 13, "div", [["class", "section"]], null, null, null, null, null)), (n()(),
            Yr(16, 0, null, null, 1, "div", [["class", "image"]], null, null, null, null, null)), (n()(),
            Yr(17, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/icons/logo.png"]], null, null, null, null, null)), (n()(),
            Yr(18, 0, null, null, 10, "div", [["class", "content"]], null, null, null, null, null)), (n()(),
            Yr(19, 0, null, null, 1, "h3", [["class", "techquest header"], ["style", "font-weight: normal;margin-bottom: 0px;"]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" TECHQUEST "])), (n()(),
            Yr(21, 0, null, null, 1, "i", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Beyond your dreams,Within your reach"])), (n()(),
            Yr(23, 0, null, null, 1, "p", [["align","justify"]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Techquest 2020, The National Level Technical Symposium organized by the Department of Computer Science and Engineering, represents the pride of CSE. "])), (n()(),
            Yr(25, 0, null, null, 1, "p", [["align","justify"]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Our main objective is to organize events which crafted and designed to ignite the minds of our participants and tailored to illuminate their knowledge. "])), (n()(),
            Yr(27, 0, null, null, 1, "p", [["align","justify"]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" We believe in stimulating the minds of future engineers today, to shape a better future for tomorrow. "]))], null, null)
        }
        function hp(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 1, "app-about", [], null, null, null, dp, cp)), au(1, 114688, null, 0, ap, [], null, null)], (function(n, l) {
                n(l, 1, 0)
            }
            ), null)
        }
        var pp = Ht("app-about", ap, hp, {}, {}, []);
        class fp {
            constructor(n) {
                this.viewRef = n
            }
            set ngTransclude(n) {
                this._ngTransclude = n,
                n && this.viewRef.createEmbeddedView(n)
            }
            get ngTransclude() {
                return this._ngTransclude
            }
        }
        class gp {
            constructor() {
                this.type = "tabs"
            }
        }
        class mp {
            constructor(n, l, e) {
                this.renderer = l,
                this.elementRef = e,
                this.clazz = !0,
                this.tabs = [],
                this.classMap = {},
                Object.assign(this, n)
            }
            get vertical() {
                return this._vertical
            }
            set vertical(n) {
                this._vertical = n,
                this.setClassMap()
            }
            get justified() {
                return this._justified
            }
            set justified(n) {
                this._justified = n,
                this.setClassMap()
            }
            get type() {
                return this._type
            }
            set type(n) {
                this._type = n,
                this.setClassMap()
            }
            ngOnDestroy() {
                this.isDestroyed = !0
            }
            addTab(n) {
                this.tabs.push(n),
                n.active = 1 === this.tabs.length && void 0 === n.active
            }
            removeTab(n, l={
                reselect: !0,
                emit: !0
            }) {
                const e = this.tabs.indexOf(n);
                if (-1 !== e && !this.isDestroyed) {
                    if (l.reselect && n.active && this.hasAvailableTabs(e)) {
                        const n = this.getClosestTabIndex(e);
                        this.tabs[n].active = !0
                    }
                    l.emit && n.removed.emit(n),
                    this.tabs.splice(e, 1),
                    n.elementRef.nativeElement.parentNode && this.renderer.removeChild(n.elementRef.nativeElement.parentNode, n.elementRef.nativeElement)
                }
            }
            keyNavActions(n, l) {
                const e = Array.from(this.elementRef.nativeElement.querySelectorAll(".nav-link"));
                if (13 === n.keyCode || "Enter" === n.key || 32 === n.keyCode || "Space" === n.key)
                    return n.preventDefault(),
                    void e[l % e.length].click();
                if (39 !== n.keyCode && "RightArrow" !== n.key)
                    if (37 !== n.keyCode && "LeftArrow" !== n.key)
                        if (36 !== n.keyCode && "Home" !== n.key)
                            if (35 !== n.keyCode && "End" !== n.key) {
                                if ((46 === n.keyCode || "Delete" === n.key) && this.tabs[l].removable) {
                                    if (this.removeTab(this.tabs[l]),
                                    e[l + 1])
                                        return void e[(l + 1) % e.length].focus();
                                    e[e.length - 1] && e[0].focus()
                                }
                            } else {
                                let t;
                                n.preventDefault();
                                let u = 1
                                  , r = l;
                                do {
                                    r - u < 0 ? (r = e.length - 1,
                                    t = e[r],
                                    u = 0) : t = e[r - u],
                                    u++
                                } while (t.classList.contains("disabled"));t.focus()
                            }
                        else {
                            let l;
                            n.preventDefault();
                            let t = 0;
                            do {
                                l = e[t % e.length],
                                t++
                            } while (l.classList.contains("disabled"));l.focus()
                        }
                    else {
                        let n, t = 1, u = l;
                        do {
                            u - t < 0 ? (u = e.length - 1,
                            n = e[u],
                            t = 0) : n = e[u - t],
                            t++
                        } while (n.classList.contains("disabled"));n.focus()
                    }
                else {
                    let n, t = 1;
                    do {
                        n = e[(l + t) % e.length],
                        t++
                    } while (n.classList.contains("disabled"));n.focus()
                }
            }
            getClosestTabIndex(n) {
                const l = this.tabs.length;
                if (!l)
                    return -1;
                for (let e = 1; e <= l; e += 1) {
                    const l = n - e
                      , t = n + e;
                    if (this.tabs[l] && !this.tabs[l].disabled)
                        return l;
                    if (this.tabs[t] && !this.tabs[t].disabled)
                        return t
                }
                return -1
            }
            hasAvailableTabs(n) {
                const l = this.tabs.length;
                if (!l)
                    return !1;
                for (let e = 0; e < l; e += 1)
                    if (!this.tabs[e].disabled && e !== n)
                        return !0;
                return !1
            }
            setClassMap() {
                this.classMap = {
                    "nav-stacked": this.vertical,
                    "flex-column": this.vertical,
                    "nav-justified": this.justified,
                    [`nav-${this.type}`]: !0
                }
            }
        }
        class vp {
            constructor(n, l, e) {
                this.elementRef = l,
                this.renderer = e,
                this.selectTab = new Mu,
                this.deselect = new Mu,
                this.removed = new Mu,
                this.addClass = !0,
                this.tabset = n,
                this.tabset.addTab(this)
            }
            get customClass() {
                return this._customClass
            }
            set customClass(n) {
                this.customClass && this.customClass.split(" ").forEach(n=>{
                    this.renderer.removeClass(this.elementRef.nativeElement, n)
                }
                ),
                this._customClass = n ? n.trim() : null,
                this.customClass && this.customClass.split(" ").forEach(n=>{
                    this.renderer.addClass(this.elementRef.nativeElement, n)
                }
                )
            }
            get active() {
                return this._active
            }
            set active(n) {
                this._active !== n && (this.disabled && n || !n ? this._active && !n && (this.deselect.emit(this),
                this._active = n) : (this._active = n,
                this.selectTab.emit(this),
                this.tabset.tabs.forEach(n=>{
                    n !== this && (n.active = !1)
                }
                )))
            }
            ngOnInit() {
                this.removable = this.removable
            }
            ngOnDestroy() {
                this.tabset.removeTab(this, {
                    reselect: !1,
                    emit: !1
                })
            }
        }
        class _p {
            static forRoot() {
                return {
                    ngModule: _p,
                    providers: [gp]
                }
            }
        }
        var bp = lt({
            encapsulation: 0,
            styles: ["[_nghost-%COMP%]   .nav-tabs[_ngcontent-%COMP%]   .nav-item.disabled[_ngcontent-%COMP%]   a.disabled[_ngcontent-%COMP%]{cursor:default}"],
            data: {}
        });
        function yp(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 1, "span", [["class", "bs-remove-tab"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0
                  , u = n.component;
                return "click" === l && (e.preventDefault(),
                t = !1 !== u.removeTab(n.parent.context.$implicit) && t),
                t
            }
            ), null, null)), (n()(),
            ci(-1, null, [" \u274c"]))], null, null)
        }
        function wp(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 9, "li", [], [[2, "active", null], [2, "disabled", null]], [[null, "keydown"]], (function(n, l, e) {
                var t = !0;
                return "keydown" === l && (t = !1 !== n.component.keyNavActions(e, n.context.index) && t),
                t
            }
            ), null, null)), cu(512, null, Ns, Ls, [Re, Pe, de, me]), au(2, 278528, null, 0, Us, [Ns], {
                ngClass: [0, "ngClass"]
            }, null), ai(3, 2), (n()(),
            Yr(4, 0, null, null, 5, "a", [["class", "nav-link"], ["href", "javascript:void(0);"]], [[1, "id", 0], [2, "active", null], [2, "disabled", null]], [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = 0 != (n.context.$implicit.active = !0) && t),
                t
            }
            ), null, null)), (n()(),
            Yr(5, 16777216, null, null, 2, "span", [], null, null, null, null, null)), au(6, 16384, null, 0, fp, [je], {
                ngTransclude: [0, "ngTransclude"]
            }, null), (n()(),
            ci(7, null, ["", ""])), (n()(),
            Zr(16777216, null, null, 1, null, yp)), au(9, 16384, null, 0, $s, [je, Ne], {
                ngIf: [0, "ngIf"]
            }, null)], (function(n, l) {
                var e = n(l, 3, 0, "nav-item", l.context.$implicit.customClass || "");
                n(l, 2, 0, e),
                n(l, 6, 0, l.context.$implicit.headingRef),
                n(l, 9, 0, l.context.$implicit.removable)
            }
            ), (function(n, l) {
                n(l, 0, 0, l.context.$implicit.active, l.context.$implicit.disabled),
                n(l, 4, 0, l.context.$implicit.id ? l.context.$implicit.id + "-link" : "", l.context.$implicit.active, l.context.$implicit.disabled),
                n(l, 7, 0, l.context.$implicit.heading)
            }
            ))
        }
        function kp(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 4, "ul", [["class", "nav"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== e.preventDefault() && t),
                t
            }
            ), null, null)), cu(512, null, Ns, Ls, [Re, Pe, de, me]), au(2, 278528, null, 0, Us, [Ns], {
                klass: [0, "klass"],
                ngClass: [1, "ngClass"]
            }, null), (n()(),
            Zr(16777216, null, null, 1, null, wp)), au(4, 278528, null, 0, Fs, [je, Ne, Re], {
                ngForOf: [0, "ngForOf"]
            }, null), (n()(),
            Yr(5, 0, null, null, 1, "div", [["class", "tab-content"]], null, null, null, null, null)), si(null, 0)], (function(n, l) {
                var e = l.component;
                n(l, 2, 0, "nav", e.classMap),
                n(l, 4, 0, e.tabs)
            }
            ), null)
        }
        class Cp {
            constructor(n) {
                this.modalService = n
            }
            ngOnInit() {}
            openModal(n) {
                this.modalRef = this.modalService.show(n, Object.assign({}, {
                    class: "gray modal-lg"
                }))
            }
        }
        class Sp {
            constructor(n, l) {
                this.open = n,
                this.close = l || n
            }
            isManual() {
                return "manual" === this.open || "manual" === this.close
            }
        }
        const xp = {
            hover: ["mouseover", "mouseout"],
            focus: ["focusin", "focusout"]
        }
          , Ap = "undefined" != typeof window && window || {};
        let Ep;
        function Tp() {
            return void 0 === Ap || (void 0 === Ap.__theme ? Ep ? "bs3" === Ep : (Ep = function() {
                if ("undefined" == typeof document)
                    return null;
                const n = document.createElement("span");
                n.innerText = "test bs version",
                document.body.appendChild(n),
                n.classList.add("d-none");
                const l = n.getBoundingClientRect();
                return document.body.removeChild(n),
                l && 0 === l.top ? "bs4" : "bs3"
            }(),
            "bs3" === Ep) : "bs4" !== Ap.__theme)
        }
        class Ip {
            static reflow(n) {}
            static getStyles(n) {
                let l = n.ownerDocument.defaultView;
                return l && l.opener || (l = Ap),
                l.getComputedStyle(n)
            }
        }
        "undefined" == typeof console || console;
        class Rp {
            constructor(n, l, e) {
                this.nodes = n,
                this.viewRef = l,
                this.componentRef = e
            }
        }
        class Pp {
            constructor(n, l, e, t, u, r, i, s) {
                this._viewContainerRef = n,
                this._renderer = l,
                this._elementRef = e,
                this._injector = t,
                this._componentFactoryResolver = u,
                this._ngZone = r,
                this._applicationRef = i,
                this._posService = s,
                this.onBeforeShow = new Mu,
                this.onShown = new Mu,
                this.onBeforeHide = new Mu,
                this.onHidden = new Mu,
                this._providers = [],
                this._isHiding = !1,
                this.containerDefaultSelector = "body",
                this._listenOpts = {},
                this._globalListener = Function.prototype
            }
            get isShown() {
                return !this._isHiding && !!this._componentRef
            }
            attach(n) {
                return this._componentFactory = this._componentFactoryResolver.resolveComponentFactory(n),
                this
            }
            to(n) {
                return this.container = n || this.container,
                this
            }
            position(n) {
                return this.attachment = n.attachment || this.attachment,
                this._elementRef = n.target || this._elementRef,
                this
            }
            provide(n) {
                return this._providers.push(n),
                this
            }
            show(n={}) {
                if (this._subscribePositioning(),
                this._innerComponent = null,
                !this._componentRef) {
                    this.onBeforeShow.emit(),
                    this._contentRef = this._getContentRef(n.content, n.context, n.initialState);
                    const l = Ll.create({
                        providers: this._providers,
                        parent: this._injector
                    });
                    this._componentRef = this._componentFactory.create(l, this._contentRef.nodes),
                    this._applicationRef.attachView(this._componentRef.hostView),
                    this.instance = this._componentRef.instance,
                    Object.assign(this._componentRef.instance, n),
                    this.container instanceof de && this.container.nativeElement.appendChild(this._componentRef.location.nativeElement),
                    "string" == typeof this.container && "undefined" != typeof document && (document.querySelector(this.container) || document.querySelector(this.containerDefaultSelector)).appendChild(this._componentRef.location.nativeElement),
                    !this.container && this._elementRef && this._elementRef.nativeElement.parentElement && this._elementRef.nativeElement.parentElement.appendChild(this._componentRef.location.nativeElement),
                    this._contentRef.componentRef && (this._innerComponent = this._contentRef.componentRef.instance,
                    this._contentRef.componentRef.changeDetectorRef.markForCheck(),
                    this._contentRef.componentRef.changeDetectorRef.detectChanges()),
                    this._componentRef.changeDetectorRef.markForCheck(),
                    this._componentRef.changeDetectorRef.detectChanges(),
                    this.onShown.emit(this._componentRef.instance)
                }
                return this._registerOutsideClick(),
                this._componentRef
            }
            hide() {
                if (!this._componentRef)
                    return this;
                this._posService.deletePositionElement(this._componentRef.location),
                this.onBeforeHide.emit(this._componentRef.instance);
                const n = this._componentRef.location.nativeElement;
                return n.parentNode.removeChild(n),
                this._contentRef.componentRef && this._contentRef.componentRef.destroy(),
                this._componentRef.destroy(),
                this._viewContainerRef && this._contentRef.viewRef && this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._contentRef.viewRef)),
                this._contentRef.viewRef && this._contentRef.viewRef.destroy(),
                this._contentRef = null,
                this._componentRef = null,
                this._removeGlobalListener(),
                this.onHidden.emit(),
                this
            }
            toggle() {
                this.isShown ? this.hide() : this.show()
            }
            dispose() {
                this.isShown && this.hide(),
                this._unsubscribePositioning(),
                this._unregisterListenersFn && this._unregisterListenersFn()
            }
            listen(n) {
                this.triggers = n.triggers || this.triggers,
                this._listenOpts.outsideClick = n.outsideClick,
                this._listenOpts.outsideEsc = n.outsideEsc,
                n.target = n.target || this._elementRef.nativeElement;
                const l = this._listenOpts.hide = ()=>n.hide ? n.hide() : void this.hide()
                  , e = this._listenOpts.show = l=>{
                    n.show ? n.show(l) : this.show(l),
                    l()
                }
                ;
                return this._unregisterListenersFn = function(n, l) {
                    const e = function(n, l=xp) {
                        const e = (n || "").trim();
                        if (0 === e.length)
                            return [];
                        const t = e.split(/\s+/).map(n=>n.split(":")).map(n=>{
                            const e = l[n[0]] || n;
                            return new Sp(e[0],e[1])
                        }
                        )
                          , u = t.filter(n=>n.isManual());
                        if (u.length > 1)
                            throw new Error("Triggers parse error: only one manual trigger is allowed");
                        if (1 === u.length && t.length > 1)
                            throw new Error("Triggers parse error: manual trigger can't be mixed with other triggers");
                        return t
                    }(l.triggers)
                      , t = l.target;
                    if (1 === e.length && e[0].isManual())
                        return Function.prototype;
                    const u = []
                      , r = []
                      , i = ()=>{
                        r.forEach(n=>u.push(n())),
                        r.length = 0
                    }
                    ;
                    return e.forEach(e=>{
                        const s = e.open === e.close
                          , o = s ? l.toggle : l.show;
                        s || r.push(()=>n.listen(t, e.close, l.hide)),
                        u.push(n.listen(t, e.open, ()=>o(i)))
                    }
                    ),
                    ()=>{
                        u.forEach(n=>n())
                    }
                }(this._renderer, {
                    target: n.target,
                    triggers: n.triggers,
                    show: e,
                    hide: l,
                    toggle: n=>{
                        this.isShown ? l() : e(n)
                    }
                }),
                this
            }
            _removeGlobalListener() {
                this._globalListener && (this._globalListener(),
                this._globalListener = null)
            }
            attachInline(n, l) {
                return this._inlineViewRef = n.createEmbeddedView(l),
                this
            }
            _registerOutsideClick() {
                if (this._componentRef && this._componentRef.location) {
                    if (this._listenOpts.outsideClick) {
                        const n = this._componentRef.location.nativeElement;
                        setTimeout(()=>{
                            this._globalListener = function(n, l) {
                                return l.outsideClick ? n.listen("document", "click", n=>{
                                    l.target && l.target.contains(n.target) || l.targets && l.targets.some(l=>l.contains(n.target)) || l.hide()
                                }
                                ) : Function.prototype
                            }(this._renderer, {
                                targets: [n, this._elementRef.nativeElement],
                                outsideClick: this._listenOpts.outsideClick,
                                hide: ()=>this._listenOpts.hide()
                            })
                        }
                        )
                    }
                    var n;
                    this._listenOpts.outsideEsc && (this._globalListener = (n = {
                        targets: [this._componentRef.location.nativeElement, this._elementRef.nativeElement],
                        outsideEsc: this._listenOpts.outsideEsc,
                        hide: ()=>this._listenOpts.hide()
                    }).outsideEsc ? this._renderer.listen("document", "keyup.esc", l=>{
                        n.target && n.target.contains(l.target) || n.targets && n.targets.some(n=>n.contains(l.target)) || n.hide()
                    }
                    ) : Function.prototype)
                }
            }
            getInnerComponent() {
                return this._innerComponent
            }
            _subscribePositioning() {
                !this._zoneSubscription && this.attachment && (this.onShown.subscribe(()=>{
                    this._posService.position({
                        element: this._componentRef.location,
                        target: this._elementRef,
                        attachment: this.attachment,
                        appendToBody: "body" === this.container
                    })
                }
                ),
                this._zoneSubscription = this._ngZone.onStable.subscribe(()=>{
                    this._componentRef && this._posService.calcPosition()
                }
                ))
            }
            _unsubscribePositioning() {
                this._zoneSubscription && (this._zoneSubscription.unsubscribe(),
                this._zoneSubscription = null)
            }
            _getContentRef(n, l, e) {
                if (!n)
                    return new Rp([]);
                if (n instanceof Ne) {
                    if (this._viewContainerRef) {
                        const e = this._viewContainerRef.createEmbeddedView(n, l);
                        return e.markForCheck(),
                        new Rp([e.rootNodes],e)
                    }
                    const e = n.createEmbeddedView({});
                    return this._applicationRef.attachView(e),
                    new Rp([e.rootNodes],e)
                }
                if ("function" == typeof n) {
                    const l = this._componentFactoryResolver.resolveComponentFactory(n)
                      , t = Ll.create({
                        providers: this._providers,
                        parent: this._injector
                    })
                      , u = l.create(t);
                    return Object.assign(u.instance, e),
                    this._applicationRef.attachView(u.hostView),
                    new Rp([[u.location.nativeElement]],u.hostView,u)
                }
                return new Rp([[this._renderer.createText(`${n}`)]])
            }
        }
        class Op {
            constructor(n, l, e, t, u) {
                this._componentFactoryResolver = n,
                this._ngZone = l,
                this._injector = e,
                this._posService = t,
                this._applicationRef = u
            }
            createLoader(n, l, e) {
                return new Pp(l,e,n,this._injector,this._componentFactoryResolver,this._ngZone,this._applicationRef,this._posService)
            }
        }
        function Mp(n, l, e, u) {
            return t(e) && (u = e,
            e = void 0),
            u ? Mp(n, l, e).pipe($(n=>o(n) ? u(...n) : u(n))) : new w(t=>{
                !function n(l, e, t, u, r) {
                    let i;
                    if (function(n) {
                        return n && "function" == typeof n.addEventListener && "function" == typeof n.removeEventListener
                    }(l)) {
                        const n = l;
                        l.addEventListener(e, t, r),
                        i = ()=>n.removeEventListener(e, t, r)
                    } else if (function(n) {
                        return n && "function" == typeof n.on && "function" == typeof n.off
                    }(l)) {
                        const n = l;
                        l.on(e, t),
                        i = ()=>n.off(e, t)
                    } else if (function(n) {
                        return n && "function" == typeof n.addListener && "function" == typeof n.removeListener
                    }(l)) {
                        const n = l;
                        l.addListener(e, t),
                        i = ()=>n.removeListener(e, t)
                    } else {
                        if (!l || !l.length)
                            throw new TypeError("Invalid event target");
                        for (let i = 0, s = l.length; i < s; i++)
                            n(l[i], e, t, u, r)
                    }
                    u.add(i)
                }(n, l, (function(n) {
                    t.next(arguments.length > 1 ? Array.prototype.slice.call(arguments) : n)
                }
                ), t, e)
            }
            )
        }
        class Dp extends h {
            constructor(n, l) {
                super()
            }
            schedule(n, l=0) {
                return this
            }
        }
        class Np extends Dp {
            constructor(n, l) {
                super(n, l),
                this.scheduler = n,
                this.work = l,
                this.pending = !1
            }
            schedule(n, l=0) {
                if (this.closed)
                    return this;
                this.state = n;
                const e = this.id
                  , t = this.scheduler;
                return null != e && (this.id = this.recycleAsyncId(t, e, l)),
                this.pending = !0,
                this.delay = l,
                this.id = this.id || this.requestAsyncId(t, this.id, l),
                this
            }
            requestAsyncId(n, l, e=0) {
                return setInterval(n.flush.bind(n, this), e)
            }
            recycleAsyncId(n, l, e=0) {
                if (null !== e && this.delay === e && !1 === this.pending)
                    return l;
                clearInterval(l)
            }
            execute(n, l) {
                if (this.closed)
                    return new Error("executing a cancelled action");
                this.pending = !1;
                const e = this._execute(n, l);
                if (e)
                    return e;
                !1 === this.pending && null != this.id && (this.id = this.recycleAsyncId(this.scheduler, this.id, null))
            }
            _execute(n, l) {
                let e = !1
                  , t = void 0;
                try {
                    this.work(n)
                } catch (u) {
                    e = !0,
                    t = !!u && u || new Error(u)
                }
                if (e)
                    return this.unsubscribe(),
                    t
            }
            _unsubscribe() {
                const n = this.id
                  , l = this.scheduler
                  , e = l.actions
                  , t = e.indexOf(this);
                this.work = null,
                this.state = null,
                this.pending = !1,
                this.scheduler = null,
                -1 !== t && e.splice(t, 1),
                null != n && (this.id = this.recycleAsyncId(l, n, null)),
                this.delay = null
            }
        }
        class Lp extends Np {
            constructor(n, l) {
                super(n, l),
                this.scheduler = n,
                this.work = l
            }
            requestAsyncId(n, l, e=0) {
                return null !== e && e > 0 ? super.requestAsyncId(n, l, e) : (n.actions.push(this),
                n.scheduled || (n.scheduled = requestAnimationFrame(()=>n.flush(null))))
            }
            recycleAsyncId(n, l, e=0) {
                if (null !== e && e > 0 || null === e && this.delay > 0)
                    return super.recycleAsyncId(n, l, e);
                0 === n.actions.length && (cancelAnimationFrame(l),
                n.scheduled = void 0)
            }
        }
        let jp = (()=>{
            class n {
                constructor(l, e=n.now) {
                    this.SchedulerAction = l,
                    this.now = e
                }
                schedule(n, l=0, e) {
                    return new this.SchedulerAction(this,n).schedule(e, l)
                }
            }
            return n.now = ()=>Date.now(),
            n
        }
        )();
        class Up extends jp {
            constructor(n, l=jp.now) {
                super(n, ()=>Up.delegate && Up.delegate !== this ? Up.delegate.now() : l()),
                this.actions = [],
                this.active = !1,
                this.scheduled = void 0
            }
            schedule(n, l=0, e) {
                return Up.delegate && Up.delegate !== this ? Up.delegate.schedule(n, l, e) : super.schedule(n, l, e)
            }
            flush(n) {
                const {actions: l} = this;
                if (this.active)
                    return void l.push(n);
                let e;
                this.active = !0;
                do {
                    if (e = n.execute(n.state, n.delay))
                        break
                } while (n = l.shift());if (this.active = !1,
                e) {
                    for (; n = l.shift(); )
                        n.unsubscribe();
                    throw e
                }
            }
        }
        class Hp extends Up {
            flush(n) {
                this.active = !0,
                this.scheduled = void 0;
                const {actions: l} = this;
                let e, t = -1, u = l.length;
                n = n || l.shift();
                do {
                    if (e = n.execute(n.state, n.delay))
                        break
                } while (++t < u && (n = l.shift()));if (this.active = !1,
                e) {
                    for (; ++t < u && (n = l.shift()); )
                        n.unsubscribe();
                    throw e
                }
            }
        }
        const Fp = new Hp(Lp);
        function Vp(n, l) {
            if (1 !== n.nodeType)
                return [];
            const e = n.ownerDocument.defaultView.getComputedStyle(n, null);
            return l ? e[l] : e
        }
        function $p(n) {
            return "HTML" === n.nodeName ? n : n.parentNode || n.host
        }
        function Bp(n) {
            if (!n)
                return document.body;
            switch (n.nodeName) {
            case "HTML":
            case "BODY":
                return n.ownerDocument.body;
            case "#document":
                return n.body
            }
            const {overflow: l, overflowX: e, overflowY: t} = Vp(n);
            return /(auto|scroll|overlay)/.test(String(l) + String(t) + String(e)) ? n : Bp($p(n))
        }
        const zp = "undefined" != typeof window && "undefined" != typeof document
          , qp = zp && !(!window.MSInputMethodContext || !document.documentMode)
          , Wp = zp && !(!window.MSInputMethodContext || !/MSIE 10/.test(navigator.userAgent));
        function Gp(n) {
            return 11 === n ? qp : 10 === n ? Wp : qp || Wp
        }
        function Kp(n) {
            if (!n)
                return document.documentElement;
            const l = Gp(10) ? document.body : null;
            let e, t = n.offsetParent || null;
            for (; t === l && n.nextElementSibling && e !== n.nextElementSibling; )
                e = n.nextElementSibling,
                t = e.offsetParent;
            const u = t && t.nodeName;
            return u && "BODY" !== u && "HTML" !== u ? -1 !== ["TH", "TD", "TABLE"].indexOf(t.nodeName) && "static" === Vp(t, "position") ? Kp(t) : t : e ? e.ownerDocument.documentElement : document.documentElement
        }
        function Qp(n) {
            return null !== n.parentNode ? Qp(n.parentNode) : n
        }
        function Zp(n, l) {
            if (!(n && n.nodeType && l && l.nodeType))
                return document.documentElement;
            const e = n.compareDocumentPosition(l) & Node.DOCUMENT_POSITION_FOLLOWING
              , t = e ? n : l
              , u = e ? l : n
              , r = document.createRange();
            r.setStart(t, 0),
            r.setEnd(u, 0);
            const {commonAncestorContainer: i} = r;
            if (n !== i && l !== i || t.contains(u))
                return function(n) {
                    const {nodeName: l} = n;
                    return "BODY" !== l && ("HTML" === l || Kp(n.firstElementChild) === n)
                }(i) ? i : Kp(i);
            const s = Qp(n);
            return s.host ? Zp(s.host, l) : Zp(n, Qp(l).host)
        }
        function Yp(n, l) {
            const e = "x" === l ? "Left" : "Top"
              , t = "Left" === e ? "Right" : "Bottom";
            return parseFloat(n[`border${e}Width`]) + parseFloat(n[`border${t}Width`])
        }
        function Jp(n, l, e, t) {
            return Math.max(l[`offset${n}`], l[`scroll${n}`], e[`client${n}`], e[`offset${n}`], e[`scroll${n}`], Gp(10) ? parseInt(e[`offset${n}`], 10) + parseInt(t[`margin${"Height" === n ? "Top" : "Left"}`], 10) + parseInt(t[`margin${"Height" === n ? "Bottom" : "Right"}`], 10) : 0)
        }
        function Xp(n) {
            const l = n.body
              , e = n.documentElement
              , t = Gp(10) && getComputedStyle(e);
            return {
                height: Jp("Height", l, e, t),
                width: Jp("Width", l, e, t)
            }
        }
        function nf(n, l="top") {
            const e = "top" === l ? "scrollTop" : "scrollLeft"
              , t = n.nodeName;
            if ("BODY" === t || "HTML" === t) {
                const l = n.ownerDocument.documentElement;
                return (n.ownerDocument.scrollingElement || l)[e]
            }
            return n[e]
        }
        function lf(n) {
            return Object.assign({}, n, {
                right: n.left + n.width,
                bottom: n.top + n.height
            })
        }
        function ef(n) {
            let l = {};
            try {
                if (Gp(10)) {
                    l = n.getBoundingClientRect();
                    const e = nf(n, "top")
                      , t = nf(n, "left");
                    l.top += e,
                    l.left += t,
                    l.bottom += e,
                    l.right += t
                } else
                    l = n.getBoundingClientRect()
            } catch (i) {
                return
            }
            const e = {
                left: l.left,
                top: l.top,
                width: l.right - l.left,
                height: l.bottom - l.top
            }
              , t = "HTML" === n.nodeName ? Xp(n.ownerDocument) : {};
            let u = n.offsetWidth - (t.width || n.clientWidth || e.right - e.left)
              , r = n.offsetHeight - (t.height || n.clientHeight || e.bottom - e.top);
            if (u || r) {
                const l = Vp(n);
                u -= Yp(l, "x"),
                r -= Yp(l, "y"),
                e.width -= u,
                e.height -= r
            }
            return lf(e)
        }
        function tf(n, l, e=!1) {
            const t = Gp(10)
              , u = "HTML" === l.nodeName
              , r = ef(n)
              , i = ef(l)
              , s = Bp(n)
              , o = Vp(l)
              , a = parseFloat(o.borderTopWidth)
              , c = parseFloat(o.borderLeftWidth);
            e && u && (i.top = Math.max(i.top, 0),
            i.left = Math.max(i.left, 0));
            let d = lf({
                top: r.top - i.top - a,
                left: r.left - i.left - c,
                width: r.width,
                height: r.height
            });
            if (d.marginTop = 0,
            d.marginLeft = 0,
            !t && u) {
                const n = parseFloat(o.marginTop)
                  , l = parseFloat(o.marginLeft);
                d.top -= a - n,
                d.bottom -= a - n,
                d.left -= c - l,
                d.right -= c - l,
                d.marginTop = n,
                d.marginLeft = l
            }
            return (t && !e ? l.contains(s) : l === s && "BODY" !== s.nodeName) && (d = function(n, l, e=!1) {
                const t = nf(l, "top")
                  , u = nf(l, "left")
                  , r = e ? -1 : 1;
                return n.top += t * r,
                n.bottom += t * r,
                n.left += u * r,
                n.right += u * r,
                n
            }(d, l)),
            d
        }
        function uf(n) {
            if (!n || !n.parentElement || Gp())
                return document.documentElement;
            let l = n.parentElement;
            for (; l && "none" === Vp(l, "transform"); )
                l = l.parentElement;
            return l || document.documentElement
        }
        function rf(n, l, e=0, t, u=!1) {
            let r = {
                top: 0,
                left: 0
            };
            const i = u ? uf(n) : Zp(n, l);
            if ("viewport" === t)
                r = function(n, l=!1) {
                    const e = n.ownerDocument.documentElement
                      , t = tf(n, e)
                      , u = Math.max(e.clientWidth, window.innerWidth || 0)
                      , r = Math.max(e.clientHeight, window.innerHeight || 0)
                      , i = l ? 0 : nf(e)
                      , s = l ? 0 : nf(e, "left");
                    return lf({
                        top: i - Number(t.top) + Number(t.marginTop),
                        left: s - Number(t.left) + Number(t.marginLeft),
                        width: u,
                        height: r
                    })
                }(i, u);
            else {
                let e;
                "scrollParent" === t ? (e = Bp($p(l)),
                "BODY" === e.nodeName && (e = n.ownerDocument.documentElement)) : e = "window" === t ? n.ownerDocument.documentElement : t;
                const s = tf(e, i, u);
                if ("HTML" !== e.nodeName || function n(l) {
                    const e = l.nodeName;
                    return "BODY" !== e && "HTML" !== e && ("fixed" === Vp(l, "position") || n($p(l)))
                }(i))
                    r = s;
                else {
                    const {height: l, width: e} = Xp(n.ownerDocument);
                    r.top += s.top - s.marginTop,
                    r.bottom = Number(l) + Number(s.top),
                    r.left += s.left - s.marginLeft,
                    r.right = Number(e) + Number(s.left)
                }
            }
            return r.left += e,
            r.top += e,
            r.right -= e,
            r.bottom -= e,
            r
        }
        function sf({width: n, height: l}) {
            return n * l
        }
        function of(n, l, e, t, u=["top", "bottom", "right", "left"], r="viewport", i=0) {
            if (-1 === n.indexOf("auto"))
                return n;
            const s = rf(e, t, i, r)
              , o = {
                top: {
                    width: s.width,
                    height: l.top - s.top
                },
                right: {
                    width: s.right - l.right,
                    height: s.height
                },
                bottom: {
                    width: s.width,
                    height: s.bottom - l.bottom
                },
                left: {
                    width: l.left - s.left,
                    height: s.height
                }
            }
              , a = Object.keys(o).map(n=>Object.assign({
                key: n
            }, o[n], {
                area: sf(o[n])
            })).sort((n,l)=>l.area - n.area);
            let c = a.filter(({width: n, height: l})=>n >= e.clientWidth && l >= e.clientHeight);
            c = c.filter(n=>u.some(l=>l === n.key));
            const d = c.length > 0 ? c[0].key : a[0].key
              , h = n.split(" ")[1];
            return e.className = e.className.replace(/bs-tooltip-auto/g, `bs-tooltip-${d}`),
            d + (h ? `-${h}` : "")
        }
        function af(n) {
            const l = n.ownerDocument.defaultView.getComputedStyle(n)
              , e = parseFloat(l.marginTop || 0) + parseFloat(l.marginBottom || 0)
              , t = parseFloat(l.marginLeft || 0) + parseFloat(l.marginRight || 0);
            return {
                width: Number(n.offsetWidth) + t,
                height: Number(n.offsetHeight) + e
            }
        }
        function cf(n, l, e=null) {
            return tf(l, e ? uf(n) : Zp(n, l), e)
        }
        function df(n, l, e) {
            const t = e.split(" ")[0]
              , u = af(n)
              , r = {
                width: u.width,
                height: u.height
            }
              , i = -1 !== ["right", "left"].indexOf(t)
              , s = i ? "top" : "left"
              , o = i ? "left" : "top"
              , a = i ? "height" : "width"
              , c = i ? "width" : "height";
            return r[s] = l[s] + l[a] / 2 - u[a] / 2,
            r[o] = t === o ? l[o] - u[c] : l[function(n) {
                const l = {
                    left: "right",
                    right: "left",
                    bottom: "top",
                    top: "bottom"
                };
                return n.replace(/left|right|bottom|top/g, n=>l[n])
            }(o)],
            r
        }
        function hf(n, l) {
            return n && n.modifiers && n.modifiers[l] && n.modifiers[l].enabled
        }
        function pf(n, l, e) {
            Object.keys(l).forEach(t=>{
                let u = "";
                -1 !== ["width", "height", "top", "right", "bottom", "left"].indexOf(t) && function(n) {
                    return "" !== n && !isNaN(parseFloat(n)) && isFinite(n)
                }(l[t]) && (u = "px"),
                e ? e.setStyle(n, t, `${String(l[t])}${u}`) : n.style[t] = String(l[t]) + u
            }
            )
        }
        function ff(n) {
            let l = n.offsets.target;
            const e = n.instance.target.querySelector(".arrow");
            if (!e)
                return n;
            const t = -1 !== ["left", "right"].indexOf(n.placement)
              , u = t ? "height" : "width"
              , r = t ? "Top" : "Left"
              , i = r.toLowerCase()
              , s = t ? "left" : "top"
              , o = t ? "bottom" : "right"
              , a = af(e)[u];
            n.offsets.host[o] - a < l[i] && (l[i] -= l[i] - (n.offsets.host[o] - a)),
            Number(n.offsets.host[i]) + Number(a) > l[o] && (l[i] += Number(n.offsets.host[i]) + Number(a) - Number(l[o])),
            l = lf(l);
            const c = Number(n.offsets.host[i]) + Number(n.offsets.host[u] / 2 - a / 2)
              , d = Vp(n.instance.target)
              , h = parseFloat(d[`margin${r}`])
              , p = parseFloat(d[`border${r}Width`]);
            let f = c - l[i] - h - p;
            return f = Math.max(Math.min(l[u] - a, f), 0),
            n.offsets.arrow = {
                [i]: Math.round(f),
                [s]: ""
            },
            n.instance.arrow = e,
            n
        }
        function gf(n) {
            if (n.offsets.target = lf(n.offsets.target),
            !hf(n.options, "flip"))
                return n.offsets.target = Object.assign({}, n.offsets.target, df(n.instance.target, n.offsets.host, n.placement)),
                n;
            const l = rf(n.instance.target, n.instance.host, 0, "viewport", !1);
            let e = n.placement.split(" ")[0]
              , t = n.placement.split(" ")[1] || "";
            const u = of("auto", n.offsets.host, n.instance.target, n.instance.host, n.options.allowedPositions)
              , r = [e, u];
            return r.forEach((u,i)=>{
                if (e !== u || r.length === i + 1)
                    return n;
                e = n.placement.split(" ")[0];
                const s = "left" === e && Math.floor(n.offsets.target.right) > Math.floor(n.offsets.host.left) || "right" === e && Math.floor(n.offsets.target.left) < Math.floor(n.offsets.host.right) || "top" === e && Math.floor(n.offsets.target.bottom) > Math.floor(n.offsets.host.top) || "bottom" === e && Math.floor(n.offsets.target.top) < Math.floor(n.offsets.host.bottom)
                  , o = Math.floor(n.offsets.target.left) < Math.floor(l.left)
                  , a = Math.floor(n.offsets.target.right) > Math.floor(l.right)
                  , c = Math.floor(n.offsets.target.top) < Math.floor(l.top)
                  , d = Math.floor(n.offsets.target.bottom) > Math.floor(l.bottom)
                  , h = "left" === e && o || "right" === e && a || "top" === e && c || "bottom" === e && d
                  , p = -1 !== ["top", "bottom"].indexOf(e)
                  , f = p && "left" === t && o || p && "right" === t && a || !p && "left" === t && c || !p && "right" === t && d;
                (s || h || f) && ((s || h) && (e = r[i + 1]),
                f && (t = function(n) {
                    return "right" === n ? "left" : "left" === n ? "right" : n
                }(t)),
                n.placement = e + (t ? ` ${t}` : ""),
                n.offsets.target = Object.assign({}, n.offsets.target, df(n.instance.target, n.offsets.host, n.placement)))
            }
            ),
            n
        }
        function mf(n) {
            if (!hf(n.options, "preventOverflow"))
                return n;
            const l = "transform"
              , e = n.instance.target.style
              , {top: t, left: u, [l]: r} = e;
            e.top = "",
            e.left = "",
            e[l] = "";
            const i = rf(n.instance.target, n.instance.host, 0, "scrollParent", !1);
            e.top = t,
            e.left = u,
            e[l] = r;
            const s = {
                primary(l) {
                    let e = n.offsets.target[l];
                    return n.offsets.target[l] < i[l] && (e = Math.max(n.offsets.target[l], i[l])),
                    {
                        [l]: e
                    }
                },
                secondary(l) {
                    const e = "right" === l ? "left" : "top";
                    let t = n.offsets.target[e];
                    return n.offsets.target[l] > i[l] && (t = Math.min(n.offsets.target[e], i[l] - ("right" === l ? n.offsets.target.width : n.offsets.target.height))),
                    {
                        [e]: t
                    }
                }
            };
            let o;
            return ["left", "right", "top", "bottom"].forEach(l=>{
                o = -1 !== ["left", "top"].indexOf(l) ? "primary" : "secondary",
                n.offsets.target = Object.assign({}, n.offsets.target, s[o](l))
            }
            ),
            n
        }
        function vf(n) {
            const l = n.placement
              , e = l.split(" ")[0]
              , t = l.split(" ")[1];
            if (t) {
                const {host: l, target: u} = n.offsets
                  , r = -1 !== ["bottom", "top"].indexOf(e)
                  , i = r ? "left" : "top"
                  , s = r ? "width" : "height";
                n.offsets.target = Object.assign({}, u, {
                    start: {
                        [i]: l[i]
                    },
                    end: {
                        [i]: l[i] + l[s] - u[s]
                    }
                }[t])
            }
            return n
        }
        class _f {
            position(n, l, e=!0) {
                return this.offset(n, l, !1)
            }
            offset(n, l, e=!0) {
                return cf(l, n)
            }
            positionElements(n, l, e, t, u) {
                return [gf, vf, mf, ff].reduce((n,l)=>l(n), function(n, l, e, t) {
                    const u = cf(n, l);
                    e.match(/^(auto)*\s*(left|right|top|bottom)*$/) || e.match(/^(left|right|top|bottom)*\s*(start|end)*$/) || (e = "auto");
                    const r = !!e.match(/auto/g);
                    let i = e.match(/auto\s(left|right|top|bottom)/) ? e.split(" ")[1] || "auto" : e;
                    const s = df(n, u, i);
                    return i = of(i, u, n, l, t ? t.allowedPositions : void 0),
                    {
                        options: t,
                        instance: {
                            target: n,
                            host: l,
                            arrow: null
                        },
                        offsets: {
                            target: s,
                            host: u,
                            arrow: null
                        },
                        positionFixed: !1,
                        placement: i,
                        placementAuto: r
                    }
                }(l, n, e, u))
            }
        }
        const bf = new _f;
        class yf {
            constructor(n, l, e) {
                this.update$$ = new E,
                this.positionElements = new Map,
                this.isDisabled = !1,
                function(n) {
                    return n === Gs
                }(e) && n.runOutsideAngular(()=>{
                    this.triggerEvent$ = J(Mp(window, "scroll", {
                        passive: !0
                    }), Mp(window, "resize", {
                        passive: !0
                    }), no(0, Fp), this.update$$),
                    this.triggerEvent$.subscribe(()=>{
                        this.isDisabled || this.positionElements.forEach(n=>{
                            !function(n, l, e, t, u, r) {
                                const i = bf.positionElements(n, l, e, t, u)
                                  , s = function(n) {
                                    return {
                                        width: n.offsets.target.width,
                                        height: n.offsets.target.height,
                                        left: Math.floor(n.offsets.target.left),
                                        top: Math.round(n.offsets.target.top),
                                        bottom: Math.round(n.offsets.target.bottom),
                                        right: Math.floor(n.offsets.target.right)
                                    }
                                }(i);
                                pf(l, {
                                    "will-change": "transform",
                                    top: "0px",
                                    left: "0px",
                                    transform: `translate3d(${s.left}px, ${s.top}px, 0px)`
                                }, r),
                                i.instance.arrow && pf(i.instance.arrow, i.offsets.arrow, r),
                                function(n, l) {
                                    const e = n.instance.target;
                                    let t = e.className;
                                    n.placementAuto && (t = t.replace(/bs-popover-auto/g, `bs-popover-${n.placement}`),
                                    t = t.replace(/bs-tooltip-auto/g, `bs-tooltip-${n.placement}`),
                                    t = t.replace(/\sauto/g, ` ${n.placement}`),
                                    -1 !== t.indexOf("popover") && -1 === t.indexOf("popover-auto") && (t += " popover-auto"),
                                    -1 !== t.indexOf("tooltip") && -1 === t.indexOf("tooltip-auto") && (t += " tooltip-auto")),
                                    t = t.replace(/left|right|top|bottom/g, `${n.placement.split(" ")[0]}`),
                                    l ? l.setAttribute(e, "class", t) : e.className = t
                                }(i, r)
                            }(wf(n.target), wf(n.element), n.attachment, n.appendToBody, this.options, l.createRenderer(null, null))
                        }
                        )
                    }
                    )
                }
                )
            }
            position(n) {
                this.addPositionElement(n)
            }
            get event$() {
                return this.triggerEvent$
            }
            disable() {
                this.isDisabled = !0
            }
            enable() {
                this.isDisabled = !1
            }
            addPositionElement(n) {
                this.positionElements.set(wf(n.element), n)
            }
            calcPosition() {
                this.update$$.next()
            }
            deletePositionElement(n) {
                this.positionElements.delete(wf(n))
            }
            setOptions(n) {
                this.options = n
            }
        }
        function wf(n) {
            return "string" == typeof n ? document.querySelector(n) : n instanceof de ? n.nativeElement : n
        }
        class kf {
            constructor() {
                this.hide = Function,
                this.setClass = Function
            }
        }
        class Cf {
        }
        const Sf = {
            backdrop: !0,
            keyboard: !0,
            focus: !0,
            show: !1,
            ignoreBackdropClick: !1,
            class: "",
            animated: !0,
            initialState: {}
        }
          , xf = {
            SCROLLBAR_MEASURER: "modal-scrollbar-measure",
            BACKDROP: "modal-backdrop",
            OPEN: "modal-open",
            FADE: "fade",
            IN: "in",
            SHOW: "show"
        }
          , Af = {
            MODAL: 300,
            BACKDROP: 150
        }
          , Ef = {
            BACKRDOP: "backdrop-click",
            ESC: "esc"
        };
        class Tf {
            constructor(n, l, e) {
                this._element = l,
                this._renderer = e,
                this.isShown = !1,
                this.isModalHiding = !1,
                this.config = Object.assign({}, n)
            }
            ngOnInit() {
                this.isAnimated && this._renderer.addClass(this._element.nativeElement, xf.FADE),
                this._renderer.setStyle(this._element.nativeElement, "display", "block"),
                setTimeout(()=>{
                    this.isShown = !0,
                    this._renderer.addClass(this._element.nativeElement, Tp() ? xf.IN : xf.SHOW)
                }
                , this.isAnimated ? Af.BACKDROP : 0),
                document && document.body && (1 === this.bsModalService.getModalsCount() && (this.bsModalService.checkScrollbar(),
                this.bsModalService.setScrollbar()),
                this._renderer.addClass(document.body, xf.OPEN)),
                this._element.nativeElement && this._element.nativeElement.focus()
            }
            onClick(n) {
                this.config.ignoreBackdropClick || "static" === this.config.backdrop || n.target !== this._element.nativeElement || (this.bsModalService.setDismissReason(Ef.BACKRDOP),
                this.hide())
            }
            onEsc(n) {
                this.isShown && (27 !== n.keyCode && "Escape" !== n.key || n.preventDefault(),
                this.config.keyboard && this.level === this.bsModalService.getModalsCount() && (this.bsModalService.setDismissReason(Ef.ESC),
                this.hide()))
            }
            ngOnDestroy() {
                this.isShown && this.hide()
            }
            hide() {
                !this.isModalHiding && this.isShown && (this.isModalHiding = !0,
                this._renderer.removeClass(this._element.nativeElement, Tp() ? xf.IN : xf.SHOW),
                setTimeout(()=>{
                    this.isShown = !1,
                    document && document.body && 1 === this.bsModalService.getModalsCount() && this._renderer.removeClass(document.body, xf.OPEN),
                    this.bsModalService.hide(this.level),
                    this.isModalHiding = !1
                }
                , this.isAnimated ? Af.MODAL : 0))
            }
        }
        class If {
            constructor(n, l) {
                this._isShown = !1,
                this.element = n,
                this.renderer = l
            }
            get isAnimated() {
                return this._isAnimated
            }
            set isAnimated(n) {
                this._isAnimated = n
            }
            get isShown() {
                return this._isShown
            }
            set isShown(n) {
                this._isShown = n,
                n ? this.renderer.addClass(this.element.nativeElement, `${xf.IN}`) : this.renderer.removeClass(this.element.nativeElement, `${xf.IN}`),
                Tp() || (n ? this.renderer.addClass(this.element.nativeElement, `${xf.SHOW}`) : this.renderer.removeClass(this.element.nativeElement, `${xf.SHOW}`))
            }
            ngOnInit() {
                this.isAnimated && (this.renderer.addClass(this.element.nativeElement, `${xf.FADE}`),
                Ip.reflow(this.element.nativeElement)),
                this.isShown = !0
            }
        }
        class Rf {
            constructor(n, l) {
                this.clf = l,
                this.config = Sf,
                this.onShow = new Mu,
                this.onShown = new Mu,
                this.onHide = new Mu,
                this.onHidden = new Mu,
                this.isBodyOverflowing = !1,
                this.originalBodyPadding = 0,
                this.scrollbarWidth = 0,
                this.modalsCount = 0,
                this.lastDismissReason = "",
                this.loaders = [],
                this._backdropLoader = this.clf.createLoader(null, null, null),
                this._renderer = n.createRenderer(null, null)
            }
            show(n, l) {
                return this.modalsCount++,
                this._createLoaders(),
                this.config = Object.assign({}, Sf, l),
                this._showBackdrop(),
                this.lastDismissReason = null,
                this._showModal(n)
            }
            hide(n) {
                1 === this.modalsCount && (this._hideBackdrop(),
                this.resetScrollbar()),
                this.modalsCount = this.modalsCount >= 1 ? this.modalsCount - 1 : 0,
                setTimeout(()=>{
                    this._hideModal(n),
                    this.removeLoaders(n)
                }
                , this.config.animated ? Af.BACKDROP : 0)
            }
            _showBackdrop() {
                const n = this.config.backdrop || "static" === this.config.backdrop
                  , l = !this.backdropRef || !this.backdropRef.instance.isShown;
                1 === this.modalsCount && (this.removeBackdrop(),
                n && l && (this._backdropLoader.attach(If).to("body").show({
                    isAnimated: this.config.animated
                }),
                this.backdropRef = this._backdropLoader._componentRef))
            }
            _hideBackdrop() {
                this.backdropRef && (this.backdropRef.instance.isShown = !1,
                setTimeout(()=>this.removeBackdrop(), this.config.animated ? Af.BACKDROP : 0))
            }
            _showModal(n) {
                const l = this.loaders[this.loaders.length - 1]
                  , e = new kf
                  , t = l.provide({
                    provide: Cf,
                    useValue: this.config
                }).provide({
                    provide: kf,
                    useValue: e
                }).attach(Tf).to("body").show({
                    content: n,
                    isAnimated: this.config.animated,
                    initialState: this.config.initialState,
                    bsModalService: this
                });
                return t.instance.level = this.getModalsCount(),
                e.hide = ()=>{
                    t.instance.hide()
                }
                ,
                e.content = l.getInnerComponent() || null,
                e.setClass = n=>{
                    t.instance.config.class = n
                }
                ,
                e
            }
            _hideModal(n) {
                const l = this.loaders[n - 1];
                l && l.hide()
            }
            getModalsCount() {
                return this.modalsCount
            }
            setDismissReason(n) {
                this.lastDismissReason = n
            }
            removeBackdrop() {
                this._backdropLoader.hide(),
                this.backdropRef = null
            }
            checkScrollbar() {
                this.isBodyOverflowing = document.body.clientWidth < window.innerWidth,
                this.scrollbarWidth = this.getScrollbarWidth()
            }
            setScrollbar() {
                document && (this.originalBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right") || "0", 10),
                this.isBodyOverflowing && (document.body.style.paddingRight = `${this.originalBodyPadding + this.scrollbarWidth}px`))
            }
            resetScrollbar() {
                document.body.style.paddingRight = `${this.originalBodyPadding}px`
            }
            getScrollbarWidth() {
                const n = this._renderer.createElement("div");
                this._renderer.addClass(n, xf.SCROLLBAR_MEASURER),
                this._renderer.appendChild(document.body, n);
                const l = n.offsetWidth - n.clientWidth;
                return this._renderer.removeChild(document.body, n),
                l
            }
            _createLoaders() {
                const n = this.clf.createLoader(null, null, null);
                this.copyEvent(n.onBeforeShow, this.onShow),
                this.copyEvent(n.onShown, this.onShown),
                this.copyEvent(n.onBeforeHide, this.onHide),
                this.copyEvent(n.onHidden, this.onHidden),
                this.loaders.push(n)
            }
            removeLoaders(n) {
                this.loaders.splice(n - 1, 1),
                this.loaders.forEach((n,l)=>{
                    n.instance.level = l + 1
                }
                )
            }
            copyEvent(n, l) {
                n.subscribe(()=>{
                    l.emit(this.lastDismissReason)
                }
                )
            }
        }
        class Pf {
            static forRoot() {
                return {
                    ngModule: Pf,
                    providers: [Rf, Op, yf]
                }
            }
        }
        var Of = lt({
            encapsulation: 0,
            styles: [[""]],
            data: {}
        });
        function Mf(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 63, "div", [["class", "modal-box"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 62, "div", [["class", "modal-body"]], null, null, null, null, null)), (n()(),
            Yr(2, 0, null, null, 2, "div", [["class", "header"]], null, null, null, null, null)), (n()(),
            Yr(3, 0, null, null, 1, "span", [["class", "spikes modal-head "]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" TECHQUEST 2020"])), (n()(),
            Yr(5, 0, null, null, 58, "div", [["class", "content"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 2, "button", [["aria-label", "Close"], ["class", "close pull-right"], ["type", "button"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.modalRef.hide() && t),
                t
            }
            ), null, null)), (n()(),
            Yr(7, 0, null, null, 1, "span", [["aria-hidden", "true"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["\xd7"])), (n()(),
            Yr(9, 0, null, null, 1, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["AI"])), (n()(),
            Yr(11, 0, null, null, 52, "tabset", [], [[2, "tab-container", null]], null, null, kp, bp)), au(12, 180224, null, 0, mp, [gp, me, de], null, null), (n()(),
            Yr(13, 0, null, 0, 3, "tab", [["heading", "About"], ["id", "tab1"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(14, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"],
                id: [1, "id"]
            }, null), (n()(),
            Yr(15, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [' Artificial Intelligence is an up heaving technology in this day and age. If you want to be a part of this technological advancement and didn\u2019t know how, don\u2019t fidget! TECHQUEST 2020 offers you this course that entitles you with the knowledge of programming AI and applying it. Artificial intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning (the acquisition of information and rules for using the information), reasoning (using rules to reach approximate or definite conclusions) and self-correction. This is a type of "deep learning" that allows machines to process information for themselves on a very sophisticated level, allowing them to perform complex functions like facial recognition. '])), (n()(),
            Yr(17, 0, null, 0, 21, "tab", [["heading", "Instructions"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(18, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(19, 0, null, null, 19, "ol", [], null, null, null, null, null)), (n()(),
            Yr(20, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" All the participants should have their college id card. "])), (n()(),
            Yr(22, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Participants should be present in all the sessions. Failing this, no certificate will be awarded to the participant. "])), (n()(),
            Yr(24, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Participants should register individually. "])), (n()(),
            Yr(26, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The above rules cannot be violated. "])), (n()(),
            Yr(28, 0, null, null, 6, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Participants must bring their own laptops per team. "])), (n()(),
            Yr(30, 0, null, null, 1, "span", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["*****"])), (n()(),
            Yr(32, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            Yr(33, 0, null, null, 1, "i", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Minimum requirement (Windows 10,RAM 4 GB,Above CoreI3 4th Gen,Inbuilt Camera)"])), (n()(),
            Yr(35, 0, null, null, 3, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Participants must bring a pen drive per team."])), (n()(),
            Yr(37, 0, null, null, 1, "span", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["***"])), (n()(),
            Yr(39, 0, null, 0, 18, "tab", [["heading", "Details/Price"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(40, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(41, 0, null, null, 16, "ol", [], null, null, null, null, null)), (n()(),
            Yr(42, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The usage of Python in AI development "])), (n()(),
            Yr(44, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Improve your algorithm skills and learn face recognition using a standard laptop."])), (n()(),
            Yr(46, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Develop software for license plate recognition. "])), (n()(),
            Yr(48, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Learn AI planning."])), (n()(),
            Yr(50, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Date of the event : February 27th to February 28th"])), (n()(),
            Yr(52, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Duration : 2 days"])), (n()(),
            Yr(54, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Registration fee : 3200/- (Team). (i.e) 1600/- (Per Head)"])), (n()(),
            Yr(56, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Team Size : 2 Members(max)"])), (n()(),
            Yr(58, 0, null, 0, 5, "tab", [["heading", "Contact Us"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(59, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(60, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" T. SANJAY - 9121342566 "])), (n()(),
            Yr(62, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" M.VAMSI - 9948617567"]))], (function(n, l) {
                n(l, 14, 0, "About", "tab1"),
                n(l, 18, 0, "Instructions"),
                n(l, 40, 0, "Details/Price"),
                n(l, 59, 0, "Contact Us")
            }
            ), (function(n, l) {
                n(l, 11, 0, Zt(l, 12).clazz),
                n(l, 13, 0, Zt(l, 14).id, Zt(l, 14).active, Zt(l, 14).addClass),
                n(l, 17, 0, Zt(l, 18).id, Zt(l, 18).active, Zt(l, 18).addClass),
                n(l, 39, 0, Zt(l, 40).id, Zt(l, 40).active, Zt(l, 40).addClass),
                n(l, 58, 0, Zt(l, 59).id, Zt(l, 59).active, Zt(l, 59).addClass)
            }
            ))
        }
        function Df(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 62, "div", [["class", "modal-box"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 61, "div", [["class", "modal-body"]], null, null, null, null, null)), (n()(),
            Yr(2, 0, null, null, 2, "div", [["class", "header"]], null, null, null, null, null)), (n()(),
            Yr(3, 0, null, null, 1, "span", [["class", "spikes modal-head "]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" TECHQUEST 2020"])), (n()(),
            Yr(5, 0, null, null, 57, "div", [["class", "content"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 2, "button", [["aria-label", "Close"], ["class", "close pull-right"], ["type", "button"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.modalRef.hide() && t),
                t
            }
            ), null, null)), (n()(),
            Yr(7, 0, null, null, 1, "span", [["aria-hidden", "true"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["\xd7"])), (n()(),
            Yr(9, 0, null, null, 1, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["RC Planes"])), (n()(),
            Yr(11, 0, null, null, 51, "tabset", [], [[2, "tab-container", null]], null, null, kp, bp)), au(12, 180224, null, 0, mp, [gp, me, de], null, null), (n()(),
            Yr(13, 0, null, 0, 3, "tab", [["heading", "About"], ["id", "tab1"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(14, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"],
                id: [1, "id"]
            }, null), (n()(),
            Yr(15, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" A radio-controlled aircraft (often called RC aircraft or RC plane) is a small flying machine that is controlled using a hand-held radio transmitter. The transmitter communicates with a receiver within the craft that sends signals to servomechanisms (servos) which move the control surfaces based on the position of joysticks on the transmitter. The control surfaces, in turn, affect the orientation of the plane. "])), (n()(),
            Yr(17, 0, null, 0, 18, "tab", [["heading", "Instructions"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(18, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(19, 0, null, null, 16, "ol", [], null, null, null, null, null)), (n()(),
            Yr(20, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" All the participants should have their college id card."])), (n()(),
            Yr(22, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Participants should be present in all the sessions. Failing this, no certificate will be awarded to the participant. "])), (n()(),
            Yr(24, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Participants should register individually."])), (n()(),
            Yr(26, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The above rules cannot be violated."])), (n()(),
            Yr(28, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["If participants wish to come individually, They are teamed up by the organizers."])), (n()(),
            Yr(30, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Team members are solely responsible for sharing the kit..."])), (n()(),
            Yr(32, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" kit or any particulars provided during the workshop will be given to the team itself."])), (n()(),
            Yr(34, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Apart from the kit provided to the team, if some one wants a extra kit, they can purchase."])), (n()(),
            Yr(36, 0, null, 0, 20, "tab", [["heading", "Details/Price"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(37, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(38, 0, null, null, 18, "ol", [], null, null, null, null, null)), (n()(),
            Yr(39, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Pure knowledge and lots of learning."])), (n()(),
            Yr(41, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Specialized Training from Domain Expert"])), (n()(),
            Yr(43, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Building a Radio-controlled aircraft and flying it in a short span."])), (n()(),
            Yr(45, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Certificate is given to the participants"])), (n()(),
            Yr(47, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Take away kit for each team i.e. Aircraft made by students (except Electronics)"])), (n()(),
            Yr(49, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Date of the event : February 27th to February 28th"])), (n()(),
            Yr(51, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Duration : 2 days"])), (n()(),
            Yr(53, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Registration fee : 7000/- (Team). (i.e) 1400/- (Per Head)"])), (n()(),
            Yr(55, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Team Size : 5 Members(max)"])), (n()(),
            Yr(57, 0, null, 0, 5, "tab", [["heading", "Contact Us"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(58, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(59, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["T.Sanjay - 9121342566"])), (n()(),
            Yr(61, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["G.Brahmaji - 9704644421"]))], (function(n, l) {
                n(l, 14, 0, "About", "tab1"),
                n(l, 18, 0, "Instructions"),
                n(l, 37, 0, "Details/Price"),
                n(l, 58, 0, "Contact Us")
            }
            ), (function(n, l) {
                n(l, 11, 0, Zt(l, 12).clazz),
                n(l, 13, 0, Zt(l, 14).id, Zt(l, 14).active, Zt(l, 14).addClass),
                n(l, 17, 0, Zt(l, 18).id, Zt(l, 18).active, Zt(l, 18).addClass),
                n(l, 36, 0, Zt(l, 37).id, Zt(l, 37).active, Zt(l, 37).addClass),
                n(l, 57, 0, Zt(l, 58).id, Zt(l, 58).active, Zt(l, 58).addClass)
            }
            ))
        }
        function Nf(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 58, "div", [["class", "modal-box"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 57, "div", [["class", "modal-body"]], null, null, null, null, null)), (n()(),
            Yr(2, 0, null, null, 2, "div", [["class", "header"]], null, null, null, null, null)), (n()(),
            Yr(3, 0, null, null, 1, "span", [["class", "spikes modal-head "]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" TECHQUEST 2020"])), (n()(),
            Yr(5, 0, null, null, 53, "div", [["class", "content"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 2, "button", [["aria-label", "Close"], ["class", "close pull-right"], ["type", "button"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.modalRef.hide() && t),
                t
            }
            ), null, null)), (n()(),
            Yr(7, 0, null, null, 1, "span", [["aria-hidden", "true"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["\xd7"])), (n()(),
            Yr(9, 0, null, null, 1, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["IoT"])), (n()(),
            Yr(11, 0, null, null, 47, "tabset", [], [[2, "tab-container", null]], null, null, kp, bp)), au(12, 180224, null, 0, mp, [gp, me, de], null, null), (n()(),
            Yr(13, 0, null, 0, 3, "tab", [["heading", "About"], ["id", "tab1"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(14, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"],
                id: [1, "id"]
            }, null), (n()(),
            Yr(15, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The internet of Things (IOT) has evolved from the convergence of wireless technologies, microelectromechanical systems (MEMS) and the internet. By connecting \u201cthings\u201d or devices in the real world such as cars, buildings, and industrial equipment, IOT promises to revolutionize our professional and personal life. The IOT market is likely to experience around 28% year-on-year growth, rising to 5.4billion connections across the globe by 2020, which includes cellular, fixed line, satellite and short rage wireless connections "])), (n()(),
            Yr(17, 0, null, 0, 18, "tab", [["heading", "Instructions"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(18, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(19, 0, null, null, 16, "ol", [], null, null, null, null, null)), (n()(),
            Yr(20, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" All the participants should have their college id card."])), (n()(),
            Yr(22, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Participants should be present in all the sessions. Failing this, no certificate will be awarded to the participant. "])), (n()(),
            Yr(24, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Participants should register individually."])), (n()(),
            Yr(26, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The above rules cannot be violated."])), (n()(),
            Yr(28, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["If participants wish to come individually, They are teamed up by the organizers."])), (n()(),
            Yr(30, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Team members are solely responsible for sharing the kit."])), (n()(),
            Yr(32, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" kit or any particulars provided during the workshop will be given to the team itself."])), (n()(),
            Yr(34, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Apart from the kit provided to the team, if some one wants a extra kit, they can purchase."])), (n()(),
            Yr(36, 0, null, 0, 16, "tab", [["heading", "Details/Price"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(37, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(38, 0, null, null, 14, "ol", [], null, null, null, null, null)), (n()(),
            Yr(39, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" To check out all the aspects of IoT. "])), (n()(),
            Yr(41, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" It is structured so as to guide you all under the supervision of experienced trainers."])), (n()(),
            Yr(43, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" You get a cool takeaway kit with all the essentials needed for this field."])), (n()(),
            Yr(45, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Date of the event : February 27th to February 28th"])), (n()(),
            Yr(47, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Duration : 2 days"])), (n()(),
            Yr(49, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Registration fee : 5400/- (Team). (i.e) 1350/- (Per Head)"])), (n()(),
            Yr(51, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Team Size : 4 Members(max)"])), (n()(),
            Yr(53, 0, null, 0, 5, "tab", [["heading", "Contact Us"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(54, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(55, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" T. SANJAY - 9121342566 "])), (n()(),
            Yr(57, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["G. BRAHMAJI - 9704644421"]))], (function(n, l) {
                n(l, 14, 0, "About", "tab1"),
                n(l, 18, 0, "Instructions"),
                n(l, 37, 0, "Details/Price"),
                n(l, 54, 0, "Contact Us")
            }
            ), (function(n, l) {
                n(l, 11, 0, Zt(l, 12).clazz),
                n(l, 13, 0, Zt(l, 14).id, Zt(l, 14).active, Zt(l, 14).addClass),
                n(l, 17, 0, Zt(l, 18).id, Zt(l, 18).active, Zt(l, 18).addClass),
                n(l, 36, 0, Zt(l, 37).id, Zt(l, 37).active, Zt(l, 37).addClass),
                n(l, 53, 0, Zt(l, 54).id, Zt(l, 54).active, Zt(l, 54).addClass)
            }
            ))
        }
        function Lf(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 58, "div", [["class", "modal-box"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 57, "div", [["class", "modal-body"]], null, null, null, null, null)), (n()(),
            Yr(2, 0, null, null, 2, "div", [["class", "header"]], null, null, null, null, null)), (n()(),
            Yr(3, 0, null, null, 1, "span", [["class", "spikes modal-head "]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" TECHQUEST 2020"])), (n()(),
            Yr(5, 0, null, null, 53, "div", [["class", "content"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 2, "button", [["aria-label", "Close"], ["class", "close pull-right"], ["type", "button"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.modalRef.hide() && t),
                t
            }
            ), null, null)), (n()(),
            Yr(7, 0, null, null, 1, "span", [["aria-hidden", "true"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["\xd7"])), (n()(),
            Yr(9, 0, null, null, 1, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Robotics"])), (n()(),
            Yr(11, 0, null, null, 47, "tabset", [], [[2, "tab-container", null]], null, null, kp, bp)), au(12, 180224, null, 0, mp, [gp, me, de], null, null), (n()(),
            Yr(13, 0, null, 0, 3, "tab", [["heading", "About"], ["id", "tab1"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(14, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"],
                id: [1, "id"]
            }, null), (n()(),
            Yr(15, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Robotics and other combinations will make the world pretty fantastic compared with today.They are used routinely to carry out many tasks that people don\u2019t want to do because such jobs are boring, dirty or dangerous. Robots can also be programmed to carry out some tasks that are too complex for humans. "])), (n()(),
            Yr(17, 0, null, 0, 18, "tab", [["heading", "Instructions"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(18, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(19, 0, null, null, 16, "ol", [], null, null, null, null, null)), (n()(),
            Yr(20, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" All the participants should have their college id card."])), (n()(),
            Yr(22, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Participants should be present in all the sessions. Failing this, no certificate will be awarded to the participant. "])), (n()(),
            Yr(24, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Participants should register individually."])), (n()(),
            Yr(26, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The above rules cannot be violated."])), (n()(),
            Yr(28, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" You can purchase a cool takeaway kit."])), (n()(),
            Yr(30, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Participants must bring a pen drive per team.*****"])), (n()(),
            Yr(32, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" kit or any particulars provided during the workshop will be given to the team itself."])), (n()(),
            Yr(34, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Apart from the kit provided to the team, if some one wants a extra kit, they can purchase."])), (n()(),
            Yr(36, 0, null, 0, 16, "tab", [["heading", "Details/Price"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(37, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(38, 0, null, null, 14, "ol", [], null, null, null, null, null)), (n()(),
            Yr(39, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Basic designing of a robot."])), (n()(),
            Yr(41, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Visualising how a robot works and use sensors in a more sensible way."])), (n()(),
            Yr(43, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Building your first robot made easy."])), (n()(),
            Yr(45, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" It is structured so as to guide you all under the supervision of experienced trainers."])), (n()(),
            Yr(47, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Date of the event : Slot 1 : February 27th 2020 & Slot 2 : February 28th 2020"])), (n()(),
            Yr(49, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Duration : 1 day"])), (n()(),
            Yr(51, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Registration fee : 1000/- (Solo Participation)"])), (n()(),
            Yr(53, 0, null, 0, 5, "tab", [["heading", "Contact Us"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(54, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(55, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["T. SANJAY - 9121342566 "])), (n()(),
            Yr(57, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["M.VAMSI - 9948617567"]))], (function(n, l) {
                n(l, 14, 0, "About", "tab1"),
                n(l, 18, 0, "Instructions"),
                n(l, 37, 0, "Details/Price"),
                n(l, 54, 0, "Contact Us")
            }
            ), (function(n, l) {
                n(l, 11, 0, Zt(l, 12).clazz),
                n(l, 13, 0, Zt(l, 14).id, Zt(l, 14).active, Zt(l, 14).addClass),
                n(l, 17, 0, Zt(l, 18).id, Zt(l, 18).active, Zt(l, 18).addClass),
                n(l, 36, 0, Zt(l, 37).id, Zt(l, 37).active, Zt(l, 37).addClass),
                n(l, 53, 0, Zt(l, 54).id, Zt(l, 54).active, Zt(l, 54).addClass)
            }
            ))
        }
        function jf(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 72, "div", [["class", "app"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 2, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["WORKSHOPS "])), (n()(),
            Yr(3, 0, null, null, 0, "span", [["class", "border"]], null, null, null, null, null)), (n()(),
            Yr(4, 0, null, null, 68, "div", [["class", "section"]], null, null, null, null, null)), (n()(),
            Yr(5, 0, null, null, 16, "div", [["class", "block"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 15, "div", [["class", "blk"]], null, null, null, null, null)), (n()(),
            Yr(7, 0, null, null, 7, "div", [["class", "text"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.openModal(Zt(n, 73)) && t),
                t
            }
            ), null, null)), (n()(),
            Yr(8, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/workshops/ai.jpeg"]], null, null, null, null, null)), (n()(),
            Yr(9, 0, null, null, 1, "h3", [["class", "spikes header"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["AI"])), (n()(),
            Yr(11, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Our intelligence is what makes us human, and AI is an extension of that quality. "])), (n()(),
            Yr(13, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Artificial Intelligence is an up heaving technology in this day and age. If you want to be a part of this technological advancement and didn\u2019t know how, don\u2019t fidget! SPIKES header 20 offers you this course that entitles you with the knowledge of programming AI and applying it."])), (n()(),
            Yr(15, 0, null, null, 6, "div", [["class", "bttn"]], null, null, null, null, null)), (n()(),
            Yr(16, 0, null, null, 1, "a", [["class", "left"], ["href", "http://api.auspikes.in"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Register"])), (n()(),
            Yr(18, 0, null, null, 1, "a", [["class", "left"], ["href", "http://api.auspikes.in/welcome/login"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Login"])), (n()(),
            Yr(20, 0, null, null, 1, "a", [["class", "right"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.openModal(Zt(n, 73)) && t),
                t
            }
            ), null, null)), (n()(),
            ci(-1, null, ["Details"])), (n()(),
            Yr(22, 0, null, null, 16, "div", [["class", "block"]], null, null, null, null, null)), (n()(),
            Yr(23, 0, null, null, 15, "div", [["class", "blk"]], null, null, null, null, null)), (n()(),
            Yr(24, 0, null, null, 7, "div", [["class", "text"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.openModal(Zt(n, 74)) && t),
                t
            }
            ), null, null)), (n()(),
            Yr(25, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/workshops/rc planes.jpg"]], null, null, null, null, null)), (n()(),
            Yr(26, 0, null, null, 1, "h3", [["class", "spikes header"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["RC PLANES"])), (n()(),
            Yr(28, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["\u201cFlying is fun...but making things fly is even more fun\u201d"])), (n()(),
            Yr(30, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Have you been fascinated by the helicopters that you could control with a remote? Did you want to design one of your own but faced difficulties at \u2018how\u2019? Get on board and fasten your seat belts because we are going to help you fly without taking your feet off the ground."])), (n()(),
            Yr(32, 0, null, null, 6, "div", [["class", "bttn"]], null, null, null, null, null)), (n()(),
            Yr(33, 0, null, null, 1, "a", [["class", "left"], ["href", "http://api.auspikes.in"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Register"])), (n()(),
            Yr(35, 0, null, null, 1, "a", [["class", "left"], ["href", "http://api.auspikes.in/welcome/login"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Login"])), (n()(),
            Yr(37, 0, null, null, 1, "a", [["class", "right"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.openModal(Zt(n, 74)) && t),
                t
            }
            ), null, null)), (n()(),
            ci(-1, null, ["Details"])), (n()(),
            Yr(39, 0, null, null, 16, "div", [["class", "block"]], null, null, null, null, null)), (n()(),
            Yr(40, 0, null, null, 15, "div", [["class", "blk"]], null, null, null, null, null)), (n()(),
            Yr(41, 0, null, null, 7, "div", [["class", "text"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.openModal(Zt(n, 75)) && t),
                t
            }
            ), null, null)), (n()(),
            Yr(42, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/workshops/iot.png"]], null, null, null, null, null)), (n()(),
            Yr(43, 0, null, null, 1, "h3", [["class", "spikes header"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["IoT"])), (n()(),
            Yr(45, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["If you think that the internet has changed your life, think again. This IOT two-day workshop is about to change it all over again!!!"])), (n()(),
            Yr(47, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["The internet of Things (IOT) has evolved from the convergence of wireless technologies, microelectromechanical systems (MEMS) and the internet."])), (n()(),
            Yr(49, 0, null, null, 6, "div", [["class", "bttn"]], null, null, null, null, null)), (n()(),
            Yr(50, 0, null, null, 1, "a", [["class", "left"], ["href", "http://api.auspikes.in"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Register"])), (n()(),
            Yr(52, 0, null, null, 1, "a", [["class", "left"], ["href", "http://api.auspikes.in/welcome/login"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Login"])), (n()(),
            Yr(54, 0, null, null, 1, "a", [["class", "right"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.openModal(Zt(n, 75)) && t),
                t
            }
            ), null, null)), (n()(),
            ci(-1, null, ["Details"])), (n()(),
            Yr(56, 0, null, null, 16, "div", [["class", "block"]], null, null, null, null, null)), (n()(),
            Yr(57, 0, null, null, 15, "div", [["class", "blk"]], null, null, null, null, null)), (n()(),
            Yr(58, 0, null, null, 7, "div", [["class", "text"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.openModal(Zt(n, 76)) && t),
                t
            }
            ), null, null)), (n()(),
            Yr(59, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/workshops/robotics.jpg"]], null, null, null, null, null)), (n()(),
            Yr(60, 0, null, null, 1, "h3", [["class", "spikes header"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["ROBOTICS"])), (n()(),
            Yr(62, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Robotics is the discipline of emulating our lives, of wondering how we work Robotics is the art of making robots, machines that combine concepts from multiple engineering disciplines. "])), (n()(),
            Yr(64, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Creating your own robot will help you practically learn how engineering is applied. Robotics and other combinations will make the world pretty fantastic compared with today..."])), (n()(),
            Yr(66, 0, null, null, 6, "div", [["class", "bttn"]], null, null, null, null, null)), (n()(),
            Yr(67, 0, null, null, 1, "a", [["class", "left"], ["href", "http://api.auspikes.in"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Register"])), (n()(),
            Yr(69, 0, null, null, 1, "a", [["class", "left"], ["href", "http://api.auspikes.in/welcome/login"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Login"])), (n()(),
            Yr(71, 0, null, null, 1, "a", [["class", "right"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.openModal(Zt(n, 76)) && t),
                t
            }
            ), null, null)), (n()(),
            ci(-1, null, ["Details"])), (n()(),
            Zr(0, [["template", 2]], null, 0, null, Mf)), (n()(),
            Zr(0, [["template1", 2]], null, 0, null, Df)), (n()(),
            Zr(0, [["template2", 2]], null, 0, null, Nf)), (n()(),
            Zr(0, [["template3", 2]], null, 0, null, Lf))], null, null)
        }
        function Uf(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 1, "app-workshops", [], null, null, null, jf, Of)), au(1, 114688, null, 0, Cp, [Rf], null, null)], (function(n, l) {
                n(l, 1, 0)
            }
            ), null)
        }
        var Hf = Ht("app-workshops", Cp, Uf, {}, {}, []);
        class Ff {
            constructor(n) {
                this.modalService = n
            }
            ngOnInit() {}
            openModal(n) {
                this.modalRef = this.modalService.show(n, Object.assign({}, {
                    class: "gray modal-lg"
                }))
            }
        }
        var Vf = lt({
            encapsulation: 0,
            styles: [["@media only screen and (min-width:1200px){.section[_ngcontent-%COMP%]   .block[_ngcontent-%COMP%]{-webkit-box-flex:0;flex:0 0 33%}}"]],
            data: {}
        });
        function $f(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 116, "div", [["class", "modal-box"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 115, "div", [["class", "modal-body"]], null, null, null, null, null)), (n()(),
            Yr(2, 0, null, null, 2, "div", [["class", "header"]], null, null, null, null, null)), (n()(),
            Yr(3, 0, null, null, 1, "span", [["class", "spikes modal-head "]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" TECHQUEST 2020"])), (n()(),
            Yr(5, 0, null, null, 111, "div", [["class", "content"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 2, "button", [["aria-label", "Close"], ["class", "close pull-right"], ["type", "button"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.modalRef.hide() && t),
                t
            }
            ), null, null)), (n()(),
            Yr(7, 0, null, null, 1, "span", [["aria-hidden", "true"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["\xd7"])), (n()(),
            Yr(9, 0, null, null, 1, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Presentations"])), (n()(),
            Yr(11, 0, null, null, 105, "tabset", [], [[2, "tab-container", null]], null, null, kp, bp)), au(12, 180224, null, 0, mp, [gp, me, de], null, null), (n()(),
            Yr(13, 0, null, 0, 3, "tab", [["heading", "About"], ["id", "tab1"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(14, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"],
                id: [1, "id"]
            }, null), (n()(),
            Yr(15, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Have you got the skills to impress people with your ideas? Spikes presents you a stage to convey your thoughts and ideas and interact. This session gives you the experience of deliberating, questioning and proposing something new! So, gear up with a brief but influencing presentation."])), (n()(),
            Yr(17, 0, null, 0, 22, "tab", [["heading", "Instructions/Price"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(18, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(19, 0, null, null, 20, "ol", [], null, null, null, null, null)), (n()(),
            Yr(20, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Presentations must be done only on the given topics."])), (n()(),
            Yr(22, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Each presentation should be limited to EIGHT slides. "])), (n()(),
            Yr(24, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Each team should consist of at most 3 members."])), (n()(),
            Yr(26, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Abstracts must be send to us through email - (presentations@auspikes.in)"])), (n()(),
            Yr(28, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Teams who are selected for final competition will be communicated through email only."])), (n()(),
            Yr(30, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" During the final competition each team will be allotted 10 minutes (8minutes for presentation & 2minutes for queries)."])), (n()(),
            Yr(32, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The presentations must be done in .pptx/.ppt."])), (n()(),
            Yr(34, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Teams must submit a soft copy in the above mentioned formats at the time of fest."])), (n()(),
            Yr(36, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Date of the event : 27th & 28th February 2020"])), (n()(),
            Yr(38, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Registration fee :Rs.200/-"])), (n()(),
            Yr(40, 0, null, 0, 70, "tab", [["heading", "Details"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(41, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(42, 0, null, null, 1, "b", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["THEME OF THE PRESENTATION"])), (n()(),
            Yr(44, 0, null, null, 66, "ol", [], null, null, null, null, null)), (n()(),
            Yr(45, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" 3D Biometrics"])), (n()(),
            Yr(47, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" 3D displays"])), (n()(),
            Yr(49, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" 5 Pen PC Technology"])), (n()(),
            Yr(51, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Adaptive Piezoelectric energy harvesting circuit"])), (n()(),
            Yr(53, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Airborne wind turbine"])), (n()(),
            Yr(55, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Augmented reality and virtual reality"])), (n()(),
            Yr(57, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Betavoltaics"])), (n()(),
            Yr(59, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Bioplastic"])), (n()(),
            Yr(61, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Child Safety Wearable Device"])), (n()(),
            Yr(63, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Electronic Waste Management"])), (n()(),
            Yr(65, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Electronics bus Ticketing System"])), (n()(),
            Yr(67, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["e Governance"])), (n()(),
            Yr(69, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Gi-Fi Technology"])), (n()(),
            Yr(71, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Intelligent Transportation Systems"])), (n()(),
            Yr(73, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Li-Fi"])), (n()(),
            Yr(75, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Lightning Protection Using LFA (Lightning Frequency Arrester)"])), (n()(),
            Yr(77, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Magnetic Refrigeration"])), (n()(),
            Yr(79, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Memristor"])), (n()(),
            Yr(81, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Monolithic Microscale Heat Pumps"])), (n()(),
            Yr(83, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Na Thermo-Electro-Chemical Converter"])), (n()(),
            Yr(85, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Nanorobots in medical applications "])), (n()(),
            Yr(87, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Nuclear Batteries"])), (n()(),
            Yr(89, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Optical Coherence Tomography"])), (n()(),
            Yr(91, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Optical Rectenna"])), (n()(),
            Yr(93, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Polymer Memory"])), (n()(),
            Yr(95, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Quantum computing"])), (n()(),
            Yr(97, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Smart Voting"])), (n()(),
            Yr(99, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Solid-state transformer"])), (n()(),
            Yr(101, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Speech Processing"])), (n()(),
            Yr(103, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Spintronics"])), (n()(),
            Yr(105, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Superalloy"])), (n()(),
            Yr(107, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Underwater Windmill"])), (n()(),
            Yr(109, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Vertical farming"])), (n()(),
            Yr(111, 0, null, 0, 5, "tab", [["heading", "Contact Us"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(112, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(113, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" RSV SAGAR - 8074100747 "])), (n()(),
            Yr(115, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["MD. AFRIDI - 7995962086"]))], (function(n, l) {
                n(l, 14, 0, "About", "tab1"),
                n(l, 18, 0, "Instructions/Price"),
                n(l, 41, 0, "Details"),
                n(l, 112, 0, "Contact Us")
            }
            ), (function(n, l) {
                n(l, 11, 0, Zt(l, 12).clazz),
                n(l, 13, 0, Zt(l, 14).id, Zt(l, 14).active, Zt(l, 14).addClass),
                n(l, 17, 0, Zt(l, 18).id, Zt(l, 18).active, Zt(l, 18).addClass),
                n(l, 40, 0, Zt(l, 41).id, Zt(l, 41).active, Zt(l, 41).addClass),
                n(l, 111, 0, Zt(l, 112).id, Zt(l, 112).active, Zt(l, 112).addClass)
            }
            ))
        }
        function Bf(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 65, "div", [["class", "modal-box"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 64, "div", [["class", "modal-body"]], null, null, null, null, null)), (n()(),
            Yr(2, 0, null, null, 2, "div", [["class", "header"]], null, null, null, null, null)), (n()(),
            Yr(3, 0, null, null, 1, "span", [["class", "spikes modal-head "]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["TECHQUEST 2020"])), (n()(),
            Yr(5, 0, null, null, 60, "div", [["class", "content"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 2, "button", [["aria-label", "Close"], ["class", "close pull-right"], ["type", "button"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.modalRef.hide() && t),
                t
            }
            ), null, null)), (n()(),
            Yr(7, 0, null, null, 1, "span", [["aria-hidden", "true"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["\xd7"])), (n()(),
            Yr(9, 0, null, null, 1, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Project Expo"])), (n()(),
            Yr(11, 0, null, null, 54, "tabset", [], [[2, "tab-container", null]], null, null, kp, bp)), au(12, 180224, null, 0, mp, [gp, me, de], null, null), (n()(),
            Yr(13, 0, null, 0, 16, "tab", [["heading", "About"], ["id", "tab1"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(14, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"],
                id: [1, "id"]
            }, null), (n()(),
            Yr(15, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" A platform which allows you to model and present your ideas, Project expo brings you an atmosphere where healthy competition prevails and students combine their knowledge and artistic skills. So gather a group, build your thoughts, plan and design and showcase it in the best way possible. "])), (n()(),
            Yr(17, 0, null, null, 1, "b", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" THEME OF THE PROJECT: "])), (n()(),
            Yr(19, 0, null, null, 10, "ol", [], null, null, null, null, null)), (n()(),
            Yr(20, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Innovations in Engineering"])), (n()(),
            Yr(22, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Social Relevance "])), (n()(),
            Yr(24, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Technology and Application"])), (n()(),
            Yr(26, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Uniqueness and Novelty"])), (n()(),
            Yr(28, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Green Initiatives"])), (n()(),
            Yr(30, 0, null, 0, 14, "tab", [["heading", "Instructions"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(31, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(32, 0, null, null, 12, "ol", [], null, null, null, null, null)), (n()(),
            Yr(33, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The competition is open to only under graduate students."])), (n()(),
            Yr(35, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Members should have a valid student ID card of their college."])), (n()(),
            Yr(37, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" A team member can participate in only one presentation."])), (n()(),
            Yr(39, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Qualified participants will have to make a presentation before a panel of judges explaining in detail about the project along with a detailed report that needs to be submitted for evaluation."])), (n()(),
            Yr(41, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The organizers reserve the right to change any of the highlighted points above and the participants will be notified beforehand."])), (n()(),
            Yr(43, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The participants are responsible for their project models."])), (n()(),
            Yr(45, 0, null, 0, 16, "tab", [["heading", "Details/Price"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(46, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(47, 0, null, null, 14, "ol", [], null, null, null, null, null)), (n()(),
            Yr(48, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The project should fall under one or more themes mentioned above."])), (n()(),
            Yr(50, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The project should be a working model."])), (n()(),
            Yr(52, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The document or PDF should contain just a simple description about the project ( like project title, working, principle, pros and cons, etc.) "])), (n()(),
            Yr(54, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Date: 28th February 2020"])), (n()(),
            Yr(56, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Timings: Morning session ( 9am to 1pm) and Afternoon session(2pm to 5pm)"])), (n()(),
            Yr(58, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Team size: 1 to 4 members"])), (n()(),
            Yr(60, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Registration fee: Rs. 100/- (per team)"])), (n()(),
            Yr(62, 0, null, 0, 3, "tab", [["heading", "Contact Us"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(63, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(64, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["A. SWAMY - 9160303092"]))], (function(n, l) {
                n(l, 14, 0, "About", "tab1"),
                n(l, 31, 0, "Instructions"),
                n(l, 46, 0, "Details/Price"),
                n(l, 63, 0, "Contact Us")
            }
            ), (function(n, l) {
                n(l, 11, 0, Zt(l, 12).clazz),
                n(l, 13, 0, Zt(l, 14).id, Zt(l, 14).active, Zt(l, 14).addClass),
                n(l, 30, 0, Zt(l, 31).id, Zt(l, 31).active, Zt(l, 31).addClass),
                n(l, 45, 0, Zt(l, 46).id, Zt(l, 46).active, Zt(l, 46).addClass),
                n(l, 62, 0, Zt(l, 63).id, Zt(l, 63).active, Zt(l, 63).addClass)
            }
            ))
        }
        function zf(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 76, "div", [["class", "modal-box"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 75, "div", [["class", "modal-body"]], null, null, null, null, null)), (n()(),
            Yr(2, 0, null, null, 2, "div", [["class", "header"]], null, null, null, null, null)), (n()(),
            Yr(3, 0, null, null, 1, "span", [["class", "spikes modal-head "]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" TECHQUEST 2020"])), (n()(),
            Yr(5, 0, null, null, 71, "div", [["class", "content"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 2, "button", [["aria-label", "Close"], ["class", "close pull-right"], ["type", "button"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.modalRef.hide() && t),
                t
            }
            ), null, null)), (n()(),
            Yr(7, 0, null, null, 1, "span", [["aria-hidden", "true"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["\xd7"])), (n()(),
            Yr(9, 0, null, null, 1, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Circuitrix"])), (n()(),
            Yr(11, 0, null, null, 65, "tabset", [], [[2, "tab-container", null]], null, null, kp, bp)), au(12, 180224, null, 0, mp, [gp, me, de], null, null), (n()(),
            Yr(13, 0, null, 0, 16, "tab", [["heading", "About"], ["id", "tab1"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(14, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"],
                id: [1, "id"]
            }, null), (n()(),
            Yr(15, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" BUILD - DEBUG - TEST"])), (n()(),
            Yr(17, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Test your designing, debugging and implementation skills by coming up with solutions for the most commonly faced circuit problems. Crack your technical brain to figure out the mystery behind the bugs of circuit."])), (n()(),
            Yr(19, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Prerequisites : Basic knowledge on electrical circuits and circuit theory."])), (n()(),
            Yr(21, 0, null, null, 8, "ol", [], null, null, null, null, null)), (n()(),
            Yr(22, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Date : 27th Feb, 2020"])), (n()(),
            Yr(24, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Team Size : 2"])), (n()(),
            Yr(26, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Venue : Department of Instrument Technology"])), (n()(),
            Yr(28, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Registration fee : Free Event"])), (n()(),
            Yr(30, 0, null, 0, 14, "tab", [["heading", "Instructions"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(31, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(32, 0, null, null, 12, "ol", [], null, null, null, null, null)), (n()(),
            Yr(33, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" College ID card is Compulsory."])), (n()(),
            Yr(35, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Use of mobile phones and any other electronic/other gadgets are strictly prohibited."])), (n()(),
            Yr(37, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Participants have to reach the venue at least half an hour before the scheduled time."])), (n()(),
            Yr(39, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Participants bear the whole responsibility of the components and equipment and a fine will be imposed if damaged."])), (n()(),
            Yr(41, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Students should get their own stationery."])), (n()(),
            Yr(43, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Rules may be update from time to time"])), (n()(),
            Yr(45, 0, null, 0, 25, "tab", [["heading", "Details/Price"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(46, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(47, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["The event will comprise of two rounds"])), (n()(),
            Yr(49, 0, null, null, 1, "b", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Round 1- Prelims"])), (n()(),
            Yr(51, 0, null, null, 6, "ol", [], null, null, null, null, null)), (n()(),
            Yr(52, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" This round includes a questionnaire consisting multiple choice questions (15)"])), (n()(),
            Yr(54, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The participants need to solve 15 questions in 15 minutes."])), (n()(),
            Yr(56, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The questions will be based on \u2018Electronics Communication and Fundamentals\u2019."])), (n()(),
            Yr(58, 0, null, null, 1, "b", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Round 2- Mains"])), (n()(),
            Yr(60, 0, null, null, 8, "ol", [], null, null, null, null, null)), (n()(),
            Yr(61, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Each team need to build or debug the circuits within the allotted time."])), (n()(),
            Yr(63, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["A circuit kit will be provided with a faulty schematic diagram and the participants must rectify the fault and build the circuit according to the required output. "])), (n()(),
            Yr(65, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["The participants are either given a circuit to be built or to debug and the participants must complete their task within the given time limit."])), (n()(),
            Yr(67, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["The first position will be secured by the team who completes the task within the least time."])), (n()(),
            Yr(69, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Final judgement will be based on 30% of round 1 and 70% of round 2****"])), (n()(),
            Yr(71, 0, null, 0, 5, "tab", [["heading", "Contact Us"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(72, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(73, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["G. BHARAT - 8074254360"])), (n()(),
            Yr(75, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["KRISHNA SAMEER RAJ - 9652669955"]))], (function(n, l) {
                n(l, 14, 0, "About", "tab1"),
                n(l, 31, 0, "Instructions"),
                n(l, 46, 0, "Details/Price"),
                n(l, 72, 0, "Contact Us")
            }
            ), (function(n, l) {
                n(l, 11, 0, Zt(l, 12).clazz),
                n(l, 13, 0, Zt(l, 14).id, Zt(l, 14).active, Zt(l, 14).addClass),
                n(l, 30, 0, Zt(l, 31).id, Zt(l, 31).active, Zt(l, 31).addClass),
                n(l, 45, 0, Zt(l, 46).id, Zt(l, 46).active, Zt(l, 46).addClass),
                n(l, 71, 0, Zt(l, 72).id, Zt(l, 72).active, Zt(l, 72).addClass)
            }
            ))
        }
        function qf(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 51, "div", [["class", "app"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 2, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["TECHNICHE "])), (n()(),
            Yr(3, 0, null, null, 0, "span", [["class", "border"]], null, null, null, null, null)), (n()(),
            Yr(4, 0, null, null, 47, "div", [["class", "section"]], null, null, null, null, null)), (n()(),

            Yr(5, 0, null, null, 14, "div", [["class", "block"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 13, "div", [["class", "blk"]], null, null, null, null, null)), (n()(),
            Yr(7, 0, null, null, 5, "div", [["class", "text"]], null, [[null, "click"]], null, null)), (n()(),
            Yr(8, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/tech/presentations.jpg"]], null, null, null, null, null)), (n()(),
            Yr(9, 0, null, null, 1, "h3", [["class", "techquest header"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["CODEMET"])), (n()(),
            Yr(11, 0, null, null, 1, "p", [["align", "justify"]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Code your ideas for the stated problems by using any of the programming languages (C, C++, Java8, Python3). "])), (n()(),
            Yr(13, 0, null, null, 6, "div", [["class", "bttn"]], null, null, null, null, null)), (n()(),
            Yr(14, 0, null, null, 1, "a", [["class", "left"], ["href", "http://techquest.mzcet.in/register"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Register"])), (n()(),
            Yr(16, 0, null, null, 1, "a", [["class", "left"], ["href", "http://techquest.mzcet.in/admin"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Admin"])), (n()(),
            Yr(18, 0, null, null, 1, "a", [["class", "left"], ["href", "/codemet.html"],  ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Details"])), (n()(),

            Yr(20, 0, null, null, 14, "div", [["class", "block"]], null, null, null, null, null)), (n()(),
            Yr(21, 0, null, null, 13, "div", [["class", "blk"]], null, null, null, null, null)), (n()(),
            Yr(22, 0, null, null, 5, "div", [["class", "text"]], null, [[null, "click"]], null, null)), (n()(),
            Yr(23, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/tech/project expo.jpg"]], null, null, null, null, null)), (n()(),
            Yr(24, 0, null, null, 1, "h3", [["class", "techquest header"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["UNLINK 1337"])), (n()(),
            Yr(26, 0, null, null, 1, "p", [["align", "justify"]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" CTF (Capture The Flag) is a kind of information security competition that challenges you to solve variety of tasks ranging from a scavenger hunt on wikipedia to basic programming exercises. "])), (n()(),
            Yr(28, 0, null, null, 6, "div", [["class", "bttn"]], null, null, null, null, null)), (n()(),
            Yr(29, 0, null, null, 1, "a", [["class", "left"], ["href", "http://techquest.mzcet.in/register"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Register"])), (n()(),
            Yr(31, 0, null, null, 1, "a", [["class", "left"], ["href", "http://techquest.mzcet.in/admin"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Admin"])), (n()(),
            Yr(33, 0, null, null, 1, "a", [["class", "left"], ["href", "/ctf.html"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Details"])), (n()(),

            Yr(35, 0, null, null, 16, "div", [["class", "block"]], null, null, null, null, null)), (n()(),
            Yr(36, 0, null, null, 15, "div", [["class", "blk"]], null, null, null, null, null)), (n()(),
            Yr(37, 0, null, null, 7, "div", [["class", "text"]], null, [[null, "click"]], null, null)), (n()(),
            Yr(38, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/tech/circuitrix.jpg"]], null, null, null, null, null)), (n()(),
            Yr(39, 0, null, null, 1, "h3", [["class", "techquest header"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["ANGRYBIRD"])), (n()(),
            Yr(41, 0, null, null, 1, "p", [["align", "justify"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Use your skill and knowledge to create an impressive working project in a given firebird kit (atmega 2560)."])), (n()(),
            Yr(43, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" "])), (n()(),
            Yr(45, 0, null, null, 6, "div", [["class", "bttn"]], null, null, null, null, null)), (n()(),
            Yr(46, 0, null, null, 1, "a", [["class", "left"], ["href", "http://techquest.mzcet.in/register"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Register"])), (n()(),
            Yr(48, 0, null, null, 1, "a", [["class", "left"], ["href", "http://techquest.mzcet.in/admin"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Admin"])), (n()(),
            Yr(50, 0, null, null, 1, "a", [["class", "left"], ["href", "/angrybird.html"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Details"])), (n()(),
            Zr(0, [["template", 2]], null, 0, null, $f)), (n()(),
            Zr(0, [["template1", 2]], null, 0, null, Bf)), (n()(),
            Zr(0, [["template2", 2]], null, 0, null, zf))], null, null)
        }
        function Wf(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 1, "app-techniche", [], null, null, null, qf, Vf)), au(1, 114688, null, 0, Ff, [Rf], null, null)], (function(n, l) {
                n(l, 1, 0)
            }
            ), null)
        }
        var Gf = Ht("app-techniche", Ff, Wf, {}, {}, []);
        class Kf {
            constructor(n) {
                this.modalService = n
            }
            ngOnInit() {}
            openModal(n) {
                this.modalRef = this.modalService.show(n, Object.assign({}, {
                    class: "gray modal-lg"
                }))
            }
        }
        var Qf = lt({
            encapsulation: 0,
            styles: [[""]],
            data: {}
        });
        function Zf(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 46, "div", [["class", "modal-box"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 45, "div", [["class", "modal-body"]], null, null, null, null, null)), (n()(),
            Yr(2, 0, null, null, 2, "div", [["class", "header"]], null, null, null, null, null)), (n()(),
            Yr(3, 0, null, null, 1, "span", [["class", "spikes modal-head "]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" TECHQUEST 2020"])), (n()(),
            Yr(5, 0, null, null, 41, "div", [["class", "content"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 2, "button", [["aria-label", "Close"], ["class", "close pull-right"], ["type", "button"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.modalRef.hide() && t),
                t
            }
            ), null, null)), (n()(),
            Yr(7, 0, null, null, 1, "span", [["aria-hidden", "true"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["\xd7"])), (n()(),
            Yr(9, 0, null, null, 1, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Spikes Buzz"])), (n()(),
            Yr(11, 0, null, null, 35, "tabset", [], [[2, "tab-container", null]], null, null, kp, bp)), au(12, 180224, null, 0, mp, [gp, me, de], null, null), (n()(),
            Yr(13, 0, null, 0, 3, "tab", [["heading", "About"], ["id", "tab1"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(14, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"],
                id: [1, "id"]
            }, null), (n()(),
            Yr(15, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Music is one such language that will reach out to each and everyone. Let\u2019s all celebrate this talent of rhythm in this symposium. Think you got the flair of singing and would like to give wings to your inner Nightingale? Then, here\u2019s a chance to do so on this eve of SPIKES."])), (n()(),
            Yr(17, 0, null, 0, 12, "tab", [["heading", "Instructions"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(18, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(19, 0, null, null, 10, "ol", [], null, null, null, null, null)), (n()(),
            Yr(20, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Choice of music is left to the participants. "])), (n()(),
            Yr(22, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Participants should bring their own musical instruments. "])), (n()(),
            Yr(24, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" A team can have 1 or more than 1 member. "])), (n()(),
            Yr(26, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Performance should be less than 7 minutes. "])), (n()(),
            Yr(28, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Results announced by the judges shall be final."])), (n()(),
            Yr(30, 0, null, 0, 12, "tab", [["heading", "Details/Price"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(31, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(32, 0, null, null, 10, "ol", [], null, null, null, null, null)), (n()(),
            Yr(33, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Team Size : Solo or Group."])), (n()(),
            Yr(35, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Venue : DR.Y.V.S.Murthy Auditorium."])), (n()(),
            Yr(37, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Date : 28th February 2020."])), (n()(),
            Yr(39, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Timinigs : 4:00 pm."])), (n()(),
            Yr(41, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Registration fee : Solo - 100/- & Group - 200/-"])), (n()(),
            Yr(43, 0, null, 0, 3, "tab", [["heading", "Contact Us"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(44, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(45, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["M. REDDY NAICK - 7569817958 "]))], (function(n, l) {
                n(l, 14, 0, "About", "tab1"),
                n(l, 18, 0, "Instructions"),
                n(l, 31, 0, "Details/Price"),
                n(l, 44, 0, "Contact Us")
            }
            ), (function(n, l) {
                n(l, 11, 0, Zt(l, 12).clazz),
                n(l, 13, 0, Zt(l, 14).id, Zt(l, 14).active, Zt(l, 14).addClass),
                n(l, 17, 0, Zt(l, 18).id, Zt(l, 18).active, Zt(l, 18).addClass),
                n(l, 30, 0, Zt(l, 31).id, Zt(l, 31).active, Zt(l, 31).addClass),
                n(l, 43, 0, Zt(l, 44).id, Zt(l, 44).active, Zt(l, 44).addClass)
            }
            ))
        }
        function Yf(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 44, "div", [["class", "modal-box"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 43, "div", [["class", "modal-body"]], null, null, null, null, null)), (n()(),
            Yr(2, 0, null, null, 2, "div", [["class", "header"]], null, null, null, null, null)), (n()(),
            Yr(3, 0, null, null, 1, "span", [["class", "spikes modal-head "]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" TECHQUEST 2020"])), (n()(),
            Yr(5, 0, null, null, 39, "div", [["class", "content"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 2, "button", [["aria-label", "Close"], ["class", "close pull-right"], ["type", "button"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.modalRef.hide() && t),
                t
            }
            ), null, null)), (n()(),
            Yr(7, 0, null, null, 1, "span", [["aria-hidden", "true"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["\xd7"])), (n()(),
            Yr(9, 0, null, null, 1, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Damsha"])), (n()(),
            Yr(11, 0, null, null, 33, "tabset", [], [[2, "tab-container", null]], null, null, kp, bp)), au(12, 180224, null, 0, mp, [gp, me, de], null, null), (n()(),
            Yr(13, 0, null, 0, 3, "tab", [["heading", "About"], ["id", "tab1"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(14, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"],
                id: [1, "id"]
            }, null), (n()(),
            Yr(15, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Dance is a art of performing to a musical rhythm.Come to this ebullient zone and feast your eyes on the most alluring competition of this fiesta. Showcase your best giving sizzling dance performances and rock the stage. Compose your moves in all dance forms."])), (n()(),
            Yr(17, 0, null, 0, 10, "tab", [["heading", "Instructions"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(18, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(19, 0, null, null, 8, "ol", [], null, null, null, null, null)), (n()(),
            Yr(20, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Dance forms are chosen by the participants themselves"])), (n()(),
            Yr(22, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Performance should be less than 7 minutes. "])), (n()(),
            Yr(24, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Props and costumes brought by the participants are their responsibility. "])), (n()(),
            Yr(26, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Results announced by the judges shall be final. "])), (n()(),
            Yr(28, 0, null, 0, 12, "tab", [["heading", "Details/Price"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(29, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(30, 0, null, null, 10, "ol", [], null, null, null, null, null)), (n()(),
            Yr(31, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Team Size : Solo or Group."])), (n()(),
            Yr(33, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Venue : DR.Y.V.S.Murthy Auditorium."])), (n()(),
            Yr(35, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Date : 28th February 2020."])), (n()(),
            Yr(37, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Timinigs : 4:00 pm."])), (n()(),
            Yr(39, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Registration fee : Solo - 100/- & Group - 200/- "])), (n()(),
            Yr(41, 0, null, 0, 3, "tab", [["heading", "Contact Us"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(42, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(43, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" M. REDDY NAICK - 7569817958 "]))], (function(n, l) {
                n(l, 14, 0, "About", "tab1"),
                n(l, 18, 0, "Instructions"),
                n(l, 29, 0, "Details/Price"),
                n(l, 42, 0, "Contact Us")
            }
            ), (function(n, l) {
                n(l, 11, 0, Zt(l, 12).clazz),
                n(l, 13, 0, Zt(l, 14).id, Zt(l, 14).active, Zt(l, 14).addClass),
                n(l, 17, 0, Zt(l, 18).id, Zt(l, 18).active, Zt(l, 18).addClass),
                n(l, 28, 0, Zt(l, 29).id, Zt(l, 29).active, Zt(l, 29).addClass),
                n(l, 41, 0, Zt(l, 42).id, Zt(l, 42).active, Zt(l, 42).addClass)
            }
            ))
        }
        function Jf(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 51, "div", [["class", "modal-box"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 50, "div", [["class", "modal-body"]], null, null, null, null, null)), (n()(),
            Yr(2, 0, null, null, 2, "div", [["class", "header"]], null, null, null, null, null)), (n()(),
            Yr(3, 0, null, null, 1, "span", [["class", "techquest modal-head "]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" TECHQUEST 2020"])), (n()(),
            Yr(5, 0, null, null, 46, "div", [["class", "content"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 2, "button", [["aria-label", "Close"], ["class", "close pull-right"], ["type", "button"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.modalRef.hide() && t),
                t
            }
            ), null, null)), (n()(),
            Yr(7, 0, null, null, 1, "span", [["aria-hidden", "true"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["\xd7"])), (n()(),
            Yr(9, 0, null, null, 1, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Script MIME"])), (n()(),
            Yr(11, 0, null, null, 40, "div", [], null, null, null, null, null)), (n()(),
            Yr(12, 0, null, null, 39, "tabset", [], [[2, "tab-container", null]], null, null, kp, bp)), au(13, 180224, null, 0, mp, [gp, me, de], null, null), (n()(),
            Yr(14, 0, null, 0, 9, "tab", [["heading", "About"], ["id", "tab1"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(15, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"],
                id: [1, "id"]
            }, null), (n()(),
            Yr(16, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["The art of mime and dance, encompasses all the feeling of the soul, and a desire to follow the rhythm of the music. Here is a stage for all the Bonafede actors to grab the opportunity to articulate thoughtfully."])), (n()(),
            Yr(18, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["You can perform as: "])), (n()(),
            Yr(20, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["*MIME- Involves music and sounds without speech through body emotions. "])), (n()(),
            Yr(22, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" *SCRIPT- Through dialogues and speech."])), (n()(),
            Yr(24, 0, null, 0, 10, "tab", [["heading", "Instructions"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(25, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(26, 0, null, null, 8, "ol", [], null, null, null, null, null)), (n()(),
            Yr(27, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Participants should bring their own costumes and makeup products. "])), (n()(),
            Yr(29, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" A team can have more than 1 member. "])), (n()(),
            Yr(31, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Performance should be less than 10 minutes. "])), (n()(),
            Yr(33, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Results announced by the judges shall be final. "])), (n()(),
            Yr(35, 0, null, 0, 12, "tab", [["heading", "Details/Price"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(36, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(37, 0, null, null, 10, "ol", [], null, null, null, null, null)), (n()(),
            Yr(38, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Team Size : Group."])), (n()(),
            Yr(40, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Venue : DR.Y.V.S.Murthy Auditorium."])), (n()(),
            Yr(42, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Date : 28th February 2020."])), (n()(),
            Yr(44, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Timinigs : 4:00 pm."])), (n()(),
            Yr(46, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Registration fee : Group - 200/-"])), (n()(),
            Yr(48, 0, null, 0, 3, "tab", [["heading", "Contact Us"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(49, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(50, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" M. REDDY NAICK - 7569817958 "]))], (function(n, l) {
                n(l, 15, 0, "About", "tab1"),
                n(l, 25, 0, "Instructions"),
                n(l, 36, 0, "Details/Price"),
                n(l, 49, 0, "Contact Us")
            }
            ), (function(n, l) {
                n(l, 12, 0, Zt(l, 13).clazz),
                n(l, 14, 0, Zt(l, 15).id, Zt(l, 15).active, Zt(l, 15).addClass),
                n(l, 24, 0, Zt(l, 25).id, Zt(l, 25).active, Zt(l, 25).addClass),
                n(l, 35, 0, Zt(l, 36).id, Zt(l, 36).active, Zt(l, 36).addClass),
                n(l, 48, 0, Zt(l, 49).id, Zt(l, 49).active, Zt(l, 49).addClass)
            }
            ))
        }
        function Xf(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 40, "div", [["class", "modal-box"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 39, "div", [["class", "modal-body"]], null, null, null, null, null)), (n()(),
            Yr(2, 0, null, null, 2, "div", [["class", "header"]], null, null, null, null, null)), (n()(),
            Yr(3, 0, null, null, 1, "span", [["class", "spikes modal-head "]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" TECHQUEST 2020"])), (n()(),
            Yr(5, 0, null, null, 35, "div", [["class", "content"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 2, "button", [["aria-label", "Close"], ["class", "close pull-right"], ["type", "button"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.modalRef.hide() && t),
                t
            }
            ), null, null)), (n()(),
            Yr(7, 0, null, null, 1, "span", [["aria-hidden", "true"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["\xd7"])), (n()(),
            Yr(9, 0, null, null, 1, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["DJ Night"])), (n()(),
            Yr(11, 0, null, null, 29, "div", [], null, null, null, null, null)), (n()(),
            Yr(12, 0, null, null, 28, "tabset", [], [[2, "tab-container", null]], null, null, kp, bp)), au(13, 180224, null, 0, mp, [gp, me, de], null, null), (n()(),
            Yr(14, 0, null, 0, 3, "tab", [["heading", "About"], ["id", "tab1"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(15, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"],
                id: [1, "id"]
            }, null), (n()(),
            Yr(16, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Left leg aage right leg Piche! Who cares? Feel cozy. It is not a prize fight. No terms and conditions. Tap your feet and enjoy in the way you can."])), (n()(),
            Yr(18, 0, null, 0, 12, "tab", [["heading", "Instructions"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(19, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(20, 0, null, null, 10, "ol", [], null, null, null, null, null)), (n()(),
            Yr(21, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["All the students must register for SPIKES20."])), (n()(),
            Yr(23, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["The students being a part of this must participate in atleast one of the events."])), (n()(),
            Yr(25, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Passes will not be provided to the students who have not taken part in atleast one event."])), (n()(),
            Yr(27, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["All the students must follow the dress code"])), (n()(),
            Yr(29, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Any kind of mischievous act is not entertained."])), (n()(),
            Yr(31, 0, null, 0, 5, "tab", [["heading", "Dress Code/Price"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(32, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(33, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Dress code: Jeans, Shoes are mandatory."])), (n()(),
            Yr(35, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Price: 250/-"])), (n()(),
            Yr(37, 0, null, 0, 3, "tab", [["heading", "Contact Us"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(38, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(39, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["M. REDDY NAICK - 7569817958 "]))], (function(n, l) {
                n(l, 15, 0, "About", "tab1"),
                n(l, 19, 0, "Instructions"),
                n(l, 32, 0, "Dress Code/Price"),
                n(l, 38, 0, "Contact Us")
            }
            ), (function(n, l) {
                n(l, 12, 0, Zt(l, 13).clazz),
                n(l, 14, 0, Zt(l, 15).id, Zt(l, 15).active, Zt(l, 15).addClass),
                n(l, 18, 0, Zt(l, 19).id, Zt(l, 19).active, Zt(l, 19).addClass),
                n(l, 31, 0, Zt(l, 32).id, Zt(l, 32).active, Zt(l, 32).addClass),
                n(l, 37, 0, Zt(l, 38).id, Zt(l, 38).active, Zt(l, 38).addClass)
            }
            ))
        }
        function ng(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 64, "div", [["class", "app"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 2, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["TARANG "])), (n()(),
            Yr(3, 0, null, null, 0, "span", [["class", "border"]], null, null, null, null, null)), (n()(),
            Yr(4, 0, null, null, 60, "div", [["class", "section"]], null, null, null, null, null)), (n()(),
            Yr(5, 0, null, null, 14, "div", [["class", "block"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 13, "div", [["class", "blk"]], null, null, null, null, null)), (n()(),
            Yr(7, 0, null, null, 5, "div", [["class", "text"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.openModal(Zt(n, 65)) && t),
                t
            }
            ), null, null)), (n()(),
            Yr(8, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/tarang/buzz.jpg"]], null, null, null, null, null)), (n()(),
            Yr(9, 0, null, null, 1, "h3", [["class", "spikes header"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Spikes Buzz"])), (n()(),
            Yr(11, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Music is one such language that will reach out to each and everyone. Let\u2019s all celebrate this talent of rhythm in this symposium. Think you got the flair of singing and would like to give wings to your inner Nightingale? Then, here\u2019s a chance to do so on this eve of SPIKES."])), (n()(),
            Yr(13, 0, null, null, 6, "div", [["class", "bttn"]], null, null, null, null, null)), (n()(),
            Yr(14, 0, null, null, 1, "a", [["class", "left"], ["href", "http://api.auspikes.in"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Register"])), (n()(),
            Yr(16, 0, null, null, 1, "a", [["class", "left"], ["href", "http://api.auspikes.in/welcome/login"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Login"])), (n()(),
            Yr(18, 0, null, null, 1, "a", [["class", "right"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.openModal(Zt(n, 65)) && t),
                t
            }
            ), null, null)), (n()(),
            ci(-1, null, ["Details"])), (n()(),
            Yr(20, 0, null, null, 14, "div", [["class", "block"]], null, null, null, null, null)), (n()(),
            Yr(21, 0, null, null, 13, "div", [["class", "blk"]], null, null, null, null, null)), (n()(),
            Yr(22, 0, null, null, 5, "div", [["class", "text"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.openModal(Zt(n, 66)) && t),
                t
            }
            ), null, null)), (n()(),
            Yr(23, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/tarang/damsha.jpg"]], null, null, null, null, null)), (n()(),
            Yr(24, 0, null, null, 1, "h3", [["class", "spikes header"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Damsha"])), (n()(),
            Yr(26, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Dance is a art of performing to a musical rhythm.Come to this ebullient zone and feast your eyes on the most alluring competition of this fiesta. Showcase your best giving sizzling dance performances and rock the stage. Compose your moves in all dance forms."])), (n()(),
            Yr(28, 0, null, null, 6, "div", [["class", "bttn"]], null, null, null, null, null)), (n()(),
            Yr(29, 0, null, null, 1, "a", [["class", "left"], ["href", "http://api.auspikes.in"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Register"])), (n()(),
            Yr(31, 0, null, null, 1, "a", [["class", "left"], ["href", "http://api.auspikes.in/welcome/login"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Login"])), (n()(),
            Yr(33, 0, null, null, 1, "a", [["class", "right"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.openModal(Zt(n, 66)) && t),
                t
            }
            ), null, null)), (n()(),
            ci(-1, null, ["Details"])), (n()(),
            Yr(35, 0, null, null, 14, "div", [["class", "block"]], null, null, null, null, null)), (n()(),
            Yr(36, 0, null, null, 13, "div", [["class", "blk"]], null, null, null, null, null)), (n()(),
            Yr(37, 0, null, null, 5, "div", [["class", "text"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.openModal(Zt(n, 67)) && t),
                t
            }
            ), null, null)), (n()(),
            Yr(38, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/tarang/mime.jpg"]], null, null, null, null, null)), (n()(),
            Yr(39, 0, null, null, 1, "h3", [["class", "spikes header"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Script MIME"])), (n()(),
            Yr(41, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["The art of mime and dance, encompasses all the feeling of the soul, and a desire to follow the rhythm of the music. Here is a stage for all the Bonafede actors to grab the opportunity to articulate thoughtfully."])), (n()(),
            Yr(43, 0, null, null, 6, "div", [["class", "bttn"]], null, null, null, null, null)), (n()(),
            Yr(44, 0, null, null, 1, "a", [["class", "left"], ["href", "http://api.auspikes.in"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Register"])), (n()(),
            Yr(46, 0, null, null, 1, "a", [["class", "left"], ["href", "http://api.auspikes.in/welcome/login"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Login"])), (n()(),
            Yr(48, 0, null, null, 1, "a", [["class", "right"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.openModal(Zt(n, 67)) && t),
                t
            }
            ), null, null)), (n()(),
            ci(-1, null, ["Details"])), (n()(),
            Yr(50, 0, null, null, 14, "div", [["class", "block"]], null, null, null, null, null)), (n()(),
            Yr(51, 0, null, null, 13, "div", [["class", "blk"]], null, null, null, null, null)), (n()(),
            Yr(52, 0, null, null, 5, "div", [["class", "text"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.openModal(Zt(n, 68)) && t),
                t
            }
            ), null, null)), (n()(),
            Yr(53, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/tarang/dj.jpg"]], null, null, null, null, null)), (n()(),
            Yr(54, 0, null, null, 1, "h3", [["class", "spikes header"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["DJ Night"])), (n()(),
            Yr(56, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Left leg aage right leg Piche! Who cares? Feel cozy. It is not a prize fight. No terms and conditions. Tap your feet and enjoy in the way you can. "])), (n()(),
            Yr(58, 0, null, null, 6, "div", [["class", "bttn"]], null, null, null, null, null)), (n()(),
            Yr(59, 0, null, null, 1, "a", [["class", "left"], ["href", "http://api.auspikes.in"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Register"])), (n()(),
            Yr(61, 0, null, null, 1, "a", [["class", "left"], ["href", "http://api.auspikes.in/welcome/login"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Login"])), (n()(),
            Yr(63, 0, null, null, 1, "a", [["class", "right"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.openModal(Zt(n, 68)) && t),
                t
            }
            ), null, null)), (n()(),
            ci(-1, null, ["Details"])), (n()(),
            Zr(0, [["template", 2]], null, 0, null, Zf)), (n()(),
            Zr(0, [["template1", 2]], null, 0, null, Yf)), (n()(),
            Zr(0, [["template2", 2]], null, 0, null, Jf)), (n()(),
            Zr(0, [["template3", 2]], null, 0, null, Xf))], null, null)
        }
        function lg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 1, "app-tarang", [], null, null, null, ng, Qf)), au(1, 114688, null, 0, Kf, [Rf], null, null)], (function(n, l) {
                n(l, 1, 0)
            }
            ), null)
        }
        var eg = Ht("app-tarang", Kf, lg, {}, {}, []);
        class tg {
            constructor(n) {
                this.modalService = n
            }
            ngOnInit() {}
            openModal(n) {
                this.modalRef = this.modalService.show(n, Object.assign({}, {
                    class: "gray modal-lg"
                }))
            }
        }
        var ug = lt({
            encapsulation: 0,
            styles: [["@media only screen and (min-width:1200px){.section[_ngcontent-%COMP%]   .block[_ngcontent-%COMP%]{-webkit-box-flex:0;flex:0 0 33%}}"]],
            data: {}
        });
        function rg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 60, "div", [["class", "modal-box"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 59, "div", [["class", "modal-body"]], null, null, null, null, null)), (n()(),
            Yr(2, 0, null, null, 2, "div", [["class", "header"]], null, null, null, null, null)), (n()(),
            Yr(3, 0, null, null, 1, "span", [["class", "techquest modal-head "]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" TECHQUEST 2020"])), (n()(),
            Yr(5, 0, null, null, 55, "div", [["class", "content"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 2, "button", [["aria-label", "Close"], ["class", "close pull-right"], ["type", "button"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.modalRef.hide() && t),
                t
            }
            ), null, null)), (n()(),
            Yr(7, 0, null, null, 1, "span", [["aria-hidden", "true"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["\xd7"])), (n()(),
            Yr(9, 0, null, null, 1, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["PUBG"])), (n()(),
            Yr(11, 0, null, null, 49, "tabset", [], [[2, "tab-container", null]], null, null, kp, bp)), au(12, 180224, null, 0, mp, [gp, me, de], null, null), (n()(),
            Yr(13, 0, null, 0, 3, "tab", [["heading", "About"], ["id", "tab1"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(14, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"],
                id: [1, "id"]
            }, null), (n()(),
            Yr(15, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The trending art of virtual war in the form of mobile gaming. Create your squad and show your skills. You can open cases and skin your weapons. Make a huge battleground and survive against enemies. Be a part of this virtual war and get a thrill out of killing enemies and earning."])), (n()(),
            Yr(17, 0, null, 0, 24, "tab", [["heading", "Instructions"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(18, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(19, 0, null, null, 22, "ol", [], null, null, null, null, null)), (n()(),
            Yr(20, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The participant should be 16+ years old."])), (n()(),
            Yr(22, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Any sort of cheating or game plotting among two teams shall not be allowed and players will be disqualified immediately."])), (n()(),
            Yr(24, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" This tournament is only for mobile users. Emulator players are not allowed and will be disqualified immediately"])), (n()(),
            Yr(26, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Once registered you cannot cancel the registration."])), (n()(),
            Yr(28, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" In case you are late, you will be directly disqualified from the event no amount of money will be refunded back. "])), (n()(),
            Yr(30, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Griefing and Teaming is Against the Game Rules. Any Participant found doing so will be disqualified and the prizes will be lost."])), (n()(),
            Yr(32, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" If in case you fail to join the room by the match start time then we are not responsible for it. So, make sure to join on time."])), (n()(),
            Yr(34, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Do not share Room ID & Password with anyone who has not joined the match. If found doing so, your account may get terminated."])), (n()(),
            Yr(36, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Room ID & Password will be shared at the defined tournament time."])), (n()(),
            Yr(38, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Match will start after 6-10 minutes of sharing room details."])), (n()(),
            Yr(40, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Make sure you join the Match Room ASAP, before the match starts."])), (n()(),
            Yr(42, 0, null, 0, 10, "tab", [["heading", "Details/Price"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(43, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(44, 0, null, null, 8, "ol", [], null, null, null, null, null)), (n()(),
            Yr(45, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" TEAM TYPE: Solo/Group "])), (n()(),
            Yr(47, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" VENUE : Department of Instrument technology"])), (n()(),
            Yr(49, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" DATE :27th and 28th February"])), (n()(),
            Yr(51, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Registration fee: Rs. 40/- per head."])), (n()(),
            Yr(53, 0, null, 0, 7, "tab", [["heading", "Contact Us"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(54, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(55, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Sai Vamsi -9398551008 "])), (n()(),
            Yr(57, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" sravan - 9440291571 "])), (n()(),
            Yr(59, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Sai Kumar - 9502607708"]))], (function(n, l) {
                n(l, 14, 0, "About", "tab1"),
                n(l, 18, 0, "Instructions"),
                n(l, 43, 0, "Details/Price"),
                n(l, 54, 0, "Contact Us")
            }
            ), (function(n, l) {
                n(l, 11, 0, Zt(l, 12).clazz),
                n(l, 13, 0, Zt(l, 14).id, Zt(l, 14).active, Zt(l, 14).addClass),
                n(l, 17, 0, Zt(l, 18).id, Zt(l, 18).active, Zt(l, 18).addClass),
                n(l, 42, 0, Zt(l, 43).id, Zt(l, 43).active, Zt(l, 43).addClass),
                n(l, 53, 0, Zt(l, 54).id, Zt(l, 54).active, Zt(l, 54).addClass)
            }
            ))
        }
        function ig(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 42, "div", [["class", "modal-box"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 41, "div", [["class", "modal-body"]], null, null, null, null, null)), (n()(),
            Yr(2, 0, null, null, 2, "div", [["class", "header"]], null, null, null, null, null)), (n()(),
            Yr(3, 0, null, null, 1, "span", [["class", "techquets modal-head "]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["TECHQUEST 2020"])), (n()(),
            Yr(5, 0, null, null, 37, "div", [["class", "content"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 2, "button", [["aria-label", "Close"], ["class", "close pull-right"], ["type", "button"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.modalRef.hide() && t),
                t
            }
            ), null, null)), (n()(),
            Yr(7, 0, null, null, 1, "span", [["aria-hidden", "true"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["\xd7"])), (n()(),
            Yr(9, 0, null, null, 1, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Master Numero"])), (n()(),
            Yr(11, 0, null, null, 31, "tabset", [], [[2, "tab-container", null]], null, null, kp, bp)), au(12, 180224, null, 0, mp, [gp, me, de], null, null), (n()(),
            Yr(13, 0, null, 0, 3, "tab", [["heading", "About"], ["id", "tab1"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(14, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"],
                id: [1, "id"]
            }, null), (n()(),
            Yr(15, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Add, differentiate integrate! A whale of time for math lovers who get a buzz out of numerics. Witness yourselves with challenging math problems coming your way, by untangling them. Use your witty knowledge and logical thinking skills, and gambol with numbers encircling you."])), (n()(),
            Yr(17, 0, null, 0, 10, "tab", [["heading", "Instructions"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(18, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(19, 0, null, null, 8, "ol", [], null, null, null, null, null)), (n()(),
            Yr(20, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Teams are requested to be 30 minutes prior to the event."])), (n()(),
            Yr(22, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Each team should solve 16 questions in 24 minutes."])), (n()(),
            Yr(24, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Students should get their own stationery."])), (n()(),
            Yr(26, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Team with maximum score will be given exciting prizes"])), (n()(),
            Yr(28, 0, null, 0, 10, "tab", [["heading", "Details/Price"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(29, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(30, 0, null, null, 8, "ol", [], null, null, null, null, null)), (n()(),
            Yr(31, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Team Size : 2"])), (n()(),
            Yr(33, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Venue : Department of instrument technology"])), (n()(),
            Yr(35, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Date : 27th February"])), (n()(),
            Yr(37, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Registration Fee : Free Event"])), (n()(),
            Yr(39, 0, null, 0, 3, "tab", [["heading", "Contact Us"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(40, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(41, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" SHAGUFTA SAMREEN - 8074034995 "]))], (function(n, l) {
                n(l, 14, 0, "About", "tab1"),
                n(l, 18, 0, "Instructions"),
                n(l, 29, 0, "Details/Price"),
                n(l, 40, 0, "Contact Us")
            }
            ), (function(n, l) {
                n(l, 11, 0, Zt(l, 12).clazz),
                n(l, 13, 0, Zt(l, 14).id, Zt(l, 14).active, Zt(l, 14).addClass),
                n(l, 17, 0, Zt(l, 18).id, Zt(l, 18).active, Zt(l, 18).addClass),
                n(l, 28, 0, Zt(l, 29).id, Zt(l, 29).active, Zt(l, 29).addClass),
                n(l, 39, 0, Zt(l, 40).id, Zt(l, 40).active, Zt(l, 40).addClass)
            }
            ))
        }
        function sg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 59, "div", [["class", "modal-box"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 58, "div", [["class", "modal-body"]], null, null, null, null, null)), (n()(),
            Yr(2, 0, null, null, 2, "div", [["class", "header"]], null, null, null, null, null)), (n()(),
            Yr(3, 0, null, null, 1, "span", [["class", "techquest modal-head "]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" TECHQUEST 2020"])), (n()(),
            Yr(5, 0, null, null, 54, "div", [["class", "content"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 2, "button", [["aria-label", "Close"], ["class", "close pull-right"], ["type", "button"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.modalRef.hide() && t),
                t
            }
            ), null, null)), (n()(),
            Yr(7, 0, null, null, 1, "span", [["aria-hidden", "true"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["\xd7"])), (n()(),
            Yr(9, 0, null, null, 1, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Survivor Brain"])), (n()(),
            Yr(11, 0, null, null, 48, "tabset", [], [[2, "tab-container", null]], null, null, kp, bp)), au(12, 180224, null, 0, mp, [gp, me, de], null, null), (n()(),
            Yr(13, 0, null, 0, 3, "tab", [["heading", "About"], ["id", "tab1"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(14, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"],
                id: [1, "id"]
            }, null), (n()(),
            Yr(15, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" A rostrum of lateral thinking for unravelling the puzzles and articulating one's thought to spawn towards Victory. Be the first to trounce your competitors. Pull up your socks and adapt yoursleves corrobating your IQ skills. "])), (n()(),
            Yr(17, 0, null, 0, 27, "tab", [["heading", "Instructions"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(18, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(19, 0, null, null, 1, "b", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["ROUND 1-SCRIBBLING MINDS"])), (n()(),
            Yr(21, 0, null, null, 8, "ol", [], null, null, null, null, null)), (n()(),
            Yr(22, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Each team should answer 10 questions in 10 minutes."])), (n()(),
            Yr(24, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" This round includes vocab and problem-solving questions."])), (n()(),
            Yr(26, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Students should get their own stationery."])), (n()(),
            Yr(28, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Students with merit score will be qualified to the next round."])), (n()(),
            Yr(30, 0, null, null, 1, "b", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["ROUND- 2 JUST A MINUTE (JAM)"])), (n()(),
            Yr(32, 0, null, null, 12, "ol", [], null, null, null, null, null)), (n()(),
            Yr(33, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" On the spot a topic will be given to contestant."])), (n()(),
            Yr(35, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The contestant has to speak continuously without any pause or repetition of a word for 60 seconds and he cannot repeat the idea more than two times and cannot steal ideas of others."])), (n()(),
            Yr(37, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Speaking continuously for 5 seconds will gain the participants a point. "])), (n()(),
            Yr(39, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" In case of any discrepancy, argument or confusion, the decision of the judges will be considered as final."])), (n()(),
            Yr(41, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The participants who will finish the topic will get one extra point."])), (n()(),
            Yr(43, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The winning team will be given exciting prizes."])), (n()(),
            Yr(45, 0, null, 0, 10, "tab", [["heading", "Details/Price"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(46, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(47, 0, null, null, 8, "ol", [], null, null, null, null, null)), (n()(),
            Yr(48, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Team Size : 2"])), (n()(),
            Yr(50, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Venue : Department of instrument technology"])), (n()(),
            Yr(52, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Date : 28th February"])), (n()(),
            Yr(54, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Registration Fee : Free Event"])), (n()(),
            Yr(56, 0, null, 0, 3, "tab", [["heading", "Contact Us"]], [[1, "id", 0], [2, "active", null], [2, "tab-pane", null]], null, null, null, null)), au(57, 212992, null, 0, vp, [mp, de, me], {
                heading: [0, "heading"]
            }, null), (n()(),
            Yr(58, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" SHAGUFTA SAMREEN - 8074034995 "]))], (function(n, l) {
                n(l, 14, 0, "About", "tab1"),
                n(l, 18, 0, "Instructions"),
                n(l, 46, 0, "Details/Price"),
                n(l, 57, 0, "Contact Us")
            }
            ), (function(n, l) {
                n(l, 11, 0, Zt(l, 12).clazz),
                n(l, 13, 0, Zt(l, 14).id, Zt(l, 14).active, Zt(l, 14).addClass),
                n(l, 17, 0, Zt(l, 18).id, Zt(l, 18).active, Zt(l, 18).addClass),
                n(l, 45, 0, Zt(l, 46).id, Zt(l, 46).active, Zt(l, 46).addClass),
                n(l, 56, 0, Zt(l, 57).id, Zt(l, 57).active, Zt(l, 57).addClass)
            }
            ))
        }
        function og(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 49, "div", [["class", "app"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 2, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["QUESTARIOS "])), (n()(),
            Yr(3, 0, null, null, 0, "span", [["class", "border"]], null, null, null, null, null)), (n()(),
            Yr(4, 0, null, null, 45, "div", [["class", "section"]], null, null, null, null, null)), (n()(),

            Yr(5, 0, null, null, 14, "div", [["class", "block"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 13, "div", [["class", "blk"]], null, null, null, null, null)), (n()(),
            Yr(7, 0, null, null, 5, "div", [["class", "text"]], null, [[null, "click"]], null, null)), (n()(),
            Yr(8, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/fun/pubg.jpg"]], null, null, null, null, null)), (n()(),
            Yr(9, 0, null, null, 1, "h3", [["class", "techquest header"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["PRESENTAZION"])), (n()(),
            Yr(11, 0, null, null, 1, "p", [["align", "justify"]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" It is a platform for students to showcase their innovations in the various fields of technology. "])), (n()(),
            Yr(13, 0, null, null, 6, "div", [["class", "bttn"]], null, null, null, null, null)), (n()(),
            Yr(14, 0, null, null, 1, "a", [["class", "left"], ["href", "http://techquest.mzcet.in/register"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Register"])), (n()(),
            Yr(16, 0, null, null, 1, "a", [["class", "left"], ["href", "http://techquest.mzcet.in/admin"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Admin"])), (n()(),
            Yr(18, 0, null, null, 1, "a", [["class", "left"], ["href", "/ppt.html"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Details"])), (n()(),

            Yr(20, 0, null, null, 14, "div", [["class", "block"]], null, null, null, null, null)), (n()(),
            Yr(21, 0, null, null, 13, "div", [["class", "blk"]], null, null, null, null, null)), (n()(),
            Yr(22, 0, null, null, 5, "div", [["class", "text"]], null, [[null, "click"]], null, null)), (n()(),
            Yr(23, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/fun/master numero.jpg"]], null, null, null, null, null)), (n()(),
            Yr(24, 0, null, null, 1, "h3", [["class", "techquest header"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["PROGETTO"])), (n()(),
            Yr(26, 0, null, null, 1, "p", [["align", "justify"]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Project expo is an event where you can exhibit your project and your engineering skills. "])), (n()(),
            Yr(28, 0, null, null, 6, "div", [["class", "bttn"]], null, null, null, null, null)), (n()(),
            Yr(29, 0, null, null, 1, "a", [["class", "left"], ["href", "http://techquest.mzcet.in/register"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Register"])), (n()(),
            Yr(31, 0, null, null, 1, "a", [["class", "left"], ["href", "http://techquest.mzcet.in/admin"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Admin"])), (n()(),
            Yr(33, 0, null, null, 1, "a", [["class", "left"], ["href", "/project.html"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Details"])), (n()(),

            Yr(35, 0, null, null, 14, "div", [["class", "block"]], null, null, null, null, null)), (n()(),
            Yr(36, 0, null, null, 13, "div", [["class", "blk"]], null, null, null, null, null)), (n()(),
            Yr(37, 0, null, null, 5, "div", [["class", "text"]], null, [[null, "click"]], null, null)), (n()(),
            Yr(38, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/fun/survivor brain.jpg"]], null, null, null, null, null)), (n()(),
            Yr(39, 0, null, null, 1, "h3", [["class", "techquest header"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["QUESTIONARIO"])), (n()(),
            Yr(41, 0, null, null, 1, "p", [["align", "justify"]], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Quiz consists of questions from Groundbreaking science to innovative technologies. "])), (n()(),
            Yr(43, 0, null, null, 6, "div", [["class", "bttn"]], null, null, null, null, null)), (n()(),
            Yr(44, 0, null, null, 1, "a", [["class", "left"], ["href", "http://techquest.mzcet.in/register"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Register"])), (n()(),
            Yr(46, 0, null, null, 1, "a", [["class", "left"], ["href", "http://techquest.mzcet.in/admin"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Admin"])), (n()(),
            Yr(48, 0, null, null, 1, "a", [["class", "left"], ["href", "/quiz.html"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Details"])), (n()(),
            Zr(0, [["template", 2]], null, 0, null, rg)), (n()(),
            Zr(0, [["template1", 2]], null, 0, null, ig)), (n()(),
            Zr(0, [["template2", 2]], null, 0, null, sg))], null, null)
        }
        function ag(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 1, "app-questarios", [], null, null, null, og, ug)), au(1, 114688, null, 0, tg, [Rf], null, null)], (function(n, l) {
                n(l, 1, 0)
            }
            ), null)
        }
        var cg = Ht("app-questarios", tg, ag, {}, {}, []);
        class dg {
            constructor() {}
            ngOnInit() {}
        }
        var hg = lt({
            encapsulation: 0,
            styles: [[""]],
            data: {}
        });
        function pg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 61, "div", [["class", "app"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 2, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["HOSPITALITY "])), (n()(),
            Yr(3, 0, null, null, 0, "span", [["class", "border"]], null, null, null, null, null)), (n()(),
            Yr(4, 0, null, null, 57, "div", [["class", "general-blk"]], null, null, null, null, null)), (n()(),
            Yr(5, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["TARIFF\xa0AND\xa0AMENITIES"])), (n()(),
            Yr(7, 0, null, null, 7, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["*The\xa0participants\xa0who\xa0need\xa0accommodation\xa0are\xa0required\xa0to\xa0pay\xa0an\xa0amount\xa0of\xa0Rs.250\xa0per\xa0day (24\xa0hours). "])), (n()(),
            Yr(9, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" *The\xa0accommodation\xa0payment\xa0should\xa0be\xa0done by cash only."])), (n()(),
            Yr(11, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" *Mattresses and Pillows\xa0will\xa0be\xa0provided\xa0to\xa0the\xa0participants\xa0availing\xa0accommodation\xa0facilities."])), (n()(),
            Yr(13, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" *Food will be provided to the participants taking accommodation."])), (n()(),
            Yr(15, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["CHECK\xa0IN\xa0AND\xa0CHECK\xa0OUT\xa0PROCEDURE"])), (n()(),
            Yr(17, 0, null, null, 7, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["The\xa0check-in\xa0procedure\xa0starts\xa0on\xa026th February,\xa02020\xa0from\xa0time:8:00 A.M onwards."])), (n()(),
            Yr(19, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Participants\xa0are\xa0requested\xa0to\xa0show\xa0a\xa0copy\xa0(hard/soft)\xa0of\xa0the\xa0payment\xa0confirmation\xa0receipt\xa0in\xa0their\xa0hospitality\xa0desk\xa0while\xa0checking\xa0in. "])), (n()(),
            Yr(21, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Every\xa0participant\xa0must\xa0sign\xa0in\xa0the\xa0register\xa0at\xa0the\xa0security\xa0desk\xa0during\xa0check-in\xa0and\xa0check-out\xa0WITHOUT\xa0FAIL. "])), (n()(),
            Yr(23, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Participants need to check out on 29th morning 10:00a.m"])), (n()(),
            Yr(25, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Refund\xa0Policy"])), (n()(),
            Yr(27, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["There\xa0shall\xa0be\xa0no\xa0refund\xa0provided\xa0(except\xa0caution\xa0deposit)\xa0in\xa0the\xa0event\xa0of\xa0cancellation\xa0of\xa0booked\xa0accommodation."])), (n()(),
            Yr(29, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Spot\xa0Registration"])), (n()(),
            Yr(31, 0, null, null, 5, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Spot\xa0Registration\xa0for\xa0Accommodation\xa0would\xa0be\xa0provided\xa0on\xa0the\xa0basis\xa0of\xa0availability\xa0of\xa0rooms."])), (n()(),
            Yr(33, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The\xa0mode\xa0of\xa0payment\xa0for\xa0spot\xa0registration\xa0for\xa0accommodation\xa0is\xa0only\xa0through cash."])), (n()(),
            Yr(35, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" The\xa0Tariff\xa0for\xa0the\xa0spot\xa0registration\xa0for\xa0accommodation\xa0is\xa0same\xa0as\xa0the\xa0tariff\xa0for\xa0regular\xa0registration. "])), (n()(),
            Yr(37, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["General\xa0Instructions"])), (n()(),
            Yr(39, 0, null, null, 14, "ol", [], null, null, null, null, null)), (n()(),
            Yr(40, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["The\xa0rooms\xa0allotted\xa0are\xa0on\xa0sharing\xa0basis.\xa0No\xa0single\xa0rooms\xa0shall\xa0be\xa0provided\xa0to\xa0the\xa0participants."])), (n()(),
            Yr(42, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Identity\xa0proof\xa0(Spikes IDs and adhaar card)\xa0is\xa0to\xa0be\xa0carried\xa0by\xa0the\xa0participants\xa0at\xa0all\xa0times."])), (n()(),
            Yr(44, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Any damage to institution facilities and property provided to the participants would result in serious action and necessary reimbursement charges would have to be dealt by the participants who are found guilty."])), (n()(),
            Yr(46, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Participants are requested to adhere to the check-out time mentioned in the Check-in receipt. Check-out after the time indicated would result in per day charges to be deducted from the caution deposit."])), (n()(),
            Yr(48, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Participants are expected to not create any kind of nuisance which might trouble other participants in the room."])), (n()(),
            Yr(50, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["The college will not be responsible for any damage or loss of property or valuables stored in places of accommodation."])), (n()(),
            Yr(52, 0, null, null, 1, "li", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Smoking, drinking and other drug consumptions are strictly prohibited and necessary action will be taken by the institute if a participant is found to be in possession of these items."])), (n()(),
            Yr(54, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Contact:"])), (n()(),
            Yr(56, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Tejeswar - 9966234239"])), (n()(),
            Yr(58, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Abhishek - 9100221662"])), (n()(),
            Yr(60, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Manisha - 9989936582"]))], null, null)
        }
        function fg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 1, "app-hospitality", [], null, null, null, pg, hg)), au(1, 114688, null, 0, dg, [], null, null)], (function(n, l) {
                n(l, 1, 0)
            }
            ), null)
        }
        var gg = Ht("app-hospitality", dg, fg, {}, {}, []);
        class mg {
            constructor() {}
            ngOnInit() {}
        }
        var vg = lt({
            encapsulation: 0,
            styles: [[".img-group[_ngcontent-%COMP%]{display:-webkit-box;display:flex;flex-wrap:wrap;justify-content:space-around}.img-block[_ngcontent-%COMP%]{text-align:center;margin:20px}.img-block[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{padding:4px;border-radius:50%}.img-block[_ngcontent-%COMP%]   span.img[_ngcontent-%COMP%]{display:block;border-radius:50%}.img-block[_ngcontent-%COMP%]   span.name[_ngcontent-%COMP%]{font-size:1.5em;visibility:hidden;background:-webkit-gradient(linear,left top,right top,from(#ff8901),to(#e52e70));background:linear-gradient(to right,#ff8901 0,#e52e70 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1.5em;font-weight:700}.img-block[_ngcontent-%COMP%]:hover   span.name[_ngcontent-%COMP%]{visibility:visible}h3[_ngcontent-%COMP%]{text-align:center;margin:20px}.img[_ngcontent-%COMP%]{box-sizing:border-box;background-position:0 0,0 100%;background-repeat:no-repeat;background-size:100%;background-image:-webkit-gradient(linear,left top,right top,from(#ff8901),to(#e52e70)),-webkit-gradient(linear,left top,right top,from(#ff8901),to(#e52e70));background-image:linear-gradient(to right,#ff8901 0,#e52e70 100%),linear-gradient(to right,#ff8901 0,#e52e70 100%)}"]],
            data: {}
        });
        function _g(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 267, "div", [["class", "app"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 2, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Team Spikes"])), (n()(),
            Yr(3, 0, null, null, 0, "span", [["class", "border"]], null, null, null, null, null)), (n()(),
            Yr(4, 0, null, null, 263, "div", [["class", "general-blk"]], null, null, null, null, null)), (n()(),
            Yr(5, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Culturals"])), (n()(),
            Yr(7, 0, null, null, 15, "div", [["class", "img-group"]], null, null, null, null, null)), (n()(),
            Yr(8, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(9, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(10, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/swetha.jpeg"]], null, null, null, null, null)), (n()(),
            Yr(11, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Swetha"])), (n()(),
            Yr(13, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(14, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(15, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Jeshtnavi.jpg"]], null, null, null, null, null)), (n()(),
            Yr(16, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Jeshtnavi"])), (n()(),
            Yr(18, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(19, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(20, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Reddy naick.jpg"]], null, null, null, null, null)), (n()(),
            Yr(21, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Reddy Naick"])), (n()(),
            Yr(23, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Sponsorships"])), (n()(),
            Yr(25, 0, null, null, 25, "div", [["class", "img-group"]], null, null, null, null, null)), (n()(),
            Yr(26, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(27, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(28, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Susritha.jpg"]], null, null, null, null, null)), (n()(),
            Yr(29, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Susritha"])), (n()(),
            Yr(31, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(32, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(33, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Mounika.JPG"]], null, null, null, null, null)), (n()(),
            Yr(34, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Mounika"])), (n()(),
            Yr(36, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(37, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(38, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Sreeja.jpg"]], null, null, null, null, null)), (n()(),
            Yr(39, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Sreeja"])), (n()(),
            Yr(41, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(42, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(43, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Ruby.jpg"]], null, null, null, null, null)), (n()(),
            Yr(44, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Ruby"])), (n()(),
            Yr(46, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(47, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(48, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/himaja k.JPG"]], null, null, null, null, null)), (n()(),
            Yr(49, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Himaja k"])), (n()(),
            Yr(51, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Circuitrix"])), (n()(),
            Yr(53, 0, null, null, 15, "div", [["class", "img-group"]], null, null, null, null, null)), (n()(),
            Yr(54, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(55, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(56, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Bharat.jpg"]], null, null, null, null, null)), (n()(),
            Yr(57, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Bharat"])), (n()(),
            Yr(59, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(60, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(61, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Krishna.jpg"]], null, null, null, null, null)), (n()(),
            Yr(62, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Krishna"])), (n()(),
            Yr(64, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(65, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(66, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/sanjana.jpg"]], null, null, null, null, null)), (n()(),
            Yr(67, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Sanjana"])), (n()(),
            Yr(69, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Project Expo"])), (n()(),
            Yr(71, 0, null, null, 15, "div", [["class", "img-group"]], null, null, null, null, null)), (n()(),
            Yr(72, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(73, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(74, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Meghana.jpg"]], null, null, null, null, null)), (n()(),
            Yr(75, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Meghana"])), (n()(),
            Yr(77, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(78, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(79, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Rishitha.jpg"]], null, null, null, null, null)), (n()(),
            Yr(80, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Rishitha"])), (n()(),
            Yr(82, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(83, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(84, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Swamy.jpg"]], null, null, null, null, null)), (n()(),
            Yr(85, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Swamy"])), (n()(),
            Yr(87, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Promotions"])), (n()(),
            Yr(89, 0, null, null, 20, "div", [["class", "img-group"]], null, null, null, null, null)), (n()(),
            Yr(90, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(91, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(92, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Brahmaji.jpg"]], null, null, null, null, null)), (n()(),
            Yr(93, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Brahmaji"])), (n()(),
            Yr(95, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(96, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(97, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Vamsi.jpg"]], null, null, null, null, null)), (n()(),
            Yr(98, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Vamsi"])), (n()(),
            Yr(100, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(101, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(102, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Himaja P.jpg"]], null, null, null, null, null)), (n()(),
            Yr(103, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Himaja P"])), (n()(),
            Yr(105, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(106, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(107, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Bindu.jpg"]], null, null, null, null, null)), (n()(),
            Yr(108, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Bindu"])), (n()(),
            Yr(110, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Workshop"])), (n()(),
            Yr(112, 0, null, null, 25, "div", [["class", "img-group"]], null, null, null, null, null)), (n()(),
            Yr(113, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(114, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(115, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Sanjay.jpg"]], null, null, null, null, null)), (n()(),
            Yr(116, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Sanjay"])), (n()(),
            Yr(118, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(119, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(120, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Rani.jpg"]], null, null, null, null, null)), (n()(),
            Yr(121, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Rani"])), (n()(),
            Yr(123, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(124, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(125, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Manvitha.jpg"]], null, null, null, null, null)), (n()(),
            Yr(126, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Manvitha"])), (n()(),
            Yr(128, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(129, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(130, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Ramya.jpg"]], null, null, null, null, null)), (n()(),
            Yr(131, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Ramya"])), (n()(),
            Yr(133, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(134, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(135, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Sandhya.jpg"]], null, null, null, null, null)), (n()(),
            Yr(136, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Sandhya"])), (n()(),
            Yr(138, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Funcrious"])), (n()(),
            Yr(140, 0, null, null, 30, "div", [["class", "img-group"]], null, null, null, null, null)), (n()(),
            Yr(141, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(142, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(143, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Swathi.jpg"]], null, null, null, null, null)), (n()(),
            Yr(144, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Swathi"])), (n()(),
            Yr(146, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(147, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(148, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Jahnavi.jpg"]], null, null, null, null, null)), (n()(),
            Yr(149, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Jahnavi"])), (n()(),
            Yr(151, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(152, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(153, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Shagufta.jpg"]], null, null, null, null, null)), (n()(),
            Yr(154, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Shagufta"])), (n()(),
            Yr(156, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(157, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(158, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Hruthik.jpg"]], null, null, null, null, null)), (n()(),
            Yr(159, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Hruthik"])), (n()(),
            Yr(161, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(162, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(163, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/dileep.JPG"]], null, null, null, null, null)), (n()(),
            Yr(164, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Dileep"])), (n()(),
            Yr(166, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(167, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(168, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/sravika.JPG"]], null, null, null, null, null)), (n()(),
            Yr(169, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Sravika"])), (n()(),
            Yr(171, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Hospitality"])), (n()(),
            Yr(173, 0, null, null, 35, "div", [["class", "img-group"]], null, null, null, null, null)), (n()(),
            Yr(174, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(175, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(176, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Anwar.jpg"]], null, null, null, null, null)), (n()(),
            Yr(177, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Anwar"])), (n()(),
            Yr(179, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(180, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(181, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/vamsi krishna.jpg"]], null, null, null, null, null)), (n()(),
            Yr(182, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Vamsi Krishna"])), (n()(),
            Yr(184, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(185, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(186, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/abhishek.jpg"]], null, null, null, null, null)), (n()(),
            Yr(187, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Abhishek"])), (n()(),
            Yr(189, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(190, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(191, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Yaswanth.jpg"]], null, null, null, null, null)), (n()(),
            Yr(192, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Yaswanth"])), (n()(),
            Yr(194, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(195, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(196, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Somasekhar.jpg"]], null, null, null, null, null)), (n()(),
            Yr(197, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Somasekhar"])), (n()(),
            Yr(199, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(200, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(201, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Tejeshwar.jpg"]], null, null, null, null, null)), (n()(),
            Yr(202, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Tejeshwar"])), (n()(),
            Yr(204, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(205, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(206, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Maneesha.jpg"]], null, null, null, null, null)), (n()(),
            Yr(207, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Maneesha"])), (n()(),
            Yr(209, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Presentations"])), (n()(),
            Yr(211, 0, null, null, 25, "div", [["class", "img-group"]], null, null, null, null, null)), (n()(),
            Yr(212, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(213, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(214, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Manasa.jpg"]], null, null, null, null, null)), (n()(),
            Yr(215, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Manasa"])), (n()(),
            Yr(217, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(218, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(219, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Srihitha.jpg"]], null, null, null, null, null)), (n()(),
            Yr(220, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Srihitha"])), (n()(),
            Yr(222, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(223, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(224, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Afridi.jpg"]], null, null, null, null, null)), (n()(),
            Yr(225, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Afridi"])), (n()(),
            Yr(227, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(228, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(229, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/Sagar.jpg"]], null, null, null, null, null)), (n()(),
            Yr(230, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Sagar"])), (n()(),
            Yr(232, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(233, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(234, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/uthpreksha.jpg"]], null, null, null, null, null)), (n()(),
            Yr(235, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Uthpreksha"])), (n()(),
            Yr(237, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Press & Media Relations"])), (n()(),
            Yr(239, 0, null, null, 15, "div", [["class", "img-group"]], null, null, null, null, null)), (n()(),
            Yr(240, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(241, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(242, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/prabhu.jpg"]], null, null, null, null, null)), (n()(),
            Yr(243, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Prabhu"])), (n()(),
            Yr(245, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(246, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(247, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/akash.jpg"]], null, null, null, null, null)), (n()(),
            Yr(248, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Akash"])), (n()(),
            Yr(250, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(251, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(252, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/lokesh.JPG"]], null, null, null, null, null)), (n()(),
            Yr(253, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Lokesh"])), (n()(),
            Yr(255, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Procurement"])), (n()(),
            Yr(257, 0, null, null, 10, "div", [["class", "img-group"]], null, null, null, null, null)), (n()(),
            Yr(258, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(259, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(260, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/mohan.jpg"]], null, null, null, null, null)), (n()(),
            Yr(261, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Mohan"])), (n()(),
            Yr(263, 0, null, null, 4, "div", [["class", "img-block"]], null, null, null, null, null)), (n()(),
            Yr(264, 0, null, null, 1, "span", [["class", "img"]], null, null, null, null, null)), (n()(),
            Yr(265, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/team/satya.JPG"]], null, null, null, null, null)), (n()(),
            Yr(266, 0, null, null, 1, "span", [["class", "name"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Satya Tarun"]))], null, null)
        }
        function bg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 1, "app-team", [], null, null, null, _g, vg)), au(1, 114688, null, 0, mg, [], null, null)], (function(n, l) {
                n(l, 1, 0)
            }
            ), null)
        }
        var yg = Ht("app-team", mg, bg, {}, {}, []);
        class wg {
            constructor() {}
            ngOnInit() {}
        }
        var kg = lt({
            encapsulation: 0,
            styles: [[""]],
            data: {}
        });
        function Cg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 90, "div", [["class", "app"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 2, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["FAQ "])), (n()(),
            Yr(3, 0, null, null, 0, "span", [["class", "border"]], null, null, null, null, null)), (n()(),
            Yr(4, 0, null, null, 86, "div", [["class", "general-blk"]], null, null, null, null, null)), (n()(),
            Yr(5, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["How to reach Andhra University?"])), (n()(),
            Yr(7, 0, null, null, 15, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["*From RTC Complex to AU bus stop "])), (n()(),
            Yr(9, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Bus route no-900 "])), (n()(),
            Yr(11, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" *RTC Complex to Maddilapalem "])), (n()(),
            Yr(13, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" City buses and share autos are avaliable frequently"])), (n()(),
            Yr(15, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Auto or Cab charges 60 or 70 Rs. "])), (n()(),
            Yr(17, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" *From Railway Station to Maddilapalem "])), (n()(),
            Yr(19, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" City buses and share autos are avaliable frequently"])), (n()(),
            Yr(21, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Auto or Cab charges 100 to 120 Rs. "])), (n()(),
            Yr(23, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Can we pay the registration fee online?"])), (n()(),
            Yr(25, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["No."])), (n()(),
            Yr(27, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["When are the spot registrations available? "])), (n()(),
            Yr(29, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["from 26th February morning session. "])), (n()(),
            Yr(31, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["What are the accommodation charges? "])), (n()(),
            Yr(33, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["The accommodation charges and other necessary details regarding the payment are available under the tab Accommodation and Hospitality. "])), (n()(),
            Yr(35, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Will all the team members be given accommodation at the same place? "])), (n()(),
            Yr(37, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["We will try but there is no surety for the same. "])), (n()(),
            Yr(39, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" What will be the payment procedure for the accommodation provided by TECHQUEST 202020? "])), (n()(),
            Yr(41, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["The payment procedure is only on spot and other necessary details will be conveyed via mail to the shortlisted candidates. For further details keep visiting the Hospitality page frequently for updates. "])), (n()(),
            Yr(43, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Do we need to pay the accommodation charge for all the team members even if we are getting accommodation for only few members? "])), (n()(),
            Yr(45, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["No, accommodation charges will be applicable to only those team members for whom accommodation has been confirmed."])), (n()(),
            Yr(47, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["One of our team members who had been provided accommodation is unable to come so can we replace him with our other team member?"])), (n()(),
            Yr(49, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Yes, but the person coming should have all the documents that the other member was supposed to have and the person should be of the same team."])), (n()(),
            Yr(51, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["What should I do after coming to the campus?"])), (n()(),
            Yr(53, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Outstation participants who have registered for accommodation are requested to report to the accommodation desk, where the required formalities involving checking of documents, allotment of rooms will be done."])), (n()(),
            Yr(55, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Shall I carry my ID card with me?"])), (n()(),
            Yr(57, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["It is mandatory for all participants to carry college IDs. This is for your own convenience. Moreover you will be asked to produce your college id cards at the time of allotment of rooms."])), (n()(),
            Yr(59, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["What kind of accommodation is provided?"])), (n()(),
            Yr(61, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Accommodation is provided on a sharing basis. We have outside hotel rooms, inside hostel rooms and flats for accommodation. One mattress, and an enough space for keeping luggage, and other essential commodities will be provided. Girls and boys will be accommodated separately."])), (n()(),
            Yr(63, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["What about the hospital facility?"])), (n()(),
            Yr(65, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["There is an institute Hospital located within the campus. In case you fall ill, you are advised to report to us at accommodation desk. We shall make appropriate arrangements for you to be treated at the Institute hospital. We shall also be carrying a first aid kit with us, at the accommodation desk."])), (n()(),
            Yr(67, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["What about the security facilities?"])), (n()(),
            Yr(69, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["ANDHRA UNIVERSITY campus has a vigilant and round-the-clock security service. To ensure the safety of the participants, there will be additional security guards in hostels in order to avoid thefts and other mishaps. Although Spikes team will not take responsibility of any theft or other mishaps. So participants are requested to take care of their luggage and valuable items."])), (n()(),
            Yr(71, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Are there ATMs inside the campus?"])), (n()(),
            Yr(73, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" There are SBI and ANDHRA Bank ATMs inside the campus. There is also an HDFC Bank ATM just outside the campus."])), (n()(),
            Yr(75, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Is there any internal transport keeping in mind the huge area of the campus?"])), (n()(),
            Yr(77, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Internal transport will be available at reasonable rates. Also auto rickshaws are usually available in the campus. Personal vehicles are also allowed in the campus."])), (n()(),
            Yr(79, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Does the accommodation charges include food facilities too?"])), (n()(),
            Yr(81, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Yes, the accommodation charges includes food facilities."])), (n()(),
            Yr(83, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Where will I get my accommodation?"])), (n()(),
            Yr(85, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" You might get accommodation outside as well as inside the campus depending upon availability, however girls with confirmed accommodation will get accommodation inside the ANDHRA UNIVERSITY campus only."])), (n()(),
            Yr(87, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["We are a group of people not participating in any of competitions or workshops and just coming to spikes for enjoyment. Would we be provided accommodation?"])), (n()(),
            Yr(89, 0, null, null, 1, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Accommodation would be confirmed strictly subject to availability of rooms and you can try on the spot registration during the festival."]))], null, null)
        }
        function Sg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 1, "app-faq", [], null, null, null, Cg, kg)), au(1, 114688, null, 0, wg, [], null, null)], (function(n, l) {
                n(l, 1, 0)
            }
            ), null)
        }
        var xg = Ht("app-faq", wg, Sg, {}, {}, []);
        class Ag {
            constructor() {}
            ngOnInit() {}
        }
        var Eg = lt({
            encapsulation: 0,
            styles: [[".general-blk[_ngcontent-%COMP%]{text-align:center}"]],
            data: {}
        });
        function Tg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 26, "div", [["class", "app"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 2, "h1", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Contact Us "])), (n()(),
            Yr(3, 0, null, null, 0, "span", [["class", "border"]], null, null, null, null, null)), (n()(),
            Yr(4, 0, null, null, 22, "div", [["class", "general-blk"]], null, null, null, null, null)), (n()(),
            Yr(5, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Staff Co-Ordinator"])), (n()(),
            Yr(7, 0, null, null, 5, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Ms. Reka "])), (n()(),
            Yr(9, 0, null, null, 0, "", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" "])), (n()(),
            Yr(11, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" techquest@mountzion.ac.in "])), (n()(),
            Yr(13, 0, null, null, 1, "h3", [], null, null, null, null, null)), (n()(),
            ci(-1, null, ["Student Co-Ordinators"])), (n()(),
            Yr(15, 0, null, null, 11, "p", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Amirrtha Kesavan - +91 84890 73527 "])), (n()(),
            Yr(17, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" Veera Prathimanan - +91 63822 99410 "])), (n()(),
            Yr(19, 0, null, null, 0, "br", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" "])), (n()(),
            Yr(21, 0, null, null, 0, "", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" "])), (n()(),
            Yr(23, 0, null, null, 0, "", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" "])), (n()(),
            Yr(25, 0, null, null, 0, "", [], null, null, null, null, null)), (n()(),
            ci(-1, null, [" "]))], null, null)
        }
        function Ig(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 1, "app-contact", [], null, null, null, Tg, Eg)), au(1, 114688, null, 0, Ag, [], null, null)], (function(n, l) {
                n(l, 1, 0)
            }
            ), null)
        }
        var Rg = Ht("app-contact", Ag, Ig, {}, {}, [])
          , Pg = lt({
            encapsulation: 2,
            styles: [],
            data: {}
        });
        function Og(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 2, "div", [["role", "document"]], [[8, "className", 0]], null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 1, "div", [["class", "modal-content"]], null, null, null, null, null)), si(null, 0)], null, (function(n, l) {
                var e = l.component;
                n(l, 0, 0, "modal-dialog" + (e.config.class ? " " + e.config.class : ""))
            }
            ))
        }
        function Mg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 1, "modal-container", [["class", "modal"], ["role", "dialog"], ["tabindex", "-1"]], [[1, "aria-modal", 0]], [[null, "click"], ["window", "keydown.esc"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== Zt(n, 1).onClick(e) && t),
                "window:keydown.esc" === l && (t = !1 !== Zt(n, 1).onEsc(e) && t),
                t
            }
            ), Og, Pg)), au(1, 245760, null, 0, Tf, [Cf, de, me], null, null)], (function(n, l) {
                n(l, 1, 0)
            }
            ), (function(n, l) {
                n(l, 0, 0, !0)
            }
            ))
        }
        var Dg = Ht("modal-container", Tf, Mg, {}, {}, ["*"])
          , Ng = lt({
            encapsulation: 2,
            styles: [],
            data: {}
        });
        function Lg(n) {
            return pi(0, [], null, null)
        }
        function jg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 1, "bs-modal-backdrop", [["class", "modal-backdrop"]], null, null, null, Lg, Ng)), au(1, 114688, null, 0, If, [de, me], null, null)], (function(n, l) {
                n(l, 1, 0)
            }
            ), null)
        }
        var Ug = Ht("bs-modal-backdrop", If, jg, {}, {}, [])
          , Hg = e("HlzF");
        class Fg {
            constructor(n) {
                this.cd = n,
                this.menu = !1,
                this.music = !1,
                this.m_visible = !1,
                this.sound = new Hg.Howl({
                    src: ["assets/bgm.mp3"],
                    loop: !0,
                    autoplay: !0,
                    volume: .5
                })
            }
            ngOnInit() {
                setTimeout(()=>{
                    this.m_visible = !0
                }
                , 3e3)
            }
            mute() {
                this.music = !this.music,
                this.sound.mute(this.music)
            }
            disableMenu() {
                this.menu = !1
            }
            enableMenu() {
                this.menu = !0
            }
        }
        var Vg = lt({
            encapsulation: 0,
            styles: [[".iconsPack[_ngcontent-%COMP%]{position:absolute;top:10px;right:50px;cursor:pointer;color:#fff;z-index:999;margin:10px}.iconsPack[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:42px}.menu[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{font-weight:400}.rt-sp[_ngcontent-%COMP%]{position:absolute;-webkit-transform:rotate(-90deg);transform:rotate(-90deg);top:35%;left:20%;z-index:-1}.music[_ngcontent-%COMP%]{right:100px}.music[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:24px;margin-top:9px}@media only screen and (max-width:600px){.rt-sp[_ngcontent-%COMP%]{top:20%;left:20%}}.social[_ngcontent-%COMP%]{position:absolute}"]],
            data: {}
        });
        function $g(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/icons/music-off.png"]], null, null, null, null, null))], null, null)
        }
        function Bg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/icons/music-on.png"]], null, null, null, null, null))], null, null)
        }
        function zg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 4, "div", [["class", "iconsPack music"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0;
                return "click" === l && (t = !1 !== n.component.mute() && t),
                t
            }
            ), null, null)), (n()(),
            Zr(16777216, null, null, 1, null, $g)), au(2, 16384, null, 0, $s, [je, Ne], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            Zr(16777216, null, null, 1, null, Bg)), au(4, 16384, null, 0, $s, [je, Ne], {
                ngIf: [0, "ngIf"]
            }, null)], (function(n, l) {
                var e = l.component;
                n(l, 2, 0, !e.music),
                n(l, 4, 0, e.music)
            }
            ), null)
        }
        function qg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/icons/menu.png"]], null, null, null, null, null))], null, null)
        }
        function Wg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 0, "img", [["alt", ""], ["src", "assets/icons/close.png"]], null, null, null, null, null))], null, null)
        }
        function Gg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 6, "div", [["class", "social"]], null, null, null, null, null)), (n()(),
            Yr(1, 0, null, null, 1, "a", [["href", "http://www.facebook.com/Techquest-2020-102264794719143"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            Yr(2, 0, null, null, 0, "i", [["class", "fab fa-facebook-square"]], null, null, null, null, null)), (n()(),
            Yr(3, 0, null, null, 1, "a", [["href", "http://www.youtube.com/channel/UCSJ4WxnmRf5uAq7Lh4ThN6Q"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            Yr(4, 0, null, null, 0, "i", [["class", "fab fa-youtube"]], null, null, null, null, null)), (n()(),
            Yr(5, 0, null, null, 1, "a", [["href", "http://www.instagram.com/techquest2020"], ["target", "_blank"]], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 0, "i", [["class", "fab fa-instagram"]], null, null, null, null, null))], null, null)
        }
        function Kg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 85, "div", [["class", "menu"]], null, null, null, null, null)), (n()(),
            Zr(16777216, null, null, 1, null, Gg)), au(2, 16384, null, 0, $s, [je, Ne], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            Yr(3, 0, null, null, 1, "div", [["class", "techquest rt-sp"]], null, null, null, null, null)), (n()(),
            ci(-1, null, ["TECHQUEST 2020"])), (n()(),
            Yr(5, 0, null, null, 80, "ul", [], null, null, null, null, null)), (n()(),
            Yr(6, 0, null, null, 7, "li", [], null, null, null, null, null)), (n()(),
            Yr(7, 0, null, null, 6, "a", [["routerLinkActive", "active"]], [[1, "target", 0], [8, "href", 4]], [[null, "click"]], (function(n, l, e) {
                var t = !0
                  , u = n.component;
                return "click" === l && (t = !1 !== Zt(n, 8).onClick(e.button, e.ctrlKey, e.metaKey, e.shiftKey) && t),
                "click" === l && (t = !1 !== u.disableMenu() && t),
                t
            }
            ), null, null)), au(8, 671744, [[2, 4]], 0, Eh, [xh, fd, Ss], {
                routerLink: [0, "routerLink"]
            }, null), ai(9, 1), au(10, 1720320, null, 2, Ih, [xh, de, me, [2, Ah], [2, Eh]], {
                routerLinkActive: [0, "routerLinkActive"]
            }, null), ei(603979776, 1, {
                links: 1
            }), ei(603979776, 2, {
                linksWithHrefs: 1
            }), (n()(),
            ci(-1, null, ["Home"])), (n()(),
            Yr(14, 0, null, null, 7, "li", [], null, null, null, null, null)), (n()(),
            Yr(15, 0, null, null, 6, "a", [["routerLinkActive", "active"]], [[1, "target", 0], [8, "href", 4]], [[null, "click"]], (function(n, l, e) {
                var t = !0
                  , u = n.component;
                return "click" === l && (t = !1 !== Zt(n, 16).onClick(e.button, e.ctrlKey, e.metaKey, e.shiftKey) && t),
                "click" === l && (t = !1 !== u.disableMenu() && t),
                t
            }
            ), null, null)), au(16, 671744, [[4, 4]], 0, Eh, [xh, fd, Ss], {
                routerLink: [0, "routerLink"]
            }, null), ai(17, 1), au(18, 1720320, null, 2, Ih, [xh, de, me, [2, Ah], [2, Eh]], {
                routerLinkActive: [0, "routerLinkActive"]
            }, null), ei(603979776, 3, {
                links: 1
            }), ei(603979776, 4, {
                linksWithHrefs: 1
            }), (n()(),
            ci(-1, null, ["About"])), (n()(),
            Yr(22, 0, null, null, 7, "li", [], null, null, null, null, null)), (n()(),
            Yr(23, 0, null, null, 6, "a", [["routerLinkActive", "active"]], [[1, "target", 0], [8, "href", 4]], [[null, "click"]], (function(n, l, e) {
                var t = !0
                  , u = n.component;
                return "click" === l && (t = !1 !== Zt(n, 24).onClick(e.button, e.ctrlKey, e.metaKey, e.shiftKey) && t),
                "click" === l && (t = !1 !== u.disableMenu() && t),
                t
            }
            ), null, null)), au(24, 671744, [[6, 4]], 0, Eh, [xh, fd, Ss], {
                routerLink: [0, "routerLink"]
            }, null), ai(25, 1), au(26, 1720320, null, 2, Ih, [xh, de, me, [2, Ah], [2, Eh]], {
                routerLinkActive: [0, "routerLinkActive"]
            }, null), ei(603979776, 5, {
                links: 1
            }), ei(603979776, 6, {
                linksWithHrefs: 1
            }), (n()(),
            ci(-1, null, ["Techniche"])), (n()(),
            Yr(30, 0, null, null, 7, "li", [], null, null, null, null, null)), (n()(),
            Yr(31, 0, null, null, 6, "a", [["routerLinkActive", "active"]], [[1, "target", 0], [8, "href", 4]], [[null, "click"]], (function(n, l, e) {
                var t = !0
                  , u = n.component;
                return "click" === l && (t = !1 !== Zt(n, 32).onClick(e.button, e.ctrlKey, e.metaKey, e.shiftKey) && t),
                "click" === l && (t = !1 !== u.disableMenu() && t),
                t
            }
            ), null, null)), au(32, 671744, [[8, 4]], 0, Eh, [xh, fd, Ss], {
                routerLink: [0, "routerLink"]
            }, null), ai(33, 1), au(34, 1720320, null, 2, Ih, [xh, de, me, [2, Ah], [2, Eh]], {
                routerLinkActive: [0, "routerLinkActive"]
            }, null), ei(603979776, 7, {
                links: 1
            }), ei(603979776, 8, {
                linksWithHrefs: 1
            }), (n()(),
            ci(-1, null, ["Questarios"])), (n()(),
            Yr(38, 0, null, null, 7, "li", [], null, null, null, null, null)), (n()(),
            Yr(39, 0, null, null, 6, "a", [["routerLinkActive", "active"]], [[1, "target", 0], [8, "href", 4]], [[null, "click"]], (function(n, l, e) {
                var t = !0
                  , u = n.component;
                return "click" === l && (t = !1 !== Zt(n, 40).onClick(e.button, e.ctrlKey, e.metaKey, e.shiftKey) && t),
                "click" === l && (t = !1 !== u.disableMenu() && t),
                t
            }
            ), null, null)), au(40, 671744, [[10, 4]], 0, Eh, [xh, fd, Ss], {
                routerLink: [0, "routerLink"]
            }, null), ai(41, 1), au(42, 1720320, null, 2, Ih, [xh, de, me, [2, Ah], [2, Eh]], {
                routerLinkActive: [0, "routerLinkActive"]
            }, null), ei(603979776, 9, {
                links: 1
            }), ei(603979776, 10, {
                linksWithHrefs: 1
            }), (n()(),
            ci(-1, null, ["Contact"])), (n()(),
            Yr(46, 0, null, null, 7, "li", [], null, null, null, null, null)), (n()(),
            Yr(47, 0, null, null, 6, "a", [["routerLinkActive", "active"]], [[1, "target", 0], [8, "href", 4]], [[null, "click"]], (function(n, l, e) {
                var t = !0
                  , u = n.component;
                return "click" === l && (t = !1 !== Zt(n, 48).onClick(e.button, e.ctrlKey, e.metaKey, e.shiftKey) && t),
                "click" === l && (t = !1 !== u.disableMenu() && t),
                t
            }
            ), null, null)), au(48, 671744, [[12, 4]], 0, Eh, [xh, fd, Ss], {
                routerLink: [0, "routerLink"]
            }, null), ai(49, 1), au(50, 1720320, null, 2, Ih, [xh, de, me, [2, Ah], [2, Eh]], {
                routerLinkActive: [0, "routerLinkActive"]
            }, null), ei(603979776, 11, {
                links: 1
            }), ei(603979776, 12, {
                linksWithHrefs: 1
            }), (n()(),
            ci(-1, null, [""])), (n()(),
            Yr(54, 0, null, null, 7, "li", [], null, null, null, null, null)), (n()(),
            Yr(55, 0, null, null, 6, "a", [["routerLinkActive", "active"]], [[1, "target", 0], [8, "href", 4]], [[null, "click"]], (function(n, l, e) {
                var t = !0
                  , u = n.component;
                return "click" === l && (t = !1 !== Zt(n, 56).onClick(e.button, e.ctrlKey, e.metaKey, e.shiftKey) && t),
                "click" === l && (t = !1 !== u.disableMenu() && t),
                t
            }
            ), null, null)), au(56, 671744, [[14, 4]], 0, Eh, [xh, fd, Ss], {
                routerLink: [0, "routerLink"]
            }, null), ai(57, 1), au(58, 1720320, null, 2, Ih, [xh, de, me, [2, Ah], [2, Eh]], {
                routerLinkActive: [0, "routerLinkActive"]
            }, null), ei(603979776, 13, {
                links: 1
            }), ei(603979776, 14, {
                linksWithHrefs: 1
            }), (n()(),
            ci(-1, null, [""])), (n()(),
            Yr(62, 0, null, null, 7, "li", [], null, null, null, null, null)), (n()(),
            Yr(63, 0, null, null, 6, "a", [["routerLinkActive", "active"]], [[1, "target", 0], [8, "href", 4]], [[null, "click"]], (function(n, l, e) {
                var t = !0
                  , u = n.component;
                return "click" === l && (t = !1 !== Zt(n, 64).onClick(e.button, e.ctrlKey, e.metaKey, e.shiftKey) && t),
                "click" === l && (t = !1 !== u.disableMenu() && t),
                t
            }
            ), null, null)), au(64, 671744, [[16, 4]], 0, Eh, [xh, fd, Ss], {
                routerLink: [0, "routerLink"]
            }, null), ai(65, 1), au(66, 1720320, null, 2, Ih, [xh, de, me, [2, Ah], [2, Eh]], {
                routerLinkActive: [0, "routerLinkActive"]
            }, null), ei(603979776, 15, {
                links: 1
            }), ei(603979776, 16, {
                linksWithHrefs: 1
            }), (n()(),
            ci(-1, null, [""])), (n()(),
            Yr(70, 0, null, null, 7, "li", [], null, null, null, null, null)), (n()(),
            Yr(71, 0, null, null, 6, "a", [["routerLinkActive", "active"]], [[1, "target", 0], [8, "href", 4]], [[null, "click"]], (function(n, l, e) {
                var t = !0
                  , u = n.component;
                return "click" === l && (t = !1 !== Zt(n, 72).onClick(e.button, e.ctrlKey, e.metaKey, e.shiftKey) && t),
                "click" === l && (t = !1 !== u.disableMenu() && t),
                t
            }
            ), null, null)), au(72, 671744, [[18, 4]], 0, Eh, [xh, fd, Ss], {
                routerLink: [0, "routerLink"]
            }, null), ai(73, 1), au(74, 1720320, null, 2, Ih, [xh, de, me, [2, Ah], [2, Eh]], {
                routerLinkActive: [0, "routerLinkActive"]
            }, null), ei(603979776, 17, {
                links: 1
            }), ei(603979776, 18, {
                linksWithHrefs: 1
            }), (n()(),
            ci(-1, null, [""])), (n()(),
            Yr(78, 0, null, null, 7, "li", [], null, null, null, null, null)), (n()(),
            Yr(79, 0, null, null, 6, "a", [["routerLinkActive", "active"]], [[1, "target", 0], [8, "href", 4]], [[null, "click"]], (function(n, l, e) {
                var t = !0
                  , u = n.component;
                return "click" === l && (t = !1 !== Zt(n, 80).onClick(e.button, e.ctrlKey, e.metaKey, e.shiftKey) && t),
                "click" === l && (t = !1 !== u.disableMenu() && t),
                t
            }
            ), null, null)), au(80, 671744, [[20, 4]], 0, Eh, [xh, fd, Ss], {
                routerLink: [0, "routerLink"]
            }, null), ai(81, 1), au(82, 1720320, null, 2, Ih, [xh, de, me, [2, Ah], [2, Eh]], {
                routerLinkActive: [0, "routerLinkActive"]
            }, null), ei(603979776, 19, {
                links: 1
            }), ei(603979776, 20, {
                linksWithHrefs: 1
            }), (n()(),
            ci(-1, null, [""]))], (function(n, l) {
                n(l, 2, 0, l.component.menu);
                var e = n(l, 9, 0, "/home");
                n(l, 8, 0, e),
                n(l, 10, 0, "active");
                var t = n(l, 17, 0, "/about");
                n(l, 16, 0, t),
                n(l, 18, 0, "active");
                var u = n(l, 25, 0, "/techniche");
                n(l, 24, 0, u),
                n(l, 26, 0, "active");
                var r = n(l, 33, 0, "/questarios");
                n(l, 32, 0, r),
                n(l, 34, 0, "active");
                var i = n(l, 41, 0, "/contact");
                n(l, 40, 0, i),
                n(l, 42, 0, "active");
                var s = n(l, 49, 0, "/workshops");
                n(l, 48, 0, s),
                n(l, 50, 0, "active");
                var o = n(l, 57, 0, "/hospitality");
                n(l, 56, 0, o),
                n(l, 58, 0, "active");
                var a = n(l, 65, 0, "/team");
                n(l, 64, 0, a),
                n(l, 66, 0, "active");
                var c = n(l, 73, 0, "/FAQ");
                n(l, 72, 0, c),
                n(l, 74, 0, "active");
                var d = n(l, 81, 0, "/tarang");
                n(l, 80, 0, d),
                n(l, 82, 0, "active")
            }
            ), (function(n, l) {
                n(l, 7, 0, Zt(l, 8).target, Zt(l, 8).href),
                n(l, 15, 0, Zt(l, 16).target, Zt(l, 16).href),
                n(l, 23, 0, Zt(l, 24).target, Zt(l, 24).href),
                n(l, 31, 0, Zt(l, 32).target, Zt(l, 32).href),
                n(l, 39, 0, Zt(l, 40).target, Zt(l, 40).href),
                n(l, 47, 0, Zt(l, 48).target, Zt(l, 48).href),
                n(l, 55, 0, Zt(l, 56).target, Zt(l, 56).href),
                n(l, 63, 0, Zt(l, 64).target, Zt(l, 64).href),
                n(l, 71, 0, Zt(l, 72).target, Zt(l, 72).href),
                n(l, 79, 0, Zt(l, 80).target, Zt(l, 80).href)
            }
            ))
        }
        function Qg(n) {
            return pi(0, [(n()(),
            Zr(16777216, null, null, 1, null, zg)), au(1, 16384, null, 0, $s, [je, Ne], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            Yr(2, 0, null, null, 4, "div", [["class", "iconsPack"]], null, [[null, "click"]], (function(n, l, e) {
                var t = !0
                  , u = n.component;
                return "click" === l && (t = 0 != (u.menu = !u.menu) && t),
                t
            }
            ), null, null)), (n()(),
            Zr(16777216, null, null, 1, null, qg)), au(4, 16384, null, 0, $s, [je, Ne], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            Zr(16777216, null, null, 1, null, Wg)), au(6, 16384, null, 0, $s, [je, Ne], {
                ngIf: [0, "ngIf"]
            }, null), (n()(),
            Zr(16777216, null, null, 1, null, Kg)), au(8, 16384, null, 0, $s, [je, Ne], {
                ngIf: [0, "ngIf"]
            }, null)], (function(n, l) {
                var e = l.component;
                n(l, 1, 0, e.m_visible),
                n(l, 4, 0, !e.menu),
                n(l, 6, 0, e.menu),
                n(l, 8, 0, e.menu)
            }
            ), null)
        }
        var Zg = lt({
            encapsulation: 0,
            styles: [[""]],
            data: {}
        });
        function Yg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 1, "app-menu", [], null, null, null, Qg, Vg)), au(1, 114688, null, 0, Fg, [Ol], null, null), (n()(),
            Yr(2, 16777216, null, null, 1, "router-outlet", [], null, null, null, null, null)), au(3, 212992, null, 0, Oh, [Ph, je, se, [8, null], Ol], null, null)], (function(n, l) {
                n(l, 1, 0),
                n(l, 3, 0)
            }
            ), null)
        }
        function Jg(n) {
            return pi(0, [(n()(),
            Yr(0, 0, null, null, 1, "app-root", [], null, null, null, Yg, Zg)), au(1, 114688, null, 0, ws, [], null, null)], (function(n, l) {
                n(l, 1, 0)
            }
            ), null)
        }
        var Xg = Ht("app-root", ws, Jg, {}, {}, []);
        class nm {
        }
        var lm = _s(ys, [ws], (function(n) {
            return function(n) {
                const l = {}
                  , e = [];
                let t = !1;
                for (let u = 0; u < n.length; u++) {
                    const r = n[u];
                    r.token === Dl && !0 === r.value && (t = !0),
                    1073741824 & r.flags && e.push(r.token),
                    r.index = u,
                    l[Je(r.token)] = r
                }
                return {
                    factory: null,
                    providersByKey: l,
                    providers: n,
                    modules: e,
                    isRoot: t
                }
            }([Ot(512, se, oe, [[8, [tp, op, pp, Hf, Gf, eg, cg, gg, yg, xg, Rg, Ug, Dg, Xg]], [3, se], Bn]), Ot(5120, qu, Gr, [[3, qu]]), Ot(4608, Ms, Ds, [qu, [2, Os]]), Ot(5120, xu, Kr, [ar]), Ot(5120, Uu, Hu, []), Ot(5120, Re, qr, []), Ot(5120, Pe, Wr, []), Ot(4608, Qa, Za, [Ws]), Ot(6144, El, null, [Qa]), Ot(4608, $a, za, []), Ot(5120, ca, (function(n, l, e, t, u, r, i, s) {
                return [new Fa(n,l,e), new Ka(t), new qa(u,r,i,s)]
            }
            ), [Ws, ar, $u, Ws, Ws, $a, zu, [2, Ba]]), Ot(4608, da, da, [ca, ar]), Ot(135680, fa, fa, [Ws]), Ot(4608, wa, wa, [da, fa, Uu]), Ot(6144, fe, null, [wa]), Ot(6144, pa, null, [fa]), Ot(4608, mr, mr, [ar]), Ot(5120, fd, Qh, [xh]), Ot(4608, Lh, Lh, []), Ot(6144, Dh, null, [Lh]), Ot(135680, jh, jh, [xh, Pr, Ju, Ll, Dh]), Ot(4608, Nh, Nh, []), Ot(5120, Uh, zh, [xh, Qs, Hh]), Ot(5120, Xh, Jh, [Zh]), Ot(5120, Bu, (function(n) {
                return [n]
            }
            ), [Xh]), Ot(4608, yf, yf, [ar, fe, $u]), Ot(4608, Op, Op, [se, ar, Ll, yf, Ir]), Ot(4608, Rf, Rf, [fe, Op]), Ot(4608, gp, gp, []), Ot(1073742336, qs, qs, []), Ot(1024, ll, uc, []), Ot(1024, Sr, (function() {
                return [$h()]
            }
            ), []), Ot(512, Zh, Zh, [Ll]), Ot(1024, Lu, (function(n, l) {
                return [(e = n,
                sa("probe", aa),
                sa("coreTokens", Object.assign({}, oa, (e || []).reduce((n,l)=>(n[l.name] = l.token,
                n), {}))),
                ()=>aa), Yh(l)];
                var e
            }
            ), [[2, Sr], Zh]), Ot(512, ju, ju, [[2, Lu]]), Ot(131584, Ir, Ir, [ar, zu, Ll, ll, se, ju]), Ot(1073742336, Qr, Qr, [Ir]), Ot(1073742336, rc, rc, [[3, rc]]), Ot(1024, Fh, Wh, [[3, xh]]), Ot(512, Wc, Gc, []), Ot(512, Ph, Ph, []), Ot(256, Hh, {}, []), Ot(1024, Ss, qh, [ks, [2, xs], Hh]), Ot(512, As, As, [Ss, ks]), Ot(512, Ju, Ju, []), Ot(512, Pr, Lr, [Ju, [2, Dr]]), Ot(1024, _h, (function() {
                return [[{
                    path: "",
                    redirectTo: "home",
                    pathMatch: "full"
                }, {
                    path: "home",
                    component: up
                }, {
                    path: "about",
                    component: ap
                }, {
                    path: "techniche",
                    component: Ff
                }, {
                    path: "questarios",
                    component: tg
                }, {
                    path: "contact",
                    component: Ag
                }, {
                    path: "workshops",
                    component: Cp
                }, {
                    path: "hospitality",
                    component:  dg
                }, {
                    path: "team",
                    component: mg
                }, {
                    path: "FAQ",
                    component: wg
                }, {
                    path: "tarang",
                    component: Kf
                }]]
            }
            ), []), Ot(1024, xh, Kh, [Ir, Wc, Ph, As, Ll, Pr, Ju, _h, Hh, [2, yh], [2, mh]]), Ot(1073742336, Bh, Bh, [[2, Fh], [2, xh]]), Ot(1073742336, nm, nm, []), Ot(1073742336, Pf, Pf, []), Ot(1073742336, _p, _p, []), Ot(1073742336, ys, ys, []), Ot(256, Dl, !0, [])])
        }
        ));
        (function() {
            if (tl)
                throw new Error("Cannot enable prod mode after platform setup.");
            el = !1
        }
        )(),
        tc().bootstrapModuleFactory(lm).catch(n=>console.error(n))
    },
    zn8P: function(n, l) {
        function e(n) {
            return Promise.resolve().then((function() {
                var l = new Error("Cannot find module '" + n + "'");
                throw l.code = "MODULE_NOT_FOUND",
                l
            }
            ))
        }
        e.keys = function() {
            return []
        }
        ,
        e.resolve = e,
        n.exports = e,
        e.id = "zn8P"
    }
}, [[0, 0]]]);
