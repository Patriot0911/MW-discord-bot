const fs = require('node:fs');
const { EmbedBuilder } = require('discord.js');
const { Dlist } = require('./globals');

const parseFile = (path) =>{
    const saveFile = fs.readFileSync(path, { 
        encoding: 'utf8',
        flag: 'r'
    });
    return JSON.parse(saveFile);
};

const getMainCfg = () => parseFile('./main_cfg.json');
const getTranslateData = (leng) => parseFile('./phrases.json')[leng];

const loadDictSettings = async() => {
    const dictFile = parseFile('./dictionaries.json');
    const keys = Object.keys(dictFile);
    for(let i = 0; i < keys.length; i++){
        if(Dlist.get(keys[i])){
            console.log('~~~~~~~~~~~~~~~~~~~~~\n\x1b[32m[UA]\x1b[0m\nЙде перезапис словників\n~~~~~~~~~~~~~~~~~~~~~');
            console.log('\x1b[32m[Eng]\x1b[0m\nRewriting dictionaries saves');
        }
        if(!fs.existsSync(dictFile[keys[i]])) continue;
        const data = await fs.promises.readFile(
            dictFile[keys[i]],
            'utf-8'
        );
        const info = data.split('\n').map(word => word.trim().toLowerCase());
        Dlist.set(keys[i], info);
    }
};

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
    const heartsmax = getMainCfg()['skips'];
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
    .setDescription(`${str}\n\nCurrently word part:\n   > **${gameObj.task.part}**`)
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
    loadDictSettings,
    getMainCfg,
    getTranslateData,
    getWordWithPart,
    sendWord
};