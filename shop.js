scene("shop", () => {
  setCursor("default");
  !getSprite("cap") && loadSprite("cap", "images/cap.png");
  !getSprite("hamster_shoes") && loadSprite("hamster_shoes", "images/hamster_shoes.png");
  !getSprite("winter_hat") && loadSprite("winter_hat", "images/winter_hat.png");
  !getSprite("hamster_gloves") && loadSprite("hamster_gloves", "images/hamster_gloves.png");
  add([
    text(polish ? "Sklep" : "Shop", { size: phone ? 0.01 : 70 }),
    anchor("center"),
    pos(width() / 2, 50),
  ]);
  // Cap
  const cap_box = add([
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
  const shoes_box = add([
    rect(200, 200, { radius: 15 }),
    pos(20, 240),
    color(100, 100, 100),
  ]);
  shoes_box.add([sprite("seed"), scale(0.08), pos(15, 10)]);
  shoes_box.add([text("5    5"), scale(0.9), pos(60, 13)]);
  shoes_box.add([sprite("left_banana"), scale(0.085), pos(113, 5)]);
  shoes_box.add([sprite("hamster_shoes"), scale(0.2), pos(49, 47)]);
  // Winter hat
  const winter_hat_box = add([
    rect(200, 200, { radius: 15 }),
    pos(240, 20),
    color(100, 100, 100),
  ]);
  winter_hat_box.add([sprite("left_banana"), scale(0.085), pos(10, 5)]);
  winter_hat_box.add([text("10"), scale(0.9), pos(55, 13)]);
  winter_hat_box.add([sprite("apple"), scale(0.085), pos(105, 5)]);
  winter_hat_box.add([text("10"), scale(0.9), pos(150, 13)]);
  winter_hat_box.add([sprite("winter_hat"), scale(0.22), pos(43, 40)]);
  // Gloves
  const gloves_box = add([
    rect(200, 200, { radius: 15 }),
    pos(240, 240),
    color(100, 100, 100),
  ]);
  gloves_box.add([sprite("tomato"), scale(0.08), pos(10, 5)]);
  gloves_box.add([text("15"), scale(0.9), pos(55, 13)]);
  gloves_box.add([sprite("apple"), scale(0.085), pos(107, 5)]);
  gloves_box.add([text("20"), scale(0.9), pos(150, 13)]);
  gloves_box.add([sprite("hamster_gloves"), scale(0.2), pos(49, 47)]);
  // Glasses
  const glasses_box = add([
    rect(200, 200, { radius: 15 }),
    pos(460, 20),
    color(100, 100, 100),
  ]);
  glasses_box.add([sprite("tomato"), scale(0.08), pos(10, 5)]);
  glasses_box.add([text("50"), scale(0.9), pos(55, 13)]);
  glasses_box.add([sprite("left_banana"), scale(0.085), pos(105, 5)]);
  glasses_box.add([text("50"), scale(0.9), pos(150, 13)]);
  glasses_box.add([sprite("glasses"), scale(0.3), pos(100, 100), anchor("center")]);

  const items = ["cap", "shoes", "winter_hat", "gloves", "glasses"];
  const itemConditions = {
    cap: { key: "93rfDw", value: "#%1d8*f@4p", var: "Wearing" },
    shoes: { key: "Sk@3o&", value: "%01ns#9p", var: "Shoes" },
    winter_hat: { key: "G8*m&a", value: "W%*hjk", var: "Winter_hat" },
    gloves: { key: "O&m*aC", value: "Io&*!c", var: "Gloves" },
    glasses: { key: "#9am3m", value: "Ghy&z@", var: "Glasses" },
  };
  const itemPricing = {
    cap: { food1: "seeds", food2: "apples", price1: 10, price2: 5 },
    shoes: { food1: "seeds", food2: "bananas", price1: 5, price2: 5 },
    winter_hat: { food1: "bananas", food2: "apples", price1: 10, price2: 10 },
    gloves: { food1: "tomatoes", food2: "apples", price1: 15, price2: 20 },
    glasses: { food1: "tomatoes", food2: "bananas", price1: 50, price2: 50 },
  };
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
        eval(`${item}_text = "Buy"`);
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
      window[`buy_${item}`].onHoverUpdate(() => {
        window[`buy_${item}`].scale = vec2(1.025);
        setCursor("pointer");
      });
      window[`buy_${item}`].onHoverEnd(() => {
        window[`buy_${item}`].scale = vec2(1);
        setCursor("default");
      });
    });
  }
  createButtons();
  x = add([
    text("x"),
    area(),
    pos(width() - 50, 15),
    color(150, 150, 150),
  ]);
  x.onHoverUpdate(() => {
    x.color = rgb(240, 240, 240);
    setCursor("pointer");
  });
  x.onHoverEnd(() => {
    x.color = rgb(150, 150, 150);
    setCursor("default");
  });
  function set(item, Wearing_or_Wear) {
    eval(`${item}_text = "${Wearing_or_Wear}"`);
    Wear = rgb(200, 0, 0);
    Ubierz = rgb(200, 0, 0);
    Wearing = rgb(0, 160, 0);
    Ubrane = rgb(0, 160, 0);
    eval(`buy_${item}.color = ${Wearing_or_Wear}`);
    eval(`buy_${item}_text.text = ${item}_text`);
    (Wear = 0.7), (Wearing = 0.6);
    (Ubierz = 0.7), (Ubrane = 0.6);
    eval(`buy_${item}_text.scale = ${Wearing_or_Wear}`);
    localStorage.setItem(
      item == "cap" ? "Wearing" : item == "shoes" ? "Shoes" : item == "winter_hat" ? "Winter_hat" : item == "gloves" ? "Gloves" : "Glasses",
      Wearing_or_Wear == "Wearing" ? "True" : Wearing_or_Wear == "Ubrane" ? "True" : "False"
    );
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
        if (eval(food1) >= price1 && eval(food2) >= price2) {
          localStorage.setItem(key, value);
          localStorage.setItem(food1, eval(food1) - price1);
          localStorage.setItem(food2, eval(food2) - price2);
          set(item, "Wearing");
          !getSprite(updateHamster()) && loadSprite(updateHamster(), `images/${updateHamster()}.png`);
          createButtons();
        } else if (eval(food1) < price1 || eval(food2) < price2) {
          alert(`You don't have enough ${food1} and ${food2}`);
        }
      }
    });
  });
  onKeyPress("escape", () => go("menu"));
  x.onClick(() => go("menu"));
});