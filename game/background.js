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
function addCloud() {
  add([
    sprite("cloud", { width: (width() + height()) / 9 }),
    pos(width() / rand(0.9, 4), height() / 2 - rand(150, 250)),
    opacity(isNight == true ? 0.4 : 1),
    offscreen({ destroy: true }),
    anchor("center"),
    move(LEFT, 10),
    area(),
    fixed(),
    z(-10),
    "cloud",
  ]);

  let cloud_added = false;
  onDestroy("cloud", () => {
    if (cloud_added == false) {
      cloud_added = true;
      wait(1, () => addCloud());
    }
  });
}

function addFloor() {
  const floor_parameters = [
    pos(0, height()),
    body({ isStatic: true }),
    anchor("botleft"),
    area(),
    "floor",
  ];
  add([
    rect(width(), 60),
    color(rgb(isNight == true ? [20, 150, 0] : [20, 170, 0])),
    ...floor_parameters,
  ]);
  add([
    rect(width(), 43),
    color(rgb(isNight == true ? [60, 40, 0] : [90, 60, 0])),
    ...floor_parameters,
  ]);
}
