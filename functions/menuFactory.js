const attackFactory = require("./attackFactory");
module.exports = async (client, msg, state) => {

    const randomMember = client.getRandomMember(msg.guild);
    let statusMsg = `${randomMember} will never see this message.`;

    switch (state.code) {
        case "selecting":
            statusMsg = `You encountered ${randomMember}!`;
            break;
        case "attacking":
            statusMsg = `You attacked ${randomMember}.`;
            break;
        case "item":
            statusMsg = `You used ${state.itemName}`;
            break;
        default:
            statusMsg = `${randomMember} flipped a coin.`;
            break;
    }

    if (state.code == "attacking" && state.extra) {
        switch (state.extra) {
            case "critical":
                statusMsg += "Critical hit!";
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

    const msgEmbed = {
        "embed": {
            "title": "",
            "description": statusMsg,
            "color": 0x34363c,
            "image": {
                "url": "https://cdn.discordapp.com/attachments/463504889666994198/593213538370322452/battle.png"
            },
            "author": {
                "icon_url": randomMember.user.avatarURL,
                "name": "❤ 20"
            },
            "footer": {
                "text": "❤ 20 • " + state,
                "icon_url": msg.author.avatarURL
            }
        }
    };
    const sentMessage = await msg.channel.send(msgEmbed);
    await sentMessage.react("⚔");
    await sentMessage.react("💼");
    await sentMessage.react("🏃");

    //

    const emojiFilter = ["⚔", "💼", "🏃"];

    const filter = (reaction, user) => emojiFilter.includes(reaction.emoji.name) && user.id === msg.author.id;
    const collector = sentMessage.createReactionCollector(filter, {
        time: 1000 * 300
    });
    collector.on("collect", async r => {
        collector.stop();
    });
    collector.on("end", collected => {
        const action = collected.firstKey(1)[0];
        attackFactory(client, msg, action);
    });
};