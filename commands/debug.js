const startGame = require("../functions/menuFactory");
exports.run = async (client, msg) => { // eslint-disable-line no-unused-vars
    const stage = "intro";

    const msgEmbed = {
        "embed": {
            "title": stage,
            "description": "Officia est non fugiat commodo minim dolore. Irure consectetur voluptate officia nostrud. Culpa commodo incididunt adipisicing laboris magna et sint Lorem duis. Dolore magna proident irure sit laboris eiusmod Lorem duis consequat duis dolor in. Esse et sunt sunt anim ullamco nostrud occaecat et nisi sit ut sit.",
            "color": 0x34363c,
            "footer": {
                "icon_url": "https://cdn.discordapp.com/attachments/463504889666994198/592955821802127360/hint.png",
                "text": "Use the reactions below to navigate the game."
            },
            // "thumbnail": {
            //   "url": ""
            // },
            "image": {
                "url": "https://cdn.discordapp.com/attachments/463504889666994198/592955139464101918/intro.png"
            },
            // "author": {
            //     "name": "Intro",
            //     "icon_url": "https://cdn.discordapp.com/attachments/463504889666994198/592955520147521548/num1.png"
            // }
        }
    };
    startGame(client, msg, {
        code: "selecting"
    });
    // const sentMessage = await msg.channel.send(msgEmbed);
    // await sentMessage.react("➡");

    // const filter = (reaction, user) => reaction.emoji.name === "➡" && user.id === msg.author.id;
    // const collector = sentMessage.createReactionCollector(filter, {
    //     time: 1000 * 300
    // });
    // collector.on("collect", async r => {
    //     msg.channel.send(`Collected ${r.emoji.name}`);
    //     await collector.stop();
    //     msg.channel.send("STOPPED, next");
    //     startGame(msg);
    // });
    // collector.on("end", collected => msg.channel.send(`Collected ${collected.size} items`));
};

exports.config = {
    name: "d",
    description: "You are being rate limited."
};