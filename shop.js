scene("shop", () => {
  isMenu = false;
  isShop = true;
  window.addEventListener("resize", debounce(function (e) {
    isMenu == false && isShop == true && go("shop");
  }));

  setCursor("default");
  !getSprite("cap") && loadSprite("cap", "images/menu/cap.png");
  !getSprite("hamster_shoes") && loadSprite("hamster_shoes", "images/menu/hamster_shoes.png");
  !getSprite("winter_hat") && loadSprite("winter_hat", "images/menu/winter_hat.png");
  !getSprite("hamster_gloves") && loadSprite("hamster_gloves", "images/menu/hamster_gloves.png");
  !getSprite("glasses") && loadSprite("glasses", "images/menu/glasses.png");
  !getSprite("x2_hearts") && loadSprite("x2_hearts", "images/game/heart.png");
  !getSprite("mystery") && loadSprite("mystery", "images/menu/question-mark.png");

  const items = ["cap", "winter_hat", "glasses", "shoes", "gloves", "x2_hearts", "mystery"];
  const itemConditions = {
    cap: { key: "93rfDw", value: "#%1d8*f@4p", var: "Wearing" },
    shoes: { key: "Sk@3o&", value: "%01ns#9p", var: "Shoes" },
    winter_hat: { key: "G8*m&a", value: "W%*hjk", var: "Winter_hat" },
    gloves: { key: "O&m*aC", value: "Io&*!c", var: "Gloves" },
    glasses: { key: "#9am3m", value: "Ghy&z@", var: "Glasses" },
    x2_hearts: { key: "X%2&*x", value: "^2@x&2", var: "X2_hearts" },
    mystery: { key: "?*$?r2?", value: "$q?q&?a??", var: "Mystery" },
  };
  const itemPricing = {
    cap: { food1: "seeds", food2: "apples", price1: 10, price2: 5, Scale: 0.25 },
    shoes: { food1: "seeds", food2: "bananas", price1: 5, price2: 5, Scale: 0.2 },
    winter_hat: { food1: "bananas", food2: "apples", price1: 10, price2: 10, Scale: 0.215 },
    gloves: { food1: "tomatoes", food2: "apples", price1: 15, price2: 20, Scale: 0.2 },
    glasses: { food1: "tomatoes", food2: "bananas", price1: 50, price2: 50, Scale: 0.33 },
    x2_hearts: { food1: "apples", price1: 100, Scale: 0.18 },
    mystery: { food1: "seeds", price1: 250, Scale: 0.37 },
  };
  // Create boxes
  createBoxes();
  function createBoxes() {
    items.forEach(item => {
      const shop_phone = width() < 450;
      const { food1, food2, price1, price2, Scale } = itemPricing[item];
      const numberOfColumns = width() < 660 ? 2 : 4;

      let position = [0, 0];
      const itemIndex = items.indexOf(item);
      if (itemIndex !== -1) {
        const row = Math.floor(itemIndex / numberOfColumns);
        const col = itemIndex % numberOfColumns;
        position = [
          (shop_phone ? 5 : 20) + col * (shop_phone ? 175 : 220),
          (shop_phone ? 5 : 20) + row * (shop_phone ? 175 : 220),
        ];
      }

      eval(`${item}_box = add([
      rect(200, 200, { radius: 15 }),
      pos(position),
      color(100, 100, 100),
      scale(shop_phone ? 0.8:1)
      ])`);

      const isOneFood = !food2;
      const first_food = getSingularFood(food1);
      const second_food = getSingularFood(food2);
      function getSingularFood(food) {
        if (["seeds", "apples", "bananas"].includes(food)) {
          return food.slice(0, -1);
        } else if (food === "tomatoes") {
          return "tomato";
        }
      }

      let mainItem = (["shoes", "gloves"].includes(item)) ? "hamster_" + item : item;

      apple = 0.085, banana = [-0.085, 0.085];
      seed = 0.08, tomato = 0.08;
      let coolPos = first_food == "banana" ? 54 : isOneFood ? 46 : 10;
      eval(`${item}_box.add([sprite("${first_food}"), scale(${first_food}), pos(${coolPos},5)])`);
      eval(`${item}_box.add([text(price1), scale(0.9), pos(isOneFood ? 90: 55, 13)])`);
      !isOneFood && eval(`${item}_box.add([sprite("${second_food}"), scale(${second_food}), pos(second_food == "banana" ? 149:105,5)])`);
      eval(`${item}_box.add([text(price2 || ""), scale(0.9), pos(150, 13)])`);

      if (!(item == "mystery" && localStorage.getItem("?*$?r2?") == "$q?q&?a??")) {
        window[`${item}_box`].add([
          sprite(mainItem),
          pos(100, 100),
          scale(Scale),
          anchor("center"),
        ]);
      }

      item == "x2_hearts" &&
        x2_hearts_box.add([
          text("2x"),
          scale(0.9),
          color(0, 0, 0),
          pos(100, 100),
          anchor("center"),
        ]);
      item == "mystery" &&
        localStorage.getItem("?*$?r2?") == "$q?q&?a??" &&
        mystery_box.add([
          text(polish ? "Podwójny Skok" : "Double Jump", {
            width: 200,
            size: 30,
            align: "center",
          }),
          color(0, 0, 0),
          pos(100, 100),
          anchor("center"),
        ]);
    });
  }

  // create buttons with corresponding text, color and size
  function createButtons() {
    items.forEach(item => {
      const condition = itemConditions[item];
      if (localStorage.getItem(condition.key) == condition.value) {
        const status = eval(condition.var) == "True";
        eval(`${item}_text = status ? (polish ? "Ubrane" : "Wearing") : (polish ? "Ubierz" : "Wear")`);
        eval(`buy_${item}_button_color = status ? rgb(0, 160, 0) : rgb(200, 0, 0)`);
        eval(`buy_${item}_text_scale = status ? 0.6 : 0.7`);
      } else {
        const { food1, food2, price1, price2 } = itemPricing[item];
        const con = eval(food1) < price1 || eval(food2) < price2;
        eval(`${item}_text = polish ? "Kup" : "Buy"`);
        eval(`buy_${item}_button_color = con ? rgb(250, 25, 25) : rgb(0, 200, 0)`);
        eval(`buy_${item}_text_scale = 0.7`);
      }
      // add buttons
      window[`buy_${item}`] = eval(`${item}_box`).add([
        rect(100, 35, { radius: 8 }),
        color(window[`buy_${item}_button_color`]),
        pos(100, 175),
        area(),
        anchor("center"),
        outline(4.5),
      ]);
      window[`buy_${item}_text`] = window[`buy_${item}`].add([
        text(window[`${item}_text`]),
        anchor("center"),
        scale(window[`buy_${item}_text_scale`]),
        color(0, 0, 0),
      ]);
      // hovers
      MyHover(window[`buy_${item}`], 1.025, 1);
    });
  }
  createButtons();
  x = add([
    text("x"),
    area(),
    pos(width() - 50, 15),
    color(150, 150, 150),
  ]);
  MyHover(x, 1, 1, rgb(240, 240, 240), rgb(150, 150, 150));

  function set(item, Wearing_or_Wear) {
    if ((item == "cap" || item == "winter_hat") &&
      eval(`${item == "cap" ? "winter_hat_text" : "cap_text"}`) !== (polish ? "Ubierz" : "Wear")) {
      const otherItem = item == "cap" ? "winter_hat" : "cap";

      eval(`${otherItem}_text = polish ? "Ubierz" : "Wear"`);
      eval(`buy_${otherItem}.color = rgb(200, 0, 0)`);
      eval(`buy_${otherItem}_text.text = ${otherItem}_text`);
      eval(`buy_${otherItem}_text.scale = vec2(0.7)`);
      localStorage.setItem(otherItem == "cap" ? "Wearing" : "Winter_hat", "False");

      eval(`${item}_text = polish ? "Ubrane" : "Wearing"`);
      eval(`buy_${item}.color = rgb(0, 160, 0)`);
      eval(`buy_${item}_text.text = ${item}_text`);
      eval(`buy_${item}_text.scale = vec2(0.6)`);
      localStorage.setItem(item == "cap" ? "Wearing" : "Winter_hat", "True");
    }
    else {
      eval(`${item}_text = "${Wearing_or_Wear}"`);
      Wear = rgb(200, 0, 0), Ubierz = rgb(200, 0, 0);
      Wearing = rgb(0, 160, 0), Ubrane = rgb(0, 160, 0);
      eval(`buy_${item}.color = ${Wearing_or_Wear}`);
      eval(`buy_${item}_text.text = ${item}_text`);
      Wear = 0.7, Wearing = 0.6;
      Ubierz = 0.7, Ubrane = 0.6;
      eval(`buy_${item}_text.scale = vec2(${Wearing_or_Wear})`);
      localStorage.setItem(
        item == "cap" ? "Wearing" : item[0].toUpperCase() + item.slice(1),
        Wearing_or_Wear == "Wearing" ? "True" : Wearing_or_Wear == "Ubrane" ? "True" : "False"
      );
    }
  }

  items.forEach(item => {
    const { food1, food2, price1, price2 } = itemPricing[item];
    const { key, value } = itemConditions[item];
    eval(`buy_${item}`).onClick(() => {
      item_text = eval(item + "_text");
      (item_text == (polish ? "Ubierz" : "Wear") && set(item, polish ? "Ubrane" : "Wearing")) ||
        (item_text == (polish ? "Ubrane" : "Wearing") && set(item, polish ? "Ubierz" : "Wear"));
      !getSprite(updateHamster()) && loadSprite(updateHamster(), `images/${updateHamster()}.png`);

      if (localStorage.getItem(key) !== value) {
        if ((!food2 && eval(food1) >= price1) || (food2 && eval(food1) >= price1 && eval(food2) >= price2)) {
          localStorage.setItem(key, value);
          localStorage.setItem(food1, eval(food1) - price1);
          food2 !== undefined && localStorage.setItem(food2, eval(food2) - price2);
          set(item, "Wearing");
          !getSprite(updateHamster()) && loadSprite(updateHamster(), `images/${updateHamster()}.png`);
          createBoxes();
          createButtons();
        } else if (eval(food1) < price1 || eval(food2) < price2) {
          alert(polish ? `Nie masz wystarczająco ${food1}  ${food2 !== undefined ? `i ${food2}` : ""}` :
            `You don't have enough ${food1} and ${food2}`);
        }
      }
    });
  });
  onKeyPress("escape", () => go("menu"));
  x.onClick(() => go("menu"));
});