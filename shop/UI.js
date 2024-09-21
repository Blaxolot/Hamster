function shop_UI() {
  createBoxes();
  function createBoxes() {
    items.forEach(item => {
      const shop_phone = width() < 450;
      const {food1, food2, price1, price2, Scale} = itemPricing[item];
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

      let mainItem = ["shoes", "gloves"].includes(item)
        ? currentHamster + "_" + item
        : item;

      (apple = 0.085), (banana = [-0.085, 0.085]);
      (seed = 0.08), (tomato = 0.08);
      let coolPos = first_food == "banana" ? 54 : isOneFood ? 46 : 10;
      eval(
        `${item}_box.add([sprite("${first_food}"), scale(${first_food}), pos(${coolPos},5)])`
      );
      eval(`${item}_box.add([text(price1), scale(0.9), pos(isOneFood ? 90: 55, 13)])`);
      !isOneFood &&
        eval(`${item}_box.add([
        sprite("${second_food}"),
        scale(${second_food}),
        pos(second_food == "banana" ? 149:105,5),
      ])`);
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
          color(BLACK),
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
          color(BLACK),
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
        eval(
          `${item}_text = status ? (polish ? "Ubrane" : "Wearing") : (polish ? "Ubierz" : "Wear")`
        );
        eval(`buy_${item}_button_color = status ? rgb(0, 160, 0) : rgb(200, 0, 0)`);
        eval(`buy_${item}_text_scale = status ? 0.6 : 0.7`);
      } else {
        const {food1, food2, price1, price2} = itemPricing[item];
        const con = eval(food1) < price1 || eval(food2) < price2;
        eval(`${item}_text = polish ? "Kup" : "Buy"`);
        eval(`buy_${item}_button_color = con ? rgb(250, 25, 25) : rgb(0, 200, 0)`);
        eval(`buy_${item}_text_scale = 0.7`);
      }
      // add buttons
      window[`buy_${item}`] = eval(`${item}_box`).add([
        rect(100, 35, {radius: 8}),
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
        color(BLACK),
      ]);
      // hovers
      MyHover(window[`buy_${item}`], 1.025, 1);
    });
  }
  createButtons();
  x = add([text("x"), area(), pos(width() - 50, 15), color(LIGHT_GRAY)]);
  x.onClick(() => go("menu"));
  MyHover(x, 1, 1, rgb(240, 240, 240), LIGHT_GRAY);
}
