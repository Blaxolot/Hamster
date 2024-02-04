// hej
const FLOOR_HEIGHT = 50;
const JUMP_FORCE = 800;
let SPEED = 350;
// initialize context
kaboom();
setBackground(50, 50, 50);

// load assets
loadSprite("hamster", "assets/hamster.png");
loadSprite("seed", "assets/seed.png");
loadSprite("chocolate", "assets/chocolate-bar.png");
loadSprite("heart", "assets/heart.png");
loadSprite("apple", "assets/apple.png");

loadSound("pickup", "assets/pickup.wav");
loadSound("jump", "assets/jump.wav");
loadSound("negative", "assets/negative_beeps.mp3");
loadSound("gameover", "assets/gameover.mp3");
loadSound("bonus", "assets/bonus.mp3");
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
  add([
    rect(width(), FLOOR_HEIGHT),
    outline(4),
    pos(0, height()),
    anchor("botleft"),
    area(),
    body({ isStatic: true }),
    color(0, 150, 50),
  ]);

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
    const number = randi(4);
    if (number == 1) {
      add([
        sprite("chocolate"),
        area(),
        pos(width(), height() - 60),
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
        pos(width(), height() - randi(55, 300)),
        scale(0.16),
        anchor("botleft"),
        move(LEFT, SPEED),
        offscreen({ destroy: true }),
        "apple",
      ]);
    } else {
      add([
        sprite("seed"),
        area(),
        pos(width(), height() - randi(55, 300)),
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
  let lives = 3;

  // lose if player collides with any game obj with tag "seed"
  player.onCollide("seed", orzech => {
    play("pickup", {
      loop: false,
    });
    destroy(orzech);
    seedScore++;
    scoreLabel.text = seedScore;
    console.log("mniam");
  });

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
    if (appleScore % 10 === 0) {
      lives += 1;
      play("bonus", {
        loop: false,
      });
      if (lives == 3) {
        bonusLive3 = add([
          sprite("heart"),
          pos(width() - 155, 15),
          scale(0.08),
        ]);
      }
      if (lives == 2) {
        bonusLive2 = add([
          sprite("heart"),
          pos(width() - 105, 15),
          scale(0.08),
        ]);
      }
      if (lives == 1) {
        bonusLive1 = add([
          sprite("heart"),
          area(),
          pos(width() - 55, 15),
          scale(0.08),
        ]);
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

    // Destroy the corresponding Live heart only if the bonusLive heart existed
    if (lives == 2 && Live3) {
      destroy(Live3);
      Live3 = undefined;
    }
    if (lives == 1 && Live2) {
      destroy(Live2);
      Live2 = undefined;
    }
    if (lives == 0 && Live1) {
      destroy(Live1);
      Live1 = undefined;
    }

    if (lives == -1) {
      go("lose", seedScore + appleScore);
      localStorage.setItem("Score", seedScore + appleScore);
      SPEED = 350;
    }
  });

  const scoreLabel = add([text(seedScore), pos(60, 24)]);
  add([sprite("seed"), scale(0.07), pos(18, 24)]);
  const appleScoreLabel = add([text(appleScore), pos(170, 24)]);
  add([sprite("apple"), scale(0.09), pos(120, 16)]);
  let Live1 = add([
    sprite("heart"),
    area(),
    pos(width() - 55, 15),
    scale(0.08),
  ]);
  let Live2 = add([sprite("heart"), pos(width() - 105, 15), scale(0.08)]);
  let Live3 = add([sprite("heart"), pos(width() - 155, 15), scale(0.08)]);
});

scene("lose", score => {
  play("gameover", {
    loop: false,
  });
  add([
    sprite("hamster"),
    pos(width() / 2, height() / 2 + 25),
    scale(0.5),
    anchor("center"),
  ]);

  add([
    text("Game Over"),
    pos(width() / 2, height() / 2 + -250),
    scale(2),
    anchor("center"),
  ]);

  // display score
  add([
    text(`Your Score: ${score}`),
    pos(width() / 2, height() / 2 - 150),
    scale(1),
    anchor("center"),
  ]);

  // display credits
  const info = add([
    text("i"),
    area(),
    pos(width() - 75, height() - 60),
    color(100, 100, 100),
    "info",
  ]);

  const play_button = add([
    rect(350, 75, { radius: 8 }),
    color(0, 0, 255),
    pos(width() / 2, height() / 2 + 250),
    area(),
    anchor("center"),
    outline(5),
    "play",
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

  info.onHoverUpdate(() => {
    info.color = rgb(255, 255, 250);
    setCursor("pointer");
  });
  info.onHoverEnd(() => {
    info.color = rgb(100, 100, 100);
    setCursor("default");
  });
  let Credits; // Declare Credits in the global scope

  function display_info() {
    if (!Credits) {
      Credits = add([
        rect(650, 600, { radius: 8 }),
        color(0, 0, 0),
        opacity(0.8),
        pos(center()),
        area(),
        anchor("center"),
        outline(5),
        "credits",
      ]);

      Credits.add([
        text("Icon Credits"),
        anchor("center"),
        pos(0, -240),
        color(255, 255, 255),
      ]);
      Credits.add([
        text("Hamster Icon created by Freepik - Flaticon"),
        anchor("center"),
        pos(0, -180),
        color(255, 255, 255),
        scale(0.6),
      ]);
      Credits.add([
        text("Seed Icon created by Smashicons - Flaticon"),
        anchor("center"),
        pos(0, -140),
        color(255, 255, 255),
        scale(0.6),
      ]);
      Credits.add([
        text("Apple Icon created by Smashicons - Flaticon"),
        anchor("center"),
        pos(0, -100),
        color(255, 255, 255),
        scale(0.6),
      ]);
      Credits.add([
        text("Heart Icon created by Pixel perfect"),
        anchor("center"),
        pos(0, -60),
        color(255, 255, 255),
        scale(0.6),
      ]);
      Credits.add([
        text("Chocolate Bar Icon created by Iconic Panda"),
        anchor("center"),
        pos(0, -20),
        color(255, 255, 255),
        scale(0.6),
      ]);
      Credits.add([
        text("- Flaticon"),
        anchor("center"),
        pos(0, 5),
        color(255, 255, 255),
        scale(0.6),
      ]);
      Credits.add([
        text("x"),
        anchor("center"),
        area(),
        pos(-305, -280),
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

  onClick("play", () => go("game"));
  onClick("info", () => display_info());
  onKeyPress("space", () => go("game"));
});

scene("menu", () => {
  add([
    sprite("hamster"),
    pos(width() / 2, height() / 2 + 25),
    scale(0.5),
    anchor("center"),
  ]);

  // display Hamster
  add([
    text("Hamster", { size: 100 }),
    pos(width() / 2, height() / 2 + -250),
    anchor("center"),
  ]);

  let texxt = `Your Score: ${localStorage.getItem("Score")}`;
  if (localStorage.getItem("Score") == null) {
    texxt = "Hi, My name is Blue";
  }
  // display score
  add([
    text(`${texxt}`),
    pos(width() / 2, height() / 2 - 150),
    anchor("center"),
  ]);

  // display credits
  const info = add([
    text("i"),
    area(),
    pos(width() - 75, height() - 60),
    color(100, 100, 100),
    "info",
  ]);

  const play_button = add([
    rect(350, 75, { radius: 8 }),
    color(0, 0, 255),
    pos(width() / 2, height() / 2 + 250),
    area(),
    anchor("center"),
    outline(5),
    "play",
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

  info.onHoverUpdate(() => {
    info.color = rgb(255, 255, 250);
    setCursor("pointer");
  });
  info.onHoverEnd(() => {
    info.color = rgb(100, 100, 100);
    setCursor("default");
  });
  let Credits;

  function display_info() {
    if (!Credits) {
      Credits = add([
        rect(650, 600, { radius: 8 }),
        color(0, 0, 0),
        opacity(0.8),
        pos(center()),
        area(),
        anchor("center"),
        outline(5),
        "credits",
      ]);

      Credits.add([
        text("Icon Credits"),
        anchor("center"),
        pos(0, -240),
        color(255, 255, 255),
      ]);
      Credits.add([
        text("Hamster Icon created by Freepik - Flaticon"),
        anchor("center"),
        pos(0, -180),
        color(255, 255, 255),
        scale(0.6),
      ]);
      Credits.add([
        text("Seed Icon created by Smashicons - Flaticon"),
        anchor("center"),
        pos(0, -140),
        color(255, 255, 255),
        scale(0.6),
      ]);
      Credits.add([
        text("Apple Icon created by Smashicons - Flaticon"),
        anchor("center"),
        pos(0, -100),
        color(255, 255, 255),
        scale(0.6),
      ]);
      Credits.add([
        text("Heart Icon created by Pixel perfect"),
        anchor("center"),
        pos(0, -60),
        color(255, 255, 255),
        scale(0.6),
      ]);
      Credits.add([
        text("Chocolate Bar Icon created by Iconic Panda"),
        anchor("center"),
        pos(0, -20),
        color(255, 255, 255),
        scale(0.6),
      ]);
      Credits.add([
        text("- Flaticon"),
        anchor("center"),
        pos(0, 5),
        color(255, 255, 255),
        scale(0.6),
      ]);
      Credits.add([
        text("x"),
        anchor("center"),
        area(),
        pos(-305, -280),
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

  onClick("play", () => go("game"));
  onClick("info", () => display_info());
  onKeyPress("space", () => go("game"));
});
go("menu", localStorage.getItem("Score"));
