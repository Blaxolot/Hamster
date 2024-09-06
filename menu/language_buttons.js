function language_buttons() {
    const pl = add([
        rect(40, 40, { radius: 5 }),
        pos(width() - 75, 30),
        color(25, 25, 25),
        anchor("center"),
        area(),
    ]);
    pl_icon = pl.add([
        sprite("poland", { width: 30 }),
        anchor("center"),
        opacity(polish ? 1 : 0.3),
    ]);
    const usa = add([
        rect(40, 40, { radius: 5 }),
        pos(width() - 30, 30),
        color(25, 25, 25),
        anchor("center"),
        area(),
    ]);
    usa_icon = usa.add([
        sprite("usa", { width: 30 }),
        anchor("center"),
        opacity(polish ? 0.3 : 1),
    ]);
    pl.onClick(() => {
        localStorage.setItem("Language", "polish");
        SetLanguage();
        go("menu");
    });
    usa.onClick(() => {
        localStorage.setItem("Language", "english");
        SetLanguage();
        go("menu");
    });
    MyHover(pl, 1.05, 1);
    MyHover(usa, 1.05, 1);
}