/* ==========================================================
                    EchoBeat Search Engine
                    Integrated v3.0
   ========================================================== */

(() => {
    "use strict";

    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    if (!searchInput || !searchResults) return;

    function getArtist(song) {
        return song.artist || (song.artists || []).join(", ");
    }

    function searchSongs(query) {
        const value = query.toLowerCase().trim();

        if (!value) {
            searchResults.innerHTML = "";
            searchResults.style.display = "none";
            return;
        }

        const results = songs.filter(song =>
            song.title.toLowerCase().includes(value) ||
            getArtist(song).toLowerCase().includes(value) ||
            song.album.toLowerCase().includes(value) ||
            song.genre.toLowerCase().includes(value) ||
            String(song.year).includes(value)
        );

        renderSearchResults(results);
    }

    function renderSearchResults(results) {
        searchResults.innerHTML = "";
        searchResults.style.display = "block";

        if (!results.length) {
            searchResults.innerHTML = `
                <div class="search-empty">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <p>No songs found</p>
                </div>
            `;
            return;
        }

        results.forEach(song => {
            const card = document.createElement("div");
            card.className = "search-item";

            card.innerHTML = `
                <img src="${song.cover}" alt="${song.title}">
                <div>
                    <h4>${song.title}</h4>
                    <p>${getArtist(song)}</p>
                </div>
            `;

            card.addEventListener("click", () => {
                const index = songs.findIndex(item => item.id === song.id);
                window.EchoBeatPlayer?.loadSong(index, true);
                searchInput.value = "";
                searchResults.innerHTML = "";
                searchResults.style.display = "none";
            });

            searchResults.appendChild(card);
        });
    }

    searchInput.addEventListener("input", e => searchSongs(e.target.value));

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            searchInput.value = "";
            searchResults.innerHTML = "";
            searchResults.style.display = "none";
        }
    });

    document.addEventListener("click", e => {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.style.display = "none";
        }
    });

    console.log("%c🔍 Search Ready", "color:#00c2ff;font-size:16px;font-weight:bold");
})();
