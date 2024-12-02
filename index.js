const fetch = require('node-fetch');
const express = require('express');
const fs = require('fs');
const app = express();

const port = process.env.PORT || 4000;
const embedWidth = 350;

let template = ['<a target="_top" href="HOST/URL"><img src="FLAG" class="image" alt="ALT"></a>',
        '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="FLAG" class="image" alt="ALT"></a><a class="expanded" target="_top" href="HOST/URL">NAME</a></div>',
        '<div style="display: flex;"><a target="_top" href="HOST/URL"><img src="FLAG" class="image" alt="ALT"></a><a class="expanded" target="_top" href="HOST/URL">NAME</a></div>'];

let results = {
    AR: {
        host: 'http://ar-backrooms-wiki.wikidot.com',
        title: 'الغرف الخلفية',
        width: 72.2,
        flag: 'https://cdn3.iconfinder.com/data/icons/142-mini-country-flags-16x16px/32/flag-saudi-arabia2x.png',
        alt: 'saudi arabia',
        name: ['AR', 'Arabic']
    },
    CN: {
        host: 'http://backrooms-wiki-cn.wikidot.com',
        title: 'The Backrooms中文维基',
        width: 79.2,
        flag: 'http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/china',
        alt: 'china',
        name: ['CN', 'Chinese']
    },
    DE: {
        host: 'http://de-backrooms-wiki.wikidot.com',
        title: 'Das Backrooms Wiki auf Deutsch',
        width: 72.2,
        flag: 'https://cdn3.iconfinder.com/data/icons/142-mini-country-flags-16x16px/32/flag-germany2x.png',
        alt: 'germany',
        name: ['DE', 'German']
    },
    EN: {
        host: 'https://backrooms-wiki.wikidot.com',
        title: 'The Backrooms',
        width: 79.2,
        flag: 'http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/uk',
        alt: 'uk',
        name: ['EN', 'English']
    },
    ES: {
        host: 'http://es-backrooms-wiki.wikidot.com',
        title: 'Wiki Backrooms Español',
        width: 79.2,
        flag: 'http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/spain',
        alt: 'spain',
        name: ['ES', 'Spanish']
    },
    FR: {
        host: 'http://fr-backrooms-wiki.wikidot.com',
        title: 'Backrooms Wiki',
        width: 72.2,
        flag: 'http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/france',
        alt: 'france',
        name: ['FR', 'French']
    },
    ID: {
        host: 'http://id-backrooms-wiki.wikidot.com',
        title: 'Backrooms Indonesia',
        width: 100.3,
        flag: 'http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/indonesia',
        alt: 'indonesia',
        name: ['ID', 'Indonesian']
    },
    IT: {
        host: 'http://it-backrooms-wiki.wikidot.com',
        title: 'Le Backrooms',
        width: 79.2,
        flag: 'http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/italy',
        alt: 'italy',
        name: ['IT', 'Italian']
    },
    PL: {
        host: 'http://pl-backrooms-wiki.wikidot.com',
        title: 'Backrooms Polska',
        width: 72.2,
        flag: 'http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/poland',
        alt: 'poland',
        name: ['PL', 'Polish']
    },
    PTBR: {
        host: 'http://pt-br-backrooms-wiki.wikidot.com',
        title: 'As Backrooms',
        width: 100.3,
        flag: 'http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/portugal',
        alt: 'portugal',
        name: ['PT-BR', 'Portuguese']
    },
    RU: {
        host: 'http://ru-backrooms-wiki.wikidot.com',
        title: 'База данных Backrooms',
        width: 79.2,
        flag: 'http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/russia',
        alt: 'russia',
        name: ['RU', 'Russian']
    },
    TH: {
        host: 'http://th-backrooms-wiki.wikidot.com',
        title: 'แบ็กรูมส์',
        width: 58.1,
        flag: 'http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/thai',
        alt: 'thai',
        name: ['TH', 'Thai']
    },
    TOK: {
        host: 'http://backrooms-tok-wiki.wikidot.com',
        title: 'tomo monsi',
        width: 58.1,
        flag: 'http://backrooms-sandbox-2.wikidot.com/local--files/zenzick-3/toki',
        alt: 'toki',
        name: ['TOK', 'Toka Pona']
    },
    VN: {
        host: 'http://backrooms-vn.wikidot.com',
        title: 'Backrooms Việt Nam',
        width: 100.3,
        flag: 'http://backrooms-sandbox-2.wikidot.com/local--files/zenzick/vietnam',
        alt: 'vietnam',
        name: ['VN', 'Vietnamese']
    },
}
htmlCode = fs.readFileSync('website.html').toString()
app.get('/', async (req, res) => {
    const url = req.query.url ?? '';
    const branch = req.query.branch ?? '';
    const color = req.query.color ?? '';
    let result = '';
    let count = 0;
    let branches = {};
    let wsmol = 20;
    let wmid = 0;
    let wbig = 0;

    for (const lang in results) {
        if (branch == lang.toLowerCase()) { continue }
        await CheckSite(results[lang].host, url, results[lang].title) ? (() => {
            branches[lang] = true;
            count++;
            wsmol += 20;
            wmid+=44;
            wbig+=results[lang].width;
        })() : branches[lang] = false;
    }

    for (const lang in branches) {
        if (branches[lang]) {
            result += template[wmid < embedWidth ? (wbig < embedWidth ? 2 : 1) : 0].replaceAll("HOST", results[lang].host).replaceAll("URL", url).replaceAll("FLAG", results[lang].flag).replaceAll("ALT", results[lang].alt).replaceAll("NAME", results[lang].name[(wbig < embedWidth ? 1 : 0)]);
        }
    }

    res.send(htmlCode.replaceAll("THING GOES HERE", result).replaceAll("COLOR", /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color) ? color : "#000000"));
});
app.listen(port, () => console.log(`Service Started at link: http://localhost:${port}`));

CheckSite = function(host, url, title) {
    return new Promise(async (resolve, reject) => {
        res = await (await fetch(`${host}/${url ?? ''}`)).text();
        console.log(host.split("//")[1].split(".wikidot")[0] + " " + res.split('<title>')[1]?.split('</title>')[0]);
        resolve(!res.includes(`<title>${title}</title>`));
    });
}
