const { EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { activeServers } = require('../globals');
const { getMainCfg, getTranslateData } = require('../tools');

module.exports = {
    name:   'end',
    description:    'End the game',
    async command(client, interaction)
    {
        await interaction.deferReply({ephemeral: true});
        const gameInfo = activeServers.get(interaction.guildId);
        if(gameInfo){
            const attach = new AttachmentBuilder('./assets/wand_img.png');
            const lengdata = getTranslateData(gameInfo['leng']);
            const em_stop = new EmbedBuilder()
            .setColor(getMainCfg()['embeds_clr'])
            .setTitle(lengdata['title'])
            .setDescription(lengdata['stop'].replace('${user}', `${interaction.author}`))
            .setThumbnail('attachment://wand_img.png')
            .setFooter({
                text: 'Magic Words',
                iconURL: 'https://cdn.discordapp.com/avatars/1116428832354869290/67a529a6ed5a5b87e1154d7b7e45cdf1.png?size=2048'
            })
            await interaction.channel.send({
                embeds: [em_stop],
                files: [attach]
            });
            activeServers.delete(interaction.guildId);
            clearTimeout(activeServers.get(`${interaction.guildId}_timer`));
            activeServers.delete(`${interaction.guildId}_timer`);

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