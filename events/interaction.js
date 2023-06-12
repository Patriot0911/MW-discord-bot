const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async callback(interaction, client) 
	{
		if (interaction.isChatInputCommand()) 
		{
			const _args = [];
			if(!client.commands.get(interaction.commandName))
				return;
			if(interaction.options._group) 
				_args.push(interaction.options. _group);
			if(interaction.options._subcommand) 
				_args.push(interaction.options._subcommand);
			for (const it of interaction.options._hoistedOptions)
			{
				_args.push(it.value);
			}
			const CMD = await client.commands.get(interaction.commandName).command;
			const args = _args;
			interaction.author = interaction.user;
			interaction.channel = client.channels.cache.get(interaction.channelId);
			interaction.guild = interaction.member.guild;
			if(CMD) 
				CMD(client, interaction, args, _args)
			.catch();
			return;
		}		
	},
};