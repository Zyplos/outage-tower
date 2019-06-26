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
            //return a.position - b.position;
            return b.position - a.position;
        });


        channels.forEach(channel => {
            //console.log(`${channel.position} | ${channel.name}`);
            //console.log(channel);
        });

        return channels;
    };

    client.getRandomMember = guild => {
        const members = guild.members;
        members.sweep((member) => {
            return guild.ownerID == member.id || member.id == client.user.id;
        });
        return members.random(1)[0];
    };
};