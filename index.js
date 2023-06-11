const { Client } = require('discord.js');
const fs = require('node:fs');
const { token } = require('./secret.json');
const { g_intents } = require('./globals');
const client = new Client({
	intents: g_intents
});


(() => {
    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const filePath = `./events/${file}`;
        const event = require(filePath);
        client.on(event.name, (...args) => event.callback(...args, client));
    }
}) ();

client.login(token);