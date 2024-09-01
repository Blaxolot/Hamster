function buttons() {
    // display credits
    const info = add([
        text("i"),
        pos(width() - info_x, height() - 45),
        color(140, 140, 140),
        area(),
        "info",
    ]);
    const play_button = add([
        rect(350, 75, { radius: 8 }),
        color(0, 100, 0),
        pos(width() / 2, height() / 2 + 220),
        area(),
        anchor("center"),
        outline(5),
        "play_button",
    ]);
    play_button.add([text(polish ? "Graj" : "Play"), anchor("center"), color(0, 0, 0)]);
    const hamsters_button = add([
        rect(180, 40, { radius: 8 }),
        color(70, 70, 70),
        pos(width() / 2 - 65, height() / 2 + 285),
        area(),
        anchor("center"),
        outline(4.5),
        "hamsters_button",
    ]);
    hamsters_button.add([
        text(polish ? "Chomiki" : "Hamsters", { size: 30 }),
        anchor("center"),
        color(0, 0, 0),
    ]);
    const shop_button = add([
        rect(120, 40, { radius: 8 }),
        color(70, 70, 70),
        pos(width() / 2 + 95, height() / 2 + 285),
        area(),
        anchor("center"),
        outline(4.5),
        "shop_button",
    ]);
    shop_button.add([
        text(polish ? "Sklep" : "Shop", { size: 30 }),
        anchor("center"),
        color(0, 0, 0),
    ]);
    // animations
    MyHover(play_button, 1.025, 1, rgb(0, 125, 0), rgb(0, 100, 0));
    MyHover(hamsters_button, 1.02, 1, rgb(90, 90, 90), rgb(70, 70, 70));
    MyHover(shop_button, 1.02, 1, rgb(90, 90, 90), rgb(70, 70, 70));
    MyHover(info, 1, 1, rgb(240, 240, 240), rgb(140, 140, 140));
}