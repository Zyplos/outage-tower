exports.run = async (client, msg) => {
    const msgEmbed = {
        "embed": {
            "title": "Welcome to Outage Tower!",
            "description": "You log into Discord and find it completely acting up! You notice a few bugs with the client and your server is experiencing an outage! Instead of waiting around for the developers to fix it, you embark on a journey to free your server.\n\nProgress through your server's text channels and free people on the way to save your server from the outage!\n\nDo **" + client.config.prefix + "start** to start. End your game at any time by reacting with ❌.",
            "color": 0x34363c,
            "footer": {
                "icon_url": "https://i.imgur.com/EpENbpw.png",
                "text": "Use the reactions below to navigate the game."
            },
            "image": {
                "url": "https://i.imgur.com/P1IDmmh.png"
            }
        }
    };

    msg.channel.send(msgEmbed);
};

exports.config = {
    name: "play",
    description: "Intro to Outage Tower"
};