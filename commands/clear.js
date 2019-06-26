exports.run = async (client, msg) => { // eslint-disable-line no-unused-vars
    var lines = process.stdout.getWindowSize()[1];
    for (var i = 0; i < lines; i++) {
        console.log("\r\n");
    }
};

exports.config = {
    name: "clear",
    description: "Flips 50 coins."
};