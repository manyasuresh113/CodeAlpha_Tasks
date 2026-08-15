/* ==========================================================
                    EchoBeat Storage Manager
========================================================== */

const Storage = {

    /* =============================
            Generic
    ============================== */

    save(key, value){

        localStorage.setItem(

            key,

            JSON.stringify(value)

        );

    },

    load(key, defaultValue = null){

        const value = localStorage.getItem(key);

        return value

            ? JSON.parse(value)

            : defaultValue;

    },

    remove(key){

        localStorage.removeItem(key);

    },

    clear(){

        localStorage.clear();

    },

    /* =============================
            PLAYER
    ============================== */

    saveCurrentSong(id){

        this.save(

            "echo-current-song",

            id

        );

    },

    loadCurrentSong(){

        return this.load(

            "echo-current-song",

            0

        );

    },

    saveVolume(volume){

        this.save(

            "echo-volume",

            volume

        );

    },

    loadVolume(){

        return this.load(

            "echo-volume",

            80

        );

    },

    saveShuffle(value){

        this.save(

            "echo-shuffle",

            value

        );

    },

    loadShuffle(){

        return this.load(

            "echo-shuffle",

            false

        );

    },

    saveRepeat(value){

        this.save(

            "echo-repeat",

            value

        );

    },

    loadRepeat(){

        return this.load(

            "echo-repeat",

            false

        );

    },

    /* =============================
            FAVORITES
    ============================== */

    saveFavorites(list){

        this.save(

            "echo-favorites",

            list

        );

    },

    loadFavorites(){

        return this.load(

            "echo-favorites",

            []

        );

    },

    /* =============================
            RECENTLY PLAYED
    ============================== */

    saveRecentlyPlayed(songId){

        let recent =

        this.load(

            "echo-recent",

            []

        );

        recent = recent.filter(

            id => id !== songId

        );

        recent.unshift(songId);

        recent = recent.slice(0,20);

        this.save(

            "echo-recent",

            recent

        );

    },

    loadRecentlyPlayed(){

        return this.load(

            "echo-recent",

            []

        );

    },

    /* =============================
            QUEUE
    ============================== */

    saveQueue(queue){

        this.save(

            "echo-queue",

            queue

        );

    },

    loadQueue(){

        return this.load(

            "echo-queue",

            []

        );

    },

    /* =============================
            THEME
    ============================== */

    saveTheme(theme){

        this.save(

            "echo-theme",

            theme

        );

    },

    loadTheme(){

        return this.load(

            "echo-theme",

            "dark"

        );

    },

    /* =============================
            LOGIN
    ============================== */

    saveUser(user){

        this.save(

            "echo-user",

            user

        );

    },

    loadUser(){

        return this.load(

            "echo-user",

            null

        );

    },

    logout(){

        this.remove(

            "echo-user"

        );

    }

};

/* ==========================================================
            INITIALIZE
========================================================== */

window.Storage = Storage;

console.log(

"%c💾 Storage Ready",

"color:#9d4edd;font-size:16px;font-weight:bold"

);