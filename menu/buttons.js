function buttons() {
  const DARK_GRAY = rgb(70, 70, 70);
  const buttons_para = [anchor("center"), outline(4.5)];
  const text_para = [anchor("center"), color(BLACK)];

  // display play button
  const play_button = add([
    rect(350, 75, { radius: 8 }),
    color(rgb(0, 100, 0)),
    pos(width() / 2, height() / 2 + 220),
    area(),
    ...buttons_para,
    "play_button",
  ]);
  play_button.add([text(polish ? "Graj" : "Play"), ...text_para]);
  // display hamster button
  const hamsters_button = add([
    rect(180, 40, { radius: 8 }),
    color(DARK_GRAY),
    pos(width() / 2 - 65, height() / 2 + 285),
    area(),
    ...buttons_para,
    "hamsters_button",
  ]);
  hamsters_button.add([
    text(polish ? "Chomiki" : "Hamsters", { size: 30 }),
    ...text_para,
  ]);
  // display shop button
  const shop_button = add([
    rect(120, 40, { radius: 8 }),
    color(DARK_GRAY),
    pos(width() / 2 + 95, height() / 2 + 285),
    area(),
    ...buttons_para,
    "shop_button",
  ]);
  shop_button.add([
    text(polish ? "Sklep" : "Shop", { size: 30 }),
    ...text_para,
  ]);
  // display credits
  const info = add([
    text("i"),
    pos(width() - info_x, height() - 45),
    color(140, 140, 140),
    area(),
    "info",
  ]);
  // display statistics
  const statistics_button = add([
    sprite("statistics", { width: 35 }),
    pos(width() - info_x - 45, height() - 50),
    area(),
    "stats_button",
  ]);
  // animations
  MyHover(play_button, 1.025, 1, rgb(0, 125, 0), rgb(0, 100, 0));
  MyHover(hamsters_button, 1.02, 1, rgb(90, 90, 90), DARK_GRAY);
  MyHover(shop_button, 1.02, 1, rgb(90, 90, 90), DARK_GRAY);
  MyHover(info, 1, 1, rgb(240, 240, 240), rgb(140, 140, 140));
  MyHover(statistics_button, 1, 1, "#f0f0f0", WHITE);
}
