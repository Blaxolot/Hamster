const phone = window.innerWidth <= 500;
const JUMP_FORCE = 700;
let SPEED = 350;
let GRAVITY = 1250;
let hamster_white = false;
// initialize context
kaplay({
  width: window.innerWidth,
  height: window.innerHeight,
});
// load assets
loadSprite("seed", "images/seed.png");
loadSprite("apple", "images/apple.png");
loadSprite("left_banana", "images/left_banana.png");
loadSprite("tomato", "images/tomato.png");

function updateLocalStorage() {
  seeds = localStorage.getItem("seeds");
  apples = localStorage.getItem("apples");
  bananas = localStorage.getItem("bananas");
  tomatoes = localStorage.getItem("tomatoes");
  Wearing = localStorage.getItem("Wearing");
  Shoes = localStorage.getItem("Shoes");
  Winter_hat = localStorage.getItem("Winter_hat");
}

// Update the variables initially
updateLocalStorage();
function updateHamster() {
  updateLocalStorage();
  if (Wearing == "True" && Shoes !== "True") {
    hamster = "hamster_cap";
  } else if (Shoes == "True" && Wearing !== "True" && Winter_hat !== "True") {
    hamster = "hamster_shoes";
  } else if (Shoes == "True" && Wearing == "True") {
    hamster = "hamster_cap_shoes";
  } else if (Winter_hat == "True" && Shoes !== "True") {
    hamster = "hamster_winter_hat";
  } else if (Winter_hat == "True" && Shoes == "True") {
    hamster = "hamster_winter_hat_shoes";
  } else {
    hamster = "hamster";
  }
  return hamster;
}

loadSprite("hamster", `images/${updateHamster()}.png`);
setBackground(50, 50, 50);


let new_views = " ";
let online;

function Users_online(views) {
  new_views = views;
  online && (online.text = "Users online:" + new_views);
}

scene("menu", () => {
  setBackground(50, 50, 50);
  updateLocalStorage();
  hamster_width = phone ? 250 : 285;
  Hamster_text_size = phone ? 0.01 : 100;
  arrows = phone ? 130 : 200;
  arrows_scale = phone ? 0.16 : 0.2;
  info_x = phone ? 35 : 40;
  add([
    sprite("hamster", { width: hamster_width }),
    pos(center()),
    anchor("center"),
  ]);
  add([
    text("Hamster", { size: Hamster_text_size }),
    pos(width() / 2, height() / 2 - 230),
    anchor("center"),
  ]);
  // display score
  add([text("You have:"), pos(10, 10)]);
  add([sprite("seed"), scale(0.08), pos(10, 50)]);
  add([text(seeds || 0), pos(60, 53)]);
  add([sprite("apple"), scale(0.09), pos(8, 100)]);
  add([text(apples || 0), pos(60, 110)]);
  add([sprite("left_banana"), scale(0.09), pos(10, 150)]);
  add([text(bananas || 0), pos(60, 160)]);
  add([sprite("tomato"), scale(0.085), pos(10, 202.5)]);
  add([text(tomatoes || 0), pos(60, 210)]);
  online = add([
    text("Users online:" + new_views, { size: 28 }),
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
  play_button.add([text("Play"), anchor("center"), color(0, 0, 0)]);
  const hamsters_button = add([
    rect(180, 40, { radius: 8 }),
    color(70, 70, 70),
    pos(width() / 2 - 65, height() / 2 + 285),
    area(),
    anchor("center"),
    outline(4.5),
  ]);
  hamsters_button.add([
    text("Hamsters", { size: 30 }),
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
    text("Shop", { size: 30 }),
    anchor("center"),
    color(0, 0, 0)]);
  // animations
  play_button.onHoverUpdate(() => {
    play_button.scale = vec2(1.025);
    play_button.color = rgb(0, 125, 0);
    setCursor("pointer");
  });
  play_button.onHoverEnd(() => {
    play_button.scale = vec2(1);
    play_button.color = rgb(0, 100, 0);
    setCursor("default");
  });
  function handleButtonHover(...buttons) {
    buttons.forEach(button => {
      button.onHoverUpdate(() => {
        button.color = rgb(90, 90, 90);
        button.scale = vec2(1.02);
        setCursor("pointer");
      });
      button.onHoverEnd(() => {
        button.scale = vec2(1);
        button.color = rgb(70, 70, 70);
        setCursor("default");
      });
    });
  }
  handleButtonHover(hamsters_button, shop_button);
  info.onHoverUpdate(() => {
    info.color = rgb(240, 240, 240);
    setCursor("pointer");
  });
  info.onHoverEnd(() => {
    info.color = rgb(140, 140, 140);
    setCursor("default");
  });
  let left_arrow, right_arrow;
  function hamsters() {
    !getSprite("left_arrow") && loadSprite("left_arrow", "images/left_arrow.png");
    !getSprite("right_arrow") && loadSprite("right_arrow", "images/right_arrow.png");
    left_arrow = add([
      sprite("left_arrow"),
      scale(arrows_scale),
      pos(width() / 2 - arrows, height() / 2),
      area(),
      anchor("center"),
      "left_arrow",
    ]);
    right_arrow = add([
      sprite("right_arrow"),
      scale(arrows_scale),
      pos(width() / 2 + arrows, height() / 2),
      area(),
      anchor("center"),
      opacity(0.25),
      "right_arrow",
    ]);
    left_arrow.onHoverUpdate(() => {
      setCursor("pointer");
      left_arrow.scale = vec2(0.21);
    });
    left_arrow.onHoverEnd(() => {
      setCursor("default");
      left_arrow.scale = vec2(0.2);
    });
  }
  function handleArrowClick(white) {
    add([
      sprite(loadSprite("hamster", `images/${white + updateHamster()}.png`), {
        width: hamster_width,
      }),
      pos(center()),
      anchor("center"),
    ]);
    const primary = white !== "" ? right_arrow : left_arrow;
    const secondary = white !== "" ? left_arrow : right_arrow;
    primary.opacity = 1;
    secondary.opacity = 0.25;
    primary.onHoverUpdate(() => {
      setCursor("pointer");
      primary.scale = vec2(0.21);
    });
    secondary.onHoverUpdate(() => {
      setCursor("default");
      secondary.scale = vec2(0.2);
    });
  }
  // Bind the onClickArrow function to the arrow keys
  onKeyPress("left", () => { getSprite("left_arrow") && handleArrowClick("white_"); });
  onKeyPress("right", () => { getSprite("right_arrow") && handleArrowClick(""); });
  onClick("left_arrow", () => { handleArrowClick("white_"); });
  onClick("right_arrow", () => { handleArrowClick(""); });
  // Bind onClick and onKeyPress
  play_button.onClick(() => go("game"));
  onKeyPress("space", () => go("game"));
  hamsters_button.onClick(() => hamsters());
  // Load script only if it isn`t loaded
  function isScriptLoaded(src) {
    return Array.from(document.getElementsByTagName('script')).some(script => script.src.includes(src));
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