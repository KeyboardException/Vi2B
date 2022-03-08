//? |-----------------------------------------------------------------------------------------------|
//? |  /assets/js/video.js                                                                          |
//? |                                                                                               |
//? |  Copyright (c) 2018-2019 Belikhun. All right reserved                                         |
//? |  Licensed under the MIT License. See LICENSE in the project root for license information.     |
//? |-----------------------------------------------------------------------------------------------|

class VideoJS {
    constructor(element, type = "desktop") {
        if (!element ||typeof element.classList === "undefined")
            throw new Error("videoJS init: contructor input is not an element");

        this.container = element;

        this.ui = makeTree("div", "videoJS", {
            video: { tag: "video", class: "video" },

            wrapper: { tag: "div", class: "wrapper", child: {
                control: { tag: "div", class: "control", child: {
                    underlay: { tag: "div", class: "underlay" },

                    bar: { tag: "div", class: "bar", child: {
                        play: { tag: "icon", class: "play", data: { icon: "play" } },
                        backward: { tag: "icon", class: "backward", data: { icon: "backward" } },
                        forward: { tag: "icon", class: "forward", data: { icon: "forward" } },
                        timecurrent: { tag: "t", class: "timecurrent" },

                        seeker: { tag: "div", class: "seeker", child: {
                            preview: { tag: "div", class: "preview", child: {
                                image: { tag: "div", class: "image" },
                                time: { tag: "t", class: "time" }
                            }},

                            seekbar: { tag: "div", class: "seekbar", child: {
                                buffered: { tag: "div", class: "buffered" },
                                time: { tag: "div", class: "time" },
                                marker: { tag: "div", class: "marker" }
                            }},

                            seek: { tag: "div", class: "seek" }
                        }},

                        timetotal: { tag: "t", class: "timetotal" },
                        settings: { tag: "icon", class: "settings", data: { icon: "gear" } },
                        pip: { tag: "icon", class: "pip", data: { icon: "arrowUpRight" } },
                        mini: { tag: "icon", class: "mini", data: { icon: "square" } },
                        fullscreen: { tag: "icon", class: "fullscreen", data: { icon: "expand" } }
                    }},

                    setting: { tag: "div", class: "setting", child: {
                        volume: { tag: "div", class: ["item", "volume"], child: {
                            input: createSlider({
                                value: 100,
                                min: 0,
                                max: 100,
                                step: 2,
                                color: "blue"
                            }),

                            text: { tag: "t", class: "text" },
                            icon: { tag: "icon" }
                        }},

                        speed: { tag: "div", class: ["item", "speed"], child: {
                            input: createSlider({
                                value: 1,
                                min: 0.5,
                                max: 2,
                                step: 0.1
                            }),

                            text: { tag: "t", class: "text" },
                            icon: { tag: "icon" }
                        }}
                    }}
                }},

                spinner: { tag: "div", class: "spinner" }
            }}
        });

        this.container.parentNode.replaceChild(this.ui, this.container);
        this.ui.setAttribute("tabindex", "0");

        /** @type {HTMLVideoElement} */
        this.video = this.ui.video;
        this.video.preload = "metadata";

        // Variable
        this.__lastMouseOffset = 0;
        this.__lastVolume = 100;
        this.__lastType = "desktop";
        this.__UIHideTimeout = null;

        // Init
        this.changeType(type);
        this.eventInit();
        this.__playerInit(true);
    }

