const { REST } = require('@discordjs/rest');
const { token, clientId, guildId } = require("./config.json");
const { Routes } = require('discord.js');
const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const fs = require("fs");

const blacklist = new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('Use to manage the blacklisted words')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addSubcommand(sub =>
        sub
            .setName('list')
            .setDescription('See all blacklisted words'))
    .addSubcommand(sub =>
        sub
            .setName('add')
            .setDescription('See all blacklisted words')
            .addStringOption(option => option.setName("word").setDescription("The word to add").setRequired(true)))
    .addSubcommand(sub =>
        sub
            .setName('remove')
            .setDescription('See all blacklisted words')
            .addStringOption(option => option.setName("word").setDescription("The word to remove").setRequired(true)));

const rest = new REST({ version: '10' }).setToken(token);

rest.put(
    Routes.applicationGuildCommands(clientId, guildId),
    {body:[blacklist.toJSON()]}
).then(res => console.log(`Deploy completed! Added ${res.length} commands`))


