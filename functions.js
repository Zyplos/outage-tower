module.exports = client => {
    client.coinFlip = () => {
        return "yes.";
    };

    client.getChannels = (guild) => {
        let channels = guild.channels;

        channels = channels.filter(channel => {
            return channel.type == "text";
        });

        channels = channels.sort((a, b) => {
            return b.position - a.position;
        });

        return channels;
    };

    client.getRandomMember = members => {
        return members.random(1)[0];
    };
};