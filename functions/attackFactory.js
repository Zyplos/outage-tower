const menuFactory = require("./menuFactory");
module.exports = async (client, msg, action) => { // eslint-disable-line no-unused-vars

    if (action == "⚔") {

    } else if (action == "💼") {
        msg.channel.send("indev");
    } else if (action == "🏃") {
        msg.channel.send("indev");
    } else {
        menuFactory(client, msg);
    }

};