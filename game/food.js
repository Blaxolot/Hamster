function food() {
  let food = ["chocolate", "chocolate", "seed", "apple", "banana", "tomato", "rotten_tomato"];
  let alive = true;
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

    food_pos = randomFood == "chocolate" ? 65 : randi(65, 350);
    add([
      sprite(randomFood, { width: window[randomFood + "_scale"] }),
      pos(width(), height() - food_pos),
      area(),
      anchor("botleft"),
      move(LEFT, SPEED),
      offscreen({ destroy: true }),
      randomFood,
      "food",
    ]);

    // wait a random amount of time to spawn next Food
    alive == false && destroyAll("food");
    alive == true && wait(distance == null ? rand(0.75, 1.25) : distance, spawnFood);
  }
  spawnFood();

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
  let lives = 3;
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
        destroyAll("food");
        alive = false;

        grave = add([
          sprite("grave", { width: 125 }),
          pos(hamster_pos, -65),
          anchor("center"),
          area(),
          body(),
        ]);
        grave.onCollide("player", () => {
          destroyAll("player");
          play("gameover");
          wait(2, () => {
            go("menu");
          });
        });

        localStorage.setItem("seeds", seedScore + +seeds);
        localStorage.setItem("apples", appleScore + +apples);
        localStorage.setItem("bananas", bananaScore + +bananas);
        localStorage.setItem("tomatoes", tomatoScore + +tomatoes);

        SPEED = 350;
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
  add([sprite("banana", { flipX: true }), scale(0.1), pos(13, 75)]);
  const tomatoText = add([text(tomatoScore), pos(65, 136)]);
  add([sprite("tomato"), scale(0.085), pos(14, 130)]);

  let Live1 = add([sprite("heart"), pos(width() - 55, 15), scale(0.08)]);
  let Live2 = add([sprite("heart"), pos(width() - 105, 15), scale(0.08)]);
  let Live3 = add([sprite("heart"), pos(width() - 155, 15), scale(0.08)]);
}
