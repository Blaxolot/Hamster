let SPEED = 350;
let GRAVITY = 1250;
const JUMP_FORCE = 700;
scene("game", () => {
  isMenu = false;
  isShop = false;
  let skibidibi = 1;
  let phone = window.innerWidth <= 500;
  window.addEventListener("resize", debounce(function (e) {
    isShop == false && isMenu == false && wait(0.5, () => {
      phone = window.innerWidth <= 500;
      debug.paused = true;
      skibidibi += 1;
      addFloor();
      destroyAll("floor" + (skibidibi - 1));
      destroyAll("floor" + (skibidibi - 2));
      debug.paused = false;
      destroyAll("player");
      addTrees();
      addHamster();
    });
  }), true);


  setBackground(0, 120, 180);
  !getSprite("banana") && loadSprite("banana", "images/game/banana.png");
  !getSprite("chocolate") && loadSprite("chocolate", "images/game/chocolate_bar.png");
  !getSprite("rotten_tomato") && loadSprite("rotten_tomato", "images/game/rotten_tomato.png");
  !getSprite("heart") && loadSprite("heart", "images/game/heart.png");
  !getSprite("drzewo1") && loadSprite("drzewo1", "images/game/drzewo_1.png");
  !getSprite("drzewo2") && loadSprite("drzewo2", "images/game/drzewo2.png");
  !getSprite("drzewo3") && loadSprite("drzewo3", "images/game/drzewo3.png");
  !getSprite("chmura") && loadSprite("chmura", "images/game/chmura.png");

  !getSound("pickup") && loadSound("pickup", "sounds/pickup.wav");
  !getSound("jump") && loadSound("jump", "sounds/jump.wav");
  !getSound("negative") && loadSound("negative", "sounds/negative_beeps.mp3");
  !getSound("gameover") && loadSound("gameover", "sounds/gameover.mp3");
  !getSound("bonus") && loadSound("bonus", "sounds/bonus_heart.mp3");
  addTrees();
  function addTrees() {
    let parameters = [fixed(), anchor("botleft"), z(-9), "tree"];
    destroyAll("tree");
    add([
      sprite("drzewo1", { width: (width() + height()) / 10 }),
      pos(width() / 10, height() - 60), ...parameters,
    ]);
    add([
      sprite("drzewo2", { width: (width() + height()) / 20 }),
      pos(width() / 2.8, height() - 60), ...parameters,
    ]);
    add([
      sprite("drzewo3", { width: (width() + height()) / 11 }),
      pos(width() / 1.5, height() - 60), ...parameters,
    ]);
  }

  addCloud();
  function addCloud() {
    add([
      sprite("chmura", { width: (width() + height()) / 9 }),
      fixed(),
      anchor("center"),
      pos(width() + 150, height() / 2 - 180),
      move(LEFT, 10),
      z(-10),
      area(),
      offscreen({ destroy: true }),
      "chmura"
    ]);
  }
  onDestroy("chmura", addCloud);

  // set Cursor and define gravity
  setCursor("default");
  setGravity(GRAVITY);
  updateVariables();
  function updateVariables() {
    hamster_pos = phone ? 40 : 100;
    hamster_width = 105 / (phone ? 1.25 : 1);
    chocolate_scale = 75 / (phone ? 1.25 : 1);
    apple_scale = 80 / (phone ? 1.25 : 1);
    banana_scale = 70 / (phone ? 1.25 : 1);
    seed_scale = 50 / (phone ? 1.25 : 1);
    tomato_scale = 70 / (phone ? 1.25 : 1);
    rotten_tomato_scale = 70 / (phone ? 1.25 : 1);
  }

  // add hamster
  addHamster();
  function addHamster() {
    updateVariables();
    player = add([
      sprite(isWhite + updateHamster(), { width: hamster_width }),
      pos(hamster_pos, -65),
      anchor("center"),
      area({ scale: vec2(0.7, 1) }),
      body(),
      "player",
    ]);

    items.forEach(item => {
      const { Scale, scale2 } = coolList[item];
      if (eval(item) == true) {
        player.add([
          sprite(item, { width: hamster_width / 2 }),
          scale(vec2(Scale)),
          anchor("center"),
          pos(0, -hamster_width / scale2),
        ]);
      }
    });
  }

  // floor
  addFloor();
  function addFloor() {
    for (let x = 0; x < width(); x += 60) {
      add([
        pos(x, height()),
        rect(60, 60),
        color(rgb(20, 170, 0)),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        "floor" + skibidibi,
      ]);
      add([
        pos(x, height()),
        rect(60, 43),
        color(rgb(90, 60, 0)),
        anchor("botleft"),
        "floor" + (skibidibi + 1),
      ]);
    }
  }

  function jump() {
    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
      play("jump", { volume: 2 });
    }
  }

  // handle jumping
  onKeyPress(["space", "up", "w"], jump);
  onKeyDown(["space", "up", "w"], jump);
  onClick(jump);
  onMouseDown(jump);
  onMouseRelease(jump);

  onKeyPress("escape", () => {
    let box = add([
      rect(600, 300, { radius: 25 }),
      anchor("center"),
      pos(center()),
      color(0, 0, 0),
    ]);

    box.add([
      text(polish ? "Czy Chcesz Zakończyć grę?" : "Do you want to quit?"),
      anchor("center"),
      pos(0, -100),
    ]);
    box.add([
      text(polish ? "!!! Stracisz swoje jedzenie !!!" : "!!! You will lose your food !!!"),
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
    yes.add([text(polish ? "TAK" : "YES", { size: 35 }), anchor("center"), color(0, 0, 0), pos(0, 2)]);
    no.add([text(polish ? "NIE" : "NO", { size: 35 }), anchor("center"), color(0, 0, 0), pos(0, 2)]);

    yes.onClick(() => { go("menu"); debug.paused = false; });
    no.onClick(() => { debug.paused = false; destroy(box); });
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
  player.onUpdate(() => {
    SPEED += 2 * dt();
    GRAVITY += 1 * dt();
    setGravity(GRAVITY);
  });

  let food = ["chocolate", "seed", "apple", "banana", "tomato", "rotten_tomato"];
  let distance;
  function spawnFood() {
    let randomFood = choose(food);
    if (randomFood == "rotten_tomato") {
      if (!chance(0.5)) {
        do {
          randomFood = choose(food);
        } while (randomFood == "rotten_tomato");
      }
    }

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

    food_pos = randomFood == "chocolate" ? 65 : randi(65, 300);
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
    wait(distance == null ? rand(0.75, 1.25) : distance, spawnFood);
  }
  spawnFood();

  let lives = 3;
  let foods = ["seed", "apple", "banana", "tomato"];
  foods.forEach(food => {
    eval(`${food}Score = 0`);
    onCollide(food, "player", item => {
      if (item.scale == undefined) {
        play("pickup");
        eval(`${food}Score++`);
        eval(`${food}Text.text = ${food}Score`);
        console.log("mniam");

        let scaleFactor = 1;
        item.onUpdate(() => {
          scaleFactor -= 0.05;
          item.scale = vec2(scaleFactor);

          // Stop and destroy when scale factor is too small
          if (scaleFactor <= 0.1) {
            destroy(item);
          }
        });
      }
    });
  });

  onCollide("apple", "player", () => {
    if (appleScore >= 10 && appleScore % 10 == 0) {
      lives += 1;
      play("bonus", { volume: 0.5 });
      appleText10.text = "/" + (appleScore + 10);
      appleScore == 10 && (appleText10.pos = [225, 24]);
      appleScore == 100 && (appleText10.pos = [250, 24]);
      appleScore == 1000 && (appleText10.pos = [275, 24]);
      appleScore == 10000 && (appleText10.pos = [300, 24]);

      for (let i = 1; i <= 1000; i++) {
        if (lives == i) {
          addBonusHearts();
          function addBonusHearts() {
            const heartWidth = 50; // The width of each heart slot
            // Calculate the number of hearts that can fit in one line
            const heartsPerLine = Math.floor(width() / heartWidth);
            // Calculate x and y position based on the current heart
            const xPos = width() - 5 - ((i - 1) % heartsPerLine) * heartWidth - heartWidth;
            const yPos = Math.floor((i - 1) / heartsPerLine) * heartWidth + 15;

            eval(`Live${i} = add([pos(xPos, yPos), sprite("heart"), scale(0.08)])`);
          }
          if (localStorage.getItem("X2_hearts") == "True") {
            i += 1;
            lives += 1;
            addBonusHearts();
          }
        }
      }
    }
  });

  function BAD(bad) {
    if (bad.scale == undefined) {
      shake(15);
      let scaleFactor = 1;
      bad.onUpdate(() => {
        scaleFactor -= 0.05;
        bad.scale = vec2(scaleFactor);

        // Stop and destroy when scale factor is too small
        if (scaleFactor <= 0.1) {
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
        MenuText = polish ? "Koniec Gry" : "Game Over";
      }
      console.log("fu");
    }
  }
  onCollide("chocolate", "player", bad => BAD(bad));
  onCollide("rotten_tomato", "player", bad => BAD(bad));

  const seedText = add([text(seedScore), pos(65, 24)]);
  add([sprite("seed"), scale(0.08), pos(16, 20)]);
  const appleText = add([text(appleScore), pos(175, 24)]);
  const appleText10 = add([text("/10"), pos(200, 24), color(180, 180, 180)]);
  add([sprite("apple"), scale(0.1), pos(120, 10)]);
  const bananaText = add([text(bananaScore), pos(65, 80)]);
  add([sprite("banana"), scale(-0.1, 0.1), pos(65, 75)]);
  const tomatoText = add([text(tomatoScore), pos(65, 136)]);
  add([sprite("tomato"), scale(0.085), pos(14, 130)]);
  let Live1 = add([sprite("heart"), pos(width() - 55, 15), scale(0.08)]);
  let Live2 = add([sprite("heart"), pos(width() - 105, 15), scale(0.08)]);
  let Live3 = add([sprite("heart"), pos(width() - 155, 15), scale(0.08)]);
});