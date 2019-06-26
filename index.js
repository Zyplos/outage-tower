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

client.games = {
    devspace: "You are being rate limited."
};

client.on("ready", () => {
    console.log("[LOG] Client ready.");
    client.user.setActivity("Family Guy • m;ping", {
            type: "WATCHING"
        })
        .then(() => client.user.setStatus("dnd"))
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

    //console.log(command);

    const exec = client.commands[command];

    if (!exec) return;

    exec.run(client, msg);
});

client.on("error", error => {
    console.error("DISCORD SENT AN ERROR ========================");
    console.log(error);
});

client.on("rateLimit", rateLimitInfo => {
    console.error("you are being rate limited. ========================");
    console.log(rateLimitInfo);
});

client.login(client.config.token);