    eventInit() {
        let v = this.video;
        let w = this.ui.wrapper;
        let b = this.ui.wrapper.control.bar;
        let s = this.ui.wrapper.control.setting;

        // Video event
        v.addEventListener("pause", () => {
            b.play.classList.remove("pause");
        });
        
        v.addEventListener("playing", () => {
            b.play.classList.add("pause");
        });

        v.addEventListener("progress", (e) => {
            let bf = e.target.buffered;

            if (bf.length === 0 || e.target.readyState !== 4)
                return;

            let lp = bf.end(bf.length - 1) / e.target.duration;
            b.seeker.seekbar.buffered.style.width = lp * 100 + "%";
        });

        v.addEventListener("timeupdate", e => {
            let t = e.target.currentTime;
            let mt = e.target.duration;
            let tpp = t / mt * 100;
            
            b.timecurrent.innerText = parseTime(t).str;
            b.seeker.seekbar.time.style.width = tpp + "%";
        });

        v.addEventListener("loadeddata", () => this.__playerInit());
        v.addEventListener("loadstart", () => w.dataset.loading = true);
        v.addEventListener("seeking", () => w.dataset.loading = true);
        v.addEventListener("loadeddata", () => w.dataset.loading = false);
        v.addEventListener("loadedmetadata", () => w.dataset.loading = false);
        v.addEventListener("seeked", () => w.dataset.loading = false);
        
        // Button event
        w.control.underlay.addEventListener("click", () => this.toggle());
        b.play.addEventListener("click", () => this.toggle());

        b.fullscreen.addEventListener("click", (e) => this.__toggleFullScreen(e));
        b.backward.addEventListener("click", () => this.seek(-10));
        b.forward.addEventListener("click", () => this.seek(10));

        b.settings.addEventListener("click", (e) => {
            let tg = e.target.classList.contains("active");

            this.__showUI(tg);
            e.target.classList[tg ? "remove" : "add"]("active");
            s.classList[tg ? "remove" : "add"]("show");
        });

        b.mini.addEventListener("click", (e) => {
            let c = this.ui.dataset.type === "mini";
            this.changeType(c ? false : "mini");
            e.target.classList[c ? "remove" : "add"]("enlarge");
        });

        b.pip.addEventListener("click", () => {
            this.video.requestPictureInPicture();
        });

        // Settings
        s.volume.input.onInput((v) => {
            if (v === 0)
                s.volume.icon.dataset.type = "mute";
            else if (v <= 50)
                s.volume.icon.dataset.type = "down";
            else
                s.volume.icon.dataset.type = "up";

            s.volume.text.innerText = v + "%";
            this.video.volume = v / 100;
        });

        s.volume.icon.addEventListener("click", (e) => {
            if (e.target.dataset.type === "off") {
                s.volume.input.setValue(this.__lastVolume);
            } else {
                this.__lastVolume = s.volume.input.input.value;
                s.volume.input.setValue(0);
                e.target.dataset.type = "off";
            }
        });

        s.speed.input.onInput((v) => {
            s.speed.text.innerText = v.toFixed(2) + "x";
            this.video.playbackRate = v;
        });

        s.speed.icon.addEventListener("click", () => {
            s.speed.input.setValue(1);
        });

        // Seekbar event
        b.seeker.seek.addEventListener("mouseenter", () => b.seeker.dataset.seeking = true);
        b.seeker.seek.addEventListener("mouseleave", () => b.seeker.dataset.seeking = false);
        b.seeker.seek.addEventListener("mousemove", (e) => this.__seekHoverHandler(e, false));
        b.seeker.seek.addEventListener("click", (e) => this.__seekClickHandler(e, false));
        b.seeker.seek.addEventListener("touchstart", (e) => this.__seekHoverHandler(e, true));
        b.seeker.seek.addEventListener("touchmove", (e) => this.__seekHoverHandler(e, true));
        b.seeker.seek.addEventListener("touchend", (e) => this.__seekClickHandler(e, true));

        // Other
        w.addEventListener("mousemove", () => this.__showUI());
        w.addEventListener("touchstart", () => this.__showUI(false));
        w.addEventListener("touchend", () => this.__showUI());
        this.ui.addEventListener("keydown", (e) => this.__keyPressHandler(e));

        this.ui.addEventListener("webkitfullscreenchange", () => {
            let isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;

            this.ui.wrapper.control.bar.fullscreen.classList[isFullscreen ? "add" : "remove"]("exit");
            this.ui.classList[isFullscreen ? "add" : "remove"]("fullscreen");
        });
    }

