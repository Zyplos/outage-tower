const attackFactory = require("./attackFactory");
const floorFactory = require("./floorFactory");
const endingFactory = require("./endingFactory");
const itemFactory = require("./itemFactory");
const gameOverFactory = require("./gameOverFactory");
module.exports = async (client, msg, state) => {

    const gameInstance = client.games[msg.author.id];

    const isFinalChannel = gameInstance.currentChannel == gameInstance.channels.length - 1;

    if (isFinalChannel && state.code == "selecting") {
        state.code = "selectingFinal";
    }
    if (isFinalChannel && state.code == "enemyDefeat") {
        state.code = "enemyDefeatFinal";
    }

    const randomMember = gameInstance.randomMember;
    let statusMsg = `${randomMember} flipped a coin.`;

    switch (state.code) {
        case "selecting":
            statusMsg = `You encountered **Glitched ${randomMember}**! `;
            break;
        case "selectingFinal":
            statusMsg = `You've made it to the final floor.\nThe Server Owner has been waiting.\n\nYou encountered **Glitched ${randomMember}**!`;
            break;
        case "attacking":
            statusMsg = `You attacked ${randomMember}. `;
            break;
        case "item":
            statusMsg = `You used ${state.itemName}. `;
            break;
        case "enemyDefeat":
            statusMsg = `**Glitched ${randomMember}** fainted! `;
            break;
        case "enemyDefeatFinal":
            statusMsg = `**Glitched ${randomMember}** was defeated!`;
            break;
        default:
            statusMsg = `${randomMember} flipped two coins. `;
            break;
    }

    if (state.code == "attacking" && state.extra) {
        switch (state.extra) {
            case "nothing":
                statusMsg += `You dealt ${state.damageDone} damage.`;
                break;
            case "critical":
                statusMsg += `Critical hit! You dealt ${state.damageDone} damage.`;
                break;
            case "stun":
                statusMsg += "You stunned them for a turn!";
                break;
            case "miss":
                statusMsg += "They dodged your attack!";
                break;
            default:
                statusMsg += "You then flip a coin.";
                break;
        }
    }

    if (state.code == "item") {
        switch (state.itemName) {
            case "Potion":
                statusMsg += "You gained 8 hp.";
                break;
            case "Big Potion":
                statusMsg += "You gained 14 hp.";
                break;
            default:
                statusMsg += "You flip the bottlecap.";
                break;
        }
    }

    if (state.code == "enemyDefeat") {
        const itemsObtained = [];

        if (Math.random() >= 0.54) {
            itemsObtained.push("Big Potion");
        } else {
            itemsObtained.push("Potion");
        }

        for (let index = 0; index < 2; index++) {
            if (Math.random() > 0.35) {
                if (Math.random() >= 0.54) {
                    itemsObtained.push("Big Potion");
                } else {
                    itemsObtained.push("Potion");
                }
            }
        }

        if (gameInstance.items.length >= 10) {
            statusMsg += "Your bag was too full to receive items.";
        } else {
            statusMsg += `They dropped the following items: **\`${itemsObtained.toLocaleString()}\`**. You put it in your bag.`;
            gameInstance.items = gameInstance.items.concat(itemsObtained);
        }
    }

    gameInstance.defenseStatus = 0;
    gameInstance.attackStatus = 0;
    gameInstance.enemyDefenseStatus = 0;
    gameInstance.enemyAttackStatus = 0;

    /*
     0 = no change
     1 = down
     2 = up
    */

    const enemyPresence = gameInstance.randomMember.user.presence;

    // -- low priority
    if (randomMember.user.bot) {
        gameInstance.enemyDefenseStatus = 2;
        gameInstance.enemyAttackStatus = 1;
    }
    if (enemyPresence.status == "offline") {
        gameInstance.enemyDefenseStatus = 1;
    }
    if (enemyPresence.game && enemyPresence.game.name == "Minecraft") {
        gameInstance.attackStatus = 2;
    }
    if (gameInstance.channels[gameInstance.currentChannel].nsfw) {
        gameInstance.attackStatus = 2;
        gameInstance.enemyDefenseStatus = 1;
    }
    // -- to high priority

    let enemyBuffs = "";
    if (gameInstance.enemyAttackStatus == 1) {
        enemyBuffs += "• 🗡️ DOWN ";
    } else if (gameInstance.enemyAttackStatus == 2) {
        enemyBuffs += "• 🗡️ UP ";
    }
    if (gameInstance.enemyDefenseStatus == 1) {
        enemyBuffs += "• 🛡️ DOWN ";
    } else if (gameInstance.enemyDefenseStatus == 2) {
        enemyBuffs += "• 🛡️ UP ";
    }

    let playerBuffs = "";
    if (gameInstance.attackStatus == 1) {
        playerBuffs += "• 🗡️ DOWN ";
    } else if (gameInstance.attackStatus == 2) {
        playerBuffs += "• 🗡️ UP ";
    }
    if (gameInstance.defenseStatus == 1) {
        playerBuffs += "• 🛡️ DOWN ";
    } else if (gameInstance.defenseStatus == 2) {
        playerBuffs += "• 🛡️ UP ";
    }

    // 2nd line of text
    if (state.code == "attacking" || state.code == "item") {
        if (state.extra == "stun") {
            statusMsg += `\n\n${randomMember} couldn't attack!`;
        } else {
            let enemyAttackDamage = 2;
            if (gameInstance.enemyAttackStatus == 1) {
                enemyAttackDamage--;
            } else if (gameInstance.enemyAttackStatus == 2) {
                enemyAttackDamage++;
            }
            statusMsg += `\n\n${randomMember} attacked! They dealt ${enemyAttackDamage} damage.`;
            gameInstance.playerHealth -= enemyAttackDamage;
        }
    } else if (state.code == "enemyDefeat") {
        statusMsg += "\n\nTheir client was patched. They see a server pop up in their server list.\nYou can pass to the next floor now.";
    } else if (state.code == "enemyDefeatFinal") {
        statusMsg += "\n\nYou notice a server pop up in your server list...";
    }

    if (gameInstance.playerHealth <= 0) {
        statusMsg += "\n\nYou fainted.";
        gameInstance.playerHealth = 0;
    }

    const msgEmbed = {
        "embed": {
            "title": `${isFinalChannel ? "Final Floor" : `Floor ${gameInstance.currentChannel + 1}`} • #${gameInstance.channels[gameInstance.currentChannel].name}`,
            "description": statusMsg,
            "color": 0x34363c,
            "image": {
                "url": isFinalChannel ? "https://i.imgur.com/4IvPyuM.png" : "https://i.imgur.com/xQBpj7Y.png"
            },
            "author": {
                "icon_url": randomMember.user.avatarURL,
                "name": `${randomMember.user.tag} • ❤ ${gameInstance.enemyHealth} ${enemyBuffs}`
            },
            "footer": {
                "text": `${msg.author.tag} • ❤ ${gameInstance.playerHealth}/${gameInstance.maxPlayerHealth} ${playerBuffs}`,
                "icon_url": msg.author.avatarURL
            }
        }
    };
    const sentMessage = await msg.author.send(msgEmbed);

    if (gameInstance.playerHealth > 0) {
        if (state.code == "enemyDefeat") {
            await sentMessage.react("➡");
        } else if (state.code == "enemyDefeatFinal") {
            await sentMessage.react("🎉");
        } else {
            await sentMessage.react("⚔");
            await sentMessage.react("💼");
            // await sentMessage.react("🏃");
        }
    } else {
        await sentMessage.react("❌");
    }

    //

    const emojiFilter = ["⚔", "💼", "➡", "🎉", "❌"];

    const filter = (reaction, user) => emojiFilter.includes(reaction.emoji.name) && user.id === msg.author.id;
    const collector = sentMessage.createReactionCollector(filter, {
        time: 1000 * 300
    });
    collector.on("collect", r => {
        const collectedEmoji = r.emoji.name;
        if (!isFinalChannel && collectedEmoji == "🎉") return;
        collector.stop();
    });
    collector.on("end", collected => {
        if (!isFinalChannel) collected.sweep(collectedEmoji => collectedEmoji.emoji.name == "🎉");
        if (collected.size == 0) {
            gameInstance.active = false;
            return msg.author.send(`Game slept. You can resume by doing **${client.config.prefix}play**.`);
        }
        const action = collected.firstKey(1)[0];
        if (action == "➡") {
            floorFactory(client, msg);
        } else if (action == "💼") {
            itemFactory(client, msg);
        } else if (action == "🎉") {
            endingFactory(client, msg);
        } else if (action == "❌") {
            gameOverFactory(client, msg);
        } else {
            attackFactory(client, msg, action);
        }
    });
};