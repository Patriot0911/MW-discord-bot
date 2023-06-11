const { EmbedBuilder } = require('discord.js');
const { Dlist } = require('./globals');

const getRandomPart = (word) => {
    const startIndex = Math.floor(Math.random()*(word.length - 3));
    const endIndex = startIndex + Math.floor(Math.random() * 2) + 2;
    return word.slice(startIndex, endIndex);
};

const getWordWithPart = (leng = 'eng') => {
    const contextword = Dlist.get(leng)[Math.floor(Math.random()*Dlist.get(leng).length)];
    return {
        word: contextword,
        part: getRandomPart(contextword)
    };
};

const sendWord = async(channel, gameObj) => {
    const heartsmax = 3;
    let str = '';
    for(let i = 0; i < heartsmax; i++){
        if(i <= gameObj.skips){
            str = str.concat(':purple_heart:');
            continue;
        }
        str = str.concat(':white_heart:');
    }
    const word_embed = new EmbedBuilder()
    .setTitle('Magic Words')
    .setColor('#8d2edb')
    .setDescription(`[${str}]\nCurrently word part:\n   > **${gameObj.task.part}**`)
    .setTimestamp()
    .setFooter({
        text: 'Magic Words',
        iconURL: 'https://cdn.discordapp.com/avatars/1116428832354869290/67a529a6ed5a5b87e1154d7b7e45cdf1.png?size=2048'
    })
    await channel.send({
        embeds: [word_embed]
    });
};

module.exports = {
    getWordWithPart,
    sendWord
};