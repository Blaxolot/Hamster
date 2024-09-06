// initialize context
kaboom({
    canvas: document.querySelector("#mycanvas"),
});
loadRoot("assets/");
document.body.style.backgroundColor = rgb(50, 50, 50);

let isNight;
const now = new Date();
const hour = now.getHours();
if (hour >= 6 && hour < 18) {
    isNight = false;
} else {
    isNight = true;
}
isNight = true;

const LIGHT_GRAY = rgb(150, 150, 150);