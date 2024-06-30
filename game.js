scene("game", () => {
  setBackground(0, 120, 180);
  !getSprite("banana") && loadSprite("banana", "images/banana.png");
  !getSprite("chocolate") && loadSprite("chocolate", "images/chocolate_bar.png");
  !getSprite("rotten_tomato") && loadSprite("rotten_tomato", "images/rotten_tomato.png");
  !getSprite("heart") && loadSprite("heart", "images/heart.png");
  !getSprite("drzewo1") && loadSprite("drzewo1", "images/drzewo_1.png");
  !getSprite("drzewo2") && loadSprite("drzewo2", "images/drzewo2.png");
  !getSprite("drzewo3") && loadSprite("drzewo3", "images/drzewo3.png");
  !getSprite("chmura") && loadSprite("chmura", "images/chmura.png");

  !getSound("pickup") && loadSound("pickup", "sounds/pickup.wav");
  !getSound("jump") && loadSound("jump", "sounds/jump.wav");
  !getSound("negative") && loadSound("negative", "sounds/negative_beeps.mp3");
  !getSound("gameover") && loadSound("gameover", "sounds/gameover.mp3");
  !getSound("bonus") && loadSound("bonus", "sounds/bonus_heart.mp3");

  let para = [fixed(), anchor("botleft")];

  add([
    sprite("drzewo1", { width: (width() + height()) / 10 }),
    pos(width() / 10, height() - 60),
    ...para,
  ]);
  add([
    sprite("drzewo2", { width: (width() + height()) / 20 }),
    pos(width() / 2.8, height() - 60),
    ...para,
  ]);
  add([
    sprite("drzewo3", { width: (width() + height()) / 11 }),
    pos(width() / 1.5, height() - 60),
    ...para,
  ]);

  add([
    sprite("chmura", { width: (width() + height()) / 9 }),
    fixed(),
    anchor("center"),
    pos(width() / 2, height() / 2 - 180),
  ]);

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

  if (hello == true) {
    player.add([
      sprite("winter_hat", { width: hamster_width / 2 }),
      scale(vec2(0.9, 0.65)),
      anchor("center"),
      pos(0, -54),
    ]);
  }
  if (hello_2 == true) {
    player.add([
      sprite("cap", { width: hamster_width / 2 }),
      scale(vec2(0.9, 0.7)),
      anchor("center"),
      pos(0, -52),
    ]);
  }

  // floor
  for (let x = 0; x < width(); x += 60) {
    add([
      pos(x, height()),
      rect(60, 60),
      color(rgb(20, 170, 0)),
      anchor("botleft"),
      area(),
      body({ isStatic: true }),
    ]);
    add([
      pos(x, height()),
      rect(60, 43),
      color(rgb(90, 60, 0)),
      anchor("botleft"),
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
    ]);
    const no = box.add([
      rect(200, 50, { radius: 10 }),
      pos(150, 80),
      anchor("center"),
      color(255, 0, 0),
      area(),
    ]);
    yes.add([text("YES"), anchor("center"), color(0, 0, 0), scale(0.9), pos(0, 2)]);
    no.add([text("NO"), anchor("center"), color(0, 0, 0), scale(0.9), pos(0, 2)]);
    yes.onClick(() => { go("menu"), debug.paused = false; });
    no.onClick(() => { debug.paused = false, destroy(box); });
    onKeyPress("enter", () => {
      if (selected == "yes") {
        go("menu"), (debug.paused = false);
      } else if (selected == "no") {
        (debug.paused = false), destroy(box);
      }
    });
    onKeyPress("left", () => {
      yes.outline = 1;
      no.outline = 0;
      selected = "yes";
    });
    onKeyPress("right", () => {
      no.outline = 1;
      yes.outline = 0;
      selected = "no";
    });
    debug.paused = true;
  });

  // Increase speed gradually
  loop(0.5, () => {
    SPEED += 1;
    GRAVITY += 0.5;
    setGravity(GRAVITY);
  });
  let food = ["chocolate", "seed", "apple", "banana", "tomato", "rotten_tomato"];
  let distance = "";
  function spawnFood() {
    let randomFood = choose(food);
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
        } else if (e.code == "Digit2") {
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

  let foods = ["seed", "apple", "banana", "tomato"];
  foods.forEach(food => {
    player.onCollide(food, item => {
      if (item.scale == undefined) {
        play("pickup");
        eval(`${food}Score++`);
        eval(`${food}Text.text = ${food}Score`);
        console.log("mniam");

        let scaleFactor = 1;
        // Loop to decrease size at regular intervals
        loop(0.075, () => {
          scaleFactor -= 0.2;
          item.scale = vec2(scaleFactor);

          // Stop and destroy when scale factor is too small
          if (scaleFactor <= 0.2) {
            destroy(item);
          }
        });
      }
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

  function BAD(bad) {
    if (bad.scale == undefined) {
      let scaleFactor = 1;
      // Loop to decrease size at regular intervals
      loop(0.075, () => {
        scaleFactor -= 0.2;
        bad.scale = vec2(scaleFactor);

        // Stop an destroy when scale factor is too small
        if (scaleFactor <= 0.2) {
          destroy(bad);
        }
      });
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
    }
  }
  player.onCollide("chocolate", bad => BAD(bad));
  player.onCollide("rotten_tomato", bad => BAD(bad));

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