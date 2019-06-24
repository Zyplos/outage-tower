const Discord = require("discord.js");
const client = new Discord.Client();
require("dotenv").config();
require("./functions")(client);

client.commands = {};

client.config = {
    prefix: "m;",
    token: process.env.token
};

client.on("ready", () => {
    console.log("[LOG] Client ready.");
    client.user.setActivity("your server • m;help", {
            type: "WATCHING"
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

    //console.log(command);

    const exec = client.commands[command];

    if (!exec) return;

    exec.run(client, msg);
});

client.login(client.config.token);