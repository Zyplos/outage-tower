exports.run = (client, msg) => {
    msg.channel.send("You can invite me to your server using this link:\nhttps://discordapp.com/api/oauth2/authorize?client_id=591388268835373107&permissions=0&scope=bot");
};

exports.config = {
    name: "invite",
    description: "Invite me to your server!"
};