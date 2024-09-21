let skibidibi = 1;

function addTrees() {
  const parameters = [
    fixed(),
    anchor("botleft"),
    z(-9),
    "tree",
    opacity(isNight == true ? 0.7 : 1),
  ];
  destroyAll("tree");
  add([
    sprite("drzewo1", {width: (width() + height()) / 10}),
    pos(width() / 10, height() - 60),
    ...parameters,
  ]);
  add([
    sprite("drzewo2", {width: (width() + height()) / 20}),
    pos(width() / 2.8, height() - 60),
    ...parameters,
  ]);
  add([
    sprite("drzewo3", {width: (width() + height()) / 11}),
    pos(width() / 1.5, height() - 60),
    ...parameters,
  ]);
}
function addCloud() {
  add([
    sprite("chmura", {width: (width() + height()) / 9}),
    fixed(),
    anchor("center"),
    pos(width() / rand(0.9, 4), height() / 2 - rand(150, 250)),
    move(LEFT, 10),
    z(-10),
    area(),
    offscreen({destroy: true}),
    opacity(isNight == true ? 0.4 : 1),
    "chmura",
  ]);
}

function addFloor() {
  for (let x = 0; x < width(); x += 60) {
    add([
      pos(x, height()),
      rect(60, 60),
      color(rgb(isNight == true ? [20, 150, 0] : [20, 170, 0])),
      anchor("botleft"),
      area(),
      body({isStatic: true}),
      "floor" + skibidibi,
    ]);
    add([
      pos(x, height()),
      rect(60, 43),
      color(rgb(isNight == true ? [60, 40, 0] : [90, 60, 0])),
      anchor("botleft"),
      "floor" + (skibidibi + 1),
    ]);
  }
}
