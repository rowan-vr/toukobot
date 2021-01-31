const fs = require('fs')
module.exports = {
    name: 'blacklist',
    description: 'Manage the server blacklist',
    execute(client, message, args) {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.reply('You need the `ADMINISTRATOR` permission to use this command!');
        let blacklistedWords = fs.readFileSync('./blacklist.txt', 'utf8').split(',')
        if (args[0] == 'list') {
            message.author.send('Currently the following words are blaclisted: ' + blacklistedWords.join(", "))
            message.reply('The blacklist is send in your DMs!')
        } else if (args[0] == 'add') {
            args.shift()
            blacklistedWords.push(args.join(" "))
            fs.writeFileSync('./blacklist.txt', blacklistedWords.join(","), (err) => {
                if (err) message.channel.send(`An error occured! \`${err}\``)
            })
            message.channel.send(`Word successfully added to the blacklist!`)
        } else if (args[0] == 'remove') {
            args.shift()
            if (blacklistedWords.includes(args.join(" "))) {
                const index = blacklistedWords.indexOf(args.join(" "));
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