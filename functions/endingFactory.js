module.exports = (client, msg) => {
    const gameInstance = client.games[msg.author.id];
    const msgEmbed = {
        "embed": {
            "title": `🎉 Congrats, ${msg.author.username}!`,
            "description": `You got **${msg.guild.name}** back online! You take safe haven in the server while everyone else's is still offline.`,
            "color": 0x34363c,
            "footer": {
                "text": `${msg.guild.name} • ${gameInstance.channels.length} Floors`,
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
};