let Credits;
function display_info() {
  if (!Credits) {
    Credits = add([
      rect(polish ? 700 : 650, 650, { radius: 8 }),
      color(0, 0, 0),
      opacity(0.85),
      pos(center()),
      area(),
      anchor("center"),
      outline(5),
      "credits",
    ]);
    parameters = [anchor("center"), color(255, 255, 255), scale(polish ? 0.55 : 0.6)];
    Credits.add([
      text(polish ? "Autorzy ikon" : "Icon Credits"),
      anchor("center"),
      pos(0, -280),
      color(255, 255, 255),
    ]);

    const list = [
      ["Hamster", "Chomika", "Freepik"],
      ["Seed", "Nasionka", "Smashicons"],
      ["Apple", "Jabłka", "Smashicons"],
      ["Heart", "Serca", "Pixel perfect"],
      ["Chocolate Bar", "Tabliczki czekolady", "Iconic Panda"],
      ["- Flaticon"],
      ["Arrow", "Strzałki", "Freepik"],
      ["Banana", "Banana", "juicy_fish"],
      ["Cap", "Czapki", "juicy_fish"],
      ["Winter Hat", "Czapki Zimowej", "Freepik"],
      ["Tomato", "Pomidora", "VectorPortal"],
      ["Glasses", "Okularów", "Job Moon"]
    ];

    // Process the list to create icons_Credits array
    const icons_Credits = list.map(item => {
      if (item.length === 1 && typeof item[0] === 'string') {
        return item[0]; // Return "- Flaticon" as is
      } else {
        if (polish) {
          Test = "Ikona " + item[1] + " stworzona przez " + item[2];
        }
        else {
          Test = item[0] + " Icon created by " + item[2];
        }
        return Test + (item[0] !== "Chocolate Bar" ? " - Flaticon" : "");
      }
    });
    let posY = -230; // Initial vertical position

    icons_Credits.forEach(Text => {
      const gap = Text == "- Flaticon" || (Text.includes(polish ? "czekolady" : "Chocolate")) ? 30 : 40;
      Credits.add([text(Text), pos(0, posY), ...parameters]); // Add text
      posY += gap; // Increment posY by 30 or 40 based on the text
    });

    open_flaticon = Credits.add([
      text("Open Flaticon", { size: 30 }),
      anchor("center"),
      area(),
      color(rgb(21, 209, 198)),
      pos(polish ? 220 : 190, 300)
    ]);
    x = Credits.add([
      text("x", { size: 30 }),
      anchor("center"),
      area(),
      pos(polish ? -330 : -305, -305),
      color(150, 150, 150),
    ]);
  }
  MyHover(x, 1, 1, rgb(240, 240, 240), rgb(150, 150, 150));
  MyHover(open_flaticon, 1, 1, rgb(16, 156, 147), rgb(21, 209, 198));
  open_flaticon.onClick(() => window.open("https://www.flaticon.com/"));

  x.onClick(() => {
    go("menu");
    Credits = null;
  });
  onKeyPress("escape", () => {
    go("menu");
    Credits = null;
  });
}