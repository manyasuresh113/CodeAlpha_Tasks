/* ===========================================================
                    EchoBeat Player Engine
                    Integrated v3.0
   =========================================================== */

(() => {
    "use strict";

    const audio = document.getElementById("audioPlayer");
    const playPauseBtn = document.getElementById("playPause");
    const nextBtn = document.getElementById("next");
    const previousBtn = document.getElementById("previous");
    const shuffleBtns = document.querySelectorAll('[title="Shuffle"]');
    const repeatBtns = document.querySelectorAll('[title="Repeat"]');
    const progressBar = document.getElementById("progress");
    const volumeSlider = document.getElementById("volume");
    const currentTimeEl = document.getElementById("currentTime");
    const totalDurationEl = document.getElementById("totalDuration");
    const vinyl = document.querySelector(".vinyl-record");
    const songGrid = document.getElementById("songGrid");
    const albumGrid = document.getElementById("albumGrid");
    const queueList = document.getElementById("queueList");

    if (!audio) {
        console.error("EchoBeat Player: #audioPlayer was not found.");
        return;
    }

    const state = {
        currentSongIndex: 0,
        isPlaying: false,
        shuffle: false,
        repeat: false
    };

    function formatTime(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${String(secs).padStart(2, "0")}`;
    }

    function getSong(index = state.currentSongIndex) {
        return Array.isArray(window.songs) ? window.songs[index] : null;
    }

    function saveState() {
        localStorage.setItem("echo-song", String(state.currentSongIndex));
        localStorage.setItem("echo-volume", String(audio.volume));
        localStorage.setItem("echo-shuffle", String(state.shuffle));
        localStorage.setItem("echo-repeat", String(state.repeat));
    }

    function restoreState() {
        const savedSong = Number(localStorage.getItem("echo-song"));
        const savedVolume = Number(localStorage.getItem("echo-volume"));
        const savedShuffle = localStorage.getItem("echo-shuffle");
        const savedRepeat = localStorage.getItem("echo-repeat");

        if (Number.isInteger(savedSong) && savedSong >= 0 && savedSong < songs.length) {
            state.currentSongIndex = savedSong;
        }

        if (Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 1) {
            audio.volume = savedVolume;
        } else {
            audio.volume = 0.8;
        }

        if (volumeSlider) {
            volumeSlider.value = String(Math.round(audio.volume * 100));
        }

        state.shuffle = savedShuffle === "true";
        state.repeat = savedRepeat === "true";

        updateToggleButtons();
    }

    function updateToggleButtons() {
        shuffleBtns.forEach(btn => btn.classList.toggle("active", state.shuffle));
        repeatBtns.forEach(btn => btn.classList.toggle("active", state.repeat));
    }

    function updatePlayerUI(song) {
        if (!song) return;

        const setText = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value ?? "-";
        };

        const cover = document.getElementById("albumCover");
        const miniCover = document.getElementById("miniCover");

        setText("songTitle", song.title);
        setText("artistName", song.artist || (song.artists || []).join(", "));
        setText("albumName", song.album);
        setText("genre", song.genre);
        setText("year", song.year);
        setText("duration", song.duration || "0:00");
        setText("miniTitle", song.title);
        setText("miniArtist", song.artist || (song.artists || []).join(", "));

        if (cover) {
            cover.src = song.cover;
            cover.alt = `${song.title} cover`;
        }

        if (miniCover) {
            miniCover.src = song.cover;
            miniCover.alt = `${song.title} cover`;
        }

        if (currentTimeEl) currentTimeEl.textContent = "0:00";
        if (totalDurationEl) totalDurationEl.textContent = song.duration || "0:00";
        if (progressBar) progressBar.value = "0";

        window.dispatchEvent(new CustomEvent("echobeat:songchange", {
            detail: { song, index: state.currentSongIndex }
        }));
    }

    function loadSong(index, autoplay = false) {
        if (!Array.isArray(window.songs) || !window.songs.length) return;

        const safeIndex = Math.max(0, Math.min(Number(index) || 0, songs.length - 1));
        const song = songs[safeIndex];
        if (!song) return;

        state.currentSongIndex = safeIndex;
        state.isPlaying = false;

        audio.pause();
        audio.src = song.file;
        audio.load();

        updatePlayerUI(song);
        renderAll();

        localStorage.setItem("echo-song", String(safeIndex));

        if (autoplay) {
            playSong();
        }
    }

    function playSong() {
        const promise = audio.play();

        if (promise && typeof promise.catch === "function") {
            promise.catch(error => {
                console.warn("EchoBeat could not start playback:", error);
            });
        }

        state.isPlaying = true;
        updatePlayButton();
        setVinylPlaying(true);
    }

    function pauseSong() {
        audio.pause();
        state.isPlaying = false;
        updatePlayButton();
        setVinylPlaying(false);
    }

    function togglePlay() {
        if (audio.paused) playSong();
        else pauseSong();
    }

    function updatePlayButton() {
        if (!playPauseBtn) return;
        playPauseBtn.innerHTML = state.isPlaying
            ? '<i class="fa-solid fa-pause"></i>'
            : '<i class="fa-solid fa-play"></i>';
        playPauseBtn.title = state.isPlaying ? "Pause" : "Play";
    }

    function setVinylPlaying(playing) {
        if (vinyl) {
            vinyl.style.animationPlayState = playing ? "running" : "paused";
        }
    }

    function nextSong() {
        if (!songs.length) return;

        let nextIndex;

        if (state.shuffle && songs.length > 1) {
            do {
                nextIndex = Math.floor(Math.random() * songs.length);
            } while (nextIndex === state.currentSongIndex);
        } else {
            nextIndex = (state.currentSongIndex + 1) % songs.length;
        }

        loadSong(nextIndex, true);
    }

    function previousSong() {
        if (!songs.length) return;

        if (audio.currentTime > 3) {
            audio.currentTime = 0;
            return;
        }

        const previousIndex =
            (state.currentSongIndex - 1 + songs.length) % songs.length;

        loadSong(previousIndex, true);
    }

    function renderSongGrid() {
        if (!songGrid || !Array.isArray(window.songs)) return;

        songGrid.innerHTML = "";

        songs.forEach((song, index) => {
            const card = document.createElement("div");
            card.className = "song-card";
            if (index === state.currentSongIndex) card.classList.add("active-song");

            card.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div>
                    <h3>${song.title}</h3>
                    <p>${song.artist || (song.artists || []).join(", ")}</p>
                </div>
            `;

            card.addEventListener("click", () => loadSong(index, true));
            songGrid.appendChild(card);
        });
    }

    function renderAlbums() {
        if (!albumGrid || !Array.isArray(window.songs)) return;

        albumGrid.innerHTML = "";

        songs.forEach((song, index) => {
            const card = document.createElement("div");
            card.className = "album-card";

            card.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <h4>${song.title}</h4>
                <span>${song.genre}</span>
            `;

            card.addEventListener("click", () => loadSong(index, true));
            albumGrid.appendChild(card);
        });
    }

    function renderQueue() {
        if (!queueList || !Array.isArray(window.songs)) return;

        queueList.innerHTML = "";

        songs.forEach((song, index) => {
            const item = document.createElement("div");
            item.className = "queue-song";
            if (index === state.currentSongIndex) item.classList.add("active");

            item.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div>
                    <h4>${song.title}</h4>
                    <span>${song.artist || (song.artists || []).join(", ")}</span>
                </div>
                <p>${index === state.currentSongIndex ? "▶" : ""}</p>
            `;

            item.addEventListener("click", () => loadSong(index, true));
            queueList.appendChild(item);
        });
    }

    function renderAll() {
        renderSongGrid();
        renderAlbums();
        renderQueue();
    }

    function changeVolume(value) {
        const volume = Math.max(0, Math.min(100, Number(value))) / 100;
        audio.volume = volume;
        saveState();
    }

    function seek(value) {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
        audio.currentTime = (Number(value) / 100) * audio.duration;
    }

    function updateProgress() {
        if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

        const percent = (audio.currentTime / audio.duration) * 100;

        if (progressBar) progressBar.value = String(percent);
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
    }

    function updateDuration() {
        if (totalDurationEl) {
            totalDurationEl.textContent = formatTime(audio.duration);
        }

        const song = getSong();
        if (song) {
            const durationEl = document.getElementById("duration");
            if (durationEl && Number.isFinite(audio.duration)) {
                durationEl.textContent = formatTime(audio.duration);
            }
        }
    }

    function handleEnded() {
        state.isPlaying = false;

        if (state.repeat) {
            audio.currentTime = 0;
            playSong();
            return;
        }

        nextSong();
    }

    function downloadCurrentSong() {
        const song = getSong();
        if (!song) return;

        const link = document.createElement("a");
        link.href = song.file;
        link.download = `${song.title} - ${song.artist || "EchoBeat"}.mp3`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    function bindEvents() {
        playPauseBtn?.addEventListener("click", togglePlay);
        nextBtn?.addEventListener("click", nextSong);
        previousBtn?.addEventListener("click", previousSong);

        shuffleBtns.forEach(btn => btn.addEventListener("click", () => {
            state.shuffle = !state.shuffle;
            updateToggleButtons();
            saveState();
        }));

        repeatBtns.forEach(btn => btn.addEventListener("click", () => {
            state.repeat = !state.repeat;
            updateToggleButtons();
            saveState();
        }));

        progressBar?.addEventListener("input", e => seek(e.target.value));
        volumeSlider?.addEventListener("input", e => changeVolume(e.target.value));

        audio.addEventListener("timeupdate", updateProgress);
        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("play", () => {
            state.isPlaying = true;
            updatePlayButton();
            setVinylPlaying(true);
            saveState();
        });
        audio.addEventListener("pause", () => {
            state.isPlaying = false;
            updatePlayButton();
            setVinylPlaying(false);
            saveState();
        });
        audio.addEventListener("ended", handleEnded);

        document.getElementById("downloadBtn")?.addEventListener(
            "click",
            downloadCurrentSong
        );

        document.addEventListener("keydown", e => {
            if (e.target.matches("input, textarea")) return;

            if (e.code === "Space") {
                e.preventDefault();
                togglePlay();
            } else if (e.code === "ArrowRight") {
                nextSong();
            } else if (e.code === "ArrowLeft") {
                previousSong();
            } else if (e.code === "ArrowUp") {
                e.preventDefault();
                changeVolume((audio.volume * 100) + 5);
                if (volumeSlider) volumeSlider.value = String(Math.round(audio.volume * 100));
            } else if (e.code === "ArrowDown") {
                e.preventDefault();
                changeVolume((audio.volume * 100) - 5);
                if (volumeSlider) volumeSlider.value = String(Math.round(audio.volume * 100));
            }
        });
    }

    function init() {
        if (!Array.isArray(window.songs) || !window.songs.length) {
            console.error("EchoBeat Player: playlist.js did not load.");
            return;
        }

        restoreState();
        bindEvents();
        loadSong(state.currentSongIndex, false);
        updatePlayButton();

        console.log("%c🎵 EchoBeat Player Ready", "color:#1DB954;font-size:18px;font-weight:bold");
    }

    window.EchoBeatPlayer = {
        getState: () => ({ ...state }),
        getCurrentSong: () => getSong(),
        loadSong,
        playSong,
        pauseSong,
        togglePlay,
        nextSong,
        previousSong,
        refreshUI: renderAll,
        saveState
    };

    init();
})();
