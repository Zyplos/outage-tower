const menuFactory = require("../functions/menuFactory");
const floorFactory = require("../functions/floorFactory");
exports.run = async (client, msg) => {
    const gameInstance = client.games[msg.author.id];
    if (gameInstance) {
        if (gameInstance.active) {
            return msg.author.send("You're already playing!");
        }
        msg.author.send("Seems you already have a game going on. Resuming.");
        gameInstance.active = true;
        menuFactory(client, gameInstance.msg, {
            code: "selecting"
        });
        return;
    }
    if (!msg.guild) {
        return msg.author.send("Sorry, you have to do this command in a server to start the game.");
    }
    floorFactory(client, msg);
    menuFactory(client, msg, {
        code: "selecting"
    });
};

exports.config = {
    name: "start",
    description: "Play Outage Tower!"
};