const fs = require('fs')
module.exports = {
    name: 'blacklist',
    description: 'Manage the server blacklist',
    execute(client, message, args) {
        if (!message.member.guild.me.hasPermission('MANAGE SERVER')) return message.reply('You need the `MANAGE SERVER` permission to use this command!');
        let blacklistedWords = fs.readFileSync('./blacklist.txt', 'utf8').split(',')
        if (args[0] == 'list') {
            message.author.send('Currently the following words are blaclisted: ' + blacklistedWords.join(", "))
            message.reply('The blacklist is send in your DMs!')
        } else if (args[0] == 'add') {
            blacklistedWords.push(args[1])
            fs.writeFileSync('./blacklist.txt', blacklistedWords.join(","), (err) => {
                if (err) message.channel.send(`An error occured! \`${err}\``)
            })
            message.channel.send(`Word successfully added to the blacklist!`)
        } else if (args[0] == 'remove') {
            if (blacklistedWords.includes(args[1])) {
                const index = blacklistedWords.indexOf(args[1]);
                if (index > -1) {
                    blacklistedWords.splice(index, 1);
                }
                fs.writeFileSync('./blacklist.txt', blacklistedWords.join(","), (err) => {
                    if (err) message.channel.send(`An error occured! \`${err}\``)
                })
                message.channel.send(`Word successfully removed from the blacklist!`)
            } else {
                message.reply('The word you tried to remove is not in the blacklist.')
            }
        }
    },
};