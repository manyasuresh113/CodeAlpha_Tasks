/* ===========================
        EchoBeat Splash
        Integrated v3.0
   =========================== */

const splash = document.querySelector(".splash-container");
const body = document.body;
const SPLASH_TIME = 3500;

const currentUser = localStorage.getItem("echoUser");
const currentGuest = localStorage.getItem("echoGuest");
const guestUser = localStorage.getItem("echoGuest");

document.addEventListener("keydown", event => {
    if (event.code === "Space") {
        event.preventDefault();
        startTransition();
    }
});

document.addEventListener("click", startTransition, { once: true });

setTimeout(startTransition, SPLASH_TIME);

let started = false;

function startTransition() {
    if (started) return;
    started = true;

    body.style.transition = "opacity .8s ease";
    body.style.opacity = "0";

    setTimeout(() => {
        if (currentUser || guestUser === "true" || guestUser === true) {
            window.location.href = "index.html";
        } else {
            window.location.href = "login.html";
        }
    }, 800);
}

window.addEventListener("load", () => {
    console.log("🎵 Welcome to EchoBeat");
    console.log("Your Music. Your World.");
});

document.addEventListener("contextmenu", event => event.preventDefault());

document.querySelectorAll("img").forEach(image => {
    image.draggable = false;
});

console.time("EchoBeat Loaded");
window.addEventListener("load", () => console.timeEnd("EchoBeat Loaded"));
