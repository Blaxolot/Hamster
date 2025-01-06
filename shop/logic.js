function shop_logic() {
  function set(item, Wearing_or_Wear) {
    if (
      (item == "cap" || item == "winter_hat") &&
      eval(`${item == "cap" ? "winter_hat_text" : "cap_text"}`) !==
        (polish ? "Ubierz" : "Wear")
    ) {
      const otherItem = item == "cap" ? "winter_hat" : "cap";

      eval(`${otherItem}_text = polish ? "Ubierz" : "Wear"`);
      eval(`buy_${otherItem}.color = rgb(200, 0, 0)`);
      eval(`buy_${otherItem}_text.text = ${otherItem}_text`);
      eval(`buy_${otherItem}_text.scale = vec2(0.7)`);
      localStorage.setItem(
        otherItem == "cap" ? "Wearing" : "Winter_hat",
        "False",
      );

      eval(`${item}_text = polish ? "Ubrane" : "Wearing"`);
      eval(`buy_${item}.color = rgb(0, 160, 0)`);
      eval(`buy_${item}_text.text = ${item}_text`);
      eval(`buy_${item}_text.scale = vec2(0.6)`);
      localStorage.setItem(item == "cap" ? "Wearing" : "Winter_hat", "True");
    } else {
      eval(`${item}_text = "${Wearing_or_Wear}"`);
      (Wear = rgb(200, 0, 0)), (Ubierz = rgb(200, 0, 0));
      (Wearing = rgb(0, 160, 0)), (Ubrane = rgb(0, 160, 0));
      eval(`buy_${item}.color = ${Wearing_or_Wear}`);
      eval(`buy_${item}_text.text = ${item}_text`);
      (Wear = 0.7), (Wearing = 0.6);
      (Ubierz = 0.7), (Ubrane = 0.6);
      eval(`buy_${item}_text.scale = vec2(${Wearing_or_Wear})`);
      localStorage.setItem(
        item == "cap" ? "Wearing" : item[0].toUpperCase() + item.slice(1),
        Wearing_or_Wear == "Wearing"
          ? "True"
          : Wearing_or_Wear == "Ubrane"
          ? "True"
          : "False",
      );
    }
  }

  items.forEach(item => {
    const { food1, food2, price1, price2 } = itemPricing[item];
    const { key, value } = itemConditions[item];
    eval(`buy_${item}`).onClick(() => {
      item_text = eval(item + "_text");
      (item_text == (polish ? "Ubierz" : "Wear") &&
        set(item, polish ? "Ubrane" : "Wearing")) ||
        (item_text == (polish ? "Ubrane" : "Wearing") &&
          set(item, polish ? "Ubierz" : "Wear"));
      loadS(updateHamster(), `images/menu/${updateHamster()}.png`);

      if (localStorage.getItem(key) !== value) {
        if (
          (!food2 && eval(food1) >= price1) ||
          (food2 && eval(food1) >= price1 && eval(food2) >= price2)
        ) {
          localStorage.setItem(key, value);
          localStorage.setItem(myEncode(food1), myEncode(eval(food1) - price1));
          food2 !== undefined &&
            localStorage.setItem(myEncode(food2), myEncode(eval(food2) - price2));
          set(item, "Wearing");
          loadS(updateHamster(), `images/menu/${updateHamster()}.png`);
          createBoxes();
          createButtons();
          if (localStorage.getItem("Hamster2") == "True") {
            currentHamster = "hamster2";
            loadS(updateHamster(), `images/menu/${updateHamster()}.png`);
          }
        } else if (eval(food1) < price1 || eval(food2) < price2) {
          let missing1 = price1 - eval(food1);
          let missing2 = price2 - eval(food2);
          const first_food = getSingularFood(food1);
          const second_food = getSingularFood(food2);

          const box = add([
            rect(400, 200, { radius: 20 }),
            anchor("center"),
            pos(center()),
            color(LIGHT_GRAY),
          ]);
          wait(3, () => destroy(box));
          box.add([
            text(polish ? "Brakuje ci" : "You need", { size: 30 }),
            pos(0, -40),
            anchor("center"),
            color(BLACK),
          ]);

          missing1 > 0 &&
            box.add([
              text(missing1, { size: 30 }),
              pos(-15, 0),
              anchor("center"),
              color(BLACK),
            ]);
          missing2 > 0 &&
            box.add([
              text(missing2, { size: 30 }),
              pos(-15, 50),
              anchor("center"),
              color(BLACK),
            ]);

          missing1 > 0 &&
            box.add([
              sprite(first_food, {
                width: 45,
                flipX: first_food == "banana" && true,
              }),
              anchor("center"),
              pos(40, -5),
            ]);
          missing2 > 0 &&
            box.add([
              sprite(second_food, {
                width: 45,
                flipX: second_food == "banana" && true,
              }),
              anchor("center"),
              pos(40, 45),
            ]);
          // add x button that closes the box
          const box_x = box.add([
            text("x"),
            pos(170, -80),
            anchor("center"),
            color(BLACK),
            area({ scale: vec2(1.5, 1) }),
          ]);
          MyHover(box_x, 1, 1, rgb(240, 240, 240), BLACK);
          box_x.onClick(() => destroy(box));
        }
      }
    });
  });
}
