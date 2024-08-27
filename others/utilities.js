let phone = window.innerWidth <= 500;
let isShop = false;
function debounce(func) {
    var timer;
    return function (event) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(func, 100, event);
    };
}

function MyHover(obj, scale, scale2, color, color2) {
    obj.onHoverUpdate(() => {
        setCursor("pointer");
        obj.scale = vec2(scale);
        obj.color = color || obj.color;
    });

    obj.onHoverEnd(() => {
        setCursor("default");
        obj.scale = vec2(scale2);
        obj.color = color2 || obj.color;
    });
}


function getFirstBrowserLanguage() {
    var nav = window.navigator,
        browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'],
        i,
        language;

    // support for HTML 5.1 "navigator.languages"
    if (Array.isArray(nav.languages)) {
        for (i = 0; i < nav.languages.length; i++) {
            language = nav.languages[i];
            if (language && language.length) {
                return language;
            }
        }
    }
    // support for other well known properties in browsers
    for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
        language = nav[browserLanguagePropertyKeys[i]];
        if (language && language.length) {
            return language;
        }
    }
    return null;
};

function updateLocalStorage() {
    seeds = localStorage.getItem("seeds");
    apples = localStorage.getItem("apples");
    bananas = localStorage.getItem("bananas");
    tomatoes = localStorage.getItem("tomatoes");
    Wearing = localStorage.getItem("Wearing");
    Shoes = localStorage.getItem("Shoes");
    Winter_hat = localStorage.getItem("Winter_hat");
    Gloves = localStorage.getItem("Gloves");
    Glasses = localStorage.getItem("Glasses");
    X2_hearts = localStorage.getItem("X2_hearts");
    Mystery = localStorage.getItem("Mystery");
    Hamster2 = localStorage.getItem("Hamster2");

}
let currentHamster = (localStorage.getItem("Hamster2") == "True") ? "hamster2" : "hamster";
function updateHamster() {
    updateLocalStorage();
    const hasCap = Wearing === "True";
    const hasShoes = Shoes === "True";
    const hasWinterHat = Winter_hat === "True";
    const hasGloves = Gloves === "True";
    const hasGlasses = Glasses === "True";

    glasses = hasGlasses ? true : false;
    cap = hasCap ? true : false;
    winter_hat = hasWinterHat ? true : false;

    if (hasCap && hasWinterHat) {
        localStorage.setItem("Winter_hat", "False");
    } else if (hasShoes && hasGloves) {
        hamster = currentHamster + "_shoes_gloves";
    } else if (hasShoes) {
        hamster = currentHamster + "_shoes";
    } else if (hasGloves) {
        hamster = currentHamster + "_gloves";
    } else {
        hamster = currentHamster;
    }

    return hamster;
}
let polish;
SetLanguage();
function SetLanguage() {
    let language = localStorage.getItem("Language");
    polish = !language && getFirstBrowserLanguage().includes("pl") || language === "polish";
}

function loadS(sprite, directory) {
    if (!getSprite(sprite)) {
        loadSprite(sprite, directory);
    }
}
// Load script only if it isn`t loaded
function isScriptLoaded(src) {
    return Array.from(document.getElementsByTagName("script")).some(script =>
        script.src.includes(src)
    );
}