let phone = window.innerWidth <= 500;
let isWhite = "";
let isShop = false;

// initialize context
kaboom({
  canvas: document.querySelector("#mycanvas"),
});
function debounce(func) {
  var timer;
  return function (event) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func, 100, event);
  };
}
window.addEventListener("resize", debounce(function (e) {
  isMenu == true && go("menu");
}));

// load assets
loadSprite("seed", "images/game/seed.png");
loadSprite("apple", "images/game/apple.png");
loadSprite("banana", "images/game/banana.png");
loadSprite("tomato", "images/game/tomato.png");
loadSprite("poland", "images/other/poland.png");
loadSprite("usa", "images/other/united-states.png");

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
}

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
    hamster = "hamster_shoes_gloves";
  } else if (hasShoes) {
    hamster = "hamster_shoes";
  } else if (hasGloves) {
    hamster = "hamster_gloves";
  } else {
    hamster = "hamster";
  }

  return hamster;
}

loadSprite(updateHamster(), `images/${updateHamster()}.png`);
document.body.style.backgroundColor = rgb(50, 50, 50);

cap && loadSprite("cap", "images/other/cap.png");
winter_hat && loadSprite("winter_hat", "images/other/winter_hat.png");
glasses && loadSprite("glasses", "images/other/glasses.png");

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

let new_views = 1;
let online;

