exports.run = (client, msg) => { // eslint-disable-line no-unused-vars
    //msg.reply("Hm?");
    msg.reply(client.coinFlip());
};

exports.config = {
    name: "debug",
    description: "Also flips a coin."
};