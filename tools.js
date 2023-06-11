const fs = require('node:fs');
const { Dlist, clrs } = require('./globals');

const parseFile = (path) =>{
    const saveFile = fs.readFileSync(path, { 
        encoding: 'utf8',
        flag: 'r'
    });
    return JSON.parse(saveFile);
};

const replaceClr = (str, index = 0) => {
    index = str.indexOf('{', index)+1;
    if(index !== -1){
        const buffer = str.slice(index, str.indexOf('}'));
        if(clrs[buffer]){ 
            str = str.replace(`{${buffer}}`, clrs[buffer]).replace(`{/${buffer}}`, clrs['default']);
        }
    }
    return str.indexOf('{', index) !== -1 ? replaceClr(str, index) : str;
};

const clrlog = (str, log = 1) => {
    const clrstr = replaceClr(str);
    if(log) console.log(clrstr);
    return clrstr;
};

const loadDictSettings = async() => {
    const dictFile = parseFile('./dictionaries.json');
    const keys = Object.keys(dictFile);
    for(let i = 0; i < keys.length; i++){
        if(Dlist.get(keys[i])){
            clrlog('~~~~~~~~~~~~~~~~~~~~~\n{green}[UA]{/green}\nЙде перезапис словників\n~~~~~~~~~~~~~~~~~~~~~\n{green}[Eng]{/green}\nRewriting dictionaries saves');
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
    clrlog,
    parseFile,
    loadDictSettings
};