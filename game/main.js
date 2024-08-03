let SPEED = 350;
let GRAVITY = 1250;
scene("game", () => {
  isMenu = false;
  isShop = false;
  let skibidibi = 1;
  let phone = window.innerWidth <= 500;
  window.addEventListener(
    "resize",
    debounce(function (e) {
      isShop == false &&
        isMenu == false &&
        wait(0.5, () => {
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
    }),
    true
  );

  setBackground(0, 120, 180);
  !getSprite("banana") && loadSprite("banana", "images/game/banana.png");
  !getSprite("chocolate") && loadSprite("chocolate", "images/game/chocolate_bar.png");
  !getSprite("rotten_tomato") &&
    loadSprite("rotten_tomato", "images/game/rotten_tomato.png");
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
      pos(width() / 10, height() - 60),
      ...parameters,
    ]);
    add([
      sprite("drzewo2", { width: (width() + height()) / 20 }),
      pos(width() / 2.8, height() - 60),
      ...parameters,
    ]);
    add([
      sprite("drzewo3", { width: (width() + height()) / 11 }),
      pos(width() / 1.5, height() - 60),
      ...parameters,
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
      "chmura",
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
      doubleJump(),
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
  let lastJumpFunction = shortJump;
  function shortJump() {
    if (player.isGrounded()) {
      player.jump(600);
      play("jump", { volume: 2 });
      lastJumpFunction = shortJump;
    }
  }
  function longJump() {
    if (player.isGrounded()) {
      player.jump(750);
      play("jump", { volume: 2 });
      lastJumpFunction = longJump;
    }
  }
  // handle jumping
  if (Mystery !== "True") {
    onKeyPress("space", shortJump);
    onKeyPress("up", shortJump);
    onKeyPress("w", shortJump);

    onKeyDown("space", shortJump);
    onKeyDown("up", shortJump);
    onKeyDown("w", shortJump);

    let pressTimer;
    function clearPressTimer() {
      clearTimeout(pressTimer);
      shortJump();
      return false;
    }

    function setPressTimer() {
      pressTimer = window.setTimeout(function () {
        longJump();
        pressTimer = window.setTimeout(function repeatJump() {
          if (lastJumpFunction) lastJumpFunction();
          pressTimer = window.setTimeout(repeatJump, 200);
        }, 200);
      }, 200);
      return false;
    }
    // desktop
    document.addEventListener("mouseup", clearPressTimer);
    document.addEventListener("mousedown", setPressTimer);
    // mobile phone
    document.addEventListener("touchstart", setPressTimer);
    document.addEventListener("touchend", clearPressTimer);
  } else if (Mystery == "True") {
    function Jumping() {
      player.doubleJump(650);
    }
    onMousePress(() => Jumping());
    onKeyPress("space", () => Jumping());
    onKeyPress("up", () => Jumping());
    onKeyPress("w", () => Jumping());

    player.onDoubleJump(() => {
      play("jump", { volume: 2 });
    });
  }

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
      text(
        polish ? "!!! Stracisz swoje jedzenie !!!" : "!!! You will lose your food !!!"
      ),
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
    yes.add([
      text(polish ? "TAK" : "YES", { size: 35 }),
      anchor("center"),
      color(0, 0, 0),
      pos(0, 2),
    ]);
    no.add([
      text(polish ? "NIE" : "NO", { size: 35 }),
      anchor("center"),
      color(0, 0, 0),
      pos(0, 2),
    ]);

    yes.onClick(() => {
      go("menu");
      debug.paused = false;
    });
    no.onClick(() => {
      debug.paused = false;
      destroy(box);
    });
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

  food();
});
