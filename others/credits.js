function display_info() {
  if (!Credits) {
    Credits = add([
      rect(650, 650, { radius: 8 }),
      color(0, 0, 0),
      opacity(0.85),
      pos(center()),
      area(),
      anchor("center"),
      outline(5),
      "credits",
    ]);
    parameters = [anchor("center"), color(255, 255, 255), scale(0.6)];
    Credits.add([
      text(polish ? "Autorzy ikon" : "Icon Credits"),
      anchor("center"),
      pos(0, -280),
      color(255, 255, 255),
    ]);
    const icons_Credits = [
      "Hamster Icon created by Freepik - Flaticon",
      "Seed Icon created by Smashicons - Flaticon",
      "Apple Icon created by Smashicons - Flaticon",
      "Heart Icon created by Pixel perfect - Flaticon",
      "Chocolate Bar Icon created by Iconic Panda",
      "- Flaticon",
      "Arrow Icons created by Freepik - Flaticon",
      "Banana Icon created by juicy_fish - Flaticon",
      "Cap Icon created by juicy_fish - Flaticon",
      "Tomato Icon created by VectorPortal - Flaticon",
      "Glasses Icon created by Job Moon - Flaticon"
    ];

    let posY = -230; // Initial vertical position

    icons_Credits.forEach(Text => {
      const gap = Text == "- Flaticon" || Text.includes("Chocolate") ? 30 : 40;
      Credits.add([text(Text), pos(0, posY), ...parameters]); // Add text
      posY += gap; // Increment posY by 30 or 40 based on the text
    });

    x = Credits.add([
      text("x"),
      anchor("center"),
      area(),
      pos(-305, -305),
      color(150, 150, 150),
      scale(0.8),
    ]);
  }
  MyHover(x, 0.8, 0.8, rgb(240, 240, 240), rgb(150, 150, 150));

  x.onClick(() => {
    go("menu");
    Credits = null;
  });
  onKeyPress("escape", () => {
    go("menu");
    Credits = null;
  });
}