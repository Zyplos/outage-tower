module.exports = async (client, msg) => {
    const menuFactory = require("./menuFactory"); //dont move this
    const gameInstance = client.games[msg.author.id];
    const isFinalChannel = gameInstance.currentChannel == gameInstance.channels.length - 1;
    const msgEmbed = {
        "embed": {
            "title": `${isFinalChannel ? "Final Floor" : `Floor ${gameInstance.currentChannel + 1}`} • #${gameInstance.channels[gameInstance.currentChannel].name}`,
            "description": `You have ${gameInstance.items.length} item${gameInstance.items.length == 1 ? "" : "s"}.\n${gameInstance.items.length > 10 ? "Seems your bag is overflowing with items. Use older items to get to the newer ones." : ""}`,
            "color": 0x9a4e1c,
            "author": {
                "icon_url": "https://cdn.discordapp.com/attachments/593202742080569374/594134009173377037/briefcase.png",
                "name": "Your Bag"
            },
            "footer": {
                "text": `${msg.author.tag} • ❤ ${gameInstance.playerHealth}/${gameInstance.maxPlayerHealth} `,
                "icon_url": msg.author.avatarURL
            }
        }
    };

    for (let i = 0; i < gameInstance.items.length; i++) {
        const item = gameInstance.items[i];
        msgEmbed.embed.description += `${i + 1} • ${item}\n`;
    }

    const sentMessage = await msg.author.send(msgEmbed);
    await sentMessage.react("⬅");

    const emojiNumbers = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣", "7⃣", "8⃣", "9⃣", "🔟", "⬅"];

    for (const itemIndex in gameInstance.items) {
        await sentMessage.react(emojiNumbers[itemIndex]);
    }

    //

    const filter = (reaction, user) => emojiNumbers.includes(reaction.emoji.name) && user.id === msg.author.id;
    const collector = sentMessage.createReactionCollector(filter, {
        time: 1000 * 300
    });
    collector.on("collect", () => {
        collector.stop();
    });
    collector.on("end", async collected => {
        if (collected.size == 0) {
            gameInstance.active = false;
            return msg.author.send(`Game slept. You can resume by doing **${client.config.prefix}play**.`);
        }
        const emojiNumber = collected.firstKey(1)[0];

        if (emojiNumber == "⬅") {
            menuFactory(client, msg, {
                code: "selecting"
            });
            return;
        }

        const number = emojiNumbers.indexOf(emojiNumber);

        const itemUsed = gameInstance.items[number];
        gameInstance.items.splice(number, 1);

        let healed = 0;
        if (itemUsed == "Potion") {
            healed = 8;
        } else if (itemUsed == "Big Potion") {
            healed = 14;
        }

        gameInstance.playerHealth += healed;
        if (gameInstance.playerHealth > gameInstance.maxPlayerHealth) gameInstance.playerHealth = gameInstance.maxPlayerHealth;

        menuFactory(client, msg, {
            code: "item",
            itemName: itemUsed
        });
    });
};