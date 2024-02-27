const FLOOR_HEIGHT = 50;
const JUMP_FORCE = 800;
let SPEED = 350;
// initialize context
kaboom();
// load assets
let hamster = loadSprite("hamster", "assets/hamster.png");
loadSprite("seed", "assets/seed.png");
loadSprite("chocolate", "assets/chocolate-bar.png");
loadSprite("heart", "assets/heart.png");
loadSprite("apple", "assets/apple.png");
loadSprite("homik", "assets/Dirt.png");
loadSprite("left_arrow", "assets/left_arrow.png");
loadSprite("right_arrow", "assets/right_arrow.png");
loadSprite("banana", "assets/banana.png");
loadSprite("hello", "assets/hello.png");
loadSprite("cap", "assets/cap.png");

loadSound("pickup", "assets/pickup.wav");
loadSound("jump", "assets/jump.wav");
loadSound("negative", "assets/negative_beeps.mp3");
loadSound("gameover", "assets/gameover.mp3");
loadSound("bonus", "assets/bonus_heart.mp3");

setBackground(50, 50, 50);
if (localStorage.getItem("Wearing") == "True") {
  hamster = loadSprite("hamster", "assets/hamstercap.png");
}
if (localStorage.getItem("Wearing") == "False") {
  hamster = loadSprite("hamster", "assets/hamster.png");
}

