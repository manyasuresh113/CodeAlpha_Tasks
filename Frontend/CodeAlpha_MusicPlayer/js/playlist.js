/* ==========================================================
                    EchoBeat Playlist
========================================================== */

const songs = [

{
    id: 1,
    title: "PILLOWTALK",
    artist: "ZAYN",
    album: "Mind of Mine",
    genre: "Pop",
    year: "2016",
    cover: "assets/covers/pillowtalk.jpg",
    file: "assets/music/pillowtalk.mp3",
    lyrics: "assets/lyrics/pillowtalk.lrc"
},

{
    id: 2,
    title: "Home",
    artist: "Edith Whiskers",
    album: "Home",
    genre: "Indie",
    year: "2024",
    cover: "assets/covers/home.jpg",
    file: "assets/music/home.mp3",
    lyrics: "assets/lyrics/home.lrc"
},

{
    id: 3,
    title: "Arz Kiya Hai",
    artist: "Anuv Jain",
    album: "Arz Kiya Hai",
    genre: "Indie",
    year: "2025",
    cover: "assets/covers/arz_kiya_hai.jpg",
    file: "assets/music/arz_kiya_hai.mp3",
    lyrics: "assets/lyrics/arz_kiya_hai.lrc"
},

{
    id: 4,
    title: "Iss Tarah",
    artists: [
    "Char Diwari",
    "Sonu Nigam"
    ],  
    album: "Single",
    genre: "Indie",
    year: "2025",
    cover: "assets/covers/iss_tarah.jpg",
    file: "assets/music/iss_tarah.mp3",
    lyrics: "assets/lyrics/iss_tarah.lrc"
},

{
    id: 5,
    title: "Kalyani",
    artist: "Shreya Ghoshal",
    album: "Kalyani",
    genre: "Melody",
    year: "2024",
    cover: "assets/covers/kalyani.jpg",
    file: "assets/music/kalyani.mp3",
    lyrics: "assets/lyrics/kalyani.lrc"
},

{
    id: 6,
    title: "Karagida Baaninalli",
    artist: "Sonu Nigam",
    album: "Simple Agi Ond Love Story",
    genre: "Kannada",
    year: "2013",
    cover: "assets/covers/karagida_baaninalli.jpg",
    file: "assets/music/karagida_baaninalli.mp3",
    lyrics: "assets/lyrics/karagida_baaninalli.lrc"
},

{
    id: 7,
    title: "Nanage Allava",
    artist: "Sanjith Hegde",
    album: "Single",
    genre: "Kannada",
    year: "2024",
    cover: "assets/covers/nanage_allava.jpg",
    file: "assets/music/nanage_allava.mp3",
    lyrics: "assets/lyrics/nange_allava.lrc"
},

{
    id: 8,
    title: "Oorum Blood",
    artist: "Sai Abhyankkar",
    album: "Dude",
    genre: "Tamil",
    year: "2025",
    cover: "assets/covers/oorum_blood.jpg",
    file: "assets/music/oorum_blood.mp3",
    lyrics: "assets/lyrics/oorum_blood.lrc"
},

{
    id: 9,
    title: "Ringa Ringa",
    artist: "Priya Hemesh",
    album: "Arya 2",
    genre: "Telugu",
    year: "2009",
    cover: "assets/covers/ringa_ringa.jpg",
    file: "assets/music/ringa_ringa.mp3",
    lyrics: "assets/lyrics/ringa_ringa.lrc"
},

{
    id: 10,
    title: "Yenendu Hesaridalli",
    artist: "Sonu Nigam",
    album: "Annabond",
    genre: "Kannada",
    year: "2012",
    cover: "assets/covers/yenendu_hesaridalli.jpg",
    file: "assets/music/yenendu_hesaridalli.mp3",
    lyrics: "assets/lyrics/yenendu_hesaridalli.lrc"
},

{
    id: 11,
    title: "Afreen Afreen",
    artist: "Rahat Fateh Ali Khan",
    album: "Coke Studio",
    genre: "Sufi",
    year: "2016",
    cover: "assets/covers/afreen_afreen.jpg",
    file: "assets/music/afreen_afreen.mp3",
    lyrics: "assets/lyrics/afreen_afreen.lrc"
},

{
    id: 12,
    title: "No Man Will Ever Love You",
    artist: "Raghu Dixit",
    album: "Single",
    genre: "Indie Folk",
    year: "2025",
    cover: "assets/covers/no_man_will_ever_love_you.jpg",
    file: "assets/music/no_man_will_ever_love_you.mp3",
    lyrics: "assets/lyrics/no_man.lrc"
},

{
    id: 13,
    title: "Tum Ho Toh",
    artist: "Arijit Singh",
    album: "Saiyaara",
    genre: "Romantic",
    year: "2025",
    cover: "assets/covers/tum_ho_toh.jpg",
    file: "assets/music/tum_ho_toh.mp3",
    lyrics: "assets/lyrics/tum_ho_toh.lrc"
},

{
    id: 14,
    title: "Bairan",
    artist: "Banjaare",
    album: "Banjaare",
    genre: "Indie",
    year: "2025",
    cover: "assets/covers/bairan.jpg",
    file: "assets/music/bairan.mp3",
    lyrics: "assets/lyrics/bairan.lrc"
}

];

window.songs = songs;

/* ==========================================================
                    Helper Functions
========================================================== */

function getSongById(id) {
    return songs.find(song => song.id === id);
}

function getSongIndex(id) {
    return songs.findIndex(song => song.id === id);
}

function getRandomSong() {
    return songs[Math.floor(Math.random() * songs.length)];
}

console.log(`🎵 Loaded ${songs.length} songs`);