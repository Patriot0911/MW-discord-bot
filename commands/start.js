const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { activeServers, Dlist } = require('../globals');
const { getWordWithPart, sendWord } = require('../words_tools');

const GameTimer = async (channel, gameObj, times = 0) => {
    if(!gameObj.usedWords.length){
        --gameObj.skips;
    }
    if(times*5 >= 60 || gameObj.skips < 0){
        await channel.send({
            content: 'Game over!'
        });
        activeServers.delete(channel.guild.id);
        return;
    }
    gameObj.task = getWordWithPart(gameObj.leng);
    gameObj.usedWords = [];
    await sendWord(channel, gameObj);
    setTimeout(GameTimer, 10000, channel, gameObj, times+1);
}

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
}

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
        const gameObj = {
            skips: 3,
            channel: interaction.channel.id,
            leng: interaction.options.getString('leng'),
            usedWords: [],
            users: new Map().set(interaction.author.id, 0)
        };
        activeServers.set(interaction.guildId, gameObj);
        const emb_start = new EmbedBuilder()
        .setColor('#8d2edb')
        .setTitle('Magic Words')
        .setDescription('Гра у **Чарівні слова** розпочата!\nПочніть вводити слова на відповідну частинку слова, і отримуйте за це очки для перемоги.\n\n**Умови гри:**')
        .addFields(
            {
                name: 'Пропуски',
                value: '> Якщо ви не знаєте слова на цю частинку - то ви втрачаєте одне серце. З самого початку, ви маєте **[3]** таких серця, але якщо їх кількість дійде до нуля - ви програєте'
            },
            {
                name: 'Мова',
                value: '> Вводити слова можна лише тією мовою, якою було розпочато гру'
            },
            {
                name: 'Раунд',
                value: '> На кожне слово ви маєте **[5]** секунд. Якщо ніхто не встигає ввести хоч одне слово - серця гри зменшуються на одне'
            },
            {
                name: 'Тривалість',
                value: '> Загальна тривалість гри **[60]** секунд'
            }
        )
        .setTimestamp()
        .setFooter({
            text: 'Magic Words',
            iconURL: 'https://cdn.discordapp.com/avatars/1116428832354869290/67a529a6ed5a5b87e1154d7b7e45cdf1.png?size=2048'
        })
        await interaction.channel.send({
            embeds: [emb_start]
        });
        GameTimer(interaction.channel, gameObj);
        await interaction.editReply({
            content: '> **[UA]** Ви запустили гру\n> **[ENG]** You have launched the game'
        });
    }
}