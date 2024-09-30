let Statistics;
function display_stats() {
    if (!Statistics) {
        Statistics = add([
            rect(650, 650, { radius: 8 }),
            color(BLACK),
            opacity(0.9),
            pos(center()),
            area(),
            anchor("center"),
            outline(5),
            scale(phone ? 0.55 : 1),
        ]);
        Statistics.add([
            text(polish ? "Statystyki" : "Statistics"),
            anchor("center"),
            pos(0, -295),
        ]);
        my_github = Statistics.add([
            text("My github :)", { size: 20 }),
            anchor("center"),
            area(),
            color(LIGHT_GRAY),
            pos(240, 310),
        ]);
        const Total_food = +apples + +bananas + +tomatoes + +seeds;
        const list = [
            ["Total jumps", "Ilość skoków", number_of_jumps],
            ["Number of deaths", "Ilość śmierci", number_of_deaths],
            ["Number of reductions", "Ilość pomniejszeń", number_of_reductions],
            ["Total food", "Łączna ilość jedzenia", Total_food],
        ];

        // Process the list to create icons_Credits array
        const icons_Credits = list.map(item => {
            if (item.length === 1 && typeof item[0] === "string") {
                return item[0]; // Return "Iconic Panda" as is
            } else {
                if (polish) {
                    return item[1] + ": " + item[2];
                } else {
                    return item[0] + ": " + item[2];
                }
            }
        });
        let posY = -255; // Initial vertical position

        icons_Credits.forEach(Text => {
            const gap =
                Text == "Iconic Panda" || Text.includes(polish ? "czekolady" : "Chocolate")
                    ? 25
                    : 35;

            Statistics.add([
                text(Text, { size: 20 }),
                pos(0, posY),
                anchor("center"),
            ]);
            posY += gap; // Increment posY by 30 or 40 based on the text
        });

        x = Statistics.add([
            text("x", { size: 30 }),
            anchor("center"),
            area(),
            pos(305, -305),
            color(LIGHT_GRAY),
        ]);
    }
    MyHover(x, 1, 1, rgb(240, 240, 240), LIGHT_GRAY);
    MyHover(my_github, 1, 1, rgb(220, 220, 220), LIGHT_GRAY);

    my_github.onClick(() => window.open("https://github.com/Blaxolot"));

    x.onClick(() => {
        go("menu");
        Statistics = null;
    });
    onKeyPress("escape", () => {
        go("menu");
        Statistics = null;
    });
}
