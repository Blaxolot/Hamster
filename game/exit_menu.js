function exitMenu() {
  onKeyPress("escape", () => {
    const box = add([
      rect(600, 300, { radius: 25 }),
      anchor("center"),
      pos(center()),
      color(BLACK),
    ]);

    box.add([
      text(polish ? "Czy Chcesz Zakończyć grę?" : "Do you want to quit?"),
      anchor("center"),
      pos(0, -100),
    ]);
    box.add([
      text(polish ? "!!! Stracisz swoje jedzenie !!!" : "!!! You will lose your food !!!"),
      scale(0.8),
      anchor("center"),
      pos(0, -50),
      color(RED),
    ]);
    const yes = box.add([
      rect(200, 50, { radius: 10 }),
      pos(-150, 80),
      anchor("center"),
      color(GREEN),
      area(),
    ]);
    const no = box.add([
      rect(200, 50, { radius: 10 }),
      pos(150, 80),
      anchor("center"),
      color(RED),
      area(),
    ]);
    yes.add([
      text(polish ? "TAK" : "YES", { size: 35 }),
      anchor("center"),
      color(BLACK),
      pos(0, 2),
    ]);
    no.add([
      text(polish ? "NIE" : "NO", { size: 35 }),
      anchor("center"),
      color(BLACK),
      pos(0, 2),
    ]);

    yes.onClick(() => {
      go("menu");
      debug.paused = false;
    });
    no.onClick(() => {
      debug.paused = false;
      destroy(box);
    });
    onKeyPress("enter", () => {
      if (selected == "yes") {
        go("menu"), (debug.paused = false);
      } else if (selected == "no") {
        (debug.paused = false), destroy(box);
      }
    });
    onKeyPress("left", () => {
      yes.outline = 1;
      no.outline = 0;
      selected = "yes";
    });
    onKeyPress("right", () => {
      no.outline = 1;
      yes.outline = 0;
      selected = "no";
    });
    debug.paused = true;
  });
}
