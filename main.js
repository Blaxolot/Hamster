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
loadSprite("dirt", "images/dirt.png");


loadSprite("drzewo1", "images/drzewo_1.png");
loadSprite("drzewo2", "images/drzewo2.png");
loadSprite("drzewo3", "images/drzewo3.png");
loadSprite("chmura", "images/chmura.png");

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

scene("game", () => {
  setBackground(0, 120, 180);
  let para = [fixed(), scale((width() + height()) / 180), anchor("botleft")]

  add([sprite("drzewo1"), ...para, pos(width() / 10, height() / 1.05)]);
  add([sprite("drzewo2"), ...para, pos(width() / 2.8, height() / 1.05)]);
  add([sprite("drzewo3"), ...para, pos(width() / 1.5, height() / 1.05)]);

  add([sprite("chmura"), fixed(), scale((width() + height()) / 180), anchor("center"), pos(width() / 2, height() / 2 - 180)]);


  !getSprite("banana") && loadSprite("banana", "images/banana.png");
  !getSprite("chocolate") && loadSprite("chocolate", "images/chocolate_bar.png");
  !getSprite("rotten_tomato") && loadSprite("rotten_tomato", "images/rotten_tomato.png");
  !getSprite("heart") && loadSprite("heart", "images/heart.png");

  !getSound("pickup") && loadSound("pickup", "sounds/pickup.wav");
  !getSound("jump") && loadSound("jump", "sounds/jump.wav");
  !getSound("negative") && loadSound("negative", "sounds/negative_beeps.mp3");
  !getSound("gameover") && loadSound("gameover", "sounds/gameover.mp3");
  !getSound("bonus") && loadSound("bonus", "sounds/bonus_heart.mp3");

  setCursor("default");
  // define gravity
  setGravity(GRAVITY);

  hamster_pos = phone ? 40 : 100;
  hamster_width = 105 / (phone ? 1.25 : 1);
  chocolate_scale = 75 / (phone ? 1.25 : 1);
  apple_scale = 80 / (phone ? 1.25 : 1);
  banana_scale = 70 / (phone ? 1.25 : 1);
  seed_scale = 50 / (phone ? 1.25 : 1);
  tomato_scale = 70 / (phone ? 1.25 : 1);
  rotten_tomato_scale = 70 / (phone ? 1.25 : 1);

  // add hamster
  const player = add([
    sprite("hamster", { width: hamster_width }),
    pos(hamster_pos, -65),
    anchor("center"),
    area({ scale: vec2(0.7, 1) }),
    body(),
  ]);

  // floor
  for (let x = 0; x < width(); x += 60) {
    add([
      pos(x, height()),
      sprite("dirt"),
      anchor("botleft"),
      area(),
      body({ isStatic: true }),
    ]);
  }

  function jump() {
    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
      play("jump");
    }
  }

  // jump when user press space, up or w or clicks
  onKeyPress(["space", "up", "w"], jump);
  onKeyDown(["space", "up", "w"], jump);
  onClick(jump);
  onMouseDown(jump);

  onKeyPress("escape", () => {
    let selected
    let box = add([
      rect(600, 300, { radius: 25 }),
      anchor("center"),
      pos(center()),
      color(0, 0, 0),
    ]);

    box.add([text("Do you want to quit?"), anchor("center"), pos(0, -100)]);
    box.add([
      text("!!! You will lose your food !!!"),
      scale(0.8),
      anchor("center"),
      pos(0, -50),
      color(255, 0, 0),
    ]);

    const yes = box.add([
      rect(200, 50, { radius: 10 }),
      pos(-150, 80),
      anchor("center"),
      color(0, 255, 0),
      area(),
      "yes",
    ]);
    const no = box.add([
      rect(200, 50, { radius: 10 }),
      pos(150, 80),
      anchor("center"),
      color(255, 0, 0),
      area(),
      "no",
    ]);
    yes.add([text("YES"), anchor("center"), color(0, 0, 0), scale(0.9), pos(0, 2)]);
    no.add([text("NO"), anchor("center"), color(0, 0, 0), scale(0.9), pos(0, 2)]);
    onClick("yes", () => { go("menu"), debug.paused = false; });
    onClick("no", () => { debug.paused = false, destroy(box); });
    onKeyPress("enter", () => {
      if (selected == "yes") { go("menu"), debug.paused = false }
      else if (selected == "no") { debug.paused = false, destroy(box) }
    })
    onKeyPress("left", () => { yes.outline = 1; no.outline = 0; selected = "yes" });
    onKeyPress("right", () => { no.outline = 1; yes.outline = 0; selected = "no" });
    debug.paused = true;
  })

  // Increase speed gradually
  loop(0.5, () => {
    SPEED += 1;
    GRAVITY += 0.5;
    setGravity(GRAVITY);
  });
  let food = ["chocolate", "seed", "apple", "banana", "tomato", "rotten_tomato"];
  let distance = "";
  function spawnFood() {
    let randomFood = choose(food)
    if (randomFood == "rotten_tomato") {
      if (!chance(0.5)) {
        do {
          randomFood = choose(food);
        } while (randomFood == "rotten_tomato");
      }
    }

    food_pos = randomFood == "chocolate" ? 65 : randi(65, 300);
    document.onkeyup = function (e) {
      var e = e || window.event; // for IE to cover IEs window object
      if (e.ctrlKey && e.shiftKey) {
        if (e.code == "Digit1") {
          food = ["apple"];
          distance = 0.1;
          return false;
        }
        else if (e.code == "Digit2") {
          food = ["chocolate"];
          distance = 0.25;
          return false;
        }
      }
    };

    add([
      sprite(randomFood, { width: window[randomFood + "_scale"] }),
      pos(width(), height() - food_pos),
      area(),
      anchor("botleft"),
      move(LEFT, SPEED),
      offscreen({ destroy: true }),
      randomFood,
    ]);

    // wait a random amount of time to spawn next Food
    wait(distance == "" ? rand(1, 2) : distance, spawnFood);
  }
  spawnFood();

  // keep track of score
  let seedScore = 0;
  let appleScore = 0;
  let bananaScore = 0;
  let tomatoScore = 0;
  let lives = 3;

  let foods = ["seed", "apple", "banana", "tomato"]
  foods.forEach(food => {
    player.onCollide(food, item => {
      play("pickup");
      destroy(item);
      eval(`${food}Score++`);
      eval(`${food}Text.text = ${food}Score`);
      console.log("mniam");
    });
  });

  player.onCollide("apple", () => {
    if (appleScore >= 10 && appleScore % 10 == 0) {
      lives += 1;
      play("bonus", { volume: 0.7 });

      for (let i = 1; i <= 1000; i++) {
        if (lives == i) {
          const heartWidth = 50; // The width of each heart slot
          // Calculate the number of hearts that can fit in one line
          const heartsPerLine = Math.floor(width() / heartWidth);
          // Calculate x and y position based on the current heart
          const xPos = width() - 5 - ((i - 1) % heartsPerLine) * heartWidth - heartWidth;
          const yPos = Math.floor((i - 1) / heartsPerLine) * heartWidth + 15;

          eval(`Live${i} = add([pos(xPos, yPos), sprite("heart"), scale(0.08)])`);
        }
      }
    }
  });

  player.onCollide("rotten_tomato", zepsuty_pomidor => {
    destroy(zepsuty_pomidor);
    play("negative");
    lives -= 1;

    destroy(eval("Live" + (lives + 1)));

    if (lives == 0) {
      go("menu");
      localStorage.setItem("seeds", +seedScore + +seeds);
      localStorage.setItem("apples", +appleScore + +apples);
      localStorage.setItem("bananas", +bananaScore + +bananas);
      localStorage.setItem("tomatoes", +tomatoScore + +tomatoes);

      SPEED = 350;
      play("gameover");
    }
    console.log("fu");
  });

  player.onCollide("chocolate", czekolada => {
    destroy(czekolada);
    play("negative");
    lives -= 1;

    destroy(eval("Live" + (lives + 1)));

    if (lives == 0) {
      go("menu");
      localStorage.setItem("seeds", seedScore + +seeds);
      localStorage.setItem("apples", appleScore + +apples);
      localStorage.setItem("bananas", bananaScore + +bananas);
      localStorage.setItem("tomatoes", tomatoScore + +tomatoes);

      SPEED = 350;
      play("gameover");
    }
    console.log("fu");
  });

  const seedText = add([text(seedScore), pos(65, 24)]);
  add([sprite("seed"), scale(0.08), pos(16, 20)]);
  const appleText = add([text(appleScore), pos(175, 24)]);
  add([sprite("apple"), scale(0.1), pos(120, 10)]);
  const bananaText = add([text(bananaScore), pos(65, 80)]);
  add([sprite("left_banana"), scale(0.1), pos(14, 75)]);
  const tomatoText = add([text(tomatoScore), pos(65, 136)]);
  add([sprite("tomato"), scale(0.085), pos(14, 130)]);
  let Live1 = add([sprite("heart"), pos(width() - 55, 15), scale(0.08)]);
  let Live2 = add([sprite("heart"), pos(width() - 105, 15), scale(0.08)]);
  let Live3 = add([sprite("heart"), pos(width() - 155, 15), scale(0.08)]);
});

