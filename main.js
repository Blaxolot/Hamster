const phone = window.innerWidth <= 500;
const JUMP_FORCE = 800;
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
loadSprite("dirt", "images/dirt.png");

function updateLocalStorage() {
  seeds = localStorage.getItem("seeds");
  apples = localStorage.getItem("apples");
  bananas = localStorage.getItem("bananas");
  Wearing = localStorage.getItem("Wearing");
  Shoes = localStorage.getItem("Shoes");
  Winter_hat = localStorage.getItem("Winter_hat");
}

// Update the variables initially
updateLocalStorage();
function updateHamster() {
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
  loadSprite("banana", "images/banana.png");
  loadSprite("chocolate", "images/chocolate_bar.png");
  loadSprite("heart", "images/heart.png");

  loadSound("pickup", "sounds/pickup.wav");
  loadSound("jump", "sounds/jump.wav");
  loadSound("negative", "sounds/negative_beeps.mp3");
  loadSound("gameover", "sounds/gameover.mp3");
  loadSound("bonus", "sounds/bonus_heart.mp3");

  setCursor("default");
  // define gravity
  setGravity(GRAVITY);

  hamster_pos = phone ? 40 : 100;
  hamster_width = 105 / (phone ? 1.25 : 1);
  chocolate_scale = 75 / (phone ? 1.25 : 1);
  apple_scale = 80 / (phone ? 1.25 : 1);
  banana_scale = 70 / (phone ? 1.25 : 1);
  seed_scale = 50 / (phone ? 1.25 : 1);

  // add a game object to screen
  const player = add([
    sprite("hamster", { width: hamster_width }),
    pos(hamster_pos, 40),
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

  // jump when user press space, up or w
  onKeyPress(["space", "up", "w"], jump);
  onClick(jump);
  onKeyPress("escape", () => {
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
    debug.paused = true;
  })

  // Increase speed gradually
  loop(0.5, () => {
    SPEED += 1;
    GRAVITY += 0.5;
    setGravity(GRAVITY);
  });
  let food = ["chocolate", "seed", "apple", "banana"];
  let food_distance = "";
  function spawnItem() {
    const randomFood = choose(food);
    food_pos = randomFood == "chocolate" ? 65 : randi(65, 300);
    document.onkeyup = function (e) {
      var e = e || window.event; // for IE to cover IEs window object
      if (e.ctrlKey && e.shiftKey) {
        if (e.code == "Digit1") {
          food = ["apple"];
          food_distance = 0.1;
          return false;
        }
        else if (e.code == "Digit2") {
          food = ["chocolate"];
          food_distance = 0.25;
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

    // wait a random amount of time to spawn next Item
    wait(food_distance == "" ? rand(1, 2) : food_distance, spawnItem);
  }
  spawnItem();

  // keep track of score
  let seedScore = 0;
  let appleScore = 0;
  let bananaScore = 0;
  let lives = 3;

  function handleCollision(...foods) {
    foods.forEach(food => {
      player.onCollide(food, item => {
        play("pickup");
        destroy(item);
        eval(`${food}Score++`);
        eval(`${food}ScoreLabel.text = ${food}Score`);
        console.log("mniam");
      });
    });
  }

  handleCollision("seed", "apple", "banana");

  player.onCollide("apple", () => {
    if (appleScore >= 10 && appleScore % 10 == 0) {
      lives += 1;
      play("bonus", { volume: 0.7 });

      for (let i = 1; i <= 1000; i++) {
        if (lives == i) {
          const heartWidth = 50;  // The width of each heart slot
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


  player.onCollide("chocolate", czekolada => {
    destroy(czekolada);
    play("negative");
    lives -= 1;

    destroy(eval("Live" + (lives + 1)));

    if (lives == 0) {
      go("menu");
      localStorage.setItem("seeds", +seedScore + +seeds);
      localStorage.setItem("apples", +appleScore + +apples);
      localStorage.setItem("bananas", +bananaScore + +bananas);
      SPEED = 350;
      play("gameover");
    }
    console.log("fu");
  });

  const seedScoreLabel = add([text(seedScore), pos(65, 24)]);
  add([sprite("seed"), scale(0.08), pos(16, 20)]);
  const appleScoreLabel = add([text(appleScore), pos(175, 24)]);
  add([sprite("apple"), scale(0.1), pos(120, 10)]);
  const bananaScoreLabel = add([text(bananaScore), pos(65, 80)]);
  add([sprite("left_banana"), scale(0.1), pos(14, 75)]);
  let Live1 = add([sprite("heart"), pos(width() - 55, 15), scale(0.08)]);
  let Live2 = add([sprite("heart"), pos(width() - 105, 15), scale(0.08)]);
  let Live3 = add([sprite("heart"), pos(width() - 155, 15), scale(0.08)]);
});

let new_views = "";
let online;

function Users_online(views) {
  new_views = views;
  online.text = "Users online:" + new_views;
}

scene("menu", () => {
  updateLocalStorage();
  hamster_width = phone ? 250 : 285;
  Hamster_text_size = phone ? 0.01 : 100;
  Shop_text_size = phone ? 0.01 : 70;
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
  function shop() {
    loadSprite("cap", "images/cap.png");
    loadSprite("shoes", "images/hamster_shoes.png");
    loadSprite("winter_hat", "images/winter_hat.png");
    background = add([rect(width(), height()), color(50, 50, 50), z(1)]);
    background.add([
      text("Shop", { size: Shop_text_size }),
      anchor("center"),
      pos(width() / 2, 50),
    ]);
    // Cap
    const cap_box = background.add([
      rect(200, 200, { radius: 15 }),
      pos(20, 20),
      color(100, 100, 100),
    ]);
    cap_box.add([sprite("seed"), scale(0.08), pos(15, 10)]);
    cap_box.add([text("10"), scale(0.9), pos(60, 13)]);
    cap_box.add([sprite("apple"), scale(0.085), pos(115, 5)]);
    cap_box.add([text("5"), scale(0.9), pos(160, 13)]);
    cap_box.add([sprite("cap"), scale(0.25), pos(36, 35)]);
    // Shoes
    const shoes_box = background.add([
      rect(200, 200, { radius: 15 }),
      pos(20, 240),
      color(100, 100, 100),
    ]);
    shoes_box.add([sprite("seed"), scale(0.08), pos(15, 10)]);
    shoes_box.add([text("5    5"), scale(0.9), pos(60, 13)]);
    shoes_box.add([sprite("left_banana"), scale(0.085), pos(113, 5)]);
    shoes_box.add([sprite("shoes"), scale(0.2), pos(49, 45)]);
    // Winter hat
    const winter_hat_box = background.add([
      rect(200, 200, { radius: 15 }),
      pos(240, 20),
      color(100, 100, 100),
    ]);
    winter_hat_box.add([sprite("left_banana"), scale(0.085), pos(10, 5)]);
    winter_hat_box.add([text("10"), scale(0.9), pos(55, 13)]);
    winter_hat_box.add([sprite("apple"), scale(0.085), pos(105, 5)]);
    winter_hat_box.add([text("10"), scale(0.9), pos(150, 13)]);
    winter_hat_box.add([sprite("winter_hat"), scale(0.22), pos(43, 40)]);

    const items = ["cap", "shoes", "winter_hat"];
    const itemConditions = {
      cap: { key: "93rfDw", value: "#%1d8*f@4p", var: "Wearing" },
      shoes: { key: "Sk@3o&", value: "%01ns#9p", var: "Shoes" },
      winter_hat: { key: "G8*m&a", value: "W%*hjk", var: "Winter_hat" },
    };
    const itemPricing = {
      cap: { food1: "seeds", food2: "apples", price1: 10, price2: 5 },
      shoes: { food1: "seeds", food2: "bananas", price1: 5, price2: 5 },
      winter_hat: { food1: "bananas", food2: "apples", price1: 10, price2: 10 },
    }

    items.forEach(item => {
      const condition = itemConditions[item];
      if (localStorage.getItem(condition.key) == condition.value) {
        const status = eval(condition.var) == "True";

        eval(`${item}_text = status ? "Wearing" : "Wear"`);
        eval(`buy_${item}_button_color = status ? rgb(0, 160, 0) : rgb(200, 0, 0)`);
        eval(`buy_${item}_text_scale = status ? 0.6 : 0.7`);

      } else {
        const { food1, food2, price1, price2 } = itemPricing[item];
        const con = eval(food1) < price1 || eval(food2) < price2;

        eval(`${item}_text = "Buy"`);
        eval(`buy_${item}_button_color = con ? rgb(250, 25, 25) : rgb(0, 200, 0)`);
        eval(`buy_${item}_text_scale = 0.7`);
      }
    });

    function set(item, Wearing_or_Wear) {
      eval(`${item}_text = "${Wearing_or_Wear}"`);
      Wear = rgb(200, 0, 0);
      Wearing = rgb(0, 160, 0);
      eval(`buy_${item}.color = ${Wearing_or_Wear}`);
      eval(`buy_${item}_text.text = ${item}_text`);
      Wear = 0.7, Wearing = 0.6;
      eval(`buy_${item}_text.scale = ${Wearing_or_Wear}`);

      localStorage.setItem(
        item == "cap" ? "Wearing" : item == "shoes" ? "Shoes" : "Winter_hat",
        Wearing_or_Wear == "Wearing" ? "True" : "False");
    }

    items.forEach(item => {
      window[`buy_${item}`] = eval(`${item}_box`).add([
        rect(100, 35, { radius: 8 }),
        color(window[`buy_${item}_button_color`]),
        pos(100, 175),
        area(),
        anchor("center"),
        outline(4.5),
        "buy_" + item,
      ]);

      window[`buy_${item}_text`] = window[`buy_${item}`].add([
        text(window[`${item}_text`]),
        anchor("center"),
        scale(window[`buy_${item}_text_scale`]),
        color(0, 0, 0),
      ]);

      window[`buy_${item}`].onHoverUpdate(() => {
        window[`buy_${item}`].scale = vec2(1.025);
        setCursor("pointer");
      });
      window[`buy_${item}`].onHoverEnd(() => {
        window[`buy_${item}`].scale = vec2(1);
        setCursor("default");
      });
    });

    x = background.add([
      text("x"),
      area(),
      pos(width() - 50, 15),
      color(150, 150, 150),
      "x",
    ]);
    x.onHoverUpdate(() => {
      x.color = rgb(240, 240, 240)
      setCursor("pointer");
    });
    x.onHoverEnd(() => {
      x.color = rgb(150, 150, 150)
      setCursor("default");
    });

    items.forEach((item) => {
      const { food1, food2, price1, price2 } = itemPricing[item];
      const { key, value } = itemConditions[item];

      onClick(`buy_${item}`, () => {
        item_text = eval(item + "_text");
        item_text == "Wear" && set(item, "Wearing") ||
          item_text == "Wearing" && set(item, "Wear");

        if (eval(food1) >= price1 && eval(food2) >= price2) {
          if (localStorage.getItem(key) !== value) {
            localStorage.setItem(key, value);
            localStorage.setItem(food1, eval(food1) - price1);
            localStorage.setItem(food2, eval(food2) - price2);
            set(item, "Wearing");
          }
        } else if (localStorage.getItem(key) !== value) {
          if (eval(food1) < price1 || eval(food2) < price2) {
            alert(`You don't have enough ${food1} and ${food2}`);
          }
        }
      });
    });

    onKeyPress("escape", () => {
      updateLocalStorage();
      loadSprite("hamster", `images/${updateHamster()}.png`);
      go("menu");
    });
    onClick("x", () => {
      updateLocalStorage();
      loadSprite("hamster", `images/${updateHamster()}.png`);
      go("menu");
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
  onClick("shop", () => shop());
  onClick("info", () => display_info());
});

go("menu");
