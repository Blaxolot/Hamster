// load assets
loadSprite("poland", "images/menu/poland.png");
loadSprite("usa", "images/menu/united-states.png");
loadSprite("statistics", "images/menu/statistics.png");
// load hamster and accessories
loadSprite(updateHamster(), `images/menu/${updateHamster()}.png`);
cap && loadSprite("cap", "images/menu/cap.png");
winter_hat && loadSprite("winter_hat", "images/menu/winter_hat.png");
glasses && loadSprite("glasses", "images/menu/glasses.png");

let new_views = 1;
let online;

function Users_online(views) {
  new_views = views || 1;
  online.text = (polish ? "Użytkownicy" : "Users") + " online:" + new_views;
}
scene("menu", () => {
  isMenu = true;
  Credits = null;
  Statistics = null;
  setCursor("default");
  setBackground(50, 50, 50);
  updateLocalStorage();
  arrows = phone ? 130 : 200;
  arrows_scale = phone ? 0.2 : 0.25;
  info_x = phone ? 35 : 40;
  // refresh on resize
  window.addEventListener(
    "resize",
    debounce(() => {
      isMenu == true && go("menu");
    }),
  );

  // display score
  add([text(polish ? "Zebrano:" : "Collected:"), pos(10, 10)]);
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
  const arrows_color = LIGHT_GRAY;
  function hamsters() {
    loadS("left_arrow", "images/menu/left_arrow.png");
    if (!left_arrow && !right_arrow) {
      left_arrow = add([
        sprite("left_arrow"),
        scale(arrows_scale),
        pos(width() / 2 - arrows, height() / 2),
        area(),
        color(arrows_color),
        anchor("center"),
        "left_arrow",
      ]);
      right_arrow = add([
        sprite("left_arrow"),
        scale(-arrows_scale),
        pos(width() / 2 + arrows, height() / 2),
        area(),
        color(arrows_color),
        anchor("center"),
        opacity(0.25),
        "right_arrow",
      ]);
    }
    MyHover(left_arrow, arrows_scale + 0.01, arrows_scale, WHITE, arrows_color);
  }
  function handleArrowClick(white) {
    AddHamster(white);
    const primary = white !== undefined ? right_arrow : left_arrow;
    const secondary = white !== undefined ? left_arrow : right_arrow;
    primary.opacity = 1;
    secondary.opacity = 0.25;
    MyHover(primary, arrows_scale + 0.01, arrows_scale, WHITE, arrows_color);
    secondary.onHoverUpdate(() => {
      setCursor("default");
      secondary.scale = vec2(arrows_scale);
      secondary.color = arrows_color;
    });
    primary == right_arrow &&
      MyHover(right_arrow, -arrows_scale - 0.01, -arrows_scale);
    secondary == right_arrow &&
      secondary.onHoverUpdate(() => {
        setCursor("default");
        secondary.scale = vec2(-arrows_scale);
        secondary.color = arrows_color;
      });
  }
  // Bind the onClickArrow function to the arrow keys
  currentHamster !== "hamster2" &&
    onKeyPress("left", () => left_arrow && handleArrowClick("white_"));
  currentHamster !== "hamster2" &&
    onKeyPress("right", () => right_arrow && handleArrowClick());
  currentHamster !== "hamster2" &&
    onClick("left_arrow", () => handleArrowClick("white_"));
  currentHamster !== "hamster2" &&
    onClick("right_arrow", () => handleArrowClick());
  // Bind onClick and onKeyPress
  onClick("play_button", () => go("game"));
  onKeyPress("space", () => go("game"));
  onClick("hamsters_button", () => hamsters());

  onClick("shop_button", () => {
    const shop_script = "shop/main.js";
    if (!isScriptLoaded(shop_script)) {
      const script = document.createElement("script");
      script.src = shop_script;
      script.onload = () => go("shop");
      document.head.appendChild(script);
    } else if (isScriptLoaded(shop_script)) {
      go("shop");
    }
  });
  onClick("info", () => {
    const info_script = "menu/credits.js";
    if (Statistics == null) {
      if (!isScriptLoaded(info_script)) {
        const script = document.createElement("script");
        script.src = info_script;
        script.onload = () => display_info();
        document.head.appendChild(script);
      } else if (isScriptLoaded(info_script)) {
        display_info();
      }
    }
  });
  onClick("stats_button", () => {
    const stats_script = "menu/statistics.js";
    if (Credits == null) {
      if (!isScriptLoaded(stats_script)) {
        const script = document.createElement("script");
        script.src = stats_script;
        script.onload = () => display_stats();
        document.head.appendChild(script);
      } else if (isScriptLoaded(stats_script)) {
        display_stats();
      }
    }
  });
  initialize_hamster();
  AddHamster();
  buttons();
  language_buttons();
});
go("menu");
