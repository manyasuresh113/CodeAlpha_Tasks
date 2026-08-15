
/* =========================================================
   EchoBeat ONE-CONTROLLER BUILD
   Playback + UI + Queue + Search + Favorites + LRC
========================================================= */
(() => {
    "use strict";

    const songs = Array.isArray(window.songs) ? window.songs : [];
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    const audio = $("#audioPlayer");
    if (!audio || !songs.length) {
        console.error("EchoBeat: playlist or audio element is missing.");
        return;
    }

    const els = {
        songGrid: $("#songGrid"),
        albumGrid: $("#albumGrid"),
        queueList: $("#queueList"),
        title: $("#songTitle"),
        artist: $("#artistName"),
        album: $("#albumName"),
        genre: $("#genre"),
        year: $("#year"),
        duration: $("#duration"),
        cover: $("#albumCover"),
        miniCover: $("#miniCover"),
        miniTitle: $("#miniTitle"),
        miniArtist: $("#miniArtist"),
        play: $("#playPause"),
        next: $("#next"),
        previous: $("#previous"),
        progress: $("#progress"),
        currentTime: $("#currentTime"),
        totalTime: $("#totalDuration"),
        volume: $("#volume"),
        favorite: $("#favoriteBtn"),
        search: $("#searchInput"),
        results: $("#searchResults"),
        lyrics: $("#lyricsContainer"),
        lyricsToggle: $("#lyricsToggle"),
        download: $("#downloadBtn"),
        backToTop: $("#backToTop"),
        songCount: $("#songCount"),
        favoriteCount: $("#favoriteCount")
    };

    const state = {
        index: Number(localStorage.getItem("echo-song") || 0),
        shuffle: localStorage.getItem("echo-shuffle") === "true",
        repeat: localStorage.getItem("echo-repeat") === "true",
        favorites: JSON.parse(localStorage.getItem("echo-favorites") || "[]"),
        lyrics: [],
        lyricIndex: -1
    };

    if (!Number.isInteger(state.index) || state.index < 0 || state.index >= songs.length) {
        state.index = 0;
    }

    const formatTime = seconds => {
        if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${String(s).padStart(2, "0")}`;
    };

    const artistText = song =>
        song?.artist || (Array.isArray(song?.artists) ? song.artists.join(", ") : "");

    function save() {
        localStorage.setItem("echo-song", String(state.index));
        localStorage.setItem("echo-shuffle", String(state.shuffle));
        localStorage.setItem("echo-repeat", String(state.repeat));
        localStorage.setItem("echo-favorites", JSON.stringify(state.favorites));
        localStorage.setItem("echo-volume", String(audio.volume));
    }

    function setText(el, value) {
        if (el) el.textContent = value ?? "-";
    }

    function setCover(img, src, alt) {
        if (!img) return;
        img.src = src || "";
        img.alt = alt || "";
    }

    function updateToggleButtons() {
        $$("[data-action=\"shuffle\"]").forEach(btn => {
            btn.classList.toggle("active", state.shuffle);
            btn.setAttribute("aria-pressed", String(state.shuffle));
            btn.title = state.shuffle ? "Shuffle On" : "Shuffle Off";
        });
        $$("[data-action=\"repeat\"]").forEach(btn => {
            btn.classList.toggle("active", state.repeat);
            btn.setAttribute("aria-pressed", String(state.repeat));
            btn.title = state.repeat ? "Repeat On" : "Repeat Off";
        });
    }

    function updateFavoriteButton() {
        if (!els.favorite) return;
        const id = songs[state.index]?.id;
        const liked = state.favorites.includes(id);
        els.favorite.classList.toggle("active", liked);
        els.favorite.innerHTML = liked
            ? '<i class="fa-solid fa-heart"></i>'
            : '<i class="fa-regular fa-heart"></i>';
        els.favorite.title = liked ? "Remove from Favorites" : "Add to Favorites";
    }

    function updateLibraryStats() {
        setText(els.songCount, `${songs.length} Songs`);
        setText(els.favoriteCount, `${state.favorites.length} Songs`);
    }

    function renderSongs() {
        if (!els.songGrid) return;
        els.songGrid.innerHTML = songs.map((song, i) => `
            <article class="song-card ${i === state.index ? "active-song" : ""}" data-index="${i}">
                <img src="${song.cover || ""}" alt="${song.title}">
                <div>
                    <h3>${song.title}</h3>
                    <p>${artistText(song)}</p>
                </div>
            </article>
        `).join("");

        $$(".song-card", els.songGrid).forEach(card => {
            card.addEventListener("click", () => loadSong(Number(card.dataset.index), true));
        });
    }

    function renderAlbums() {
        if (!els.albumGrid) return;
        els.albumGrid.innerHTML = songs.map((song, i) => `
            <article class="album-card" data-index="${i}">
                <img src="${song.cover || ""}" alt="${song.title}">
                <h4>${song.title}</h4>
                <span>${song.genre || ""}</span>
            </article>
        `).join("");

        $$(".album-card", els.albumGrid).forEach(card => {
            card.addEventListener("click", () => loadSong(Number(card.dataset.index), true));
        });
    }

    function renderQueue() {
        if (!els.queueList) return;
        els.queueList.innerHTML = songs.map((song, i) => `
            <div class="queue-song ${i === state.index ? "active" : ""}" data-index="${i}">
                <img src="${song.cover || ""}" alt="${song.title}">
                <div>
                    <h4>${song.title}</h4>
                    <span>${artistText(song)}</span>
                </div>
                <p>${i === state.index ? "▶" : ""}</p>
            </div>
        `).join("");

        $$(".queue-song", els.queueList).forEach(item => {
            item.addEventListener("click", () => loadSong(Number(item.dataset.index), true));
        });
    }

    function renderAll() {
        renderSongs();
        renderAlbums();
        renderQueue();
        updateFavoriteButton();
        updateToggleButtons();
        updateLibraryStats();
    }

    function updatePlayer(song) {
        if (!song) return;

        setText(els.title, song.title);
        setText(els.artist, artistText(song));
        setText(els.album, song.album);
        setText(els.genre, song.genre);
        setText(els.year, song.year);
        setText(els.duration, song.duration || "0:00");
        setText(els.miniTitle, song.title);
        setText(els.miniArtist, artistText(song));

        setCover(els.cover, song.cover, `${song.title} cover`);
        setCover(els.miniCover, song.cover, `${song.title} cover`);

        if (els.currentTime) els.currentTime.textContent = "0:00";
        if (els.totalTime) els.totalTime.textContent = song.duration || "0:00";
        if (els.progress) els.progress.value = "0";

        document.title = `${song.title} — EchoBeat`;
    }

    function setVinyl(playing) {
        const vinyl = $(".vinyl-record");
        if (vinyl) vinyl.style.animationPlayState = playing ? "running" : "paused";
    }

    function updatePlayButton() {
        const playing = !audio.paused;

        if (els.play) {
            els.play.innerHTML = playing
                ? '<i class="fa-solid fa-pause"></i>'
                : '<i class="fa-solid fa-play"></i>';
            els.play.title = playing ? "Pause" : "Play";
        }

        const heroPlay = document.getElementById("heroPlay");
        if (heroPlay) {
            heroPlay.innerHTML = playing
                ? '<i class="fa-solid fa-pause"></i><span>Pause</span>'
                : '<i class="fa-solid fa-play"></i><span>Play</span>';
        }

        setVinyl(playing);
    }

    async function loadLyrics(file) {
        state.lyrics = [];
        state.lyricIndex = -1;

        if (!els.lyrics) return;
        if (!file) {
            els.lyrics.innerHTML = '<div class="lyrics-empty"><i class="fa-solid fa-music"></i><h3>No Lyrics Available</h3><p>No LRC file is linked to this song.</p></div>';
            return;
        }

        try {
            let text = window.ECHOBEAT_LRC?.[file];

            if (typeof text !== "string") {
                const response = await fetch(file);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                text = await response.text();
            }

            const regex = /^\[(\d+):(\d+(?:\.\d+)?)\]\s*(.*)$/;
            state.lyrics = text.split(/\r?\n/)
                .map(line => {
                    const match = line.match(regex);
                    if (!match) return null;
                    return {
                        time: Number(match[1]) * 60 + Number(match[2]),
                        text: match[3].trim() || "♪"
                    };
                })
                .filter(Boolean)
                .sort((a, b) => a.time - b.time);

            if (!state.lyrics.length) {
                els.lyrics.innerHTML = '<div class="lyrics-empty"><i class="fa-solid fa-music"></i><h3>No Lyrics Available</h3><p>This LRC file has no timed lines.</p></div>';
                return;
            }

            els.lyrics.innerHTML = state.lyrics.map((line, i) =>
                `<p class="lyric-line" data-index="${i}">${line.text}</p>`
            ).join("");

            $$(".lyric-line", els.lyrics).forEach(line => {
                line.addEventListener("click", () => {
                    const i = Number(line.dataset.index);
                    audio.currentTime = state.lyrics[i].time;
                    syncLyrics(true);
                });
            });
        } catch (error) {
            console.error("EchoBeat lyrics:", error);
            els.lyrics.innerHTML = '<div class="lyrics-empty"><i class="fa-solid fa-triangle-exclamation"></i><h3>Lyrics could not load</h3><p>Check that the LRC file exists in assets/lyrics/.</p></div>';
        }
    }

    function syncLyrics(force = false) {
        if (!state.lyrics.length || !els.lyrics) return;

        let found = -1;
        for (let i = 0; i < state.lyrics.length; i++) {
            if (state.lyrics[i].time <= audio.currentTime) found = i;
            else break;
        }

        if (!force && found === state.lyricIndex) return;
        state.lyricIndex = found;

        const lines = $$(".lyric-line", els.lyrics);
        lines.forEach(line => line.classList.remove("active"));

        if (found >= 0 && lines[found]) {
            lines[found].classList.add("active");
            lines[found].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
    }

    function loadSong(index, autoplay = false) {
        if (!songs[index]) return;

        state.index = index;
        const song = songs[index];

        audio.pause();
        audio.src = song.file;
        audio.currentTime = 0;
        audio.load();

        updatePlayer(song);
        renderAll();
        loadLyrics(song.lyrics);
        save();

        if (autoplay) {
            audio.play().catch(err => console.warn("Playback blocked:", err));
        }
    }

    function playPause() {
        if (audio.paused) {
            audio.play().catch(err => console.warn("Playback blocked:", err));
        } else {
            audio.pause();
        }
    }

    function nextSong() {
        let next;
        if (state.shuffle && songs.length > 1) {
            do {
                next = Math.floor(Math.random() * songs.length);
            } while (next === state.index);
        } else {
            next = (state.index + 1) % songs.length;
        }
        loadSong(next, true);
    }

    function previousSong() {
        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }
        loadSong((state.index - 1 + songs.length) % songs.length, true);
    }

    function showStatus(message) {
        let toast = document.getElementById("echoStatus");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "echoStatus";
            document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(showStatus.timer);
        showStatus.timer = setTimeout(() => toast.classList.remove("show"), 1200);
    }

    function toggleShuffle() {
        state.shuffle = !state.shuffle;
        updateToggleButtons();
        save();
        showStatus(state.shuffle ? "Shuffle ON" : "Shuffle OFF");
    }

    function toggleRepeat() {
        state.repeat = !state.repeat;
        updateToggleButtons();
        save();
        showStatus(state.repeat ? "Repeat ON" : "Repeat OFF");
    }

    function toggleFavorite() {
        const id = songs[state.index].id;
        const pos = state.favorites.indexOf(id);

        if (pos >= 0) state.favorites.splice(pos, 1);
        else state.favorites.push(id);

        updateFavoriteButton();
        updateLibraryStats();
        save();
    }

    function searchSongs(value) {
        const query = value.trim().toLowerCase();
        if (!els.results) return;

        if (!query) {
            els.results.innerHTML = "";
            els.results.style.display = "none";
            return;
        }

        const matches = songs.filter(song =>
            `${song.title} ${artistText(song)} ${song.album} ${song.genre}`
                .toLowerCase()
                .includes(query)
        );

        els.results.innerHTML = matches.length
            ? matches.map(song => {
                const index = songs.indexOf(song);
                return `
                    <div class="search-item" data-index="${index}">
                        <img src="${song.cover || ""}" alt="">
                        <div><strong>${song.title}</strong><span>${artistText(song)}</span></div>
                    </div>
                `;
            }).join("")
            : '<div class="search-item"><div><strong>No results</strong><span>Try another search.</span></div></div>';

        els.results.style.display = "block";

        $$(".search-item[data-index]", els.results).forEach(item => {
            item.addEventListener("click", () => {
                loadSong(Number(item.dataset.index), true);
                els.results.style.display = "none";
                if (els.search) els.search.value = "";
            });
        });
    }

    function downloadSong() {
        const song = songs[state.index];
        const link = document.createElement("a");
        link.href = song.file;
        link.download = `${song.title}.mp3`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    function setupEvents() {
        els.play?.addEventListener("click", playPause);
        document.getElementById("heroPlay")?.addEventListener("click", playPause);
        els.next?.addEventListener("click", nextSong);
        els.previous?.addEventListener("click", previousSong);
        els.favorite?.addEventListener("click", toggleFavorite);
        els.download?.addEventListener("click", downloadSong);

        document.addEventListener("click", e => {
            const control = e.target.closest("[data-action]");
            if (!control) return;

            if (control.dataset.action === "shuffle") toggleShuffle();
            if (control.dataset.action === "repeat") toggleRepeat();
        });

        els.progress?.addEventListener("input", e => {
            if (Number.isFinite(audio.duration) && audio.duration > 0) {
                audio.currentTime = (Number(e.target.value) / 100) * audio.duration;
            }
        });

        els.volume?.addEventListener("input", e => {
            audio.volume = Number(e.target.value) / 100;
            save();
        });

        els.search?.addEventListener("input", e => searchSongs(e.target.value));

        document.addEventListener("click", e => {
            if (els.results && !e.target.closest(".search-box")) {
                els.results.style.display = "none";
            }
        });

        audio.addEventListener("loadedmetadata", () => {
            setText(els.totalTime, formatTime(audio.duration));
            setText(els.duration, formatTime(audio.duration));
        });

        audio.addEventListener("timeupdate", () => {
            if (Number.isFinite(audio.duration) && audio.duration > 0 && els.progress) {
                els.progress.value = String((audio.currentTime / audio.duration) * 100);
            }
            setText(els.currentTime, formatTime(audio.currentTime));
            syncLyrics();
        });

        audio.addEventListener("play", updatePlayButton);
        audio.addEventListener("pause", updatePlayButton);

        audio.addEventListener("ended", () => {
            if (state.repeat) {
                audio.currentTime = 0;
                audio.play().catch(() => {});
            } else {
                nextSong();
            }
        });

        els.lyricsToggle?.addEventListener("click", () => {
            const collapsed = els.lyrics?.classList.toggle("collapsed");
            if (els.lyricsToggle) {
                els.lyricsToggle.innerHTML = collapsed
                    ? '<i class="fa-solid fa-chevron-down"></i>'
                    : '<i class="fa-solid fa-chevron-up"></i>';
            }
        });

        $$(".player-extra button").forEach(button => {
            if (button.title === "Lyrics") {
                button.addEventListener("click", () => {
                    document.querySelector(".lyrics-section")?.scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                });
            }
        });

        window.addEventListener("scroll", () => {
            if (els.backToTop) {
                els.backToTop.classList.toggle("show", window.scrollY > 500);
            }
        }, { passive: true });

        els.backToTop?.addEventListener("click", () =>
            window.scrollTo({ top: 0, behavior: "smooth" })
        );

        document.addEventListener("keydown", e => {
            if (e.target.matches("input, textarea")) return;
            if (e.code === "Space") { e.preventDefault(); playPause(); }
            if (e.code === "ArrowRight") nextSong();
            if (e.code === "ArrowLeft") previousSong();
        });

        document.querySelectorAll(".sidebar nav li").forEach(item => {
            item.addEventListener("click", () => {
                document.querySelectorAll(".sidebar nav li").forEach(x => x.classList.remove("active"));
                item.classList.add("active");

                if (item.querySelector("span")?.textContent === "Liked Songs") {
                    const liked = songs.filter(song => state.favorites.includes(song.id));
                    if (els.songGrid) {
                        els.songGrid.innerHTML = liked.length
                            ? liked.map(song => {
                                const i = songs.indexOf(song);
                                return `<article class="song-card" data-index="${i}">
                                    <img src="${song.cover || ""}" alt="${song.title}">
                                    <div><h3>${song.title}</h3><p>${artistText(song)}</p></div>
                                </article>`;
                            }).join("")
                            : '<div class="lyrics-empty"><h3>No Favorite Songs Yet</h3><p>Tap the heart on a song to add it.</p></div>';
                        $$(".song-card[data-index]", els.songGrid).forEach(card =>
                            card.addEventListener("click", () => loadSong(Number(card.dataset.index), true))
                        );
                    }
                } else {
                    renderSongs();
                }
            });
        });
    }

    function init() {
        const savedVolume = Number(localStorage.getItem("echo-volume"));
        audio.volume = Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 1
            ? savedVolume
            : 0.8;
        if (els.volume) els.volume.value = String(Math.round(audio.volume * 100));

        renderAll();
        setupEvents();
        loadSong(state.index, false);

        setTimeout(() => $(".loading-screen")?.classList.add("hide"), 800);

        console.log("%c🎵 EchoBeat ONE-CONTROLLER READY", "color:#1DB954;font-size:18px;font-weight:bold");
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
