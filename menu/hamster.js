let hamster_accessories = ["winter_hat", "cap", "glasses"];
const coolList = {
    winter_hat: { Scale: [0.9, 0.65], scale1: 1.925, scale2: 2 },
    cap: { Scale: [0.9, 0.7], scale1: 2, scale2: 2.05 },
    glasses: { Scale: [0.75, 0.7], Scale2: [0.8, 0.7], scale1: 2.85, scale2: 3.5 },
};
function initialize_hamster() {
    hamster_width = phone ? 250 : 285;
    Hamster_text_size = phone ? 0.01 : 80;

    add([
        text(MenuText, {
            size:
                Hamster_text_size -
                ((MenuText == "Game Over" || MenuText == "Koniec Gry") && !phone && 15),
        }),
        pos(width() / 2, height() / 2 - 230),
        anchor("center"),
    ]);
}

function AddHamster(white = "") {
    white !== "" ? (isWhite = "white_") : (isWhite = "");
    if (white !== "" && !getSprite(white + updateHamster())) {
        loadSprite(white + updateHamster(), `images/menu/${white + updateHamster()}.png`);
    }
    menuHamster = add([
        sprite(white + updateHamster(), { width: hamster_width }),
        pos(width() / 2, height() / 2 + ((winter_hat || cap) == true && 25)),
        anchor("center"),
    ]);

    hamster_accessories.forEach(item => {
        const { Scale, Scale2, scale1, scale2 } = coolList[item];
        if (eval(item) == true) {
            menuHamster.add([
                sprite(item, { width: hamster_width / 2 }),
                scale(vec2(currentHamster == "hamster" ? Scale : (Scale2 || Scale))),
                anchor("center"),
                pos(0, -hamster_width / (currentHamster == "hamster" ? scale1 : scale2)),
            ]);
        }
    });
}