    __playerInit(firstrun = false) {
        let d = this.video.duration;
        let b = this.ui.wrapper.control.bar;
        let s = this.ui.wrapper.control.setting;
        let dp = parseTime(d);

        b.timetotal.innerText = dp.str;
        b.play.classList.remove("pause");
        b.seeker.seekbar.buffered.style.width = "0%";
        b.seeker.seekbar.time.style.width = "0%";
        
        if (firstrun) {
            this.setup({
                src: "",
                autoPlay: false
            });
        }
    }

    __toggleFullScreen() {
        let element = this.ui;
        let isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;

        element.requestFullScreen = element.requestFullScreen
            || element.webkitRequestFullScreen
            || element.mozRequestFullScreen
            || (() => false);
        
        document.cancelFullScreen = document.cancelFullScreen
            || document.webkitCancelFullScreen
            || document.mozCancelFullScreen
            || (() => false);

        isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();
    }

    __seekHoverHandler(e, touch = false) {
        e.stopPropagation();

        let b = this.ui.wrapper.control.bar;
        let w = 0;

        this.__showUI(false);
        if (touch) {
            b.seeker.dataset.seeking = true;
            w = e.touches[0].clientX - e.target.getBoundingClientRect().left;
            this.__lastMouseOffset = w;
        } else
            w = e.offsetX;

        let mw = e.target.offsetWidth;
        let p = w / mw;
        p = (p < 0) ? 0 : (p > 1) ? 1 : p;
        let pp = p * 100;
        let t = this.video.duration * p;
        let tp = parseTime(t);

        b.seeker.preview.style.left = pp + "%";
        b.seeker.seekbar.marker.style.left = pp + "%";
        b.seeker.preview.time.innerText = tp.str;
    }

    __seekClickHandler(e, touch = false) {
        e.stopPropagation();

        let b = this.ui.wrapper.control.bar;
        let w = 0;

        this.__showUI(true);
        if (touch) {
            b.seeker.dataset.seeking = false;
            w = this.__lastMouseOffset;
        } else
            w = e.offsetX;

        let mw = e.target.offsetWidth;
        let p = w / mw;
        p = (p < 0) ? 0 : (p > 1) ? 1 : p;
        let t = (this.video.duration * p) || 0;
        
        this.video.currentTime = t;
        b.seeker.seekbar.time.style.width = p*100 + "%";
    }

    __showUI(autoHide = true, time = 4000) {
        this.ui.wrapper.classList.add("show");
        if (this.__UIHideTimeout)
            clearTimeout(this.__UIHideTimeout);

        if (autoHide)
            this.__UIHideTimeout = setTimeout(e => this.ui.wrapper.classList.remove("show"), time);
    }

    __keyPressHandler(e) {
        if (e.isComposing || e.keyCode === 229)
            return;
        
        e.preventDefault();

        switch (e.keyCode) {
            case 39:
                this.seek(5);
                break;
            case 37:
                this.seek(-5);
                break;
            case 32:
                (!this.video.paused) ? this.pause() : this.play();
                break;
            case 70:
                this.__toggleFullScreen();
                break;
        }
    }

    setup({
        src = null,
        autoPlay = false,
    }) {
        this.video.pause();

        if (src)
            this.video.src = src;
        else
            this.video.removeAttribute("src");

        this.video.load();

        if (autoPlay)
            this.play();
    }

    play() {
        try {
            this.video.play();
        } catch(e) {
            // User havent interacted with the document
            // bla bla...
        }
    }

    pause() {
        this.video.pause();
    }

    toggle() {
        let playing = !this.video.paused;

        if (playing)
            this.pause();
        else
            this.play();
    }

    seek(secs = 0) {
        this.video.currentTime += secs;
    }

    seekTo(secs) {
        this.video.currentTime = secs;
    }

    changeType(type) {
        if (type === false)
            return this.ui.dataset.type = this.__lastType;

        let accept = ["desktop", "mobile", "mini"];

        if (accept.indexOf(type) !== -1) {
            if (this.__lastType !== this.ui.dataset.type)
                this.__lastType = this.ui.dataset.type;
                
            this.ui.dataset.type = type;
        } else
            return false;
    }
}