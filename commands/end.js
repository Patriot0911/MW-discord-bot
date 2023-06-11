const { EmbedBuilder } = require('discord.js')
const { activeServers, Dlist } = require('../globals');


const lengChoices = () => {
    const arr = [ ];
    const list = [ ...Dlist.keys() ];
    for(let i = 0; i < list.length; i++){
        arr.push({
            name: list[i],
            value: i
        });
    }
    return arr;
}

module.exports = {
    name:   'end',
    description:    'End the game',
    async command(client, interaction)
    {
        await interaction.deferReply({ephemeral: true});
        if(activeServers.get(interaction.guildId)){
            const em_stop = new EmbedBuilder()
            .setColor('#8d2edb')
            .setTitle('Magic Words')
            .setDescription(`Гра була примусово зупинена *by* ${interaction.author}`)
            await interaction.channel.send({
                embeds: [em_stop]
            });
            activeServers.delete(interaction.guildId);
            await interaction.editReply({
                content: '> **[UA]** Ви примусово зупинили гру \n> **[ENG]** You have forcibly stopped the game'
            });
            return;
        }
        await interaction.editReply({
            content: '> **[UA]** Ви не можете зупинити гру, яка ще не почалася \n> **[ENG]** You can\'t stop a game that hasn\'t started yet'
        });
    }
}