let new_views = " "
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
    "info",
  ]);

  const play_button = add([
    rect(350, 75, { radius: 8 }),
    color(0, 100, 0),
    pos(width() / 2, height() / 2 + 220),
    area(),
    anchor("center"),
    outline(5),
    "play",
  ]);
  play_button.add([text("Play"), anchor("center"), color(0, 0, 0)]);
  const hamsters_button = add([
    rect(180, 40, { radius: 8 }),
    color(70, 70, 70),
    pos(width() / 2 - 65, height() / 2 + 285),
    area(),
    anchor("center"),
    outline(4.5),
    "hamsters",
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
    "shop",
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
  let left_arrow, right_arrow
  function hamsters() {
    loadSprite("left_arrow", "images/left_arrow.png");
    loadSprite("right_arrow", "images/right_arrow.png");
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
  onKeyPress("left", () => { getSprite("left_arrow") && handleArrowClick("white_") });
  onKeyPress("right", () => { getSprite("right_arrow") && handleArrowClick("") });
  onClick("left_arrow", () => { handleArrowClick("white_") });
  onClick("right_arrow", () => { handleArrowClick("") });

  onClick("play", () => go("game"));
  onKeyPress("space", () => go("game"));
  onClick("hamsters", () => hamsters());
  function isScriptLoaded(src) {
    return Array.from(document.getElementsByTagName('script')).some(script => script.src.includes(src));
  }

  onClick("shop", () => {
    if (!isScriptLoaded("shop.js")) {
      let script = document.createElement('script');
      script.src = "shop.js";
      script.onload = () => go("shop");
      document.head.appendChild(script);
    } else {
      go("shop");
    }
  });

  onClick("info", () => {
    if (!isScriptLoaded("credits.js")) {
      let script = document.createElement('script');
      script.src = "credits.js";
      script.onload = () => display_info();
      document.head.appendChild(script);
    } else {
      display_info();
    }
  });


});

go("menu");