function Users_online(views) {
  new_views = views;
  online && (online.text = (polish ? "Użytkownicy online:" : "Users online:") + new_views);
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
let polish;
let MenuText = "Blue Hamster";
SetLanguage();
function SetLanguage() {
  let language = localStorage.getItem("Language");
  polish = !language && getFirstBrowserLanguage().includes("pl") || language === "polish";
}

let items = ["winter_hat", "cap", "glasses"];
const coolList = {
  winter_hat: { Scale: [0.9, 0.65], scale2: 1.925 },
  cap: { Scale: [0.9, 0.7], scale2: 2 },
  glasses: { Scale: [0.75, 0.7], scale2: 2.85 },
};

scene("menu", () => {
  let phone = window.innerWidth <= 500;
  isMenu = true;
  Credits = null;
  setCursor("default");
  setBackground(50, 50, 50);
  updateLocalStorage();
  hamster_width = phone ? 250 : 285;
  Hamster_text_size = phone ? 0.01 : 80;
  arrows = phone ? 130 : 200;
  arrows_scale = phone ? 0.16 : 0.2;
  info_x = phone ? 35 : 40;

  AddHamster();
  function AddHamster(white = "") {
    white !== "" ? isWhite = "white_" : isWhite = "";
    if (white !== "" && !getSprite(white + updateHamster())) {
      loadSprite(white + updateHamster(), `images/${white + updateHamster()}.png`);
    }
    menuHamster = add([
      sprite(white + updateHamster(), { width: hamster_width }),
      pos(width() / 2, height() / 2 + ((winter_hat || cap) == true && 25)),
      anchor("center"),
    ]);

    items.forEach(item => {
      const { Scale, scale2 } = coolList[item];
      if (eval(item) == true) {
        menuHamster.add([
          sprite(item, { width: hamster_width / 2 }),
          scale(vec2(Scale)),
          anchor("center"),
          pos(0, -hamster_width / scale2),
        ]);
      }
    });
  }

  add([
    text(MenuText, {
      size:
        Hamster_text_size -
        ((MenuText == "Game Over" || MenuText == "Koniec Gry") && !phone && 15),
    }),
    pos(width() / 2, height() / 2 - 230),
    anchor("center"),
  ]);

  const pl = add([
    rect(40, 40, { radius: 5 }),
    pos(width() - 75, 30),
    color(25, 25, 25),
    anchor("center"),
    area(),
  ]);
  pl_icon = pl.add([
    sprite("poland", { width: 30 }),
    anchor("center"),
    opacity(polish ? 1 : 0.3),
  ]);
  const usa = add([
    rect(40, 40, { radius: 5 }),
    pos(width() - 30, 30),
    color(25, 25, 25),
    anchor("center"),
    area(),
  ]);
  usa_icon = usa.add([
    sprite("usa", { width: 30 }),
    anchor("center"),
    opacity(polish ? 0.3 : 1)
  ]);
  pl.onClick(() => {
    localStorage.setItem("Language", "polish");
    SetLanguage();
    go("menu");
  });
  usa.onClick(() => {
    localStorage.setItem("Language", "english");
    SetLanguage();
    go("menu");
  });
  MyHover(pl, 1.05, 1);
  MyHover(usa, 1.05, 1);
  // display score
  add([text(polish ? "Masz:" : "You have:"), pos(10, 10)]);
  add([sprite("seed"), scale(0.08), pos(10, 50)]);
  add([text(seeds || 0), pos(60, 53)]);
  add([sprite("apple"), scale(0.1), pos(8, 100)]);
  add([text(apples || 0), pos(60, 110)]);
  add([sprite("banana"), scale(-0.09, 0.09), pos(56, 152)]);
  add([text(bananas || 0), pos(60, 160)]);
  add([sprite("tomato"), scale(0.085), pos(10, 202.5)]);
  add([text(tomatoes || 0), pos(60, 210)]);
  // display users online
  online = add([
    text((polish ? "Użytkownicy online:" : "Users online:") + new_views, { size: phone ? 22 : 28 }),
    pos(10, height() - 32),
  ]);
  // display credits
  const info = add([
    text("i"),
    pos(width() - info_x, height() - 45),
    color(140, 140, 140),
    area(),
  ]);
  const play_button = add([
    rect(350, 75, { radius: 8 }),
    color(0, 100, 0),
    pos(width() / 2, height() / 2 + 220),
    area(),
    anchor("center"),
    outline(5),
  ]);
  play_button.add([
    text(polish ? "Graj" : "Play"),
    anchor("center"),
    color(0, 0, 0),
  ]);
  const hamsters_button = add([
    rect(180, 40, { radius: 8 }),
    color(70, 70, 70),
    pos(width() / 2 - 65, height() / 2 + 285),
    area(),
    anchor("center"),
    outline(4.5),
  ]);
  hamsters_button.add([
    text(polish ? "Chomiki" : "Hamsters", { size: 30 }),
    anchor("center"),
    color(0, 0, 0)
  ]);
  const shop_button = add([
    rect(120, 40, { radius: 8 }),
    color(70, 70, 70),
    pos(width() / 2 + 95, height() / 2 + 285),
    area(),
    anchor("center"),
    outline(4.5),
  ]);
  shop_button.add([
    text(polish ? "Sklep" : "Shop", { size: 30 }),
    anchor("center"),
    color(0, 0, 0)
  ]);
  // animations
  MyHover(play_button, 1.025, 1, rgb(0, 125, 0), rgb(0, 100, 0));
  MyHover(hamsters_button, 1.02, 1, rgb(90, 90, 90), rgb(70, 70, 70));
  MyHover(shop_button, 1.02, 1, rgb(90, 90, 90), rgb(70, 70, 70));
  MyHover(info, 1, 1, rgb(240, 240, 240), rgb(140, 140, 140));

  let left_arrow, right_arrow;
  function hamsters() {
    !getSprite("left_arrow") && loadSprite("left_arrow", "images/other/left_arrow.png");
    if (!left_arrow && !right_arrow) {
      left_arrow = add([
        sprite("left_arrow"),
        scale(arrows_scale),
        pos(width() / 2 - arrows, height() / 2),
        area(),
        anchor("center"),
        "left_arrow",
      ]);
      right_arrow = add([
        sprite("left_arrow"),
        scale(-arrows_scale),
        pos(width() / 2 + arrows, height() / 2),
        area(),
        anchor("center"),
        opacity(0.25),
        "right_arrow",
      ]);
    }
    MyHover(left_arrow, arrows_scale + 0.01, arrows_scale);
  }
  function handleArrowClick(white) {
    AddHamster(white);
    const primary = white !== undefined ? right_arrow : left_arrow;
    const secondary = white !== undefined ? left_arrow : right_arrow;
    primary.opacity = 1;
    secondary.opacity = 0.25;
    MyHover(primary, arrows_scale + 0.01, arrows_scale);
    secondary.onHoverUpdate(() => {
      setCursor("default");
      secondary.scale = vec2(arrows_scale);
    });
    primary == right_arrow && MyHover(right_arrow, -arrows_scale - 0.01, -arrows_scale);
    secondary == right_arrow && secondary.onHoverUpdate(() => {
      setCursor("default");
      secondary.scale = vec2(-arrows_scale);
    });
  }
  // Bind the onClickArrow function to the arrow keys
  onKeyPress("left", () => left_arrow && handleArrowClick("white_"));
  onKeyPress("right", () => right_arrow && handleArrowClick());
  onClick("left_arrow", () => handleArrowClick("white_"));
  onClick("right_arrow", () => handleArrowClick());
  // Bind onClick and onKeyPress
  play_button.onClick(() => go("game"));
  onKeyPress("space", () => go("game"));
  hamsters_button.onClick(() => hamsters());
  // Load script only if it isn`t loaded
  function isScriptLoaded(src) {
    return Array.from(document.getElementsByTagName("script")).some(
      script => script.src.includes(src)
    );
  }
  shop_button.onClick(() => {
    if (!isScriptLoaded("shop.js")) {
      let script = document.createElement('script');
      script.src = "shop.js";
      script.onload = () => go("shop");
      document.head.appendChild(script);
    } else if (isScriptLoaded("shop.js")) {
      go("shop");
    }
  });
  info.onClick(() => {
    if (!isScriptLoaded("others/credits.js")) {
      let script = document.createElement('script');
      script.src = "others/credits.js";
      script.onload = () => display_info();
      document.head.appendChild(script);
    } else if (isScriptLoaded("others/credits.js")) {
      display_info();
    }
  });
});
go("menu");