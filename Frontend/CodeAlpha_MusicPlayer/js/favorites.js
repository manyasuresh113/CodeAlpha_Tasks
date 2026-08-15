/* ==========================================================
                    EchoBeat Favorites
                    Integrated v3.0
   ========================================================== */

(() => {
    "use strict";

    const favoriteBtn = document.getElementById("favoriteBtn");
    let favorites = JSON.parse(localStorage.getItem("echo-favorites") || "[]");

    function saveFavorites() {
        localStorage.setItem("echo-favorites", JSON.stringify(favorites));
        window.dispatchEvent(new CustomEvent("echobeat:favoriteschange"));
    }

    function isFavorite(songId) {
        return favorites.includes(songId);
    }

    function getFavoriteSongs() {
        return (window.songs || []).filter(song => isFavorite(song.id));
    }

    function updateFavoriteButton() {
        if (!favoriteBtn || !window.EchoBeatPlayer) return;

        const song = window.EchoBeatPlayer.getCurrentSong();
        if (!song) return;

        const liked = isFavorite(song.id);
        favoriteBtn.classList.toggle("liked", liked);
        favoriteBtn.innerHTML = liked
            ? '<i class="fa-solid fa-heart"></i>'
            : '<i class="fa-regular fa-heart"></i>';
        favoriteBtn.title = liked ? "Remove from favorites" : "Add to favorites";
    }

    function toggleFavorite() {
        const song = window.EchoBeatPlayer?.getCurrentSong();
        if (!song) return;

        const index = favorites.indexOf(song.id);

        if (index === -1) favorites.push(song.id);
        else favorites.splice(index, 1);

        saveFavorites();
        updateFavoriteButton();

        if (document.getElementById("favoriteCount")) {
            document.getElementById("favoriteCount").textContent =
                `${favorites.length} Songs`;
        }
    }

    function renderFavorites(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = "";

        const likedSongs = getFavoriteSongs();

        if (!likedSongs.length) {
            container.innerHTML = `
                <div class="empty-favorites">
                    <i class="fa-regular fa-heart"></i>
                    <p>No liked songs yet.</p>
                </div>
            `;
            return;
        }

        likedSongs.forEach(song => {
            const index = songs.findIndex(item => item.id === song.id);
            const card = document.createElement("div");
            card.className = "song-card";
            card.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div>
                    <h3>${song.title}</h3>
                    <p>${song.artist || (song.artists || []).join(", ")}</p>
                </div>
            `;
            card.addEventListener("click", () => {
                window.EchoBeatPlayer?.loadSong(index, true);
            });
            container.appendChild(card);
        });
    }

    favoriteBtn?.addEventListener("click", toggleFavorite);

    window.addEventListener("echobeat:songchange", updateFavoriteButton);

    window.getFavoriteSongs = getFavoriteSongs;
    window.isFavorite = isFavorite;
    window.renderFavorites = renderFavorites;

    updateFavoriteButton();

    console.log("%c❤️ Favorites Ready", "color:#ff3b5c;font-size:16px;font-weight:bold");
})();
