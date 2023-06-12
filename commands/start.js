const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { activeServers, Dlist } = require('../globals');
const { getTranslateData, getMainCfg, getWordWithPart, sendWord } = require('../tools');

const sendGameOver = async(channel, gameObj) => {
    const attach = new AttachmentBuilder('./assets/finish_img.png');
    const lengdata = getTranslateData(gameObj['leng']);
    const sortedUsers = new Map([...gameObj.users].sort((val1, val2) => val2[1] - val1[1]));
    const sorted_keys = [...sortedUsers.keys()];
    const arr = [];
    for(let i = 0; i < 10; i++){
        if(!sorted_keys[i]) break;
        arr.push({
            name: ' ',
            value: `<@${sorted_keys[i]}> [${sortedUsers.get(sorted_keys[i])} points]\n`
        });
    }
    const finish_embed = new EmbedBuilder()
    .setTitle(lengdata['title'])
    .setDescription(lengdata['gameOver'])
    .addFields(arr)
    .setColor(getMainCfg()['embeds_clr'])
    .setThumbnail('attachment://finish_img.png')
    .setTimestamp()
    .setFooter({
        text: 'Magic Words',
        iconURL: 'https://cdn.discordapp.com/avatars/1116428832354869290/67a529a6ed5a5b87e1154d7b7e45cdf1.png?size=2048'
    })    
    await channel.send({
        embeds: [finish_embed],
        files: [attach]
    });
};

const GameTimer = async (channel, gameObj, times = 0) => {
    if(!gameObj.usedWords.length){
        --gameObj.skips;
    }
    const cfg = getMainCfg();
    if(times*cfg.round_time >= cfg.rounds*cfg.round_time || gameObj.skips < 0){
        sendGameOver(channel, {...gameObj})
        activeServers.delete(channel.guild.id);
        activeServers.delete(`${channel.guild.id}_timer`);
        return;
    }
    gameObj.task = getWordWithPart(gameObj.leng);
    gameObj.usedWords = [];
    await sendWord(channel, gameObj);
    const game_timer = setTimeout(GameTimer, 10000, channel, gameObj, times+1);
    activeServers.set(`${channel.guild.id}_timer`, game_timer);
};

const lengChoices = () => {
    const arr = [ ];
    const list = [ ...Dlist.keys() ];
    for(let i = 0; i < list.length; i++){
        arr.push({
            name: list[i],
            value: list[i]
        });
    }
    return arr;
};

module.exports = {
    name:   'start',
    description:    'Begin game in cur. chat',
    options: [
        {
            name: 'leng',
            description: 'Leng to begin game with',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: lengChoices()
        }
    ],
    async command(client, interaction)
    {
        await interaction.deferReply({ephemeral: true});
        if(activeServers.get(interaction.guildId)){
            await interaction.editReply({
                content: '> **[UA]** Гра вже запущена \n> **[ENG]** The game is already running'
            });
            return;
        }
        
        const cfg = getMainCfg();
        const cfg_keys = Object.keys(cfg);
        const lengdata = getTranslateData(interaction.options.getString('leng'));
        const arr = [];
        const cond_keys = Object.keys(lengdata['conditions']);
        let value = '';
        for(let i = 0; i < cond_keys.length; i++){
            value = lengdata['conditions'][cond_keys[i]].value;
            for(l = 0; l < cfg_keys.length; l++){
                value = value.replaceAll('${' + cfg_keys[l] + '}', cfg[cfg_keys[l]]);
            }
            arr.push({
                name: cond_keys[i],
                value: value
            });
        }
        const gameObj = {
            skips: cfg['skips'],
            channel: interaction.channel.id,
            leng: interaction.options.getString('leng'),
            usedWords: [],
            users: new Map().set(interaction.author.id, 0)
        };
        activeServers.set(interaction.guildId, gameObj);
        const attach = new AttachmentBuilder('./assets/wand_img.png');
        const emb_start = new EmbedBuilder()
        .setColor(cfg['embeds_clr'])
        .setTitle(lengdata['title'])
        .setDescription(lengdata['description'])
        .addFields(arr)
        .setThumbnail('attachment://wand_img.png')
        .setTimestamp()
        .setFooter({
            text: 'Magic Words',
            iconURL: 'https://cdn.discordapp.com/avatars/1116428832354869290/67a529a6ed5a5b87e1154d7b7e45cdf1.png?size=2048'
        })
        await interaction.channel.send({
            embeds: [emb_start],
            files: [attach]
        });
        GameTimer(interaction.channel, gameObj);
        await interaction.editReply({
            content: '> **[UA]** Ви запустили гру\n> **[ENG]** You have launched the game'
        });
    }
}