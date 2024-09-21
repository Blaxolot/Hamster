function getSingularFood(food) {
  if (["seeds", "apples", "bananas"].includes(food)) {
    return food.slice(0, -1);
  } else if (food === "tomatoes") {
    return "tomato";
  }
}

const items = [
  "cap",
  "winter_hat",
  "glasses",
  "shoes",
  "gloves",
  "x2_hearts",
  "mystery",
  "hamster2",
];
const itemConditions = {
  cap: { key: "93rfDw", value: "#%1d8*f@4p", var: "Wearing" },
  shoes: { key: "Sk@3o&", value: "%01ns#9p", var: "Shoes" },
  winter_hat: { key: "G8*m&a", value: "W%*hjk", var: "Winter_hat" },
  gloves: { key: "O&m*aC", value: "Io&*!c", var: "Gloves" },
  glasses: { key: "#9am3m", value: "Ghy&z@", var: "Glasses" },
  x2_hearts: { key: "X%2&*x", value: "^2@x&2", var: "X2_hearts" },
  mystery: { key: "?*$?r2?", value: "$q?q&?a??", var: "Mystery" },
  hamster2: { key: "^#ma^&s", value: "Svm,wXjk", var: "Hamster2" },
};
const itemPricing = {
  cap: { food1: "seeds", food2: "apples", price1: 10, price2: 5, Scale: 0.25 },
  shoes: { food1: "seeds", food2: "bananas", price1: 5, price2: 5, Scale: 0.2 },
  winter_hat: { food1: "bananas", food2: "apples", price1: 10, price2: 10, Scale: 0.215 },
  gloves: { food1: "tomatoes", food2: "apples", price1: 15, price2: 20, Scale: 0.2 },
  glasses: { food1: "tomatoes", food2: "bananas", price1: 50, price2: 50, Scale: 0.33 },
  x2_hearts: { food1: "apples", price1: 100, Scale: 0.18 },
  mystery: { food1: "seeds", price1: 250, Scale: 0.37 },
  hamster2: { food1: "tomatoes", price1: 50, Scale: 0.2 },
};

scene("shop", () => {
  setCursor("default");
  isMenu = false;
  isShop = true;
  window.addEventListener("resize", debounce(() => {
    isMenu == false && isShop == true && go("shop");
  }));

  loadS("cap", "images/menu/cap.png");
  loadS(currentHamster + "_shoes", `images/menu/${currentHamster}_shoes.png`);
  loadS("winter_hat", "images/menu/winter_hat.png");
  loadS(currentHamster + "_gloves", `images/menu/${currentHamster}_gloves.png`);
  loadS("glasses", "images/menu/glasses.png");
  loadS("x2_hearts", "images/game/heart.png");
  loadS("mystery", "images/menu/question-mark.png");
  loadS("hamster2", "images/menu/hamster2.png");

  shop_UI();
  shop_logic();
  onKeyPress("escape", () => go("menu"));
});