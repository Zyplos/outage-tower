module.exports = async (client, msg, action) => { // eslint-disable-line no-unused-vars
    const menuFactory = require("./menuFactory.js"); // don't move this
    const gameInstance = client.games[msg.author.id];
    const extras = [{
            type: "nothing",
            chance: 60
        },
        {
            type: "critical",
            chance: 25
        },
        {
            type: "miss",
            chance: 5
        },
        {
            type: "stun",
            chance: 10
        }
    ];
    const extrasExpanded = [];
    for (const item of extras) {
        for (let i = 0; i < item.chance; i++) {
            extrasExpanded.push(item.type);
        }
    }

    const extra = extrasExpanded[Math.floor(Math.random() * extrasExpanded.length)];


    let damageDone = gameInstance.attackDamage;

    if (extra == "critical") damageDone += 2;
    if (gameInstance.attackStatus == 2) damageDone += 2;

    if (gameInstance.enemyDefenseStatus == 1) {
        damageDone += 1;
    } else if (gameInstance.enemyDefenseStatus == 2) {
        damageDone -= 1;
    }

    if (extra == "miss") damageDone *= 0;

    gameInstance.enemyHealth -= damageDone;

    if (gameInstance.enemyHealth <= 0) {
        gameInstance.enemyHealth = 0;
        menuFactory(client, msg, {
            code: "enemyDefeat",
            extra
        });
        return;
    }

    menuFactory(client, msg, {
        code: "attacking",
        extra,
        damageDone
    });
};