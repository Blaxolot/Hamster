const phone = window.innerWidth <= 500;
const JUMP_FORCE = 700;
let SPEED = 350;
let GRAVITY = 1250;
let isWhite = "";
// initialize context
kaplay({
  width: window.innerWidth,
  height: window.innerHeight,
});
// load assets
loadSprite("seed", "images/seed.png");
loadSprite("apple", "images/apple.png");
loadSprite("banana", "images/banana.png");
loadSprite("tomato", "images/tomato.png");
loadSprite("poland", "images/poland.png");
loadSprite("usa", "images/united-states.png");

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
  }
  if (hasShoes && hasGloves) {
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
setBackground(50, 50, 50);
document.body.style.backgroundColor = rgb(50, 50, 50);

cap && loadSprite("cap", "images/cap.png");
winter_hat && loadSprite("winter_hat", "images/winter_hat.png");
glasses && loadSprite("glasses", "images/glasses.png");

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
function SetLanguage() {
  let language = localStorage.getItem("Language");
  polish = !language && getFirstBrowserLanguage().includes("pl") || language === "polish";
}
SetLanguage();

let MenuText = polish ? "Chomik" : "Hamster";

scene("menu", () => {
  Credits = null;
  setCursor("default");
  setBackground(50, 50, 50);
  updateLocalStorage();
  hamster_width = phone ? 250 : 285;
  Hamster_text_size = phone ? 0.01 : 100;
  arrows = phone ? 130 : 200;
  arrows_scale = phone ? 0.16 : 0.2;
  info_x = phone ? 35 : 40;

  AddHamster("");
  function AddHamster(white) {
    white !== "" ? isWhite = "white_" : isWhite = "";
    if (white !== "" && !getSprite(white + updateHamster())) {
      loadSprite(white + updateHamster(), `images/${white + updateHamster()}.png`);
    }
    menuHamster = add([
      sprite(white + updateHamster(), { width: hamster_width }),
      pos(width() / 2, height() / 2 + ((winter_hat || cap) == true && 25)),
      anchor("center"),
    ]);

    if (winter_hat == true) {
      menuHamster.add([
        sprite("winter_hat", { width: hamster_width / 2 }),
        scale(vec2(0.9, 0.65)),
        anchor("center"),
        pos(0, phone ? -130 : -147),
      ]);
    }
    if (cap == true) {
      menuHamster.add([
        sprite("cap", { width: hamster_width / 2 }),
        scale(vec2(0.9, 0.7)),
        anchor("center"),
        pos(0, phone ? -124 : -141),
      ]);
    }
    if (glasses == true) {
      menuHamster.add([
        sprite("glasses", { width: hamster_width / 2 }),
        scale(vec2(0.75, 0.7)),
        anchor("center"),
        pos(0, phone ? -90 : -100),
      ]);
    }
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

  pl = add([
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
  usa = add([
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
  add([sprite("apple"), scale(0.09), pos(8, 100)]);
  add([text(apples || 0), pos(60, 110)]);
  add([sprite("banana"), scale(-0.09, 0.09), pos(56, 150)]);
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
  play_button.add([text(polish ? "Graj" : "Play"), anchor("center"), color(0, 0, 0)]);
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
    color(0, 0, 0)]);
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
    color(0, 0, 0)]);
  // animations
  MyHover(play_button, 1.025, 1, rgb(0, 125, 0), rgb(0, 100, 0));
  MyHover(hamsters_button, 1.02, 1, rgb(90, 90, 90), rgb(70, 70, 70));
  MyHover(shop_button, 1.02, 1, rgb(90, 90, 90), rgb(70, 70, 70));
  MyHover(info, 1, 1, rgb(240, 240, 240), rgb(140, 140, 140));

  let left_arrow, right_arrow;
  function hamsters() {
    !getSprite("left_arrow") && loadSprite("left_arrow", "images/left_arrow.png");
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

    MyHover(left_arrow, 0.21, 0.2);
  }
  function handleArrowClick(white) {
    AddHamster(white);
    const primary = white !== "" ? right_arrow : left_arrow;
    const secondary = white !== "" ? left_arrow : right_arrow;
    primary.opacity = 1;
    secondary.opacity = 0.25;
    MyHover(primary, 0.21, 0.2);
    secondary.onHoverUpdate(() => {
      setCursor("default");
      secondary.scale = vec2(0.2);
    });
    primary == right_arrow && MyHover(right_arrow, -0.21, -0.2);
    secondary == right_arrow && secondary.onHoverUpdate(() => {
      setCursor("default");
      secondary.scale = vec2(-0.2);
    });
  }
  // Bind the onClickArrow function to the arrow keys
  onKeyPress("left", () => left_arrow && handleArrowClick("white_"));
  onKeyPress("right", () => right_arrow && handleArrowClick(""));
  onClick("left_arrow", () => handleArrowClick("white_"));
  onClick("right_arrow", () => handleArrowClick(""));
  // Bind onClick and onKeyPress
  play_button.onClick(() => go("game"));
  onKeyPress("space", () => go("game"));
  hamsters_button.onClick(() => hamsters());
  // Load script only if it isn`t loaded
  function isScriptLoaded(src) {
    return Array.from(document.getElementsByTagName("script")).some(script =>
      script.src.includes(src)
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