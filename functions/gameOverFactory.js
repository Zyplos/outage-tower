module.exports = (client, msg) => {
    const gameInstance = client.games[msg.author.id];
    const isFinalChannel = gameInstance.currentChannel == gameInstance.channels.length - 1;
    const msgEmbed = {
        "embed": {
            "title": "❌ Game Over",
            "description": `Seems you gotta wait for **${msg.guild.name}** to come back online on its own.`,
            "color": 0x34363c,
            "footer": {
                "text": `${msg.guild.name} • ${gameInstance.channels.length} Floors • Got to ${isFinalChannel ? "Final Floor" : `Floor ${gameInstance.currentChannel + 1}`} (#${gameInstance.channels[gameInstance.currentChannel].name})`,
                "icon_url": msg.guild.iconURL
            },
            "fields": []
        }
    };

    if (gameInstance.peopleRescued.length > 0) {
        const fieldEntry = {
            name: "People Rescued",
            value: ""
        };
        for (const person of gameInstance.peopleRescued) {
            fieldEntry.value += `${person}\n`;
        }
        msgEmbed.embed.fields.push(fieldEntry);
    }

    msg.author.send(msgEmbed);
    delete client.games[msg.author.id];
};