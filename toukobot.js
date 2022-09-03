const {Client, IntentsBitField} = require("discord.js");
const fs = require("fs");

const intents = new IntentsBitField();
intents.add(IntentsBitField.Flags.MessageContent, IntentsBitField.Flags.GuildMessages, IntentsBitField.Flags.Guilds, IntentsBitField.Flags.DirectMessages)
console.log(intents)
const client = new Client({intents: intents});
const config = require("./config.json");
const utils = require("./utils");
client.config = config;


client.on('interactionCreate', async interaction => {
    await interaction.deferReply({ephemeral: true});
    if (interaction.commandName === 'blacklist') {
        let blacklistedWords = fs.readFileSync('./blacklist.txt', 'utf8').split(',')
        if (interaction.options.getSubcommand() === 'list') {
            interaction.editReply('Currently the following words are blacklisted: ' + blacklistedWords.join(", "))
        } else if (interaction.options.getSubcommand() === 'add') {
            blacklistedWords.push(interaction.options.getString('word'))
            fs.writeFileSync('./blacklist.txt', blacklistedWords.join(","), (err) => {
                if (err) interaction.editReply(`An error occurred! \`${err}\``)
            })
            interaction.editReply(`Word successfully added to the blacklist!`)
        } else if (interaction.options.getSubcommand() === 'remove') {
            if (blacklistedWords.includes(interaction.options.getString('word'))) {
                const index = blacklistedWords.indexOf(interaction.options.getString('word'));
                if (index > -1) {
                    blacklistedWords.splice(index, 1);
                }
                fs.writeFileSync('./blacklist.txt', blacklistedWords.join(","), (err) => {
                    if (err) interaction.editReply(`An error occured! \`${err}\``)
                })
                interaction.editReply(`Word successfully removed from the blacklist!`)
            } else {
                interaction.editReply('The word you tried to remove is not in the blacklist.')
            }
        }
    }
});

client.on('messageCreate', async message => {
    if (message.content.startsWith("eval ```js") && message.author.id === config.ownerId){
        try {
            const code = message.content.substring(11,message.content.length-4);
            let evaled = eval(code);
            if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);

            message.reply('```xl\n'+utils.clean(evaled)+'\n```').then().catch(e => {
                message.reply(`\`ERROR\` \`\`\`xl\n${utils.clean(e)}\n\`\`\``);
            });
        } catch (err) {
            message.reply(`\`ERROR\` \`\`\`xl\n${utils.clean(err)}\n\`\`\``);
        }
    } else if (new RegExp(fs.readFileSync('./blacklist.txt', 'utf8').split(',').join("|")).test(message.content.toLowerCase())) {
        await message.delete();
    }
})


client.login(config.token);
