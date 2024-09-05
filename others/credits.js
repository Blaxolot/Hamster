let Credits;
function display_info() {
  if (!Credits) {
    Credits = add([
      rect(650, 650, { radius: 8 }),
      color(0, 0, 0),
      opacity(0.9),
      pos(center()),
      area(),
      anchor("center"),
      outline(5),
      scale(phone ? 0.55 : 1),
    ]);
    parameters = [anchor("center"), color(255, 255, 255), scale(0.5)];
    Credits.add([
      text(polish ? "Autorzy ikon - " : "Icon Credits - "),
      anchor("center"),
      pos(polish ? -100 : -110, -295),
      color(255, 255, 255),
    ]);
    flaticon = Credits.add([
      text("Flaticon"),
      anchor("center"),
      area(),
      color(rgb(21, 209, 198)),
      pos(150, -295),
    ]);
    my_github = Credits.add([
      text("My github :)", { size: 20 }),
      anchor("center"),
      area(),
      color(rgb(150, 150, 150)),
      pos(240, 310),
    ]);

    const list = [
      ["Hamster", "Chomika", "Freepik"],
      ["Seed", "Nasionka", "Smashicons"],
      ["Apple", "Jabłka", "Smashicons"],
      ["Heart", "Serca", "Pixel perfect"],
      ["Chocolate Bar", "Tabliczki czekolady", ""],
      ["Iconic Panda"],
      ["Arrow", "Strzałki", "Freepik"],
      ["Banana", "Banana", "juicy_fish"],
      ["Cap", "Czapki", "juicy_fish"],
      ["Winter Hat", "Czapki Zimowej", "Freepik"],
      ["Tomato", "Pomidora", "VectorPortal"],
      ["Glasses", "Okularów", "Job Moon"],
      ["Poland", "Polski", "Freepik"],
      ["USA", "USA", "Freepik"],
      ["Question Mark", "Znaku Zapytania", "Freepik"],
      ["Hamster2", "Chomika2", "Freepik"],
      ["Grave", "Grobu", "Freepik"], 
      ["Statistics", "Statystyk", "Freepik"],
    ];

    // Process the list to create icons_Credits array
    const icons_Credits = list.map(item => {
      if (item.length === 1 && typeof item[0] === "string") {
        return item[0]; // Return "Iconic Panda" as is
      } else {
        if (polish) {
          return "Ikona " + item[1] + " stworzona przez " + item[2];
        } else {
          return item[0] + " Icon created by " + item[2];
        }
      }
    });
    let posY = -255; // Initial vertical position

    icons_Credits.forEach(Text => {
      const gap =
        Text == "Iconic Panda" || Text.includes(polish ? "czekolady" : "Chocolate")
          ? 25
          : 30;
      Credits.add([text(Text), pos(0, posY), ...parameters]); // Add text
      posY += gap; // Increment posY by 30 or 40 based on the text
    });

    x = Credits.add([
      text("x", { size: 30 }),
      anchor("center"),
      area(),
      pos(-305, -305),
      color(150, 150, 150),
    ]);
  }
  MyHover(x, 1, 1, rgb(240, 240, 240), rgb(150, 150, 150));
  MyHover(flaticon, 1, 1, rgb(16, 156, 147), rgb(21, 209, 198));
  MyHover(my_github, 1, 1, rgb(220, 220, 220), rgb(150, 150, 150));

  flaticon.onClick(() => window.open("https://www.flaticon.com/"));
  my_github.onClick(() => window.open("https://github.com/Blaxolot"));

  x.onClick(() => {
    go("menu");
    Credits = null;
  });
  onKeyPress("escape", () => {
    go("menu");
    Credits = null;
  });
}
