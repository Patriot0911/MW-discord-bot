const { Events, Collection, REST, Routes } = require('discord.js');
const { loadDictSettings } = require('../tools');
const fs = require('node:fs');
const { clientid, token } = require('../secret.json');
const rest = new REST().setToken(token);

const parseCommands = async (client) => {
    client.commands = new Collection();
    const commandFiles = fs.readdirSync('./commands');
    for (const file of commandFiles){
        const command = require(`../commands/${file}`);
        client.commands.set(command.name, command);
    }
    await rest.put(
        Routes.applicationCommands(clientid),
        { 
            body: client.commands 
        },
    );
};

module.exports = {
	name: Events.ClientReady,
	async callback(data, client) 
	{
        console.clear();
        await loadDictSettings();
        await parseCommands(client);
        console.log(`\x1b[32m[${client.user.username}]\x1b[0m Ready to battle!`);
    }
}