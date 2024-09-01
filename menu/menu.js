let MenuText = "Blue Hamster";
window.addEventListener(
  "resize",
  debounce(function (e) {
    isMenu == true && go("menu");
  })
);

// load assets
loadSprite("seed", "images/game/seed.png");
loadSprite("apple", "images/game/apple.png");
loadSprite("banana", "images/game/banana.png");
loadSprite("tomato", "images/game/tomato.png");

let new_views = 1;
let online;

function Users_online(views) {
  new_views = views || 1;
  online.text = (polish ? "Użytkownicy" : "Users") + " online:" + new_views;
}

scene("menu", () => {
  let phone = window.innerWidth <= 500;
  isMenu = true;
  Credits = null;
  setCursor("default");
  setBackground(50, 50, 50);
  updateLocalStorage();
  arrows = phone ? 130 : 200;
  arrows_scale = phone ? 0.16 : 0.2;
  info_x = phone ? 35 : 40;
  
  // display score
  add([text(polish ? "Masz:" : "You have:"), pos(10, 10)]);
  add([sprite("seed"), scale(0.08), pos(10, 50)]);
  add([text(seeds || 0), pos(60, 53)]);
  add([sprite("apple"), scale(0.1), pos(8, 100)]);
  add([text(apples || 0), pos(60, 110)]);
  add([sprite("banana", { flipX: true }), scale(0.09), pos(10, 152)]);
  add([text(bananas || 0), pos(60, 160)]);
  add([sprite("tomato"), scale(0.085), pos(10, 202.5)]);
  add([text(tomatoes || 0), pos(60, 210)]);
  // display users online
  online = add([
    text((polish ? "Użytkownicy online:" : "Users online:") + new_views, {
      size: phone ? 22 : 28,
    }),
    pos(10, height() - 32),
  ]);

  let left_arrow, right_arrow;
  function hamsters() {
    loadS("left_arrow", "images/menu/left_arrow.png");
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
    secondary == right_arrow &&
      secondary.onHoverUpdate(() => {
        setCursor("default");
        secondary.scale = vec2(-arrows_scale);
      });
  }
  // Bind the onClickArrow function to the arrow keys
  currentHamster !== "hamster2" && onKeyPress("left", () => left_arrow && handleArrowClick("white_"));
  currentHamster !== "hamster2" && onKeyPress("right", () => right_arrow && handleArrowClick());
  currentHamster !== "hamster2" && onClick("left_arrow", () => handleArrowClick("white_"));
  currentHamster !== "hamster2" && onClick("right_arrow", () => handleArrowClick());
  // Bind onClick and onKeyPress
  onClick("play_button", () => go("game"));
  onKeyPress("space", () => go("game"));
  onClick("hamsters_button", () => hamsters());

  onClick("shop_button", () => {
    if (!isScriptLoaded("shop.js")) {
      let script = document.createElement("script");
      script.src = "shop.js";
      script.onload = () => go("shop");
      document.head.appendChild(script);
    } else if (isScriptLoaded("shop.js")) {
      go("shop");
    }
  });
  onClick("info", () => {
    if (!isScriptLoaded("others/credits.js")) {
      let script = document.createElement("script");
      script.src = "others/credits.js";
      script.onload = () => display_info();
      document.head.appendChild(script);
    } else if (isScriptLoaded("others/credits.js")) {
      display_info();
    }
  });
  initialize_hamster();
  AddHamster();
  buttons();
  language_buttons();
});
go("menu");
