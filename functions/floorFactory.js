module.exports = (client, msg) => {
    const menuFactory = require("./menuFactory"); //dont move this
    const gameInstance = client.games[msg.author.id];

    const Bug = {
        toString() {
            return this.user.tag;
        },
        user: {
            avatarURL: "https://i.imgur.com/gOwquBo.gif",
            tag: "Server Bug",
            presence: {
                status: "online"
            }
        },
        id: "137"
    };

    if (!gameInstance) {
        const owner = msg.guild.owner;

        const members = msg.guild.members.clone();

        members.delete(client.user.id);
        members.delete(msg.guild.ownerID);
        members.delete(msg.author.id);

        client.games[msg.author.id] = {
            msg,
            channels: client.getChannels(msg.guild).array(),
            currentChannel: 0,
            randomMember: client.getRandomMember(members),
            enemyHealth: 20,
            playerHealth: 25,
            maxPlayerHealth: 25,
            xp: 0,
            attackDamage: 2,
            items: ["Potion"],
            peopleRescued: [],
            owner,
            members,
            defenseStatus: 0,
            attackStatus: 0,
            enemyDefenseStatus: 0,
            enemyAttackStatus: 0,
            active: true,
        };

        return;
    }

    gameInstance.currentChannel++;

    if (gameInstance.randomMember.id !== "137") {
        gameInstance.peopleRescued.push(gameInstance.randomMember);
    }


    gameInstance.members.delete(gameInstance.randomMember.id);

    if (gameInstance.members.size > 0) {
        gameInstance.randomMember = client.getRandomMember(gameInstance.members);
    } else {
        gameInstance.randomMember = Bug;
    }

    gameInstance.enemyHealth = 20;

    const isFinalChannel = gameInstance.currentChannel == gameInstance.channels.length - 1;

    if (isFinalChannel) {
        gameInstance.randomMember = gameInstance.owner;
    }


    menuFactory(client, gameInstance.msg, {
        code: "selecting"
    });

};