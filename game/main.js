let SPEED = 350;
let GRAVITY = 1250;
scene("game", () => {
  isMenu = false;
  isShop = false;
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
  const day_background_color = [0, 120, 180];
  const night_background_color = [0, 40, 60];
  setBackground(isNight == true ? night_background_color : day_background_color);
  loadS("heart", "images/game/heart.png");
  loadS("drzewo1", "images/game/drzewo_1.png");
  loadS("drzewo2", "images/game/drzewo2.png");
  loadS("drzewo3", "images/game/drzewo3.png");
  loadS("chmura", "images/game/chmura.png");
  loadS("grave", "images/game/grave.png");

  !getSound("pickup") && loadSound("pickup", "sounds/pickup.wav");
  !getSound("jump") && loadSound("jump", "sounds/jump.wav");
  !getSound("negative") && loadSound("negative", "sounds/negative_beeps.mp3");
  !getSound("gameover") && loadSound("gameover", "sounds/gameover.mp3");
  !getSound("bonus") && loadSound("bonus", "sounds/bonus_heart.mp3");
  // floor
  addFloor();
  addTrees();
  addCloud();

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
    hamster_accessories.forEach(item => {
      const { Scale, Scale2, scale1, scale2 } = coolList[item];
      if (eval(item) == true) {
        player.add([
          sprite(item, { width: hamster_width / 2 }),
          scale(vec2(currentHamster == "hamster" ? Scale : (Scale2 || Scale))),
          anchor("center"),
          pos(0, -hamster_width / (currentHamster == "hamster" ? scale1 : scale2)),
        ]);
      }
    });
    onKeyDown("down", () => { player.scale = vec2(0.5); });
    onKeyRelease("down", () => { player.scale = vec2(1); });
    onKeyDown("s", () => { player.scale = vec2(0.5); });
    onKeyRelease("s", () => { player.scale = vec2(1); });
  }

  let lastJumpFunction = shortJump;
  function shortJump() {
    if (player.isGrounded()) {
      player.jump(600);
      play("jump", { volume: 2 });
      lastJumpFunction = shortJump;
      localStorage.setItem("number_of_jumps", ++number_of_jumps);
    }
  }
  function longJump() {
    if (player.isGrounded()) {
      player.jump(750);
      play("jump", { volume: 2 });
      lastJumpFunction = longJump;
      localStorage.setItem("number_of_jumps", ++number_of_jumps);
    }
  }
  // handle jumping
  if (Mystery !== "True") {
    onKeyPress(["space", "up", "w"], shortJump);
    onKeyDown(["space", "up", "w"], shortJump);

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
    onClick(() => Jumping());
    onKeyPress(["space", "up", "w"], () => Jumping());

    player.onDoubleJump(() => {
      play("jump", { volume: 2 });
      localStorage.setItem("number_of_jumps", ++number_of_jumps);
    });
  }

  // Increase speed gradually
  player.onUpdate(() => {
    SPEED += 2 * dt();
    GRAVITY += 1 * dt();
    setGravity(GRAVITY);
  });

  food();
  exitMenu();
});
