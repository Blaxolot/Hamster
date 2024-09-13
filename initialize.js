let phone = window.innerWidth <= 500;
let isShop = false;
document.addEventListener('keydown', function (e) {
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
    }
});
// initialize context
kaboom({
    canvas: document.querySelector("#mycanvas"),
});
const natural_food = ["seed", "apple", "banana", "tomato"];
const bad_food = ["chocolate", "rotten_tomato"];
const all_food = natural_food.concat(bad_food);
// load assets
loadRoot("assets/");
for (const obj of all_food) {
    loadSprite(obj, `images/game/${obj}.png`);
}

const BACKGROUND_COLOR = rgb(50, 50, 50);
const LIGHT_GRAY = rgb(150, 150, 150);
document.body.style.backgroundColor = BACKGROUND_COLOR;
setBackground(BACKGROUND_COLOR);

// night or day
let isNight;
const now = new Date();
const hour = now.getHours();
if (hour >= 6 && hour < 18) {
    isNight = false;
} else {
    isNight = true;
}