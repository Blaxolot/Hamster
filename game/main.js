let SPEED = 350;
let GRAVITY = 1250;
scene("game", () => {
  isMenu = false;
  isShop = false;
  window.addEventListener(
    "resize",
    debounce(() => {
      isShop == false &&
        isMenu == false &&
        wait(0.5, () => {
          destroyAll("floor");
          addFloor();
          destroyAll("player");
          addTrees();
          addHamster();
        });
    }),
    true,
  );
  const day_background_color = [0, 120, 180];
  const night_background_color = [0, 40, 60];
  setBackground(
    isNight == true ? night_background_color : day_background_color,
  );
  loadS("heart", "images/game/heart.png");
  loadS("tree1", "images/game/tree_1.png");
  loadS("tree2", "images/game/tree_2.png");
  loadS("tree3", "images/game/tree_3.png");
  loadS("cloud", "images/game/cloud.png");
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
          scale(vec2(currentHamster == "hamster" ? Scale : Scale2 || Scale)),
          anchor("center"),
          pos(
            0,
            -hamster_width / (currentHamster == "hamster" ? scale1 : scale2),
          ),
        ]);
      }
    });
    // get smaller when user presses down or s
    onMousePress("right", () => (player.scale = vec2(0.5)));
    onMouseRelease("right", () => {
      localStorage.setItem("number_of_reductions", ++number_of_reductions);
      player.scale = vec2(1);
    });
    onKeyDown(["down", "s"], () => (player.scale = vec2(0.5)));
    onKeyRelease(["down", "s"], () => {
      localStorage.setItem("number_of_reductions", ++number_of_reductions);
      player.scale = vec2(1);
    });
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
    document.addEventListener("mouseup", event => {
      if (event.button === 0) clearPressTimer();
    });
    document.addEventListener("mousedown", event => {
      if (event.button === 0) setPressTimer();
    });
    // mobile phone
    document.addEventListener("touchstart", setPressTimer);
    document.addEventListener("touchend", clearPressTimer);
  } else if (Mystery == "True") {
    function Jumping() {
      player.doubleJump(650);
    }
    onMousePress("left", () => Jumping());
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