scene("game", () => {
  // define gravity
  let GRAVITY = 1250;
  setGravity(GRAVITY);

  // add a game object to screen
  const player = add([
    // list of components
    sprite("hamster"),
    pos(80, 40),
    scale(0.2),
    area(),
    body(),
  ]);

  // floor
  for (let x = 0; x < width(); x += 60) {
    add([
      pos(x, height()),
      sprite("homik"),
      anchor("botleft"),
      area(),
      body({ isStatic: true }),
    ]);
  }

  function jump() {
    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
      play("jump", {
        loop: false,
      });
    }
  }

  // jump when user press space
  onKeyPress("space", jump);
  onKeyPress("up", jump);
  onClick(jump);
  // Increase speed gradually
  function increaseSpeed() {
    SPEED += 1;
    GRAVITY += 0.5;
    setGravity(GRAVITY);
  }
  // Increase speed gradually
  loop(0.5, () => {
    increaseSpeed();
  });
  function spawnItem() {
    const number = randi(5);
    if (number == 1) {
      add([
        sprite("chocolate"),
        area(),
        pos(width(), height() - 65),
        scale(0.15),
        anchor("botleft"),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        "Chocolate",
      ]);
    } else if (number == 2) {
      add([
        sprite("apple"),
        area(),
        pos(width(), height() - randi(65, 300)),
        scale(0.16),
        anchor("botleft"),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        "apple",
      ]);
    } else if (number == 3) {
      add([
        sprite("banana"),
        area(),
        pos(width(), height() - randi(65, 300)),
        scale(0.14),
        anchor("botleft"),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        "banana",
      ]);
    } else {
      add([
        sprite("seed"),
        area(),
        pos(width(), height() - randi(65, 300)),
        anchor("botleft"),
        move(LEFT, SPEED),
        scale(0.1),
        offscreen({ destroy: true }),
        "seed",
      ]);
    }

    // wait a random amount of time to spawn next Item
    wait(rand(1.5, 2), spawnItem);
  }
  spawnItem();

  // keep track of score
  let seedScore = 0;
  let appleScore = 0;
  let bananaScore = 0;
  let lives = 3;

  // lose if player collides with any game obj with tag "seed"
  player.onCollide("seed", orzech => {
    play("pickup", {
      loop: false,
    });
    destroy(orzech);
    seedScore++;
    seedscoreLabel.text = seedScore;
    console.log("mniam");
  });

  let bonusLive10;
  let bonusLive9;
  let bonusLive8;
  let bonusLive7;
  let bonusLive6;
  let bonusLive5;
  let bonusLive4;
  let bonusLive3;
  let bonusLive2;
  let bonusLive1;

  player.onCollide("apple", jabuszko => {
    play("pickup", {
      loop: false,
    });
    destroy(jabuszko);
    appleScore++;
    appleScoreLabel.text = appleScore;
    console.log("mniam");
    if ([10, 20, 30, 40, 50, 60, 70, 80, 90, 100].includes(appleScore)) {
      lives += 1;
      play("bonus", {
        loop: false,
      });
      parameters = [sprite("heart"), scale(0.08)];
      if (lives == 10) {
        bonusLive10 = add([pos(width() - 505, 15), ...parameters]);
      }
      if (lives == 9) {
        bonusLive9 = add([pos(width() - 455, 15), ...parameters]);
      }
      if (lives == 8) {
        bonusLive8 = add([pos(width() - 405, 15), ...parameters]);
      }
      if (lives == 7) {
        bonusLive7 = add([pos(width() - 355, 15), ...parameters]);
      }
      if (lives == 6) {
        bonusLive6 = add([pos(width() - 305, 15), ...parameters]);
      }
      if (lives == 5) {
        bonusLive5 = add([pos(width() - 255, 15), ...parameters]);
      }
      if (lives == 4) {
        bonusLive4 = add([pos(width() - 205, 15), ...parameters]);
      }
      if (lives == 3) {
        bonusLive3 = add([pos(width() - 155, 15), ...parameters]);
      }
      if (lives == 2) {
        bonusLive2 = add([pos(width() - 105, 15), ...parameters]);
      }
      if (lives == 1) {
        bonusLive1 = add([pos(width() - 55, 15), ...parameters]);
      }
    }
  });

  player.onCollide("Chocolate", czekolada => {
    destroy(czekolada);
    play("negative", {
      loop: false,
    });
    lives -= 1;

    // Check and destroy bonus hearts based on the number of lives
    if (lives == 9 && bonusLive10) {
      destroy(bonusLive10);
      bonusLive10 = undefined;
    }
    if (lives == 8 && bonusLive9) {
      destroy(bonusLive9);
      bonusLive9 = undefined;
    }
    if (lives == 7 && bonusLive8) {
      destroy(bonusLive8);
      bonusLive8 = undefined;
    }
    if (lives == 6 && bonusLive7) {
      destroy(bonusLive7);
      bonusLive7 = undefined;
    }
    if (lives == 5 && bonusLive6) {
      destroy(bonusLive6);
      bonusLive6 = undefined;
    }
    if (lives == 4 && bonusLive5) {
      destroy(bonusLive5);
      bonusLive5 = undefined;
    }
    if (lives == 3 && bonusLive4) {
      destroy(bonusLive4);
      bonusLive4 = undefined;
    }
    if (lives == 2 && bonusLive3) {
      destroy(bonusLive3);
      bonusLive3 = undefined;
    }
    if (lives == 1 && bonusLive2) {
      destroy(bonusLive2);
      bonusLive2 = undefined;
    }
    if (lives == 0 && bonusLive1) {
      destroy(bonusLive1);
      bonusLive1 = undefined;
    }
    if (lives == 2) {
      destroy(Live3);
    }
    if (lives == 1) {
      destroy(Live2);
    }
    if (lives == 0) {
      destroy(Live1);
    }

    if (lives == -1) {
      go("menu");
      seeds = localStorage.getItem("seeds");
      apples = localStorage.getItem("apples");
      bananas = localStorage.getItem("bananas");
      localStorage.setItem("seeds", +seedScore + +seeds);
      localStorage.setItem("apples", +appleScore + +apples);
      localStorage.setItem("bananas", +bananaScore + +bananas);
      SPEED = 350;
    }
  });
  player.onCollide("banana", banan => {
    play("pickup", {
      loop: false,
    });
    destroy(banan);
    bananaScore++;
    bananaScoreLabel.text = bananaScore;
    console.log("mniam");
  });

  const seedscoreLabel = add([text(seedScore), pos(65, 24)]);
  add([sprite("seed"), scale(0.08), pos(16, 20)]);
  const appleScoreLabel = add([text(appleScore), pos(175, 24)]);
  add([sprite("apple"), scale(0.1), pos(120, 10)]);
  const bananaScoreLabel = add([text(bananaScore), pos(65, 80)]);
  add([sprite("hello"), scale(0.1), pos(14, 75)]);
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
    Credits.add([
      text("Hamster Icon created by Freepik - Flaticon"),
      pos(0, -220),
      ...parameters,
    ]);
    Credits.add([
      text("Seed Icon created by Smashicons - Flaticon"),
      pos(0, -180),
      ...parameters,
    ]);
    Credits.add([
      text("Apple Icon created by Smashicons - Flaticon"),
      pos(0, -140),
      ...parameters,
    ]);
    Credits.add([
      text("Heart Icon created by Pixel perfect"),
      pos(0, -100),
      ...parameters,
    ]);
    Credits.add([
      text("Chocolate Bar Icon created by Iconic Panda"),
      pos(0, -60),
      ...parameters,
    ]);
    Credits.add([text("- Flaticon"), pos(0, -30), ...parameters]);
    Credits.add([
      text("Arrow Icons created by Freepik - Flaticon"),
      pos(0, 0),
      ...parameters,
    ]);
    Credits.add([
      text("Banana Icon created by juicy_fish - Flaticon"),
      pos(0, 40),
      ...parameters,
    ]);
    Credits.add([
      text("Cap Icon created by juicy_fish - Flaticon"),
      pos(0, 80),
      ...parameters,
    ]);
    Credits.add([
      text("x"),
      anchor("center"),
      area(),
      pos(-305, -305),
      color(150, 150, 150),
      scale(0.8),
      "x",
    ]);

    onClick("x", () => {
      destroy(Credits);
      Credits = null; // Reset Credits variable after destroying
    });
  }
}
scene("menu", () => {
  let hamster = add([
    sprite("hamster"),
    pos(width() / 2, height() / 2),
    scale(0.55),
    anchor("center"),
  ]);

  // display Hamster
  add([
    text("Hamster", { size: 100 }),
    pos(width() / 2, height() / 2 + -230),
    anchor("center"),
  ]);

  // display score
  add([text("You have:"), pos(10, 10)]);
  add([sprite("seed"), scale(0.08), pos(10, 50)]);
  add([text(localStorage.getItem("seeds") || 0), pos(60, 53)]);
  add([sprite("apple"), scale(0.09), pos(8, 100)]);
  add([text(localStorage.getItem("apples") || 0), pos(60, 110)]);
  add([sprite("hello"), scale(0.09), pos(10, 150)]);
  add([text(localStorage.getItem("bananas") || 0), pos(60, 160)]);

  // display credits
  const info = add([
    text("i"),
    area(),
    pos(width() - 60, height() - 55),
    color(140, 140, 140),
    "info",
  ]);

  const play_button = add([
    rect(350, 75, { radius: 8 }),
    color(0, 0, 255),
    pos(width() / 2, height() / 2 + 220),
    area(),
    anchor("center"),
    outline(5),
    "play",
  ]);
  const hamsters_button = add([
    rect(180, 40, { radius: 8 }),
    color(70, 70, 70),
    pos(width() / 2 - 65, height() / 2 + 285),
    area(),
    anchor("center"),
    outline(4.5),
    "hamsters",
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
  play_button.add([text("Play"), anchor("center"), color(0, 0, 0)]);
  play_button.onHoverUpdate(() => {
    play_button.color = rgb(10, 100, 10);
    play_button.scale = vec2(1.025);
    setCursor("pointer");
  });
  play_button.onHoverEnd(() => {
    play_button.scale = vec2(1);
    play_button.color = rgb(0, 0, 255);
    setCursor("default");
  });
  hamsters_button.add([
    text("Hamsters", { size: 30 }),
    anchor("center"),
    color(0, 0, 0),
  ]);
  shop_button.add([
    text("Shop", { size: 30 }),
    anchor("center"),
    color(0, 0, 0),
  ]);
  hamsters_button.onHoverUpdate(() => {
    hamsters_button.color = rgb(60, 60, 60);
    hamsters_button.scale = vec2(1.02);
    setCursor("pointer");
  });
  hamsters_button.onHoverEnd(() => {
    hamsters_button.scale = vec2(1);
    hamsters_button.color = rgb(70, 70, 70);
    setCursor("default");
  });
  shop_button.onHoverUpdate(() => {
    shop_button.color = rgb(60, 60, 60);
    shop_button.scale = vec2(1.02);
    setCursor("pointer");
  });
  shop_button.onHoverEnd(() => {
    shop_button.scale = vec2(1);
    shop_button.color = rgb(70, 70, 70);
    setCursor("default");
  });

  info.onHoverUpdate(() => {
    info.color = rgb(255, 255, 250);
    setCursor("pointer");
  });
  info.onHoverEnd(() => {
    info.color = rgb(140, 140, 140);
    setCursor("default");
  });
  function hamsters() {
    left_arrow = add([
      sprite("left_arrow"),
      scale(0.2),
      pos(width() / 2 - 200, height() / 2),
      area(),
      anchor("center"),
      "left-arrow",
    ]);
    right_arrow = add([
      sprite("right_arrow"),
      scale(0.2),
      pos(width() / 2 + 200, height() / 2),
      area(),
      anchor("center"),
      "right-arrow",
    ]);
  }
  function shop() {
    let background = add([rect(width(), height()), color(50, 50, 50)]);
    background.add([
      text("Shop", { size: 70 }),
      anchor("center"),
      pos(width() / 2, height() / 2 - 300),
    ]);
    background.add([
      rect(200, 200, { radius: 15 }),
      pos(20, 20),
      color(100, 100, 100),
    ]);
    background.add([sprite("seed"), scale(0.08), pos(35, 30)]);
    background.add([text("10"), scale(0.9), pos(80, 33)]);
    background.add([sprite("apple"), scale(0.085), pos(135, 25)]);
    background.add([text("5"), scale(0.9), pos(180, 33)]);
    background.add([sprite("cap"), scale(0.25), pos(56, 55)]);

    let some_text;
    let buy_cap_button_color;
    let buy_cap_text_scale;
    if (
      localStorage.getItem("seeds") >= 10 &&
      localStorage.getItem("apples") >= 5
    ) {
      if (localStorage.getItem("93rfDw") === "#%1d8*f@4p") {
        some_text = "Wear";
        buy_cap_button_color = rgb(160, 0, 0);
        buy_cap_text_scale = 0.7;
      } else {
        some_text = "Buy";
        buy_cap_button_color = rgb(0, 255, 0);
      }
    } else {
      some_text = "Buy";
      buy_cap_button_color = rgb(255, 0, 0);
    }

    if (some_text == "Wear") {
      onClick("buy-cap", () => {
        some_text = "Wearing";
        localStorage.setItem("Wearing", "True");
        buy_cap_text.text = some_text;
        buy_cap_text.scale = 0.6;
        buy_cap.color = rgb(0, 160, 0);
        hamster = loadSprite("hamster", "assets/hamstercap.png");
      });
    }
    if (localStorage.getItem("Wearing") == "True") {
      some_text = "Wearing";
      buy_cap_button_color = rgb(0, 160, 0);
      buy_cap_text_scale = 0.6;
      hamster = loadSprite("hamster", "assets/hamstercap.png");
    }
    if (some_text == "Wearing") {
      onClick("buy-cap", () => {
        some_text = "Wear";
        localStorage.setItem("Wearing", "False");
        buy_cap_text.text = some_text;
        buy_cap_text.scale = 0.7;
        buy_cap.color = rgb(160, 0, 0);
        hamster = loadSprite("hamster", "assets/hamster.png");
      });
    }

    const buy_cap = background.add([
      rect(100, 35, { radius: 8 }),
      color(buy_cap_button_color),
      pos(120, 195),
      area(),
      anchor("center"),
      outline(4.5),
      "buy-cap",
    ]);
    const buy_cap_text = buy_cap.add([
      text(some_text),
      anchor("center"),
      scale(buy_cap_text_scale),
      color(0, 0, 0),
    ]);
    background.add([
      text("x"),
      area(),
      pos(width() - 50, 15),
      color(150, 150, 150),
      "x",
    ]);

    onClick("buy-cap", () => {
      let seeds = localStorage.getItem("seeds");
      let apples = localStorage.getItem("apples");
      if (seeds >= 10 && apples >= 5) {
        if (localStorage.getItem("93rfDw") !== "#%1d8*f@4p") {
          localStorage.setItem("93rfDw", "#%1d8*f@4p");
          localStorage.setItem("seeds", seeds - 10);
          localStorage.setItem("apples", apples - 5);
          some_text = "Wear";
          buy_cap.color = rgb(160, 0, 0);
          buy_cap_text.text = some_text;
        }
      } else {
        alert("You don't have enough seeds and apples");
      }
    });

    onClick("x", () => {
      destroy(background);
      background = null; // Reset Credits variable after destroying
      go("menu");
    });
  }

  onClick("play", () => go("game"));
  onClick("hamsters", () => hamsters());
  onClick("shop", () => shop());
  onClick("left-arrow", () => {
    hamster = loadSprite("hamster", "assets/white_hamster.png");
    hamster = add([
      sprite("hamster"),
      pos(width() / 2, height() / 2),
      scale(0.55),
      anchor("center"),
    ]);
  });
  onClick("right-arrow", () => {
    hamster = loadSprite("hamster", "assets/hamster.png");
    hamster = add([
      sprite("hamster"),
      pos(width() / 2, height() / 2),
      scale(0.55),
      anchor("center"),
    ]);
  });

  onClick("info", () => display_info());
  onKeyPress("space", () => go("game"));
});

go("menu", localStorage.getItem("Score"));