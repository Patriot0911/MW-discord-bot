const { activeServers } = require('../globals');
const { Events } = require('discord.js');
const { checkWord } = require('../words_tools');

const checkWord = (leng, word) => Dlist.get(leng).includes(word);

module.exports = {
	name: Events.MessageCreate,
	async callback(data, client) 
	{
        if(!activeServers.get(data.guildId) || data.content.length < 2)
            return;
        const gameInfo = activeServers.get(data.guildId);
        const word = data.content.split(' ', 1)[0];
        if(word.includes(gameInfo.task.part) && checkWord(gameInfo.leng, word)){
            if(gameInfo.usedWords.includes(word)){
                data.react('❌');
            }else{
                gameInfo.usedWords.push(word);
                const count = gameInfo.users.get(data.author.id) ? gameInfo.users.get(data.author.id) : 0;
                if(word === gameInfo.task.word){
                    gameInfo.users.set(data.author.id, count+4);
                    data.react('🔥');
                }else{
                    gameInfo.users.set(data.author.id, count+1);
                    data.react('✅');
                }
            }
        }
    }
}