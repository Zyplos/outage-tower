/*
-------
todo: get my hands on that syntactic sugar everyone's raving about and dump it everywhere
-------
*/

const Discord = require("discord.js");
const client = new Discord.Client();
require("dotenv").config();
require("./functions")(client);

client.commands = {};

client.config = {
    prefix: "m;",
    token: process.env.token,
    botColor: 0xff3e3e
};

client.games = {};

client.on("ready", () => {
    console.log("===== Client ready.");
    client.user.setActivity("Outage Tower • m;play", {
            type: "PLAYING"
        })
        .then(() => client.user.setStatus("online"))
        .catch(console.error);

    const testFolder = "./commands/";
    const fs = require("fs");

    fs.readdirSync(testFolder).forEach(fileName => {
        const exec = require("./commands/" + fileName);
        client.commands[exec.config.name] = exec;
    });
});

client.on("message", msg => {
    if (msg.author.bot) return;
    if (msg.content.indexOf(client.config.prefix) !== 0) return;

    const args = msg.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const exec = client.commands[command];

    if (!exec) return;

    exec.run(client, msg, args);
});

client.on("error", error => {
    console.error("===== Discord error.");
    console.log(error);
});


client.on("guildCreate", guild => {
    guild.owner.send(`Hey! Someone added me to your **${guild}** server. I'm a Bot that plays a game using your server's channels. So, just a heads up, whatever hidden channels you give me permissions to view, your normal members will be alerted to their existance.`);
});

client.login(client.config.token);