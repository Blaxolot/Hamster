let skibidibi = 1;
function addTrees() {
    let parameters = [fixed(), anchor("botleft"), z(-9), "tree"];
    destroyAll("tree");
    add([
        sprite("drzewo1", { width: (width() + height()) / 10 }),
        pos(width() / 10, height() - 60), ...parameters,
    ]);
    add([
        sprite("drzewo2", { width: (width() + height()) / 20 }),
        pos(width() / 2.8, height() - 60), ...parameters,
    ]);
    add([
        sprite("drzewo3", { width: (width() + height()) / 11 }),
        pos(width() / 1.5, height() - 60), ...parameters,
    ]);
}
function addCloud() {
    add([
        sprite("chmura", { width: (width() + height()) / 9 }),
        fixed(),
        anchor("center"),
        pos(width() + 150, height() / 2 - 180),
        move(LEFT, 10),
        z(-10),
        area(),
        offscreen({ destroy: true }),
        "chmura",
    ]);
}
onDestroy("chmura", addCloud);
function addFloor() {
    for (let x = 0; x < width(); x += 60) {
        add([
            pos(x, height()),
            rect(60, 60),
            color(rgb(20, 170, 0)),
            anchor("botleft"),
            area(),
            body({ isStatic: true }),
            "floor" + skibidibi,
        ]);
        add([
            pos(x, height()),
            rect(60, 43),
            color(rgb(90, 60, 0)),
            anchor("botleft"),
            "floor" + (skibidibi + 1),
        ]);
    }
}