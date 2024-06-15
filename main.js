const phone = window.innerWidth <= 500;
const JUMP_FORCE = 800;
let SPEED = 350;
let GRAVITY = 1250;
// initialize context
kaboom({
  width: window.innerWidth,
  height: window.innerHeight,
});
// load assets
loadSprite("seed", "images/seed.png");
loadSprite("apple", "images/apple.png");
loadSprite("banana", "images/banana.png");
loadSprite("chocolate", "images/chocolate_bar.png");
loadSprite("heart", "images/heart.png");
loadSprite("dirt", "images/dirt.png");
loadSprite("left_arrow", "images/left_arrow.png");
loadSprite("right_arrow", "images/right_arrow.png");
loadSprite("left_banana", "images/left_banana.png");
loadSprite("cap", "images/cap.png");
loadSprite("shoes", "images/hamster_shoes.png");
loadSprite("winter_hat", "images/winter_hat.png");

loadSound("pickup", "sounds/pickup.wav");
loadSound("jump", "sounds/jump.wav");
loadSound("negative", "sounds/negative_beeps.mp3");
loadSound("gameover", "sounds/gameover.mp3");
loadSound("bonus", "sounds/bonus_heart.mp3");
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
  // define gravity
  setGravity(GRAVITY);

  hamster_pos = phone ? 0 : 60;
  hamster_width = phone ? 90 : 105;
  chocolate_scale = phone ? 0.12 : 0.15;
  apple_scale = phone ? 0.12 : 0.16;
  banana_scale = phone ? 0.11 : 0.14;
  seed_scale = phone ? 0.09 : 0.1;
  // add a game object to screen
  const player = add([
    sprite("hamster", { width: hamster_width }),
    pos(hamster_pos, 40),
    area(),
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

  // jump when user press space
  onKeyPress("space", jump);
  onKeyPress("up", jump);
  onKeyPress("w", jump);
  onClick(jump);
  // Increase speed gradually
  loop(0.5, () => {
    SPEED += 1;
    GRAVITY += 0.5;
    setGravity(GRAVITY);
  });
  let food = ["chocolate", "seed", "apple", "banana"];
  let food_distance = "";
  function spawnItem() {
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
  
    const randomFood = food[Math.floor(Math.random() * food.length)];

    food_pos = randomFood == "chocolate" ? 65 : randi(65, 300);
    add([
      sprite(randomFood),
      scale(window[randomFood + "_scale"]),
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
      play("bonus");

      for (let i = 1; i <= 1000; i++) {
        if (lives == i) {
          eval(`Live${i} = add([
            pos(width() - 50 * i - 5, 15),
            sprite("heart"), scale(0.08)
          ])`);
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
let Credits; // Declare Credits in the global scope

function display_info() {
  if (!Credits) {
    Credits = add([
      rect(650, 650, { radius: 8 }),
      color(0, 0, 0),
      opacity(0.8),
      pos(center()),
      area(),
      anchor("center"),
      outline(5),
      "credits",
    ]);
    parameters = [anchor("center"), color(255, 255, 255), scale(0.6)];
    Credits.add([
      text("Icon Credits"),
      anchor("center"),
      pos(0, -260),
      color(255, 255, 255),
    ]);
    const icons_Credits = [
      "Hamster Icon created by Freepik - Flaticon",
      "Seed Icon created by Smashicons - Flaticon",
      "Apple Icon created by Smashicons - Flaticon",
      "Heart Icon created by Pixel perfect - Flaticon",
      "Chocolate Bar Icon created by Iconic Panda",
      "- Flaticon",
      "Arrow Icons created by Freepik - Flaticon",
      "Banana Icon created by juicy_fish - Flaticon",
      "Cap Icon created by juicy_fish - Flaticon",
    ];

    let posY = -220; // Initial vertical position

    icons_Credits.forEach(Text => {
      const gap = Text == "- Flaticon" || Text.includes("Chocolate") ? 30 : 40;
      Credits.add([text(Text), pos(0, posY), ...parameters]); // Add text
      posY += gap; // Increment posY by 30 or 40 based on the text
    });

    Credits.add([
      text("x"),
      anchor("center"),
      area(),
      pos(-305, -305),
      color(150, 150, 150),
      scale(0.8),
      "x",
    ]);
  }

  onClick("x", () => {
    go("menu");
    Credits = null;
  });
  onKeyPress("escape", () => {
    go("menu");
    Credits = null;
  });
}
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
    color(0, 0, 0),
  ]);
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
    color(0, 0, 0),
  ]);
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

  function hamsters() {
    add([
      sprite("left_arrow"),
      scale(arrows_scale),
      pos(width() / 2 - arrows, height() / 2),
      area(),
      anchor("center"),
      "left_arrow",
    ]);
    add([
      sprite("right_arrow"),
      scale(arrows_scale),
      pos(width() / 2 + arrows, height() / 2),
      area(),
      anchor("center"),
      "right_arrow",
    ]);
  }
  function shop() {
    background = add([rect(width(), height()), color(50, 50, 50)]);
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

    items.forEach(item => {
      const condition = itemConditions[item];
      if (localStorage.getItem(condition.key) == condition.value) {
        const status = eval(condition.var) == "True";

        eval(`${item}_text = status ? "Wearing" : "Wear"`);
        eval(`buy_${item}_button_color = status ? rgb(0, 160, 0) : rgb(200, 0, 0)`);
        eval(`buy_${item}_text_scale = status ? 0.6 : 0.7`);

      } else {
        cap = [seeds, apples, 10, 5];
        shoes = [seeds, bananas, 5, 5];
        winter_hat = [bananas, apples, 10, 10];

        const [food1, food2, number1, number2] = eval(item);
        const con = food1 < number1 || food2 < number2;

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
      (Wear = 0.7), (Wearing = 0.6);
      eval(`buy_${item}_text.scale = ${Wearing_or_Wear}`);

      localStorage.setItem(
        item == "cap" ? "Wearing" : item == "shoes" ? "Shoes" : "Winter_hat",
        Wearing_or_Wear == "Wearing" ? "True" : "False");
    }

    function toggleItemStatus(item, text) {
      text == "Wear" && set(item, "Wearing") || text == "Wearing" && set(item, "Wear");
    }

    onClick("buy_cap", () => toggleItemStatus("cap", cap_text));
    onClick("buy_shoes", () => toggleItemStatus("shoes", shoes_text));
    onClick("buy_winter_hat", () =>
      toggleItemStatus("winter_hat", winter_hat_text)
    );
    items.forEach(item => {
      window[`buy_${item}`] = eval(`${item}_box`).add([
        rect(100, 35, { radius: 8 }),
        color(window[`buy_${item}_button_color`]),
        pos(100, 175),
        area(),
        anchor("center"),
        outline(4.5),
        ("buy_" + item),
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

    background.add([
      text("x"),
      area(),
      pos(width() - 50, 15),
      color(150, 150, 150),
      "x",
    ]);

    onClick("buy_cap", () => {
      if (seeds >= 10 && apples >= 5) {
        if (localStorage.getItem("93rfDw") !== "#%1d8*f@4p") {
          localStorage.setItem("93rfDw", "#%1d8*f@4p");
          localStorage.setItem("seeds", seeds - 10);
          localStorage.setItem("apples", apples - 5);
          set("cap", "Wearing");
        }
      } else if (
        (seeds < 10 && localStorage.getItem("93rfDw") !== "#%1d8*f@4p") ||
        (apples < 5 && localStorage.getItem("93rfDw") !== "#%1d8*f@4p")
      ) {
        alert("You don't have enough seeds and apples");
      }
    });
    onClick("buy_shoes", () => {
      if (seeds >= 5 && bananas >= 5) {
        if (localStorage.getItem("Sk@3o&") !== "%01ns#9p") {
          localStorage.setItem("Sk@3o&", "%01ns#9p");
          localStorage.setItem("seeds", seeds - 5);
          localStorage.setItem("bananas", bananas - 5);
          set("shoes", "Wearing");
        }
      } else if (
        (seeds < 5 && localStorage.getItem("Sk@3o&") !== "%01ns#9p") ||
        (bananas < 5 && localStorage.getItem("Sk@3o&") !== "%01ns#9p")
      ) {
        alert("You don't have enough seeds and bananas");
      }
    });
    onClick("buy_winter_hat", () => {
      if (bananas >= 10 && apples >= 10) {
        if (localStorage.getItem("G8*m&a") !== "W%*hjk") {
          localStorage.setItem("G8*m&a", "W%*hjk");
          localStorage.setItem("bananas", bananas - 10);
          localStorage.setItem("apples", apples - 10);
          set("winter_hat", "Wearing");
        }
      } else if (
        (bananas < 10 && localStorage.getItem("G8*m&a") !== "W%*hjk") ||
        (apples < 10 && localStorage.getItem("G8*m&a") !== "W%*hjk")
      ) {
        alert("You don't have enough bananas and apples");
      }
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

  function onClickArrow(direction, white) {
    onClick(direction + "_arrow", () => {
      hamster = updateHamster();
      add([
        sprite(loadSprite("hamster", `images/${white + hamster}.png`), {
          width: hamster_width,
        }),
        pos(center()),
        anchor("center"),
      ]);
    });
  }
  onClick("play", () => go("game"));
  onKeyPress("space", () => go("game"));
  onClick("hamsters", () => hamsters());
  onClick("shop", () => shop());
  onClickArrow("left", "white_");
  onClickArrow("right", "");
  onClick("info", () => display_info());
});

go("menu");
