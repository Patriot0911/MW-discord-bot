const fs = require('node:fs');
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


module.exports = {
    loadDictSettings,
    getMainCfg,
    getTranslateData
};